import React from 'react';

export const ServerConfigManager: React.FC = () => {
  return (
    <div className="server-config-manager p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Server Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure and manage MCP servers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Built-in MCP Server</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Port</span>
              <span>3001</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tools</span>
              <span>47</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">External Servers</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Connected</span>
              <span>3</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Tools</span>
              <span>152</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add New Server
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};