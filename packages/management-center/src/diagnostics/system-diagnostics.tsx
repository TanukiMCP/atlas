import React from 'react';

export const SystemDiagnostics: React.FC = () => {
  return (
    <div className="system-diagnostics p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Diagnostics</h1>
        <p className="text-gray-600 dark:text-gray-400">Advanced troubleshooting and system analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">System Logs</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-600">[INFO] System startup completed</div>
            <div className="text-blue-600">[DEBUG] MCP server connection established</div>
            <div className="text-yellow-600">[WARN] High memory usage detected</div>
            <div className="text-gray-600">[INFO] Tool catalog refreshed</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Diagnostic Tools</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Run Health Check
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Test All Connections
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};