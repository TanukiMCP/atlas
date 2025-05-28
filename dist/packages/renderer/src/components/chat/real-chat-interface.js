"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealChatInterface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Real Chat Interface with Ollama LLM Integration
 * Replaces mock responses with actual streaming LLM communication
 */
const react_1 = require("react");
const llm_store_1 = require("../../stores/llm-store");
const workflow_generation_dialog_1 = require("../workflows/workflow-generation-dialog");
const lucide_react_1 = require("lucide-react");
const RealChatInterface = ({ onAtSymbolTrigger }) => {
    const [message, setMessage] = (0, react_1.useState)('');
    const [showWorkflowDialog, setShowWorkflowDialog] = (0, react_1.useState)(false);
    const [selectedMessageForWorkflow, setSelectedMessageForWorkflow] = (0, react_1.useState)(null);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    const { isConnected, healthStatus, availableModels, currentModel, currentSession, isStreaming, streamingMessage, checkHealth, refreshModels, setCurrentModel, createNewSession, sendMessage, cancelCurrentRequest, clearCurrentSession } = (0, llm_store_1.useLLMStore)();
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [currentSession?.messages, streamingMessage]);
    (0, react_1.useEffect)(() => {
        // Check health on component mount
        checkHealth();
    }, [checkHealth]);
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
        if (!message.trim() || isStreaming)
            return;
        if (!isConnected) {
            alert('Not connected to Ollama. Please check if Ollama is running and try again.');
            return;
        }
        if (!currentSession) {
            createNewSession();
        }
        const userMessage = message;
        setMessage('');
        try {
            await sendMessage(userMessage);
        }
        catch (error) {
            console.error('Failed to send message:', error);
            alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    const handleSaveAsWorkflow = (fromMessage) => {
        setSelectedMessageForWorkflow(fromMessage || null);
        setShowWorkflowDialog(true);
    };
    const createChatTranscript = () => {
        if (!currentSession) {
            return {
                messages: [],
                sessionId: 'empty',
                context: {
                    subjectMode: 'general',
                    projectContext: 'TanukiMCP Atlas Chat',
                    availableTools: [],
                    userPreferences: {}
                }
            };
        }
        return {
            messages: currentSession.messages.map((msg, index) => ({
                id: `msg-${index}-${Date.now()}`,
                role: msg.role,
                content: msg.content,
                timestamp: new Date().toISOString(),
                metadata: {}
            })),
            sessionId: currentSession.id,
            context: {
                subjectMode: 'general',
                projectContext: currentSession.name || 'TanukiMCP Atlas Chat',
                availableTools: [],
                userPreferences: {}
            }
        };
    };
    if (!isConnected) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4 max-w-md mx-auto p-6", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-12 h-12 text-orange-500 mx-auto" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Connection Required" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Please ensure Ollama is running and try again." }), (0, jsx_runtime_1.jsx)("button", { onClick: checkHealth, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors", children: "Retry Connection" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [currentSession?.messages.map((msg, index) => ((0, jsx_runtime_1.jsx)("div", { className: `flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: `max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [msg.role === 'user' ? (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: new Date().toLocaleTimeString() })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm whitespace-pre-wrap", children: msg.content })] }) }, index))), isStreaming && streamingMessage && ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-3 justify-start", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-[80%] rounded-lg p-3 bg-muted", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: "Thinking..." })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm whitespace-pre-wrap", children: streamingMessage })] }) })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-border p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("textarea", { value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type your message... (use @tool_name for tool calls)", className: "flex-1 resize-none border border-border rounded-md px-3 py-2 text-sm min-h-[2.5rem] max-h-32", rows: 1 }), isStreaming ? ((0, jsx_runtime_1.jsx)("button", { onClick: cancelCurrentRequest, className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.StopCircle, { className: "w-4 h-4" }) })) : ((0, jsx_runtime_1.jsx)("button", { onClick: handleSendMessage, disabled: !message.trim() || !isConnected, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50", children: "Send" }))] }) }), showWorkflowDialog && ((0, jsx_runtime_1.jsx)(workflow_generation_dialog_1.WorkflowGenerationDialog, { isOpen: showWorkflowDialog, onClose: () => setShowWorkflowDialog(false), chatTranscript: createChatTranscript(), onWorkflowSaved: (workflow) => {
                    console.log('Workflow created:', workflow);
                    setShowWorkflowDialog(false);
                } }))] }));
};
exports.RealChatInterface = RealChatInterface;
//# sourceMappingURL=real-chat-interface.js.map