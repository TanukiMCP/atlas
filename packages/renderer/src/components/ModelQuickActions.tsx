/**
 * ModelQuickActions - Header component for quick model management
 * Part of TanukiMCP Apollo system
 */

import React, { useState, useRef, useEffect } from 'react';
import { ModelQuickActionsProps, TanukiModel } from '../types';

const ModelQuickActions: React.FC<ModelQuickActionsProps> = ({
  currentModel,
  availableModels,
  isConnected,
  onModelSwitch,
  onOpenModelHub
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredModels = availableModels.filter(model =>
    model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isDropdownOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredModels.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredModels[selectedIndex]) {
          handleModelSelect(filteredModels[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSearchTerm('');
        setSelectedIndex(0);
        break;
    }
  };

  const handleModelSelect = (model: TanukiModel) => {
    if (model.isInstalled) {
      onModelSwitch(model.name);
      setIsDropdownOpen(false);
      setSearchTerm('');
      setSelectedIndex(0);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tanukimcp-apollo': return '☀️'; // Apollo - sun god
      case 'tanukimcp-athena': return '🦉'; // Athena - owl wisdom
      case 'tanukimcp-hermes': return '⚡'; // Hermes - messenger
      case 'tanukimcp-artemis': return '🏹'; // Artemis - hunter
      case 'tanukimcp-hephaestus': return '🔨'; // Hephaestus - craftsman
      case 'tanukimcp-dionysus': return '🍇'; // Dionysus - creativity
      default: return '🤖';
    }
  };

  const getStatusColor = () => {
    if (!isConnected) return 'text-destructive';
    if (currentModel) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (currentModel) return currentModel.displayName || currentModel.name;
    return 'No model selected';
  };

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      {/* Current Model Status */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={getStatusColor()}>
          {getStatusText()}
        </span>
      </div>

      {/* Model Switcher Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={!isConnected}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            isConnected
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onKeyDown={handleKeyDown}
        >
          <span className="flex items-center gap-1">
            {currentModel && getCategoryIcon(currentModel.category)}
            Switch Model
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-border">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Models List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No models found
                </div>
              ) : (
                filteredModels.map((model, index) => (
                  <button
                    key={model.name}
                    onClick={() => handleModelSelect(model)}
                    disabled={!model.isInstalled}
                    className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                      index === selectedIndex ? 'bg-accent' : ''
                    } ${!model.isInstalled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getCategoryIcon(model.category)}</span>
                        <div>
                          <div className="font-medium text-sm">{model.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {model.parameterCount} • {model.size.toFixed(1)}GB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {model.isInstalled ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Installed
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            Not Installed
                          </span>
                        )}
                        {currentModel?.name === model.name && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-border bg-muted/50">
              <button
                onClick={() => {
                  onOpenModelHub();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
              >
                Open Model Management Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <button
        onClick={onOpenModelHub}
        disabled={!isConnected}
        className={`p-2 rounded transition-colors ${
          isConnected
            ? 'hover:bg-accent text-muted-foreground hover:text-foreground'
            : 'text-muted-foreground cursor-not-allowed'
        }`}
        title="Model Management Hub"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
};

export default ModelQuickActions; 