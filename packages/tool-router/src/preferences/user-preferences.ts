import { UserToolPreferences, SourcePreference, ConflictResolutionRule, CategoryPreference } from '../types/tool-router-types';

export class UserPreferences {
  private preferences: UserToolPreferences;
  private storageKey = 'tanukimcp-tool-preferences';

  constructor() {
    this.preferences = this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserToolPreferences {
    return {
      preferredSources: [
        { sourceId: 'builtin', weight: 1.0, enabled: true },
        { sourceId: 'external', weight: 0.8, enabled: true }
      ],
      conflictResolutionRules: [
        { pattern: 'file.*', resolution: 'prefer_builtin', priority: 10 },
        { pattern: 'web.*', resolution: 'prefer_external', priority: 9 },
        { pattern: '.*', resolution: 'performance_based', priority: 1 }
      ],
      toolCategories: [
        { categoryId: 'files', visible: true, priority: 1 },
        { categoryId: 'programming', visible: true, priority: 2 },
        { categoryId: 'web', visible: true, priority: 3 },
        { categoryId: 'mathematics', visible: true, priority: 4 },
        { categoryId: 'science', visible: true, priority: 5 },
        { categoryId: 'languages', visible: true, priority: 6 },
        { categoryId: 'general', visible: true, priority: 10 }
      ],
      maxExecutionTime: 30000, // 30 seconds
      enableFallbacks: true,
      showPreview: true
    };
  }

  async load(): Promise<void> {
    try {
      // Try to load from localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.preferences = { ...this.getDefaultPreferences(), ...parsed };
          return;
        }
      }
      
      // Try to load from file system in Node environment
      if (typeof require !== 'undefined') {
        try {
          const fs = require('fs');
          const path = require('path');
          const os = require('os');
          
          const prefsPath = path.join(os.homedir(), '.tanukimcp', 'tool-preferences.json');
          
          if (fs.existsSync(prefsPath)) {
            const stored = fs.readFileSync(prefsPath, 'utf8');
            const parsed = JSON.parse(stored);
            this.preferences = { ...this.getDefaultPreferences(), ...parsed };
            return;
          }
        } catch (error) {
          console.warn('Failed to load preferences from file system:', error);
        }
      }
      
      // Use defaults if no stored preferences
      this.preferences = this.getDefaultPreferences();
      
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      this.preferences = this.getDefaultPreferences();
    }
  }

  async save(): Promise<void> {
    try {
      const serialized = JSON.stringify(this.preferences, null, 2);
      
      // Save to localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, serialized);
        return;
      }
      
      // Save to file system in Node environment
      if (typeof require !== 'undefined') {
        try {
          const fs = require('fs');
          const path = require('path');
          const os = require('os');
          
          const prefsDir = path.join(os.homedir(), '.tanukimcp');
          const prefsPath = path.join(prefsDir, 'tool-preferences.json');
          
          // Ensure directory exists
          if (!fs.existsSync(prefsDir)) {
            fs.mkdirSync(prefsDir, { recursive: true });
          }
          
          fs.writeFileSync(prefsPath, serialized, 'utf8');
          
        } catch (error) {
          console.warn('Failed to save preferences to file system:', error);
        }
      }
      
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }  getPreferences(): UserToolPreferences {
    return { ...this.preferences };
  }

  async updatePreferences(updates: Partial<UserToolPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...updates };
    await this.save();
  }

  async getToolWeight(toolId: string): Promise<number> {
    // Extract source from tool ID (format: sourceId:toolName)
    const [sourceId] = toolId.split(':');
    const sourcePreference = this.preferences.preferredSources.find(p => p.sourceId === sourceId);
    
    if (!sourcePreference || !sourcePreference.enabled) {
      return 0.1; // Very low weight for disabled sources
    }
    
    return sourcePreference.weight;
  }

  async updateToolWeight(toolId: string, weight: number): Promise<void> {
    const [sourceId] = toolId.split(':');
    const sourceIndex = this.preferences.preferredSources.findIndex(p => p.sourceId === sourceId);
    
    if (sourceIndex >= 0) {
      this.preferences.preferredSources[sourceIndex].weight = weight;
      await this.save();
    }
  }

  async recordToolUsage(toolId: string, success: boolean, executionTime: number): Promise<void> {
    // This could update preferences based on usage patterns
    // For now, we'll just track basic success rates to adjust source weights
    
    const [sourceId] = toolId.split(':');
    const sourcePreference = this.preferences.preferredSources.find(p => p.sourceId === sourceId);
    
    if (sourcePreference) {
      // Gradually adjust weight based on success rate
      if (success) {
        sourcePreference.weight = Math.min(1.0, sourcePreference.weight + 0.001);
      } else {
        sourcePreference.weight = Math.max(0.1, sourcePreference.weight - 0.002);
      }
      
      await this.save();
    }
  }

  async addConflictResolutionRule(rule: ConflictResolutionRule): Promise<void> {
    this.preferences.conflictResolutionRules.push(rule);
    this.preferences.conflictResolutionRules.sort((a, b) => b.priority - a.priority);
    await this.save();
  }

  async removeConflictResolutionRule(pattern: string): Promise<boolean> {
    const index = this.preferences.conflictResolutionRules.findIndex(r => r.pattern === pattern);
    if (index >= 0) {
      this.preferences.conflictResolutionRules.splice(index, 1);
      await this.save();
      return true;
    }
    return false;
  }

  async updateCategoryVisibility(categoryId: string, visible: boolean): Promise<void> {
    const category = this.preferences.toolCategories.find(c => c.categoryId === categoryId);
    if (category) {
      category.visible = visible;
      await this.save();
    }
  }

  async updateCategoryPriority(categoryId: string, priority: number): Promise<void> {
    const category = this.preferences.toolCategories.find(c => c.categoryId === categoryId);
    if (category) {
      category.priority = priority;
      await this.save();
    }
  }

  getVisibleCategories(): CategoryPreference[] {
    return this.preferences.toolCategories
      .filter(c => c.visible)
      .sort((a, b) => a.priority - b.priority);
  }

  async resetToDefaults(): Promise<void> {
    this.preferences = this.getDefaultPreferences();
    await this.save();
  }
}