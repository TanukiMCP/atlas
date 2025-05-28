export type ViewType = 'welcome' | 'chat' | 'editor' | 'tools';
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
//# sourceMappingURL=index.d.ts.map