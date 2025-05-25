import React from 'react';

export const SystemOverview: React.FC = () => {
  const metrics = [
    { label: 'System Health', value: '98%', status: 'good', icon: '💓' },
    { label: 'Active Servers', value: '5/5', status: 'good', icon: '🔧' },
    { label: 'Tools Available', value: '127', status: 'good', icon: '🛠️' },
    { label: 'Memory Usage', value: '45%', status: 'good', icon: '💾' }
  ];

  return (
    <div className="system-overview p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your TanukiMCP Atlas instance</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <div className="text-2xl">{metric.icon}</div>
            </div>
            <div className={`mt-2 w-2 h-2 rounded-full ${
              metric.status === 'good' ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Server health check completed</span>
            <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Tool catalog refreshed</span>
            <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Configuration backup created</span>
            <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};