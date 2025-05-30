/**
 * LLM Status Component - Shows OpenRouter connection status and model info
 */

import React from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export const LLMStatus: React.FC = () => {
  const {
    isConnected,
    healthStatus,
    availableModels,
    currentModel,
    isLoadingModels,
    checkHealth,
    refreshModels,
    setCurrentModel
  } = useLLMStore();

  const getStatusIcon = () => {
    if (isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (isConnected) {
      return `Connected • ${availableModels.length} free models`;
    } else {
      return healthStatus?.error || 'Disconnected';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <div className="text-sm font-medium">OpenRouter LLM</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {getStatusText()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isConnected && availableModels.length > 0 && (
          <select
            value={currentModel || ''}
            onChange={(e) => setCurrentModel(e.target.value)}
            className="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-700"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.displayName}
              </option>
            ))}
          </select>
        )}
        
        <button
          onClick={checkHealth}
          disabled={isLoadingModels}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Refresh connection"
        >
          {isLoadingModels ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};