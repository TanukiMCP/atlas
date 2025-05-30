import React, { useState, useEffect } from 'react';
import { FileSystemItem } from '../types/index';
import { fileSystemService } from '../services/FileSystemService';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  AlertTriangle,
  RefreshCw,
  FolderX
} from 'lucide-react';

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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <File className={`${iconClass} text-yellow-500`} />;
      case 'json':
        return <File className={`${iconClass} text-green-500`} />;
      case 'css':
      case 'scss':
        return <File className={`${iconClass} text-blue-500`} />;
      case 'html':
        return <File className={`${iconClass} text-orange-500`} />;
      case 'md':
        return <File className={`${iconClass} text-blue-400`} />;
      case 'py':
        return <File className={`${iconClass} text-green-600`} />;
      case 'java':
        return <File className={`${iconClass} text-red-500`} />;
      case 'cpp':
      case 'c':
        return <File className={`${iconClass} text-blue-600`} />;
      case 'rs':
        return <File className={`${iconClass} text-orange-600`} />;
      case 'go':
        return <File className={`${iconClass} text-cyan-500`} />;
      default:
        return <File className={`${iconClass} text-muted-foreground`} />;
    }
  };

  const renderFileItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = state.expandedFolders.has(item.path);
    const isSelected = selectedFile === item.path;
    const indentWidth = depth * 16;
    
    return (
      <div key={item.path} className="select-none">
        <div
          className={`
            group flex items-center py-1.5 px-2 cursor-pointer transition-all duration-150 ease-in-out
            hover:bg-accent/50 relative
            ${isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''}
            ${item.type === 'folder' ? 'font-medium' : ''}
          `}
          style={{ paddingLeft: `${indentWidth + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.path);
            } else {
              onFileSelect(item.path);
            }
          }}
        >
          {/* Folder expand/collapse indicator */}
          {item.type === 'folder' && (
            <div className="w-4 h-4 flex items-center justify-center mr-1 flex-shrink-0">
              {item.children && item.children.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )
              ) : null}
            </div>
          )}
          
          {/* File/Folder icon */}
          <div className="mr-2 flex-shrink-0">
            {item.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-600" />
              )
            ) : (
              getFileIcon(item.name)
            )}
          </div>
          
          {/* File/Folder name */}
          <span className={`
            text-sm truncate flex-1 
            ${isSelected ? 'text-primary font-medium' : 'text-foreground'}
            ${item.type === 'folder' ? 'font-medium' : 'font-normal'}
          `}>
            {item.name}
          </span>
        </div>
        
        {/* Children */}
        {item.type === 'folder' && isExpanded && item.children && (
          <div className="relative">
            {/* Indentation guide line */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-px bg-border/30"
              style={{ left: `${indentWidth + 16}px` }}
            />
            {item.children.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (state.loading) {
    return (
      <div className="w-64 bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Explorer
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="w-64 bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Explorer
          </h2>
        </div>
        <div className="p-4 flex-1">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-medium text-destructive">
                  File System Error
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {state.error}
                </p>
                <button
                  onClick={loadFiles}
                  className="inline-flex items-center gap-2 text-xs bg-destructive/20 text-destructive px-3 py-1.5 rounded-md hover:bg-destructive/30 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.files.length === 0) {
    return (
      <div className="w-64 bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Explorer
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 p-4">
            <FolderX className="w-8 h-8 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">No files found</p>
              <p className="text-xs text-muted-foreground">
                The workspace appears to be empty
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Explorer
        </h2>
      </div>
      
      {/* File tree */}
      <div className="flex-1 overflow-auto">
        <div className="py-2">
          {state.files.map(item => renderFileItem(item))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer; 