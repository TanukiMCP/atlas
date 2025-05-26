import { ToolResult } from '../../types';
export declare class CoreFileOperations {
    private pathValidator;
    constructor();
    readFile(params: {
        path: string;
        offset?: number;
        length?: number;
        encoding?: string;
    }): Promise<ToolResult>;
    writeFile(params: {
        path: string;
        content: string;
        mode?: 'write' | 'append';
        createDirs?: boolean;
    }): Promise<ToolResult>;
    editBlock(params: {
        path: string;
        oldContent: string;
        newContent: string;
        expectedMatches?: number;
    }): Promise<ToolResult>;
    searchFiles(params: {
        directory: string;
        pattern: string;
        fileTypes?: string[];
    }): Promise<ToolResult>;
}
//# sourceMappingURL=file-operations.d.ts.map