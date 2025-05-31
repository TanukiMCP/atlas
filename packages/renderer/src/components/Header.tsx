import React from 'react';
import { ViewType, TanukiModel } from '../types';
import { PrimaryMenuBar } from './toolbar/PrimaryMenuBar';
import { ContextualToolbar } from './toolbar/ContextualToolbar';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentModel?: TanukiModel;
  availableModels: TanukiModel[];
  isConnected: boolean;
  onModelSwitch: (model: TanukiModel | undefined) => void;
  onOpenModelHub: () => void;
  onOpenLocalLLMHub: () => void;
  onFileExplorerToggle: () => void;
  isFileExplorerVisible: boolean;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  agentMode: boolean;
  onAgentModeToggle: () => void;
  isProcessing: boolean;
  onStopProcessing: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange,
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
  agentMode,
  onAgentModeToggle,
  isProcessing,
  onStopProcessing
}) => {
  // Wrapper function to handle ViewType to string conversion
  const handleViewChange = (view: string) => {
    onViewChange(view as ViewType);
  };

  return (
    <>
      {/* Primary Menu Bar */}
      <PrimaryMenuBar
        onViewChange={handleViewChange}
        onFileExplorerToggle={onFileExplorerToggle}
        subjectMode={subjectMode}
        onSubjectModeChange={onSubjectModeChange}
        onOpenModelHub={onOpenModelHub}
        onOpenLocalLLMHub={onOpenLocalLLMHub}
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