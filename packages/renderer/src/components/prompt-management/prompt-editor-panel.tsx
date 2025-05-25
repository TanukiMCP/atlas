/**
 * TanukiMCP Atlas - Prompt Editor Panel
 * Monaco Editor for editing system prompts with validation
 */

import React, { useState, useEffect, useRef } from 'react';
import { usePromptStore } from '../../stores/prompt-store';

export const PromptEditorPanel: React.FC = () => {
  const {
    selectedPrompt,
    hasUnsavedChanges,
    isLoading,
    validationResults,
    savePrompt,
    resetPrompt,
    validatePrompt,
    updatePromptContent,
    exportPrompt,
    setEditingMode
  } = usePromptStore();

  const [currentContent, setCurrentContent] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when selected prompt changes
  useEffect(() => {
    if (selectedPrompt) {
      const content = selectedPrompt.userModifiedContent || selectedPrompt.defaultContent;
      setCurrentContent(content);
      setEditingMode(false);
    } else {
      setCurrentContent('');
      setEditingMode(false);
    }
  }, [selectedPrompt, setEditingMode]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentContent]);

  const handleContentChange = (value: string) => {
    setCurrentContent(value);
    if (selectedPrompt) {
      updatePromptContent(selectedPrompt.id, value);
      setEditingMode(true);
    }
  };

  const handleSave = async () => {
    if (!selectedPrompt) return;
    
    try {
      await savePrompt(selectedPrompt.id, currentContent);
      setEditingMode(false);
    } catch (error) {
      console.error('Failed to save prompt:', error);
    }
  };

  const handleReset = async () => {
    if (!selectedPrompt) return;
    
    if (window.confirm('Reset this prompt to its default content? All changes will be lost.')) {
      try {
        await resetPrompt(selectedPrompt.id);
        setEditingMode(false);
      } catch (error) {
        console.error('Failed to reset prompt:', error);
      }
    }
  };

  const handleValidate = async () => {
    if (currentContent.trim()) {
      setShowValidation(true);
      await validatePrompt(currentContent);
    }
  };

  const handleExport = async () => {
    if (selectedPrompt) {
      await exportPrompt(selectedPrompt.id);
    }
  };

  const validation = selectedPrompt ? validationResults[selectedPrompt.id] : null;

  if (!selectedPrompt) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <div className="text-lg font-medium mb-2">Select a Prompt</div>
          <div className="text-sm">
            Choose a prompt from the list to view and edit its content
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Editor Header */}
      <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-lg">{selectedPrompt.category.icon}</div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {selectedPrompt.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPrompt.agentModule} • {selectedPrompt.purpose}
              </p>
            </div>
            {selectedPrompt.isModified && (
              <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                Modified
              </div>
            )}
          </div>

          {/* Editor Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleValidate}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Validate
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Export
            </button>
            {selectedPrompt.isModified && (
              <button
                onClick={handleReset}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Validation Results */}
        {showValidation && validation && (
          <div className="mt-3">
            {validation.errors.length > 0 && (
              <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                  Validation Errors:
                </div>
                {validation.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 dark:text-red-400">
                    • {error.message}
                  </div>
                ))}
              </div>
            )}
            
            {validation.warnings.length > 0 && (
              <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                  Validation Warnings:
                </div>
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-600 dark:text-yellow-400">
                    • {warning.message}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Tokens: ~{validation.estimatedTokens}</span>
              <span>Complexity: {validation.complexity}</span>
              <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
                {validation.isValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>
          </div>
        )}
      </div>      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <textarea
          ref={textareaRef}
          value={currentContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter prompt content..."
          className="flex-1 w-full p-4 border-none resize-none focus:outline-none 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                     font-mono text-sm leading-relaxed"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Length: {currentContent.length} chars</span>
            <span>Lines: {currentContent.split('\n').length}</span>
            <span>Words: {currentContent.trim().split(/\s+/).filter(w => w).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Last modified: {selectedPrompt.lastModified.toLocaleDateString()}</span>
            {hasUnsavedChanges && (
              <span className="text-yellow-600 dark:text-yellow-400">• Unsaved changes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};