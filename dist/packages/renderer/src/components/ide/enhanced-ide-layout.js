"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedIDELayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Enhanced IDE Layout with Complete Workflow Generation Integration
 * Integrates all workflow components following wireframe specifications
 */
const react_1 = require("react");
const menu_bar_1 = require("./menu-bar");
const toolbar_1 = require("./toolbar");
const status_bar_1 = require("./status-bar");
const panel_manager_1 = require("./panel-manager");
const enhanced_chat_interface_1 = require("../chat/enhanced-chat-interface");
const enhanced_at_symbol_dropdown_1 = require("../chat/enhanced-at-symbol-dropdown");
const workflow_parameter_dialog_1 = require("../workflows/workflow-parameter-dialog");
const file_tree_1 = require("../file-explorer/file-tree");
const management_center_modal_1 = require("../management/management-center-modal");
const llm_prompt_management_1 = require("../prompt-management/llm-prompt-management");
const use_keyboard_shortcuts_1 = require("../../hooks/use-keyboard-shortcuts");
const use_subject_mode_1 = require("../../hooks/use-subject-mode");
const use_ui_store_1 = require("../../hooks/use-ui-store");
const llm_store_1 = require("../../stores/llm-store");
const mcp_store_1 = require("../../stores/mcp-store");
const workflow_generation_1 = require("../../services/workflow-generation");
const workflow_execution_1 = require("../../services/workflow-execution");
const EnhancedIDELayout = () => {
    const [showAtSymbol, setShowAtSymbol] = (0, react_1.useState)(false);
    const [atSymbolPosition, setAtSymbolPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const [showManagementCenter, setShowManagementCenter] = (0, react_1.useState)(false);
    const [showLLMPromptManagement, setShowLLMPromptManagement] = (0, react_1.useState)(false);
    const [showWorkflowParameterDialog, setShowWorkflowParameterDialog] = (0, react_1.useState)(false);
    const [selectedWorkflowForExecution, setSelectedWorkflowForExecution] = (0, react_1.useState)(null);
    const { currentMode, switchMode } = (0, use_subject_mode_1.useSubjectMode)();
    const { layout, updateLayout } = (0, use_ui_store_1.useUIStore)();
    const { checkHealth, refreshModels } = (0, llm_store_1.useLLMStore)();
    const { initialize: initializeMCP } = (0, mcp_store_1.useMCPStore)();
    const workflowGenerationServiceRef = (0, react_1.useRef)(null);
    const workflowExecutionServiceRef = (0, react_1.useRef)(null);
    const toolRouterRef = (0, react_1.useRef)(null); // Mock tool router for now
    // Initialize services
    (0, react_1.useEffect)(() => {
        // Initialize LLM and MCP services
        const initializeServices = async () => {
            await checkHealth();
            await refreshModels(); // This will set the default model
            await initializeMCP();
        };
        initializeServices();
        // Initialize Workflow Generation Service
        const generationConfig = {
            enableAutoSave: false,
            defaultComplexity: 'moderate',
            maxRefinementIterations: 10,
            timeoutMs: 30000
        };
        const generationEvents = {
            onStateChange: (state) => console.log('Workflow generation state:', state),
            onProgress: (step, progress) => console.log(`Workflow ${step}: ${progress}%`),
            onError: (error) => console.error('Workflow generation error:', error),
            onComplete: (workflow) => {
                console.log('Workflow generated:', workflow);
                // Update UI to show the saved workflow
            }
        };
        workflowGenerationServiceRef.current = new workflow_generation_1.WorkflowGenerationService(generationConfig, generationEvents);
        // Initialize Workflow Execution Service
        const executionConfig = {
            maxExecutionTime: 300000, // 5 minutes
            maxRetries: 3,
            enableLogging: true,
            enableProgressTracking: true
        };
        const executionEvents = {
            onExecutionStart: (execution) => console.log('Workflow execution started:', execution),
            onStepStart: (stepId, stepName) => console.log(`Step started: ${stepName} (${stepId})`),
            onStepComplete: (stepId, result) => console.log(`Step completed: ${stepId}`, result),
            onStepError: (stepId, error) => console.error(`Step error: ${stepId}`, error),
            onExecutionComplete: (execution) => console.log('Workflow execution completed:', execution),
            onExecutionError: (execution, error) => console.error('Workflow execution error:', error),
            onProgress: (executionId, progress) => console.log(`Execution ${executionId}: ${progress}%`)
        };
        workflowExecutionServiceRef.current = new workflow_execution_1.WorkflowExecutionService(executionConfig, executionEvents, toolRouterRef.current);
        // Initialize mock tool router
        toolRouterRef.current = {
            getCategories: async () => [
                { id: 'file', name: 'File Operations', icon: '📁' },
                { id: 'code', name: 'Code Operations', icon: '💻' },
                { id: 'task', name: 'Task Management', icon: '📋' }
            ],
            searchTools: async ({ query, category, limit }) => [
                {
                    id: 'read_file',
                    name: 'read_file',
                    description: 'Read file contents',
                    category: { id: 'file', name: 'File Operations', icon: '📁' },
                    inputSchema: { required: ['path'] },
                    availability: { status: 'available' }
                }
            ],
            executeTool: async (toolName, parameters) => {
                console.log(`Executing tool: ${toolName}`, parameters);
                return { success: true, data: `Mock result for ${toolName}` };
            }
        };
    }, []);
    // Handler functions
    const handleNewChat = () => console.log('New Chat');
    const handleOpenProject = () => console.log('Open Project');
    const handleSaveChat = () => console.log('Save Chat');
    const handleToggleFullscreen = () => console.log('Toggle Fullscreen');
    const handleToolSelect = (tool, parameters) => {
        console.log('Tool selected:', tool, parameters);
        setShowAtSymbol(false);
        // Execute tool via tool router
        if (toolRouterRef.current) {
            toolRouterRef.current.executeTool(tool.name, parameters || {});
        }
    };
    const handleWorkflowSelect = (workflow, parameters) => {
        console.log('Workflow selected:', workflow, parameters);
        setShowAtSymbol(false);
        if (workflow.parameters.length > 0 && !parameters) {
            // Show parameter dialog
            setSelectedWorkflowForExecution(workflow);
            setShowWorkflowParameterDialog(true);
        }
        else {
            // Execute workflow directly
            executeWorkflow(workflow, parameters || {});
        }
    };
    const executeWorkflow = async (workflow, parameters) => {
        if (!workflowExecutionServiceRef.current) {
            console.error('Workflow execution service not available');
            return;
        }
        try {
            const execution = await workflowExecutionServiceRef.current.executeWorkflow(workflow, parameters);
            console.log('Workflow executed successfully:', execution);
        }
        catch (error) {
            console.error('Workflow execution failed:', error);
        }
    };
    const handleWorkflowParameterSubmit = (parameters) => {
        if (selectedWorkflowForExecution) {
            executeWorkflow(selectedWorkflowForExecution, parameters);
            setShowWorkflowParameterDialog(false);
            setSelectedWorkflowForExecution(null);
        }
    };
    const handleWorkflowParameterCancel = () => {
        setShowWorkflowParameterDialog(false);
        setSelectedWorkflowForExecution(null);
    };
    const getExecutionContext = () => ({
        currentMode,
        projectContext: 'TanukiMCP Atlas IDE',
        availableTools: ['read_file', 'write_file', 'search_files', 'search_code']
    });
    // Setup keyboard shortcuts
    (0, use_keyboard_shortcuts_1.useKeyboardShortcuts)({
        'Ctrl+Shift+P': () => setShowAtSymbol(true),
        'Ctrl+N': handleNewChat,
        'Ctrl+O': handleOpenProject,
        'Ctrl+S': handleSaveChat,
        'F11': handleToggleFullscreen,
        'F12': () => setShowManagementCenter(true)
    });
    const handleAtSymbolTrigger = (event, position) => {
        if (event.key === '@') {
            setAtSymbolPosition(position);
            setShowAtSymbol(true);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ide-container h-screen flex flex-col bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsx)(menu_bar_1.MenuBar, { onNewChat: handleNewChat, onOpenProject: handleOpenProject, onSaveChat: handleSaveChat, onSubjectModeChange: switchMode, currentMode: currentMode, onOpenMCPManager: () => setShowManagementCenter(true), onOpenLLMPromptManagement: () => setShowLLMPromptManagement(true) }), (0, jsx_runtime_1.jsx)(toolbar_1.Toolbar, { currentMode: currentMode, onModeChange: switchMode, onAtSymbolTrigger: () => setShowAtSymbol(true) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex overflow-hidden", children: (0, jsx_runtime_1.jsx)(panel_manager_1.PanelManager, { layout: layout, onLayoutChange: updateLayout, panels: {
                        fileExplorer: (0, jsx_runtime_1.jsx)(file_tree_1.FileExplorer, {}),
                        chatInterface: ((0, jsx_runtime_1.jsx)(enhanced_chat_interface_1.EnhancedChatInterface, { onAtSymbolTrigger: handleAtSymbolTrigger })),
                        workflowManager: (0, jsx_runtime_1.jsx)("div", { children: "Workflow Manager Panel" }),
                        toolOutput: (0, jsx_runtime_1.jsx)("div", { children: "Tool Output Panel" })
                    } }) }), (0, jsx_runtime_1.jsx)(status_bar_1.StatusBar, { currentMode: currentMode, connectionStatus: "connected", activeTools: [], workflowExecutionService: workflowExecutionServiceRef.current }), showAtSymbol && workflowGenerationServiceRef.current && ((0, jsx_runtime_1.jsx)(enhanced_at_symbol_dropdown_1.EnhancedAtSymbolDropdown, { isOpen: showAtSymbol, onClose: () => setShowAtSymbol(false), onToolSelect: handleToolSelect, onWorkflowSelect: handleWorkflowSelect, context: getExecutionContext(), position: atSymbolPosition, toolRouter: toolRouterRef.current, workflowService: workflowGenerationServiceRef.current })), showWorkflowParameterDialog && selectedWorkflowForExecution && ((0, jsx_runtime_1.jsx)(workflow_parameter_dialog_1.WorkflowParameterDialog, { isOpen: showWorkflowParameterDialog, workflow: selectedWorkflowForExecution, onExecute: handleWorkflowParameterSubmit, onCancel: handleWorkflowParameterCancel })), showManagementCenter && ((0, jsx_runtime_1.jsx)(management_center_modal_1.ManagementCenterModal, { isOpen: showManagementCenter, onClose: () => setShowManagementCenter(false) })), showLLMPromptManagement && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "LLM System Prompt Management" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowLLMPromptManagement(false), className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-[calc(90vh-4rem)]", children: (0, jsx_runtime_1.jsx)(llm_prompt_management_1.LLMPromptManagement, {}) })] }) }))] }));
};
exports.EnhancedIDELayout = EnhancedIDELayout;
//# sourceMappingURL=enhanced-ide-layout.js.map