import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAppStore, useTheme, useFiles, useChat, useLayout, useTools, useSubjectMode, FileNode } from '../../stores/app-store';
import { useLLMStore } from '../../stores/llm-store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
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
  Brain
} from 'lucide-react';
import { cn, formatTimeAgo, formatFileSize, truncateText } from '../../lib/utils';
import { fileService, FileContent, FileInfo, getFileTypeIcon } from '../../services/file-service';
import { LLMStatus } from '../llm/llm-status';

// Type definitions
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tools?: string[];
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

// Helper function to convert FileInfo to FileNode (matching store interface)
const fileInfoToFileNode = (fileInfo: FileInfo, parentPath: string = ''): FileNode => {
  return {
    id: `${parentPath}/${fileInfo.name}`.replace(/^\//, ''),
    name: fileInfo.name,
    type: fileInfo.type === 'directory' ? 'folder' : 'file', // Convert directory to folder for store compatibility
    path: fileInfo.path,
    size: fileInfo.size,
    modified: fileInfo.modified,
    children: [],
    isExpanded: false
  };
};

// Main IDE Layout Component
export const ModernIDELayout: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { files, selectedFile, setFiles, setSelectedFile } = useFiles();
  const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useLayout();
  const { showToolSelector, setShowToolSelector } = useTools();
  const { currentSubjectMode, setCurrentSubjectMode } = useSubjectMode();
  const { 
    currentModel, 
    isConnected, 
    sendMessage: sendLLMMessage, 
    isStreaming, 
    streamingMessage,
    currentSession,
    createNewSession
  } = useLLMStore();
  
  const [inputMessage, setInputMessage] = useState('');
  const darkMode = theme === 'dark';
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);

  // Load real file content when file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      setIsFileLoading(true);
      fileService.readFile(selectedFile.path)
        .then(content => setFileContent(content))
        .catch(err => {
          console.error('Failed to load file content:', err);
          setFileContent(null);
        })
        .finally(() => setIsFileLoading(false));
    } else {
      setFileContent(null);
      setIsFileLoading(false);
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
          const fileNodes = rootFiles.map(file => fileInfoToFileNode(file));
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

  // File tree handlers
  const handleFileSelect = (node: FileNode) => {
    setSelectedFile(node);
    if (node.type === 'file') {
      setActiveTab('editor');
    }
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
      const childNodes = childFiles.map(file => fileInfoToFileNode(file, node.path));
      
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
    <div className={cn("ide-layout", darkMode && "dark")}>
      {/* Navigation Bar */}
      <div className="ide-navigation border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-tanuki-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="font-semibold">TanukiMCP <span className="tanuki-gradient">Atlas</span></span>
            </div>
            
            {/* Menu Items */}
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm">File</Button>
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Tools</Button>
              <Button variant="ghost" size="sm">Window</Button>
              <Button variant="ghost" size="sm">Help</Button>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(darkMode ? 'light' : 'dark')}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="ide-content flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar */}
          <ResizablePanel 
            defaultSize={sidebarCollapsed ? 3 : 20} 
            minSize={3} 
            maxSize={30}
            className={cn("panel-container transition-all duration-200")}
          >
          {!sidebarCollapsed && (
            <>
              <div className="panel-header flex items-center justify-between">
                <span>Explorer</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSidebarCollapsed(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="panel-content">
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Files</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[300px]">
                    {files.map(node => (
                      <FileTreeItem
                        key={node.id}
                        node={node}
                        onSelect={handleFileSelect}
                        onToggle={handleToggleFolder}
                        onLoadChildren={handleLoadChildren}
                      />
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="border-t p-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Subject Modes</div>
                  <div className="space-y-1">
                    {[
                      { icon: '🎯', label: 'Mathematics', active: true },
                      { icon: '💻', label: 'Programming', active: false },
                      { icon: '🔬', label: 'Science', active: false },
                      { icon: '🗣️', label: 'Languages', active: false }
                    ].map(mode => (
                      <Button
                        key={mode.label}
                        variant={mode.active ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                      >
                        <span className="mr-2">{mode.icon}</span>
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {sidebarCollapsed && (
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Panel */}
          <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                Workflows
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      TanukiMCP Assistant
                    </CardTitle>
                    <LLMStatus />
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    {(!currentSession?.messages || currentSession.messages.length === 0) ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-4 max-w-md">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              Welcome to TanukiMCP Assistant
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Your local-first AI assistant is ready to help. Start a conversation to:
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <Code className="w-4 h-4 text-orange-500" />
                              <span>Write & analyze code</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <FileText className="w-4 h-4 text-orange-500" />
                              <span>Manage files</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <Workflow className="w-4 h-4 text-orange-500" />
                              <span>Create workflows</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                              <Brain className="w-4 h-4 text-orange-500" />
                              <span>Solve problems</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isConnected && currentModel ? (
                              <>Connected to <span className="font-medium text-orange-500">{currentModel}</span></>
                            ) : (
                              <span className="text-amber-500">⚠️ No model selected - check connection</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {currentSession?.messages.map((message, index) => {
                          const chatMessage: ChatMessage = {
                            id: `${currentSession.id}-${index}`,
                            type: message.role === 'user' ? 'user' : 'assistant',
                            content: message.content,
                            timestamp: new Date(),
                            streaming: false
                          };
                          return <ChatMessageComponent key={chatMessage.id} message={chatMessage} />;
                        })}
                        {isStreaming && streamingMessage && (
                          <ChatMessageComponent 
                            key="streaming" 
                            message={{
                              id: 'streaming',
                              type: 'assistant',
                              content: streamingMessage,
                              timestamp: new Date(),
                              streaming: true
                            }} 
                          />
                        )}
                      </>
                    )}
                  </ScrollArea>
                  
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={
                          !isConnected || !currentModel 
                            ? "Select a model to start chatting..." 
                            : "Type your message... (use @ for tools)"
                        }
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={!isConnected || !currentModel || isStreaming}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim() || !isConnected || !currentModel || isStreaming}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {isStreaming ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Actions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </span>
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{selectedFile.path}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(selectedFile.modified)}</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">File content preview:</p>
                        {isFileLoading ? (
                          <div className="text-sm text-muted-foreground">Loading file content...</div>
                        ) : fileContent ? (
                          <pre className="text-sm bg-background p-3 rounded border overflow-auto whitespace-pre-wrap break-words">
                            {fileContent.content}
                          </pre>
                        ) : (
                          <div className="text-sm text-muted-foreground">No file content available</div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="default">
                          <Play className="w-4 h-4 mr-2" />
                          Run
                        </Button>
                        <Button variant="outline">
                          Save
                        </Button>
                        <Button variant="outline">
                          Format
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      Select a file from the explorer to edit
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="flex-1">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Workflow Manager</span>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Workflow
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Project Analysis', description: 'Analyze project structure and create development plan', icon: <BarChart3 className="w-5 h-5" />, status: 'Ready' },
                      { name: 'Code Review', description: 'Automated code review with suggestions', icon: <GitBranch className="w-5 h-5" />, status: 'Active' },
                      { name: 'Data Pipeline', description: 'ETL data processing workflow', icon: <Activity className="w-5 h-5" />, status: 'Ready' }
                    ].map(workflow => (
                      <Card key={workflow.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-tanuki-500/10 rounded-lg">
                              {workflow.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{workflow.name}</h3>
                              <p className="text-sm text-muted-foreground">{workflow.description}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded",
                              workflow.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            )}>
                              {workflow.status}
                            </span>
                            <Button variant="outline" size="sm">
                              <Play className="w-3 h-3 mr-1" />
                              Run
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Secondary Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="panel-container">
          <div className="panel-header">
            <span>Tools & Analytics</span>
          </div>
          <div className="panel-content">
            <Tabs defaultValue="tools" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tools" className="space-y-3">
                <div className="p-2">
                  <Input placeholder="Search tools..." className="mb-3" />
                  
                  {Object.entries(
                    availableTools.reduce((acc, tool) => {
                      if (!acc[tool.category]) acc[tool.category] = [];
                      acc[tool.category].push(tool);
                      return acc;
                    }, {} as Record<string, Tool[]>)
                  ).map(([category, tools]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h4>
                      {tools.map(tool => (
                        <div key={tool.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-pointer">
                          {tool.icon}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-3">
                <div className="p-2 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Usage Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Messages today</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tools executed</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Files modified</span>
                        <span className="font-medium">5</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { action: 'Created todolist', time: '2 min ago' },
                        { action: 'Modified App.tsx', time: '5 min ago' },
                        { action: 'Ran code analysis', time: '10 min ago' }
                      ].map((activity, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{activity.action}</span>
                          <span className="text-xs">{activity.time}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="ide-status-bar border-t bg-card/30">
        <div className="flex items-center justify-between px-4 py-1">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
            <span>🎯 Mathematics Mode</span>
            <span>💾 All files saved</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Ready</span>
            <span>Line 1, Col 1</span>
            <span>UTF-8</span>
          </div>
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