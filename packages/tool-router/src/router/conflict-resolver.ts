import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolConflict, ConflictResolutionRule } from '../types/tool-router-types';

export interface ConflictResolverEvents {
  'conflict:detected': (conflict: ToolConflict) => void;
  'conflict:resolved': (conflict: ToolConflict) => void;
  'resolution:applied': (toolId: string, resolution: string) => void;
}

export class ConflictResolver extends EventEmitter<ConflictResolverEvents> {
  private resolutionRules: ConflictResolutionRule[] = [];
  private resolvedConflicts: Map<string, ToolConflict> = new Map();

  constructor() {
    super();
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    this.resolutionRules = [
      // Prefer builtin tools for file operations (highest priority)
      {
        pattern: 'read_file|write_file|edit_file|search_files|list_directory',
        resolution: 'prefer_builtin',
        priority: 10
      },
      
      // Prefer external tools for specialized functions
      {
        pattern: 'web_search|api_call|external_service',
        resolution: 'prefer_external',
        priority: 9
      },
      
      // Use performance-based resolution for computational tools
      {
        pattern: 'calculate|compute|analyze|process',
        resolution: 'performance_based',
        priority: 8
      },
      
      // Default to builtin for general tools
      {
        pattern: '.*',
        resolution: 'prefer_builtin',
        priority: 1
      }
    ];
    
    // Sort by priority (highest first)
    this.resolutionRules.sort((a, b) => b.priority - a.priority);
  }

  async resolveConflicts(tools: UnifiedTool[]): Promise<UnifiedTool[]> {
    const toolsByName = this.groupToolsByName(tools);
    const resolvedTools: UnifiedTool[] = [];
    
    for (const [toolName, toolGroup] of toolsByName.entries()) {
      if (toolGroup.length === 1) {
        // No conflict, add the tool directly
        resolvedTools.push(toolGroup[0]);
      } else {
        // Conflict detected, resolve it
        const resolved = await this.resolveToolConflict(toolName, toolGroup);
        resolvedTools.push(...resolved);
      }
    }
    
    return resolvedTools;
  }

  private groupToolsByName(tools: UnifiedTool[]): Map<string, UnifiedTool[]> {
    const grouped = new Map<string, UnifiedTool[]>();
    
    for (const tool of tools) {
      const normalizedName = this.normalizeToolName(tool.name);
      const existing = grouped.get(normalizedName) || [];
      existing.push(tool);
      grouped.set(normalizedName, existing);
    }
    
    return grouped;
  }

  private normalizeToolName(name: string): string {
    // Normalize tool names for conflict detection
    return name.toLowerCase()
      .replace(/[-_\s]/g, '') // Remove separators
      .replace(/tool$|command$|cmd$/, '') // Remove common suffixes
      .trim();
  }  private async resolveToolConflict(toolName: string, conflictingTools: UnifiedTool[]): Promise<UnifiedTool[]> {
    // Find applicable resolution rule
    const rule = this.findApplicableRule(toolName);
    
    // Create conflict metadata for all tools
    const conflicts: ToolConflict[] = conflictingTools.map((tool, index) => ({
      conflictingTool: conflictingTools.filter((_, i) => i !== index).map(t => t.id).join(','),
      resolution: rule.resolution,
      autoResolved: true
    }));
    
    // Apply the resolution strategy
    let resolvedTools: UnifiedTool[];
    
    switch (rule.resolution) {
      case 'prefer_builtin':
        resolvedTools = this.preferBuiltinResolution(conflictingTools);
        break;
        
      case 'prefer_external':
        resolvedTools = this.preferExternalResolution(conflictingTools);
        break;
        
      case 'performance_based':
        resolvedTools = this.performanceBasedResolution(conflictingTools);
        break;
        
      case 'user_choice':
        resolvedTools = this.userChoiceResolution(conflictingTools);
        break;
        
      default:
        resolvedTools = [conflictingTools[0]]; // Fallback to first tool
    }
    
    // Add conflict metadata to resolved tools
    for (const tool of resolvedTools) {
      tool.conflicts = conflicts;
    }
    
    // Emit events
    const conflict: ToolConflict = {
      conflictingTool: conflictingTools.map(t => t.id).join(','),
      resolution: rule.resolution,
      autoResolved: true
    };
    
    this.emit('conflict:detected', conflict);
    this.resolvedConflicts.set(toolName, conflict);
    this.emit('conflict:resolved', conflict);
    
    console.log(`Resolved conflict for ${toolName} using ${rule.resolution} strategy`);
    
    return resolvedTools;
  }

  private findApplicableRule(toolName: string): ConflictResolutionRule {
    for (const rule of this.resolutionRules) {
      if (new RegExp(rule.pattern, 'i').test(toolName)) {
        return rule;
      }
    }
    
    // Fallback to default rule
    return this.resolutionRules[this.resolutionRules.length - 1];
  }

  private preferBuiltinResolution(tools: UnifiedTool[]): UnifiedTool[] {
    const builtinTools = tools.filter(tool => tool.source.type === 'builtin');
    if (builtinTools.length > 0) {
      return [builtinTools[0]]; // Return first builtin tool
    }
    
    // If no builtin tools, return the best external tool
    return [this.selectBestTool(tools)];
  }

  private preferExternalResolution(tools: UnifiedTool[]): UnifiedTool[] {
    const externalTools = tools.filter(tool => tool.source.type === 'external');
    if (externalTools.length > 0) {
      return [this.selectBestTool(externalTools)];
    }
    
    // If no external tools, return the best builtin tool
    return [this.selectBestTool(tools)];
  }

  private performanceBasedResolution(tools: UnifiedTool[]): UnifiedTool[] {
    // Sort by performance metrics
    const sortedTools = tools.sort((a, b) => {
      const scoreA = this.calculatePerformanceScore(a);
      const scoreB = this.calculatePerformanceScore(b);
      return scoreB - scoreA;
    });
    
    return [sortedTools[0]];
  }

  private userChoiceResolution(tools: UnifiedTool[]): UnifiedTool[] {
    // For now, return all tools and let the user choose
    // In a real implementation, this would trigger a UI prompt
    return tools;
  }  private selectBestTool(tools: UnifiedTool[]): UnifiedTool {
    if (tools.length === 1) {
      return tools[0];
    }
    
    // Score tools based on multiple factors
    const scoredTools = tools.map(tool => ({
      tool,
      score: this.calculateOverallScore(tool)
    }));
    
    // Sort by score (highest first)
    scoredTools.sort((a, b) => b.score - a.score);
    
    return scoredTools[0].tool;
  }

  private calculatePerformanceScore(tool: UnifiedTool): number {
    let score = 0;
    
    // Success rate (40% weight)
    score += (tool.successRate / 100) * 0.4;
    
    // Response time (30% weight) - lower is better
    const normalizedResponseTime = Math.max(0, 1 - (tool.averageExecutionTime / 10000)); // Normalize to 0-1
    score += normalizedResponseTime * 0.3;
    
    // Source health (20% weight)
    const healthScore = this.getSourceHealthScore(tool.source.health.status);
    score += healthScore * 0.2;
    
    // Usage count (10% weight)
    const usageScore = Math.min(tool.usageCount / 100, 1); // Cap at 100 uses for normalization
    score += usageScore * 0.1;
    
    return score;
  }

  private calculateOverallScore(tool: UnifiedTool): number {
    let score = 0;
    
    // Performance score (50% weight)
    score += this.calculatePerformanceScore(tool) * 0.5;
    
    // Availability (25% weight)
    const availabilityScore = tool.availability.status === 'available' ? 1 : 0;
    score += availabilityScore * 0.25;
    
    // User preference weight (15% weight)
    score += tool.preferenceWeight * 0.15;
    
    // User rating (10% weight)
    const ratingScore = (tool.userRating || 0) / 5; // Normalize to 0-1
    score += ratingScore * 0.1;
    
    return score;
  }

  private getSourceHealthScore(status: string): number {
    switch (status) {
      case 'healthy': return 1.0;
      case 'degraded': return 0.7;
      case 'unhealthy': return 0.3;
      case 'offline': return 0.0;
      default: return 0.5;
    }
  }

  addResolutionRule(rule: ConflictResolutionRule): void {
    this.resolutionRules.push(rule);
    this.resolutionRules.sort((a, b) => b.priority - a.priority);
  }

  removeResolutionRule(pattern: string): boolean {
    const index = this.resolutionRules.findIndex(rule => rule.pattern === pattern);
    if (index !== -1) {
      this.resolutionRules.splice(index, 1);
      return true;
    }
    return false;
  }

  getResolvedConflicts(): Map<string, ToolConflict> {
    return new Map(this.resolvedConflicts);
  }

  clearResolvedConflicts(): void {
    this.resolvedConflicts.clear();
  }
}