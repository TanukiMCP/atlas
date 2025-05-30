import { useState, useEffect } from 'react';
import { ToolSettings } from '../components/settings/ToolSettings';

const DEFAULT_SETTINGS: ToolSettings = {
  approvalMode: 'auto',
  selectiveTools: [],
  showToolContext: true,
  visualDiffing: true,
  diffingAnimationSpeed: 'normal',
  clearThoughtReasoning: true
};

export function useToolSettings() {
  const [settings, setSettings] = useState<ToolSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    setIsLoading(true);
    const savedSettings = localStorage.getItem('tool_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved tool settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<ToolSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('tool_settings', JSON.stringify(updatedSettings));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('tool_settings', JSON.stringify(DEFAULT_SETTINGS));
  };

  const shouldApproveToolExecution = (toolName: string): boolean => {
    if (settings.approvalMode === 'auto') {
      return false; // No approval needed
    }
    
    if (settings.approvalMode === 'manual') {
      return true; // Always approve
    }
    
    // Selective mode - check if the tool is in the selectiveTools list
    return settings.selectiveTools.includes(toolName);
  };

  return {
    settings,
    isLoading,
    updateSettings,
    resetToDefaults,
    shouldApproveToolExecution
  };
} 