import { UnifiedTool } from '../types/tool-router-types';
export declare class ToolIndexer {
    private searchIndex;
    private categoryIndex;
    private tagIndex;
    private sourceIndex;
    constructor();
    buildIndex(tools: UnifiedTool[]): Promise<void>;
    private clearIndexes;
    private indexTool;
    private indexByField;
    private normalizeSearchTerm;
    private extractKeywords;
    searchByCategory(categoryId: string): UnifiedTool[];
    searchByTag(tag: string): UnifiedTool[];
    searchBySource(sourceId: string): UnifiedTool[];
    findSimilarTools(tool: UnifiedTool, maxResults?: number): UnifiedTool[];
    getIndexStats(): any;
    rebuildIndex(tools: UnifiedTool[]): Promise<void>;
}
//# sourceMappingURL=tool-indexer.d.ts.map