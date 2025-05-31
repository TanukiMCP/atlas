/**
 * OpenRouter Integration for LLM-Enhanced Complexity Router
 * 
 * This file provides the integration between OpenRouter and the LLM-driven
 * complexity assessment system. It ensures that the ComplexityAssessor
 * uses OpenRouter for determining task complexity.
 */

import { LLMRouter } from './router/router';
import { llmService } from './services/llm-service';
import { LLMRequest, LLMResponse } from './router/types';

// Create the router with the LLM service
const router = new LLMRouter(llmService);

/**
 * Set the OpenRouter service for the LLM service
 * This should be called during initialization with the OpenRouter service instance
 */
export function setOpenRouterService(service: any): void {
  llmService.setOpenRouterService(service);
  console.log('OpenRouter service configured for LLM-driven complexity assessment');
}

/**
 * Process a request through the LLM router with LLM-driven complexity assessment
 */
export async function processRequestWithComplexityAssessment(request: LLMRequest): Promise<LLMResponse> {
  return router.routeRequest(request);
}

/**
 * Test the complexity assessment for a given query
 * Useful for debugging and understanding how the router works
 */
export async function testComplexityAssessment(query: string): Promise<any> {
  return router.testComplexityAssessment(query);
}

/**
 * Initialize the OpenRouter integration
 * This should be called during application startup
 */
export async function initializeOpenRouterIntegration(): Promise<void> {
  await llmService.initialize();
  console.log('OpenRouter integration initialized for LLM-driven complexity assessment');
} 