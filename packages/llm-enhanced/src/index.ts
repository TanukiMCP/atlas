// Main LLM Router
export { LLMRouter } from './router/llm-router';
export { RequestClassifier } from './router/request-classifier';

// Base Processor Architecture
export { BaseProcessor } from './processors/base-processor';
export { AtomicProcessor } from './processors/atomic-processor';

// User Intervention System
export { UserControls } from './intervention/user-controls';

// Performance Tracking
export { PerformanceTracker } from './analytics/performance-tracker';

// Tournament Quality Assurance
export { TournamentBracket } from './quality-assurance/tournament-bracket';

// Type Definitions
export * from './types/llm-types';

// Re-export processor events for external listening
export type { ProcessorEvents } from './processors/base-processor';
export type { UserControlsEvents } from './intervention/user-controls';
export type { PerformanceTrackerEvents } from './analytics/performance-tracker';

// Helper function to create a configured LLM Router
export function createLLMRouter(): LLMRouter {
  return new LLMRouter();
}

// Helper function to determine if a request needs intervention approval
export function requiresUserApproval(
  tier: ProcessingTier, 
  estimatedTime: number, 
  userPreferences: UserPreferences
): boolean {
  // Expert tier always requires approval unless explicitly allowed
  if (tier === 'expert' && !userPreferences.allowExpertProcessing) {
    return true;
  }
  
  // Long processing times require approval
  if (estimatedTime > userPreferences.maxWaitTime) {
    return true;
  }
  
  // High intervention level users want to approve complex operations
  if (userPreferences.interventionLevel === 'high' && (tier === 'complex' || tier === 'expert')) {
    return true;
  }
  
  return false;
}

// Helper function to calculate optimal tier based on requirements
export function calculateOptimalTier(requirements: ProcessingRequirements): ProcessingTier {
  let score = 0;
  
  // Base complexity
  if (requirements.requiresMultiStep) score += 3;
  if (requirements.requiresReasoning) score += 2;
  if (requirements.requiresCreativity && requirements.requiresFactualAccuracy) score += 2;
  if (requirements.requiresCodeGeneration) score += 1;
  if (requirements.requiresMathematics) score += 1;
  
  // Quality requirements
  if (requirements.minQuality > 90) score += 3;
  else if (requirements.minQuality > 80) score += 2;
  else if (requirements.minQuality > 70) score += 1;
  
  // Latency constraints (negative scoring for time pressure)
  if (requirements.maxLatency < 2000) score -= 2;
  else if (requirements.maxLatency < 5000) score -= 1;
  
  // Map score to tier
  if (score >= 6) return 'expert';
  if (score >= 4) return 'complex';
  if (score >= 2) return 'moderate';
  return 'atomic';
}

// Constants for system configuration
export const TIER_CONFIGURATIONS = {
  atomic: {
    timeout: 1000,
    qualityRange: [60, 80],
    models: ['llama3.2:1b'],
    features: ['caching', 'templates']
  },
  moderate: {
    timeout: 5000,
    qualityRange: [75, 85],
    models: ['llama3.2:3b', 'llama3.1:8b'],
    features: ['reasoning', 'tools']
  },
  complex: {
    timeout: 15000,
    qualityRange: [85, 95],
    models: ['deepseek-r1-distill-qwen:14b', 'qwq:32b'],
    features: ['multi-step', 'tool-chaining', 'validation']
  },
  expert: {
    timeout: 45000,
    qualityRange: [90, 98],
    models: ['qwq:32b', 'deepseek-r1-distill-qwen:32b'],
    features: ['multi-model', 'tournament', 'comprehensive-tools']
  }
} as const;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  qualityVsSpeed: 50,
  allowExpertProcessing: false,
  enableQualityAssurance: true,
  maxWaitTime: 30000,
  interventionLevel: 'balanced'
};

export const DEFAULT_PROCESSING_REQUIREMENTS: ProcessingRequirements = {
  minQuality: 75,
  maxLatency: 10000,
  requiresReasoning: false,
  requiresCreativity: false,
  requiresFactualAccuracy: true,
  requiresCodeGeneration: false,
  requiresMathematics: false,
  requiresMultiStep: false
}; 