"use strict";
/**
 * TanukiMCP Management Center
 * Comprehensive system administration and monitoring hub
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.ThemeManager = exports.ConfigManager = exports.SystemDiagnostics = exports.PerformanceAnalytics = exports.HealthMonitorDashboard = exports.ToolCatalogBrowser = exports.ServerConfigManager = exports.SystemOverview = exports.ManagementDashboard = void 0;
// Main Dashboard
var management_dashboard_1 = require("./dashboard/management-dashboard");
Object.defineProperty(exports, "ManagementDashboard", { enumerable: true, get: function () { return management_dashboard_1.ManagementDashboard; } });
var system_overview_1 = require("./dashboard/system-overview");
Object.defineProperty(exports, "SystemOverview", { enumerable: true, get: function () { return system_overview_1.SystemOverview; } });
// Server Management
var server_config_manager_1 = require("./server-management/server-config-manager");
Object.defineProperty(exports, "ServerConfigManager", { enumerable: true, get: function () { return server_config_manager_1.ServerConfigManager; } });
// Tool Catalog
var tool_catalog_browser_1 = require("./tool-catalog/tool-catalog-browser");
Object.defineProperty(exports, "ToolCatalogBrowser", { enumerable: true, get: function () { return tool_catalog_browser_1.ToolCatalogBrowser; } });
// Monitoring
var health_monitor_dashboard_1 = require("./monitoring/health-monitor-dashboard");
Object.defineProperty(exports, "HealthMonitorDashboard", { enumerable: true, get: function () { return health_monitor_dashboard_1.HealthMonitorDashboard; } });
// Analytics
var performance_analytics_1 = require("./analytics/performance-analytics");
Object.defineProperty(exports, "PerformanceAnalytics", { enumerable: true, get: function () { return performance_analytics_1.PerformanceAnalytics; } });
// Diagnostics
var system_diagnostics_1 = require("./diagnostics/system-diagnostics");
Object.defineProperty(exports, "SystemDiagnostics", { enumerable: true, get: function () { return system_diagnostics_1.SystemDiagnostics; } });
// Configuration
var config_manager_1 = require("./configuration/config-manager");
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return config_manager_1.ConfigManager; } });
// Theming
var theme_manager_1 = require("./theming/theme-manager");
Object.defineProperty(exports, "ThemeManager", { enumerable: true, get: function () { return theme_manager_1.ThemeManager; } });
// Default export
var management_dashboard_2 = require("./dashboard/management-dashboard");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return management_dashboard_2.ManagementDashboard; } });
//# sourceMappingURL=index.js.map