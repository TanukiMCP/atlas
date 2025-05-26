import React, { useState, useEffect } from 'react';
import { fileService, FileInfo } from '../../services/file-service';

interface EnhancedFileTreeProps {
  onFileSelect?: (file: FileInfo) => void;
}

export const EnhancedFileTree: React.FC<EnhancedFileTreeProps> = ({ onFileSelect }) => {
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
    if (item.extension === 'js' || item.extension === 'jsx') return '🟨';
    if (item.extension === 'html') return '🌐';
    if (item.extension === 'png' || item.extension === 'jpg' || item.extension === 'jpeg') return '🖼️';
    return '📄';
  };

  const renderFileItem = (item: FileInfo, level: number = 0) => {
    const isSelected = selectedFile === item.path;
    const isExpanded = expandedFolders.has(item.path);
    const children = loadedDirectories.get(item.path) || [];
    
    return (
      <React.Fragment key={item.path}>
        <div 
          className={`file-item ${item.type} ${isSelected ? 'selected' : ''}`}
          style={{ 
            paddingLeft: `${level * 24 + 12}px`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontSize: '13px',
            fontWeight: item.type === 'directory' ? '500' : '400',
            backgroundColor: isSelected 
              ? 'var(--color-accent)' 
              : 'transparent',
            color: isSelected 
              ? 'white' 
              : item.type === 'directory' 
                ? 'var(--color-text-primary)' 
                : 'var(--color-text-secondary)',
            marginBottom: '2px'
          }}
          onClick={() => handleFileClick(item)}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ 
            fontSize: '14px', 
            minWidth: '18px',
            textAlign: 'center'
          }}>
            {getFileIcon(item)}
          </span>
          
          <span style={{ flex: 1 }}>
            {item.name}
          </span>
          
          {item.type === 'file' && item.size && (
            <span style={{
              fontSize: '10px',
              color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)',
              opacity: 0.8
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
      </React.Fragment>
    );
  };

  return (
    <div 
      className="file-explorer-container"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-primary)',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>📁</span>
        <span>File Explorer</span>
      </div>

      {/* File Tree */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {fileStructure.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '13px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
            <div>Loading project files...</div>
          </div>
        ) : (
          fileStructure.map(item => renderFileItem(item))
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-tertiary)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>📎</span>
          <span>Selected: {selectedFile}</span>
        </div>
      )}
    </div>
  );
};