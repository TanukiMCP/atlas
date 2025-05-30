export type ViewType = 
  | 'chat' 
  | 'editor' 
  | 'tools' 
  | 'workflows' 
  | 'models' 
  | 'settings'
  | 'workflow-manager'
  | 'prompt-management'
  | 'tool-browser'
  | 'mcp-servers'
  | 'performance-monitor'
  | 'about'
  | 'workflow-builder';

export type Theme = 'light' | 'dark';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface AppState {
  currentView: ViewType;
  theme: Theme;
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  icon?: string;
  children?: FileSystemItem[];
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status?: 'available' | 'unavailable' | 'loading';
}

export interface MCPTool {
  name: string;
  description: string;
  category?: string;
  available: boolean;
  icon: string;
  operationalMode: 'agent' | 'chat' | 'both';
  parameters?: MCPToolParameter[];
  examples?: string[];
}

export interface MCPToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface MCPExecutionContext {
  toolName: string;
  parameters: any;
  requestId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'running' | 'completed' | 'error';
}

export interface ProcessingTier {
  name: string;
  level: 'atomic' | 'moderate' | 'complex' | 'expert';
  description: string;
}

export interface ConnectionInfo {
  service: string;
  status: ConnectionStatus;
  lastConnected?: Date;
}

// Component Props Interfaces
export interface HeaderProps {
  currentView: ViewType;
  theme: Theme;
  onViewChange: (view: ViewType) => void;
  onThemeToggle: () => void;
}

export interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
  selectedFile?: string;
  onDeleteFile?: (filePath: string) => Promise<void>;
  onCreateFile?: (filePath: string, content: string) => Promise<void>;
  onCreateFolder?: (folderPath: string) => Promise<void>;
  workspaceName?: string;
}

export interface ToolsPanelProps {
  mcpTools: MCPTool[];
  workflows: Workflow[];
  processingTiers: ProcessingTier[];
  connectionStatus: ConnectionInfo[];
}

export interface WelcomeViewProps {
  onViewChange: (view: ViewType) => void;
}

export interface ChatViewProps {
  onBack: () => void;
}

export interface StatusBarProps {
  connectionStatus: ConnectionInfo[];
  currentView: ViewType;
  theme: Theme;
  version: string;
}

// Model Management Types (TanukiMCP Apollo)
export interface TanukiModel {
  name: string;
  displayName: string;
  description: string;
  size: number;
  parameterCount: string;
  family: string;
  quantization?: string;
  isInstalled: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  lastUsed?: Date;
  performance?: ModelPerformance;
  capabilities: ModelCapability[];
  category: ModelCategory;
  requirements: ModelRequirements;
}

export interface ModelPerformance {
  tokensPerSecond: number;
  memoryUsage: number;
  contextLength: number;
  averageLatency: number;
  benchmarkScore?: number;
}

export interface ModelRequirements {
  minRam: number;
  recommendedRam: number;
  minVram?: number;
  recommendedVram?: number;
  diskSpace: number;
}

export type ModelCapability = 
  | 'reasoning' 
  | 'coding' 
  | 'mathematics' 
  | 'analysis' 
  | 'creative-writing' 
  | 'conversation' 
  | 'problem-solving'
  | 'multilingual';

export type ModelCategory = 
  | 'tanukimcp-apollo' // Knowledge & reasoning models
  | 'tanukimcp-athena' // Strategy & coding models  
  | 'tanukimcp-hermes' // Communication & chat models
  | 'tanukimcp-artemis' // Specialized & hunting models
  | 'tanukimcp-hephaestus' // Tool & creation models
  | 'tanukimcp-dionysus'; // Creative & experimental models

export interface ModelInstallation {
  modelName: string;
  status: 'downloading' | 'installing' | 'completed' | 'failed' | 'paused';
  progress: number;
  downloadSpeed?: number;
  estimatedTime?: number;
  error?: string;
  startedAt: Date;
}

export interface ModelConfiguration {
  modelName: string;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  contextLength: number;
  systemPrompt?: string;
  isDefault: boolean;
}

// Component Props for Model Management
export interface ModelQuickActionsProps {
  currentModel?: TanukiModel;
  availableModels: TanukiModel[];
  isConnected: boolean;
  onModelSwitch: (modelName: string) => void;
  onOpenModelHub: () => void;
}

export interface ModelManagementHubProps {
  currentModel?: TanukiModel;
  installedModels: TanukiModel[];
  availableModels: TanukiModel[];
  modelInstallations: ModelInstallation[];
  modelConfigurations: ModelConfiguration[];
  systemCapabilities: SystemCapabilities;
  onModelSwitch: (modelName: string) => void;
  onInstallModel: (modelName: string) => void;
  onUninstallModel: (modelName: string) => void;
  onConfigureModel: (modelName: string, config: Partial<ModelConfiguration>) => void;
  onSetDefaultModel: (modelName: string) => void;
  onClose: () => void;
}

export interface SystemCapabilities {
  totalRam: number;
  availableRam: number;
  totalVram?: number;
  availableVram?: number;
  cpuCores: number;
  gpuInfo?: {
    name: string;
    memory: number;
    computeCapability?: string;
  };
  diskSpace: number;
  recommendedModels: string[];
}

export interface OpenRouterResponse {
  // Add the OpenRouter response types here
}

// Define the ElectronAPI interface for window object
export interface ElectronAPI {
  // System
  platform: string;
  
  // Window management
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  
  // OpenRouter integration
  storeOpenRouterKey: (key: string) => Promise<any>;
  getOpenRouterKey: () => Promise<string>;
  
  // Mobile proxy management
  startProxyServer: () => Promise<{ success: boolean; active: boolean; port: number; clients: number; error?: string }>;
  stopProxyServer: () => Promise<{ success: boolean; error?: string }>;
  getProxyStatus: () => Promise<{ active: boolean; port: number | null; clients: number; clientDetails?: any[] }>;
  generatePairingQRCode: () => Promise<{ success: boolean; qrCode: string; token: string; connectionUrl: string; error?: string }>;
  showProxyStatusWindow: () => Promise<{ success: boolean; error?: string }>;
  sendProxyChatResponse: (clientId: string, message: string, messageId: string) => Promise<{ success: boolean }>;
  
  // Proxy event listeners
  onProxyStatusChanged: (callback: (status: any) => void) => void;
  onProxyClientConnected: (callback: (data: any) => void) => void;
  onProxyClientDisconnected: (callback: (data: any) => void) => void;
  onProxyChatMessage: (callback: (data: any) => void) => void;
  onProxyMediaProcessed: (callback: (data: any) => void) => void;
  
  // Remove event listeners
  removeProxyStatusListener: () => void;
  removeProxyClientConnectedListener: () => void;
  removeProxyClientDisconnectedListener: () => void;
  removeProxyChatMessageListener: () => void;
  removeProxyMediaProcessedListener: () => void;
}

// Add ElectronAPI to Window interface
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 