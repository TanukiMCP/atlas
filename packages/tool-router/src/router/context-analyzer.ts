import { UnifiedTool, ToolExecutionContext, ContextRelevance } from '../types/tool-router-types';

export interface ContextScore {
  toolId: string;
  score: number;
  factors: ContextFactor[];
}

export interface ContextFactor {
  type: 'project' | 'subject' | 'file' | 'keyword' | 'history' | 'temporal';
  name: string;
  score: number;
  weight: number;
  description: string;
}

export class ContextAnalyzer {
  private contextKeywords: Map<string, string[]> = new Map();
  private fileTypeMapping: Map<string, string[]> = new Map();
  private subjectModeMapping: Map<string, string[]> = new Map();

  constructor() {
    this.initializeContextMappings();
  }

  private initializeContextMappings(): void {
    // File type to tool category mapping
    this.fileTypeMapping.set('programming', [
      'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt'
    ]);
    this.fileTypeMapping.set('web', ['html', 'css', 'scss', 'less', 'vue', 'svelte']);
    this.fileTypeMapping.set('data', ['json', 'xml', 'yaml', 'yml', 'csv', 'sql']);
    this.fileTypeMapping.set('documentation', ['md', 'rst', 'txt', 'tex']);
    this.fileTypeMapping.set('configuration', ['config', 'ini', 'toml', 'env', 'properties']);

    // Subject mode to tool categories
    this.subjectModeMapping.set('mathematics', ['mathematics', 'science', 'data-analysis']);
    this.subjectModeMapping.set('programming', ['programming', 'web', 'data', 'files']);
    this.subjectModeMapping.set('science', ['science', 'mathematics', 'data-analysis']);
    this.subjectModeMapping.set('languages', ['languages', 'files', 'web']);
    this.subjectModeMapping.set('research', ['web', 'files', 'data-analysis']);
    this.subjectModeMapping.set('general', ['files', 'web', 'general']);

    // Context keywords for different domains
    this.contextKeywords.set('mathematics', [
      'equation', 'formula', 'calculate', 'solve', 'plot', 'graph', 'statistics', 'algebra', 'calculus'
    ]);
    this.contextKeywords.set('programming', [
      'code', 'function', 'class', 'variable', 'debug', 'test', 'compile', 'deploy', 'refactor'
    ]);
    this.contextKeywords.set('science', [
      'experiment', 'hypothesis', 'data', 'analysis', 'research', 'study', 'method', 'results'
    ]);
    this.contextKeywords.set('web', [
      'website', 'api', 'request', 'response', 'http', 'url', 'endpoint', 'service'
    ]);
  }

  async analyzeRelevance(tools: UnifiedTool[], context: ToolExecutionContext): Promise<Map<string, number>> {
    const scores = new Map<string, number>();
    
    for (const tool of tools) {
      const score = await this.calculateToolRelevance(tool, context);
      scores.set(tool.id, score);
    }
    
    return scores;
  }

  async calculateRelevance(tool: UnifiedTool): Promise<ContextRelevance> {
    const projectTypes = this.inferProjectTypes(tool);
    const subjectModes = this.inferSubjectModes(tool);
    const fileTypes = this.inferFileTypes(tool);
    const contextKeywords = this.extractContextKeywords(tool);
    
    return {
      projectType: projectTypes,
      subjectModes: subjectModes,
      fileTypes: fileTypes,
      contextKeywords: contextKeywords,
      score: 0.5 // Default baseline score
    };
  }

  async isToolRelevant(tool: UnifiedTool, context: ToolExecutionContext): Promise<boolean> {
    const relevanceScore = await this.calculateToolRelevance(tool, context);
    return relevanceScore > 0.3; // Threshold for relevance
  }  private async calculateToolRelevance(tool: UnifiedTool, context: ToolExecutionContext): Promise<number> {
    const factors: ContextFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // Subject mode relevance (30% weight)
    const subjectScore = this.calculateSubjectModeRelevance(tool, context.subjectMode);
    factors.push({
      type: 'subject',
      name: 'subject_mode',
      score: subjectScore,
      weight: 0.3,
      description: `Relevance to ${context.subjectMode} mode`
    });
    totalScore += subjectScore * 0.3;
    totalWeight += 0.3;

    // Project context relevance (25% weight)
    if (context.projectContext) {
      const projectScore = this.calculateProjectRelevance(tool, context.projectContext);
      factors.push({
        type: 'project',
        name: 'project_type',
        score: projectScore,
        weight: 0.25,
        description: `Relevance to ${context.projectContext.type} project`
      });
      totalScore += projectScore * 0.25;
      totalWeight += 0.25;
    }

    // File context relevance (20% weight)
    if (context.projectContext?.currentFile) {
      const fileScore = this.calculateFileRelevance(tool, context.projectContext.currentFile);
      factors.push({
        type: 'file',
        name: 'current_file',
        score: fileScore,
        weight: 0.2,
        description: `Relevance to current file type`
      });
      totalScore += fileScore * 0.2;
      totalWeight += 0.2;
    }

    // Usage history relevance (15% weight)
    const historyScore = this.calculateHistoryRelevance(tool, context);
    factors.push({
      type: 'history',
      name: 'usage_history',
      score: historyScore,
      weight: 0.15,
      description: 'Based on recent usage patterns'
    });
    totalScore += historyScore * 0.15;
    totalWeight += 0.15;

    // Temporal relevance (10% weight)
    const temporalScore = this.calculateTemporalRelevance(tool);
    factors.push({
      type: 'temporal',
      name: 'temporal',
      score: temporalScore,
      weight: 0.1,
      description: 'Based on time-based usage patterns'
    });
    totalScore += temporalScore * 0.1;
    totalWeight += 0.1;

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateSubjectModeRelevance(tool: UnifiedTool, subjectMode: string): number {
    const relevantCategories = this.subjectModeMapping.get(subjectMode) || [];
    
    // Direct category match
    if (relevantCategories.includes(tool.category.id)) {
      return 1.0;
    }
    
    // Subject mode in tool's context relevance
    if (tool.contextRelevance.subjectModes.includes(subjectMode)) {
      return 0.8;
    }
    
    // Keyword match
    const subjectKeywords = this.contextKeywords.get(subjectMode) || [];
    const toolText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
    const keywordMatches = subjectKeywords.filter(keyword => toolText.includes(keyword)).length;
    
    if (keywordMatches > 0) {
      return Math.min(keywordMatches / subjectKeywords.length * 0.6, 0.6);
    }
    
    return 0.1; // Minimal baseline relevance
  }  private calculateProjectRelevance(tool: UnifiedTool, projectContext: any): number {
    // Project type match
    if (tool.contextRelevance.projectType.includes(projectContext.type)) {
      return 1.0;
    }
    
    // Language/framework match
    if (projectContext.language) {
      const toolText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
      if (toolText.includes(projectContext.language.toLowerCase())) {
        return 0.8;
      }
    }
    
    // Framework match
    if (projectContext.framework) {
      const toolText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
      if (toolText.includes(projectContext.framework.toLowerCase())) {
        return 0.7;
      }
    }
    
    // Dependencies match
    if (projectContext.dependencies?.length) {
      const toolText = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
      const dependencyMatches = projectContext.dependencies.filter(dep => 
        toolText.includes(dep.toLowerCase())
      ).length;
      
      if (dependencyMatches > 0) {
        return Math.min(dependencyMatches / projectContext.dependencies.length * 0.6, 0.6);
      }
    }
    
    return 0.2;
  }

  private calculateFileRelevance(tool: UnifiedTool, currentFile: string): number {
    const fileExtension = currentFile.split('.').pop()?.toLowerCase() || '';
    
    // Direct file type match
    if (tool.contextRelevance.fileTypes.includes(fileExtension)) {
      return 1.0;
    }
    
    // Category-based file type match
    for (const [category, extensions] of this.fileTypeMapping.entries()) {
      if (extensions.includes(fileExtension) && tool.category.id === category) {
        return 0.8;
      }
    }
    
    // Tool supports this file type
    const toolText = `${tool.name} ${tool.description}`.toLowerCase();
    if (toolText.includes(fileExtension) || toolText.includes('file')) {
      return 0.5;
    }
    
    return 0.1;
  }

  private calculateHistoryRelevance(tool: UnifiedTool, context: ToolExecutionContext): number {
    // Recently used in this session
    if (tool.lastUsed) {
      const hoursSinceUsed = (Date.now() - tool.lastUsed.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceUsed < 1) return 1.0;
      if (hoursSinceUsed < 6) return 0.8;
      if (hoursSinceUsed < 24) return 0.6;
      if (hoursSinceUsed < 168) return 0.4; // 1 week
    }
    
    // High usage count indicates general usefulness
    if (tool.usageCount > 50) return 0.7;
    if (tool.usageCount > 10) return 0.5;
    if (tool.usageCount > 0) return 0.3;
    
    return 0.1;
  }

  private calculateTemporalRelevance(tool: UnifiedTool): number {
    const hour = new Date().getHours();
    
    // Some tools might be more relevant at certain times
    // This is a simplified implementation - could be more sophisticated
    
    // Development tools more relevant during working hours
    if (tool.category.id === 'programming') {
      if (hour >= 9 && hour <= 17) return 1.0;
      if (hour >= 19 && hour <= 23) return 0.8;
      return 0.5;
    }
    
    // Web/research tools might be used more during day
    if (tool.category.id === 'web' || tool.category.id === 'research') {
      if (hour >= 8 && hour <= 20) return 1.0;
      return 0.7;
    }
    
    // Default neutral temporal relevance
    return 0.8;
  }

  private inferProjectTypes(tool: UnifiedTool): string[] {
    const types: string[] = [];
    const text = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase();
    
    if (text.match(/web|html|css|javascript|react|vue|angular/)) types.push('web');
    if (text.match(/mobile|android|ios|flutter|react.native/)) types.push('mobile');
    if (text.match(/desktop|electron|tauri|qt/)) types.push('desktop');
    if (text.match(/api|backend|server|database/)) types.push('backend');
    if (text.match(/data|analytics|science|ml|ai/)) types.push('data-science');
    if (text.match(/game|unity|unreal|godot/)) types.push('game');
    
    return types;
  }

  private inferSubjectModes(tool: UnifiedTool): string[] {
    return [tool.category.id];
  }

  private inferFileTypes(tool: UnifiedTool): string[] {
    const types: string[] = [];
    const text = `${tool.name} ${tool.description}`.toLowerCase();
    
    for (const [category, extensions] of this.fileTypeMapping.entries()) {
      if (text.includes(category) || extensions.some(ext => text.includes(ext))) {
        types.push(...extensions);
      }
    }
    
    return [...new Set(types)];
  }

  private extractContextKeywords(tool: UnifiedTool): string[] {
    return tool.tags.slice(0, 10); // Limit to first 10 tags as keywords
  }
}