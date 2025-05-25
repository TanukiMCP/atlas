/**
 * TanukiMCP Atlas - LLM Prompts Settings Tab
 * Settings tab integration for prompt management overview
 */

import React, { useEffect } from 'react';
import { usePromptStore } from '../../stores/prompt-store';

interface LLMPromptsSettingsTabProps {
  onOpenFullInterface: () => void;
}

export const LLMPromptsSettingsTab: React.FC<LLMPromptsSettingsTabProps> = ({
  onOpenFullInterface
}) => {
  const {
    searchResults,
    isLoading,
    error,
    initialize,
    resetAllPrompts,
    exportAllModified
  } = usePromptStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const totalPrompts = searchResults?.totalCount || 0;
  const modifiedPrompts = searchResults?.prompts.filter(p => p.isModified).length || 0;
  const categories = searchResults?.facets.categories || [];

  const handleResetAll = async () => {
    if (window.confirm('Reset all modified prompts to their defaults? This cannot be undone.')) {
      await resetAllPrompts();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🧠 LLM System Prompts
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage system prompts that guide all LLM agents in TanukiMCP Atlas
          </p>
        </div>
        <button
          onClick={onOpenFullInterface}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Full Interface
        </button>
      </div>      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📊</div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPrompts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Prompts
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">✏️</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {modifiedPrompts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Modified Prompts
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📁</div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Category Overview */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Prompt Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {category.count} prompts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenFullInterface}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            📝 Edit Prompts
          </button>
          
          {modifiedPrompts > 0 && (
            <>
              <button
                onClick={exportAllModified}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                📤 Export Modified
              </button>
              <button
                onClick={handleResetAll}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                🔄 Reset All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          💡 About LLM Prompt Management
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          System prompts control how AI agents behave throughout TanukiMCP Atlas. 
          You can customize these prompts to better suit your needs, workflow, or preferences. 
          All changes are stored locally and can be reset to defaults at any time.
        </p>
      </div>
    </div>
  );
};