import React, { useState, useEffect } from 'react';
import { useLLMStore } from '../stores/llm-store';
import ToolSettings, { ToolSettings as ToolSettingsType } from './settings/ToolSettings';
import { toolContextService } from '../services/ToolContextService';

interface SettingsProps {
  onApiKeyChange?: (apiKey: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);

  const { checkHealth, isConnected } = useLLMStore();

  useEffect(() => {
    // Load existing API key on component mount
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      if (window.electronAPI?.invoke) {
        const savedKey = await window.electronAPI.invoke('settings:get', 'openrouter_api_key');
        if (savedKey) {
          setApiKey(savedKey);
        }
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setSaveStatus('error');
      return;
    }

    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // Save API key to secure storage
      if (window.electronAPI?.invoke) {
        await window.electronAPI.invoke('settings:set', 'openrouter_api_key', apiKey.trim());
        
        // Update the OpenRouter service with the new API key
        await window.electronAPI.invoke('openrouter:updateApiKey', apiKey.trim());
        
        // Test the connection
        await checkHealth();
        
        setSaveStatus('saved');
        onApiKeyChange?.(apiKey.trim());
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to save API key:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = async () => {
    try {
      if (window.electronAPI?.invoke) {
        await window.electronAPI.invoke('storage:remove', 'openrouter_api_key');
        await window.electronAPI.invoke('openrouter:updateApiKey', '');
        setApiKey('');
        setSaveStatus('idle');
        onApiKeyChange?.('');
      }
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      await checkHealth();
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved ✓';
      case 'error': return 'Error ✗';
      default: return 'Save API Key';
    }
  };

  const getSaveButtonColor = () => {
    switch (saveStatus) {
      case 'saved': return 'bg-green-600 hover:bg-green-700';
      case 'error': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };

  const handleToolSettingsChange = (newSettings: ToolSettingsType) => {
    toolContextService.updateSettings(newSettings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* API Key Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">OpenRouter API Configuration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your OpenRouter API key to enable AI model access. You can get a free API key at{' '}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="apiKey" className="block text-sm font-medium">
              API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <button
                onClick={handleSaveApiKey}
                disabled={isLoading || !apiKey.trim()}
                className={`px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getSaveButtonColor()}`}
              >
                {getSaveButtonText()}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isLoading || !apiKey.trim()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleClearApiKey}
              disabled={isLoading}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>

          {/* Connection Status */}
          <div className="mt-4 p-3 rounded-md bg-muted">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                Status: {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <p className="text-xs text-muted-foreground mt-1">
                ✓ OpenRouter service is connected and ready to use
              </p>
            )}
            {!isConnected && apiKey && (
              <p className="text-xs text-muted-foreground mt-1">
                ⚠️ Unable to connect with current API key. Please check your key and try again.
              </p>
            )}
            {!apiKey && (
              <p className="text-xs text-muted-foreground mt-1">
                ℹ️ Please enter your OpenRouter API key to connect
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tool Settings */}
      <ToolSettings onSettingsChange={handleToolSettingsChange} />

      {/* Information Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-2">About OpenRouter</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            OpenRouter provides access to various AI models including free tier options. 
            With a free account, you get:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Access to free models like Llama 3.1 8B and Mistral 7B</li>
            <li>Rate-limited requests (typically 10-20 requests per minute)</li>
            <li>Daily token limits (varies by model)</li>
            <li>No credit card required for free tier</li>
          </ul>
          <p className="mt-3">
            Visit{' '}
            <a 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              openrouter.ai
            </a>
            {' '}to create a free account and get your API key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 