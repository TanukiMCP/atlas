import React from 'react';
import { UnifiedTool } from '../types/tool-router-types';

interface ToolSelectorProps {
  tool: UnifiedTool;
  isSelected: boolean;
  onClick: () => void;
  onHover: () => void;
  showUsageStats?: boolean;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  tool,
  isSelected,
  onClick,
  onHover,
  showUsageStats = false
}) => {
  const isAvailable = tool.availability.status === 'available';
  
  const getStatusIcon = () => {
    switch (tool.availability.status) {
      case 'available': return '🟢';
      case 'busy': return '🟡';
      case 'unavailable': return '🔴';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div
      className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-150 ${
        isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      } ${!isAvailable ? 'opacity-60' : ''}`}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <div className="flex items-start justify-between">
        {/* Tool info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{tool.category.icon}</span>
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {tool.name}
            </h3>
            <span className="text-xs">{getStatusIcon()}</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {tool.description}
          </p>
          
          {/* Tags */}
          {tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tool.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Usage stats */}
          {showUsageStats && (
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <span>📊</span>
                <span>{tool.usageCount} uses</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>✅</span>
                <span>{tool.successRate}%</span>
              </div>
              {tool.averageExecutionTime > 0 && (
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{formatExecutionTime(tool.averageExecutionTime)}</span>
                </div>
              )}
              {tool.userRating && (
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{tool.userRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Source indicator */}
        <div className="flex flex-col items-end space-y-1 ml-3">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            tool.source.type === 'builtin' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {tool.source.type}
          </span>
          
          {tool.availability.estimatedWaitTime && tool.availability.estimatedWaitTime > 0 && (
            <span className="text-xs text-orange-600 dark:text-orange-400">
              ~{formatExecutionTime(tool.availability.estimatedWaitTime)}
            </span>
          )}
        </div>
      </div>
      
      {/* Error message if unavailable */}
      {!isAvailable && tool.availability.errorMessage && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
          {tool.availability.errorMessage}
        </div>
      )}
    </div>
  );
};