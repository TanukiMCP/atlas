"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ChatService_1 = __importDefault(require("../services/ChatService"));
const ChatView = ({ onBack }) => {
    const [message, setMessage] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // Load current messages
        setMessages(ChatService_1.default.getCurrentMessages());
        // Subscribe to message updates
        const unsubscribe = ChatService_1.default.onMessagesChanged((newMessages) => {
            setMessages(newMessages);
        });
        return unsubscribe;
    }, []);
    (0, react_1.useEffect)(() => {
        // Scroll to bottom when new messages arrive
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSendMessage = async () => {
        if (!message.trim() || isLoading)
            return;
        const messageContent = message.trim();
        setMessage('');
        setIsLoading(true);
        try {
            await ChatService_1.default.sendMessage(messageContent, {
                workspaceRoot: process.cwd(),
                files: [] // Could be populated with current workspace files
            });
        }
        catch (error) {
            console.error('Failed to send message:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(timestamp);
    };
    const renderMessage = (msg) => {
        const isUser = msg.role === 'user';
        return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm ${isUser
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground'}`, children: isUser ? '👤' : '🤖' }), (0, jsx_runtime_1.jsxs)("div", { className: `flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: `p-3 rounded-lg ${isUser
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-card border border-border'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "whitespace-pre-wrap break-words", children: msg.content }), msg.metadata && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs opacity-70 mt-2 flex items-center gap-2", children: [msg.metadata.model && ((0, jsx_runtime_1.jsxs)("span", { children: ["Model: ", msg.metadata.model] })), msg.metadata.executionTime && ((0, jsx_runtime_1.jsxs)("span", { children: ["\u2022 ", msg.metadata.executionTime, "ms"] })), msg.metadata.tokens && ((0, jsx_runtime_1.jsxs)("span", { children: ["\u2022 ", msg.metadata.tokens, " tokens"] }))] }))] }), (0, jsx_runtime_1.jsx)("div", { className: `text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : ''}`, children: formatTimestamp(msg.timestamp) })] })] }, msg.id));
    };
    const clearConversation = () => {
        if (confirm('Are you sure you want to clear this conversation?')) {
            ChatService_1.default.clearCurrentConversation();
        }
    };
    const createNewConversation = () => {
        ChatService_1.default.createNewConversation();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-4 h-full flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onBack, className: "px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors", children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold", children: "AI Assistant" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: createNewConversation, className: "px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors", children: "New Chat" }), (0, jsx_runtime_1.jsx)("button", { onClick: clearConversation, className: "px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors", children: "Clear" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-card rounded-lg border border-border flex-1 flex flex-col min-h-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-4 space-y-4 overflow-y-auto", children: [messages.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-muted-foreground py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-medium mb-2", children: "Welcome to TanukiMCP Atlas" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: "Start a conversation with your AI development assistant" })] })) : (messages.map(renderMessage)), isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm text-primary-foreground", children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-card border border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-pulse", style: { animationDelay: '0.2s' } }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-pulse", style: { animationDelay: '0.4s' } }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground ml-2", children: "AI is thinking..." })] }) }) })] })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-border p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: "Ask me anything about your code, project, or development tasks...", className: "flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none", disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSendMessage, disabled: !message.trim() || isLoading, className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }), "Sending"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "Send" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: "Enter" })] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-muted-foreground mt-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Press Enter to send, Shift+Enter for new line" }), (0, jsx_runtime_1.jsxs)("span", { children: [messages.length, " messages in conversation"] })] })] })] })] }));
};
exports.default = ChatView;
//# sourceMappingURL=ChatView.js.map