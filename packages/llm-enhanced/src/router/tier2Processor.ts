import { LLMRequest, LLMResponse, RequestComplexity, TierProcessor } from './types';
import { LLMService } from '../services/llm-service';

export class Tier2Processor implements TierProcessor {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  async process(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    try {
      // For Tier 2, we expect a relatively straightforward query
      // Use the LLM service directly with optimized parameters for quick responses
      const prompt = `You are a helpful AI assistant. Please provide a clear, concise response to the following query:

${request.query}

Keep your response focused and direct.`;

      const content = await this.llmService.generate(prompt, {
        temperature: 0.3, // Lower temperature for more focused responses
        top_p: 0.8,
        top_k: 30
      });

      const processingTime = Date.now() - startTime;

      return {
        requestId: request.id,
        tierUsed: RequestComplexity.ATOMIC,
        content,
        qualityScore: 0.8, // Good quality for atomic responses
        metrics: { 
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          tokensEstimate: Math.ceil(content.length / 4) // Rough token estimate
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: RequestComplexity.ATOMIC,
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: { 
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }
} 