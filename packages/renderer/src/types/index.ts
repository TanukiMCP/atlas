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
  | 'workflow-builder'
  | 'mcp-tool-hub'
  | 'local-llm-hub';

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
  category: string;
  icon: string;
  operationalMode: 'agent' | 'chat' | 'both';
  available: boolean;
  parameters: any[];
  serverId: string;
  serverName: string;
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

export interface ModelRequirements {
  minRam: number; // in MB
  recommendedRam: number; // in MB
  diskSpace: number; // in MB
  minVram?: number; // in MB
  recommendedVram?: number; // in MB
  cpuCores?: number;
  cpuSpeed?: number; // in GHz
}

export type ModelCapability = 
  | 'conversation' 
  | 'reasoning' 
  | 'coding' 
  | 'mathematics' 
  | 'problem-solving'
  | 'creative-writing'
  | 'multilingual'
  | 'vision';

export type ModelCategory = 
  | 'tanukimcp-apollo' 
  | 'tanukimcp-hermes' 
  | 'tanukimcp-athena' 
  | 'tanukimcp-artemis'
  | 'tanukimcp-hephaestus'
  | 'tanukimcp-dionysus';

export interface ModelPerformance {
  tokensPerSecond?: number;
  responseTime?: number;
  memoryUsage?: number;
  qualityScore?: number;
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

export interface OpenRouterResponse {
  // Add the OpenRouter response types here
} 