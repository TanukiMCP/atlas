import React from 'react';
import { HeaderProps, TanukiModel, ModelInstallation, ModelConfiguration, SystemCapabilities } from '../types';
import ModelQuickActions from './ModelQuickActions';

interface EnhancedHeaderProps extends HeaderProps {
  currentModel?: TanukiModel;
  availableModels: TanukiModel[];
  isConnected: boolean;
  onModelSwitch: (modelName: string) => void;
  onOpenModelHub: () => void;
}

const Header: React.FC<EnhancedHeaderProps> = ({ 
  currentView, 
  theme, 
  onViewChange, 
  onThemeToggle,
  currentModel,
  availableModels,
  isConnected,
  onModelSwitch,
  onOpenModelHub
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      {/* Primary Menu Bar */}
      <div className="h-12 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xl">🦝</div>
            <span className="font-semibold text-foreground">TanukiMCP Atlas</span>
          </div>
          <button 
            onClick={() => onViewChange('chat')}
            onKeyDown={(e) => handleKeyDown(e, () => onViewChange('chat'))}
            tabIndex={0}
            className={`px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentView === 'chat' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Chat
          </button>
          <button 
            onClick={() => onViewChange('editor')}
            onKeyDown={(e) => handleKeyDown(e, () => onViewChange('editor'))}
            tabIndex={0}
            className={`px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentView === 'editor' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Editor
          </button>
          <button 
            onClick={() => onViewChange('tools')}
            onKeyDown={(e) => handleKeyDown(e, () => onViewChange('tools'))}
            tabIndex={0}
            className={`px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentView === 'tools' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Tools
          </button>
          <button 
            onClick={() => onViewChange('workflows')}
            onKeyDown={(e) => handleKeyDown(e, () => onViewChange('workflows'))}
            tabIndex={0}
            className={`px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentView === 'workflows' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Workflows
          </button>
          <button 
            onClick={() => onViewChange('models')}
            onKeyDown={(e) => handleKeyDown(e, () => onViewChange('models'))}
            tabIndex={0}
            className={`px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentView === 'models' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Models
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Model Quick Actions */}
          <ModelQuickActions
            currentModel={currentModel}
            availableModels={availableModels}
            isConnected={isConnected}
            onModelSwitch={onModelSwitch}
            onOpenModelHub={onOpenModelHub}
          />
          
          <button 
            onClick={onThemeToggle}
            onKeyDown={(e) => handleKeyDown(e, onThemeToggle)}
            tabIndex={0}
            className="p-2 hover:bg-accent rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Contextual Toolbar */}
      <div className="h-10 bg-card/30 backdrop-blur-sm border-b border-border flex items-center px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🤖 General mode</span>
          <span>•</span>
          <span>Agent mode</span>
          <span>•</span>
          <span className={isConnected ? 'text-green-500' : 'text-destructive'}>
            Ollama: {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {currentModel && (
            <>
              <span>•</span>
              <span className="text-foreground">
                Active: {currentModel.displayName || currentModel.name}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header; 