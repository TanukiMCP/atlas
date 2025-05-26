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
export declare class ContextAnalyzer {
    private contextKeywords;
    private fileTypeMapping;
    private subjectModeMapping;
    constructor();
    private initializeContextMappings;
    analyzeRelevance(tools: UnifiedTool[], context: ToolExecutionContext): Promise<Map<string, number>>;
    calculateRelevance(tool: UnifiedTool): Promise<ContextRelevance>;
    isToolRelevant(tool: UnifiedTool, context: ToolExecutionContext): Promise<boolean>;
    private calculateToolRelevance;
    private calculateSubjectModeRelevance;
    private calculateProjectRelevance;
    private calculateFileRelevance;
    private calculateHistoryRelevance;
    private calculateTemporalRelevance;
    private inferProjectTypes;
    private inferSubjectModes;
    private inferFileTypes;
    private extractContextKeywords;
}
//# sourceMappingURL=context-analyzer.d.ts.map