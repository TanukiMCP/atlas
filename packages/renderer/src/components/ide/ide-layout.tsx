import React, { useState, useEffect, useRef } from 'react';
import { MenuBar } from './menu-bar';
import { Toolbar } from './toolbar';
import { StatusBar } from './status-bar';
import { PanelManager } from './panel-manager';
import { ImprovedChatInterface, ImprovedChatInterfaceHandle } from '../chat/improved-chat-interface';
import { WorkingFileTree } from '../file-explorer/working-file-tree';
// import { RealFileTree } from '../file-explorer/real-file-tree';
import { VisualWorkflowBuilder } from '../workflows/visual-workflow-builder';
import { ComprehensiveToolCatalog } from '../tools/comprehensive-tool-catalog';
import { SpecializedAgentTemplates } from '../agents/specialized-agent-templates';
import { AnalyticsDashboard } from '../analytics/analytics-dashboard';
import { WorkflowManager } from '../workflows/workflow-manager';
import { ManagementCenterModal } from '../management/management-center-modal';
// import { CodeEditor } from '../editor/code-editor';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import { useSubjectMode } from '../../hooks/use-subject-mode';
import { useUIStore } from '../../hooks/use-ui-store';
import { ToolSelector } from '../shared/tool-selector';
import { FileContentViewer } from '../shared/file-content-viewer';
import { ProcessingTierIndicator } from '../shared/processing-tier-indicator';
import { ToolExecutionPanel } from '../shared/tool-execution-panel';
import { FileInfo } from '../../services/file-service';
import { FileNode } from '../../stores/app-store';
import { MCPTool } from '../../services/mcp-service';

export type AppView = 
  | 'chat' 
  | 'workflow-manager' 
  | 'tool-catalog' 
  | 'agent-templates' 
  | 'analytics-dashboard'
  | 'settings'
  | 'llm-prompt-management'
  | 'mcp-servers'
  | 'editor'; // Added for file editing

type ProcessingTier = 'basic' | 'advanced' | 'premium' | 'enterprise';

export const IDELayout: React.FC = () => {
  const [showAtSymbol, setShowAtSymbol] = useState(false);
  const chatRef = useRef<ImprovedChatInterfaceHandle>(null);
  const [atSymbolPosition, setAtSymbolPosition] = useState({ x: 0, y: 0 });
  const [showManagementCenter, setShowManagementCenter] = useState(false);
  const [operationalMode, setOperationalMode] = useState<'agent' | 'chat'>('agent');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showProcessingTier, setShowProcessingTier] = useState(false);
  const [currentTier, setCurrentTier] = useState<ProcessingTier>('advanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<'workflow' | 'tools' | 'agents' | 'analytics'>('workflow');
  const [activeMainView, setActiveMainView] = useState<AppView>('chat'); // Back to chat view
  

  
  const { currentMode, switchMode } = useSubjectMode();
  const { layout, updateLayout } = useUIStore();
  
  // Helper function to convert FileInfo to FileNode
  const fileInfoToFileNode = (fileInfo: FileInfo): FileNode => {
    return {
      id: fileInfo.path || fileInfo.name,
      name: fileInfo.name,
      type: fileInfo.type === 'directory' ? 'folder' : 'file',
      path: fileInfo.path,
      size: fileInfo.size,
      modified: fileInfo.modified,
      children: [],
      isExpanded: false
    };
  };
  
  // Handler functions
  const handleNewChat = () => console.log('New Chat');
  const handleOpenProject = () => console.log('Open Project');
  const handleSaveChat = () => console.log('Save Chat');
  const handleSaveAsWorkflow = () => console.log('Save as Workflow');
  const handleToggleFullscreen = () => console.log('Toggle Fullscreen');
  const handleToolSelect = (tool: MCPTool) => {
    console.log('Tool selected:', tool);
    setShowAtSymbol(false);
    chatRef.current?.insertText(`@${tool.name} `);
  };
  const handleOperationalModeChange = (mode: 'agent' | 'chat') => {
    console.log('Switching to', mode, 'mode');
    setOperationalMode(mode);
  };
  
  const handleFileSelect = (file: any) => {
    // Convert FileItem to FileNode for FileContentViewer
    const fileNode = fileInfoToFileNode({
      name: file.name,
      path: file.name,
      type: file.type === 'directory' ? 'directory' : 'file',
      modified: new Date(),
    });
    setSelectedFile(fileNode);
    if (file.type === 'file') {
      setActiveMainView('editor');
    }
  };
  
  const handleTierSwitch = (tier: ProcessingTier) => {
    setCurrentTier(tier);
    console.log('Switched to tier:', tier);
  };
  
  const handleEmergencyStop = () => {
    console.log('Emergency Stop');
    setIsProcessing(false);
  };
  
  const getExecutionContext = () => ({ currentMode });
  const getToolRouter = () => ({ /* placeholder tool router */ });
  
  const handleOpenLLMPromptManagement = () => {
    setActiveMainView('llm-prompt-management');
    console.log('Opening LLM Prompt Management');
  };

  const handleOpenMCPManager = () => {
    // This was opening a modal, decide if it should be a main view or keep as modal
    // For now, let's assume it could be a main view for consistency in routing via menubar
    setActiveMainView('mcp-servers'); 
    console.log('Opening MCP Server Management');
    // Alternatively, if it must be a modal: setShowManagementCenter(true);
  };

  // Modify MenuBar props to include setActiveMainView or specific handlers
  // For example, a generic handler or specific ones:
  const openSettingsView = () => setActiveMainView('settings');
  const handleNavigate = (view: AppView) => {
    setActiveMainView(view);
  };
  
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
  };

  // Update bottom panel visibility when tool panel state changes
  useEffect(() => {
    updateLayout({
      bottomPanel: {
        ...layout.bottomPanel,
        isVisible: showToolPanel
      }
    });
  }, [showToolPanel, updateLayout]);

  return (
    <div className="ide-container flex flex-col h-full w-full overflow-hidden">
      {/* Menu Bar */}
      <div className="menu-bar flex-shrink-0">
        <MenuBar 
          onNewChat={handleNewChat}
          onOpenProject={handleOpenProject}
          onSaveChat={handleSaveChat}
          onSubjectModeChange={switchMode}
          currentMode={currentMode}
          onOpenMCPManager={handleOpenMCPManager} // Already uses setActiveMainView
          onOpenLLMPromptManagement={handleOpenLLMPromptManagement} // Already uses setActiveMainView
          onNavigate={handleNavigate} // Pass the new navigator function
        />
      </div>
      
      {/* Toolbar - Contextual based on activeMainView */}
      <div className="toolbar flex-shrink-0">
        {activeMainView === 'chat' && (
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
        )}
        {/* Add other contextual toolbars here, e.g., for WorkflowManager */}
        {activeMainView === 'workflow-manager' && (
          <div> {/* Placeholder for Workflow Manager Toolbar */} 
            Workflow Manager Toolbar Content Here
          </div>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="main-content-area flex-grow flex overflow-hidden">
        <PanelManager
          layout={layout}
          onLayoutChange={updateLayout}
          panels={{
            fileExplorer: <WorkingFileTree onFileSelect={handleFileSelect} />,
            // Main panel content will now be dynamic based on activeMainView
            centerPanel: (
              <>
                {activeMainView === 'chat' && <ImprovedChatInterface ref={chatRef} onAtSymbolTrigger={handleAtSymbolTrigger} operationalMode={operationalMode} />}
                {activeMainView === 'workflow-manager' && <WorkflowManager /> /* Assuming WorkflowManager is the component */}
                {activeMainView === 'settings' && <div>Settings View Placeholder</div>}
                {activeMainView === 'llm-prompt-management' && <div>LLM Prompt Management Placeholder</div>}
                {activeMainView === 'mcp-servers' && <div>MCP Servers Placeholder</div>}
                {activeMainView === 'editor' && selectedFile && (
                  <FileContentViewer
                    selectedFile={selectedFile}
                    isVisible={true}
                    onClose={() => {
                      setSelectedFile(null);
                      setActiveMainView('chat');
                    }}
                  />
                )}
                {activeMainView === 'editor' && !selectedFile && (
                  <div style={{padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)'}}>
                    Select a file from the explorer to view its content.
                  </div>
                )}
                {/* Add other views here */}
              </>
            ),
            rightPanel: (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Right Panel Tabs */}
                <div style={{
                  display: 'flex',
                  backgroundColor: 'var(--color-bg-secondary)', // Use theme variable
                  borderBottom: '1px solid var(--color-border)' // Use theme variable
                }}>
                  {[
                    { id: 'workflow', label: 'Workflows', icon: '⚡' },
                    { id: 'tools', label: 'Tools', icon: '🛠️' },
                    { id: 'agents', label: 'Agents', icon: '🤖' },
                    { id: 'analytics', label: 'Analytics', icon: '📊' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightPanel(tab.id as any)}
                      style={{
                        flex: 1,
                        padding: '10px 8px', // Adjusted padding
                        border: 'none',
                        backgroundColor: activeRightPanel === tab.id ? 'var(--color-bg-tertiary)' : 'transparent',
                        color: activeRightPanel === tab.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: activeRightPanel === tab.id ? '600' : '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        borderBottom: activeRightPanel === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Right Panel Content */}
                <div style={{ flex: 1, overflowY: 'auto' }}> {/* Added overflowY */}
                  {activeRightPanel === 'workflow' && <VisualWorkflowBuilder />}
                  {activeRightPanel === 'tools' && <ComprehensiveToolCatalog />}
                  {activeRightPanel === 'agents' && <SpecializedAgentTemplates />}
                  {activeRightPanel === 'analytics' && <AnalyticsDashboard />}
                </div>
              </div>
            ),
            bottomPanel: showToolPanel ? (
              <ToolExecutionPanel 
                isVisible={showToolPanel}
                onClose={() => setShowToolPanel(false)}
              />
            ) : null
          }}
        />
      </div>
      
      {/* Status Bar */}
      <div className="status-bar flex-shrink-0">
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
      
      {/* File Content Viewer - Old Modal Style - To be removed if editor view replaces it fully */}
      {/* <FileContentViewer
        selectedFile={selectedFile}
        isVisible={showFileViewer} // This state variable is no longer the primary control for editor
        onClose={() => setShowFileViewer(false)}
      /> */}

      {/* Processing Tier Indicator */}
      {showProcessingTier && (
        <ProcessingTierIndicator
          currentTier={currentTier}
          complexity={6}
          isActive={isProcessing}
          estimatedTime="45 seconds"
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