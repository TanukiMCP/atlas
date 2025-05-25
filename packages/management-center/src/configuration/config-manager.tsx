import React from 'react';

export const ConfigManager: React.FC = () => {
  return (
    <div className="config-manager p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage system settings and configurations</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Backup & Restore</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Backup
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Restore from Backup
            </button>
            <div className="pt-2">
              <p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Import/Export</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Export Configuration
            </button>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Import Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};