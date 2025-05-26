/**
 * TanukiMCP Atlas - Dynamic Prompt Loading Service
 * Provides runtime prompt loading for all LLM agents
 */
declare class DynamicPromptLoader {
    private cache;
    private cacheExpiry;
    private readonly CACHE_TTL;
    /**
     * Get the active prompt content for an LLM agent
     * Returns user-modified content if available, otherwise default content
     */
    getPromptContent(promptId: string): Promise<string | null>;
    /**
     * Invalidate cache for a specific prompt
     * Call this when a prompt is modified
     */
    invalidatePrompt(promptId: string): void;
    /**
     * Clear all cached prompts
     */
    clearCache(): void;
    /**
     * Preload commonly used prompts
     */
    preloadPrompts(promptIds: string[]): Promise<void>;
    private getCachedPrompt;
    private setCachedPrompt;
}
export declare const dynamicPromptLoader: DynamicPromptLoader;
/**
 * Utility function for LLM agents to load their system prompts
 * Usage: const prompt = await loadSystemPrompt('routing.complexity_assessor.v1');
 */
export declare function loadSystemPrompt(promptId: string): Promise<string>;
/**
 * Template variable replacement utility
 * Replaces {{variable}} placeholders with actual values
 */
export declare function replacePromptVariables(promptTemplate: string, variables: Record<string, any>): string;
/**
 * High-level function for LLM agents to get ready-to-use prompts
 * Loads the prompt and replaces variables in one call
 */
export declare function getExecutablePrompt(promptId: string, variables?: Record<string, any>): Promise<string>;
export {};
//# sourceMappingURL=dynamic-prompt-loader.d.ts.map