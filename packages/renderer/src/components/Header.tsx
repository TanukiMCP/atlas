import React, { useState } from 'react';
import { HeaderProps, TanukiModel, ViewType } from '../types/index';
import { PrimaryMenuBar } from './toolbar/PrimaryMenuBar';
import { ContextualToolbar } from './toolbar/ContextualToolbar';

interface EnhancedHeaderProps extends HeaderProps {
  currentModel?: TanukiModel;
  availableModels: TanukiModel[];
  isConnected: boolean;
  onModelSwitch: (modelName: string) => void;
  onOpenModelHub: () => void;
  onFileExplorerToggle: () => void;
  isFileExplorerVisible: boolean;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  agentMode: boolean;
  onAgentModeToggle: () => void;
  isProcessing: boolean;
  onStopProcessing: () => void;
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
  onOpenModelHub,
  onFileExplorerToggle,
  isFileExplorerVisible,
  subjectMode,
  onSubjectModeChange,
  agentMode,
  onAgentModeToggle,
  isProcessing,
  onStopProcessing
}) => {
  // Wrapper function to handle ViewType to string conversion
  const handleViewChange = (view: string) => {
    onViewChange(view as ViewType);
  };

  // Keyboard navigation handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      {/* Primary Menu Bar */}
      <PrimaryMenuBar
        onThemeToggle={onThemeToggle}
        theme={theme}
        onViewChange={handleViewChange}
        onFileExplorerToggle={onFileExplorerToggle}
        subjectMode={subjectMode}
        onSubjectModeChange={onSubjectModeChange}
      />

      {/* Contextual Toolbar */}
      <ContextualToolbar
        currentView={currentView}
        isProcessing={isProcessing}
        agentMode={agentMode}
        onAgentModeToggle={onAgentModeToggle}
        onStopProcessing={onStopProcessing}
        onToolSelect={() => console.log('Tool selection triggered')}
        onQuickSettings={() => onViewChange('settings')}
        onViewChange={handleViewChange}
      />
    </>
  );
};

export default Header; 