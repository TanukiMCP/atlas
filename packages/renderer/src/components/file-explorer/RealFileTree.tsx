import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen 
} from 'lucide-react';

interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  path: string;
}

interface RealFileTreeProps {
  onFileSelect: (fileName: string) => void;
}

export const RealFileTree: React.FC<RealFileTreeProps> = ({ onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Mock file tree structure
  const fileTree: FileTreeNode[] = [
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
        { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
        { name: 'index.css', type: 'file', path: 'src/index.css' },
        {
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            {
              name: 'editor',
              type: 'folder',
              path: 'src/components/editor',
              children: [
                { name: 'CodeEditor.tsx', type: 'file', path: 'src/components/editor/CodeEditor.tsx' }
              ]
            },
            {
              name: 'chat',
              type: 'folder',
              path: 'src/components/chat',
              children: [
                { name: 'EnhancedChatInterface.tsx', type: 'file', path: 'src/components/chat/EnhancedChatInterface.tsx' }
              ]
            },
            {
              name: 'toolbar',
              type: 'folder',
              path: 'src/components/toolbar',
              children: [
                { name: 'PrimaryMenuBar.tsx', type: 'file', path: 'src/components/toolbar/PrimaryMenuBar.tsx' },
                { name: 'ContextualToolbar.tsx', type: 'file', path: 'src/components/toolbar/ContextualToolbar.tsx' }
              ]
            }
          ]
        },
        {
          name: 'services',
          type: 'folder',
          path: 'src/services',
          children: [
            { name: 'OpenRouterService.ts', type: 'file', path: 'src/services/OpenRouterService.ts' },
            { name: 'ChatService.ts', type: 'file', path: 'src/services/ChatService.ts' },
            { name: 'mcp-client.ts', type: 'file', path: 'src/services/mcp-client.ts' }
          ]
        }
      ]
    },
    {
      name: 'docs',
      type: 'folder',
      path: 'docs',
      children: [
        { name: 'README.md', type: 'file', path: 'docs/README.md' },
        { name: 'ui-wireframes-detailed.md', type: 'file', path: 'docs/ui-wireframes-detailed.md' }
      ]
    }
  ];

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (node: FileTreeNode) => {
    if (node.type === 'file') {
      setSelectedFile(node.name);
      onFileSelect(node.name);
    } else {
      toggleFolder(node.path);
    }
  };

  const renderNode = (node: FileTreeNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.name;
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-muted/50 transition-colors ${
            isSelected ? 'bg-primary/20 text-primary' : ''
          }`}
          style={{ paddingLeft }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" /> {/* Spacer for alignment */}
              <File className="w-4 h-4 text-gray-500" />
            </>
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Folder className="w-4 h-4" />
          File Explorer
        </h3>
      </div>
      <div className="p-2">
        {fileTree.map(node => renderNode(node))}
      </div>
    </div>
  );
};