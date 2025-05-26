import { ToolResult } from '../../types';
export declare class ResearchTools {
    webSearch(params: {
        query: string;
        maxResults?: number;
        searchType?: 'general' | 'academic' | 'news' | 'images';
        dateRange?: 'day' | 'week' | 'month' | 'year' | 'all';
    }): Promise<ToolResult>;
    private performWebSearch;
    citationGenerator(params: {
        url: string;
        style: 'APA' | 'MLA' | 'Chicago';
    }): Promise<ToolResult>;
    summarizeArticle(params: {
        url: string;
        maxLength?: number;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=research.d.ts.map