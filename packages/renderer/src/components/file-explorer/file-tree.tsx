import React, { useState, useEffect } from 'react';
import { fileService, FileInfo } from '../../services/file-service';

interface FileTreeProps {
  onFileSelect?: (file: FileInfo) => void;
}

export const FileExplorer: React.FC<FileTreeProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [fileStructure, setFileStructure] = useState<FileInfo[]>([]);
  const [loadedDirectories, setLoadedDirectories] = useState<Map<string, FileInfo[]>>(new Map());

  // Load root directory on mount
  useEffect(() => {
    loadDirectory('');
  }, []);

  const loadDirectory = async (path: string) => {
    try {
      const files = await fileService.listDirectory(path);
      if (path === '') {
        setFileStructure(files);
      }
      setLoadedDirectories(prev => new Map(prev).set(path, files));
    } catch (error) {
      console.error('Failed to load directory:', error);
    }
  };

  const handleFileClick = async (item: FileInfo) => {
    if (item.type === 'file') {
      setSelectedFile(item.path);
      onFileSelect?.(item);
      console.log('File selected:', item.path);
    } else {
      // Toggle folder expansion
      const newExpanded = new Set(expandedFolders);
      if (expandedFolders.has(item.path)) {
        newExpanded.delete(item.path);
      } else {
        newExpanded.add(item.path);
        // Load directory contents if not already loaded
        if (!loadedDirectories.has(item.path)) {
          await loadDirectory(item.path);
        }
      }
      setExpandedFolders(newExpanded);
    }
  };

  const getFileIcon = (item: FileInfo) => {
    if (item.type === 'directory') {
      return expandedFolders.has(item.path) ? '📂' : '📁';
    }
    if (item.extension === 'tsx' || item.extension === 'ts') return '⚛️';
    if (item.extension === 'json') return '⚙️';
    if (item.extension === 'md') return '📝';
    if (item.extension === 'css') return '🎨';
    return '📄';
  };

  const renderFileItem = (item: FileInfo, level: number = 0) => {
    const isSelected = selectedFile === item.path;
    const isExpanded = expandedFolders.has(item.path);
    const children = loadedDirectories.get(item.path) || [];
    
    return (
      <div key={item.path}>
        <div 
          className={`file-item ${item.type} ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => handleFileClick(item)}
        >
          <span style={{ 
            fontSize: '14px', 
            color: item.type === 'directory' 
              ? 'var(--color-accent-secondary)' 
              : item.extension === 'tsx' || item.extension === 'ts'
                ? 'var(--color-accent)'
                : 'var(--color-text-muted)'
          }}>
            {getFileIcon(item)}
          </span>
          <span>{item.name}</span>
          {item.type === 'file' && item.size && (
            <span style={{
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              marginLeft: 'auto',
              opacity: 0.7
            }}>
              {(item.size / 1024).toFixed(1)}KB
            </span>
          )}
        </div>
        
        {item.type === 'directory' && isExpanded && children.length > 0 && (
          <div>
            {children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="file-tree custom-scrollbar">
        {fileStructure.map(item => renderFileItem(item))}
      </div>
      {selectedFile && (
        <div style={{
          padding: '12px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-tertiary)',
          fontSize: '12px',
          color: 'var(--color-text-muted)'
        }}>
          Selected: {selectedFile}
        </div>
      )}
    </div>
  );
};