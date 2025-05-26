export { LLMRouter } from './router/llm-router';
export { RequestClassifier } from './router/request-classifier';
export { BaseProcessor } from './processors/base-processor';
export { AtomicProcessor } from './processors/atomic-processor';
export { UserControls } from './intervention/user-controls';
export { PerformanceTracker } from './analytics/performance-tracker';
export { TournamentBracket } from './quality-assurance/tournament-bracket';
export * from './types/llm-types';
export type { ProcessorEvents } from './processors/base-processor';
export type { UserControlsEvents } from './intervention/user-controls';
export type { PerformanceTrackerEvents } from './analytics/performance-tracker';
export declare function createLLMRouter(): LLMRouter;
export declare function requiresUserApproval(tier: ProcessingTier, estimatedTime: number, userPreferences: UserPreferences): boolean;
export declare function calculateOptimalTier(requirements: ProcessingRequirements): ProcessingTier;
export declare const TIER_CONFIGURATIONS: {
    readonly atomic: {
        readonly timeout: 1000;
        readonly qualityRange: readonly [60, 80];
        readonly models: readonly ["llama3.2:1b"];
        readonly features: readonly ["caching", "templates"];
    };
    readonly moderate: {
        readonly timeout: 5000;
        readonly qualityRange: readonly [75, 85];
        readonly models: readonly ["llama3.2:3b", "llama3.1:8b"];
        readonly features: readonly ["reasoning", "tools"];
    };
    readonly complex: {
        readonly timeout: 15000;
        readonly qualityRange: readonly [85, 95];
        readonly models: readonly ["deepseek-r1-distill-qwen:14b", "qwq:32b"];
        readonly features: readonly ["multi-step", "tool-chaining", "validation"];
    };
    readonly expert: {
        readonly timeout: 45000;
        readonly qualityRange: readonly [90, 98];
        readonly models: readonly ["qwq:32b", "deepseek-r1-distill-qwen:32b"];
        readonly features: readonly ["multi-model", "tournament", "comprehensive-tools"];
    };
};
export declare const DEFAULT_USER_PREFERENCES: UserPreferences;
export declare const DEFAULT_PROCESSING_REQUIREMENTS: ProcessingRequirements;
//# sourceMappingURL=index.d.ts.map