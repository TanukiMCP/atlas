"use strict";
/**
 * Enhanced IDE Layout with Complete Workflow Generation Integration
 * Integrates all workflow components following wireframe specifications
 */
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
exports.EnhancedIDELayout = void 0;
const react_1 = __importStar(require("react"));
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
    const workflowGenerationServiceRef = (0, react_1.useRef)(null);
    const workflowExecutionServiceRef = (0, react_1.useRef)(null);
    const toolRouterRef = (0, react_1.useRef)(null); // Mock tool router for now
    // Initialize services
    (0, react_1.useEffect)(() => {
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
    return (<div className="ide-container h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Menu Bar */}
      <menu_bar_1.MenuBar onNewChat={handleNewChat} onOpenProject={handleOpenProject} onSaveChat={handleSaveChat} onSubjectModeChange={switchMode} currentMode={currentMode} onOpenMCPManager={() => setShowManagementCenter(true)} onOpenLLMPromptManagement={() => setShowLLMPromptManagement(true)}/>
      
      {/* Toolbar */}
      <toolbar_1.Toolbar currentMode={currentMode} onModeChange={switchMode} onAtSymbolTrigger={() => setShowAtSymbol(true)}/>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <panel_manager_1.PanelManager layout={layout} onLayoutChange={updateLayout} panels={{
            fileExplorer: <file_tree_1.FileExplorer />,
            chatInterface: (<enhanced_chat_interface_1.EnhancedChatInterface onAtSymbolTrigger={handleAtSymbolTrigger}/>),
            workflowManager: <div>Workflow Manager Panel</div>,
            toolOutput: <div>Tool Output Panel</div>
        }}/>
      </div>
      
      {/* Status Bar */}
      <status_bar_1.StatusBar currentMode={currentMode} connectionStatus="connected" activeTools={[]} workflowExecutionService={workflowExecutionServiceRef.current}/>
      
      {/* Enhanced @ Symbol Dropdown with Workflow Support */}
      {showAtSymbol && workflowGenerationServiceRef.current && (<enhanced_at_symbol_dropdown_1.EnhancedAtSymbolDropdown isOpen={showAtSymbol} onClose={() => setShowAtSymbol(false)} onToolSelect={handleToolSelect} onWorkflowSelect={handleWorkflowSelect} context={getExecutionContext()} position={atSymbolPosition} toolRouter={toolRouterRef.current} workflowService={workflowGenerationServiceRef.current}/>)}

      {/* Workflow Parameter Dialog */}
      {showWorkflowParameterDialog && selectedWorkflowForExecution && (<workflow_parameter_dialog_1.WorkflowParameterDialog isOpen={showWorkflowParameterDialog} workflow={selectedWorkflowForExecution} onExecute={handleWorkflowParameterSubmit} onCancel={handleWorkflowParameterCancel}/>)}

      {/* Management Center */}
      {showManagementCenter && (<management_center_modal_1.ManagementCenterModal isOpen={showManagementCenter} onClose={() => setShowManagementCenter(false)}/>)}

      {/* LLM Prompt Management */}
      {showLLMPromptManagement && (<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                LLM System Prompt Management
              </h2>
              <button onClick={() => setShowLLMPromptManagement(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="h-[calc(90vh-4rem)]">
              <llm_prompt_management_1.LLMPromptManagement />
            </div>
          </div>
        </div>)}
    </div>);
};
exports.EnhancedIDELayout = EnhancedIDELayout;
//# sourceMappingURL=enhanced-ide-layout.js.map