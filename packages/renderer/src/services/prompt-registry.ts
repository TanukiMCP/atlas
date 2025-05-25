/**
 * TanukiMCP Atlas - Prompt Registry and Discovery Service
 * Centralized management for all system prompts
 */

import {
  SystemPrompt,
  PromptCategory,
  PromptRegistry,
  PromptDiscoveryResult,
  PromptValidationResult,
  PromptSearchFilters,
  PromptSearchResult,
  PromptExportData,
  PromptImportResult,
  PromptBackup,
  DEFAULT_PROMPT_CATEGORIES
} from '../types/prompt-types';

class PromptRegistryService {
  private registry: PromptRegistry | null = null;
  private initialized = false;
  private storage = window.localStorage;
  private readonly STORAGE_KEY = 'tanuki-prompt-registry';
  private readonly USER_MODIFICATIONS_KEY = 'tanuki-prompt-modifications';
  private readonly BACKUP_KEY = 'tanuki-prompt-backups';

  /**
   * Initialize the prompt registry with default and discovered prompts
   */
  async initialize(): Promise<PromptDiscoveryResult> {
    if (this.initialized && this.registry) {
      return this.createDiscoveryResult();
    }

    try {
      // Load default prompts
      const defaultPrompts = await this.loadDefaultPrompts();
      
      // Load user modifications
      const userModifications = this.loadUserModifications();
      
      // Create registry
      this.registry = {
        prompts: defaultPrompts,
        categories: this.createCategoriesIndex(),
        userModifications,
        lastUpdated: new Date(),
        version: '1.0.0'
      };

      // Apply user modifications
      this.applyUserModifications();
      
      this.initialized = true;
      
      return this.createDiscoveryResult();
    } catch (error) {
      console.error('Failed to initialize prompt registry:', error);
      throw new Error(`Prompt registry initialization failed: ${error.message}`);
    }
  }

  /**
   * Get all prompts with optional filtering
   */
  async getPrompts(filters?: PromptSearchFilters): Promise<PromptSearchResult> {
    if (!this.registry) {
      await this.initialize();
    }

    const allPrompts = Object.values(this.registry!.prompts);
    
    if (!filters) {
      return {
        prompts: allPrompts,
        totalCount: allPrompts.length,
        facets: this.generateFacets(allPrompts)
      };
    }

    let filteredPrompts = allPrompts;

    // Apply text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.name.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.purpose.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        filters.categories!.includes(prompt.category.id)
      );
    }

    // Apply modified only filter
    if (filters.modifiedOnly) {
      filteredPrompts = filteredPrompts.filter(prompt => prompt.isModified);
    }

    // Apply complexity filter
    if (filters.complexity && filters.complexity.length > 0) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        filters.complexity!.includes(prompt.complexity)
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        filters.tags!.some(tag => prompt.tags.includes(tag))
      );
    }

    // Apply agent modules filter
    if (filters.agentModules && filters.agentModules.length > 0) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        filters.agentModules!.includes(prompt.agentModule)
      );
    }

    // Apply sorting
    this.sortPrompts(filteredPrompts, filters.sortBy, filters.sortOrder);

    return {
      prompts: filteredPrompts,
      totalCount: filteredPrompts.length,
      facets: this.generateFacets(allPrompts)
    };
  }  /**
   * Get a specific prompt by ID
   */
  async getPrompt(id: string): Promise<SystemPrompt | null> {
    if (!this.registry) {
      await this.initialize();
    }
    return this.registry!.prompts[id] || null;
  }

  /**
   * Save a modified prompt
   */
  async savePrompt(promptId: string, content: string): Promise<SystemPrompt> {
    if (!this.registry) {
      throw new Error('Registry not initialized');
    }

    const prompt = this.registry.prompts[promptId];
    if (!prompt) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    // Create backup before modifying
    await this.createBackup(promptId, prompt.userModifiedContent || prompt.defaultContent, 'manual');

    // Update prompt
    prompt.userModifiedContent = content;
    prompt.isModified = content !== prompt.defaultContent;
    prompt.lastModified = new Date();

    // Save to storage
    this.saveUserModifications();

    return prompt;
  }

  /**
   * Reset a prompt to its default content
   */
  async resetPrompt(promptId: string): Promise<SystemPrompt> {
    if (!this.registry) {
      throw new Error('Registry not initialized');
    }

    const prompt = this.registry.prompts[promptId];
    if (!prompt) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    // Create backup before resetting
    if (prompt.userModifiedContent) {
      await this.createBackup(promptId, prompt.userModifiedContent, 'reset');
    }

    // Reset prompt
    delete prompt.userModifiedContent;
    prompt.isModified = false;
    prompt.lastModified = new Date();

    // Update storage
    delete this.registry.userModifications[promptId];
    this.saveUserModifications();

    return prompt;
  }

  /**
   * Validate prompt content
   */
  async validatePrompt(content: string): Promise<PromptValidationResult> {
    const errors = [];
    const warnings = [];
    
    // Basic validation
    if (!content.trim()) {
      errors.push({
        type: 'structure' as const,
        message: 'Prompt content cannot be empty',
        suggestion: 'Add meaningful prompt content'
      });
    }

    // Length validation
    const estimatedTokens = Math.ceil(content.length / 4); // Rough estimate
    if (estimatedTokens > 4000) {
      warnings.push({
        type: 'performance' as const,
        message: 'Prompt is very long and may impact performance',
        suggestion: 'Consider breaking into smaller, focused prompts'
      });
    }

    // Variable validation
    const variableMatches = content.match(/\{\{[^}]+\}\}/g) || [];
    const variables = variableMatches.map(match => match.slice(2, -2).trim());
    
    for (const variable of variables) {
      if (!variable.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        errors.push({
          type: 'variables' as const,
          message: `Invalid variable name: ${variable}`,
          suggestion: 'Use valid variable names (letters, numbers, underscore)'
        });
      }
    }

    // Complexity assessment
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (estimatedTokens > 500) complexity = 'medium';
    if (estimatedTokens > 1500) complexity = 'high';

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedTokens,
      complexity
    };
  }  /**
   * Export a prompt to file
   */
  async exportPrompt(promptId: string): Promise<PromptExportData> {
    const prompt = await this.getPrompt(promptId);
    if (!prompt) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const exportData: PromptExportData = {
      prompt,
      exportedAt: new Date(),
      exportedBy: 'TanukiMCP Atlas',
      version: '1.0.0',
      checksum: this.calculateChecksum(JSON.stringify(prompt))
    };

    return exportData;
  }

  /**
   * Import a prompt from exported data
   */
  async importPrompt(exportData: PromptExportData): Promise<PromptImportResult> {
    try {
      if (!this.registry) {
        await this.initialize();
      }

      const { prompt } = exportData;
      const existingPrompt = this.registry!.prompts[prompt.id];
      
      const result: PromptImportResult = {
        success: false,
        promptId: prompt.id,
        errors: [],
        warnings: [],
        conflicts: []
      };

      // Validate checksum
      const calculatedChecksum = this.calculateChecksum(JSON.stringify(prompt));
      if (calculatedChecksum !== exportData.checksum) {
        result.errors.push('Checksum validation failed - file may be corrupted');
        return result;
      }

      // Check for conflicts
      if (existingPrompt) {
        if (existingPrompt.version !== prompt.version) {
          result.conflicts.push({
            type: 'version',
            description: 'Version mismatch',
            currentValue: existingPrompt.version,
            incomingValue: prompt.version,
            resolution: 'overwrite'
          });
        }
      }

      // Create backup of existing prompt
      if (existingPrompt && existingPrompt.isModified) {
        await this.createBackup(
          prompt.id,
          existingPrompt.userModifiedContent || existingPrompt.defaultContent,
          'import'
        );
      }

      // Import the prompt
      this.registry!.prompts[prompt.id] = { ...prompt };
      
      // If imported prompt has user modifications, save them
      if (prompt.userModifiedContent) {
        this.registry!.userModifications[prompt.id] = prompt.userModifiedContent;
        this.saveUserModifications();
      }

      result.success = true;
      return result;
    } catch (error) {
      return {
        success: false,
        promptId: exportData.prompt.id,
        errors: [error.message],
        warnings: [],
        conflicts: []
      };
    }
  }  /**
   * Get prompt content for runtime use (user-modified or default)
   */
  async getActivePromptContent(promptId: string): Promise<string | null> {
    const prompt = await this.getPrompt(promptId);
    if (!prompt) {
      return null;
    }
    return prompt.userModifiedContent || prompt.defaultContent;
  }

  /**
   * Create a backup of prompt content
   */
  private async createBackup(promptId: string, content: string, reason: PromptBackup['reason']): Promise<void> {
    const backup: PromptBackup = {
      id: `${promptId}-${Date.now()}`,
      promptId,
      content,
      timestamp: new Date(),
      reason,
      metadata: {}
    };

    // Load existing backups
    const backups = this.loadBackups();
    backups.push(backup);

    // Keep only last 10 backups per prompt
    const promptBackups = backups.filter(b => b.promptId === promptId);
    if (promptBackups.length > 10) {
      const toRemove = promptBackups.slice(0, promptBackups.length - 10);
      const filteredBackups = backups.filter(b => !toRemove.includes(b));
      this.saveBackups(filteredBackups);
    } else {
      this.saveBackups(backups);
    }
  }

  /**
   * Load default prompts from the application
   */
  private async loadDefaultPrompts(): Promise<Record<string, SystemPrompt>> {
    // Import default prompts from configuration
    const { DEFAULT_SYSTEM_PROMPTS } = await import('../config/default-prompts');
    return DEFAULT_SYSTEM_PROMPTS;
  }  /**
   * Helper methods for storage and utility functions
   */
  private createCategoriesIndex(): Record<string, PromptCategory> {
    const index: Record<string, PromptCategory> = {};
    for (const category of DEFAULT_PROMPT_CATEGORIES) {
      index[category.id] = category;
    }
    return index;
  }

  private loadUserModifications(): Record<string, string> {
    try {
      const stored = this.storage.getItem(this.USER_MODIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveUserModifications(): void {
    if (this.registry) {
      this.storage.setItem(
        this.USER_MODIFICATIONS_KEY,
        JSON.stringify(this.registry.userModifications)
      );
    }
  }

  private applyUserModifications(): void {
    if (!this.registry) return;

    for (const [promptId, content] of Object.entries(this.registry.userModifications)) {
      const prompt = this.registry.prompts[promptId];
      if (prompt) {
        prompt.userModifiedContent = content;
        prompt.isModified = content !== prompt.defaultContent;
      }
    }
  }

  private loadBackups(): PromptBackup[] {
    try {
      const stored = this.storage.getItem(this.BACKUP_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveBackups(backups: PromptBackup[]): void {
    this.storage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
  }

  private calculateChecksum(data: string): string {
    // Simple hash for integrity checking
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }  private sortPrompts(prompts: SystemPrompt[], sortBy?: string, sortOrder?: string): void {
    if (!sortBy) return;

    const ascending = sortOrder === 'asc';
    
    prompts.sort((a, b) => {
      let result = 0;
      
      switch (sortBy) {
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'category':
          result = a.category.name.localeCompare(b.category.name);
          break;
        case 'lastModified':
          result = a.lastModified.getTime() - b.lastModified.getTime();
          break;
        case 'complexity':
          const complexityOrder = { low: 1, medium: 2, high: 3 };
          result = complexityOrder[a.complexity] - complexityOrder[b.complexity];
          break;
        default:
          result = 0;
      }
      
      return ascending ? result : -result;
    });
  }

  private generateFacets(prompts: SystemPrompt[]): PromptSearchResult['facets'] {
    const categories = new Map<string, { id: string; name: string; count: number }>();
    const tags = new Map<string, number>();
    const agentModules = new Map<string, number>();
    const complexity = new Map<string, number>();

    for (const prompt of prompts) {
      // Categories
      const categoryId = prompt.category.id;
      if (!categories.has(categoryId)) {
        categories.set(categoryId, { id: categoryId, name: prompt.category.name, count: 0 });
      }
      categories.get(categoryId)!.count++;

      // Tags
      for (const tag of prompt.tags) {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      }

      // Agent modules
      agentModules.set(prompt.agentModule, (agentModules.get(prompt.agentModule) || 0) + 1);

      // Complexity
      complexity.set(prompt.complexity, (complexity.get(prompt.complexity) || 0) + 1);
    }

    return {
      categories: Array.from(categories.values()),
      tags: Array.from(tags.entries()).map(([tag, count]) => ({ tag, count })),
      agentModules: Array.from(agentModules.entries()).map(([module, count]) => ({ module, count })),
      complexity: Array.from(complexity.entries()).map(([level, count]) => ({ level, count }))
    };
  }

  private createDiscoveryResult(): PromptDiscoveryResult {
    if (!this.registry) {
      throw new Error('Registry not initialized');
    }

    const prompts = Object.values(this.registry.prompts);
    return {
      prompts,
      categories: Object.values(this.registry.categories),
      totalCount: prompts.length,
      modifiedCount: prompts.filter(p => p.isModified).length,
      errorCount: 0
    };
  }
}

// Export singleton instance
export const promptRegistry = new PromptRegistryService();