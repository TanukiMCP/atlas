import React, { useState, useEffect, useRef } from 'react';
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
  FolderX,
  Plus,
  Trash2,
  Edit2,
  Save,
  MoreVertical,
  FilePlus,
  FolderPlus,
  Download,
  Menu
} from 'lucide-react';

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
  selectedFile?: string;
  onDeleteFile?: (filePath: string) => Promise<void>;
  onCreateFile?: (filePath: string, content: string) => Promise<void>;
  onCreateFolder?: (folderPath: string) => Promise<void>;
  workspaceName?: string;
}

interface FileExplorerState {
  files: FileSystemItem[];
  loading: boolean;
  error: string | null;
  expandedFolders: Set<string>;
  contextMenu: {
    show: boolean;
    x: number;
    y: number;
    item: FileSystemItem | null;
  };
  isCreatingFile: boolean;
  isCreatingFolder: boolean;
  newItemParentPath: string;
  newItemName: string;
  isRenamingFile: boolean;
  renamingFilePath: string;
  newFileName: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  onFileSelect, 
  selectedFile,
  onDeleteFile,
  onCreateFile,
  onCreateFolder,
  workspaceName = 'Workspace'
}) => {
  const [state, setState] = useState<FileExplorerState>({
    files: [],
    loading: true,
    error: null,
    expandedFolders: new Set(),
    contextMenu: {
      show: false,
      x: 0,
      y: 0,
      item: null
    },
    isCreatingFile: false,
    isCreatingFolder: false,
    newItemParentPath: '',
    newItemName: '',
    isRenamingFile: false,
    renamingFilePath: '',
    newFileName: ''
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    loadFiles();
    
    // Listen for file system changes
    const unsubscribe = fileSystemService.onFilesChanged((files) => {
      setState(prev => ({ ...prev, files, error: null }));
    });

    // Add click listener to dismiss context menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current && 
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('click', handleClickOutside);
    }
  }, []);

  useEffect(() => {
    // Focus the new item input when creating file/folder
    if ((state.isCreatingFile || state.isCreatingFolder) && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [state.isCreatingFile, state.isCreatingFolder]);

  useEffect(() => {
    // Focus the rename input when renaming a file
    if (state.isRenamingFile && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [state.isRenamingFile]);

  // Get current folder path from selected file
  const getCurrentFolderPath = (): string => {
    if (!selectedFile) return '';
    
    const parts = selectedFile.split('/');
    if (parts.length <= 1) return '';
    
    parts.pop(); // Remove the file name
    return parts.join('/');
  };

  // Get folder name from path
  const getFolderName = (path: string): string => {
    if (!path) return workspaceName;
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  
  // Get the current folder or file being viewed
  const getCurrentDisplayName = (): string => {
    if (selectedFile) {
      if (state.files.length === 0) return workspaceName;
      
      const parts = selectedFile.split('/');
      return parts[parts.length - 1];
    }
    return workspaceName;
  };

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

  const showContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      contextMenu: {
        show: true,
        x: e.clientX,
        y: e.clientY,
        item
      }
    }));
  };

  const closeContextMenu = () => {
    setState(prev => ({
      ...prev,
      contextMenu: {
        show: false,
        x: 0,
        y: 0,
        item: null
      }
    }));
  };

  const handleDeleteItem = async () => {
    const item = state.contextMenu.item;
    if (!item) return;
    
    try {
      if (item.type === 'file') {
        if (onDeleteFile) {
          await onDeleteFile(item.path);
        } else {
          await fileSystemService.deleteFile(item.path);
        }
      } else {
        await fileSystemService.deleteDirectory(item.path);
      }
      closeContextMenu();
    } catch (error) {
      console.error(`Failed to delete ${item.type}:`, error);
      // You could add an error notification here
    }
  };

  const startCreatingFile = (parentPath: string) => {
    setState(prev => ({
      ...prev,
      isCreatingFile: true,
      isCreatingFolder: false,
      newItemParentPath: parentPath,
      newItemName: '',
      contextMenu: { ...prev.contextMenu, show: false }
    }));
  };

  const startCreatingFolder = (parentPath: string) => {
    setState(prev => ({
      ...prev,
      isCreatingFile: false,
      isCreatingFolder: true,
      newItemParentPath: parentPath,
      newItemName: '',
      contextMenu: { ...prev.contextMenu, show: false }
    }));
  };

  const startRenaming = (item: FileSystemItem) => {
    closeContextMenu();
    setState(prev => ({
      ...prev,
      isRenamingFile: true,
      renamingFilePath: item.path,
      newFileName: item.name
    }));
  };

  const handleNewItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      newItemName: e.target.value
    }));
  };

  const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      newFileName: e.target.value
    }));
  };

  const createNewItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    const { isCreatingFile, isCreatingFolder, newItemParentPath, newItemName } = state;
    if (!newItemName.trim()) return;
    
    try {
      const newPath = newItemParentPath 
        ? `${newItemParentPath}/${newItemName}` 
        : newItemName;
        
      if (isCreatingFile) {
        if (onCreateFile) {
          await onCreateFile(newPath, '');
        } else {
          await fileSystemService.createFile(newPath);
        }
      } else if (isCreatingFolder) {
        if (onCreateFolder) {
          await onCreateFolder(newPath);
        } else {
          await fileSystemService.createDirectory(newPath);
        }
      }
      
      setState(prev => ({
        ...prev,
        isCreatingFile: false,
        isCreatingFolder: false,
        newItemParentPath: '',
        newItemName: ''
      }));
    } catch (error) {
      console.error('Failed to create new item:', error);
      // You could add an error notification here
    }
  };

  const submitRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        const oldPath = state.renamingFilePath;
        const oldName = oldPath.split('/').pop() || '';
        const newPath = oldPath.replace(oldName, state.newFileName);
        
        if (oldPath === newPath) {
          cancelRename();
          return;
        }

        if (window.electronAPI?.invoke) {
          await window.electronAPI.invoke('fs:moveFile', oldPath, newPath);
          
          // Notify for file selection update if the renamed file was selected
          if (selectedFile === oldPath) {
            onFileSelect(newPath);
          }
          
          setState(prev => ({
            ...prev,
            isRenamingFile: false,
            renamingFilePath: '',
            newFileName: ''
          }));
        }
      } catch (error) {
        console.error('Failed to rename item:', error);
      }
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  const cancelNewItem = () => {
    setState(prev => ({
      ...prev,
      isCreatingFile: false,
      isCreatingFolder: false,
      newItemParentPath: '',
      newItemName: ''
    }));
  };

  const cancelRename = () => {
    setState(prev => ({
      ...prev,
      isRenamingFile: false,
      renamingFilePath: '',
      newFileName: ''
    }));
  };

  const renderContextMenu = () => {
    const { show, x, y, item } = state.contextMenu;
    if (!show || !item) return null;
    
    const isFolder = item.type === 'folder';
    
    return (
      <div 
        ref={contextMenuRef}
        className="absolute z-50 min-w-48 bg-popover text-popover-foreground shadow-md rounded-md border border-border py-1 overflow-hidden"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1">
          {item.name}
        </div>
        
        {isFolder && (
          <>
            <button 
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center gap-2"
              onClick={() => startCreatingFile(item.path)}
            >
              <FilePlus className="w-4 h-4 text-blue-500" />
              <span>New File</span>
            </button>
            <button 
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center gap-2"
              onClick={() => startCreatingFolder(item.path)}
            >
              <FolderPlus className="w-4 h-4 text-yellow-500" />
              <span>New Folder</span>
            </button>
            <div className="border-t border-border my-1"></div>
          </>
        )}
        
        <button 
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center gap-2"
          onClick={() => startRenaming(item)}
        >
          <Edit2 className="w-4 h-4 text-amber-500" />
          <span>Rename</span>
        </button>
        
        <button 
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center gap-2"
          onClick={handleDeleteItem}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Delete</span>
        </button>
      </div>
    );
  };

  const renderFileItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = state.expandedFolders.has(item.path);
    const isSelected = selectedFile === item.path;
    const isRenaming = state.isRenamingFile && state.renamingFilePath === item.path;
    const indentWidth = depth * 16;
    
    // Check if new item form should be shown under this folder
    const showNewItemInput = (state.isCreatingFile || state.isCreatingFolder) && 
                           state.newItemParentPath === item.path;
    
    return (
      <div key={item.path} className="select-none">
        {isRenaming ? (
          <div 
            className="flex items-center py-1.5 px-2 bg-accent/30"
            style={{ paddingLeft: `${indentWidth + 8}px` }}
          >
            <div className="mr-2 flex-shrink-0">
              {item.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-600" />
              ) : (
                getFileIcon(item.name)
              )}
            </div>
            <input
              ref={renameInputRef}
              type="text"
              value={state.newFileName}
              onChange={handleRenameChange}
              onKeyDown={submitRename}
              onBlur={cancelRename}
              className="flex-1 bg-transparent text-sm border-none focus:outline-none"
            />
          </div>
        ) : (
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
            onContextMenu={(e) => showContextMenu(e, item)}
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
            
            {/* Action buttons on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              {item.type === 'folder' && (
                <button 
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCreatingFile(item.path);
                  }}
                  title="New File"
                >
                  <FilePlus className="w-3 h-3" />
                </button>
              )}
              <button 
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  startRenaming(item);
                }}
                title="Rename"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button 
                className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  showContextMenu(e, item);
                }}
                title="More options"
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        
        {/* New item input field */}
        {item.type === 'folder' && isExpanded && showNewItemInput && (
          <div 
            className="flex items-center py-1.5 px-2 bg-accent/30"
            style={{ paddingLeft: `${indentWidth + 32}px` }}
          >
            <div className="mr-2 flex-shrink-0">
              {state.isCreatingFile ? (
                <File className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <input
              ref={newItemInputRef}
              type="text"
              value={state.newItemName}
              onChange={handleNewItemNameChange}
              onKeyDown={createNewItem}
              onBlur={cancelNewItem}
              className="flex-1 bg-transparent text-sm border-none focus:outline-none"
              placeholder={state.isCreatingFile ? "New file name..." : "New folder name..."}
            />
          </div>
        )}
        
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

  // Top-level context menu for the explorer
  const showRootContextMenu = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      contextMenu: {
        show: true,
        x: e.clientX,
        y: e.clientY,
        item: { name: 'Workspace', type: 'folder', path: '' }
      }
    }));
  };

  if (state.loading) {
    return (
      <div className="w-64 bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            {workspaceName}
          </h2>
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
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
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            {workspaceName}
          </h2>
          <button
            onClick={loadFiles}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Explorer
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => startCreatingFile('')}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
              title="New File"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => startCreatingFolder('')}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={loadFiles}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div 
          className="flex-1 flex items-center justify-center"
          onContextMenu={showRootContextMenu}
        >
          {(state.isCreatingFile || state.isCreatingFolder) && state.newItemParentPath === '' ? (
            <div className="w-full px-4">
              <div 
                className="flex items-center py-1.5 px-3 bg-accent/30 rounded-md"
              >
                <div className="mr-2 flex-shrink-0">
                  {state.isCreatingFile ? (
                    <File className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Folder className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <input
                  ref={newItemInputRef}
                  type="text"
                  value={state.newItemName}
                  onChange={handleNewItemNameChange}
                  onKeyDown={createNewItem}
                  onBlur={cancelNewItem}
                  className="flex-1 bg-transparent text-sm border-none focus:outline-none"
                  placeholder={state.isCreatingFile ? "New file name..." : "New folder name..."}
                />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 p-4">
              <FolderX className="w-8 h-8 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No files found</p>
                <p className="text-xs text-muted-foreground">
                  The workspace appears to be empty
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => startCreatingFile('')}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
                >
                  <FilePlus className="w-3 h-3" />
                  New File
                </button>
                <button
                  onClick={() => startCreatingFolder('')}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
                >
                  <FolderPlus className="w-3 h-3" />
                  New Folder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="overflow-hidden">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{getCurrentDisplayName()}</span>
          </h2>
          {selectedFile && (
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {getCurrentFolderPath() || workspaceName}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => startCreatingFile('')}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => startCreatingFolder('')}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={loadFiles}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* File tree */}
      <div 
        className="flex-1 overflow-auto" 
        onContextMenu={showRootContextMenu}
      >
        {(state.isCreatingFile || state.isCreatingFolder) && state.newItemParentPath === '' ? (
          <div className="p-2">
            <div 
              className="flex items-center py-1.5 px-3 bg-accent/30 rounded-md"
            >
              <div className="mr-2 flex-shrink-0">
                {state.isCreatingFile ? (
                  <File className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <input
                ref={newItemInputRef}
                type="text"
                value={state.newItemName}
                onChange={handleNewItemNameChange}
                onKeyDown={createNewItem}
                onBlur={cancelNewItem}
                className="flex-1 bg-transparent text-sm border-none focus:outline-none"
                placeholder={state.isCreatingFile ? "New file name..." : "New folder name..."}
              />
            </div>
          </div>
        ) : null}
        
        <div className="py-2">
          {state.files.map(item => renderFileItem(item))}
        </div>
      </div>
      
      {/* Context Menu */}
      {renderContextMenu()}
    </div>
  );
};

export default FileExplorer;