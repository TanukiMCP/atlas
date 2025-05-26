"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowGenerationDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Workflow Generation Dialog Component
 * Implements the exact wireframe layout: 4/5 ASCII visualization + 1/5 refinement chat
 */
const react_1 = require("react");
const workflow_generation_service_1 = require("../../services/workflow-generation/workflow-generation-service");
const WorkflowGenerationDialog = ({ isOpen, onClose, chatTranscript, onWorkflowSaved }) => {
    const [state, setState] = (0, react_1.useState)({
        isOpen: false,
        currentStep: 'analyzing',
        loading: false,
        workflowVisualization: '',
        partialWorkflow: {},
        refinementHistory: [],
        userInput: ''
    });
    const [refinementInput, setRefinementInput] = (0, react_1.useState)('');
    const [isDirectEditMode, setIsDirectEditMode] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const workflowServiceRef = (0, react_1.useRef)(null);
    const visualizationTextareaRef = (0, react_1.useRef)(null);
    // Initialize workflow generation service
    (0, react_1.useEffect)(() => {
        const config = {
            enableAutoSave: false,
            defaultComplexity: 'moderate',
            maxRefinementIterations: 10,
            timeoutMs: 30000
        };
        const events = {
            onStateChange: (newState) => setState(newState),
            onProgress: (step, progressValue) => setProgress(progressValue),
            onError: (error) => console.error('Workflow generation error:', error),
            onComplete: (workflow) => onWorkflowSaved(workflow)
        };
        workflowServiceRef.current = new workflow_generation_service_1.WorkflowGenerationService(config, events);
    }, [onWorkflowSaved]);
    // Start workflow generation when dialog opens
    (0, react_1.useEffect)(() => {
        if (isOpen && workflowServiceRef.current && chatTranscript) {
            workflowServiceRef.current.generateWorkflowFromChat(chatTranscript);
        }
    }, [isOpen, chatTranscript]);
    const handleRefinementSubmit = async () => {
        if (!refinementInput.trim() || !workflowServiceRef.current)
            return;
        try {
            await workflowServiceRef.current.refineWorkflow(refinementInput);
            setRefinementInput('');
        }
        catch (error) {
            console.error('Refinement failed:', error);
        }
    };
    const handleRegenerate = async () => {
        if (!workflowServiceRef.current)
            return;
        try {
            await workflowServiceRef.current.regenerateWorkflow(chatTranscript);
        }
        catch (error) {
            console.error('Regeneration failed:', error);
        }
    };
    const handleSaveWorkflow = async () => {
        if (!workflowServiceRef.current)
            return;
        try {
            const finalizedWorkflow = await workflowServiceRef.current.finalizeWorkflow();
            onClose();
        }
        catch (error) {
            console.error('Finalization failed:', error);
        }
    };
    const handleVisualizationChange = (newVisualization) => {
        if (workflowServiceRef.current) {
            workflowServiceRef.current.updateVisualization(newVisualization);
        }
    };
    const handleClose = () => {
        if (workflowServiceRef.current) {
            workflowServiceRef.current.closeWorkflowGeneration();
        }
        onClose();
    };
    const getStepDescription = (step) => {
        switch (step) {
            case 'analyzing': return 'Analyzing chat conversation...';
            case 'synthesizing': return 'Generating workflow structure...';
            case 'visualizing': return 'Creating ASCII visualization...';
            case 'preview': return 'Workflow ready for preview and refinement';
            case 'refining': return 'Applying refinements...';
            case 'finalizing': return 'Finalizing workflow...';
            case 'complete': return 'Workflow saved successfully!';
            default: return '';
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg w-[90vw] h-[85vh] flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold", children: "\uD83D\uDCBE" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold", children: "Intelligent Workflow Generator" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: getStepDescription(state.currentStep) })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "\u2715" })] }), state.loading && ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-md font-medium", children: "ASCII Workflow Visualization" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsDirectEditMode(!isDirectEditMode), className: `px-3 py-1 text-sm rounded-lg transition-colors ${isDirectEditMode
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`, children: "\uD83D\uDCDD Direct Edit Mode" }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4", children: state.currentStep === 'analyzing' || state.currentStep === 'synthesizing' ? ((0, jsx_runtime_1.jsx)("div", { className: "h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: state.currentStep === 'analyzing' ? 'Analyzing conversation...' : 'Generating workflow...' })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-full", children: isDirectEditMode ? ((0, jsx_runtime_1.jsx)("textarea", { ref: visualizationTextareaRef, value: state.workflowVisualization, onChange: (e) => handleVisualizationChange(e.target.value), className: "w-full h-full font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "ASCII workflow visualization will appear here..." })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-full overflow-auto", children: (0, jsx_runtime_1.jsx)("pre", { className: "font-mono text-sm whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700", children: state.workflowVisualization || 'No visualization available yet...' }) })) })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-80 flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-md font-medium", children: "\uD83D\uDCAC Refinement Chat" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Chat with LLM Agent 2 for refinements" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: state.refinementHistory.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)("p", { children: "No refinements yet." }), (0, jsx_runtime_1.jsx)("p", { children: "Type your refinement requests below." })] })) : (state.refinementHistory.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-blue-900 dark:text-blue-100", children: "You" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-800 dark:text-blue-200", children: item.userRequest })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: "Agent 2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-700 dark:text-gray-300", children: item.agentResponse }), item.changesSummary && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-600 dark:text-gray-400 mt-2 italic", children: ["Changes: ", item.changesSummary] }))] })] }, item.id)))) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2", children: [(0, jsx_runtime_1.jsx)("textarea", { value: refinementInput, onChange: (e) => setRefinementInput(e.target.value), placeholder: "Type refinement requests here...", className: "w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500", disabled: state.loading }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefinementSubmit, disabled: !refinementInput.trim() || state.loading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Send" })] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex space-x-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleRegenerate, disabled: state.loading, className: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50", children: "\uD83D\uDD04 Regenerate" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleClose, className: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSaveWorkflow, disabled: state.loading || !state.workflowVisualization, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "\uD83D\uDCBE Save Workflow" })] })] }) })] }) }));
};
exports.WorkflowGenerationDialog = WorkflowGenerationDialog;
//# sourceMappingURL=workflow-generation-dialog.js.map