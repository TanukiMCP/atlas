import React from 'react';

export const WorkflowManager: React.FC = () => {
  return (
    <div className="workflow-manager h-full p-4">
      <h3 className="text-lg font-semibold mb-4">Workflow Manager</h3>
      <div className="space-y-3">
        <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
          <div className="font-medium">Code Review Workflow</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Automated code analysis and suggestions</div>
        </button>
        
        <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
          <div className="font-medium">Documentation Generator</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Generate docs from code</div>
        </button>
        
        <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
          <div className="font-medium">Test Suite Creator</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Create comprehensive test suites</div>
        </button>
        
        <button className="w-full mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Create New Workflow
        </button>
      </div>
    </div>
  );
};