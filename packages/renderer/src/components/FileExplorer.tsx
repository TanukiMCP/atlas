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
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Search
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

const RECENT_WORKSPACES_KEY = 'recentWorkspaces';
const MAX_RECENT_WORKSPACES = 5;

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  onFileSelect, 
  selectedFile,
  onDeleteFile,
  onCreateFile,
  onCreateFolder,
  workspaceName = 'Workspace'
}) => {
  const [recentWorkspaces, setRecentWorkspaces] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_WORKSPACES_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [currentWorkspace, setCurrentWorkspace] = useState<string>(() => recentWorkspaces[0] || '');
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
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for keyboard navigation
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Build flat list of visible item paths for navigation
  const flatPaths: string[] = [];
  const parentMap: Record<string, string | null> = {};
  const buildNavigationList = (items: FileSystemItem[], parent: string | null) => {
    for (const it of items) {
      flatPaths.push(it.path);
      parentMap[it.path] = parent;
      if (it.type === 'folder' && state.expandedFolders.has(it.path) && it.children) {
        buildNavigationList(it.children, it.path);
      }
    }
  };
  buildNavigationList(state.files, null);

  useEffect(() => {
    loadFiles(currentWorkspace);
    
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
  }, [currentWorkspace]);

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

  const loadFiles = async (workspacePath?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const files = await fileSystemService.getWorkspaceFiles(workspacePath);
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

  const toggleFolder = async (folderPath: string) => {
    // Check if we need to load the children first
    const folderItem = findItemByPath(state.files, folderPath);
    
    if (!folderItem || folderItem.type !== 'folder') {
      return;
    }

    // Toggle expanded state first for immediate UI feedback
    setState(prev => {
      const newExpanded = new Set(prev.expandedFolders);
      if (newExpanded.has(folderPath)) {
        newExpanded.delete(folderPath);
      } else {
        newExpanded.add(folderPath);
      }
      return { ...prev, expandedFolders: newExpanded };
    });

    // If expanding and no children loaded yet, fetch them
    if (!state.expandedFolders.has(folderPath) && (!folderItem.children || folderItem.children.length === 0)) {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        // Load the folder's children
        const folderContents = await fileSystemService.getWorkspaceFiles(folderPath);
        
        // Update the file tree with the new children
        const updatedFiles = updateFileTreeWithChildren(state.files, folderPath, folderContents);
        
        setState(prev => ({ 
          ...prev, 
          files: updatedFiles,
          loading: false
        }));
      } catch (error) {
        console.error(`Failed to load contents of folder: ${folderPath}`, error);
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load folder contents'
        }));
      }
    }
  };

  // Helper function to find an item by path in the file tree
  const findItemByPath = (items: FileSystemItem[], path: string): FileSystemItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.type === 'folder' && item.children) {
        const found = findItemByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to update the file tree with new children for a specific folder
  const updateFileTreeWithChildren = (
    items: FileSystemItem[], 
    folderPath: string, 
    children: FileSystemItem[]
  ): FileSystemItem[] => {
    return items.map(item => {
      if (item.path === folderPath) {
        return { ...item, children };
      }
      if (item.type === 'folder' && item.children) {
        return {
          ...item,
          children: updateFileTreeWithChildren(item.children, folderPath, children)
        };
      }
      return item;
    });
  };

  const collapseAllFolders = () => {
    setState(prev => ({ ...prev, expandedFolders: new Set() }));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <File className={`${iconClass} text-yellow-400`} />;
      case 'ts':
      case 'tsx':
        return <File className={`${iconClass} text-blue-400`} />;
      case 'json':
        return <File className={`${iconClass} text-green-400`} />;
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
        return <File className={`${iconClass} text-pink-400`} />;
      case 'html':
      case 'htm':
        return <File className={`${iconClass} text-orange-400`} />;
      case 'md':
      case 'markdown':
        return <File className={`${iconClass} text-blue-300`} />;
      case 'py':
        return <File className={`${iconClass} text-green-500`} />;
      case 'java':
        return <File className={`${iconClass} text-red-400`} />;
      case 'cpp':
      case 'c':
      case 'h':
      case 'hpp':
        return <File className={`${iconClass} text-blue-500`} />;
      case 'rs':
        return <File className={`${iconClass} text-orange-500`} />;
      case 'go':
        return <File className={`${iconClass} text-cyan-400`} />;
      case 'php':
        return <File className={`${iconClass} text-purple-400`} />;
      case 'rb':
        return <File className={`${iconClass} text-red-500`} />;
      case 'swift':
        return <File className={`${iconClass} text-orange-400`} />;
      case 'kt':
      case 'kts':
        return <File className={`${iconClass} text-purple-500`} />;
      case 'vue':
        return <File className={`${iconClass} text-green-400`} />;
      case 'svelte':
        return <File className={`${iconClass} text-red-500`} />;
      case 'dart':
        return <File className={`${iconClass} text-blue-400`} />;
      case 'sol':
        return <File className={`${iconClass} text-purple-400`} />;
      case 'yml':
      case 'yaml':
        return <File className={`${iconClass} text-red-300`} />;
      case 'toml':
        return <File className={`${iconClass} text-blue-300`} />;
      case 'ini':
        return <File className={`${iconClass} text-gray-400`} />;
      case 'sh':
      case 'bash':
      case 'zsh':
        return <File className={`${iconClass} text-green-300`} />;
      case 'bat':
      case 'cmd':
        return <File className={`${iconClass} text-blue-300`} />;
      case 'ps1':
        return <File className={`${iconClass} text-blue-400`} />;
      case 'sql':
        return <File className={`${iconClass} text-orange-300`} />;
      case 'prisma':
        return <File className={`${iconClass} text-teal-400`} />;
      case 'graphql':
      case 'gql':
        return <File className={`${iconClass} text-pink-500`} />;
      case 'env':
      case 'env.local':
      case 'env.development':
      case 'env.production':
        return <File className={`${iconClass} text-yellow-300`} />;
      case 'lock':
      case 'lock.json':
        return <File className={`${iconClass} text-red-300`} />;
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

  // --- Enhanced Context Menu Action Handlers ---

  const handleOpenFile = () => {
    const item = state.contextMenu.item;
    if (!item || item.type !== 'file') return;
    onFileSelect(item.path);
    closeContextMenu();
  };

  const handleCopyPath = async (type: 'absolute' | 'relative') => {
    const item = state.contextMenu.item;
    if (!item) return;
    
    let pathToCopy = item.path;
    if (type === 'relative') {
      if (currentWorkspace && item.path.startsWith(currentWorkspace)) {
        pathToCopy = item.path.substring(currentWorkspace.length + 1);
      } else {
        console.warn("Cannot determine relative path: item not in current workspace or workspace not set.");
        console.info(`Copied absolute path instead: ${pathToCopy}`);
      }
    }

    try {
      await navigator.clipboard.writeText(pathToCopy);
      console.info(`${type.charAt(0).toUpperCase() + type.slice(1)} path copied to clipboard: ${pathToCopy}`);
    } catch (err) {
      console.error(`Failed to copy ${type} path:`, err);
    }
    closeContextMenu();
  };
  
  const handleDownloadFile = async () => {
    const item = state.contextMenu.item;
    if (!item || item.type !== 'file') return;

    try {
      if (window.electronAPI?.invoke) {
        const success = await window.electronAPI.invoke('fs:downloadFile', item.path);
        if (success) {
          console.info(`Download initiated for: ${item.name}`);
        } else {
          throw new Error('Download initiation failed via Electron API.');
        }
      } else {
        console.warn("Download: electronAPI not available. This action is primarily for Electron context.");
        throw new Error('Download not supported in this environment without electronAPI or specific file service method.');
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
    closeContextMenu();
  };

  const handleRevealInExplorer = async () => {
    const item = state.contextMenu.item;
    if (!item) return;

    if (window.electronAPI?.invoke) {
      try {
        await window.electronAPI.invoke('shell:showItemInFolder', item.path);
      } catch (error) {
        console.error('Failed to reveal item in explorer:', error);
      }
    } else {
      console.warn('Reveal in OS Explorer: electronAPI not available.');
    }
    closeContextMenu();
  };
  
  const handleExpandCollapseFolder = (expand: boolean) => {
    const item = state.contextMenu.item;
    if (!item || item.type !== 'folder') return;
    
    const newExpanded = new Set(state.expandedFolders);
    if (expand) {
      newExpanded.add(item.path);
    } else {
      newExpanded.delete(item.path);
    }
    setState(prev => ({ ...prev, expandedFolders: newExpanded }));
    closeContextMenu();
  };

  const handleDeleteItem = async () => {
    const item = state.contextMenu.item;
    if (!item) return;
    
    try {
      if (item.type === 'file') {
        if (window.confirm(`Are you sure you want to delete file: ${item.name}?`)) {
          if (onDeleteFile) {
            await onDeleteFile(item.path);
          } else {
            await fileSystemService.deleteFile(item.path);
          }
          console.info(`File deleted: ${item.name}`);
        }
      } else {
        if (window.confirm(`Are you sure you want to delete folder: ${item.name}? This will delete all its contents.`)) {
          await fileSystemService.deleteDirectory(item.path);
          console.info(`Folder deleted: ${item.name}`);
        }
      }
      closeContextMenu();
    } catch (error) {
      console.error(`Failed to delete ${item.type}:`, error);
      closeContextMenu();
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
    if (e.key === 'Enter') {
      const { isCreatingFile, isCreatingFolder, newItemParentPath, newItemName } = state;
      const trimmedName = newItemName.trim();
      if (!trimmedName) {
        console.warn("New item name cannot be empty.");
        cancelNewItem();
        return;
      }

      try {
        const newPath = newItemParentPath ? `${newItemParentPath}/${trimmedName}` : trimmedName;
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
        console.info(`Created new ${isCreatingFile ? 'file' : 'folder'}: ${newPath}`);
        setState(prev => ({
          ...prev,
          isCreatingFile: false,
          isCreatingFolder: false,
          newItemParentPath: '',
          newItemName: ''
        }));
      } catch (error) {
        console.error('Failed to create new item:', error);
        setState(prev => ({
          ...prev,
          isCreatingFile: false,
          isCreatingFolder: false,
          newItemParentPath: '',
          newItemName: ''
        }));
      }
    } else if (e.key === 'Escape') {
      cancelNewItem();
      return;
    }
  };

  const submitRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const oldPath = state.renamingFilePath;
      const oldName = oldPath.split(/[\/]/).pop() || '';
      const newName = state.newFileName.trim();

      if (!newName) {
        console.warn("New name cannot be empty.");
        cancelRename();
        return;
      }

      if (oldName === newName) {
        cancelRename();
        return;
      }

      const parentPath = oldPath.substring(0, oldPath.length - oldName.length);
      const newPath = `${parentPath}${newName}`;

      try {
        if (window.electronAPI?.invoke) {
          await window.electronAPI.invoke('fs:moveFile', oldPath, newPath);
          if (selectedFile === oldPath) onFileSelect(newPath);
          if (state.expandedFolders.has(oldPath)) {
            const newExpanded = new Set(state.expandedFolders);
            newExpanded.delete(oldPath);
            newExpanded.add(newPath);
            setState(prev => ({ ...prev, expandedFolders: newExpanded }));
          }
          console.info(`Renamed ${oldName} to ${newName}`);
          setState(prev => ({
            ...prev,
            isRenamingFile: false,
            renamingFilePath: '',
            newFileName: ''
          }));
        } else {
          throw new Error("electronAPI not available for renaming.");
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

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, path: string) => {
    e.dataTransfer.setData('text/plain', path);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetPath: string) => {
    e.preventDefault();
    const sourcePath = e.dataTransfer.getData('text/plain');
    if (!sourcePath) return;
    // Prevent dropping onto itself or its own descendants
    if (sourcePath === targetPath || targetPath.startsWith(sourcePath + '/')) {
      console.warn('Cannot move a folder into itself or its descendant.');
      return;
    }
    const name = sourcePath.split('/').pop();
    if (!name) return;
    const destPath = targetPath ? `${targetPath}/${name}` : name;
    try {
      await fileSystemService.moveFile(sourcePath, destPath);
      console.info(`Moved ${sourcePath} to ${destPath}`);
    } catch (error) {
      console.error('Failed to move item:', error);
    }
  };

  // Filter files based on search term
  const filterFiles = (items: FileSystemItem[]): FileSystemItem[] => {
    return items.reduce<FileSystemItem[]>((acc, it) => {
      const matches = it.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (matches) {
        acc.push(it);
      } else if (it.type === 'folder' && it.children) {
        const filteredChildren = filterFiles(it.children);
        if (filteredChildren.length > 0) {
          acc.push({ ...it, children: filteredChildren });
        }
      }
      return acc;
    }, []);
  };

  const renderContextMenu = () => {
    const { show, x, y, item } = state.contextMenu;
    if (!show || !item) return null;
    
    const isFolder = item.type === 'folder';
    const isFile = item.type === 'file';
    const isExpanded = isFolder && state.expandedFolders.has(item.path);
    const isWorkspaceRoot = item.path === '' && item.name === 'Workspace'; // Special case for root context menu
    
    return (
      <div 
        ref={contextMenuRef}
        className="absolute z-50 min-w-[200px] bg-popover text-popover-foreground shadow-md rounded-md border border-border py-1 overflow-hidden text-sm"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      >
        {!isWorkspaceRoot && (
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1 truncate">
            {item.name}
          </div>
        )}
        
        {/* File-specific actions */}
        {isFile && (
          <button 
            className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
            onClick={handleOpenFile}
          >
            <ExternalLink className="w-4 h-4 text-sky-500" />
            <span>Open</span>
          </button>
        )}

        {/* Folder-specific actions (New File/Folder) */}
        {isFolder && !isWorkspaceRoot && ( // Don't show "New File/Folder in Workspace" if it's the root itself
          <>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => startCreatingFile(item.path)}
            >
              <FilePlus className="w-4 h-4 text-blue-500" />
              <span>New File</span>
            </button>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => startCreatingFolder(item.path)}
            >
              <FolderPlus className="w-4 h-4 text-yellow-500" />
              <span>New Folder</span>
            </button>
            <div className="border-t border-border my-1"></div>
          </>
        )}
        
        {/* Actions for root workspace context menu */}
        {isWorkspaceRoot && (
           <>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => startCreatingFile(currentWorkspace || '')} // Target current workspace root
            >
              <FilePlus className="w-4 h-4 text-blue-500" />
              <span>New File in Workspace</span>
            </button>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => startCreatingFolder(currentWorkspace || '')} // Target current workspace root
            >
              <FolderPlus className="w-4 h-4 text-yellow-500" />
              <span>New Folder in Workspace</span>
            </button>
            <div className="border-t border-border my-1"></div>
          </>
        )}

        {/* Expand/Collapse for Folders */}
        {isFolder && !isWorkspaceRoot && item.children && item.children.length > 0 && (
          isExpanded ? (
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => handleExpandCollapseFolder(false)}
            >
              <Minimize2 className="w-4 h-4" />
              <span>Collapse</span>
            </button>
          ) : (
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => handleExpandCollapseFolder(true)}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Expand</span>
            </button>
          )
        )}
        {isFolder && !isWorkspaceRoot && item.children && item.children.length > 0 && (<div className="border-t border-border my-1"></div>)}


        {/* Common actions (excluding root) */}
        {!isWorkspaceRoot && (
          <>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => startRenaming(item)}
            >
              <Edit2 className="w-4 h-4 text-amber-500" />
              <span>Rename</span>
            </button>
            <div className="border-t border-border my-1"></div>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => handleCopyPath('absolute')}
            >
              <Copy className="w-4 h-4" />
              <span>Copy Path</span>
            </button>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={() => handleCopyPath('relative')}
            >
              <Copy className="w-4 h-4 text-gray-400" /> {/* Slightly different icon/color for relative? */}
              <span>Copy Relative Path</span>
            </button>
            
            {isFile && (
              <button 
                className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
                onClick={handleDownloadFile}
              >
                <Download className="w-4 h-4 text-green-500" />
                <span>Download</span>
              </button>
            )}

            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
              onClick={handleRevealInExplorer}
            >
              <ExternalLink className="w-4 h-4 text-indigo-500" />
              <span>Reveal in File Explorer</span>
            </button>
            <div className="border-t border-border my-1"></div>
            <button 
              className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2 text-red-600 hover:bg-destructive/10"
              onClick={handleDeleteItem}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </>
        )}
        
        {/* Refresh for root workspace context menu */}
        {isWorkspaceRoot && (
          <button
            onClick={() => { loadFiles(currentWorkspace); closeContextMenu(); }}
            className="w-full text-left px-3 py-1.5 hover:bg-accent focus:outline-none focus:bg-accent/70 focus:ring-1 focus:ring-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Workspace</span>
          </button>
        )}
      </div>
    );
  };

  const renderFileItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = state.expandedFolders.has(item.path);
    const isSelected = selectedFile === item.path;
    const isRenaming = state.isRenamingFile && state.renamingFilePath === item.path;
    const isCreatingInside = (state.isCreatingFile || state.isCreatingFolder) && state.newItemParentPath === item.path;
    const isVisible = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!isVisible) return null;

    return (
      <div key={item.path} ref={el => rowRefs.current[item.path] = el}>
        <div
          className={`
            group flex items-center py-1 px-2 cursor-pointer select-none
            ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}
            transition-colors duration-150 ease-in-out relative
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => item.type === 'file' ? onFileSelect(item.path) : toggleFolder(item.path)}
          onContextMenu={(e) => showContextMenu(e, item)}
          draggable
          onDragStart={(e) => handleDragStart(e, item.path)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.path)}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {item.type === 'folder' && (
              <button 
                className="w-4 h-4 flex items-center justify-center flex-shrink-0 hover:bg-muted/50 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.path);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            )}
            {item.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-400" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-400" />
              )
            ) : (
              getFileIcon(item.name)
            )}
            <span className="truncate flex-1">
              {isRenaming ? (
                <input
                  ref={renameInputRef}
                  type="text"
                  value={state.newFileName}
                  onChange={handleRenameChange}
                  onKeyDown={submitRename}
                  onBlur={() => cancelRename()}
                  className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                item.name
              )}
            </span>
          </div>
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50" />
            {item.children.map((child) => renderFileItem(child, depth + 1))}
            {isCreatingInside && (
              <div 
                className="flex items-center py-1 px-2"
                style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
              >
                <div className="w-4" />
                {state.isCreatingFile ? (
                  <File className="w-4 h-4 text-muted-foreground mr-2" />
                ) : (
                  <Folder className="w-4 h-4 text-yellow-400 mr-2" />
                )}
                <input
                  ref={newItemInputRef}
                  type="text"
                  value={state.newItemName}
                  onChange={handleNewItemNameChange}
                  onKeyDown={createNewItem}
                  onBlur={() => cancelNewItem()}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-1"
                  placeholder={state.isCreatingFile ? 'New file name...' : 'New folder name...'}
                />
              </div>
            )}
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

  const updateRecents = (workspace: string) => {
    let recents = [workspace, ...recentWorkspaces.filter(w => w !== workspace)];
    if (recents.length > MAX_RECENT_WORKSPACES) recents = recents.slice(0, MAX_RECENT_WORKSPACES);
    setRecentWorkspaces(recents);
    localStorage.setItem(RECENT_WORKSPACES_KEY, JSON.stringify(recents));
  };

  const handleBrowse = async () => {
    if (window.electronAPI?.invoke) {
      const result = await window.electronAPI.invoke('dialog:showOpenDialog', { properties: ['openDirectory'] });
      if (result && result.filePaths && result.filePaths[0]) {
        setCurrentWorkspace(result.filePaths[0]);
        updateRecents(result.filePaths[0]);
        setIsWorkspaceDropdownOpen(false);
      }
    } else {
      console.warn('electronAPI not available for directory selection.');
    }
  };

  const handleWorkspaceChange = async (newWorkspace: string) => {
    if (newWorkspace === '__browse__') {
      await handleBrowse();
    } else {
      setCurrentWorkspace(newWorkspace);
      updateRecents(newWorkspace);
      
      // Set the working directory in the file system service
      try {
        const success = await fileSystemService.setWorkingDirectory(newWorkspace);
        if (success) {
          console.log(`Successfully changed working directory to: ${newWorkspace}`);
          await loadFiles(newWorkspace);
        } else {
          console.error(`Failed to change working directory to: ${newWorkspace}`);
          setState(prev => ({ 
            ...prev, 
            error: `Failed to change to directory: ${newWorkspace}` 
          }));
        }
      } catch (error) {
        console.error('Error changing working directory:', error);
        setState(prev => ({ 
          ...prev, 
          error: `Error accessing directory: ${error instanceof Error ? error.message : String(error)}` 
        }));
      }
    }
    setIsWorkspaceDropdownOpen(false);
  };

  const getWorkspaceDisplayName = (path: string) => {
    if (!path) return workspaceName;
    const parts = path.split(/[\\/]/);
    return parts[parts.length - 1] || workspaceName;
  };

  // Render the header of the file tree
  const renderFileTreeHeader = () => {
    return (
      <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
        <div className="relative mb-2">
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full text-left px-3 py-2 bg-muted hover:bg-muted/80 focus:outline-none focus:bg-muted/90 focus:ring-2 focus:ring-primary rounded-md text-sm font-medium flex justify-between items-center"
          >
            <span>{getWorkspaceDisplayName(currentWorkspace) || 'Select Workspace'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isWorkspaceDropdownOpen && (
            <div className="absolute mt-1 w-full bg-background border border-border rounded-md shadow-lg z-20">
              {recentWorkspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => handleWorkspaceChange(ws)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/50"
                >
                  {getWorkspaceDisplayName(ws)}
                </button>
              ))}
              <button
                onClick={() => handleWorkspaceChange('__browse__')}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/50 border-t border-border"
              >
                Browse...
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-start gap-1">
          <button
            onClick={() => startCreatingFile(currentWorkspace || '')}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => startCreatingFolder(currentWorkspace || '')}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => loadFiles(currentWorkspace)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={collapseAllFolders}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            title="Collapse All Folders"
          >
            <FolderX className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-1 text-sm bg-muted/30 border border-border rounded-md focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    );
  };

  if (state.loading) {
    return (
      <div className="w-full bg-card border-r border-border h-full flex flex-col">
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
      <div className="w-full bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Folder className="w-4 h-4" />
            {workspaceName}
          </h2>
          <button
            onClick={() => loadFiles(currentWorkspace)}
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
                  onClick={() => loadFiles(currentWorkspace)}
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
      <div className="w-full bg-card border-r border-border h-full flex flex-col">
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
              onClick={() => loadFiles(currentWorkspace)}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createNewItem(e); // Pass event if needed, or just call directly
                    } else if (e.key === 'Escape') {
                      cancelNewItem();
                    }
                  }}
                  onBlur={cancelNewItem} // Keep onBlur as a fallback
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
    <div className="h-full flex flex-col bg-background text-foreground select-none text-sm" onContextMenu={showRootContextMenu}>
      {renderFileTreeHeader()}
      
      {state.loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading workspace...</p>
          </div>
        </div>
      )}
      
      {state.error && (
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
                  onClick={() => loadFiles(currentWorkspace)}
                  className="inline-flex items-center gap-2 text-xs bg-destructive/20 text-destructive px-3 py-1.5 rounded-md hover:bg-destructive/30 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {state.files.length > 0 && (
        <div className="flex-1 overflow-auto">
          <div className="py-2">
            {(searchTerm ? filterFiles(state.files) : state.files).map((item) =>
              renderFileItem(item)
            )}
          </div>
        </div>
      )}
      
      {state.files.length > 0 && (
        <div ref={contextMenuRef}>{renderContextMenu()}</div>
      )}
    </div>
  );
};

export default FileExplorer;