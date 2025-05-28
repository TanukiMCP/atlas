export type ViewType = 'chat' | 'editor' | 'tools' | 'workflows' | 'models';
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
  available: boolean;
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
  files: FileSystemItem[];
  onFileSelect?: (file: FileSystemItem) => void;
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