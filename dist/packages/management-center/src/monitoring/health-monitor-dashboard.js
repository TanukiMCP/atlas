"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMonitorDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const HealthMonitorDashboard = () => {
    const [timeRange, setTimeRange] = (0, react_1.useState)('1h');
    const [isMonitoring, setIsMonitoring] = (0, react_1.useState)(true);
    const healthMetrics = [
        { title: 'Overall Health', value: '98%', status: 'good', icon: '💓' },
        { title: 'CPU Usage', value: '45%', status: 'good', icon: '🔥' },
        { title: 'Memory Usage', value: '60%', status: 'warning', icon: '💾' },
        { title: 'Active Servers', value: '5/5', status: 'good', icon: '🔧' }
    ];
    const serverStatuses = [
        { id: '1', name: 'Built-in MCP Server', status: 'healthy' },
        { id: '2', name: 'External MCP Server 1', status: 'healthy' },
        { id: '3', name: 'External MCP Server 2', status: 'warning' },
        { id: '4', name: 'Tool Router', status: 'healthy' },
        { id: '5', name: 'LLM Enhanced', status: 'healthy' }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'good':
            case 'healthy':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'error':
            case 'offline':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "health-monitor p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Health Monitoring" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Real-time system health and performance" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isMonitoring ? 'Live' : 'Stopped' })] }), (0, jsx_runtime_1.jsxs)("select", { value: timeRange, onChange: (e) => setTimeRange(e.target.value), className: "px-3 py-1 border border-gray-300 rounded-lg text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "1h", children: "Last Hour" }), (0, jsx_runtime_1.jsx)("option", { value: "6h", children: "Last 6 Hours" }), (0, jsx_runtime_1.jsx)("option", { value: "24h", children: "Last 24 Hours" }), (0, jsx_runtime_1.jsx)("option", { value: "7d", children: "Last 7 Days" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: healthMetrics.map((metric, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: metric.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: metric.value })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: metric.icon })] }), (0, jsx_runtime_1.jsx)("div", { className: `mt-2 w-full h-2 rounded-full ${getStatusColor(metric.status)}` })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Server Status" }) }), (0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: serverStatuses.map((server) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${getStatusColor(server.status)}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 dark:text-white", children: server.name })] }), (0, jsx_runtime_1.jsx)("span", { className: `text-sm font-medium ${server.status === 'healthy' ? 'text-green-600' :
                                        server.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`, children: server.status.charAt(0).toUpperCase() + server.status.slice(1) })] }, server.id))) })] })] }));
};
exports.HealthMonitorDashboard = HealthMonitorDashboard;
//# sourceMappingURL=health-monitor-dashboard.js.map