import { UnifiedTool, ToolScore } from '../types/tool-router-types';
export interface SearchOptions {
    threshold?: number;
    maxResults?: number;
    includeMatches?: boolean;
    keys?: string[];
}
export declare class FuzzySearch {
    private fuse;
    private tools;
    private searchOptions;
    constructor();
    updateIndex(tools: UnifiedTool[]): Promise<void>;
    search(query: string, tools?: UnifiedTool[], options?: SearchOptions): Promise<UnifiedTool[]>;
    searchWithScores(query: string, tools?: UnifiedTool[], options?: SearchOptions): Promise<ToolScore[]>;
    getRelevanceScore(tool: UnifiedTool, query: string): number;
    private calculateRecencyScore;
    private getFieldWeight;
    private calculateMatchScore;
    searchByCategory(query: string, categoryId: string, tools?: UnifiedTool[]): Promise<UnifiedTool[]>;
    searchByTags(tags: string[], tools?: UnifiedTool[]): Promise<UnifiedTool[]>;
    searchSimilar(tool: UnifiedTool, maxResults?: number): Promise<UnifiedTool[]>;
    getSearchSuggestions(partialQuery: string, maxSuggestions?: number): string[];
}
//# sourceMappingURL=fuzzy-search.d.ts.map