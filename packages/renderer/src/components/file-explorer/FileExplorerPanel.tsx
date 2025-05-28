import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Folder, 
  File, 
  FolderOpen, 
  Plus, 
  MoreHorizontal,
  Search,
  RefreshCw
} from 'lucide-react';

interface FileExplorerPanelProps {
  onFileSelect: (file: string) => void;
  onViewChange: (view: string) => void;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  expanded?: boolean;
}

export const FileExplorerPanel: React.FC<FileExplorerPanelProps> = ({
  onFileSelect,
  onViewChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      path: '/src',
      expanded: true,
      children: [
        {
          name: 'components',
          type: 'folder',
          path: '/src/components',
          expanded: true,
          children: [
            { name: 'App.tsx', type: 'file', path: '/src/components/App.tsx' },
            { name: 'chat', type: 'folder', path: '/src/components/chat', children: [] },
            { name: 'ui', type: 'folder', path: '/src/components/ui', children: [] }
          ]
        },
        { name: 'main.tsx', type: 'file', path: '/src/main.tsx' },
        { name: 'index.css', type: 'file', path: '/src/index.css' }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      path: '/package.json'
    },
    {
      name: 'README.md',
      type: 'file',
      path: '/README.md'
    }
  ]);

  const toggleFolder = (path: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === path && node.type === 'folder') {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateNode(fileTree));
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const indent = depth * 16;
    
    return (
      <div key={node.path}>
        <div 
          className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer rounded text-sm`}
          style={{ paddingLeft: `${8 + indent}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'folder' ? (
            node.expanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && node.expanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs bg-muted/30 border border-border rounded focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {fileTree
            .filter(node => 
              searchTerm === '' || 
              node.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(node => renderFileNode(node))
          }
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onViewChange('editor')}
          >
            New File
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onViewChange('settings')}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};