/**
 * TanukiMCP Atlas - Dynamic Prompt Loading Service
 * Provides runtime prompt loading for all LLM agents
 */

import { promptRegistry } from './prompt-registry';

class DynamicPromptLoader {
  private cache = new Map<string, string>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get the active prompt content for an LLM agent
   * Returns user-modified content if available, otherwise default content
   */
  async getPromptContent(promptId: string): Promise<string | null> {
    // Check cache first
    const cached = this.getCachedPrompt(promptId);
    if (cached) {
      return cached;
    }

    try {
      // Load from registry
      const content = await promptRegistry.getActivePromptContent(promptId);
      
      if (content) {
        // Cache the result
        this.setCachedPrompt(promptId, content);
      }
      
      return content;
    } catch (error) {
      console.error(`Failed to load prompt ${promptId}:`, error);
      return null;
    }
  }

  /**
   * Invalidate cache for a specific prompt
   * Call this when a prompt is modified
   */
  invalidatePrompt(promptId: string): void {
    this.cache.delete(promptId);
    this.cacheExpiry.delete(promptId);
  }

  /**
   * Clear all cached prompts
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Preload commonly used prompts
   */
  async preloadPrompts(promptIds: string[]): Promise<void> {
    const promises = promptIds.map(id => this.getPromptContent(id));
    await Promise.all(promises);
  }

  private getCachedPrompt(promptId: string): string | null {
    const expiry = this.cacheExpiry.get(promptId);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(promptId);
      this.cacheExpiry.delete(promptId);
      return null;
    }
    
    return this.cache.get(promptId) || null;
  }

  private setCachedPrompt(promptId: string, content: string): void {
    this.cache.set(promptId, content);
    this.cacheExpiry.set(promptId, Date.now() + this.CACHE_TTL);
  }
}

// Export singleton instance
export const dynamicPromptLoader = new DynamicPromptLoader();

/**
 * Utility function for LLM agents to load their system prompts
 * Usage: const prompt = await loadSystemPrompt('routing.complexity_assessor.v1');
 */
export async function loadSystemPrompt(promptId: string): Promise<string> {
  const content = await dynamicPromptLoader.getPromptContent(promptId);
  
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
export function replacePromptVariables(
  promptTemplate: string, 
  variables: Record<string, any>
): string {
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
export async function getExecutablePrompt(
  promptId: string, 
  variables: Record<string, any> = {}
): Promise<string> {
  const template = await loadSystemPrompt(promptId);
  return replacePromptVariables(template, variables);
}