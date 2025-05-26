"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInterface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.ChatInterface = (0, react_1.forwardRef)(({ onAtSymbolTrigger, operationalMode = 'agent' }, ref) => {
    const [message, setMessage] = (0, react_1.useState)('');
    (0, react_1.useImperativeHandle)(ref, () => ({
        insertText: (text) => setMessage(prev => prev + text),
    }));
    const [messages, setMessages] = (0, react_1.useState)([
        {
            id: '1',
            type: 'assistant',
            content: 'Welcome to TanukiMCP Atlas! I\'m here to help you with AI-driven WordPress automation, development workflows, and intelligent tooling. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
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
    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                type: 'user',
                content: message.trim(),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage('');
            // Simulate assistant response based on operational mode
            setTimeout(() => {
                const response = {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: operationalMode === 'agent'
                        ? `I'm in Agent Mode and can help you with file operations, code execution, and complex workflows. You asked: "${newMessage.content}"`
                        : `I'm in Chat Mode and can help with analysis, research, and conversational assistance. You asked: "${newMessage.content}"`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, response]);
            }, 1000);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "chat-interface", children: [(0, jsx_runtime_1.jsx)("div", { className: "chat-messages custom-scrollbar", children: messages.map((msg) => ((0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '16px' }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                            background: msg.type === 'assistant'
                                ? 'linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary))'
                                : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                            padding: '16px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-sm)',
                            marginLeft: msg.type === 'user' ? '20%' : '0',
                            marginRight: msg.type === 'assistant' ? '20%' : '0'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px'
                                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: msg.type === 'assistant'
                                                ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))'
                                                : 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-secondary-hover))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px'
                                        }, children: msg.type === 'assistant' ? '🦝' : '👤' }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            color: msg.type === 'assistant' ? 'var(--color-text-primary)' : 'white'
                                        }, children: msg.type === 'assistant' ? `TanukiMCP Assistant (${operationalMode})` : 'You' }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '11px',
                                            color: msg.type === 'assistant' ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.7)',
                                            marginLeft: 'auto'
                                        }, children: msg.timestamp.toLocaleTimeString() })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    fontSize: '14px',
                                    color: msg.type === 'assistant' ? 'var(--color-text-secondary)' : 'white',
                                    lineHeight: '1.5'
                                }, children: msg.content })] }) }, msg.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "chat-input-area", children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-end',
                        padding: '4px 0'
                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                fontSize: '12px',
                                padding: '4px 8px',
                                backgroundColor: operationalMode === 'agent' ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '500'
                            }, children: operationalMode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode' }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: operationalMode === 'agent'
                                ? "Type your message... (use @ for tools, I can execute actions)"
                                : "Type your message... (conversational mode, thinking tools only)", className: "input", style: { flex: 1 } }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", onClick: handleSendMessage, disabled: !message.trim(), children: "Send" })] }) })] }));
});
//# sourceMappingURL=chat-interface.js.map