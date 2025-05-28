"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("../ui/button");
const badge_1 = require("../ui/badge");
const card_1 = require("../ui/card");
const lucide_react_1 = require("lucide-react");
const ChatView = ({ currentModel, isConnected, subjectMode, agentMode, onProcessingChange }) => {
    const [messages, setMessages] = (0, react_1.useState)([
        {
            id: '1',
            type: 'assistant',
            content: 'Welcome to TanukiMCP Atlas! 🚀 I\'m your AI-powered development assistant with enhanced LLM processing architecture. I can help you with:\n\n• 💻 Code analysis and development\n• 🛠️ Tool integration via MCP\n• ⚡ Workflow automation\n• 🧠 Multi-tier intelligent processing\n• 📊 Project management and analytics\n\nTry asking me something or use @tool_name for tool calls!',
            timestamp: new Date(),
            tier: 'Tier 2'
        }
    ]);
    const [inputMessage, setInputMessage] = (0, react_1.useState)('');
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    (0, react_1.useEffect)(() => {
        onProcessingChange(isTyping);
    }, [isTyping, onProcessingChange]);
    const getSystemPrompt = (mode) => {
        const prompts = {
            general: "You are TanukiMCP Atlas, a helpful AI development assistant with access to advanced tools and multi-tier processing.",
            math: "You are TanukiMCP Atlas, a mathematical expert with deep knowledge of all areas of mathematics and computational analysis.",
            code: "You are TanukiMCP Atlas, a senior software engineer and programming expert with access to code analysis tools.",
            science: "You are TanukiMCP Atlas, a research scientist with expertise across scientific disciplines and analytical tools.",
            language: "You are TanukiMCP Atlas, a linguistic expert and polyglot translator with advanced language processing capabilities."
        };
        return prompts[mode] || prompts.general;
    };
    const determineTier = (message) => {
        const length = message.length;
        const hasTools = /@\w+/.test(message);
        const hasComplexTerms = /\b(analyze|compare|create|generate|build|develop|implement)\b/i.test(message);
        if (hasTools || (length > 200 && hasComplexTerms))
            return 'Tier 4';
        if (hasComplexTerms || length > 150)
            return 'Tier 3';
        if (length > 50)
            return 'Tier 2';
        return 'Tier 1';
    };
    const sendMessage = async () => {
        if (!inputMessage.trim() || isTyping)
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        const messageText = inputMessage.trim();
        setInputMessage('');
        setIsTyping(true);
        try {
            if (isConnected && currentModel) {
                // Real Ollama integration
                const systemPrompt = getSystemPrompt(subjectMode);
                const conversationMessages = [
                    { role: 'system', content: systemPrompt },
                    ...messages.slice(-5).map(msg => ({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: messageText }
                ];
                const response = await fetch('http://localhost:11434/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: currentModel,
                        messages: conversationMessages,
                        stream: false,
                        options: {
                            temperature: 0.7,
                            top_p: 0.9
                        }
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const assistantMessage = {
                        id: (Date.now() + 1).toString(),
                        type: 'assistant',
                        content: data.message.content,
                        timestamp: new Date(),
                        tier: determineTier(messageText),
                        tokenUsage: {
                            prompt: data.prompt_eval_count || 0,
                            completion: data.eval_count || 0,
                            total: (data.prompt_eval_count || 0) + (data.eval_count || 0)
                        },
                        processingTime: data.total_duration ? Math.round(data.total_duration / 1000000) : 0
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                }
                else {
                    throw new Error('Failed to get response from Ollama');
                }
            }
            else {
                // Fallback mock response when Ollama is not available
                await new Promise(resolve => setTimeout(resolve, 1000));
                const assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: `I received your message: "${messageText}"\n\n⚠️ Note: Ollama is not currently connected, so this is a mock response. To enable real AI responses:\n\n1. Install Ollama from https://ollama.ai\n2. Run: ollama pull llama3.2:3b\n3. Start Ollama service\n\nOnce connected, I'll provide real AI-powered responses with multi-tier processing!`,
                    timestamp: new Date(),
                    tier: 'Mock',
                    isOffline: true
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: (Date.now() + 2).toString(),
                type: 'assistant',
                content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your Ollama connection and try again.`,
                timestamp: new Date(),
                tier: 'Error',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setIsTyping(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const getTierColor = (tier) => {
        switch (tier) {
            case 'Tier 1': return 'bg-green-500';
            case 'Tier 2': return 'bg-blue-500';
            case 'Tier 3': return 'bg-orange-500';
            case 'Tier 4': return 'bg-red-500';
            case 'Error': return 'bg-red-600';
            case 'Mock': return 'bg-yellow-600';
            default: return 'bg-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col h-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-6 h-6 text-primary" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold", children: "TanukiMCP Enhanced Chat" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: isConnected ? 'default' : 'destructive', children: isConnected ? 'Connected' : 'Offline' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Mode: ", agentMode ? 'Agent' : 'Chat'] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Subject: ", subjectMode] }), isConnected && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Model: ", currentModel] })] }))] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-6 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 max-w-4xl mx-auto", children: [messages.map((msg) => ((0, jsx_runtime_1.jsx)("div", { className: `flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`, children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: `max-w-3xl ${msg.type === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : msg.isError
                                        ? 'bg-destructive/10 border-destructive'
                                        : msg.isOffline
                                            ? 'bg-yellow-500/10 border-yellow-500'
                                            : 'bg-muted'}`, children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [msg.type === 'user' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" })), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: msg.type === 'user' ? 'You' : 'TanukiMCP Assistant' })] }), msg.tier && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `text-xs ${getTierColor(msg.tier)} text-white`, children: msg.tier })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-muted-foreground ml-auto", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3" }), msg.timestamp.toLocaleTimeString()] })] }), (0, jsx_runtime_1.jsx)("p", { className: "leading-relaxed whitespace-pre-wrap text-sm", children: msg.content }), msg.tokenUsage && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center gap-4 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-3 h-3" }), "Tokens: ", msg.tokenUsage.total] }), msg.processingTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3" }), msg.processingTime, "ms"] }))] })), (msg.isError || msg.isOffline) && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center gap-1 text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-3 h-3" }), msg.isError ? 'Error occurred' : 'Offline mode'] }))] }) }) }, msg.id))), isTyping && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-start", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-muted", children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "TanukiMCP Assistant" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground", children: "thinking..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-bounce" }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-primary rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] })] }) }) })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("textarea", { value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyDown: handleKeyPress, placeholder: "Type your message... (use @tool_name for tool calls)", disabled: isTyping, className: "flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none min-h-[44px] max-h-32", rows: 1 }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: sendMessage, disabled: !inputMessage.trim() || isTyping, size: "lg", className: "px-6", children: isTyping ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Square, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "w-4 h-4" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: "Press Enter to send, Shift+Enter for new line" }), (0, jsx_runtime_1.jsx)("span", { children: "Available tools: @file_read, @web_search, @calculator, @code_execute" })] })] }) })] }));
};
exports.ChatView = ChatView;
//# sourceMappingURL=ChatView.js.map