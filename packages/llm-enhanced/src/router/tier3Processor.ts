import { LLMRequest, LLMResponse, RequestComplexity, TierProcessor } from './types';
import { LLMService } from '../services/llm-service';
import { MCPToolCall } from '../services/mcp-client-adapter';

export class Tier3Processor implements TierProcessor {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  async process(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    try {
      // Tier 3 handles moderate complexity with clear-thought tools
      const shouldUseSequentialThinking = this.shouldUseSequentialThinking(request.query);
      const shouldUseMentalModel = this.shouldUseMentalModel(request.query);

      let content = '';
      let toolsUsed: string[] = [];

      if (shouldUseSequentialThinking) {
        const thinkingResult = await this.useSequentialThinking(request.query);
        if (thinkingResult.success) {
          content += `**Structured Analysis:**\n${thinkingResult.content}\n\n`;
          toolsUsed.push('sequential-thinking');
        }
      }

      if (shouldUseMentalModel) {
        const mentalModelResult = await this.useMentalModel(request.query);
        if (mentalModelResult.success) {
          content += `**Mental Model Analysis:**\n${mentalModelResult.content}\n\n`;
          toolsUsed.push('mental-model');
        }
      }

      // Generate final response using LLM with context from tools
      const finalPrompt = `You are an expert assistant. Based on the following analysis and the original query, provide a comprehensive response.

${content ? `Previous Analysis:\n${content}` : ''}

Original Query: ${request.query}

Please provide a well-structured, thoughtful response that builds upon any analysis provided above.`;

      const llmResponse = await this.llmService.generate(finalPrompt, {
        temperature: 0.6,
        top_p: 0.9,
        top_k: 40
      });

      content += `**Final Response:**\n${llmResponse}`;

      const processingTime = Date.now() - startTime;

      return {
        requestId: request.id,
        tierUsed: RequestComplexity.MODERATE,
        content,
        qualityScore: 0.85,
        metrics: {
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          toolsUsed,
          tokensEstimate: Math.ceil(content.length / 4)
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: RequestComplexity.MODERATE,
        content: 'I encountered an error while processing your request with enhanced reasoning tools. Let me provide a direct response instead.',
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: {
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }

  private shouldUseSequentialThinking(query: string): boolean {
    const indicators = [
      'step by step', 'analyze', 'break down', 'process', 'methodology',
      'approach', 'strategy', 'plan', 'solve', 'problem'
    ];
    const lowerQuery = query.toLowerCase();
    return indicators.some(indicator => lowerQuery.includes(indicator));
  }

  private shouldUseMentalModel(query: string): boolean {
    const indicators = [
      'first principles', 'fundamental', 'root cause', 'why', 'principle',
      'framework', 'model', 'theory', 'concept', 'understand'
    ];
    const lowerQuery = query.toLowerCase();
    return indicators.some(indicator => lowerQuery.includes(indicator));
  }

  private async useSequentialThinking(query: string) {
    const toolCall: MCPToolCall = {
      name: 'sequentialthinking',
      arguments: {
        thought: `I need to analyze this query systematically: ${query}`,
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }

  private async useMentalModel(query: string) {
    // Determine appropriate mental model based on query content
    let modelName = 'first_principles';
    
    if (query.toLowerCase().includes('decision') || query.toLowerCase().includes('choose')) {
      modelName = 'opportunity_cost';
    } else if (query.toLowerCase().includes('simple') || query.toLowerCase().includes('complex')) {
      modelName = 'occams_razor';
    }

    const toolCall: MCPToolCall = {
      name: 'mentalmodel',
      arguments: {
        modelName,
        problem: query
      }
    };

    return await this.llmService.executeMCPTool(toolCall);
  }
} 