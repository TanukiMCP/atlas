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
  onOpenLocalLLMHub: () => void;
  onFileExplorerToggle: () => void;
  isFileExplorerVisible: boolean;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  agentMode?: boolean;
  onAgentModeToggle?: () => void;
  isProcessing: boolean;
  onStopProcessing: () => void;
  currentWorkingDirectory: string | null;
  onChangeWorkingDirectory: (dirPath: string) => Promise<void>;
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
  onOpenLocalLLMHub,
  onFileExplorerToggle,
  isFileExplorerVisible,
  subjectMode,
  onSubjectModeChange,
  agentMode = false,
  onAgentModeToggle = () => {},
  isProcessing,
  onStopProcessing,
  currentWorkingDirectory,
  onChangeWorkingDirectory
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
        onOpenModelHub={onOpenModelHub}
        onOpenLocalLLMHub={onOpenLocalLLMHub}
        currentWorkingDirectory={currentWorkingDirectory}
        onChangeWorkingDirectory={onChangeWorkingDirectory}
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
        onToggleMenu={onFileExplorerToggle}
      />
    </>
  );
};

export default Header; 