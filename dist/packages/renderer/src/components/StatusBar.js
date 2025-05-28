"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const StatusBar = ({ connectionStatus, currentView, theme, version }) => {
    const getConnectionStatusColor = (status) => {
        switch (status) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-destructive';
        }
    };
    const primaryConnection = connectionStatus.find(conn => conn.service === 'Ollama') ||
        { service: 'Ollama', status: 'disconnected' };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-6 bg-card/50 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${getConnectionStatusColor(primaryConnection.status)}` }), primaryConnection.status === 'connected' ? 'Online' : 'Offline'] }), (0, jsx_runtime_1.jsx)("span", { children: "\uD83E\uDD16 General mode" }), (0, jsx_runtime_1.jsx)("span", { children: "Agent mode" }), (0, jsx_runtime_1.jsxs)("span", { children: [primaryConnection.service, ": ", primaryConnection.status] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["TanukiMCP Atlas ", version] }), (0, jsx_runtime_1.jsxs)("span", { children: [theme, " theme"] })] })] }));
};
exports.default = StatusBar;
//# sourceMappingURL=StatusBar.js.map