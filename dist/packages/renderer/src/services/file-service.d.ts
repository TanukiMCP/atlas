/**
 * File Service - Real file system operations for TanukiMCP Atlas
 * Handles file reading, writing, and directory operations using Desktop Commander
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
export declare const getFileTypeIcon: (fileName: string, isDirectory?: boolean) => string;
export declare const formatFileSize: (bytes: number) => string;
declare class FileService {
    private projectRoot;
    constructor();
    private initializeProjectRoot;
    /**
     * Get project root directory
     */
    getProjectRoot(): string;
    /**
     * List files and directories in a path using Desktop Commander
     */
    listDirectory(path: string): Promise<FileInfo[]>;
    /**
     * Read file content using Desktop Commander
     */
    readFile(path: string): Promise<FileContent>;
    /**
     * Write content to a file using Desktop Commander
     */
    writeFile(path: string, content: string): Promise<boolean>;
    /**
     * Create a new file
     */
    createFile(path: string, content?: string): Promise<boolean>;
    /**
     * Create a new directory using Desktop Commander
     */
    createDirectory(path: string): Promise<boolean>;
    /**
     * Delete a file or directory
     */
    deleteFile(path: string): Promise<boolean>;
    /**
     * Rename/move a file using Desktop Commander
     */
    moveFile(oldPath: string, newPath: string): Promise<boolean>;
    /**
     * Get file info using Desktop Commander
     */
    getFileInfo(path: string): Promise<FileInfo | null>;
    /**
     * Check if file exists using Desktop Commander
     */
    fileExists(path: string): Promise<boolean>;
}
export declare const fileService: FileService;
export {};
//# sourceMappingURL=file-service.d.ts.map