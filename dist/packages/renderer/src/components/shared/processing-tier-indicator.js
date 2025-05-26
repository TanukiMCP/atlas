"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingTierIndicator = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("../ui/card");
const badge_1 = require("../ui/badge");
const progress_1 = require("../ui/progress");
const lucide_react_1 = require("lucide-react");
const ProcessingTierIndicator = ({ currentTier, isActive, complexity, estimatedTime, queuePosition }) => {
    const getTierConfig = (tier) => {
        const configs = {
            basic: {
                color: 'bg-blue-500',
                icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4" }),
                label: 'Basic',
                description: 'Standard processing'
            },
            advanced: {
                color: 'bg-purple-500',
                icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }),
                label: 'Advanced',
                description: 'Enhanced capabilities'
            },
            premium: {
                color: 'bg-orange-500',
                icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4" }),
                label: 'Premium',
                description: 'Priority processing'
            },
            enterprise: {
                color: 'bg-gradient-to-r from-purple-500 to-pink-500',
                icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Crown, { className: "h-4 w-4" }),
                label: 'Enterprise',
                description: 'Maximum performance'
            }
        };
        return configs[tier] || configs.basic;
    };
    const getComplexityLevel = (complexity) => {
        if (complexity <= 3)
            return { label: 'Simple', color: 'bg-green-500', progress: 25 };
        if (complexity <= 6)
            return { label: 'Moderate', color: 'bg-yellow-500', progress: 50 };
        if (complexity <= 8)
            return { label: 'Complex', color: 'bg-orange-500', progress: 75 };
        return { label: 'Advanced', color: 'bg-red-500', progress: 100 };
    };
    const tierConfig = getTierConfig(currentTier);
    const complexityInfo = getComplexityLevel(complexity);
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-20 right-5 w-72 z-40", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-lg border", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-semibold", children: "Processing Tier" }), isActive && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }))] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: `${tierConfig.color} text-white px-3 py-1`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: tierConfig.icon }), tierConfig.label] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground", children: tierConfig.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Task Complexity" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: [complexityInfo.label, " (", complexity, "/10)"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: complexityInfo.progress, className: "h-2" })] }), estimatedTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Estimated Time:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: estimatedTime })] })), queuePosition && queuePosition > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Queue Position:" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: ["#", queuePosition] })] })), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground", children: isActive ? 'Processing active' : 'Idle' })] }) })] })] }) }));
};
exports.ProcessingTierIndicator = ProcessingTierIndicator;
//# sourceMappingURL=processing-tier-indicator.js.map