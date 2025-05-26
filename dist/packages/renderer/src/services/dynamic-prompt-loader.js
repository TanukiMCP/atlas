"use strict";
/**
 * TanukiMCP Atlas - Dynamic Prompt Loading Service
 * Provides runtime prompt loading for all LLM agents
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPromptLoader = void 0;
exports.loadSystemPrompt = loadSystemPrompt;
exports.replacePromptVariables = replacePromptVariables;
exports.getExecutablePrompt = getExecutablePrompt;
const prompt_registry_1 = require("./prompt-registry");
class DynamicPromptLoader {
    cache = new Map();
    cacheExpiry = new Map();
    CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    /**
     * Get the active prompt content for an LLM agent
     * Returns user-modified content if available, otherwise default content
     */
    async getPromptContent(promptId) {
        // Check cache first
        const cached = this.getCachedPrompt(promptId);
        if (cached) {
            return cached;
        }
        try {
            // Load from registry
            const content = await prompt_registry_1.promptRegistry.getActivePromptContent(promptId);
            if (content) {
                // Cache the result
                this.setCachedPrompt(promptId, content);
            }
            return content;
        }
        catch (error) {
            console.error(`Failed to load prompt ${promptId}:`, error);
            return null;
        }
    }
    /**
     * Invalidate cache for a specific prompt
     * Call this when a prompt is modified
     */
    invalidatePrompt(promptId) {
        this.cache.delete(promptId);
        this.cacheExpiry.delete(promptId);
    }
    /**
     * Clear all cached prompts
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
    /**
     * Preload commonly used prompts
     */
    async preloadPrompts(promptIds) {
        const promises = promptIds.map(id => this.getPromptContent(id));
        await Promise.all(promises);
    }
    getCachedPrompt(promptId) {
        const expiry = this.cacheExpiry.get(promptId);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(promptId);
            this.cacheExpiry.delete(promptId);
            return null;
        }
        return this.cache.get(promptId) || null;
    }
    setCachedPrompt(promptId, content) {
        this.cache.set(promptId, content);
        this.cacheExpiry.set(promptId, Date.now() + this.CACHE_TTL);
    }
}
// Export singleton instance
exports.dynamicPromptLoader = new DynamicPromptLoader();
/**
 * Utility function for LLM agents to load their system prompts
 * Usage: const prompt = await loadSystemPrompt('routing.complexity_assessor.v1');
 */
async function loadSystemPrompt(promptId) {
    const content = await exports.dynamicPromptLoader.getPromptContent(promptId);
    if (!content) {
        console.warn(`System prompt not found: ${promptId}. Using fallback.`);
        return `You are an AI assistant. Please help the user with their request.`;
    }
    return content;
}
/**
 * Template variable replacement utility
 * Replaces {{variable}} placeholders with actual values
 */
function replacePromptVariables(promptTemplate, variables) {
    let result = promptTemplate;
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        const replacement = typeof value === 'string' ? value : JSON.stringify(value);
        result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    }
    return result;
}
/**
 * High-level function for LLM agents to get ready-to-use prompts
 * Loads the prompt and replaces variables in one call
 */
async function getExecutablePrompt(promptId, variables = {}) {
    const template = await loadSystemPrompt(promptId);
    return replacePromptVariables(template, variables);
}
//# sourceMappingURL=dynamic-prompt-loader.js.map