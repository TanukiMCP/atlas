"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementDashboard = void 0;
const react_1 = __importStar(require("react"));
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
    return (<div className="management-dashboard h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-semibold">TanukiMCP</h1>
              <p className="text-sm text-gray-500">Management Center</p>
            </div>
          </div>
          
          {/* System Status Card */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Status</span>
              <div className={`w-2 h-2 rounded-full ${systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}/>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {systemHealth ? (<div className="space-y-1">
                  <div>Uptime: {formatUptime(systemHealth.uptime)}</div>
                  <div>CPU: {systemHealth.cpu.usage}%</div>
                  <div>Memory: {systemHealth.memory.usage}%</div>
                </div>) : (<div>Loading system status...</div>)}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (<button key={item.id} onClick={() => setSelectedView(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${selectedView === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SelectedComponent />
      </div>
    </div>);
};
exports.ManagementDashboard = ManagementDashboard;
//# sourceMappingURL=management-dashboard.js.map