import React, { useState, useEffect, useRef } from 'react';
import { ViewType, Theme, FileSystemItem, MCPTool, Workflow, ProcessingTier, ConnectionInfo, TanukiModel, ModelInstallation, ModelConfiguration, SystemCapabilities, MCPExecutionContext } from './types/index';
import { MCPToolResult } from './services/mcp-service';
import Header from './components/Header';
import FileExplorer from './components/FileExplorer';
import ToolsPanel from './components/ToolsPanel';
import Chat from './components/Chat';
import StatusBar from './components/StatusBar';
import ModelManagementHub from './components/ModelManagementHub';
import MonacoEditor from './components/MonacoEditor';
import Settings from './components/Settings';
import { ComingSoon } from './components/shared/ComingSoon';
import { AboutView } from './components/views/AboutView';
import OpenRouterModelHub from './components/llm/OpenRouterModelHub';
import LocalLLMHub from './components/llm/LocalLLMHub';
import WindowControls from './components/WindowControls';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { VisualWorkflowBuilder } from './components/workflows/visual-workflow-builder';
import MCPToolHub from './components/mcp/MCPToolHub';
import IntegratedTerminal from './components/ide/IntegratedTerminal';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModernIDELayout } from './components/ide/modern-ide-layout';

// Import services
import { fileSystemService } from './services/FileSystemService';
import ConnectionManager from './services/ConnectionManager';
import { mcpService } from './services/mcp-service';
import chatService from './services/ChatService';
import { TanukiApolloService } from './services/TanukiApolloService';
import { useLLMStore } from './stores/llm-store';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');

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
  
  // Editor state
  const [currentFile, setCurrentFile] = useState<FileSystemItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFileLoading, setIsFileLoading] = useState(false);

  // UI state for modals and toolbars
  const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
  const [subjectMode, setSubjectMode] = useState('general');
  const [agentMode, setAgentMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelHubOpen, setIsModelHubOpen] = useState(false);
  const [isOpenRouterModelHubOpen, setIsOpenRouterModelHubOpen] = useState(false);
  const [isLocalLLMHubOpen, setIsLocalLLMHubOpen] = useState(false);
  const [isMCPToolHubOpen, setIsMCPToolHubOpen] = useState(false);
  const [isWorkflowBuilderOpen, setIsWorkflowBuilderOpen] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

  // Track the current working directory
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = useState<string | null>(null);

  // Subscribe to LLM store changes
  const { isConnected: isOpenRouterConnected, checkHealth: refreshOpenRouterHealth, availableModels: openRouterModels } = useLLMStore();

  // Auto-select first model when OpenRouter connects and models are available
  useEffect(() => {
    if (isOpenRouterConnected && openRouterModels.length > 0 && !currentModel) {
      const firstModel = convertFreeModelToTanukiModel(openRouterModels[0]);
      setCurrentModel(firstModel);
      console.log('Auto-selected OpenRouter model:', firstModel.name);
    }
  }, [isOpenRouterConnected, openRouterModels, currentModel]);

  // Subscribe to LLM store currentModel changes
  useEffect(() => {
    // Initial sync from LLM store
    const { currentModel: llmCurrentModel, availableModels: llmAvailableModels } = useLLMStore.getState();
    
    if (llmCurrentModel && llmAvailableModels.length > 0) {
      const modelDetails = llmAvailableModels.find(m => m.id === llmCurrentModel);
      if (modelDetails) {
        const tanukiModel = convertFreeModelToTanukiModel(modelDetails);
        setCurrentModel(tanukiModel);
        console.log('Synced current model from LLM store:', tanukiModel.name);
      }
    }
    
    // Subscribe to future changes
    const unsubscribe = useLLMStore.subscribe((state) => {
      const newModelId = state.currentModel;
      if (newModelId && (!currentModel || newModelId !== currentModel.name)) {
        const modelDetails = state.availableModels.find(m => m.id === newModelId);
        if (modelDetails) {
          const tanukiModel = convertFreeModelToTanukiModel(modelDetails);
          setCurrentModel(tanukiModel);
          console.log('Updated current model from LLM store:', tanukiModel.name);
        }
      }
    });
    
    return unsubscribe;
  }, [currentModel]);

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
    initializeServices();
    
    // Also initialize OpenRouter connection
    const { checkHealth } = useLLMStore.getState();
    checkHealth().catch(error => {
      console.error('Failed to check OpenRouter health:', error);
    });
    
    // Set up listener for directory changes
    const unsubscribeDirectory = fileSystemService.onDirectoryChanged((dirPath) => {
      console.log('Working directory changed to:', dirPath);
      setCurrentWorkingDirectory(dirPath);
      refreshFileList();
    });
    
    // Get initial working directory
    fileSystemService.getCurrentWorkingDirectory()
      .then(dirPath => {
        setCurrentWorkingDirectory(dirPath);
      })
      .catch(error => {
        console.error('Failed to get current working directory:', error);
      });
    
    return () => {
      unsubscribeDirectory();
    };
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
        fileSystemService.stopWatching();
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
      setIsOpenRouterModelHubOpen(true);
    }
    
    // Open Local LLM Hub when local-llm-hub view is selected
    if (view === 'local-llm-hub') {
      console.log('🔧 Opening Local LLM Hub...');
      setIsLocalLLMHubOpen(true);
    }
    
    // Open MCP Tool Hub when mcp-tool-hub view is selected
    if (view === 'mcp-tool-hub') {
      console.log('🔧 Opening MCP Tool Hub...');
      setIsMCPToolHubOpen(true);
    }
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
      // Use the LLM store to set the current model
      useLLMStore.getState().setCurrentModel(modelName);
      console.log('Switched model to:', modelName);
      
      // The TanukiModel will be updated via the subscription we set up
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
      // Add operationalMode to the context
      const extendedContext = {
        ...context,
        operationalMode: 'agent' as const
      };
      
      const result = await mcpService.executeTool(extendedContext);
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

  const handleFileDelete = async () => {
    if (!currentFile) return;
    
    try {
      await fileSystemService.deleteFile(currentFile.path);
      // Reset editor state
      setCurrentFile(null);
      setFileContent('');
      // Switch back to a different view if needed
      if (currentView === 'editor') {
        setCurrentView('chat');
      }
      console.log(`File deleted: ${currentFile.path}`);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to delete file:', error);
      // You could add an error notification here
    }
  };

  const handleOpenModelHub = () => {
    console.log('🔍 Opening Model Hub...');
    setIsOpenRouterModelHubOpen(true);
  };

  const handleOpenLocalLLMHub = () => {
    console.log('🔍 Opening Local LLM Hub...');
    setIsLocalLLMHubOpen(true);
  };
  
  const toggleTerminal = () => {
    console.log('🖥️ Toggling terminal visibility...');
    setIsTerminalVisible(!isTerminalVisible);
  };

  // Function to refresh the file list
  const refreshFileList = async () => {
    try {
      const workspaceFiles = await fileSystemService.getWorkspaceFiles();
      setFiles(workspaceFiles);
    } catch (error) {
      console.error('Failed to refresh file list:', error);
    }
  };
  
  // Function to change the working directory
  const changeWorkingDirectory = async (dirPath: string) => {
    try {
      const success = await fileSystemService.setWorkingDirectory(dirPath);
      if (success) {
        console.log(`Successfully changed working directory to: ${dirPath}`);
        setCurrentWorkingDirectory(dirPath);
        refreshFileList();
      } else {
        console.error(`Failed to change working directory to: ${dirPath}`);
      }
    } catch (error) {
      console.error('Error changing working directory:', error);
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
          <Chat />
        );
      case 'editor':
        if (currentFile) {
          return (
            <MonacoEditor
              value={fileContent}
              language={getLanguageFromFile(currentFile.name)}
              onChange={(value) => setFileContent(value)}
              onSave={handleSaveFile}
              onDelete={handleFileDelete}
              filePath={currentFile.path}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              height="100%"
            />
          );
        } else {
          return <div className="flex items-center justify-center h-full text-muted-foreground">No file selected</div>;
        }
      case 'models':
        return (
          <div className="p-4 h-full overflow-auto">
            <OpenRouterModelHub />
          </div>
        );
      case 'local-llm-hub':
        return (
          <div className="p-4 h-full overflow-auto">
            <LocalLLMHub />
          </div>
        );
      case 'settings':
        return (
          <Settings />
        );
      case 'about':
        return (
          <AboutView onViewChange={(view) => handleViewChange(view as ViewType)} />
        );
      case 'workflow-builder':
        return <VisualWorkflowBuilder />;
      default:
        const viewName = String(currentView).charAt(0).toUpperCase() + 
          String(currentView).slice(1).replace('-', ' ');
        return (
          <ComingSoon 
            featureName={viewName}
            onBackToChat={() => setCurrentView('chat')}
          />
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
    <ThemeProvider>
      <ModernIDELayout
        currentView={currentView}
        onViewChange={handleViewChange}
        files={files}
        currentFile={currentFile}
        onFileSelect={setCurrentFile}
        fileContent={fileContent}
        isFileLoading={isFileLoading}
        isFileExplorerVisible={isFileExplorerVisible}
        onFileExplorerToggle={() => setIsFileExplorerVisible(!isFileExplorerVisible)}
        subjectMode={subjectMode}
        onSubjectModeChange={setSubjectMode}
        agentMode={agentMode}
        onAgentModeToggle={() => setAgentMode(!agentMode)}
        isProcessing={isProcessing}
        onStopProcessing={() => setIsProcessing(false)}
        currentModel={currentModel}
        availableModels={availableModels}
        isConnected={connectionStatus.length > 0}
        onModelSwitch={setCurrentModel}
        onOpenModelHub={() => setIsModelHubOpen(true)}
        onOpenLocalLLMHub={() => setIsLocalLLMHubOpen(true)}
      />
    </ThemeProvider>
  );
}

export default App; 