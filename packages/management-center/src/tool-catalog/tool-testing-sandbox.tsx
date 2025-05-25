import React from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ToolTestingSandboxProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
  onTest: (tool: Tool) => void;
}

export const ToolTestingSandbox: React.FC<ToolTestingSandboxProps> = ({
  tool,
  isOpen,
  onClose,
  onTest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Test Tool: {tool.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Parameters</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Enter test parameters as JSON..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => onTest(tool)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Run Test
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};