import React from 'react';
import { Box, Terminal } from 'lucide-react';

// Define the types directly in the file to avoid import issues
type Theme = 'light' | 'dark';
type ViewType = 
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
type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface ConnectionInfo {
  service: string;
  status: ConnectionStatus;
  lastConnected?: Date;
  url?: string;
  lastChecked?: Date;
}

interface TanukiModel {
  name: string;
  displayName?: string;
  description?: string;
  size?: number;
  parameterCount?: string;
  family?: string;
  quantization?: string;
  isInstalled?: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  lastUsed?: Date;
  performance?: any;
  capabilities?: string[];
  category?: string;
  requirements?: any;
}

interface StatusBarProps {
  connections: ConnectionInfo[];
  currentView?: ViewType;
  theme?: Theme;
  version?: string;
  currentModel?: TanukiModel;
  onModelClick?: () => void;
  onToggleTerminal?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  connections, 
  currentView, 
  theme, 
  version,
  currentModel,
  onModelClick,
  onToggleTerminal
}) => {
  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-destructive';
    }
  };

  const primaryConnection = (connections && Array.isArray(connections)) 
    ? connections.find(conn => conn.service === 'OpenRouter') || { service: 'OpenRouter', status: 'disconnected' as const }
    : { service: 'OpenRouter', status: 'disconnected' as const };

  return (
    <div className="h-6 bg-card/50 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor(primaryConnection.status)}`}></div>
          {primaryConnection.status === 'connected' ? 'Online' : 'Offline'}
        </span>
        
        {/* Current Model */}
        {currentModel && (
          <button 
            onClick={onModelClick}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            <Box className="w-3 h-3" />
            Model: {currentModel.displayName || currentModel.name}
          </button>
        )}
        
        {/* Connection Status */}
        <span>{primaryConnection.service}: {primaryConnection.status}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Terminal Toggle Button */}
        {onToggleTerminal && (
          <button
            onClick={onToggleTerminal}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            title="Toggle Terminal"
          >
            <Terminal className="w-3 h-3" />
            Terminal
          </button>
        )}
        <span>TanukiMCP Atlas {version}</span>
        <span>{theme} theme</span>
      </div>
    </div>
  );
};

export default StatusBar; 