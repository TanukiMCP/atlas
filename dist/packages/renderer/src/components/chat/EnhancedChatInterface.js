"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedChatInterface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const enhanced_chat_service_1 = require("@/services/enhanced-chat-service");
const ollama_service_1 = require("@/services/ollama-service");
const viewStore_1 = require("@/stores/viewStore");
const MessageBubble = ({ message, isStreaming = false }) => {
    const isUser = message.role === 'user';
    return ((0, jsx_runtime_1.jsx)("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`, children: (0, jsx_runtime_1.jsxs)("div", { className: `max-w-[80%] rounded-lg px-4 py-2 ${isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [isUser ? (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: isUser ? 'You' : 'TanukiMCP' }), message.metadata?.processingTier && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: ["Tier ", message.metadata.processingTier] })), isStreaming && ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-3 h-3 animate-spin" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm whitespace-pre-wrap", children: message.content }), message.metadata?.toolCalls && message.metadata.toolCalls.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 pt-2 border-t border-border", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground mb-1", children: "Tool Calls:" }), message.metadata.toolCalls.map((tool, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wrench, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: tool.name }), tool.duration && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: [tool.duration, "ms"] }))] }, index)))] })), message.metadata?.processingTime && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-1 text-xs text-muted-foreground flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3" }), message.metadata.processingTime, "ms", message.metadata.tokenUsage && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-2", children: [message.metadata.tokenUsage.total, " tokens"] }))] }))] }) }));
};
const TypingIndicator = ({ tier }) => ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-muted text-muted-foreground rounded-lg px-4 py-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "TanukiMCP" }), tier && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: [tier, " tier"] })), (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-3 h-3 animate-spin" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm mt-1", children: "Thinking..." })] }) }));
const EnhancedChatInterface = () => {
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const [currentTypingTier, setCurrentTypingTier] = (0, react_1.useState)('');
    const [streamingMessage, setStreamingMessage] = (0, react_1.useState)(null);
    const [connectionStatus, setConnectionStatus] = (0, react_1.useState)('checking');
    const [currentModel, setCurrentModel] = (0, react_1.useState)('');
    const scrollAreaRef = (0, react_1.useRef)(null);
    const { subjectMode, agentMode, isProcessing, setProcessing } = (0, viewStore_1.useViewStore)();
    // Initialize and check Ollama connection
    (0, react_1.useEffect)(() => {
        const checkConnection = async () => {
            const health = await ollama_service_1.ollamaService.checkHealth();
            setConnectionStatus(health.isConnected ? 'connected' : 'disconnected');
            setCurrentModel(ollama_service_1.ollamaService.getCurrentModel());
        };
        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);
    // Subscribe to chat events
    (0, react_1.useEffect)(() => {
        const unsubscribe = enhanced_chat_service_1.chatService.addEventListener((event) => {
            switch (event.type) {
                case 'message':
                    if (event.data.metadata?.streaming) {
                        setStreamingMessage(event.data);
                    }
                    else {
                        setMessages(prev => {
                            const filtered = prev.filter(m => m.id !== event.data.id);
                            return [...filtered, event.data];
                        });
                        setStreamingMessage(null);
                    }
                    break;
                case 'typing':
                    setIsTyping(event.data.isTyping);
                    setCurrentTypingTier(event.data.tier);
                    break;
                case 'tool_call':
                    // Could show tool execution status
                    console.log('Tool call:', event.data);
                    break;
                case 'error':
                    console.error('Chat error:', event.data);
                    setIsTyping(false);
                    setStreamingMessage(null);
                    break;
                case 'complete':
                    setIsTyping(false);
                    setStreamingMessage(null);
                    setProcessing(false);
                    break;
            }
        });
        return unsubscribe;
    }, [setProcessing]);
    // Auto-scroll to bottom
    (0, react_1.useEffect)(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, streamingMessage, isTyping]);
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isProcessing)
            return;
        const messageText = inputValue.trim();
        setInputValue('');
        setProcessing(true);
        try {
            await enhanced_chat_service_1.chatService.processChat({
                message: messageText,
                subjectMode,
                agentMode
            });
        }
        catch (error) {
            console.error('Failed to send message:', error);
            setProcessing(false);
        }
    };
    const handleStopProcessing = () => {
        enhanced_chat_service_1.chatService.stopProcessing();
        setProcessing(false);
        setIsTyping(false);
        setStreamingMessage(null);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-full bg-background", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: "TanukiMCP Chat" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: agentMode ? "default" : "secondary", children: agentMode ? 'Agent Mode' : 'Chat Mode' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                                            connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: connectionStatus === 'connected' ? currentModel : 'Disconnected' })] }), isProcessing && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "destructive", size: "sm", onClick: handleStopProcessing, className: "gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Square, { className: "w-3 h-3" }), "Stop"] }))] })] }), (0, jsx_runtime_1.jsxs)(scroll_area_1.ScrollArea, { className: "flex-1 p-4", ref: scrollAreaRef, children: [connectionStatus === 'disconnected' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 text-yellow-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-yellow-800 dark:text-yellow-200", children: "Ollama Not Connected" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-yellow-700 dark:text-yellow-300", children: "Please ensure Ollama is running and models are available." })] })] })), messages.length === 0 && connectionStatus === 'connected' && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-12 h-12 mx-auto mb-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-2", children: "Welcome to TanukiMCP Atlas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Start a conversation with your AI-powered development assistant." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2 mt-4", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: ["Subject: ", subjectMode] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: ["Mode: ", agentMode ? 'Agent' : 'Chat'] })] })] })), messages.map(message => ((0, jsx_runtime_1.jsx)(MessageBubble, { message: message }, message.id))), streamingMessage && ((0, jsx_runtime_1.jsx)(MessageBubble, { message: streamingMessage, isStreaming: true })), isTyping && !streamingMessage && ((0, jsx_runtime_1.jsx)(TypingIndicator, { tier: currentTypingTier }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-t border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyPress: handleKeyPress, placeholder: connectionStatus === 'connected'
                                    ? "Type your message... (use @tool_name for tool calls)"
                                    : "Waiting for Ollama connection...", disabled: connectionStatus !== 'connected' || isProcessing, className: "flex-1" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleSendMessage, disabled: !inputValue.trim() || connectionStatus !== 'connected' || isProcessing, className: "gap-1", children: [isProcessing ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4" })), "Send"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: "Press Enter to send, Shift+Enter for new line" }), (0, jsx_runtime_1.jsx)("span", { children: "Try: @file_read, @web_search, @calculator" })] })] })] }));
};
exports.EnhancedChatInterface = EnhancedChatInterface;
//# sourceMappingURL=EnhancedChatInterface.js.map