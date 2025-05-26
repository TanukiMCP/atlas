"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDELayout = void 0;
const react_1 = __importStar(require("react"));
const menu_bar_1 = require("./menu-bar");
const toolbar_1 = require("./toolbar");
const status_bar_1 = require("./status-bar");
const panel_manager_1 = require("./panel-manager");
const chat_interface_1 = require("../chat/chat-interface");
const working_file_tree_1 = require("../file-explorer/working-file-tree");
const visual_workflow_builder_1 = require("../workflows/visual-workflow-builder");
const comprehensive_tool_catalog_1 = require("../tools/comprehensive-tool-catalog");
const specialized_agent_templates_1 = require("../agents/specialized-agent-templates");
const analytics_dashboard_1 = require("../analytics/analytics-dashboard");
const workflow_manager_1 = require("../workflows/workflow-manager");
const management_center_modal_1 = require("../management/management-center-modal");
const use_keyboard_shortcuts_1 = require("../../hooks/use-keyboard-shortcuts");
const use_subject_mode_1 = require("../../hooks/use-subject-mode");
const use_ui_store_1 = require("../../hooks/use-ui-store");
const tool_selector_1 = require("../shared/tool-selector");
const file_content_viewer_1 = require("../shared/file-content-viewer");
const processing_tier_indicator_1 = require("../shared/processing-tier-indicator");
const tool_execution_panel_1 = require("../shared/tool-execution-panel");
const IDELayout = () => {
    const [showAtSymbol, setShowAtSymbol] = (0, react_1.useState)(false);
    const [atSymbolPosition, setAtSymbolPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const [showManagementCenter, setShowManagementCenter] = (0, react_1.useState)(false);
    const [operationalMode, setOperationalMode] = (0, react_1.useState)('agent');
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [showFileViewer, setShowFileViewer] = (0, react_1.useState)(false);
    const [showProcessingTier, setShowProcessingTier] = (0, react_1.useState)(false);
    const [currentTier, setCurrentTier] = (0, react_1.useState)('MODERATE');
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [showToolPanel, setShowToolPanel] = (0, react_1.useState)(false);
    const [activeRightPanel, setActiveRightPanel] = (0, react_1.useState)('workflow');
    const [activeMainView, setActiveMainView] = (0, react_1.useState)('chat'); // New state for managing main views
    const { currentMode, switchMode } = (0, use_subject_mode_1.useSubjectMode)();
    const { layout, updateLayout } = (0, use_ui_store_1.useUIStore)();
    // Handler functions
    const handleNewChat = () => console.log('New Chat');
    const handleOpenProject = () => console.log('Open Project');
    const handleSaveChat = () => console.log('Save Chat');
    const handleSaveAsWorkflow = () => console.log('Save as Workflow');
    const handleToggleFullscreen = () => console.log('Toggle Fullscreen');
    const handleToolSelect = (tool) => {
        console.log('Tool selected:', tool);
        setShowAtSymbol(false);
        // TODO: Integrate with chat interface to add tool to message
    };
    const handleOperationalModeChange = (mode) => {
        console.log('Switching to', mode, 'mode');
        setOperationalMode(mode);
    };
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        if (file.type === 'file') {
            setActiveMainView('editor');
        }
    };
    const handleTierSwitch = (tier) => {
        setCurrentTier(tier);
        console.log('Switched to tier:', tier);
    };
    const handleEmergencyStop = () => {
        console.log('Emergency Stop');
        setIsProcessing(false);
    };
    const getExecutionContext = () => ({ currentMode });
    const getToolRouter = () => ({ /* placeholder tool router */});
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
    const handleNavigate = (view) => {
        setActiveMainView(view);
    };
    // Setup keyboard shortcuts
    (0, use_keyboard_shortcuts_1.useKeyboardShortcuts)({
        'Ctrl+Shift+P': () => setShowAtSymbol(true),
        'Ctrl+N': handleNewChat,
        'Ctrl+O': handleOpenProject,
        'Ctrl+S': handleSaveChat,
        'Ctrl+Shift+S': handleSaveAsWorkflow,
        'F11': handleToggleFullscreen
    });
    const handleAtSymbolTrigger = (event, position) => {
        if (event.key === '@') {
            setAtSymbolPosition(position);
            setShowAtSymbol(true);
        }
    };
    // Update bottom panel visibility when tool panel state changes
    (0, react_1.useEffect)(() => {
        updateLayout({
            bottomPanel: {
                ...layout.bottomPanel,
                isVisible: showToolPanel
            }
        });
    }, [showToolPanel, updateLayout]);
    return (<div className="ide-container flex flex-col h-full w-full overflow-hidden">
      {/* Menu Bar */}
      <div className="menu-bar flex-shrink-0">
        <menu_bar_1.MenuBar onNewChat={handleNewChat} onOpenProject={handleOpenProject} onSaveChat={handleSaveChat} onSubjectModeChange={switchMode} currentMode={currentMode} onOpenMCPManager={handleOpenMCPManager} // Already uses setActiveMainView
     onOpenLLMPromptManagement={handleOpenLLMPromptManagement} // Already uses setActiveMainView
     onNavigate={handleNavigate} // Pass the new navigator function
    />
      </div>
      
      {/* Toolbar - Contextual based on activeMainView */}
      <div className="toolbar flex-shrink-0">
        {activeMainView === 'chat' && (<toolbar_1.Toolbar currentMode={currentMode} onModeChange={switchMode} onAtSymbolTrigger={() => setShowAtSymbol(true)} operationalMode={operationalMode} onOperationalModeChange={handleOperationalModeChange} onEmergencyStop={handleEmergencyStop} onShowProcessingTier={() => setShowProcessingTier(!showProcessingTier)} onShowToolPanel={() => setShowToolPanel(!showToolPanel)} isProcessing={isProcessing}/>)}
        {/* Add other contextual toolbars here, e.g., for WorkflowManager */}
        {activeMainView === 'workflow-manager' && (<div> {/* Placeholder for Workflow Manager Toolbar */} 
            Workflow Manager Toolbar Content Here
          </div>)}
      </div>
      
      {/* Main Content Area */}
      <div className="main-content-area flex-grow flex overflow-hidden">
        <panel_manager_1.PanelManager layout={layout} onLayoutChange={updateLayout} panels={{
            fileExplorer: <working_file_tree_1.WorkingFileTree onFileSelect={handleFileSelect}/>,
            // Main panel content will now be dynamic based on activeMainView
            centerPanel: (<>
                {activeMainView === 'chat' && <chat_interface_1.ChatInterface onAtSymbolTrigger={handleAtSymbolTrigger} operationalMode={operationalMode}/>}
                {activeMainView === 'workflow-manager' && <workflow_manager_1.WorkflowManager /> /* Assuming WorkflowManager is the component */}
                {activeMainView === 'settings' && <div>Settings View Placeholder</div>}
                {activeMainView === 'llm-prompt-management' && <div>LLM Prompt Management Placeholder</div>}
                {activeMainView === 'mcp-servers' && <div>MCP Servers Placeholder</div>}
                {activeMainView === 'editor' && selectedFile && (<file_content_viewer_1.FileContentViewer selectedFile={selectedFile} 
                // isVisible prop is no longer needed if it's part of main content flow
                // The component itself should be visible if rendered.
                // Ensure FileContentViewer is styled to fill its container.
                onClose={() => {
                        setSelectedFile(null); // Clear selected file
                        setActiveMainView('chat'); // Revert to chat or previous view
                    }}/>)}
                {activeMainView === 'editor' && !selectedFile && (<div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Select a file from the explorer to view its content.
                  </div>)}
                {/* Add other views here */}
              </>),
            rightPanel: (<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                ].map(tab => (<button key={tab.id} onClick={() => setActiveRightPanel(tab.id)} style={{
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
                    }}>
                      {tab.icon} {tab.label}
                    </button>))}
                </div>
                
                {/* Right Panel Content */}
                <div style={{ flex: 1, overflowY: 'auto' }}> {/* Added overflowY */}
                  {activeRightPanel === 'workflow' && <visual_workflow_builder_1.VisualWorkflowBuilder />}
                  {activeRightPanel === 'tools' && <comprehensive_tool_catalog_1.ComprehensiveToolCatalog />}
                  {activeRightPanel === 'agents' && <specialized_agent_templates_1.SpecializedAgentTemplates />}
                  {activeRightPanel === 'analytics' && <analytics_dashboard_1.AnalyticsDashboard />}
                </div>
              </div>),
            bottomPanel: showToolPanel ? (<tool_execution_panel_1.ToolExecutionPanel isVisible={showToolPanel} onClose={() => setShowToolPanel(false)}/>) : null
        }}/>
      </div>
      
      {/* Status Bar */}
      <div className="status-bar flex-shrink-0">
        <status_bar_1.StatusBar currentMode={currentMode} connectionStatus="connected" activeTools={[]}/>
      </div>
      
      {/* Tool Selector */}
      <tool_selector_1.ToolSelector isOpen={showAtSymbol} position={atSymbolPosition} operationalMode={operationalMode} onToolSelect={handleToolSelect} onClose={() => setShowAtSymbol(false)}/>
      
      {/* File Content Viewer - Old Modal Style - To be removed if editor view replaces it fully */}
      {/* <FileContentViewer
          selectedFile={selectedFile}
          isVisible={showFileViewer} // This state variable is no longer the primary control for editor
          onClose={() => setShowFileViewer(false)}
        /> */}

      {/* Processing Tier Indicator */}
      {showProcessingTier && (<processing_tier_indicator_1.ProcessingTierIndicator currentTier={currentTier} complexity={6} estimatedDuration={45} isActive={isProcessing} onTierSwitch={handleTierSwitch}/>)}

      {/* Management Center Modal */}
      <management_center_modal_1.ManagementCenterModal isOpen={showManagementCenter} onClose={() => setShowManagementCenter(false)}/>
    </div>);
};
exports.IDELayout = IDELayout;
//# sourceMappingURL=ide-layout.js.map