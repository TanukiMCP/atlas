/**
 * TanukiMCP Management Center
 * Comprehensive system administration and monitoring hub
 */

// Main Dashboard
export { ManagementDashboard } from './dashboard/management-dashboard';
export { SystemOverview } from './dashboard/system-overview';

// Server Management
export { ServerConfigManager } from './server-management/server-config-manager';

// Tool Catalog
export { ToolCatalogBrowser } from './tool-catalog/tool-catalog-browser';

// Monitoring
export { HealthMonitorDashboard } from './monitoring/health-monitor-dashboard';

// Analytics
export { PerformanceAnalytics } from './analytics/performance-analytics';

// Diagnostics
export { SystemDiagnostics } from './diagnostics/system-diagnostics';

// Configuration
export { ConfigManager } from './configuration/config-manager';

// Theming
export { ThemeManager } from './theming/theme-manager';

// Types
export type * from './types/management-types';
export type * from './types/monitoring-types';

// Default export
export { ManagementDashboard as default } from './dashboard/management-dashboard';