import React, { useState, useEffect } from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  Zap, 
  ArrowRight, 
  Check, 
  Star,
  Clock,
  BarChart,
  Shield,
  Info
} from 'lucide-react';
import { FreeModel } from '../../stores/llm-store';

interface ModelCategoryProps {
  title: string;
  description: string;
  models: FreeModel[];
  currentModelId: string | null;
  onSelectModel: (modelId: string) => void;
}

interface ModelCardProps {
  model: FreeModel;
  isSelected: boolean;
  isLinked: boolean;
  onSelect: () => void;
  onToggleLink: () => void;
}

interface ModelStatisticsProps {
  model: FreeModel;
}

interface ModelSettingsProps {
  model: FreeModel;
  onClose: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, isLinked, onSelect, onToggleLink }) => {
  return (
    <div 
      className={`relative p-4 border rounded-lg transition-all duration-200 group
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-border bg-card hover:border-primary/30 hover:bg-accent/10'
        }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 text-primary">
          <CheckCircle className="w-5 h-5" />
        </div>
      )}
      
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleLink(); }}
        className={`absolute top-2 left-2 p-1 rounded hover:bg-opacity-20 
          ${isLinked ? 'text-yellow-500 hover:bg-yellow-500' : 'text-gray-400 hover:bg-gray-500 hover:text-white'}
          transition-colors`}
        title={isLinked ? 'Unlink Model' : 'Link Model'}
      >
        <Star className={`w-4 h-4 ${isLinked ? 'fill-current' : ''}`} />
      </button>
      
      <div className="mb-2 flex items-start justify-between cursor-pointer" onClick={onSelect}>
        <div className="ml-6">
          <h3 className="font-medium group-hover:text-primary transition-colors">{model.displayName}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{model.description}</p>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1">
        {model.specialization.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{model.rateLimits.requestsPerMinute} req/min</span>
        </div>
        <div className="flex items-center">
          <BarChart className="w-3 h-3 mr-1" />
          <span>{(model.rateLimits.tokensPerDay / 1000).toFixed(0)}K tokens/day</span>
        </div>
      </div>
      
      {isLinked && (
        <div className="absolute bottom-2 right-2 text-xs text-yellow-600 flex items-center">
          <Star className="w-3 h-3 mr-1 fill-current" /> Linked
        </div>
      )}
    </div>
  );
};

const ModelCategory: React.FC<ModelCategoryProps> = ({ 
  title, 
  description, 
  models, 
  currentModelId, 
  onSelectModel 
}) => {
  if (models.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <ModelCard 
            key={model.id}
            model={model}
            isSelected={currentModelId === model.id}
            onSelect={() => onSelectModel(model.id)}
            isLinked={false}
            onToggleLink={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

const ModelStatistics: React.FC<ModelStatisticsProps> = ({ model }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <BarChart className="w-4 h-4 mr-2" />
        Model Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Rate Limits</div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Requests per minute:</span>
            <span className="text-sm font-medium">{model.rateLimits.requestsPerMinute}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs">Tokens per day:</span>
            <span className="text-sm font-medium">{model.rateLimits.tokensPerDay.toLocaleString()}</span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground mb-1">Specializations</div>
          <div className="flex flex-wrap gap-1">
            {model.specialization.map((specialty, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelSettings: React.FC<ModelSettingsProps> = ({ model, onClose }) => {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.95);
  
  const handleSave = () => {
    // Save settings to local storage or app state
    localStorage.setItem(`model_settings_${model.id}`, JSON.stringify({
      temperature,
      maxTokens,
      topP
    }));
    onClose();
  };
  
  useEffect(() => {
    // Load settings from local storage if available
    const savedSettings = localStorage.getItem(`model_settings_${model.id}`);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setTemperature(parsedSettings.temperature || 0.7);
        setMaxTokens(parsedSettings.maxTokens || 2048);
        setTopP(parsedSettings.topP || 0.95);
      } catch (error) {
        console.error('Failed to parse saved model settings:', error);
      }
    }
  }, [model.id]);
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Model Settings: {model.displayName}
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Temperature: {temperature}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>More Deterministic</span>
            <span>More Creative</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Maximum Length: {maxTokens} tokens</label>
          <input
            type="range"
            min="256"
            max="4096"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Top-P: {topP}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button
          onClick={handleSave}
          className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

const OpenRouterModelHub: React.FC = () => {
  const { 
    isConnected,
    availableModels,
    currentModel,
    isLoadingModels,
    refreshModels,
    setCurrentModel,
    linkedOpenRouterModels,
    linkOpenRouterModel,
    unlinkOpenRouterModel,
    isModelLinked
  } = useLLMStore();
  
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'settings'>('all');
  const [selectedModel, setSelectedModel] = useState<FreeModel | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (availableModels.length === 0) {
      refreshModels();
    }
  }, []);
  
  useEffect(() => {
    // Set selected model when currentModel changes
    if (currentModel && availableModels.length > 0) {
      const model = availableModels.find(m => m.id === currentModel);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, [currentModel, availableModels]);

  const handleRefresh = async () => {
    await refreshModels();
  };
  
  const getCategories = () => {
    // Group models by their primary specialization
    const codingModels = availableModels.filter(model => 
      model.specialization.includes('coding')
    );
    
    const reasoningModels = availableModels.filter(model => 
      model.specialization.includes('reasoning')
    );
    
    const creativeModels = availableModels.filter(model => 
      model.specialization.includes('creative-writing')
    );
    
    const generalModels = availableModels.filter(model => 
      model.specialization.includes('general') || 
      model.specialization.includes('conversation')
    );
    
    return {
      codingModels,
      reasoningModels,
      creativeModels,
      generalModels
    };
  };
  
  const { codingModels, reasoningModels, creativeModels, generalModels } = getCategories();
  
  const handleToggleLink = (modelId: string) => {
    if (isModelLinked(modelId)) {
      unlinkOpenRouterModel(modelId);
    } else {
      linkOpenRouterModel(modelId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">OpenRouter Models</h1>
          {isConnected ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              Disconnected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-md transition-colors ${
              activeTab === 'settings' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-transparent text-muted-foreground hover:bg-accent'
            }`}
            title="Model Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoadingModels}
            className="p-2 rounded-md bg-transparent text-muted-foreground hover:bg-accent transition-colors"
            title="Refresh Models"
          >
            {isLoadingModels ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {!isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                Not connected to OpenRouter. Please check your internet connection and API key in Settings.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            All Models
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`py-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'recommended'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Recommended Models
          </button>
        </div>
      </div>
      
      {/* Selected model details - show at top when there's a selection */}
      {selectedModel && activeTab !== 'settings' && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{selectedModel.displayName}</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  Selected
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{selectedModel.description}</p>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Model Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {showSettings && (
            <ModelSettings 
              model={selectedModel} 
              onClose={() => setShowSettings(false)} 
            />
          )}
          
          {!showSettings && (
            <ModelStatistics model={selectedModel} />
          )}
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">OpenRouter API Configuration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your API key allows you to access models through OpenRouter. 
              To change your API key, go to the main Settings panel.
            </p>
            
            <div className="flex items-center p-4 bg-muted rounded-md">
              <div className="mr-4 text-primary">
                <Info className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <p className="font-medium">About Free Models</p>
                <p className="text-muted-foreground mt-1">
                  OpenRouter provides free access to several powerful models. These models have 
                  rate limits but are suitable for most personal projects. For higher limits, 
                  consider adding credit to your OpenRouter account.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Default Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Default Temperature: 0.7</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={0.7}
                    disabled
                    className="w-full opacity-60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Default Maximum Length: 2048 tokens</label>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="128"
                    value={2048}
                    disabled
                    className="w-full opacity-60"
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                You can customize these settings for each model individually by selecting a model 
                and clicking the settings icon.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* All Models Tab */}
      {activeTab === 'all' && isConnected && (
        <div>
          <ModelCategory
            title="General Purpose Models"
            description="Models optimized for general conversation and assistance"
            models={generalModels}
            currentModelId={currentModel}
            onSelectModel={setCurrentModel}
          />
          
          <ModelCategory
            title="Coding & Development Models"
            description="Models specialized in programming, code generation, and debugging"
            models={codingModels}
            currentModelId={currentModel}
            onSelectModel={setCurrentModel}
          />
          
          <ModelCategory
            title="Reasoning & Analysis Models"
            description="Models excelling at logical reasoning and complex problem-solving"
            models={reasoningModels}
            currentModelId={currentModel}
            onSelectModel={setCurrentModel}
          />
          
          <ModelCategory
            title="Creative Writing Models"
            description="Models designed for creative content generation and storytelling"
            models={creativeModels}
            currentModelId={currentModel}
            onSelectModel={setCurrentModel}
          />
        </div>
      )}
      
      {/* Recommended Models Tab */}
      {activeTab === 'recommended' && isConnected && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-md mr-3 dark:bg-blue-900 dark:text-blue-200">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-medium">For General Use</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Our recommendation for everyday tasks and general conversation.
              </p>
              
              {generalModels.length > 0 && (
                <ModelCard 
                  model={generalModels[0]}
                  isSelected={currentModel === generalModels[0].id}
                  onSelect={() => setCurrentModel(generalModels[0].id)}
                  isLinked={isModelLinked(generalModels[0].id)}
                  onToggleLink={() => handleToggleLink(generalModels[0].id)}
                />
              )}
            </div>
            
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-md mr-3 dark:bg-amber-900 dark:text-amber-200">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-medium">For Programming</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Our recommendation for coding, debugging, and development.
              </p>
              
              {codingModels.length > 0 && (
                <ModelCard 
                  model={codingModels[0]}
                  isSelected={currentModel === codingModels[0].id}
                  onSelect={() => setCurrentModel(codingModels[0].id)}
                  isLinked={isModelLinked(codingModels[0].id)}
                  onToggleLink={() => handleToggleLink(codingModels[0].id)}
                />
              )}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Task-Specific Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">Complex Reasoning</h4>
                <p className="text-sm text-muted-foreground">For multi-step problem solving and logical analysis</p>
              </div>
              {reasoningModels.length > 0 && (
                <button
                  onClick={() => setCurrentModel(reasoningModels[0].id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <span>Use Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="p-4 border border-border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">Creative Writing</h4>
                <p className="text-sm text-muted-foreground">For storytelling, content creation, and creative tasks</p>
              </div>
              {creativeModels.length > 0 && (
                <button
                  onClick={() => setCurrentModel(creativeModels[0].id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <span>Use Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoadingModels && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        </div>
      )}
      
      {/* No models state */}
      {!isLoadingModels && isConnected && availableModels.length === 0 && (
        <div className="bg-muted p-6 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Models Available</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any available models. Please try refreshing the list or check your OpenRouter API key.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh Models
          </button>
        </div>
      )}
    </div>
  );
};

export default OpenRouterModelHub; 