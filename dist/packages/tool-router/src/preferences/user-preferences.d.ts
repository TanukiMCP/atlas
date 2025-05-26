import { UserToolPreferences, ConflictResolutionRule, CategoryPreference } from '../types/tool-router-types';
export declare class UserPreferences {
    private preferences;
    private storageKey;
    constructor();
    private getDefaultPreferences;
    load(): Promise<void>;
    save(): Promise<void>;
    getPreferences(): UserToolPreferences;
    updatePreferences(updates: Partial<UserToolPreferences>): Promise<void>;
    getToolWeight(toolId: string): Promise<number>;
    updateToolWeight(toolId: string, weight: number): Promise<void>;
    recordToolUsage(toolId: string, success: boolean, executionTime: number): Promise<void>;
    addConflictResolutionRule(rule: ConflictResolutionRule): Promise<void>;
    removeConflictResolutionRule(pattern: string): Promise<boolean>;
    updateCategoryVisibility(categoryId: string, visible: boolean): Promise<void>;
    updateCategoryPriority(categoryId: string, priority: number): Promise<void>;
    getVisibleCategories(): CategoryPreference[];
    resetToDefaults(): Promise<void>;
}
//# sourceMappingURL=user-preferences.d.ts.map