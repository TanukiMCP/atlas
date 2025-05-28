import { FileSystemItem } from '../types';
declare class FileSystemService {
    private watchers;
    private listeners;
    getWorkspaceFiles(rootPath?: string): Promise<FileSystemItem[]>;
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, content: string): Promise<void>;
    createFile(filePath: string, content?: string): Promise<void>;
    createDirectory(dirPath: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    deleteDirectory(dirPath: string): Promise<void>;
    watchWorkspace(rootPath?: string): void;
    stopWatching(rootPath: string): void;
    onFilesChanged(listener: (files: FileSystemItem[]) => void): () => void;
    private resolvePath;
    private notifyListeners;
    private getFallbackFileStructure;
}
declare const _default: FileSystemService;
export default _default;
//# sourceMappingURL=FileSystemService.d.ts.map