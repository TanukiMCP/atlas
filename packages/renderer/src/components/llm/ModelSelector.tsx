import React from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ModelSelector: React.FC = () => {
  const {
    isConnected,
    availableModels,
    currentModel,
    isLoadingModels,
    setCurrentModel,
    refreshModels,
  } = useLLMStore();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
      <span className="text-xs font-medium">
        {isConnected ? 'OpenRouter' : 'Disconnected'}
      </span>
      {isConnected && availableModels.length > 0 && (
        <select
          value={currentModel || ''}
          onChange={(e) => setCurrentModel(e.target.value)}
          className="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-700"
          disabled={isLoadingModels}
        >
          {availableModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.displayName}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={refreshModels}
        disabled={isLoadingModels}
        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title="Refresh models"
      >
        {isLoadingModels ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ModelSelector; 