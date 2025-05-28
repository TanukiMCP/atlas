"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedChatInterface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Enhanced Chat Interface with Workflow Generation Integration
 * Includes "Save as Workflow" buttons and comprehensive chat management
 * Now integrated with real LLM service
 */
const react_1 = require("react");
const workflow_generation_dialog_1 = require("../workflows/workflow-generation-dialog");
const llm_store_1 = require("../../stores/llm-store");
const llm_status_1 = require("../llm/llm-status");
const EnhancedChatInterface = ({ onAtSymbolTrigger }) => {
    const [message, setMessage] = (0, react_1.useState)('');
    const [showWorkflowDialog, setShowWorkflowDialog] = (0, react_1.useState)(false);
    const [selectedMessageForWorkflow, setSelectedMessageForWorkflow] = (0, react_1.useState)(null);
    const messagesEndRef = (0, react_1.useRef)(null);
    // Use LLM store for real chat functionality
    const { currentSession, isConnected, isLoading, sendMessage: sendLLMMessage, createNewSession, cancelCurrentRequest } = (0, llm_store_1.useLLMStore)();
    // Initialize with a new session if none exists
    (0, react_1.useEffect)(() => {
        if (!currentSession) {
            createNewSession();
        }
    }, [currentSession, createNewSession]);
    const messages = currentSession?.messages || [];
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const handleKeyDown = (event) => {
        if (event.key === '@' && onAtSymbolTrigger) {
            const rect = event.currentTarget.getBoundingClientRect();
            onAtSymbolTrigger(event, { x: rect.left, y: rect.bottom });
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };
    const handleSendMessage = async () => {
        if (!message.trim() || !isConnected || isLoading)
            return;
        const messageToSend = message;
        setMessage('');
        try {
            await sendLLMMessage(messageToSend);
        }
        catch (error) {
            console.error('Failed to send message:', error);
            // Could add error handling UI here
        }
    };
    const handleSaveAsWorkflow = (fromMessage) => {
        setSelectedMessageForWorkflow(fromMessage || null);
        setShowWorkflowDialog(true);
    };
    const createChatTranscript = () => {
        let messagesToInclude = messages;
        // If a specific message was selected, include conversation up to that point
        if (selectedMessageForWorkflow) {
            const messageIndex = messages.findIndex(m => m.id === selectedMessageForWorkflow);
            if (messageIndex !== -1) {
                messagesToInclude = messages.slice(0, messageIndex + 1);
            }
        }
        return {
            messages: messagesToInclude,
            sessionId: `session_${Date.now()}`,
            context: {
                subjectMode: 'general',
                projectContext: 'TanukiMCP Atlas Chat',
                availableTools: [
                    'read_file', 'write_file', 'search_files', 'search_code',
                    'edit_block', 'create_todolist', 'execute_task', 'web_search'
                ],
                userPreferences: {}
            }
        };
    };
    const handleWorkflowSaved = (workflow) => {
        console.log('Workflow saved:', workflow);
        // In a real implementation, this would update UI to show the saved workflow
        setShowWorkflowDialog(false);
        setSelectedMessageForWorkflow(null);
    };
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const handleClearChat = () => {
        createNewSession();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "chat-interface h-full flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm", children: "\uD83D\uDCAC" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-medium", children: "TanukiMCP Assistant" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [messages.length, " messages"] })] }), (0, jsx_runtime_1.jsx)(llm_status_1.LLMStatus, {})] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleSaveAsWorkflow(), disabled: messages.length <= 1, className: "px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm", title: "Save entire conversation as workflow", children: "\uD83D\uDD27 Save as Workflow" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleClearChat, className: "px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm", children: "\uD83D\uDDD1\uFE0F Clear" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [messages.map((msg, index) => ((0, jsx_runtime_1.jsx)("div", { className: "group", children: (0, jsx_runtime_1.jsx)("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-gray-50 dark:bg-gray-800 ml-8'
                                    : 'bg-blue-50 dark:bg-blue-900/20 mr-8'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: `font-medium text-sm ${msg.role === 'user'
                                                                ? 'text-gray-900 dark:text-gray-100'
                                                                : 'text-blue-900 dark:text-blue-100'}`, children: msg.role === 'user' ? 'You' : 'Assistant' }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatTimestamp(msg.timestamp) })] }), (0, jsx_runtime_1.jsx)("div", { className: `text-sm ${msg.role === 'user'
                                                        ? 'text-gray-800 dark:text-gray-200'
                                                        : 'text-blue-800 dark:text-blue-200'}`, children: msg.content })] }), msg.role === 'user' && ((0, jsx_runtime_1.jsx)("div", { className: "opacity-0 group-hover:opacity-100 transition-opacity ml-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => handleSaveAsWorkflow(msg.id), className: "p-1 bg-green-600 text-white rounded text-xs hover:bg-green-700", title: "Save conversation up to this message as workflow", children: "\uD83D\uDD27" }) }))] }) }) }, msg.id))), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", children: (0, jsx_runtime_1.jsx)("textarea", { value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type your message... (use @ for tools, Enter to send, Shift+Enter for new line)", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none", rows: message.includes('\n') ? 3 : 1 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSendMessage, disabled: !message.trim() || !isConnected || isLoading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end", children: isLoading ? 'Sending...' : 'Send' }), isLoading && ((0, jsx_runtime_1.jsx)("button", { onClick: cancelCurrentRequest, className: "px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 self-end", title: "Cancel current request", children: "\u23F9\uFE0F" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: "\uD83D\uDCA1 Tip: Use @ to access tools, or save conversations as reusable workflows" })] }), showWorkflowDialog && ((0, jsx_runtime_1.jsx)(workflow_generation_dialog_1.WorkflowGenerationDialog, { isOpen: showWorkflowDialog, onClose: () => {
                    setShowWorkflowDialog(false);
                    setSelectedMessageForWorkflow(null);
                }, chatTranscript: createChatTranscript(), onWorkflowSaved: handleWorkflowSaved }))] }));
};
exports.EnhancedChatInterface = EnhancedChatInterface;
//# sourceMappingURL=enhanced-chat-interface.js.map