"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTracker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("../ui/card");
const progress_1 = require("../ui/progress");
const badge_1 = require("../ui/badge");
const button_1 = require("../ui/button");
const lucide_react_1 = require("lucide-react");
const ProgressTracker = ({ isVisible, title, steps, currentTier, onClose }) => {
    const getTierConfig = (tier) => {
        const configs = {
            basic: { color: 'bg-blue-500', icon: '🔵', label: 'Basic' },
            advanced: { color: 'bg-purple-500', icon: '🟣', label: 'Advanced' },
            premium: { color: 'bg-orange-500', icon: '🟠', label: 'Premium' }
        };
        return configs[tier] || configs.basic;
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'running': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-500 animate-spin" });
            case 'completed': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            case 'failed': return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-red-500" });
            default: return (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-4 rounded-full bg-gray-300" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'running': return 'text-blue-600';
            case 'completed': return 'text-green-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };
    const overallProgress = steps.length > 0
        ? (steps.filter(s => s.status === 'completed').length / steps.length) * 100
        : 0;
    const tierConfig = getTierConfig(currentTier);
    if (!isVisible)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-24 right-5 w-80 z-50", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-lg", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-semibold", children: title || 'Processing Status' }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onClose, className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: `${tierConfig.color} text-white text-xs`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-1", children: tierConfig.icon }), tierConfig.label, " Tier"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-muted-foreground", children: [Math.round(overallProgress), "% Complete"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: overallProgress, className: "h-2" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-3", children: [steps.map((step, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5", children: getStatusIcon(step.status) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: `text-sm font-medium ${getStatusColor(step.status)}`, children: step.label }), step.details && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground mt-1", children: step.details })), step.status === 'running' && step.progress !== undefined && ((0, jsx_runtime_1.jsx)(progress_1.Progress, { value: step.progress, className: "h-1 mt-2" }))] })] }, step.id))), steps.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-4 text-muted-foreground text-sm", children: "No active processes" }))] })] }) }));
};
exports.ProgressTracker = ProgressTracker;
//# sourceMappingURL=progress-tracker.js.map