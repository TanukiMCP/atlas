"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Header_1 = __importDefault(require("./components/Header"));
const FileExplorer_1 = __importDefault(require("./components/FileExplorer"));
const ToolsPanel_1 = __importDefault(require("./components/ToolsPanel"));
const WelcomeView_1 = __importDefault(require("./components/WelcomeView"));
const ChatView_1 = require("./components/chat/ChatView");
const StatusBar_1 = __importDefault(require("./components/StatusBar"));
// Import services
const FileSystemService_1 = __importDefault(require("./services/FileSystemService"));
const ConnectionManager_1 = __importDefault(require("./services/ConnectionManager"));
const MCPService_1 = __importDefault(require("./services/MCPService"));
function App() {
    const [currentView, setCurrentView] = (0, react_1.useState)('welcome');
    const [theme, setTheme] = (0, react_1.useState)('dark');
    // Real data from services
    const [files, setFiles] = (0, react_1.useState)([]);
    const [mcpTools, setMcpTools] = (0, react_1.useState)([]);
    const [workflows, setWorkflows] = (0, react_1.useState)([]);
    const [processingTiers, setProcessingTiers] = (0, react_1.useState)([]);
    const [connectionStatus, setConnectionStatus] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        // Apply theme class to document
        document.documentElement.className = theme;
    }, [theme]);
    (0, react_1.useEffect)(() => {
        initializeServices();
    }, []);
    const initializeServices = async () => {
        try {
            setIsLoading(true);
            // Initialize file system
            const workspaceFiles = await FileSystemService_1.default.getWorkspaceFiles();
            setFiles(workspaceFiles);
            // Start file watching
            FileSystemService_1.default.watchWorkspace();
            const unsubscribeFiles = FileSystemService_1.default.onFilesChanged((newFiles) => {
                setFiles(newFiles);
            });
            // Initialize connections
            setConnectionStatus(ConnectionManager_1.default.getAllConnections());
            await ConnectionManager_1.default.connectAll();
            const unsubscribeConnections = ConnectionManager_1.default.onConnectionsChanged((connections) => {
                setConnectionStatus(connections);
            });
            // Initialize MCP tools
            setMcpTools(MCPService_1.default.getAvailableTools());
            setWorkflows(MCPService_1.default.getAvailableWorkflows());
            setProcessingTiers(MCPService_1.default.getProcessingTiers());
            const unsubscribeMCP = MCPService_1.default.onToolsChanged(() => {
                setMcpTools(MCPService_1.default.getAvailableTools());
                setWorkflows(MCPService_1.default.getAvailableWorkflows());
            });
            // Cleanup function for when component unmounts
            return () => {
                unsubscribeFiles();
                unsubscribeConnections();
                unsubscribeMCP();
                FileSystemService_1.default.stopWatching(process.cwd());
            };
        }
        catch (error) {
            console.error('Failed to initialize services:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleViewChange = (view) => {
        setCurrentView(view);
    };
    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const handleFileSelect = async (file) => {
        try {
            if (file.type === 'file') {
                // Read and potentially open file
                const content = await FileSystemService_1.default.readFile(file.path);
                console.log(`File ${file.name} selected:`, content.slice(0, 100) + '...');
                // Switch to editor view if a file is selected
                setCurrentView('editor');
            }
            else {
                // Handle folder selection/expansion
                console.log(`Folder ${file.name} selected`);
            }
        }
        catch (error) {
            console.error('Failed to handle file selection:', error);
        }
    };
    const renderMainContent = () => {
        if (isLoading) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: "Initializing services..." })] }) }));
        }
        switch (currentView) {
            case 'chat':
                const ollamaConnection = connectionStatus.find(conn => conn.service === 'Ollama');
                return ((0, jsx_runtime_1.jsx)(ChatView_1.ChatView, { currentModel: "llama3.2:3b", isConnected: ollamaConnection?.status === 'connected', subjectMode: "general", agentMode: false, onProcessingChange: (processing) => {
                        // Handle processing state if needed
                        console.log('Chat processing:', processing);
                    } }));
            case 'welcome':
                return (0, jsx_runtime_1.jsx)(WelcomeView_1.default, { onViewChange: handleViewChange });
            case 'editor':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentView('welcome'), className: "px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors", children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold", children: "Code Editor" })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-card rounded-lg border border-border min-h-[500px] p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-red-500 rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-yellow-500 rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-4 text-sm text-muted-foreground", children: "Monaco Editor Integration" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-background rounded border border-border p-4 font-mono text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-green-400", children: "// TanukiMCP Atlas Code Editor" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-blue-400", children: ["function ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "welcomeToAtlas" }), "() ", '{'] }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4 text-foreground", children: ["console.log(", (0, jsx_runtime_1.jsx)("span", { className: "text-green-400", children: "'Welcome to your AI-powered IDE!'" }), ");"] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4 text-comment", children: "// AI-assisted coding coming soon..." }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-400", children: '}' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors", children: "Save File" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors", children: "Format Code" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors", children: "AI Suggestions" })] })] }) })] }));
            case 'tools':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentView('welcome'), className: "px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors", children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold", children: "MCP Tools" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: mcpTools.map((tool, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-card rounded-lg border border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center", children: "\uD83D\uDD27" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-foreground", children: tool.name }), (0, jsx_runtime_1.jsx)("div", { className: `text-xs ${tool.available ? 'text-green-500' : 'text-red-500'}`, children: tool.available ? 'Available' : 'Unavailable' })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mb-4", children: tool.description }), (0, jsx_runtime_1.jsx)("button", { onClick: () => executeTool(tool.name), disabled: !tool.available, className: "w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "Execute Tool" })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Available Workflows" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: workflows.map((workflow) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-card rounded-lg border border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-foreground", children: workflow.name }), (0, jsx_runtime_1.jsx)("div", { className: `text-xs px-2 py-1 rounded ${workflow.status === 'available' ? 'bg-green-500/10 text-green-500' :
                                                            workflow.status === 'running' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                workflow.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                                                                    'bg-red-500/10 text-red-500'}`, children: workflow.status })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mb-3", children: workflow.description }), (0, jsx_runtime_1.jsx)("button", { onClick: () => executeWorkflow(workflow.id), disabled: workflow.status === 'running', className: "w-full px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50", children: workflow.status === 'running' ? 'Running...' : 'Execute Workflow' })] }, workflow.id))) })] })] }));
            default:
                return (0, jsx_runtime_1.jsx)(WelcomeView_1.default, { onViewChange: handleViewChange });
        }
    };
    const executeTool = async (toolName) => {
        try {
            const result = await MCPService_1.default.executeTool(toolName, { test: true });
            console.log(`Tool ${toolName} executed:`, result);
            // Show success/error feedback
            const message = result.success ? 'Tool executed successfully!' : `Tool failed: ${result.error}`;
            alert(message); // Replace with proper notification system
        }
        catch (error) {
            console.error('Tool execution failed:', error);
            alert('Tool execution failed');
        }
    };
    const executeWorkflow = async (workflowId) => {
        try {
            const result = await MCPService_1.default.executeWorkflow(workflowId, {});
            console.log(`Workflow ${workflowId} executed:`, result);
            const message = result.success ? 'Workflow completed successfully!' : `Workflow failed: ${result.error}`;
            alert(message); // Replace with proper notification system
        }
        catch (error) {
            console.error('Workflow execution failed:', error);
            alert('Workflow execution failed');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-screen flex flex-col font-sans bg-background text-foreground", children: [(0, jsx_runtime_1.jsx)(Header_1.default, { currentView: currentView, theme: theme, onViewChange: handleViewChange, onThemeToggle: handleThemeToggle }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex overflow-hidden", children: [(0, jsx_runtime_1.jsx)(FileExplorer_1.default, { files: files, onFileSelect: handleFileSelect }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col bg-background", children: (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-6 overflow-y-auto", children: renderMainContent() }) }), (0, jsx_runtime_1.jsx)(ToolsPanel_1.default, { mcpTools: mcpTools, workflows: workflows, processingTiers: processingTiers, connectionStatus: connectionStatus })] }), (0, jsx_runtime_1.jsx)(StatusBar_1.default, { connectionStatus: connectionStatus, currentView: currentView, theme: theme, version: "v1.0.0" })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map