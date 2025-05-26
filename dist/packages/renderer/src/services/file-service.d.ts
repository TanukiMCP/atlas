/**
 * File Service - Real file system operations for TanukiMCP Atlas
 * Handles file reading, writing, and directory operations
 */
export interface FileInfo {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    modified: Date;
    isHidden?: boolean;
    extension?: string;
}
export interface FileContent {
    content: string;
    encoding: string;
    size: number;
    lastModified: Date;
}
declare class FileService {
    private projectRoot;
    constructor();
    private initializeProjectRoot;
    /**
     * Get project root directory
     */
    getProjectRoot(): string;
    /**
     * List files and directories in a path
     */
    listDirectory(path: string): Promise<FileInfo[]>;
    /**
     * Read file content
     */
    readFile(path: string): Promise<FileContent>;
    /**
     * Write content to a file
     */
    writeFile(path: string, content: string): Promise<boolean>;
    /**
     * Create a new file
     */
    createFile(path: string, content?: string): Promise<boolean>;
    /**
     * Create a new directory
     */
    createDirectory(path: string): Promise<boolean>;
    /**
     * Delete a file or directory
     */
    deleteFile(path: string): Promise<boolean>;
    /**
     * Rename/move a file
     */
    moveFile(oldPath: string, newPath: string): Promise<boolean>;
    /**
     * Get file info
     */
    getFileInfo(path: string): Promise<FileInfo | null>;
    /**
     * Check if file exists
     */
    fileExists(path: string): Promise<boolean>;
}
export declare const fileService: FileService;
export {};
//# sourceMappingURL=file-service.d.ts.map