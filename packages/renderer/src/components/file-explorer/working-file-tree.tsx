import React, { useState } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  icon: string;
  children?: FileItem[];
  size?: string;
}

interface WorkingFileTreeProps {
  onFileSelect?: (file: FileItem) => void;
}

const MOCK_FILE_STRUCTURE: FileItem[] = [
  {
    name: 'src',
    type: 'directory',
    icon: '📁',
    children: [
      {
        name: 'components',
        type: 'directory',
        icon: '📁',
        children: [
          { name: 'App.tsx', type: 'file', icon: '⚛️', size: '2.1KB' },
          { name: 'Chat.tsx', type: 'file', icon: '⚛️', size: '4.5KB' }
        ]
      },
      { name: 'main.tsx', type: 'file', icon: '⚛️', size: '1.2KB' },
      { name: 'index.css', type: 'file', icon: '🎨', size: '3.4KB' }
    ]
  },
  {
    name: 'public',
    type: 'directory',
    icon: '📁',
    children: [
      { name: 'index.html', type: 'file', icon: '🌐', size: '0.8KB' }
    ]
  },
  { name: 'package.json', type: 'file', icon: '⚙️', size: '1.2KB' },
  { name: 'tsconfig.json', type: 'file', icon: '⚙️', size: '0.6KB' },
  { name: 'vite.config.ts', type: 'file', icon: '⚛️', size: '0.9KB' },
  { name: 'README.md', type: 'file', icon: '📝', size: '2.3KB' }
];

export const WorkingFileTree: React.FC<WorkingFileTreeProps> = ({ onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');

  const handleItemClick = (item: FileItem, path: string) => {
    if (item.type === 'directory') {
      const newExpanded = new Set(expandedFolders);
      if (expandedFolders.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedFolders(newExpanded);
    } else {
      setSelectedFile(path);
      onFileSelect?.(item);
    }
  };

  const renderFileItem = (item: FileItem, level: number = 0, parentPath: string = '') => {
    const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
    const isExpanded = expandedFolders.has(currentPath);
    const isSelected = selectedFile === currentPath;

    return (
      <div key={currentPath}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            paddingLeft: `${level * 20 + 12}px`,
            cursor: 'pointer',
            borderRadius: '4px',
            margin: '1px 8px',
            backgroundColor: isSelected ? '#2563eb' : 'transparent',
            color: isSelected ? 'white' : 'inherit',
            transition: 'all 0.15s ease',
            fontSize: '13px'
          }}
          onClick={() => handleItemClick(item, currentPath)}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '14px', minWidth: '16px' }}>
            {item.type === 'directory' ? (isExpanded ? '📂' : '📁') : item.icon}
          </span>
          <span style={{ flex: 1 }}>{item.name}</span>
          {item.size && (
            <span style={{ 
              fontSize: '10px', 
              opacity: 0.7,
              color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280'
            }}>
              {item.size}
            </span>
          )}
        </div>

        {item.type === 'directory' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileItem(child, level + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
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
        padding: '8px 0'
      }}>
        {MOCK_FILE_STRUCTURE.map(item => renderFileItem(item))}
      </div>

      {/* Footer */}
      {selectedFile && (
        <div style={{
          padding: '8px 12px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          fontSize: '11px',
          color: '#6b7280',
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