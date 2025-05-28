"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const WelcomeView = ({ onViewChange }) => {
    const features = [
        {
            id: 'chat',
            icon: '💬',
            title: 'Chat',
            description: 'Start a conversation with your AI assistant',
            view: 'chat'
        },
        {
            id: 'editor',
            icon: '📝',
            title: 'Editor',
            description: 'Code editing with AI assistance',
            view: 'editor'
        },
        {
            id: 'tools',
            icon: '🛠️',
            title: 'Tools',
            description: 'MCP tool integration',
            view: 'tools'
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl", children: "\uD83E\uDD9D" }), (0, jsx_runtime_1.jsxs)("h1", { className: "text-4xl font-bold", children: ["TanukiMCP ", (0, jsx_runtime_1.jsx)("span", { className: "tanuki-gradient", children: "Atlas" })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto", children: "Your AI-powered development environment is now working! \uD83C\uDF89" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: features.map((feature) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onViewChange(feature.view), className: "p-6 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent/10 hover:border-primary/50 transition-all duration-200 group", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl mb-3", children: feature.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-2 group-hover:text-primary transition-colors", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-sm", children: feature.description })] }, feature.id))) })] }));
};
exports.default = WelcomeView;
//# sourceMappingURL=WelcomeView.js.map