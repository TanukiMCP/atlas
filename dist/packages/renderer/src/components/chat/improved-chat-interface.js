"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImprovedChatInterface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const scroll_area_1 = require("../ui/scroll-area");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../../lib/utils");
const use_chat_history_1 = require("../../hooks/use-chat-history");
exports.ImprovedChatInterface = (0, react_1.forwardRef)(({ onAtSymbolTrigger, operationalMode = 'agent' }, ref) => {
    const [message, setMessage] = (0, react_1.useState)('');
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [showSidebar, setShowSidebar] = (0, react_1.useState)(true);
    const [selectedSessionIds, setSelectedSessionIds] = (0, react_1.useState)([]);
    const messagesEndRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    const { sessions, currentSession, createSession, updateSession, deleteSession, archiveSession, exportSession, setCurrentSession } = (0, use_chat_history_1.useChatHistory)();
    const [messages, setMessages] = (0, react_1.useState)([
        {
            id: '1',
            type: 'assistant',
            content: 'Welcome to TanukiMCP Assistant! I\'m here to help you with development tasks, file operations, and intelligent automation. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    // Focus input when component mounts
    (0, react_1.useEffect)(() => {
        inputRef.current?.focus();
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        insertText: (text) => setMessage(prev => prev + text),
        addMessage: (newMessage) => {
            const fullMessage = {
                ...newMessage,
                id: Date.now().toString(),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, fullMessage]);
        }
    }));
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
        if (message.trim() && !isTyping) {
            const userMessage = {
                id: Date.now().toString(),
                type: 'user',
                content: message.trim(),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setMessage('');
            setIsTyping(true);
            // Simulate assistant response with streaming
            setTimeout(() => {
                const assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: operationalMode === 'agent'
                        ? `I'm in Agent Mode and can help you with file operations, code execution, and complex workflows. You asked: "${userMessage.content}"`
                        : `I'm in Chat Mode and can help with analysis, research, and conversational assistance. You asked: "${userMessage.content}"`,
                    timestamp: new Date(),
                    isStreaming: true
                };
                setMessages(prev => [...prev, assistantMessage]);
                // Simulate streaming completion
                setTimeout(() => {
                    setMessages(prev => prev.map(msg => msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false }
                        : msg));
                    setIsTyping(false);
                }, 2000);
            }, 500);
        }
    };
    const handleNewChat = () => {
        createSession({
            title: `New Chat ${new Date().toLocaleTimeString()}`,
            description: 'Fresh conversation session'
        });
        setMessages([{
                id: '1',
                type: 'assistant',
                content: 'Hello! I\'m ready to help you with your next task. What would you like to work on?',
                timestamp: new Date()
            }]);
    };
    const handleSelectSession = (session) => {
        setCurrentSession(session);
        // In a real implementation, load session messages
        setMessages([{
                id: '1',
                type: 'assistant',
                content: `Loaded session: ${session.title}. How can I continue helping you?`,
                timestamp: new Date()
            }]);
    };
    const toggleSessionSelection = (sessionId) => {
        setSelectedSessionIds(prev => prev.includes(sessionId)
            ? prev.filter(id => id !== sessionId)
            : [...prev, sessionId]);
    };
    const handleBulkDelete = () => {
        selectedSessionIds.forEach(id => deleteSession(id));
        setSelectedSessionIds([]);
    };
    const handleBulkArchive = () => {
        selectedSessionIds.forEach(id => archiveSession(id));
        setSelectedSessionIds([]);
    };
    const filteredSessions = sessions.filter(session => session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-full bg-background", children: [showSidebar && ((0, jsx_runtime_1.jsxs)("div", { className: "w-80 border-r border-border bg-card/50 flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold", children: "Chat Sessions" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: handleNewChat, className: "h-8 w-8 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-9 h-9" })] })] }), selectedSessionIds.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-muted/50 border-b border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-muted-foreground", children: [selectedSessionIds.length, " selected"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: handleBulkArchive, className: "h-7 px-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Archive, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: handleBulkDelete, className: "h-7 px-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3 w-3" }) })] })] }) })), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "flex-1", children: (0, jsx_runtime_1.jsx)("div", { className: "p-2 space-y-1", children: filteredSessions.map((session) => ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("p-3 rounded-lg cursor-pointer transition-colors border", currentSession?.id === session.id
                                    ? "bg-primary/10 border-primary/20"
                                    : "bg-background hover:bg-muted/50 border-transparent", selectedSessionIds.includes(session.id) && "ring-2 ring-primary/20"), onClick: () => handleSelectSession(session), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedSessionIds.includes(session.id), onChange: () => toggleSessionSelection(session.id), onClick: (e) => e.stopPropagation(), className: "mt-1 rounded" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-sm truncate", children: session.title })] }), session.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: session.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-xs text-muted-foreground mt-2 gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: session.metadata.createdAt.toLocaleDateString() }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: [session.messages.length, " messages"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit3, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", className: "h-6 w-6 p-0", onClick: (e) => {
                                                        e.stopPropagation();
                                                        exportSession(session.id);
                                                    }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }) })] })] }) }, session.id))) }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-border bg-card/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [!showSidebar && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => setShowSidebar(true), className: "h-8 w-8 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-4 w-4" }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "font-semibold", children: currentSession?.title || 'TanukiMCP Assistant' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("px-2 py-1 rounded text-xs font-medium", operationalMode === 'agent'
                                                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"), children: operationalMode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode' }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: [messages.length, " messages"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [showSidebar && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => setShowSidebar(false), children: "Hide Sidebar" })), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", onClick: handleNewChat, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "New Chat"] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", children: (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-4 pb-20", children: [messages.map((msg) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex gap-3 max-w-none", msg.type === 'user' ? "justify-end" : "justify-start"), children: [msg.type === 'assistant' && ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0", children: "\uD83E\uDD9D" })), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("rounded-lg px-4 py-3 max-w-[85%] break-words", msg.type === 'user'
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted border"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: msg.type === 'user' ? 'You' : 'Assistant' }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: msg.timestamp.toLocaleTimeString() }), msg.isStreaming && ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-3 w-3 animate-spin" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: msg.content })] }), msg.type === 'user' && ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium flex-shrink-0", children: "\uD83D\uDC64" }))] }, msg.id))), isTyping && ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 justify-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium", children: "\uD83E\uDD9D" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-muted border rounded-lg px-4 py-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: "Assistant is typing..." })] }) })] })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-border bg-card/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 items-end", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(input_1.Input, { ref: inputRef, type: "text", value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: operationalMode === 'agent'
                                            ? "Type your message... (use @ for tools, I can execute actions)"
                                            : "Type your message... (conversational mode, thinking tools only)", disabled: isTyping, className: "min-h-[44px] resize-none" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleSendMessage, disabled: !message.trim() || isTyping, className: "h-11 px-4", children: isTyping ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "h-4 w-4" })) })] }) })] })] }));
});
exports.ImprovedChatInterface.displayName = 'ImprovedChatInterface';
//# sourceMappingURL=improved-chat-interface.js.map