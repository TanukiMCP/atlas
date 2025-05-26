import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolConflict, ConflictResolutionRule } from '../types/tool-router-types';
export interface ConflictResolverEvents {
    'conflict:detected': (conflict: ToolConflict) => void;
    'conflict:resolved': (conflict: ToolConflict) => void;
    'resolution:applied': (toolId: string, resolution: string) => void;
}
export declare class ConflictResolver extends EventEmitter<ConflictResolverEvents> {
    private resolutionRules;
    private resolvedConflicts;
    constructor();
    private initializeDefaultRules;
    resolveConflicts(tools: UnifiedTool[]): Promise<UnifiedTool[]>;
    private groupToolsByName;
    private normalizeToolName;
    private resolveToolConflict;
    private findApplicableRule;
    private preferBuiltinResolution;
    private preferExternalResolution;
    private performanceBasedResolution;
    private userChoiceResolution;
    private selectBestTool;
    private calculatePerformanceScore;
    private calculateOverallScore;
    private getSourceHealthScore;
    addResolutionRule(rule: ConflictResolutionRule): void;
    removeResolutionRule(pattern: string): boolean;
    getResolvedConflicts(): Map<string, ToolConflict>;
    clearResolvedConflicts(): void;
}
//# sourceMappingURL=conflict-resolver.d.ts.map