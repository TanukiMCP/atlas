"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("../ui/card");
const badge_1 = require("../ui/badge");
const METRICS = [
    { title: 'Total Tasks Completed', value: '1,247', change: '+12%', trend: 'up', icon: '✅' },
    { title: 'Workflow Executions', value: '856', change: '+8%', trend: 'up', icon: '⚡' },
    { title: 'Tools Used', value: '34', change: '+3', trend: 'up', icon: '🛠️' },
    { title: 'Success Rate', value: '94.7%', change: '-0.2%', trend: 'down', icon: '📊' }
];
const ACTIVITIES = [
    { id: 1, action: 'Workflow completed', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Tool installed', time: '15 min ago', status: 'info' },
    { id: 3, action: 'Agent activated', time: '1 hour ago', status: 'success' }
];
const AnalyticsDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = (0, react_1.useState)('7d');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col bg-muted/30", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-5 bg-background border-b border-border", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-1", children: "\uD83D\uDCCA Analytics Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Performance metrics and insights" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-5 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: METRICS.map((metric, index) => ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: metric.icon }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary', className: "text-xs", children: metric.change })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold mb-1", children: metric.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: metric.title })] }) }, index))) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Recent Activities" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ACTIVITIES.map(activity => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}` }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium", children: activity.action }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: activity.time })] })] }, activity.id))) }) })] })] })] }));
};
exports.AnalyticsDashboard = AnalyticsDashboard;
//# sourceMappingURL=analytics-dashboard.js.map