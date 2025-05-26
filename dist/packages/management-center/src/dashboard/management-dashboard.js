"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const system_overview_1 = require("./system-overview");
const server_config_manager_1 = require("../server-management/server-config-manager");
const tool_catalog_browser_1 = require("../tool-catalog/tool-catalog-browser");
const health_monitor_dashboard_1 = require("../monitoring/health-monitor-dashboard");
const performance_analytics_1 = require("../analytics/performance-analytics");
const system_diagnostics_1 = require("../diagnostics/system-diagnostics");
const config_manager_1 = require("../configuration/config-manager");
const theme_manager_1 = require("../theming/theme-manager");
const ManagementDashboard = () => {
    const [selectedView, setSelectedView] = (0, react_1.useState)('overview');
    const [refreshInterval, setRefreshInterval] = (0, react_1.useState)(5000);
    // Mock system health data
    const systemHealth = {
        status: 'healthy',
        uptime: Date.now() - 3600000,
        cpu: { usage: 45 },
        memory: { usage: 60 }
    };
    const navigationItems = [
        { id: 'overview', label: 'System Overview', icon: '📊', component: system_overview_1.SystemOverview },
        { id: 'servers', label: 'Server Management', icon: '🔧', component: server_config_manager_1.ServerConfigManager },
        { id: 'tools', label: 'Tool Catalog', icon: '🛠️', component: tool_catalog_browser_1.ToolCatalogBrowser },
        { id: 'monitoring', label: 'Health Monitoring', icon: '💓', component: health_monitor_dashboard_1.HealthMonitorDashboard },
        { id: 'analytics', label: 'Performance Analytics', icon: '📈', component: performance_analytics_1.PerformanceAnalytics },
        { id: 'diagnostics', label: 'System Diagnostics', icon: '🔍', component: system_diagnostics_1.SystemDiagnostics },
        { id: 'configuration', label: 'Configuration', icon: '⚙️', component: config_manager_1.ConfigManager },
        { id: 'theming', label: 'Appearance', icon: '🎨', component: theme_manager_1.ThemeManager }
    ];
    const formatUptime = (uptime) => {
        const hours = Math.floor((Date.now() - uptime) / (1000 * 60 * 60));
        return `${hours}h`;
    };
    const selectedComponent = navigationItems.find(item => item.id === selectedView)?.component;
    const SelectedComponent = selectedComponent || system_overview_1.SystemOverview;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "management-dashboard h-screen flex bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg", children: "T" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold", children: "TanukiMCP" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Management Center" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "System Status" }), (0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}` })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: systemHealth ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Uptime: ", formatUptime(systemHealth.uptime)] }), (0, jsx_runtime_1.jsxs)("div", { children: ["CPU: ", systemHealth.cpu.usage, "%"] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Memory: ", systemHealth.memory.usage, "%"] })] })) : ((0, jsx_runtime_1.jsx)("div", { children: "Loading system status..." })) })] }), (0, jsx_runtime_1.jsx)("nav", { className: "space-y-2", children: navigationItems.map((item) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedView(item.id), className: `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${selectedView === item.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: item.label })] }, item.id))) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col overflow-hidden", children: (0, jsx_runtime_1.jsx)(SelectedComponent, {}) })] }));
};
exports.ManagementDashboard = ManagementDashboard;
//# sourceMappingURL=management-dashboard.js.map