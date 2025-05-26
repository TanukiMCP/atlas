"use strict";
/**
 * TanukiMCP Atlas - Prompt Registry and Discovery Service
 * Centralized management for all system prompts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptRegistry = void 0;
const prompt_types_1 = require("../types/prompt-types");
class PromptRegistryService {
    registry = null;
    initialized = false;
    storage = window.localStorage;
    STORAGE_KEY = 'tanuki-prompt-registry';
    USER_MODIFICATIONS_KEY = 'tanuki-prompt-modifications';
    BACKUP_KEY = 'tanuki-prompt-backups';
    /**
     * Initialize the prompt registry with default and discovered prompts
     */
    async initialize() {
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
        }
        catch (error) {
            console.error('Failed to initialize prompt registry:', error);
            throw new Error(`Prompt registry initialization failed: ${error.message}`);
        }
    }
    /**
     * Get all prompts with optional filtering
     */
    async getPrompts(filters) {
        if (!this.registry) {
            await this.initialize();
        }
        const allPrompts = Object.values(this.registry.prompts);
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
            filteredPrompts = filteredPrompts.filter(prompt => prompt.name.toLowerCase().includes(query) ||
                prompt.description.toLowerCase().includes(query) ||
                prompt.purpose.toLowerCase().includes(query) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(query)));
        }
        // Apply category filter
        if (filters.categories && filters.categories.length > 0) {
            filteredPrompts = filteredPrompts.filter(prompt => filters.categories.includes(prompt.category.id));
        }
        // Apply modified only filter
        if (filters.modifiedOnly) {
            filteredPrompts = filteredPrompts.filter(prompt => prompt.isModified);
        }
        // Apply complexity filter
        if (filters.complexity && filters.complexity.length > 0) {
            filteredPrompts = filteredPrompts.filter(prompt => filters.complexity.includes(prompt.complexity));
        }
        // Apply tags filter
        if (filters.tags && filters.tags.length > 0) {
            filteredPrompts = filteredPrompts.filter(prompt => filters.tags.some(tag => prompt.tags.includes(tag)));
        }
        // Apply agent modules filter
        if (filters.agentModules && filters.agentModules.length > 0) {
            filteredPrompts = filteredPrompts.filter(prompt => filters.agentModules.includes(prompt.agentModule));
        }
        // Apply sorting
        this.sortPrompts(filteredPrompts, filters.sortBy, filters.sortOrder);
        return {
            prompts: filteredPrompts,
            totalCount: filteredPrompts.length,
            facets: this.generateFacets(allPrompts)
        };
    } /**
     * Get a specific prompt by ID
     */
    async getPrompt(id) {
        if (!this.registry) {
            await this.initialize();
        }
        return this.registry.prompts[id] || null;
    }
    /**
     * Save a modified prompt
     */
    async savePrompt(promptId, content) {
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
    async resetPrompt(promptId) {
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
    async validatePrompt(content) {
        const errors = [];
        const warnings = [];
        // Basic validation
        if (!content.trim()) {
            errors.push({
                type: 'structure',
                message: 'Prompt content cannot be empty',
                suggestion: 'Add meaningful prompt content'
            });
        }
        // Length validation
        const estimatedTokens = Math.ceil(content.length / 4); // Rough estimate
        if (estimatedTokens > 4000) {
            warnings.push({
                type: 'performance',
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
                    type: 'variables',
                    message: `Invalid variable name: ${variable}`,
                    suggestion: 'Use valid variable names (letters, numbers, underscore)'
                });
            }
        }
        // Complexity assessment
        let complexity = 'low';
        if (estimatedTokens > 500)
            complexity = 'medium';
        if (estimatedTokens > 1500)
            complexity = 'high';
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            estimatedTokens,
            complexity
        };
    } /**
     * Export a prompt to file
     */
    async exportPrompt(promptId) {
        const prompt = await this.getPrompt(promptId);
        if (!prompt) {
            throw new Error(`Prompt not found: ${promptId}`);
        }
        const exportData = {
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
    async importPrompt(exportData) {
        try {
            if (!this.registry) {
                await this.initialize();
            }
            const { prompt } = exportData;
            const existingPrompt = this.registry.prompts[prompt.id];
            const result = {
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
                await this.createBackup(prompt.id, existingPrompt.userModifiedContent || existingPrompt.defaultContent, 'import');
            }
            // Import the prompt
            this.registry.prompts[prompt.id] = { ...prompt };
            // If imported prompt has user modifications, save them
            if (prompt.userModifiedContent) {
                this.registry.userModifications[prompt.id] = prompt.userModifiedContent;
                this.saveUserModifications();
            }
            result.success = true;
            return result;
        }
        catch (error) {
            return {
                success: false,
                promptId: exportData.prompt.id,
                errors: [error.message],
                warnings: [],
                conflicts: []
            };
        }
    } /**
     * Get prompt content for runtime use (user-modified or default)
     */
    async getActivePromptContent(promptId) {
        const prompt = await this.getPrompt(promptId);
        if (!prompt) {
            return null;
        }
        return prompt.userModifiedContent || prompt.defaultContent;
    }
    /**
     * Create a backup of prompt content
     */
    async createBackup(promptId, content, reason) {
        const backup = {
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
        }
        else {
            this.saveBackups(backups);
        }
    }
    /**
     * Load default prompts from the application
     */
    async loadDefaultPrompts() {
        // Import default prompts from configuration
        const { DEFAULT_SYSTEM_PROMPTS } = await Promise.resolve().then(() => __importStar(require('../config/default-prompts')));
        return DEFAULT_SYSTEM_PROMPTS;
    } /**
     * Helper methods for storage and utility functions
     */
    createCategoriesIndex() {
        const index = {};
        for (const category of prompt_types_1.DEFAULT_PROMPT_CATEGORIES) {
            index[category.id] = category;
        }
        return index;
    }
    loadUserModifications() {
        try {
            const stored = this.storage.getItem(this.USER_MODIFICATIONS_KEY);
            return stored ? JSON.parse(stored) : {};
        }
        catch {
            return {};
        }
    }
    saveUserModifications() {
        if (this.registry) {
            this.storage.setItem(this.USER_MODIFICATIONS_KEY, JSON.stringify(this.registry.userModifications));
        }
    }
    applyUserModifications() {
        if (!this.registry)
            return;
        for (const [promptId, content] of Object.entries(this.registry.userModifications)) {
            const prompt = this.registry.prompts[promptId];
            if (prompt) {
                prompt.userModifiedContent = content;
                prompt.isModified = content !== prompt.defaultContent;
            }
        }
    }
    loadBackups() {
        try {
            const stored = this.storage.getItem(this.BACKUP_KEY);
            return stored ? JSON.parse(stored) : [];
        }
        catch {
            return [];
        }
    }
    saveBackups(backups) {
        this.storage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
    }
    calculateChecksum(data) {
        // Simple hash for integrity checking
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    sortPrompts(prompts, sortBy, sortOrder) {
        if (!sortBy)
            return;
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
    generateFacets(prompts) {
        const categories = new Map();
        const tags = new Map();
        const agentModules = new Map();
        const complexity = new Map();
        for (const prompt of prompts) {
            // Categories
            const categoryId = prompt.category.id;
            if (!categories.has(categoryId)) {
                categories.set(categoryId, { id: categoryId, name: prompt.category.name, count: 0 });
            }
            categories.get(categoryId).count++;
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
    createDiscoveryResult() {
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
exports.promptRegistry = new PromptRegistryService();
//# sourceMappingURL=prompt-registry.js.map