import { ToolResult } from '../../types';
export declare class SearchOperations {
    private pathValidator;
    constructor();
    searchFiles(params: {
        directory: string;
        pattern: string;
        fileTypes?: string[];
    }): Promise<ToolResult>;
    private searchRecursive;
    private findMatchesInContent;
    private getLineContext;
}
//# sourceMappingURL=search-operations.d.ts.map