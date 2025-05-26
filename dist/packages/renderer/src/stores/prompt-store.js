"use strict";
/**
 * TanukiMCP Atlas - Prompt Management Store
 * Zustand store for managing prompt UI state
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePromptStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const prompt_registry_1 = require("../services/prompt-registry");
const initialState = {
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
exports.usePromptStore = (0, zustand_1.create)()((0, middleware_1.devtools)((set, get) => ({
    ...initialState,
    initialize: async () => {
        set({ isLoading: true, error: null });
        try {
            const discovery = await prompt_registry_1.promptRegistry.initialize();
            const searchResults = await prompt_registry_1.promptRegistry.getPrompts();
            set({
                isLoading: false,
                registry: prompt_registry_1.promptRegistry,
                searchResults,
                error: null
            });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
        }
    },
    selectPrompt: (prompt) => {
        set({
            selectedPrompt: prompt,
            isEditing: false,
            hasUnsavedChanges: false
        });
    },
    updatePromptContent: (promptId, content) => {
        const { selectedPrompt } = get();
        if (selectedPrompt && selectedPrompt.id === promptId) {
            const originalContent = selectedPrompt.userModifiedContent || selectedPrompt.defaultContent;
            const hasChanges = content !== originalContent;
            set({
                hasUnsavedChanges: hasChanges
            });
        }
    },
    savePrompt: async (promptId, content) => {
        set({ isLoading: true, error: null });
        try {
            const updatedPrompt = await prompt_registry_1.promptRegistry.savePrompt(promptId, content);
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
            const searchResults = await prompt_registry_1.promptRegistry.getPrompts(searchFilters);
            set({ searchResults });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
        }
    }, resetPrompt: async (promptId) => {
        set({ isLoading: true, error: null });
        try {
            const updatedPrompt = await prompt_registry_1.promptRegistry.resetPrompt(promptId);
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
            const searchResults = await prompt_registry_1.promptRegistry.getPrompts(searchFilters);
            set({ searchResults });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
        }
    },
    validatePrompt: async (content) => {
        const result = await prompt_registry_1.promptRegistry.validatePrompt(content);
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
    searchPrompts: async (filters) => {
        set({ isLoading: true, error: null, searchFilters: filters });
        try {
            const searchResults = await prompt_registry_1.promptRegistry.getPrompts(filters);
            set({
                searchResults,
                isLoading: false
            });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
        }
    },
    exportPrompt: async (promptId) => {
        try {
            const exportData = await prompt_registry_1.promptRegistry.exportPrompt(promptId);
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `prompt-${promptId}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch (error) {
            set({ error: error.message });
        }
    }, importPrompt: async (file) => {
        try {
            const text = await file.text();
            const exportData = JSON.parse(text);
            const result = await prompt_registry_1.promptRegistry.importPrompt(exportData);
            if (result.success) {
                // Refresh search results
                const { searchFilters } = get();
                const searchResults = await prompt_registry_1.promptRegistry.getPrompts(searchFilters);
                set({ searchResults });
            }
            else {
                set({ error: `Import failed: ${result.errors.join(', ')}` });
            }
        }
        catch (error) {
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
                        await prompt_registry_1.promptRegistry.resetPrompt(prompt.id);
                    }
                }
            }
            // Refresh results
            const { searchFilters } = get();
            const newSearchResults = await prompt_registry_1.promptRegistry.getPrompts(searchFilters);
            set({
                searchResults: newSearchResults,
                selectedPrompt: null,
                hasUnsavedChanges: false,
                isLoading: false
            });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.message
            });
        }
    },
    exportAllModified: async () => {
        try {
            const { searchResults } = get();
            if (!searchResults)
                return;
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
        }
        catch (error) {
            set({ error: error.message });
        }
    }, importAllModified: async (file) => {
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
                    const result = await prompt_registry_1.promptRegistry.importPrompt(exportData);
                    if (result.success) {
                        successCount++;
                    }
                    else {
                        errorCount++;
                    }
                }
                catch {
                    errorCount++;
                }
            }
            // Refresh search results
            const { searchFilters } = get();
            const searchResults = await prompt_registry_1.promptRegistry.getPrompts(searchFilters);
            set({
                searchResults,
                error: errorCount > 0 ? `Imported ${successCount} prompts, ${errorCount} failed` : null
            });
        }
        catch (error) {
            set({ error: `Failed to import prompts: ${error.message}` });
        }
    },
    setEditingMode: (editing) => {
        set({ isEditing: editing });
    },
    setUnsavedChanges: (hasChanges) => {
        set({ hasUnsavedChanges: hasChanges });
    },
    clearError: () => {
        set({ error: null });
    }
}), {
    name: 'prompt-store'
}));
//# sourceMappingURL=prompt-store.js.map