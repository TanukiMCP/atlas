import { LLMRequest, LLMResponse, RequestComplexity, TierProcessor } from './types';

export class Tier1Processor implements TierProcessor {
  async process(request: LLMRequest): Promise<LLMResponse> {
    // Simple, direct response. E.g., canned responses or very simple LLM call.
    let content = 'Acknowledged.';
    if (request.query.toLowerCase().includes('thank you')) {
        content = 'You are welcome!';
    }
    // Add more direct responses as needed

    return {
      requestId: request.id,
      tierUsed: RequestComplexity.DIRECT_RESPONSE,
      content,
      metrics: { processingTimeMs: 50 + Math.random() * 100 }, // Simulate fast processing
    };
  }
} 