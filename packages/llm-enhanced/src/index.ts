// Main enhanced LLM service
import { EnhancedLLMService, enhancedLLMService } from './enhanced-llm-service';
import type { EnhancedLLMConfig } from './enhanced-llm-service';
export { EnhancedLLMService, enhancedLLMService };
export type { EnhancedLLMConfig };

// Domain types for helper constants
import type { ProcessingRequirements, UserPreferences, Message } from './types/llm-types';

// Router and types
import { LLMRouter } from './router/router';
export { ComplexityAssessor } from './router/complexityAssessor';
export type { 
  RequestComplexity, 
  LLMRequest, 
  LLMResponse, 
  TierProcessor, 
  ComplexityAssessment 
} from './router/types';

// Services
import { llmService } from './services/llm-service';
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

// Type Definitions
export type {
  ProcessingTier,
  QualityMetrics,
  ProcessingRequest,
  ProcessingResponse,
  ProcessingStep,
  ProcessingRequirements,
  UserPreferences,
  Message
} from './types/llm-types';

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

// Declare router variable
let router: LLMRouter;

/**
 * Process a request through the LLM router
 * This is the main entry point for the LLM enhanced service
 */
export async function processRequest(request: LLMRequest): Promise<LLMResponse> {
  if (!router) {
    throw new Error('LLMRouter not initialized. Call initialize() first.');
  }
  return router.routeRequest(request);
}

/**
 * Set the OpenRouter service for the LLM service
 * This should be called during initialization with the OpenRouter service instance
 */
export function setOpenRouterService(service: any): void {
  llmService.setOpenRouterService(service);
}

/**
 * Test the complexity assessment for a given query
 * Useful for debugging and understanding how the router works
 */
export async function testComplexityAssessment(query: string): Promise<any> {
  if (!router) {
    throw new Error('LLMRouter not initialized. Call initialize() first.');
  }
  return router.testComplexityAssessment(query);
}

/**
 * Initialize the LLM enhanced service
 * This should be called during application startup
 */
export async function initialize(): Promise<void> {
  await llmService.initialize();
  router = new LLMRouter(llmService);
}

/**
 * Sets whether complexity assessment should be LLM-driven.
 */
export function setLLMDrivenComplexity(enabled: boolean): void {
  if (!router) {
    throw new Error('LLMRouter not initialized. Call initialize() first.');
  }
  // Assuming ComplexityAssessor has a method to toggle this
  // router.getComplexityAssessor().setLLMDriven(enabled);
  // For now, let's log, this needs implementation in ComplexityAssessor and exposed via LLMRouter
  console.log(`LLM-driven complexity assessment set to: ${enabled} (needs full implementation)`);
}

/**
 * Gets the status of the Enhanced LLM service.
 */
export async function getStatus(): Promise<any> {
  if (!router) {
    return {
      initialized: false,
      routerStatus: null,
      error: 'LLMRouter not initialized. Call initialize() first.'
    };
  }
  try {
    return {
      initialized: true,
      routerStatus: await router.getRouterStatus(),
    };
  } catch (error) {
    console.error('Error getting LLM Router status:', error);
    return {
      initialized: true, // Router object exists but method failed
      routerStatus: null,
      error: error instanceof Error ? error.message : 'Unknown error getting status'
    };
  }
}

// Export the singleton instance of llmService and other necessary exports
export { llmService };
// Re-export LLMRouter if it's intended to be used externally as a class/type
export { LLMRouter } from './router/router';
// Re-export LLMService class if needed
export { LLMService } from './services/llm-service';

// Type re-exports for the module's public API.
// These were already exported earlier using `export type { ... } from './types/llm-types'` 
// and `export type { ... } from './router/types'` which also makes them available for internal use.
// The duplicate identifier errors suggest the final re-export block was problematic.
// We ensure that types used internally (like LLMRequest, LLMResponse for processRequest function signature)
// are available from their initial `export type ... from ...` or direct `import type` statements.

// The following block was causing duplicate identifier errors and is removed:
/*
export type { 
  ProcessingRequirements, 
  UserPreferences, 
  Message 
} from './types/llm-types'; 
*/ 