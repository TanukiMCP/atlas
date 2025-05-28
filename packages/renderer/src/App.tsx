import React, { useState, useEffect } from 'react';
import { ViewType, Theme, FileSystemItem, MCPTool, Workflow, ProcessingTier, ConnectionInfo, TanukiModel, ModelInstallation, ModelConfiguration, SystemCapabilities } from './types';
import { MCPExecutionContext, MCPToolResult } from './services/mcp-service';
import Header from './components/Header';
import FileExplorer from './components/FileExplorer';
import ToolsPanel from './components/ToolsPanel';
import { ChatView } from './components/chat/ChatView';
import StatusBar from './components/StatusBar';
import ModelManagementHub from './components/ModelManagementHub';
import MonacoEditor from './components/MonacoEditor';

// Import services
import { fileSystemService } from './services/FileSystemService';
import ConnectionManager from './services/ConnectionManager';
import { mcpService } from './services/mcp-service';
import chatService from './services/ChatService';
import { TanukiApolloService } from './services/TanukiApolloService';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [theme, setTheme] = useState<Theme>('dark');

  // Real data from services
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [processingTiers, setProcessingTiers] = useState<ProcessingTier[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Model management state
  const [apolloService] = useState(() => new TanukiApolloService());
  const [currentModel, setCurrentModel] = useState<TanukiModel | undefined>(undefined);
  const [installedModels, setInstalledModels] = useState<TanukiModel[]>([]);
  const [availableModels, setAvailableModels] = useState<TanukiModel[]>([]);
  const [modelInstallations, setModelInstallations] = useState<ModelInstallation[]>([]);
  const [modelConfigurations, setModelConfigurations] = useState<ModelConfiguration[]>([]);
  const [systemCapabilities, setSystemCapabilities] = useState<SystemCapabilities | null>(null);
  const [isModelHubOpen, setIsModelHubOpen] = useState(false);
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);

  // Editor state
  const [currentFile, setCurrentFile] = useState<FileSystemItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFileLoading, setIsFileLoading] = useState(false);

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setIsLoading(true);

      // Initialize file system
      const workspaceFiles = await fileSystemService.getWorkspaceFiles();
      setFiles(workspaceFiles);

      // Start file watching
      fileSystemService.watchWorkspace();
      const unsubscribeFiles = fileSystemService.onFilesChanged((newFiles) => {
        setFiles(newFiles);
      });

      // Initialize connections
      setConnectionStatus(ConnectionManager.getAllConnections());
      await ConnectionManager.connectAll();
      
      const unsubscribeConnections = ConnectionManager.onConnectionsChanged((connections) => {
        setConnectionStatus(connections);
        // Update Ollama connection status
        const ollamaConnection = connections.find(conn => conn.service === 'Ollama');
        setIsOllamaConnected(ollamaConnection?.status === 'connected');
      });

      // Initialize MCP tools
      setMcpTools(mcpService.getAvailableTools('agent').map(tool => ({ ...tool, available: true })));
      setWorkflows([]); // No workflows available from mcpService
      setProcessingTiers([]); // No processing tiers available from mcpService

      // Note: mcpService doesn't have onToolsChanged, so we'll skip this subscription
      const unsubscribeMCP = () => {}; // No-op function

      // Initialize TanukiMCP Apollo model management
      await initializeModelManagement();

      // Cleanup function for when component unmounts
      return () => {
        unsubscribeFiles();
        unsubscribeConnections();
        unsubscribeMCP();
        fileSystemService.stopWatching(process.cwd());
      };
    } catch (error) {
      console.error('Failed to initialize services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeModelManagement = async () => {
    try {
      // Check Ollama health
      const isHealthy = await apolloService.checkHealth();
      setIsOllamaConnected(isHealthy);

      // Load system capabilities
      const capabilities = await apolloService.getSystemCapabilities();
      setSystemCapabilities(capabilities);

      // Load available models catalog
      const catalog = await apolloService.getModelCatalog();
      setAvailableModels(catalog);

      // Load installed models if Ollama is connected
      if (isHealthy) {
        const installed = await apolloService.getInstalledModels();
        setInstalledModels(installed);

        // Set first installed model as current if none selected
        if (installed.length > 0 && !currentModel) {
          setCurrentModel(installed[0]);
        }
      }

      // Load active installations
      const installations = apolloService.getActiveInstallations();
      setModelInstallations(installations);

    } catch (error) {
      console.error('Failed to initialize model management:', error);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    
    // Open model hub when models view is selected
    if (view === 'models') {
      setIsModelHubOpen(true);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFileSelect = async (file: FileSystemItem) => {
    try {
      if (file.type === 'file') {
        setIsFileLoading(true);
        setCurrentFile(file);
        
        // Read file content
        const content = await fileSystemService.readFile(file.path);
        setFileContent(content);
        
        // Switch to editor view
        setCurrentView('editor');
      } else {
        // Handle folder selection/expansion
        console.log(`Folder ${file.name} selected`);
      }
    } catch (error) {
      console.error('Failed to handle file selection:', error);
      setFileContent(`// Error loading file: ${error}\n// File: ${file.path}`);
      setCurrentView('editor');
    } finally {
      setIsFileLoading(false);
    }
  };

  // Model management handlers
  const handleModelSwitch = async (modelName: string) => {
    try {
      await apolloService.switchModel(modelName);
      const model = [...installedModels, ...availableModels].find(m => m.name === modelName);
      if (model) {
        setCurrentModel(model);
      }
    } catch (error) {
      console.error('Failed to switch model:', error);
    }
  };

  const handleInstallModel = async (modelName: string) => {
    try {
      await apolloService.installModel(modelName, (progress) => {
        setModelInstallations(prev => {
          const existing = prev.findIndex(inst => inst.modelName === modelName);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = progress;
            return updated;
          } else {
            return [...prev, progress];
          }
        });
      });

      // Refresh installed models after installation
      const installed = await apolloService.getInstalledModels();
      setInstalledModels(installed);
      
      // Remove from installations list when complete
      setModelInstallations(prev => prev.filter(inst => inst.modelName !== modelName));
    } catch (error) {
      console.error('Failed to install model:', error);
    }
  };

  const handleUninstallModel = async (modelName: string) => {
    try {
      await apolloService.uninstallModel(modelName);
      
      // Refresh installed models
      const installed = await apolloService.getInstalledModels();
      setInstalledModels(installed);
      
      // Clear current model if it was uninstalled
      if (currentModel?.name === modelName) {
        setCurrentModel(installed.length > 0 ? installed[0] : undefined);
      }
    } catch (error) {
      console.error('Failed to uninstall model:', error);
    }
  };

  const handleConfigureModel = (modelName: string, config: Partial<ModelConfiguration>) => {
    apolloService.setModelConfiguration(modelName, config);
    
    // Update configurations state
    setModelConfigurations(prev => {
      const existing = prev.findIndex(c => c.modelName === modelName);
      const newConfig = apolloService.getModelConfiguration(modelName);
      
      if (existing >= 0 && newConfig) {
        const updated = [...prev];
        updated[existing] = newConfig;
        return updated;
      } else if (newConfig) {
        return [...prev, newConfig];
      }
      return prev;
    });
  };

  const handleSetDefaultModel = (modelName: string) => {
    // Clear all default flags
    modelConfigurations.forEach(config => {
      if (config.isDefault) {
        apolloService.setModelConfiguration(config.modelName, { isDefault: false });
      }
    });
    
    // Set new default
    apolloService.setModelConfiguration(modelName, { isDefault: true });
    
    // Update state
    setModelConfigurations(prev => 
      prev.map(config => ({
        ...config,
        isDefault: config.modelName === modelName
      }))
    );
  };

  // Helper function to determine Monaco language from file extension
  const getLanguageFromFile = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp';
      case 'c':
        return 'c';
      case 'cs':
        return 'csharp';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'sql':
        return 'sql';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yaml';
      default:
        return 'plaintext';
    }
  };

  // Handle saving file
  const handleSaveFile = async (content: string) => {
    if (!currentFile) return;
    
    try {
      await fileSystemService.writeFile(currentFile.path, content);
      console.log(`File saved: ${currentFile.path}`);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to save file:', error);
      // You could add an error notification here
    }
  };

  // Handle saving workflow
  const handleSaveWorkflow = (workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow]);
    console.log('Workflow saved:', workflow);
  };

  // Handle loading workflow
  const handleLoadWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      console.log('Loading workflow:', workflow);
      // Switch to builder tab in tools view
      setCurrentView('tools');
    }
  };

  // Handle executing tool - updated signature for ToolsPanel
  const handleExecuteToolForPanel = async (context: MCPExecutionContext): Promise<MCPToolResult> => {
    try {
      const result = await mcpService.executeTool(context);
      console.log('Tool execution result:', result);
      return result;
    } catch (error) {
      console.error('Tool execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
        executionTime: 0,
        toolName: context.toolName,
        timestamp: new Date()
      };
    }
  };

  // Handle executing workflow - updated signature for ToolsPanel
  const handleExecuteWorkflowForPanel = async (workflow: Workflow): Promise<any> => {
    try {
      // Workflows are not supported by mcpService yet
      console.log('Workflow execution not yet implemented for:', workflow.name);
      return { success: false, message: 'Workflow execution not yet implemented' };
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-muted-foreground">Initializing services...</div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'chat':
        return (
          <ChatView 
            currentModel={currentModel?.name || "llama3.2:3b"}
            isConnected={isOllamaConnected}
            subjectMode="general"
            agentMode={false}
            onProcessingChange={(processing: boolean) => {
              // Handle processing state if needed
              console.log('Chat processing:', processing);
            }}
          />
        );
      case 'models':
        // This case is handled by the ModelManagementHub overlay
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">🤖</div>
              <div className="text-xl font-semibold">Model Management</div>
              <div className="text-sm text-muted-foreground">
                The model management hub should be opening...
              </div>
            </div>
          </div>
        );
      case 'editor':
        return (
          <div className="max-w-full mx-auto space-y-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 px-6 pt-6">
              <h1 className="text-2xl font-bold">Code Editor</h1>
              {currentFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>{currentFile.path}</span>
                  {isFileLoading && (
                    <>
                      <span>•</span>
                      <span className="text-blue-500">Loading...</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1 px-6 pb-6">
              <div className="bg-card rounded-lg border border-border h-full overflow-hidden">
                {currentFile ? (
                  <MonacoEditor
                    value={fileContent}
                    language={getLanguageFromFile(currentFile.name)}
                    onChange={(value) => setFileContent(value)}
                    onSave={handleSaveFile}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    height="100%"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">📝</div>
                      <div className="text-xl font-semibold">No file selected</div>
                      <div className="text-sm">Select a file from the explorer to start editing</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold">MCP Tools</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mcpTools.map((tool, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      🔧
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tool.name}</h3>
                      <div className={`text-xs ${tool.available ? 'text-green-500' : 'text-red-500'}`}>
                        {tool.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <button 
                    onClick={() => executeTool(tool.name)}
                    disabled={!tool.available}
                    className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Execute Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold">Workflows</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                    <div className={`text-xs px-2 py-1 rounded ${
                      workflow.status === 'available' ? 'bg-green-500/10 text-green-500' :
                      workflow.status === 'running' ? 'bg-yellow-500/10 text-yellow-500' :
                      workflow.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {workflow.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                  <button 
                    onClick={() => executeWorkflow(workflow.id)}
                    disabled={workflow.status === 'running'}
                    className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {workflow.status === 'running' ? 'Running...' : 'Execute Workflow'}
                  </button>
                </div>
              ))}
              
              {workflows.length === 0 && (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">⚡</div>
                    <div className="text-xl font-semibold">No workflows available</div>
                    <div className="text-sm text-muted-foreground">
                      Create workflows using the workflow builder in the Tools panel
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">🦝</div>
              <div className="text-xl font-semibold">Welcome to TanukiMCP Atlas</div>
              <div className="text-sm text-muted-foreground">
                Select a view from the navigation above to get started
              </div>
            </div>
          </div>
        );
    }
  };

  const executeTool = async (toolName: string) => {
    try {
      const result = await mcpService.executeTool({
        toolName,
        parameters: { test: true },
        operationalMode: 'agent'
      });
      console.log(`Tool ${toolName} executed:`, result);
      
      // Update tools list to show execution
      setMcpTools(prev => prev.map(tool => 
        tool.name === toolName 
          ? { ...tool, lastExecuted: new Date() }
          : tool
      ));
    } catch (error) {
      console.error(`Tool ${toolName} execution failed:`, error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      // Workflows are not supported by mcpService yet
      console.log('Workflow execution not yet implemented');
    } catch (error) {
      console.error(`Workflow ${workflowId} execution failed:`, error);
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans bg-background text-foreground">
      <Header 
        currentView={currentView}
        theme={theme}
        onViewChange={handleViewChange}
        onThemeToggle={handleThemeToggle}
        currentModel={currentModel}
        availableModels={availableModels}
        isConnected={isOllamaConnected}
        onModelSwitch={handleModelSwitch}
        onOpenModelHub={() => setIsModelHubOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer 
          onFileSelect={(filePath: string) => {
            // Convert filePath to FileSystemItem for handleFileSelect
            const findFileItem = (items: FileSystemItem[], path: string): FileSystemItem | null => {
              for (const item of items) {
                if (item.path === path) return item;
                if (item.children) {
                  const found = findFileItem(item.children, path);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const fileItem = findFileItem(files, filePath);
            if (fileItem) {
              handleFileSelect(fileItem);
            }
          }}
          selectedFile={currentFile?.path}
        />

        {/* Main Content Panel */}
        <div className="flex-1 flex flex-col bg-background">
          <div className="flex-1 p-6 overflow-y-auto">
            {renderMainContent()}
          </div>
        </div>

        <ToolsPanel 
          operationalMode="agent"
          onToolExecute={handleExecuteToolForPanel}
          onWorkflowExecute={handleExecuteWorkflowForPanel}
          onWorkflowSave={handleSaveWorkflow}
          workflows={workflows}
        />
      </div>

      <StatusBar 
        connectionStatus={connectionStatus}
        currentView={currentView}
        theme={theme}
        version="v1.0.0"
      />

      {isModelHubOpen && systemCapabilities && (
        <ModelManagementHub
          currentModel={currentModel}
          installedModels={installedModels}
          availableModels={availableModels}
          modelInstallations={modelInstallations}
          modelConfigurations={modelConfigurations}
          systemCapabilities={systemCapabilities}
          onModelSwitch={handleModelSwitch}
          onInstallModel={handleInstallModel}
          onUninstallModel={handleUninstallModel}
          onConfigureModel={handleConfigureModel}
          onSetDefaultModel={handleSetDefaultModel}
          onClose={() => setIsModelHubOpen(false)}
        />
      )}
    </div>
  );
}

export default App; 