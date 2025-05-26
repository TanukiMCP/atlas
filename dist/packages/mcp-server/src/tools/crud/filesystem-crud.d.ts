import { ToolResult } from '../../types';
export declare class FileSystemCRUD {
    private pathValidator;
    constructor();
    createDirectory(params: {
        path: string;
        recursive?: boolean;
    }): Promise<ToolResult>;
    deleteFile(params: {
        path: string;
        backup?: boolean;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=filesystem-crud.d.ts.map