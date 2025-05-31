import { FileSystemItem } from '../types/index';
// ElectronAPI types are declared in types/electron.d.ts

class FileSystemService {
  private watchers: Map<string, any> = new Map();
  private listeners: Set<(files: FileSystemItem[]) => void> = new Set();

  async getWorkspaceFiles(rootPath?: string): Promise<FileSystemItem[]> {
    if (!window.electronAPI?.invoke) {
      console.warn('Electron API not available, returning empty file list');
      return [];
    }

    try {
      const files = await window.electronAPI.invoke('filesystem:getWorkspaceFiles', rootPath);
      return files || [];
    } catch (error) {
      console.error('Error accessing file system via IPC:', error);
      return [];
    }
  }

  private getCurrentPath(): string {
    if (typeof process !== 'undefined') {
      // In Electron renderer, process.cwd() might not be available
      // Use a default workspace path or get it from main process
      try {
        return process.cwd();
      } catch (error) {
        // Fallback to a default workspace path
        console.warn('process.cwd() not available, using default workspace path');
        return '/c/Users/ididi/tanukimcp-atlas'; // Use the actual workspace path
      }
    }
    throw new Error('Cannot determine current path: not running in Node.js environment');
  }

  private async getNodeFiles(rootPath: string): Promise<FileSystemItem[]> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const readDirectory = async (dirPath: string, relativePath: string = ''): Promise<FileSystemItem[]> => {
      const items: FileSystemItem[] = [];
      
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          // Skip hidden files and node_modules
          if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue;
          }
          
          const fullPath = path.join(dirPath, entry.name);
          const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          
          if (entry.isDirectory()) {
            try {
              const children = await readDirectory(fullPath, itemPath);
              items.push({
                name: entry.name,
                type: 'folder',
                path: itemPath,
                children: children.length > 0 ? children : undefined
              });
            } catch (dirError) {
              console.warn(`Cannot access directory ${fullPath}:`, dirError);
              // Add directory entry without children to indicate access issue
              items.push({
                name: entry.name,
                type: 'folder',
                path: itemPath,
                children: undefined
              });
            }
          } else {
            items.push({
              name: entry.name,
              type: 'file',
              path: itemPath
            });
          }
        }
      } catch (error) {
        throw new Error(`Cannot read directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      return items.sort((a, b) => {
        // Folders first, then files, alphabetically
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    };
    
    return await readDirectory(rootPath);
  }

  async readFile(filePath: string): Promise<string> {
    if (!window.electronAPI?.invoke) {
      throw new Error('File reading requires the Electron desktop application');
    }

    try {
      const content = await window.electronAPI.invoke('fs:readFileContent', filePath);
      if (content === null) {
        throw new Error('File not found or cannot be read');
      }
      return content;
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    if (!window.electronAPI?.invoke) {
      throw new Error('File writing requires the Electron desktop application');
    }

    try {
      await window.electronAPI.invoke('fs:writeFileContent', filePath, content);
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createFile(filePath: string, content: string = ''): Promise<void> {
    await this.writeFile(filePath, content);
  }

  async createDirectory(dirPath: string): Promise<void> {
    if (!window.electronAPI?.invoke) {
      throw new Error('Directory creation requires the Electron desktop application');
    }

    try {
      await window.electronAPI.invoke('fs:createDirectory', dirPath);
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!window.electronAPI?.invoke) {
      throw new Error('File deletion requires the Electron desktop application');
    }

    try {
      await window.electronAPI.invoke('fs:deleteFile', filePath);
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Failed to delete file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDirectory(dirPath: string): Promise<void> {
    if (!window.electronAPI?.invoke) {
      throw new Error('Directory deletion requires the Electron desktop application');
    }

    try {
      await window.electronAPI.invoke('fs:deleteDirectory', dirPath);
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Failed to delete directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  watchWorkspace(rootPath?: string): void {
    // File watching is handled by the main process
    // We just need to listen for changes via IPC events
    console.log('File watching initiated via main process');
  }

  stopWatching(rootPath?: string): void {
    // Watching cleanup is handled by main process
    console.log('File watching stopped');
  }

  onFilesChanged(listener: (files: FileSystemItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private resolvePath(filePath: string): string {
    if (typeof process === 'undefined') {
      throw new Error('Path resolution is not available in browser environment');
    }

    const path = require('path');
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.resolve(this.getCurrentPath(), filePath);
  }

  private async notifyListeners(): Promise<void> {
    try {
      const files = await this.getWorkspaceFiles();
      this.listeners.forEach(listener => listener(files));
    } catch (error) {
      console.error('Error notifying file system listeners:', error);
      // Notify with empty array to indicate error state
      this.listeners.forEach(listener => listener([]));
    }
  }

  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    if (!window.electronAPI?.invoke) {
      throw new Error('File move requires the Electron desktop application');
    }

    try {
      await window.electronAPI.invoke('fs:moveFile', sourcePath, destPath);
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Failed to move item from ${sourcePath} to ${destPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const fileSystemService = new FileSystemService(); 