/**
 * TanukiMCP Atlas - Prompt Registry and Discovery Service
 * Centralized management for all system prompts
 */
import { SystemPrompt, PromptDiscoveryResult, PromptValidationResult, PromptSearchFilters, PromptSearchResult, PromptExportData, PromptImportResult } from '../types/prompt-types';
declare class PromptRegistryService {
    private registry;
    private initialized;
    private storage;
    private readonly STORAGE_KEY;
    private readonly USER_MODIFICATIONS_KEY;
    private readonly BACKUP_KEY;
    /**
     * Initialize the prompt registry with default and discovered prompts
     */
    initialize(): Promise<PromptDiscoveryResult>;
    /**
     * Get all prompts with optional filtering
     */
    getPrompts(filters?: PromptSearchFilters): Promise<PromptSearchResult>; /**
     * Get a specific prompt by ID
     */
    getPrompt(id: string): Promise<SystemPrompt | null>;
    /**
     * Save a modified prompt
     */
    savePrompt(promptId: string, content: string): Promise<SystemPrompt>;
    /**
     * Reset a prompt to its default content
     */
    resetPrompt(promptId: string): Promise<SystemPrompt>;
    /**
     * Validate prompt content
     */
    validatePrompt(content: string): Promise<PromptValidationResult>; /**
     * Export a prompt to file
     */
    exportPrompt(promptId: string): Promise<PromptExportData>;
    /**
     * Import a prompt from exported data
     */
    importPrompt(exportData: PromptExportData): Promise<PromptImportResult>; /**
     * Get prompt content for runtime use (user-modified or default)
     */
    getActivePromptContent(promptId: string): Promise<string | null>;
    /**
     * Create a backup of prompt content
     */
    private createBackup;
    /**
     * Load default prompts from the application
     */
    private loadDefaultPrompts; /**
     * Helper methods for storage and utility functions
     */
    private createCategoriesIndex;
    private loadUserModifications;
    private saveUserModifications;
    private applyUserModifications;
    private loadBackups;
    private saveBackups;
    private calculateChecksum;
    private sortPrompts;
    private generateFacets;
    private createDiscoveryResult;
}
export declare const promptRegistry: PromptRegistryService;
export {};
//# sourceMappingURL=prompt-registry.d.ts.map