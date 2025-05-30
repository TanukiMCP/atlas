// Main enhanced LLM service
export { EnhancedLLMService, enhancedLLMService } from './enhanced-llm-service';
export type { EnhancedLLMConfig } from './enhanced-llm-service';

// Router and types
export { LLMRouter } from './router/router';
export { ComplexityAssessor } from './router/complexityAssessor';
export type { 
  LLMRequest, 
  LLMResponse, 
  RequestComplexity, 
  TierProcessor, 
  ComplexityAssessment 
} from './router/types';

// Services
export { LLMService } from './services/llm-service';
export { MCPClientAdapter, mcpClientAdapter } from './services/mcp-client-adapter';
export type { 
  MCPClientInterface, 
  MCPToolCall, 
  MCPToolResult
} from './services/mcp-client-adapter';
export type {
  LLMServiceConfig,
  GenerationOptions
} from './services/llm-service';

// Tier processors
export { Tier1Processor } from './router/tier1Processor';
export { Tier2Processor } from './router/tier2Processor';
export { Tier3Processor } from './router/tier3Processor';
export { Tier4Processor } from './router/tier4Processor';

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
export type {
  LLMRequest,
  LLMResponse,
  RequestComplexity,
  ProcessingTier,
  QualityMetrics,
  ProcessingRequest,
  ProcessingResponse,
  ProcessingStep,
  ChatMessage
} from './types/llm-types';

export type {
  OpenRouterServiceInterface
} from './services/openrouter-adapter';

// Re-export processor events for external listening
export type { ProcessorEvents } from './processors/base-processor';
export type { UserControlsEvents } from './intervention/user-controls';
export type { PerformanceTrackerEvents } from './analytics/performance-tracker';

// Helper function to create a configured Enhanced LLM Service
export function createEnhancedLLMService(config?: EnhancedLLMConfig): EnhancedLLMService {
  return new EnhancedLLMService(config);
}

// Constants for tier configurations
export const TIER_CONFIGURATIONS = {
  DIRECT_RESPONSE: {
    timeout: 500,
    description: 'Simple acknowledgments and direct responses'
  },
  ATOMIC: {
    timeout: 10000,
    description: 'Single-step LLM responses'
  },
  MODERATE: {
    timeout: 30000,
    description: 'Multi-step with clear-thought tools'
  },
  COMPLEX: {
    timeout: 60000,
    description: 'Comprehensive analysis with multiple tools'
  },
  EXPERT: {
    timeout: 120000,
    description: 'Full expert-level analysis with all available tools'
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