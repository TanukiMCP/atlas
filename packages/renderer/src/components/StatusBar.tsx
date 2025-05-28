import React from 'react';
import { StatusBarProps } from '../types';

const StatusBar: React.FC<StatusBarProps> = ({ 
  connectionStatus, 
  currentView, 
  theme, 
  version 
}) => {
  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-destructive';
    }
  };

  const primaryConnection = connectionStatus.find(conn => conn.service === 'Ollama') || 
    { service: 'Ollama', status: 'disconnected' as const };

  return (
    <div className="h-6 bg-card/50 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor(primaryConnection.status)}`}></div>
          {primaryConnection.status === 'connected' ? 'Online' : 'Offline'}
        </span>
        <span>🤖 General mode</span>
        <span>Agent mode</span>
        <span>{primaryConnection.service}: {primaryConnection.status}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>TanukiMCP Atlas {version}</span>
        <span>{theme} theme</span>
      </div>
    </div>
  );
};

export default StatusBar; 