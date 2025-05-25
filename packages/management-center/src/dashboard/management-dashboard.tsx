import React, { useState, useEffect } from 'react';
import { SystemOverview } from './system-overview';
import { ServerConfigManager } from '../server-management/server-config-manager';
import { ToolCatalogBrowser } from '../tool-catalog/tool-catalog-browser';
import { HealthMonitorDashboard } from '../monitoring/health-monitor-dashboard';
import { PerformanceAnalytics } from '../analytics/performance-analytics';
import { SystemDiagnostics } from '../diagnostics/system-diagnostics';
import { ConfigManager } from '../configuration/config-manager';
import { ThemeManager } from '../theming/theme-manager';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
}

export const ManagementDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  
  // Mock system health data
  const systemHealth = {
    status: 'healthy' as const,
    uptime: Date.now() - 3600000,
    cpu: { usage: 45 },
    memory: { usage: 60 }
  };

  const navigationItems: NavigationItem[] = [
    { id: 'overview', label: 'System Overview', icon: '📊', component: SystemOverview },
    { id: 'servers', label: 'Server Management', icon: '🔧', component: ServerConfigManager },
    { id: 'tools', label: 'Tool Catalog', icon: '🛠️', component: ToolCatalogBrowser },
    { id: 'monitoring', label: 'Health Monitoring', icon: '💓', component: HealthMonitorDashboard },
    { id: 'analytics', label: 'Performance Analytics', icon: '📈', component: PerformanceAnalytics },
    { id: 'diagnostics', label: 'System Diagnostics', icon: '🔍', component: SystemDiagnostics },
    { id: 'configuration', label: 'Configuration', icon: '⚙️', component: ConfigManager },
    { id: 'theming', label: 'Appearance', icon: '🎨', component: ThemeManager }
  ];

  const formatUptime = (uptime: number) => {
    const hours = Math.floor((Date.now() - uptime) / (1000 * 60 * 60));
    return `${hours}h`;
  };

  const selectedComponent = navigationItems.find(item => item.id === selectedView)?.component;
  const SelectedComponent = selectedComponent || SystemOverview;  return (
    <div className="management-dashboard h-screen flex bg-gray-50 dark:bg-gray-900">
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
              <div className={`w-2 h-2 rounded-full ${systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {systemHealth ? (
                <div className="space-y-1">
                  <div>Uptime: {formatUptime(systemHealth.uptime)}</div>
                  <div>CPU: {systemHealth.cpu.usage}%</div>
                  <div>Memory: {systemHealth.memory.usage}%</div>
                </div>
              ) : (
                <div>Loading system status...</div>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SelectedComponent />
      </div>
    </div>
  );
};