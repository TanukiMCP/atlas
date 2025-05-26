"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDELayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
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
    const chatRef = (0, react_1.useRef)(null);
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
        chatRef.current?.insertText(`@${tool.name} `);
    };
    const handleOperationalModeChange = (mode) => {
        console.log('Switching to', mode, 'mode');
        setOperationalMode(mode);
    };
    const handleFileSelect = (file) => {
        // Map the file explorer's FileItem to FileInfo for FileContentViewer
        const fileInfo = {
            name: file.name,
            path: file.name,
            type: file.type,
            modified: new Date(),
        };
        setSelectedFile(fileInfo);
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ide-container flex flex-col h-full w-full overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "menu-bar flex-shrink-0", children: (0, jsx_runtime_1.jsx)(menu_bar_1.MenuBar, { onNewChat: handleNewChat, onOpenProject: handleOpenProject, onSaveChat: handleSaveChat, onSubjectModeChange: switchMode, currentMode: currentMode, onOpenMCPManager: handleOpenMCPManager, onOpenLLMPromptManagement: handleOpenLLMPromptManagement, onNavigate: handleNavigate }) }), (0, jsx_runtime_1.jsxs)("div", { className: "toolbar flex-shrink-0", children: [activeMainView === 'chat' && ((0, jsx_runtime_1.jsx)(toolbar_1.Toolbar, { currentMode: currentMode, onModeChange: switchMode, onAtSymbolTrigger: () => setShowAtSymbol(true), operationalMode: operationalMode, onOperationalModeChange: handleOperationalModeChange, onEmergencyStop: handleEmergencyStop, onShowProcessingTier: () => setShowProcessingTier(!showProcessingTier), onShowToolPanel: () => setShowToolPanel(!showToolPanel), isProcessing: isProcessing })), activeMainView === 'workflow-manager' && ((0, jsx_runtime_1.jsxs)("div", { children: [" ", "Workflow Manager Toolbar Content Here"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "main-content-area flex-grow flex overflow-hidden", children: (0, jsx_runtime_1.jsx)(panel_manager_1.PanelManager, { layout: layout, onLayoutChange: updateLayout, panels: {
                        fileExplorer: (0, jsx_runtime_1.jsx)(working_file_tree_1.WorkingFileTree, { onFileSelect: handleFileSelect }),
                        // Main panel content will now be dynamic based on activeMainView
                        centerPanel: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [activeMainView === 'chat' && (0, jsx_runtime_1.jsx)(chat_interface_1.ChatInterface, { ref: chatRef, onAtSymbolTrigger: handleAtSymbolTrigger, operationalMode: operationalMode }), activeMainView === 'workflow-manager' && (0, jsx_runtime_1.jsx)(workflow_manager_1.WorkflowManager, {}) /* Assuming WorkflowManager is the component */, activeMainView === 'settings' && (0, jsx_runtime_1.jsx)("div", { children: "Settings View Placeholder" }), activeMainView === 'llm-prompt-management' && (0, jsx_runtime_1.jsx)("div", { children: "LLM Prompt Management Placeholder" }), activeMainView === 'mcp-servers' && (0, jsx_runtime_1.jsx)("div", { children: "MCP Servers Placeholder" }), activeMainView === 'editor' && selectedFile && ((0, jsx_runtime_1.jsx)(file_content_viewer_1.FileContentViewer, { selectedFile: selectedFile, isVisible: true, onClose: () => {
                                        setSelectedFile(null);
                                        setActiveMainView('chat');
                                    } })), activeMainView === 'editor' && !selectedFile && ((0, jsx_runtime_1.jsx)("div", { style: { padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }, children: "Select a file from the explorer to view its content." }))] })),
                        rightPanel: ((0, jsx_runtime_1.jsxs)("div", { style: { height: '100%', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                        display: 'flex',
                                        backgroundColor: 'var(--color-bg-secondary)', // Use theme variable
                                        borderBottom: '1px solid var(--color-border)' // Use theme variable
                                    }, children: [
                                        { id: 'workflow', label: 'Workflows', icon: '⚡' },
                                        { id: 'tools', label: 'Tools', icon: '🛠️' },
                                        { id: 'agents', label: 'Agents', icon: '🤖' },
                                        { id: 'analytics', label: 'Analytics', icon: '📊' }
                                    ].map(tab => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveRightPanel(tab.id), style: {
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
                                        }, children: [tab.icon, " ", tab.label] }, tab.id))) }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, overflowY: 'auto' }, children: [" ", activeRightPanel === 'workflow' && (0, jsx_runtime_1.jsx)(visual_workflow_builder_1.VisualWorkflowBuilder, {}), activeRightPanel === 'tools' && (0, jsx_runtime_1.jsx)(comprehensive_tool_catalog_1.ComprehensiveToolCatalog, {}), activeRightPanel === 'agents' && (0, jsx_runtime_1.jsx)(specialized_agent_templates_1.SpecializedAgentTemplates, {}), activeRightPanel === 'analytics' && (0, jsx_runtime_1.jsx)(analytics_dashboard_1.AnalyticsDashboard, {})] })] })),
                        bottomPanel: showToolPanel ? ((0, jsx_runtime_1.jsx)(tool_execution_panel_1.ToolExecutionPanel, { isVisible: showToolPanel, onClose: () => setShowToolPanel(false) })) : null
                    } }) }), (0, jsx_runtime_1.jsx)("div", { className: "status-bar flex-shrink-0", children: (0, jsx_runtime_1.jsx)(status_bar_1.StatusBar, { currentMode: currentMode, connectionStatus: "connected", activeTools: [] }) }), (0, jsx_runtime_1.jsx)(tool_selector_1.ToolSelector, { isOpen: showAtSymbol, position: atSymbolPosition, operationalMode: operationalMode, onToolSelect: handleToolSelect, onClose: () => setShowAtSymbol(false) }), showProcessingTier && ((0, jsx_runtime_1.jsx)(processing_tier_indicator_1.ProcessingTierIndicator, { currentTier: currentTier, complexity: 6, estimatedDuration: 45, isActive: isProcessing, onTierSwitch: handleTierSwitch })), (0, jsx_runtime_1.jsx)(management_center_modal_1.ManagementCenterModal, { isOpen: showManagementCenter, onClose: () => setShowManagementCenter(false) })] }));
};
exports.IDELayout = IDELayout;
//# sourceMappingURL=ide-layout.js.map