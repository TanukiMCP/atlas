/**
 * TanukiMCP Atlas - Prompt Management Store
 * Zustand store for managing prompt UI state
 */
import { SystemPrompt, PromptManagerState, PromptSearchFilters, PromptValidationResult } from '../types/prompt-types';
interface PromptStore extends PromptManagerState {
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
export declare const usePromptStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PromptStore>, "setState"> & {
    setState<A extends string | {
        type: string;
    }>(partial: PromptStore | Partial<PromptStore> | ((state: PromptStore) => PromptStore | Partial<PromptStore>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export {};
//# sourceMappingURL=prompt-store.d.ts.map