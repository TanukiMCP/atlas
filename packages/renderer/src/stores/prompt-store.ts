/**
 * TanukiMCP Atlas - Prompt Management Store
 * Zustand store for managing prompt UI state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  SystemPrompt,
  PromptManagerState,
  PromptSearchFilters,
  PromptSearchResult,
  PromptValidationResult,
  PromptBackup
} from '../types/prompt-types';
import { promptRegistry } from '../services/prompt-registry';

interface PromptStore extends PromptManagerState {
  // Actions
  initialize: () => Promise<void>;
  selectPrompt: (prompt: SystemPrompt | null) => void;
  updatePromptContent: (promptId: string, content: string) => void;
  savePrompt: (promptId: string, content: string) => Promise<void>;
  resetPrompt: (promptId: string) => Promise<void>;
  validatePrompt: (content: string) => Promise<PromptValidationResult>;
  searchPrompts: (filters: PromptSearchFilters) => Promise<void>;
  exportPrompt: (promptId: string) => Promise<void>;
  importPrompt: (file: File) => Promise<void>;
  resetAllPrompts: () => Promise<void>;
  exportAllModified: () => Promise<void>;
  importAllModified: (file: File) => Promise<void>;
  setEditingMode: (editing: boolean) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  clearError: () => void;
}

const initialState: PromptManagerState = {
  isLoading: false,
  error: null,
  registry: null,
  selectedPrompt: null,
  searchFilters: {},
  searchResults: null,
  validationResults: {},
  usageStatistics: {},
  isEditing: false,
  hasUnsavedChanges: false,
  backupHistory: []
};

export const usePromptStore = create<PromptStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const discovery = await promptRegistry.initialize();
          const searchResults = await promptRegistry.getPrompts();
          
          set({
            isLoading: false,
            registry: promptRegistry,
            searchResults,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
        }
      },

      selectPrompt: (prompt: SystemPrompt | null) => {
        set({ 
          selectedPrompt: prompt,
          isEditing: false,
          hasUnsavedChanges: false
        });
      },

      updatePromptContent: (promptId: string, content: string) => {
        const { selectedPrompt } = get();
        if (selectedPrompt && selectedPrompt.id === promptId) {
          const originalContent = selectedPrompt.userModifiedContent || selectedPrompt.defaultContent;
          const hasChanges = content !== originalContent;
          
          set({
            hasUnsavedChanges: hasChanges
          });
        }
      },

      savePrompt: async (promptId: string, content: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPrompt = await promptRegistry.savePrompt(promptId, content);
          const { selectedPrompt } = get();
          
          if (selectedPrompt && selectedPrompt.id === promptId) {
            set({
              selectedPrompt: updatedPrompt,
              hasUnsavedChanges: false,
              isLoading: false
            });
          }

          // Refresh search results
          const { searchFilters } = get();
          const searchResults = await promptRegistry.getPrompts(searchFilters);
          set({ searchResults });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
        }
      },      resetPrompt: async (promptId: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPrompt = await promptRegistry.resetPrompt(promptId);
          const { selectedPrompt } = get();
          
          if (selectedPrompt && selectedPrompt.id === promptId) {
            set({
              selectedPrompt: updatedPrompt,
              hasUnsavedChanges: false,
              isLoading: false
            });
          }

          // Refresh search results
          const { searchFilters } = get();
          const searchResults = await promptRegistry.getPrompts(searchFilters);
          set({ searchResults });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
        }
      },

      validatePrompt: async (content: string) => {
        const result = await promptRegistry.validatePrompt(content);
        const { selectedPrompt, validationResults } = get();
        
        if (selectedPrompt) {
          set({
            validationResults: {
              ...validationResults,
              [selectedPrompt.id]: result
            }
          });
        }
        
        return result;
      },

      searchPrompts: async (filters: PromptSearchFilters) => {
        set({ isLoading: true, error: null, searchFilters: filters });
        try {
          const searchResults = await promptRegistry.getPrompts(filters);
          set({
            searchResults,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
        }
      },

      exportPrompt: async (promptId: string) => {
        try {
          const exportData = await promptRegistry.exportPrompt(promptId);
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `prompt-${promptId}.json`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          set({ error: error.message });
        }
      },      importPrompt: async (file: File) => {
        try {
          const text = await file.text();
          const exportData = JSON.parse(text);
          const result = await promptRegistry.importPrompt(exportData);
          
          if (result.success) {
            // Refresh search results
            const { searchFilters } = get();
            const searchResults = await promptRegistry.getPrompts(searchFilters);
            set({ searchResults });
          } else {
            set({ error: `Import failed: ${result.errors.join(', ')}` });
          }
        } catch (error) {
          set({ error: `Failed to import prompt: ${error.message}` });
        }
      },

      resetAllPrompts: async () => {
        set({ isLoading: true, error: null });
        try {
          // This would reset all modified prompts
          // Implementation would depend on registry capabilities
          const { searchResults } = get();
          if (searchResults) {
            for (const prompt of searchResults.prompts) {
              if (prompt.isModified) {
                await promptRegistry.resetPrompt(prompt.id);
              }
            }
          }
          
          // Refresh results
          const { searchFilters } = get();
          const newSearchResults = await promptRegistry.getPrompts(searchFilters);
          set({
            searchResults: newSearchResults,
            selectedPrompt: null,
            hasUnsavedChanges: false,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message
          });
        }
      },

      exportAllModified: async () => {
        try {
          const { searchResults } = get();
          if (!searchResults) return;
          
          const modifiedPrompts = searchResults.prompts.filter(p => p.isModified);
          const exportData = {
            prompts: modifiedPrompts,
            exportedAt: new Date(),
            version: '1.0.0'
          };
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `all-modified-prompts-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          set({ error: error.message });
        }
      },      importAllModified: async (file: File) => {
        try {
          const text = await file.text();
          const importData = JSON.parse(text);
          
          if (!importData.prompts || !Array.isArray(importData.prompts)) {
            throw new Error('Invalid import file format');
          }
          
          let successCount = 0;
          let errorCount = 0;
          
          for (const prompt of importData.prompts) {
            try {
              const exportData = {
                prompt,
                exportedAt: new Date(importData.exportedAt),
                exportedBy: 'Import',
                version: importData.version,
                checksum: '' // Would be calculated
              };
              
              const result = await promptRegistry.importPrompt(exportData);
              if (result.success) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch {
              errorCount++;
            }
          }
          
          // Refresh search results
          const { searchFilters } = get();
          const searchResults = await promptRegistry.getPrompts(searchFilters);
          set({ 
            searchResults,
            error: errorCount > 0 ? `Imported ${successCount} prompts, ${errorCount} failed` : null
          });
        } catch (error) {
          set({ error: `Failed to import prompts: ${error.message}` });
        }
      },

      setEditingMode: (editing: boolean) => {
        set({ isEditing: editing });
      },

      setUnsavedChanges: (hasChanges: boolean) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'prompt-store'
    }
  )
);