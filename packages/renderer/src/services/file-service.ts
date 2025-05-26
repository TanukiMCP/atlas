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

// File type icon mapping using lucide-react icons
export const getFileTypeIcon = (fileName: string, isDirectory: boolean = false): string => {
  if (isDirectory) return 'folder';
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'tsx':
    case 'jsx':
      return 'component';
    case 'ts':
    case 'js':
      return 'file-code';
    case 'json':
      return 'braces';
    case 'md':
      return 'file-text';
    case 'css':
    case 'scss':
    case 'sass':
      return 'palette';
    case 'html':
      return 'globe';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'image';
    case 'pdf':
      return 'file-text';
    case 'zip':
    case 'rar':
    case '7z':
      return 'archive';
    case 'gitignore':
    case 'env':
      return 'settings';
    default:
      return 'file';
  }
};

// Format file size helper
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

class FileService {
  private projectRoot: string = '';

  constructor() {
    this.initializeProjectRoot();
  }

  private async initializeProjectRoot() {
    // Set the actual project root from user info
    this.projectRoot = 'C:\\Users\\ididi\\tanukimcp-atlas';
  }

  /**
   * Get project root directory
   */
  getProjectRoot(): string {
    return this.projectRoot;
  }

  /**
   * List files and directories in a path using Desktop Commander
   */
  async listDirectory(path: string): Promise<FileInfo[]> {
    try {
      // Construct full path
      const fullPath = path === '' || path === '.' ? this.projectRoot : 
                      path.startsWith('C:') ? path : 
                      `${this.projectRoot}\\${path.replace(/\//g, '\\')}`;

      // Use Desktop Commander to get real directory listing
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_list_directory', {
        path: fullPath
      });

      if (!result || typeof result !== 'string') {
        throw new Error('Invalid response from Desktop Commander');
      }

      // Parse the Desktop Commander response
      const lines = result.split('\n').filter(line => line.trim());
      const files: FileInfo[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const isDirectory = trimmed.startsWith('[DIR]');
        const isFile = trimmed.startsWith('[FILE]');
        
        if (!isDirectory && !isFile) continue;

        const name = trimmed.replace(/^\[(DIR|FILE)\]\s+/, '');
        if (!name) continue;

        // Skip hidden files/directories (starting with .)
        if (name.startsWith('.') && name !== '..') continue;

        const relativePath = path === '' || path === '.' ? name : `${path}/${name}`;
        const extension = isFile ? name.split('.').pop()?.toLowerCase() : undefined;

        // Get file info for files
        let size: number | undefined;
        let modified = new Date();

        if (isFile) {
          try {
            const fileInfo = await window.electronAPI?.invoke('mcp_desktop-commander_get_file_info', {
              path: `${fullPath}\\${name}`
            });
            
            if (fileInfo && typeof fileInfo === 'string') {
              // Parse file info response to extract size and modification date
              const sizeMatch = fileInfo.match(/size:\s*(\d+)/i);
              if (sizeMatch) {
                size = parseInt(sizeMatch[1]);
              }
              
              const modifiedMatch = fileInfo.match(/last modified:\s*([^\n]+)/i);
              if (modifiedMatch) {
                modified = new Date(modifiedMatch[1]);
              }
            }
          } catch (error) {
            console.warn(`Failed to get file info for ${name}:`, error);
          }
        }

        files.push({
          name,
          path: relativePath,
          type: isDirectory ? 'directory' : 'file',
          size,
          modified,
          extension,
          isHidden: name.startsWith('.')
        });
      }

      // Sort directories first, then files, both alphabetically
      return files.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

    } catch (error) {
      console.error('Failed to list directory:', error);
      // Return empty array on error rather than throwing
      return [];
    }
  }

  /**
   * Read file content using Desktop Commander
   */
  async readFile(path: string): Promise<FileContent> {
    try {
      // Construct full path
      const fullPath = path.startsWith('C:') ? path : 
                      `${this.projectRoot}\\${path.replace(/\//g, '\\')}`;

      // Use Desktop Commander to read file
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_read_file', {
        path: fullPath
      });

      if (!result || typeof result !== 'string') {
        throw new Error('Failed to read file content');
      }

      // Get file info for metadata
      let size = result.length;
      let lastModified = new Date();

      try {
        const fileInfo = await window.electronAPI?.invoke('mcp_desktop-commander_get_file_info', {
          path: fullPath
        });
        
        if (fileInfo && typeof fileInfo === 'string') {
          const sizeMatch = fileInfo.match(/size:\s*(\d+)/i);
          if (sizeMatch) {
            size = parseInt(sizeMatch[1]);
}

          const modifiedMatch = fileInfo.match(/last modified:\s*([^\n]+)/i);
          if (modifiedMatch) {
            lastModified = new Date(modifiedMatch[1]);
          }
        }
      } catch (error) {
        console.warn('Failed to get file metadata:', error);
    }

    return {
        content: result,
      encoding: 'utf-8',
        size,
        lastModified
    };

    } catch (error) {
      console.error('Failed to read file:', error);
      throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Write content to a file using Desktop Commander
   */
  async writeFile(path: string, content: string): Promise<boolean> {
    try {
      // Construct full path
      const fullPath = path.startsWith('C:') ? path : 
                      `${this.projectRoot}\\${path.replace(/\//g, '\\')}`;
    
      // Use Desktop Commander to write file
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_write_file', {
        path: fullPath,
        content
      });

      return result === true || (typeof result === 'string' && result.includes('success'));

    } catch (error) {
      console.error('Failed to write file:', error);
      return false;
    }
  }

  /**
   * Create a new file
   */
  async createFile(path: string, content: string = ''): Promise<boolean> {
    return this.writeFile(path, content);
  }

  /**
   * Create a new directory using Desktop Commander
   */
  async createDirectory(path: string): Promise<boolean> {
    try {
      // Construct full path
      const fullPath = path.startsWith('C:') ? path : 
                      `${this.projectRoot}\\${path.replace(/\//g, '\\')}`;

      // Use Desktop Commander to create directory
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_create_directory', {
        path: fullPath
      });

      return result === true || (typeof result === 'string' && result.includes('success'));

    } catch (error) {
      console.error('Failed to create directory:', error);
      return false;
    }
  }

  /**
   * Delete a file or directory
   */
  async deleteFile(path: string): Promise<boolean> {
    console.log(`Deleting: ${path}`);
    // TODO: Implement with Desktop Commander when delete functionality is available
    return true;
  }

  /**
   * Rename/move a file using Desktop Commander
   */
  async moveFile(oldPath: string, newPath: string): Promise<boolean> {
    try {
      // Construct full paths
      const fullOldPath = oldPath.startsWith('C:') ? oldPath : 
                         `${this.projectRoot}\\${oldPath.replace(/\//g, '\\')}`;
      const fullNewPath = newPath.startsWith('C:') ? newPath : 
                         `${this.projectRoot}\\${newPath.replace(/\//g, '\\')}`;

      // Use Desktop Commander to move file
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_move_file', {
        source: fullOldPath,
        destination: fullNewPath
      });

      return result === true || (typeof result === 'string' && result.includes('success'));

    } catch (error) {
      console.error('Failed to move file:', error);
      return false;
    }
  }

  /**
   * Get file info using Desktop Commander
   */
  async getFileInfo(path: string): Promise<FileInfo | null> {
    try {
      // Construct full path
      const fullPath = path.startsWith('C:') ? path : 
                      `${this.projectRoot}\\${path.replace(/\//g, '\\')}`;

      // Use Desktop Commander to get file info
      const result = await window.electronAPI?.invoke('mcp_desktop-commander_get_file_info', {
        path: fullPath
      });

      if (!result || typeof result !== 'string') {
        return null;
      }

      // Parse the response to extract file information
      const name = path.split(/[/\\]/).pop() || '';
      const isDirectory = result.toLowerCase().includes('directory');
      const sizeMatch = result.match(/size:\s*(\d+)/i);
      const modifiedMatch = result.match(/last modified:\s*([^\n]+)/i);
    
    return {
        name,
      path,
        type: isDirectory ? 'directory' : 'file',
        size: sizeMatch ? parseInt(sizeMatch[1]) : undefined,
        modified: modifiedMatch ? new Date(modifiedMatch[1]) : new Date(),
        extension: !isDirectory ? name.split('.').pop()?.toLowerCase() : undefined
    };

    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  /**
   * Check if file exists using Desktop Commander
   */
  async fileExists(path: string): Promise<boolean> {
    const info = await this.getFileInfo(path);
    return info !== null;
  }
}

// Export singleton instance
export const fileService = new FileService();