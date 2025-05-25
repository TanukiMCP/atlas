import React, { useState, useEffect } from 'react';
import { ToolPreview as ToolPreviewData, UnifiedTool } from '../types/tool-router-types';

interface ToolPreviewProps {
  toolId: string;
  toolRouter: any;
}

export const ToolPreview: React.FC<ToolPreviewProps> = ({ toolId, toolRouter }) => {
  const [preview, setPreview] = useState<ToolPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreview();
  }, [toolId]);

  const loadPreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const previewData = await toolRouter.getToolPreview(toolId);
      setPreview(previewData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        <div className="text-2xl mb-2">⚠️</div>
        <div className="text-sm">Failed to load preview</div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <div className="text-2xl mb-2">📄</div>
        <div className="text-sm">No preview available</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Tool header */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">{preview.tool.category.icon}</span>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {preview.tool.name}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {preview.tool.description}
        </p>
      </div>

      {/* Performance metrics */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">Success Rate</div>
            <div className="font-medium">{preview.performanceMetrics.successRate}%</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">Avg Time</div>
            <div className="font-medium">
              {preview.performanceMetrics.averageExecutionTime < 1000 
                ? `${preview.performanceMetrics.averageExecutionTime}ms`
                : `${(preview.performanceMetrics.averageExecutionTime / 1000).toFixed(1)}s`
              }
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">Usage</div>
            <div className="font-medium">{preview.performanceMetrics.usageFrequency}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <div className="text-gray-500 dark:text-gray-400">Trend</div>
            <div className="font-medium">
              {preview.performanceMetrics.trendDirection === 'up' ? '📈' : 
               preview.performanceMetrics.trendDirection === 'down' ? '📉' : '➡️'}
            </div>
          </div>
        </div>
      </div>      {/* Recent usage */}
      {preview.recentUsage.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Usage</h4>
          <div className="space-y-2">
            {preview.recentUsage.slice(0, 3).map((usage, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {usage.timestamp.toLocaleDateString()}
                  </span>
                  <span className={usage.success ? 'text-green-600' : 'text-red-600'}>
                    {usage.success ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {usage.executionTime}ms • {usage.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentation */}
      {preview.documentation && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documentation</h4>
          
          {/* Parameters */}
          {preview.documentation.parameters.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parameters</h5>
              <div className="space-y-1">
                {preview.documentation.parameters.map((param, index) => (
                  <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <code className="text-blue-600 dark:text-blue-400">{param.name}</code>
                      <span className="text-gray-500">({param.type})</span>
                      {param.required && <span className="text-red-500">*</span>}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mt-1">{param.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {preview.documentation.examples.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Examples</h5>
              <div className="space-y-2">
                {preview.documentation.examples.slice(0, 2).map((example, index) => (
                  <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {example.title}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mb-1">
                      {example.description}
                    </div>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded overflow-x-auto">
                      {JSON.stringify(example.input, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Similar tools */}
      {preview.similarTools.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Similar Tools</h4>
          <div className="space-y-1">
            {preview.similarTools.slice(0, 3).map(tool => (
              <div key={tool.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span>{tool.category.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {tool.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {tool.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};