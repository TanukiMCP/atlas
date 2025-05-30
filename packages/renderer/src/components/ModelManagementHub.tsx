/**
 * ModelManagementHub - Comprehensive model management interface
 * Part of TanukiMCP Apollo system
 */

import React, { useState, useEffect } from 'react';
import { ModelManagementHubProps, TanukiModel, ModelInstallation, ModelConfiguration } from '../types';

type TabType = 'installed' | 'available' | 'configuration' | 'performance';

const ModelManagementHub: React.FC<ModelManagementHubProps> = ({
  installedModels = [],
  availableModels = [],
  installations = [],
  configurations = [],
  systemCapabilities,
  onInstallModel,
  onUninstallModel,
  onConfigureModel,
  onSetDefaultModel,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('installed');
  const [selectedModel, setSelectedModel] = useState<TanukiModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tanukimcp-apollo': return '☀️';
      case 'tanukimcp-athena': return '🦉';
      case 'tanukimcp-hermes': return '⚡';
      case 'tanukimcp-artemis': return '🏹';
      case 'tanukimcp-hephaestus': return '🔨';
      case 'tanukimcp-dionysus': return '🍇';
      default: return '🤖';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tanukimcp-apollo': return 'Apollo (Knowledge & Reasoning)';
      case 'tanukimcp-athena': return 'Athena (Strategy & Coding)';
      case 'tanukimcp-hermes': return 'Hermes (Communication & Chat)';
      case 'tanukimcp-artemis': return 'Artemis (Specialized & Hunting)';
      case 'tanukimcp-hephaestus': return 'Hephaestus (Tool & Creation)';
      case 'tanukimcp-dionysus': return 'Dionysus (Creative & Experimental)';
      default: return 'Unknown Category';
    }
  };

  const getInstallationProgress = (modelName: string): ModelInstallation | undefined => {
    return (installations || []).find(inst => inst.modelName === modelName);
  };

  const filterModels = (models: TanukiModel[]) => {
    return models.filter(model => {
      const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSystemRecommendation = (model: TanukiModel) => {
    const ramFit = systemCapabilities.availableRam >= model.requirements.recommendedRam;
    const vramFit = !model.requirements.recommendedVram || 
                   (systemCapabilities.availableVram && systemCapabilities.availableVram >= model.requirements.recommendedVram);
    const diskFit = systemCapabilities.diskSpace >= model.requirements.diskSpace;

    if (ramFit && vramFit && diskFit) return { level: 'excellent', text: 'Excellent fit' };
    if (systemCapabilities.availableRam >= model.requirements.minRam && diskFit) return { level: 'good', text: 'Good fit' };
    return { level: 'poor', text: 'May struggle' };
  };

  const renderModelCard = (model: TanukiModel, showInstallButton: boolean = false) => {
    const installation = getInstallationProgress(model.name);
    const config = (configurations || []).find(c => c.modelName === model.name);
    const recommendation = getSystemRecommendation(model);

    return (
      <div key={model.name} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(model.category)}</span>
            <div>
              <h3 className="font-semibold text-lg">{model.displayName}</h3>
              <p className="text-sm text-muted-foreground">{getCategoryName(model.category)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {model.isInstalled && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Installed</span>
            )}
            {config?.isDefault && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Parameters</div>
            <div className="font-medium">{model.parameterCount}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Size</div>
            <div className="font-medium">{model.size.toFixed(1)} GB</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">RAM Required</div>
            <div className="font-medium">{model.requirements.minRam}-{model.requirements.recommendedRam} GB</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">System Fit</div>
            <div className={`font-medium text-xs ${
              recommendation.level === 'excellent' ? 'text-green-600' :
              recommendation.level === 'good' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {recommendation.text}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {model.capabilities.map(capability => (
            <span key={capability} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              {capability}
            </span>
          ))}
        </div>

        {installation && installation.status !== 'completed' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{installation.status === 'downloading' ? 'Downloading' : 'Installing'}</span>
              <span>{installation.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${installation.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {showInstallButton && !model.isInstalled && !installation && (
            <button
              onClick={() => onInstallModel(model.name)}
              className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            >
              Install Model
            </button>
          )}
          
          {model.isInstalled && (
            <>
              <button
                onClick={() => setSelectedModel(model)}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
              >
                Configure
              </button>
              
              {!config?.isDefault && (
                <button
                  onClick={() => onSetDefaultModel(model.name)}
                  className="px-3 py-2 bg-accent text-accent-foreground rounded text-sm hover:bg-accent/80 transition-colors"
                >
                  Set Default
                </button>
              )}
              
              <button
                onClick={() => onUninstallModel(model.name)}
                className="px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
              >
                Uninstall
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderConfigurationPanel = () => {
    if (!selectedModel) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">Select a model to configure</div>
        </div>
      );
    }

    const config = (configurations || []).find(c => c.modelName === selectedModel.name) || {
      modelName: selectedModel.name,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repeatPenalty: 1.1,
      contextLength: 4096,
      isDefault: false
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{getCategoryIcon(selectedModel.category)}</span>
          <div>
            <h2 className="text-xl font-semibold">{selectedModel.displayName}</h2>
            <p className="text-muted-foreground">{getCategoryName(selectedModel.category)}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Temperature</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => onConfigureModel(selectedModel.name, { temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative (0.0)</span>
              <span className="font-medium">{config.temperature}</span>
              <span>Creative (2.0)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Top P</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => onConfigureModel(selectedModel.name, { topP: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Focused (0.0)</span>
              <span className="font-medium">{config.topP}</span>
              <span>Diverse (1.0)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Context Length</label>
            <select
              value={config.contextLength}
              onChange={(e) => onConfigureModel(selectedModel.name, { contextLength: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-background border border-border rounded"
            >
              <option value={2048}>2,048 tokens</option>
              <option value={4096}>4,096 tokens</option>
              <option value={8192}>8,192 tokens</option>
              <option value={16384}>16,384 tokens</option>
              <option value={32768}>32,768 tokens</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">System Prompt (Optional)</label>
            <textarea
              value={config.systemPrompt || ''}
              onChange={(e) => onConfigureModel(selectedModel.name, { systemPrompt: e.target.value })}
              placeholder="Enter a system prompt to customize the model's behavior..."
              className="w-full px-3 py-2 bg-background border border-border rounded h-24 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={config.isDefault}
              onChange={(e) => {
                if (e.target.checked) {
                  onSetDefaultModel(selectedModel.name);
                }
              }}
              className="rounded"
            />
            <label htmlFor="isDefault" className="text-sm">Set as default model</label>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformancePanel = () => {
    const modelsWithPerformance = (installedModels || []).filter(model => model.performance);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">System Resources</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total RAM:</span>
                <span>{systemCapabilities.totalRam} GB</span>
              </div>
              <div className="flex justify-between">
                <span>Available RAM:</span>
                <span>{systemCapabilities.availableRam} GB</span>
              </div>
              {systemCapabilities.totalVram && (
                <div className="flex justify-between">
                  <span>GPU Memory:</span>
                  <span>{systemCapabilities.totalVram} GB</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CPU Cores:</span>
                <span>{systemCapabilities.cpuCores}</span>
              </div>
            </div>
          </div>
        </div>

        {modelsWithPerformance.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Model Performance</h3>
            {modelsWithPerformance.map(model => (
              <div key={model.name} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">{getCategoryIcon(model.category)}</span>
                  <div>
                    <h4 className="font-medium">{model.displayName}</h4>
                    <p className="text-sm text-muted-foreground">{model.parameterCount}</p>
                  </div>
                </div>
                
                {model.performance && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tokens/sec</div>
                      <div className="font-medium">{model.performance.tokensPerSecond.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Latency</div>
                      <div className="font-medium">{model.performance.averageLatency.toFixed(0)}ms</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Context</div>
                      <div className="font-medium">{model.performance.contextLength.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Score</div>
                      <div className="font-medium">{model.performance.benchmarkScore || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No performance data available</div>
            <div className="text-sm text-muted-foreground mt-2">Install and use models to see performance metrics</div>
          </div>
        )}
      </div>
    );
  };

  const categories = Array.from(new Set([...(installedModels || []), ...(availableModels || [])].map(m => m.category)));

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <div>
              <h1 className="text-2xl font-bold">TanukiMCP Apollo</h1>
              <p className="text-muted-foreground">Model Management Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'installed', label: 'Installed Models', count: (installedModels || []).length },
            { id: 'available', label: 'Available Models', count: (availableModels || []).length },
            { id: 'configuration', label: 'Configuration' },
            { id: 'performance', label: 'Performance' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {(activeTab === 'installed' || activeTab === 'available') && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {getCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Models Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                {filterModels(activeTab === 'installed' ? (installedModels || []) : (availableModels || [])).map(model =>
                  renderModelCard(model, activeTab === 'available')
                )}
              </div>
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {renderConfigurationPanel()}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {renderPerformancePanel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelManagementHub; 