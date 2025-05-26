import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolExecutionContext, ToolExecutionResult, ToolConflict, ToolCategory, SearchOptions, ToolPreview } from '../types/tool-router-types';
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
export declare class UnifiedToolRouter extends EventEmitter<ToolRouterEvents> {
    private toolDiscovery;
    private contextAnalyzer;
    private conflictResolver;
    private executionRouter;
    private fuzzySearch;
    private toolIndexer;
    private userPreferences;
    private performanceMonitor;
    private unifiedTools;
    private toolsByCategory;
    private lastUpdate;
    private updateInterval?;
    private isInitialized;
    constructor();
    private initializeComponents;
    private setupEventHandlers;
    initializeRouter(): Promise<void>;
    refreshToolCatalog(): Promise<void>;
    searchTools(query: string, context?: ToolExecutionContext, options?: SearchOptions): Promise<UnifiedTool[]>;
    executeTool(toolId: string, parameters: any, context: ToolExecutionContext): Promise<ToolExecutionResult>;
    getToolsByCategory(categoryId: string, context?: ToolExecutionContext): Promise<UnifiedTool[]>;
    getAvailableCategories(context?: ToolExecutionContext): Promise<ToolCategory[]>;
    getToolPreview(toolId: string): Promise<ToolPreview>;
    private processDiscoveredTools;
    private updateToolMaps;
    private rebuildSearchIndex;
    private calculateToolScore;
    private createRouteDecision;
    private handleExecutionError;
    private handleToolsDiscovered;
    private handleSourceUnavailable;
    private handleConflictDetected;
    private handleFallbackTriggered;
    private handlePerformanceDegraded;
    private convertToUnifiedTool;
    private startPeriodicUpdates;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=unified-tool-router.d.ts.map