import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAppStore, useFiles, useChat, useLayout, useTools, useSubjectMode, FileNode } from '../../stores/app-store';
import { useLLMStore } from '../../stores/llm-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  MessageCircle, 
  FileText, 
  Settings, 
  Search, 
  Play, 
  Folder, 
  Home,
  Monitor,
  Workflow,
  Bot,
  BarChart3,
  Plus,
  Menu,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  ChevronRight,
  File,
  Terminal,
  GitBranch,
  BookOpen,
  HelpCircle,
  Zap,
  Send,
  Paperclip,
  MoreHorizontal,
  FolderOpen,
  Code2,
  Layers,
  Activity,
  Component,
  Braces,
  Palette,
  Globe,
  Image,
  Archive,
  RefreshCw,
  AlertCircle,
  Loader2,
  MessageSquare,
  Code,
  Brain,
  Save
} from 'lucide-react';
import { cn, formatTimeAgo, formatFileSize, truncateText } from '../../lib/utils';
import { fileService, FileContent, FileInfo, getFileTypeIcon } from '../../services/file-service';
import { LLMStatus } from '../llm/llm-status';
import { MCPServersTab } from '../mcp/MCPServersTab';
import { MCPAvailableToolsTab } from '../mcp/MCPAvailableToolsTab';
import MonacoEditor from '../MonacoEditor';
import { ViewType, FileSystemItem, TanukiModel } from '../../types';
import FileExplorer from '../FileExplorer';
import ToolsPanel from '../ToolsPanel';
import StatusBar from '../StatusBar';
import Header from '../Header';
import OpenRouterModelHub from '../llm/OpenRouterModelHub';
import LocalLLMHub from '../llm/LocalLLMHub';
import ModelManagementHub from '../ModelManagementHub';
import IntegratedTerminal from './IntegratedTerminal';

// Type definitions
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tools?: string[];
  streaming?: boolean;
}

// Use FileNode from store (type: 'file' | 'folder')

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

// Icon mapping helper using lucide-react icons
const getFileIcon = (fileName: string, isDirectory: boolean = false, isExpanded: boolean = false) => {
  if (isDirectory) {
    return isExpanded ? <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-500" /> : <Folder className="w-4 h-4 flex-shrink-0 text-blue-500" />;
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'tsx':
    case 'jsx':
      return <Component className="w-4 h-4 flex-shrink-0 text-blue-400" />;
    case 'ts':
    case 'js':
      return <Code2 className="w-4 h-4 flex-shrink-0 text-yellow-500" />;
    case 'json':
      return <Braces className="w-4 h-4 flex-shrink-0 text-green-500" />;
    case 'md':
      return <FileText className="w-4 h-4 flex-shrink-0 text-gray-500" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <Palette className="w-4 h-4 flex-shrink-0 text-pink-500" />;
    case 'html':
      return <Globe className="w-4 h-4 flex-shrink-0 text-orange-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <Image className="w-4 h-4 flex-shrink-0 text-purple-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="w-4 h-4 flex-shrink-0 text-brown-500" />;
    case 'gitignore':
    case 'env':
      return <Settings className="w-4 h-4 flex-shrink-0 text-gray-400" />;
    default:
      return <File className="w-4 h-4 flex-shrink-0 text-gray-400" />;
  }
};

const availableTools: Tool[] = [
  { id: 'read_file', name: 'read_file', description: 'Read file contents with pagination', icon: <FileText className="w-4 h-4" />, category: 'File Operations' },
  { id: 'write_file', name: 'write_file', description: 'Write or edit files', icon: <Code2 className="w-4 h-4" />, category: 'File Operations' },
  { id: 'search_files', name: 'search_files', description: 'Find files by pattern', icon: <Search className="w-4 h-4" />, category: 'File Operations' },
  { id: 'create_todolist', name: 'create_todolist', description: 'Break down complex tasks', icon: <Layers className="w-4 h-4" />, category: 'Task Management' },
  { id: 'execute_task', name: 'execute_task', description: 'Run specific tasks', icon: <Play className="w-4 h-4" />, category: 'Task Management' },
  { id: 'project_analysis', name: 'Project Analysis', description: 'Analyze project structure', icon: <BarChart3 className="w-4 h-4" />, category: 'Workflows' },
  { id: 'code_review', name: 'Code Review', description: 'Review code changes', icon: <GitBranch className="w-4 h-4" />, category: 'Workflows' }
];

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    content: 'Welcome to TanukiMCP Atlas! I\'m your AI assistant for local development with complete privacy. All processing happens on your machine.',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    type: 'user',
    content: 'Can you help me explore this project structure and understand the codebase?',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    type: 'assistant',
    content: 'I\'ll help you explore the TanukiMCP Atlas codebase! I can see this is a sophisticated AI IDE with real file system integration. Let me analyze the project structure for you.',
    timestamp: new Date(Date.now() - 180000),
    tools: ['project_analysis', 'read_file']
  }
];

// File Tree Component with real file system integration
const FileTreeItem: React.FC<{ 
  node: FileNode; 
  level?: number; 
  onSelect: (node: FileNode) => void;
  onToggle: (nodeId: string) => void;
  onLoadChildren: (node: FileNode) => Promise<void>;
  isLoading?: boolean;
}> = ({ node, level = 0, onSelect, onToggle, onLoadChildren, isLoading = false }) => {
  const isFile = node.type === 'file';
  const isFolder = node.type === 'folder';
  const hasChildren = node.children && node.children.length > 0;
  const [isExpanding, setIsExpanding] = useState(false);

  const handleToggle = async () => {
    if (isFile) return;
    
    setIsExpanding(true);
    try {
      if (!node.isExpanded && (!node.children || node.children.length === 0)) {
        await onLoadChildren(node);
      }
      onToggle(node.id);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded-sm hover:bg-accent/50 transition-colors",
          "file-tree-item"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => isFile ? onSelect(node) : handleToggle()}
      >
        {isFolder && (
          <button 
            className="flex-shrink-0 p-0 h-4 w-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            disabled={isExpanding}
          >
            {isExpanding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getFileIcon(node.name, isFolder, node.isExpanded)}
          <span className="truncate">{node.name}</span>
          {isFile && node.size && (
            <span className="text-xs text-muted-foreground ml-auto">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </div>
      
      {isFolder && node.isExpanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <FileTreeItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              onSelect={onSelect}
              onToggle={onToggle}
              onLoadChildren={onLoadChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Chat Message Component
const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={cn(
      "mb-4",
      isUser ? "flex justify-end" : "flex justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-lg px-4 py-2",
        isUser ? "bg-primary text-primary-foreground ml-auto" :
        isSystem ? "bg-muted text-muted-foreground text-center text-sm mx-auto max-w-fit" :
        "bg-card border mr-auto"
      )}>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {message.tools && message.tools.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Tools used:</span>
              {message.tools.map(tool => (
                <span key={tool} className="text-xs bg-muted px-2 py-1 rounded">
                  {tool}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTimeAgo(message.timestamp)}</span>
            {!isSystem && (
              <button className="hover:text-foreground">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Convert FileInfo to FileNode
const fileInfoToFileNode = (fileInfo: FileInfo): FileNode => {
  return {
    id: fileInfo.path,
    name: fileInfo.name,
    type: fileInfo.type === 'directory' ? 'folder' : 'file',
    path: fileInfo.path,
    size: fileInfo.size || 0,
    modified: fileInfo.modified,
    children: [],
    isExpanded: false
  };
};

interface ModernIDELayoutProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  files: FileNode[];
  currentFile: string | undefined;
  onFileSelect: (filePath: string) => void;
  fileContent: string;
  isFileLoading: boolean;
  isFileExplorerVisible: boolean;
  onFileExplorerToggle: () => void;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  agentMode: boolean;
  onAgentModeToggle: () => void;
  isProcessing: boolean;
  onStopProcessing: () => void;
  currentModel: TanukiModel | undefined;
  availableModels: TanukiModel[];
  isConnected: boolean;
  onModelSwitch: (model: TanukiModel | undefined) => void;
  onOpenModelHub: () => void;
  onOpenLocalLLMHub: () => void;
}

export const ModernIDELayout: React.FC<ModernIDELayoutProps> = ({
  currentView,
  onViewChange,
  files,
  currentFile,
  onFileSelect,
  fileContent,
  isFileLoading,
  isFileExplorerVisible,
  onFileExplorerToggle,
  subjectMode,
  onSubjectModeChange,
  agentMode,
  onAgentModeToggle,
  isProcessing,
  onStopProcessing,
  currentModel,
  availableModels,
  isConnected,
  onModelSwitch,
  onOpenModelHub,
  onOpenLocalLLMHub
}) => {
  const { theme, toggleTheme } = useTheme();
  const { files: appFiles, selectedFile, setFiles, setSelectedFile } = useFiles();
  const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useLayout();
  const { showToolSelector, setShowToolSelector } = useTools();
  const { currentSubjectMode, setCurrentSubjectMode } = useSubjectMode();
  const { 
    sendMessage: sendLLMMessage, 
    isStreaming, 
    streamingMessage,
    currentSession,
    createNewSession
  } = useLLMStore();
  
  const [inputMessage, setInputMessage] = useState('');
  const isDark = theme === 'dark';
  const [editorContent, setEditorContent] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);

  // Load real file content when file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      const loadContent = async () => {
        try {
          const content = await fileService.readFile(selectedFile.path);
          setEditorContent(content.content);
          setIsDirty(false);
        } catch (err) {
          console.error('Failed to load file content:', err);
          setEditorContent('');
        }
      };
      loadContent();
    } else {
      setEditorContent('');
    }
  }, [selectedFile]);

  // Initialize real file system on component mount
  useEffect(() => {
    const loadRootFiles = async () => {
      if (files.length === 0) {
        setIsLoadingFiles(true);
        setFileLoadError(null);
        try {
          const rootFiles = await fileService.listDirectory('');
          const fileNodes = rootFiles.map(fileInfo => {
            const node = fileInfoToFileNode(fileInfo);
            return {
              ...node,
              type: fileInfo.type === 'directory' ? 'folder' : 'file'
            } as FileNode;
          });
          setFiles(fileNodes);
        } catch (error) {
          console.error('Failed to load root directory:', error);
          setFileLoadError('Failed to load project files. Please check permissions.');
        } finally {
          setIsLoadingFiles(false);
        }
      }
    };

    loadRootFiles();
  }, [files.length, setFiles]);

  // Track dirty state
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file' && fileContent) {
      setIsDirty(editorContent !== fileContent);
    } else {
      setIsDirty(false);
    }
  }, [editorContent, fileContent, selectedFile]);

  // Convert incoming files to FileNodes and update state
  useEffect(() => {
    if (files.length > 0) {
      setFiles(files);
    }
  }, [files, setFiles]);

  // Helper to get Monaco language from file extension
  const getMonacoLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': case 'tsx': return 'typescript';
      case 'js': case 'jsx': return 'javascript';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'md': return 'markdown';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'xml': return 'xml';
      case 'yaml': case 'yml': return 'yaml';
      case 'sh': case 'bash': case 'zsh': return 'shell';
      default: return 'plaintext';
    }
  };

  // File tree handlers
  const handleFileSelect = (file: FileNode) => {
    onFileSelect(file.path);
  };

  const handleToggleFolder = (nodeId: string) => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setFiles(toggleNode(files));
  };

  // Load children for a directory node
  const handleLoadChildren = async (node: FileNode) => {
    if (node.type === 'file' || (node.children && node.children.length > 0)) {
      return;
    }

    try {
      const childFiles = await fileService.listDirectory(node.path);
      const childNodes = childFiles.map(file => fileInfoToFileNode(file));
      
      const updateNodeChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(n => {
          if (n.id === node.id) {
            return { ...n, children: childNodes };
          }
          if (n.children) {
            return { ...n, children: updateNodeChildren(n.children) };
          }
          return n;
        });
      };

      setFiles(updateNodeChildren(files));
    } catch (error) {
      console.error('Failed to load directory children:', error);
    }
  };

  // Chat handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageContent = inputMessage;
    setInputMessage('');

    // Check if model is selected
    if (!currentModel) {
      console.error('No model selected');
      return;
    }

    // Create session if none exists
    if (!currentSession) {
      createNewSession();
    }

    try {
      // Send message to real LLM - the LLM store handles adding messages to the session
      await sendLLMMessage(messageContent, (chunk: string) => {
        // Handle streaming response chunks
        console.log('Streaming chunk:', chunk);
      });
      
    } catch (error) {
      console.error('Failed to send message to LLM:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (inputMessage.endsWith('@')) {
      setShowToolSelector(true);
    }
  };

  // Tool selection handler
  const handleToolSelect = (tool: Tool) => {
    setInputMessage(prev => prev.replace(/@$/, `@${tool.name} `));
    setShowToolSelector(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header 
        currentView={currentView}
        onViewChange={onViewChange}
        currentModel={currentModel}
        availableModels={availableModels}
        isConnected={isConnected}
        onModelSwitch={onModelSwitch}
        onOpenModelHub={onOpenModelHub}
        onOpenLocalLLMHub={onOpenLocalLLMHub}
        onFileExplorerToggle={onFileExplorerToggle}
        isFileExplorerVisible={isFileExplorerVisible}
        subjectMode={subjectMode}
        onSubjectModeChange={onSubjectModeChange}
        agentMode={agentMode}
        onAgentModeToggle={onAgentModeToggle}
        isProcessing={isProcessing}
        onStopProcessing={onStopProcessing}
      />

      {/* Main Content Area with Resizable Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {isFileExplorerVisible && (
          <>
            <ResizablePanel 
              defaultSize={20} 
              minSize={15}
              maxSize={30}
              className="h-full"
            >
              <FileExplorer 
                files={files}
                selectedFile={currentFile}
                onFileSelect={handleFileSelect}
              />
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}

        {/* Main Content Panel */}
        <ResizablePanel defaultSize={isFileExplorerVisible ? 60 : 80} minSize={40}>
          <div className="flex-1 flex flex-col bg-background h-full">
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Main content rendering based on currentView */}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />
        
        {/* Tools Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ToolsPanel 
            operationalMode={agentMode ? 'agent' : 'chat'}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status bar */}
      <StatusBar
        connections={[
          {
            service: 'OpenRouter',
            status: isConnected ? 'connected' : 'disconnected',
            lastChecked: new Date()
          }
        ]}
        currentView={currentView}
        currentModel={currentModel}
        theme={theme}
        version="1.0.0"
      />

      {/* Window Controls */}
      <div className="absolute top-0 right-0 flex items-center gap-2 p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tool Selector Dialog */}
      <CommandDialog open={showToolSelector} onOpenChange={setShowToolSelector}>
        <CommandInput placeholder="Search tools and workflows..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          {Object.entries(
            availableTools.reduce((acc, tool) => {
              if (!acc[tool.category]) acc[tool.category] = [];
              acc[tool.category].push(tool);
              return acc;
            }, {} as Record<string, Tool[]>)
          ).map(([category, tools]) => (
            <CommandGroup key={category} heading={category}>
              {tools.map(tool => (
                <CommandItem key={tool.id} onSelect={() => handleToolSelect(tool)}>
                  <div className="flex items-center gap-2">
                    {tool.icon}
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}; 