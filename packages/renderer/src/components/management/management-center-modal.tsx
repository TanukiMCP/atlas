import React, { useState } from 'react';
import { ManagementDashboard } from '@management-center';
import { MCPServerManagement } from './mcp-server-management';

interface ManagementCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagementCenterModal: React.FC<ManagementCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mcp-servers'>('dashboard');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] m-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              TanukiMCP Management Center
            </h1>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('mcp-servers')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'mcp-servers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                MCP Servers
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="h-full">
          {activeTab === 'dashboard' ? (
            <ManagementDashboard />
          ) : (
            <MCPServerManagement />
          )}
        </div>
      </div>
    </div>
  );
};