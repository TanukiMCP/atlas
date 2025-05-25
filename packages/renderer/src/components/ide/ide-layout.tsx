import React, { useState } from 'react';
import { MenuBar } from './menu-bar';
import { Toolbar } from './toolbar';
import { StatusBar } from './status-bar';
import { PanelManager } from './panel-manager';
import { ChatInterface } from '../chat/chat-interface';
import { FileExplorer } from '../file-explorer/file-tree';
import { WorkflowManager } from '../workflows/workflow-manager';
import { ManagementCenterModal } from '../management/management-center-modal';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import { useSubjectMode } from '../../hooks/use-subject-mode';
import { useUIStore } from '../../hooks/use-ui-store';
import { ToolSelector } from '../shared/tool-selector';
import { FileContentViewer } from '../shared/file-content-viewer';
import { ProcessingTierIndicator, ProcessingTier } from '../shared/processing-tier-indicator';
import { ToolExecutionPanel } from '../shared/tool-execution-panel';
import { FileInfo } from '../../services/file-service';

export const IDELayout: React.FC = () => {
  const [showAtSymbol, setShowAtSymbol] = useState(false);
  const [atSymbolPosition, setAtSymbolPosition] = useState({ x: 0, y: 0 });
  const [showManagementCenter, setShowManagementCenter] = useState(false);
  const [operationalMode, setOperationalMode] = useState<'agent' | 'chat'>('agent');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showProcessingTier, setShowProcessingTier] = useState(false);
  const [currentTier, setCurrentTier] = useState<ProcessingTier>('MODERATE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToolPanel, setShowToolPanel] = useState(false);
  
  const { currentMode, switchMode } = useSubjectMode();
  const { layout, updateLayout } = useUIStore();
  
  // Handler functions
  const handleNewChat = () => console.log('New Chat');
  const handleOpenProject = () => console.log('Open Project');
  const handleSaveChat = () => console.log('Save Chat');
  const handleSaveAsWorkflow = () => console.log('Save as Workflow');
  const handleToggleFullscreen = () => console.log('Toggle Fullscreen');
  const handleToolSelect = (tool: any) => {
    console.log('Tool selected:', tool);
    setShowAtSymbol(false);
    // TODO: Integrate with chat interface to add tool to message
  };
  const handleOperationalModeChange = (mode: 'agent' | 'chat') => {
    console.log('Switching to', mode, 'mode');
    setOperationalMode(mode);
  };
  
  const handleFileSelect = (file: FileInfo) => {
    setSelectedFile(file);
    if (file.type === 'file') {
      setShowFileViewer(true);
    }
  };
  
  const handleTierSwitch = (tier: ProcessingTier) => {
    setCurrentTier(tier);
    console.log('Switched to tier:', tier);
  };
  
  const handleEmergencyStop = () => {
    setIsProcessing(false);
    console.log('Emergency stop activated!');
  };
  
  const getExecutionContext = () => ({ currentMode });
  const getToolRouter = () => ({ /* placeholder tool router */ });
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Shift+P': () => setShowAtSymbol(true),
    'Ctrl+N': handleNewChat,
    'Ctrl+O': handleOpenProject,
    'Ctrl+S': handleSaveChat,
    'Ctrl+Shift+S': handleSaveAsWorkflow,
    'F11': handleToggleFullscreen
  });

  const handleAtSymbolTrigger = (event: React.KeyboardEvent, position: { x: number; y: number }) => {
    if (event.key === '@') {
      setAtSymbolPosition(position);
      setShowAtSymbol(true);
    }
  };  return (
    <div className="ide-container h-screen flex flex-col">
      {/* Menu Bar */}
      <div className="menu-bar">
        <MenuBar 
          onNewChat={handleNewChat}
          onOpenProject={handleOpenProject}
          onSaveChat={handleSaveChat}
          onSubjectModeChange={switchMode}
          currentMode={currentMode}
          onOpenMCPManager={() => setShowManagementCenter(true)}
          onOpenLLMPromptManagement={() => console.log('LLM Prompt Management')}
        />
      </div>
      
      {/* Toolbar */}
      <div className="toolbar">
        <Toolbar 
          currentMode={currentMode}
          onModeChange={switchMode}
          onAtSymbolTrigger={() => setShowAtSymbol(true)}
          operationalMode={operationalMode}
          onOperationalModeChange={handleOperationalModeChange}
          onEmergencyStop={handleEmergencyStop}
          onShowProcessingTier={() => setShowProcessingTier(!showProcessingTier)}
          onShowToolPanel={() => setShowToolPanel(!showToolPanel)}
          isProcessing={isProcessing}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <PanelManager
          layout={layout}
          onLayoutChange={updateLayout}
          panels={{
            fileExplorer: <FileExplorer onFileSelect={handleFileSelect} />,
            chatInterface: <ChatInterface 
              onAtSymbolTrigger={handleAtSymbolTrigger} 
              operationalMode={operationalMode}
            />,
            workflowManager: <WorkflowManager />,
            toolOutput: showToolPanel ? (
              <ToolExecutionPanel 
                isVisible={showToolPanel}
                onClose={() => setShowToolPanel(false)}
              />
            ) : (
              <div className="panel-content">
                <div style={{ 
                  padding: '32px', 
                  textAlign: 'center', 
                  color: 'var(--color-text-muted)' 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
                  <div>Tool Execution Panel</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    Click the 🛠️ button in the toolbar to show tool results
                  </div>
                </div>
              </div>
            )
          }}
        />
      </div>
      
      {/* Status Bar */}
      <div className="status-bar">
        <StatusBar 
          currentMode={currentMode}
          connectionStatus="connected"
          activeTools={[]}
        />
      </div>
      
      {/* Tool Selector */}
      <ToolSelector
        isOpen={showAtSymbol}
        position={atSymbolPosition}
        operationalMode={operationalMode}
        onToolSelect={handleToolSelect}
        onClose={() => setShowAtSymbol(false)}
      />
      
      {/* File Content Viewer */}
      <FileContentViewer
        selectedFile={selectedFile}
        isVisible={showFileViewer}
        onClose={() => setShowFileViewer(false)}
      />

      {/* Processing Tier Indicator */}
      {showProcessingTier && (
        <ProcessingTierIndicator
          currentTier={currentTier}
          complexity={6}
          estimatedDuration={45}
          isActive={isProcessing}
          onTierSwitch={handleTierSwitch}
        />
      )}

      {/* Management Center Modal */}
      <ManagementCenterModal
        isOpen={showManagementCenter}
        onClose={() => setShowManagementCenter(false)}
      />
    </div>
  );
};