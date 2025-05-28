"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("../ui/button");
const card_1 = require("../ui/card");
const badge_1 = require("../ui/badge");
const lucide_react_1 = require("lucide-react");
const WelcomeView = ({ onViewChange, isConnected, currentModel }) => {
    const quickActions = [
        {
            title: 'Start Chatting',
            description: 'Begin a conversation with your AI assistant',
            icon: lucide_react_1.MessageSquare,
            action: () => onViewChange('chat'),
            color: 'bg-blue-500',
        },
        {
            title: 'Open Editor',
            description: 'Start coding with AI-powered assistance',
            icon: lucide_react_1.Code,
            action: () => onViewChange('editor'),
            color: 'bg-green-500',
        },
        {
            title: 'Workflow Manager',
            description: 'Create and manage automated workflows',
            icon: lucide_react_1.Workflow,
            action: () => onViewChange('workflow-manager'),
            color: 'bg-purple-500',
        },
        {
            title: 'Settings',
            description: 'Configure your development environment',
            icon: lucide_react_1.Settings,
            action: () => onViewChange('settings'),
            color: 'bg-gray-500',
        },
    ];
    const features = [
        {
            title: 'Multi-Tier AI Processing',
            description: 'Intelligent routing from simple queries to complex analysis',
            icon: lucide_react_1.Brain,
        },
        {
            title: 'MCP Tool Integration',
            description: 'Seamless integration with Model Context Protocol tools',
            icon: lucide_react_1.Zap,
        },
        {
            title: 'Prompt Management',
            description: 'Organize and optimize your AI prompts',
            icon: lucide_react_1.FileText,
        },
        {
            title: 'Performance Monitoring',
            description: 'Track usage, costs, and performance metrics',
            icon: lucide_react_1.Monitor,
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-6 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl", children: "\uD83E\uDD9D" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold", children: "TanukiMCP Atlas" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto", children: "Your AI-powered development environment with advanced tool integration and intelligent processing" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}` }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: isConnected ? 'default' : 'destructive', children: isConnected ? `Connected to ${currentModel}` : 'Ollama Disconnected' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: "Quick Start" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: quickActions.map((action) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "cursor-pointer hover:shadow-lg transition-all hover:scale-105", onClick: action.action, children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`, children: (0, jsx_runtime_1.jsx)(action.icon, { className: "w-6 h-6 text-white" }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: action.title }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: action.description })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-0", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "w-full", children: ["Get Started ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 ml-1" })] }) })] }, action.title))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: "Key Features" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: features.map((feature) => ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(feature.icon, { className: "w-8 h-8 text-primary" }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-xl", children: feature.title })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: feature.description })] }) }, feature.title))) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BookOpen, { className: "w-8 h-8 text-primary" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-xl", children: "Getting Started" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Quick setup guide for optimal experience" })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isConnected ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`, children: "1" }), (0, jsx_runtime_1.jsx)("span", { className: isConnected ? 'line-through text-muted-foreground' : '', children: "Install and configure Ollama" }), isConnected && (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: "\u2713 Complete" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold", children: "2" }), (0, jsx_runtime_1.jsx)("span", { children: "Configure your preferred AI models" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold", children: "3" }), (0, jsx_runtime_1.jsx)("span", { children: "Set up MCP tool connections" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold", children: "4" }), (0, jsx_runtime_1.jsx)("span", { children: "Create your first workflow" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => onViewChange('settings'), children: ["Open Settings ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-4 h-4 ml-1" })] }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-xl", children: "Recent Activity" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Your recent chats, workflows, and projects" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), (0, jsx_runtime_1.jsx)("p", { children: "No recent activity yet. Start a chat or create a workflow to see your history here." })] }) })] })] }) }));
};
exports.WelcomeView = WelcomeView;
//# sourceMappingURL=WelcomeView.js.map