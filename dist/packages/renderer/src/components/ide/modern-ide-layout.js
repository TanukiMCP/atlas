"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModernIDELayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("../ui/card");
const app_store_1 = require("../../stores/app-store");
const llm_store_1 = require("../../stores/llm-store");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const tabs_1 = require("../ui/tabs");
const scroll_area_1 = require("../ui/scroll-area");
const command_1 = require("../ui/command");
const resizable_1 = require("../ui/resizable");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../../lib/utils");
const file_service_1 = require("../../services/file-service");
const llm_status_1 = require("../llm/llm-status");
// Icon mapping helper using lucide-react icons
const getFileIcon = (fileName, isDirectory = false, isExpanded = false) => {
    if (isDirectory) {
        return isExpanded ? (0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4 flex-shrink-0 text-blue-500" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "w-4 h-4 flex-shrink-0 text-blue-500" });
    }
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'tsx':
        case 'jsx':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Component, { className: "w-4 h-4 flex-shrink-0 text-blue-400" });
        case 'ts':
        case 'js':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Code2, { className: "w-4 h-4 flex-shrink-0 text-yellow-500" });
        case 'json':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Braces, { className: "w-4 h-4 flex-shrink-0 text-green-500" });
        case 'md':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 flex-shrink-0 text-gray-500" });
        case 'css':
        case 'scss':
        case 'sass':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "w-4 h-4 flex-shrink-0 text-pink-500" });
        case 'html':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-4 h-4 flex-shrink-0 text-orange-500" });
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-4 h-4 flex-shrink-0 text-purple-500" });
        case 'zip':
        case 'rar':
        case '7z':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Archive, { className: "w-4 h-4 flex-shrink-0 text-brown-500" });
        case 'gitignore':
        case 'env':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4 flex-shrink-0 text-gray-400" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: "w-4 h-4 flex-shrink-0 text-gray-400" });
    }
};
const availableTools = [
    { id: 'read_file', name: 'read_file', description: 'Read file contents with pagination', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), category: 'File Operations' },
    { id: 'write_file', name: 'write_file', description: 'Write or edit files', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Code2, { className: "w-4 h-4" }), category: 'File Operations' },
    { id: 'search_files', name: 'search_files', description: 'Find files by pattern', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-4 h-4" }), category: 'File Operations' },
    { id: 'create_todolist', name: 'create_todolist', description: 'Break down complex tasks', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Layers, { className: "w-4 h-4" }), category: 'Task Management' },
    { id: 'execute_task', name: 'execute_task', description: 'Run specific tasks', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4" }), category: 'Task Management' },
    { id: 'project_analysis', name: 'Project Analysis', description: 'Analyze project structure', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4" }), category: 'Workflows' },
    { id: 'code_review', name: 'Code Review', description: 'Review code changes', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "w-4 h-4" }), category: 'Workflows' }
];
const sampleMessages = [
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
const FileTreeItem = ({ node, level = 0, onSelect, onToggle, onLoadChildren, isLoading = false }) => {
    const isFile = node.type === 'file';
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;
    const [isExpanding, setIsExpanding] = (0, react_1.useState)(false);
    const handleToggle = async () => {
        if (isFile)
            return;
        setIsExpanding(true);
        try {
            if (!node.isExpanded && (!node.children || node.children.length === 0)) {
                await onLoadChildren(node);
            }
            onToggle(node.id);
        }
        finally {
            setIsExpanding(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded-sm hover:bg-accent/50 transition-colors", "file-tree-item"), style: { paddingLeft: `${level * 12 + 8}px` }, onClick: () => isFile ? onSelect(node) : handleToggle(), children: [isFolder && ((0, jsx_runtime_1.jsx)("button", { className: "flex-shrink-0 p-0 h-4 w-4 flex items-center justify-center", onClick: (e) => {
                            e.stopPropagation();
                            handleToggle();
                        }, disabled: isExpanding, children: isExpanding ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-3 h-3 animate-spin" })) : node.isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-3 h-3" })) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [getFileIcon(node.name, isFolder, node.isExpanded), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: node.name }), isFile && node.size && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground ml-auto", children: (0, utils_1.formatFileSize)(node.size) }))] })] }), isFolder && node.isExpanded && hasChildren && ((0, jsx_runtime_1.jsx)("div", { children: node.children.map(child => ((0, jsx_runtime_1.jsx)(FileTreeItem, { node: child, level: level + 1, onSelect: onSelect, onToggle: onToggle, onLoadChildren: onLoadChildren }, child.id))) }))] }));
};
// Chat Message Component
const ChatMessageComponent = ({ message }) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("mb-4", isUser ? "flex justify-end" : "flex justify-start"), children: (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("max-w-[85%] rounded-lg px-4 py-2", isUser ? "bg-primary text-primary-foreground ml-auto" :
                isSystem ? "bg-muted text-muted-foreground text-center text-sm mx-auto max-w-fit" :
                    "bg-card border mr-auto"), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed", children: message.content }), message.tools && message.tools.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1 pt-2 border-t border-border/50", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground", children: "Tools used:" }), message.tools.map(tool => ((0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-muted px-2 py-1 rounded", children: tool }, tool)))] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: (0, utils_1.formatTimeAgo)(message.timestamp) }), !isSystem && ((0, jsx_runtime_1.jsx)("button", { className: "hover:text-foreground", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "w-3 h-3" }) }))] })] }) }) }));
};
// Helper function to convert FileInfo to FileNode (matching store interface)
const fileInfoToFileNode = (fileInfo, parentPath = '') => {
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
const ModernIDELayout = () => {
    const { theme, setTheme } = (0, app_store_1.useTheme)();
    const { files, selectedFile, setFiles, setSelectedFile } = (0, app_store_1.useFiles)();
    const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = (0, app_store_1.useLayout)();
    const { showToolSelector, setShowToolSelector } = (0, app_store_1.useTools)();
    const { currentSubjectMode, setCurrentSubjectMode } = (0, app_store_1.useSubjectMode)();
    const { currentModel, isConnected, sendMessage: sendLLMMessage, isStreaming, streamingMessage, currentSession, createNewSession } = (0, llm_store_1.useLLMStore)();
    const [inputMessage, setInputMessage] = (0, react_1.useState)('');
    const darkMode = theme === 'dark';
    const [fileContent, setFileContent] = (0, react_1.useState)(null);
    const [isFileLoading, setIsFileLoading] = (0, react_1.useState)(false);
    const [isLoadingFiles, setIsLoadingFiles] = (0, react_1.useState)(false);
    const [fileLoadError, setFileLoadError] = (0, react_1.useState)(null);
    // Load real file content when file is selected
    (0, react_1.useEffect)(() => {
        if (selectedFile && selectedFile.type === 'file') {
            setIsFileLoading(true);
            file_service_1.fileService.readFile(selectedFile.path)
                .then(content => setFileContent(content))
                .catch(err => {
                console.error('Failed to load file content:', err);
                setFileContent(null);
            })
                .finally(() => setIsFileLoading(false));
        }
        else {
            setFileContent(null);
            setIsFileLoading(false);
        }
    }, [selectedFile]);
    // Initialize real file system on component mount
    (0, react_1.useEffect)(() => {
        const loadRootFiles = async () => {
            if (files.length === 0) {
                setIsLoadingFiles(true);
                setFileLoadError(null);
                try {
                    const rootFiles = await file_service_1.fileService.listDirectory('');
                    const fileNodes = rootFiles.map(file => fileInfoToFileNode(file));
                    setFiles(fileNodes);
                }
                catch (error) {
                    console.error('Failed to load root directory:', error);
                    setFileLoadError('Failed to load project files. Please check permissions.');
                }
                finally {
                    setIsLoadingFiles(false);
                }
            }
        };
        loadRootFiles();
    }, [files.length, setFiles]);
    // File tree handlers
    const handleFileSelect = (node) => {
        setSelectedFile(node);
        if (node.type === 'file') {
            setActiveTab('editor');
        }
    };
    const handleToggleFolder = (nodeId) => {
        const toggleNode = (nodes) => {
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
    const handleLoadChildren = async (node) => {
        if (node.type === 'file' || (node.children && node.children.length > 0)) {
            return;
        }
        try {
            const childFiles = await file_service_1.fileService.listDirectory(node.path);
            const childNodes = childFiles.map(file => fileInfoToFileNode(file, node.path));
            const updateNodeChildren = (nodes) => {
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
        }
        catch (error) {
            console.error('Failed to load directory children:', error);
        }
    };
    // Chat handlers
    const handleSendMessage = async () => {
        if (!inputMessage.trim())
            return;
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
            await sendLLMMessage(messageContent, (chunk) => {
                // Handle streaming response chunks
                console.log('Streaming chunk:', chunk);
            });
        }
        catch (error) {
            console.error('Failed to send message to LLM:', error);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        if (inputMessage.endsWith('@')) {
            setShowToolSelector(true);
        }
    };
    // Tool selection handler
    const handleToolSelect = (tool) => {
        setInputMessage(prev => prev.replace(/@$/, `@${tool.name} `));
        setShowToolSelector(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("ide-layout", darkMode && "dark"), children: [(0, jsx_runtime_1.jsx)("div", { className: "ide-navigation border-b bg-card/50 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded bg-tanuki-500 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-xs font-bold", children: "T" }) }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold", children: ["TanukiMCP ", (0, jsx_runtime_1.jsx)("span", { className: "tanuki-gradient", children: "Atlas" })] })] }), (0, jsx_runtime_1.jsxs)("nav", { className: "hidden md:flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "File" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "Edit" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "View" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "Tools" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "Window" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: "Help" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: () => setTheme(darkMode ? 'light' : 'dark'), children: darkMode ? (0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minimize2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "ide-content flex-1", children: (0, jsx_runtime_1.jsxs)(resizable_1.ResizablePanelGroup, { direction: "horizontal", className: "h-full", children: [(0, jsx_runtime_1.jsxs)(resizable_1.ResizablePanel, { defaultSize: sidebarCollapsed ? 3 : 20, minSize: 3, maxSize: 30, className: (0, utils_1.cn)("panel-container transition-all duration-200"), children: [!sidebarCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel-header flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Explorer" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: () => setSidebarCollapsed(true), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Files" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "h-6 w-6", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3 h-3" }) })] }), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-[300px]", children: files.map(node => ((0, jsx_runtime_1.jsx)(FileTreeItem, { node: node, onSelect: handleFileSelect, onToggle: handleToggleFolder, onLoadChildren: handleLoadChildren }, node.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: "Subject Modes" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: [
                                                                { icon: '🎯', label: 'Mathematics', active: true },
                                                                { icon: '💻', label: 'Programming', active: false },
                                                                { icon: '🔬', label: 'Science', active: false },
                                                                { icon: '🗣️', label: 'Languages', active: false }
                                                            ].map(mode => ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: mode.active ? "secondary" : "ghost", size: "sm", className: "w-full justify-start", children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: mode.icon }), mode.label] }, mode.label))) })] })] })] })), sidebarCollapsed && ((0, jsx_runtime_1.jsx)("div", { className: "p-2", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", onClick: () => setSidebarCollapsed(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-4 h-4" }) }) }))] }), (0, jsx_runtime_1.jsx)(resizable_1.ResizableHandle, { withHandle: true }), (0, jsx_runtime_1.jsx)(resizable_1.ResizablePanel, { defaultSize: 60, minSize: 40, className: "flex flex-col", children: (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-3", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "chat", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "w-4 h-4" }), "Chat"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "editor", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code2, { className: "w-4 h-4" }), "Editor"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "workflow", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Workflow, { className: "w-4 h-4" }), "Workflows"] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "chat", className: "flex-1 flex flex-col", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-5 h-5" }), "TanukiMCP Assistant"] }), (0, jsx_runtime_1.jsx)(llm_status_1.LLMStatus, {})] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "flex-1 pr-4", children: (!currentSession?.messages || currentSession.messages.length === 0) ? ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4 max-w-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-8 h-8 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-foreground", children: "Welcome to TanukiMCP Assistant" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Your local-first AI assistant is ready to help. Start a conversation to:" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-muted/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "w-4 h-4 text-orange-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Write & analyze code" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-muted/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-orange-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Manage files" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-muted/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Workflow, { className: "w-4 h-4 text-orange-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Create workflows" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-muted/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "w-4 h-4 text-orange-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Solve problems" })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: isConnected && currentModel ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Connected to ", (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-orange-500", children: currentModel })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-amber-500", children: "\u26A0\uFE0F No model selected - check connection" })) })] }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [currentSession?.messages.map((message, index) => {
                                                                        const chatMessage = {
                                                                            id: `${currentSession.id}-${index}`,
                                                                            type: message.role === 'user' ? 'user' : 'assistant',
                                                                            content: message.content,
                                                                            timestamp: new Date(),
                                                                            streaming: false
                                                                        };
                                                                        return (0, jsx_runtime_1.jsx)(ChatMessageComponent, { message: chatMessage }, chatMessage.id);
                                                                    }), isStreaming && streamingMessage && ((0, jsx_runtime_1.jsx)(ChatMessageComponent, { message: {
                                                                            id: 'streaming',
                                                                            type: 'assistant',
                                                                            content: streamingMessage,
                                                                            timestamp: new Date(),
                                                                            streaming: true
                                                                        } }, "streaming"))] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t pt-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: !isConnected || !currentModel
                                                                                ? "Select a model to start chatting..."
                                                                                : "Type your message... (use @ for tools)", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyPress: handleKeyPress, className: "flex-1", disabled: !isConnected || !currentModel || isStreaming }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleSendMessage, disabled: !inputMessage.trim() || !isConnected || !currentModel || isStreaming, className: "bg-orange-500 hover:bg-orange-600", children: isStreaming ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Paperclip, { className: "w-4 h-4 mr-2" }), "Attach"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4 mr-2" }), "Quick Actions"] })] })] })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "editor", className: "flex-1", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: selectedFile ? selectedFile.name : 'No file selected' }), selectedFile && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: selectedFile.path }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: (0, utils_1.formatTimeAgo)(selectedFile.modified) })] }))] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: selectedFile ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-muted p-4 rounded-lg", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mb-2", children: "File content preview:" }), isFileLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Loading file content..." })) : fileContent ? ((0, jsx_runtime_1.jsx)("pre", { className: "text-sm bg-background p-3 rounded border overflow-auto whitespace-pre-wrap break-words", children: fileContent.content })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "No file content available" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "default", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4 mr-2" }), "Run"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", children: "Save" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", children: "Format" })] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32 text-muted-foreground", children: "Select a file from the explorer to edit" })) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "workflow", className: "flex-1", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Workflow Manager" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-2" }), "New Workflow"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                                                            { name: 'Project Analysis', description: 'Analyze project structure and create development plan', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-5 h-5" }), status: 'Ready' },
                                                            { name: 'Code Review', description: 'Automated code review with suggestions', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "w-5 h-5" }), status: 'Active' },
                                                            { name: 'Data Pipeline', description: 'ETL data processing workflow', icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-5 h-5" }), status: 'Ready' }
                                                        ].map(workflow => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "cursor-pointer hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-tanuki-500/10 rounded-lg", children: workflow.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: workflow.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: workflow.description })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("text-xs px-2 py-1 rounded", workflow.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"), children: workflow.status }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-3 h-3 mr-1" }), "Run"] })] }) })] }, workflow.name))) }) })] }) })] }) }), (0, jsx_runtime_1.jsx)(resizable_1.ResizableHandle, { withHandle: true }), (0, jsx_runtime_1.jsxs)(resizable_1.ResizablePanel, { defaultSize: 20, minSize: 15, maxSize: 35, className: "panel-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "panel-header", children: (0, jsx_runtime_1.jsx)("span", { children: "Tools & Analytics" }) }), (0, jsx_runtime_1.jsx)("div", { className: "panel-content", children: (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "tools", className: "h-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-2", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "tools", children: "Tools" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "analytics", children: "Analytics" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "tools", className: "space-y-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search tools...", className: "mb-3" }), Object.entries(availableTools.reduce((acc, tool) => {
                                                            if (!acc[tool.category])
                                                                acc[tool.category] = [];
                                                            acc[tool.category].push(tool);
                                                            return acc;
                                                        }, {})).map(([category, tools]) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: category }), tools.map(tool => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-pointer", children: [tool.icon, (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: tool.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: tool.description })] })] }, tool.id)))] }, category)))] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "analytics", className: "space-y-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-2 space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-2", children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm", children: "Usage Statistics" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Messages today" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "23" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Tools executed" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "8" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Files modified" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "5" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-2", children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm", children: "Recent Activity" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-2", children: [
                                                                        { action: 'Created todolist', time: '2 min ago' },
                                                                        { action: 'Modified App.tsx', time: '5 min ago' },
                                                                        { action: 'Ran code analysis', time: '10 min ago' }
                                                                    ].map((activity, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: activity.action }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: activity.time })] }, i))) })] })] }) })] }) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "ide-status-bar border-t bg-card/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { children: "Connected" })] }), (0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF Mathematics Mode" }), (0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCBE All files saved" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: "Ready" }), (0, jsx_runtime_1.jsx)("span", { children: "Line 1, Col 1" }), (0, jsx_runtime_1.jsx)("span", { children: "UTF-8" })] })] }) }), (0, jsx_runtime_1.jsxs)(command_1.CommandDialog, { open: showToolSelector, onOpenChange: setShowToolSelector, children: [(0, jsx_runtime_1.jsx)(command_1.CommandInput, { placeholder: "Search tools and workflows..." }), (0, jsx_runtime_1.jsxs)(command_1.CommandList, { children: [(0, jsx_runtime_1.jsx)(command_1.CommandEmpty, { children: "No tools found." }), Object.entries(availableTools.reduce((acc, tool) => {
                                if (!acc[tool.category])
                                    acc[tool.category] = [];
                                acc[tool.category].push(tool);
                                return acc;
                            }, {})).map(([category, tools]) => ((0, jsx_runtime_1.jsx)(command_1.CommandGroup, { heading: category, children: tools.map(tool => ((0, jsx_runtime_1.jsx)(command_1.CommandItem, { onSelect: () => handleToolSelect(tool), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [tool.icon, (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: tool.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: tool.description })] })] }) }, tool.id))) }, category)))] })] })] }));
};
exports.ModernIDELayout = ModernIDELayout;
//# sourceMappingURL=modern-ide-layout.js.map