import React, { useState, useEffect } from 'react';
import { ViewType, Theme, FileSystemItem, MCPTool, Workflow, ProcessingTier, ConnectionInfo, TanukiModel, ModelInstallation, ModelConfiguration, SystemCapabilities } from './types/index';
import { MCPExecutionContext, MCPToolResult } from './services/mcp-service';
import Header from './components/Header';
import FileExplorer from './components/FileExplorer';
import ToolsPanel from './components/ToolsPanel';
import { ChatView } from './components/chat/ChatView';
import StatusBar from './components/StatusBar';
import ModelManagementHub from './components/ModelManagementHub';
import MonacoEditor from './components/MonacoEditor';
import Settings from './components/Settings';
import { ComingSoon } from './components/shared/ComingSoon';
import { AboutView } from './components/views/AboutView';

// Import services
import { fileSystemService } from './services/FileSystemService';
import ConnectionManager from './services/ConnectionManager';
import { mcpService } from './services/mcp-service';
import chatService from './services/ChatService';
import { TanukiApolloService } from './services/TanukiApolloService';
import { useLLMStore } from './stores/llm-store';

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
  const [currentModel, setCurrentModel] = useState<TanukiModel | undefined>(undefined);
  const [installedModels, setInstalledModels] = useState<TanukiModel[]>([]);
  const [availableModels, setAvailableModels] = useState<TanukiModel[]>([]);
  const [modelInstallations, setModelInstallations] = useState<ModelInstallation[]>([]);
  const [modelConfigurations, setModelConfigurations] = useState<ModelConfiguration[]>([]);
  const [systemCapabilities, setSystemCapabilities] = useState<SystemCapabilities | null>(null);
  const [isModelHubOpen, setIsModelHubOpen] = useState(false);

  // Subscribe to LLM store changes
  const { isConnected: isOpenRouterConnected, checkHealth: refreshOpenRouterHealth, availableModels: openRouterModels } = useLLMStore();

  // Editor state
  const [currentFile, setCurrentFile] = useState<FileSystemItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFileLoading, setIsFileLoading] = useState(false);

  // UI state for toolbar
  const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
  const [subjectMode, setSubjectMode] = useState('general');
  const [agentMode, setAgentMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-select first model when OpenRouter connects and models are available
  useEffect(() => {
    if (isOpenRouterConnected && openRouterModels.length > 0 && !currentModel) {
      const firstModel = convertFreeModelToTanukiModel(openRouterModels[0]);
      setCurrentModel(firstModel);
      console.log('Auto-selected OpenRouter model:', firstModel.name);
    }
  }, [isOpenRouterConnected, openRouterModels, currentModel]);

  // Sync OpenRouter connection status to ConnectionManager for StatusBar
  useEffect(() => {
    setConnectionStatus(prev => {
      const otherConnections = prev.filter(conn => conn.service !== 'OpenRouter');
      return [
        ...otherConnections,
        {
          service: 'OpenRouter',
          status: isOpenRouterConnected ? 'connected' : 'disconnected',
          url: 'https://openrouter.ai',
          lastChecked: new Date()
        }
      ];
    });
  }, [isOpenRouterConnected]);

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    initializeServices();
    
    // Also initialize OpenRouter connection
    const { checkHealth } = useLLMStore.getState();
    checkHealth().catch(error => {
      console.error('Failed to check OpenRouter health:', error);
    });
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
        // Update OpenRouter connection status from LLM store instead of ConnectionManager
        // The LLM store is the authoritative source for OpenRouter connection status
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

  const convertFreeModelToTanukiModel = (freeModel: any): TanukiModel => {
    return {
      name: freeModel.id,
      displayName: freeModel.displayName,
      description: freeModel.description,
      size: 8000000000, // 8GB estimated for free models
      parameterCount: '8B', // Estimated parameter count
      family: 'OpenRouter',
      isInstalled: true, // All free models are "available"
      capabilities: ['conversation', 'reasoning'],
      category: 'tanukimcp-apollo', // Default category
      requirements: {
        minRam: 8,
        recommendedRam: 16,
        minVram: 4,
        recommendedVram: 8,
        diskSpace: 8
      }
    };
  };

  const initializeModelManagement = async () => {
    try {
      // Use the OpenRouter-based LLM store instead of apolloService
      const { checkHealth, refreshModels, availableModels, isConnected, healthStatus } = useLLMStore.getState();
      
      // Check OpenRouter health
      await checkHealth();
      
      // Get the updated state after health check
      const currentState = useLLMStore.getState();
      // OpenRouter connection status is now handled by the LLM store subscription

      // Load available models from OpenRouter
      await refreshModels();
      const updatedState = useLLMStore.getState();
      
      // Convert FreeModels to TanukiModels
      const convertedModels = updatedState.availableModels.map(convertFreeModelToTanukiModel);
      setAvailableModels(convertedModels);

      // For OpenRouter, we don't have "installed" models in the traditional sense
      // All free models are "available" when connected
      if (updatedState.isConnected) {
        setInstalledModels(convertedModels);

        // Set first available model as current if none selected
        if (convertedModels.length > 0 && !currentModel) {
          setCurrentModel(convertedModels[0]);
        }
      }

      // Set basic system capabilities for OpenRouter
      setSystemCapabilities({
        totalRam: 16384,
        availableRam: 8192,
        totalVram: 8192,
        availableVram: 4096,
        cpuCores: 8,
        diskSpace: 100000,
        recommendedModels: convertedModels.map(model => model.name)
      });

      // No active installations for OpenRouter (free models are ready-to-use)
      setModelInstallations([]);

    } catch (error) {
      console.error('Failed to initialize OpenRouter model management:', error);
    }
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    
    // Open model hub when models view is selected
    if (view === 'models') {
      console.log('🔍 Opening Model Hub...');
      console.log('systemCapabilities:', systemCapabilities);
      console.log('availableModels:', availableModels);
      console.log('installedModels:', installedModels);
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
      // Implementation needed
    } catch (error) {
      console.error('Failed to switch model:', error);
    }
  };

  const handleInstallModel = async (modelName: string) => {
    try {
      // Implementation needed
    } catch (error) {
      console.error('Failed to install model:', error);
    }
  };

  const handleUninstallModel = async (modelName: string) => {
    try {
      // Implementation needed
    } catch (error) {
      console.error('Failed to uninstall model:', error);
    }
  };

  const handleConfigureModel = (modelName: string, config: Partial<ModelConfiguration>) => {
    // Implementation needed
  };

  const handleSetDefaultModel = (modelName: string) => {
    // Implementation needed
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
            isConnected={isOpenRouterConnected}
            subjectMode={subjectMode}
            agentMode={agentMode}
            onProcessingChange={(processing: boolean) => {
              setIsProcessing(processing);
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
      case 'settings':
        return <Settings onApiKeyChange={(apiKey) => console.log('API key updated:', apiKey)} />;
      case 'about':
        return <AboutView onViewChange={(view: string) => handleViewChange(view as ViewType)} />;
      case 'workflow-manager':
        return (
          <ComingSoon 
            featureName="Workflow Manager"
            description="Advanced workflow creation and management interface with visual editor and automation tools."
            onBackToChat={() => handleViewChange('chat')}
            expectedRelease="Q1 2024"
          />
        );
      case 'prompt-management':
        return (
          <ComingSoon 
            featureName="LLM Prompt Management"
            description="Create, edit, and organize prompts for different AI models with version control and sharing capabilities."
            onBackToChat={() => handleViewChange('chat')}
            expectedRelease="Q1 2024"
          />
        );
      case 'tool-browser':
        return (
          <ComingSoon 
            featureName="Tool Browser"
            description="Browse, install, and manage MCP tools from the community marketplace."
            onBackToChat={() => handleViewChange('chat')}
            expectedRelease="Q2 2024"
          />
        );
      case 'mcp-servers':
        return (
          <ComingSoon 
            featureName="MCP Servers"
            description="Manage Model Context Protocol server connections and configurations."
            onBackToChat={() => handleViewChange('chat')}
            expectedRelease="Q1 2024"
          />
        );
      case 'performance-monitor':
        return (
          <ComingSoon 
            featureName="Performance Monitor"
            description="Real-time system performance metrics, resource usage, and optimization recommendations."
            onBackToChat={() => handleViewChange('chat')}
            expectedRelease="Q2 2024"
          />
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
    <div className="h-screen flex flex-col bg-background text-foreground antialiased">
      <Header 
        currentView={currentView}
        theme={theme}
        onViewChange={handleViewChange}
        onThemeToggle={handleThemeToggle}
        currentModel={currentModel}
        availableModels={availableModels}
        isConnected={isOpenRouterConnected}
        onModelSwitch={handleModelSwitch}
        onOpenModelHub={() => setIsModelHubOpen(true)}
        onFileExplorerToggle={() => setIsFileExplorerVisible(!isFileExplorerVisible)}
        isFileExplorerVisible={isFileExplorerVisible}
        subjectMode={subjectMode}
        onSubjectModeChange={setSubjectMode}
        agentMode={agentMode}
        onAgentModeToggle={() => setAgentMode(!agentMode)}
        isProcessing={isProcessing}
        onStopProcessing={() => setIsProcessing(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {isFileExplorerVisible && (
          <FileExplorer 
            onFileSelect={(filePath: string) => {
              // Convert filePath to FileSystemItem for handleFileSelect
              const findFileItem = (items: FileSystemItem[], path: string): FileSystemItem | null => {
                if (!items || !Array.isArray(items)) return null;
                
                for (const item of items) {
                  if (item.path === path) return item;
                  if (item.children && Array.isArray(item.children)) {
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
        )}

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