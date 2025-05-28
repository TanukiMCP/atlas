import React, { useState, useEffect } from 'react';
import { FileSystemItem } from '../types';
import { fileSystemService } from '../services/FileSystemService';

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
  selectedFile?: string;
}

interface FileExplorerState {
  files: FileSystemItem[];
  loading: boolean;
  error: string | null;
  expandedFolders: Set<string>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFile }) => {
  const [state, setState] = useState<FileExplorerState>({
    files: [],
    loading: true,
    error: null,
    expandedFolders: new Set()
  });

  useEffect(() => {
    loadFiles();
    
    // Listen for file system changes
    const unsubscribe = fileSystemService.onFilesChanged((files) => {
      setState(prev => ({ ...prev, files, error: null }));
    });

    return unsubscribe;
  }, []);

  const loadFiles = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const files = await fileSystemService.getWorkspaceFiles();
      setState(prev => ({ 
        ...prev, 
        files, 
        loading: false, 
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        files: [], 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load files' 
      }));
    }
  };

  const toggleFolder = (folderPath: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedFolders);
      if (newExpanded.has(folderPath)) {
        newExpanded.delete(folderPath);
      } else {
        newExpanded.add(folderPath);
      }
      return { ...prev, expandedFolders: newExpanded };
    });
  };

  const renderFileItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = state.expandedFolders.has(item.path);
    const isSelected = selectedFile === item.path;
    
    return (
      <div key={item.path}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.path);
            } else {
              onFileSelect(item.path);
            }
          }}
        >
          {item.type === 'folder' && (
            <span className="mr-1 text-gray-500">
              {isExpanded ? '📂' : '📁'}
            </span>
          )}
          {item.type === 'file' && (
            <span className="mr-1 text-gray-500">📄</span>
          )}
          <span className="text-sm">{item.name}</span>
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (state.loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading files...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-red-500 mr-2">⚠️</span>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              File System Unavailable
            </h3>
          </div>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3 whitespace-pre-line">
            {state.error}
          </p>
          <button
            onClick={loadFiles}
            className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (state.files.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-400 mb-2">📁</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">No files found</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          The workspace appears to be empty
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Files
        </h3>
        <div className="space-y-1">
          {state.files.map(item => renderFileItem(item))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer; 