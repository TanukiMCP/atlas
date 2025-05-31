import React from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ModelSelector: React.FC = () => {
  const {
    isConnected,
    availableModels,
    currentModel,
    isLoadingModels,
    refreshModels,
    setCurrentModel,
    linkedOpenRouterModels,
  } = useLLMStore();

  // Filter models to only show linked models
  const modelsToDisplay = availableModels.filter(model => 
    linkedOpenRouterModels.includes(model.id) || linkedOpenRouterModels.length === 0
  );

  const hasLinkedModels = modelsToDisplay.length > 0;
  
  const currentModelName = currentModel ? 
    modelsToDisplay.find(m => m.id === currentModel)?.displayName || 'Unknown Model' : 
    'No Model Selected';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
        )}
        <span className="text-xs font-medium">
          {isConnected ? 'OpenRouter' : 'Disconnected'}
        </span>
      </div>
      
      <select
        value={currentModel || ''}
        onChange={(e) => setCurrentModel(e.target.value)}
        className={`text-xs px-2 py-1 border rounded bg-background min-w-[150px] ${
          !isConnected || !hasLinkedModels ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!isConnected || isLoadingModels || !hasLinkedModels}
      >
        {hasLinkedModels ? (
          modelsToDisplay.map(model => (
            <option key={model.id} value={model.id}>
              {model.displayName}
            </option>
          ))
        ) : (
          <option value="" disabled>
            {isConnected ? 'No models available' : 'Not connected'}
          </option>
        )}
      </select>
      
      <button
        onClick={refreshModels}
        disabled={isLoadingModels}
        className={`p-1 rounded-full ${
          isLoadingModels ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
        }`}
        title="Refresh models"
      >
        {isLoadingModels ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : (
          <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ModelSelector; 