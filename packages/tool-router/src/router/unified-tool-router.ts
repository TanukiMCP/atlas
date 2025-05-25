import { EventEmitter } from 'eventemitter3';
import { ToolDiscovery } from './tool-discovery';
import { ContextAnalyzer } from './context-analyzer';
import { ConflictResolver } from './conflict-resolver';
import { ExecutionRouter } from './execution-router';
import { FuzzySearch } from '../search/fuzzy-search';
import { ToolIndexer } from '../search/tool-indexer';
import { UserPreferences } from '../preferences/user-preferences';
import { PerformanceMonitor } from '../execution/performance-monitor';
import { 
  UnifiedTool, 
  ToolExecutionContext, 
  ToolExecutionResult, 
  ToolConflict,
  ToolCategory,
  SearchOptions,
  ToolPreview,
  DiscoveredTool,
  RouteDecision
} from '../types/tool-router-types';

export interface ToolRouterEvents {
  'tools:updated': (tools: UnifiedTool[]) => void;
  'tool:executed': (result: ToolExecutionResult) => void;
  'tool:failed': (toolId: string, error: Error) => void;
  'conflict:detected': (conflict: ToolConflict) => void;
  'conflict:resolved': (conflict: ToolConflict) => void;
  'fallback:triggered': (originalTool: string, fallbackTool: string) => void;
  'performance:degraded': (toolId: string, metrics: any) => void;
  'source:unavailable': (sourceId: string) => void;
  'health:changed': (sourceId: string, status: string) => void;
}

export class UnifiedToolRouter extends EventEmitter<ToolRouterEvents> {
  private toolDiscovery: ToolDiscovery;
  private contextAnalyzer: ContextAnalyzer;
  private conflictResolver: ConflictResolver;
  private executionRouter: ExecutionRouter;
  private fuzzySearch: FuzzySearch;
  private toolIndexer: ToolIndexer;
  private userPreferences: UserPreferences;
  private performanceMonitor: PerformanceMonitor;
  
  private unifiedTools: Map<string, UnifiedTool> = new Map();
  private toolsByCategory: Map<string, UnifiedTool[]> = new Map();
  private lastUpdate: Date = new Date();
  private updateInterval?: NodeJS.Timeout;
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.initializeComponents();
    this.setupEventHandlers();
  }  private initializeComponents(): void {
    this.toolDiscovery = new ToolDiscovery();
    this.contextAnalyzer = new ContextAnalyzer();
    this.conflictResolver = new ConflictResolver();
    this.executionRouter = new ExecutionRouter();
    this.fuzzySearch = new FuzzySearch();
    this.toolIndexer = new ToolIndexer();
    this.userPreferences = new UserPreferences();
    this.performanceMonitor = new PerformanceMonitor();
  }

  private setupEventHandlers(): void {
    this.toolDiscovery.on('tools:discovered', this.handleToolsDiscovered.bind(this));
    this.toolDiscovery.on('source:unavailable', this.handleSourceUnavailable.bind(this));
    this.conflictResolver.on('conflict:detected', this.handleConflictDetected.bind(this));
    this.executionRouter.on('fallback:triggered', this.handleFallbackTriggered.bind(this));
    this.performanceMonitor.on('performance:degraded', this.handlePerformanceDegraded.bind(this));
  }

  async initializeRouter(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing Unified Tool Router...');
    
    try {
      // Step 1: Load user preferences
      await this.userPreferences.load();
      
      // Step 2: Discover all available tools
      await this.refreshToolCatalog();
      
      // Step 3: Initialize search index
      await this.rebuildSearchIndex();
      
      // Step 4: Start periodic updates
      this.startPeriodicUpdates();
      
      this.isInitialized = true;
      console.log(`Unified Tool Router initialized with ${this.unifiedTools.size} tools`);
      
    } catch (error) {
      console.error('Failed to initialize Unified Tool Router:', error);
      throw error;
    }
  }

  async refreshToolCatalog(): Promise<void> {
    try {
      // Discover tools from all sources
      const discoveredTools = await this.toolDiscovery.discoverAllTools();
      
      // Process and unify tools
      const unifiedTools = await this.processDiscoveredTools(discoveredTools);
      
      // Resolve conflicts
      const resolvedTools = await this.conflictResolver.resolveConflicts(unifiedTools);
      
      // Update internal maps
      this.updateToolMaps(resolvedTools);
      
      // Emit update event
      this.emit('tools:updated', Array.from(this.unifiedTools.values()));
      
      this.lastUpdate = new Date();
      
    } catch (error) {
      console.error('Failed to refresh tool catalog:', error);
      throw error;
    }
  }  async searchTools(
    query: string, 
    context?: ToolExecutionContext,
    options?: SearchOptions
  ): Promise<UnifiedTool[]> {
    
    if (!this.isInitialized) {
      await this.initializeRouter();
    }

    // Step 1: Basic fuzzy search
    let results = await this.fuzzySearch.search(query, Array.from(this.unifiedTools.values()));
    
    // Step 2: Apply context filtering
    if (context) {
      const contextScores = await this.contextAnalyzer.analyzeRelevance(results, context);
      results = this.applyContextScoring(results, contextScores);
    }
    
    // Step 3: Apply user preferences
    results = await this.applyUserPreferences(results, context?.userPreferences);
    
    // Step 4: Filter by availability
    if (!options?.includeUnavailable) {
      results = results.filter(tool => tool.availability.status === 'available');
    }
    
    // Step 5: Apply category and source filters
    if (options?.categoryFilter?.length) {
      results = results.filter(tool => options.categoryFilter!.includes(tool.category.id));
    }
    
    if (options?.sourceFilter?.length) {
      results = results.filter(tool => options.sourceFilter!.includes(tool.source.id));
    }
    
    // Step 6: Sort by relevance and quality
    results.sort((a, b) => this.calculateToolScore(b, query, context) - this.calculateToolScore(a, query, context));
    
    // Step 7: Apply score filter and limits
    if (options?.minScore) {
      results = results.filter(tool => this.calculateToolScore(tool, query, context) >= options.minScore!);
    }
    
    if (options?.maxResults) {
      results = results.slice(0, options.maxResults);
    }
    
    return results;
  }

  async executeTool(
    toolId: string,
    parameters: any,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    
    const tool = this.unifiedTools.get(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }
    
    try {
      // Step 1: Create route decision
      const decision = await this.createRouteDecision(tool, context);
      
      // Step 2: Validate parameters
      const validatedParams = await this.validateParameters(decision.selectedTool, parameters);
      
      // Step 3: Check tool availability
      await this.checkToolAvailability(decision.selectedTool);
      
      // Step 4: Execute through appropriate router
      const startTime = Date.now();
      const result = await this.executionRouter.execute(decision.selectedTool, validatedParams, context);
      const executionTime = Date.now() - startTime;
      
      // Step 5: Process result
      const processedResult = await this.processExecutionResult(result, decision.selectedTool, executionTime);
      
      // Step 6: Update tool metrics
      await this.updateToolMetrics(decision.selectedTool, processedResult, executionTime);
      
      // Step 7: Record usage
      await this.recordToolUsage(decision.selectedTool, context);
      
      this.emit('tool:executed', processedResult);
      return processedResult;
      
    } catch (error) {
      // Handle execution errors with fallback mechanisms
      return await this.handleExecutionError(tool, parameters, context, error as Error);
    }
  }  async getToolsByCategory(categoryId: string, context?: ToolExecutionContext): Promise<UnifiedTool[]> {
    let tools = this.toolsByCategory.get(categoryId) || [];
    
    if (context) {
      const contextScores = await this.contextAnalyzer.analyzeRelevance(tools, context);
      tools = this.applyContextScoring(tools, contextScores);
    }
    
    return tools.sort((a, b) => b.preferenceWeight - a.preferenceWeight);
  }

  async getAvailableCategories(context?: ToolExecutionContext): Promise<ToolCategory[]> {
    const categories = new Map<string, ToolCategory>();
    
    for (const tool of this.unifiedTools.values()) {
      if (tool.availability.status === 'available' || tool.availability.status === 'busy') {
        // Apply context filtering
        if (context) {
          const isRelevant = await this.contextAnalyzer.isToolRelevant(tool, context);
          if (!isRelevant) continue;
        }
        
        categories.set(tool.category.id, tool.category);
      }
    }
    
    return Array.from(categories.values())
      .sort((a, b) => a.priority - b.priority);
  }

  async getToolPreview(toolId: string): Promise<ToolPreview> {
    const tool = this.unifiedTools.get(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }
    
    return {
      tool,
      recentUsage: await this.getRecentUsage(toolId),
      performanceMetrics: await this.performanceMonitor.getToolMetrics(toolId),
      similarTools: await this.findSimilarTools(tool),
      documentation: await this.getToolDocumentation(tool)
    };
  }

  // Private helper methods
  private async processDiscoveredTools(discoveredTools: DiscoveredTool[]): Promise<UnifiedTool[]> {
    const unifiedTools: UnifiedTool[] = [];
    
    for (const discovered of discoveredTools) {
      const unified = await this.convertToUnifiedTool(discovered);
      
      // Enhance with additional metadata
      unified.contextRelevance = await this.contextAnalyzer.calculateRelevance(unified);
      unified.availability = await this.checkToolAvailability(unified);
      unified.preferenceWeight = await this.userPreferences.getToolWeight(unified.id);
      
      unifiedTools.push(unified);
    }
    
    return unifiedTools;
  }

  private updateToolMaps(tools: UnifiedTool[]): void {
    this.unifiedTools.clear();
    this.toolsByCategory.clear();
    
    for (const tool of tools) {
      this.unifiedTools.set(tool.id, tool);
      
      // Update category index
      const categoryTools = this.toolsByCategory.get(tool.category.id) || [];
      categoryTools.push(tool);
      this.toolsByCategory.set(tool.category.id, categoryTools);
    }
  }  private async rebuildSearchIndex(): Promise<void> {
    const tools = Array.from(this.unifiedTools.values());
    await this.toolIndexer.buildIndex(tools);
    await this.fuzzySearch.updateIndex(tools);
  }

  private calculateToolScore(tool: UnifiedTool, query: string, context?: ToolExecutionContext): number {
    let score = 0;
    
    // Base relevance score (40%)
    score += this.fuzzySearch.getRelevanceScore(tool, query) * 0.4;
    
    // Context relevance (30%)
    if (context) {
      score += tool.contextRelevance.score * 0.3;
    }
    
    // Performance metrics (20%)
    score += (tool.successRate / 100) * 0.15;
    score += Math.min(tool.usageCount / 100, 1) * 0.05;
    
    // User preferences (10%)
    score += tool.preferenceWeight * 0.1;
    
    return score;
  }

  private async createRouteDecision(tool: UnifiedTool, context: ToolExecutionContext): Promise<RouteDecision> {
    const alternatives: UnifiedTool[] = [];
    const reasoning: string[] = [];
    
    // Check for conflicts and alternatives
    if (tool.conflicts?.length) {
      for (const conflict of tool.conflicts) {
        const conflictingTool = this.unifiedTools.get(conflict.conflictingTool);
        if (conflictingTool && conflictingTool.availability.status === 'available') {
          alternatives.push(conflictingTool);
        }
      }
    }
    
    // Select best tool based on context and performance
    let selectedTool = tool;
    let confidence = 0.8;
    
    if (alternatives.length > 0) {
      const scores = [tool, ...alternatives].map(t => ({
        tool: t,
        score: this.calculateToolScore(t, '', context)
      }));
      
      scores.sort((a, b) => b.score - a.score);
      selectedTool = scores[0].tool;
      confidence = scores[0].score;
      
      if (selectedTool.id !== tool.id) {
        reasoning.push(`Selected alternative tool ${selectedTool.name} based on higher performance score`);
      }
    }
    
    return {
      selectedTool,
      reasoning,
      alternatives,
      confidence,
      estimatedExecutionTime: selectedTool.averageExecutionTime
    };
  }

  private async handleExecutionError(
    tool: UnifiedTool,
    parameters: any,
    context: ToolExecutionContext,
    error: Error
  ): Promise<ToolExecutionResult> {
    
    this.emit('tool:failed', tool.id, error);
    
    // Try fallback mechanisms
    if (context.userPreferences.enableFallbacks) {
      const fallbackTool = await this.findFallbackTool(tool, context);
      
      if (fallbackTool) {
        this.emit('fallback:triggered', tool.id, fallbackTool.id);
        try {
          return await this.executeTool(fallbackTool.id, parameters, context);
        } catch (fallbackError) {
          // Fallback also failed
        }
      }
    }
    
    // Return error result
    return {
      toolId: tool.id,
      success: false,
      error: {
        message: error.message,
        type: 'execution_error',
        recoverable: false
      },
      executionTime: 0,
      source: tool.source
    };
  }  // Event handlers
  private async handleToolsDiscovered(tools: DiscoveredTool[]): Promise<void> {
    console.log(`Discovered ${tools.length} tools from sources`);
    await this.refreshToolCatalog();
  }

  private handleSourceUnavailable(sourceId: string): void {
    console.warn(`Source ${sourceId} is unavailable`);
    this.emit('source:unavailable', sourceId);
    
    // Mark tools from this source as unavailable
    for (const tool of this.unifiedTools.values()) {
      if (tool.source.id === sourceId) {
        tool.availability.status = 'unavailable';
        tool.availability.lastChecked = new Date();
        tool.availability.errorMessage = 'Source unavailable';
      }
    }
  }

  private handleConflictDetected(conflict: ToolConflict): void {
    console.log(`Tool conflict detected: ${conflict.conflictingTool}`);
    this.emit('conflict:detected', conflict);
  }

  private handleFallbackTriggered(originalTool: string, fallbackTool: string): void {
    console.log(`Fallback triggered: ${originalTool} -> ${fallbackTool}`);
    this.emit('fallback:triggered', originalTool, fallbackTool);
  }

  private handlePerformanceDegraded(toolId: string, metrics: any): void {
    console.warn(`Performance degraded for tool ${toolId}:`, metrics);
    this.emit('performance:degraded', toolId, metrics);
  }

  // Utility methods
  private async convertToUnifiedTool(discovered: DiscoveredTool): Promise<UnifiedTool> {
    const category = await this.resolveToolCategory(discovered.category, discovered.tags);
    const source = await this.resolveToolSource(discovered.sourceId, discovered.sourceType);
    
    return {
      id: `${discovered.sourceId}:${discovered.name}`,
      name: discovered.name,
      description: discovered.description,
      source,
      category,
      inputSchema: discovered.inputSchema,
      outputSchema: discovered.outputSchema,
      tags: discovered.tags || [],
      usageCount: 0,
      averageExecutionTime: 0,
      successRate: 100,
      contextRelevance: {
        projectType: [],
        subjectModes: [],
        fileTypes: [],
        contextKeywords: [],
        score: 0
      },
      availability: {
        status: 'available',
        lastChecked: new Date()
      },
      preferenceWeight: 1.0
    };
  }

  private startPeriodicUpdates(): void {
    // Update tool catalog every 30 seconds
    this.updateInterval = setInterval(async () => {
      try {
        await this.refreshToolCatalog();
      } catch (error) {
        console.warn('Periodic tool catalog update failed:', error);
      }
    }, 30000);
  }

  async shutdown(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    await this.toolDiscovery.shutdown();
    await this.executionRouter.shutdown();
    await this.performanceMonitor.shutdown();
    
    this.removeAllListeners();
    this.isInitialized = false;
  }
}