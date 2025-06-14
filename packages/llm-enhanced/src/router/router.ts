import { LLMRequest, LLMResponse, RequestComplexity, TierProcessor } from './types';
import { ComplexityAssessor } from './complexityAssessor';
import { Tier1Processor } from './tier1Processor';
import { Tier2Processor } from './tier2Processor';
import { Tier3Processor } from './tier3Processor';
import { Tier4Processor } from './tier4Processor';
import { LLMService } from '../services/llm-service';

export class LLMRouter {
  private complexityAssessor: ComplexityAssessor;
  private tier1Processor: Tier1Processor;
  private tier2Processor: Tier2Processor;
  private tier3Processor: Tier3Processor;
  private tier4Processor: Tier4Processor;
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
    this.complexityAssessor = new ComplexityAssessor(llmService);
    this.tier1Processor = new Tier1Processor();
    this.tier2Processor = new Tier2Processor(llmService);
    this.tier3Processor = new Tier3Processor(llmService);
    this.tier4Processor = new Tier4Processor(llmService);
  }

  async routeRequest(request: LLMRequest): Promise<LLMResponse> {
    try {
      // Assess complexity using LLM-driven assessment
      const assessment = await this.complexityAssessor.assess(request);
      
      // Route to appropriate tier
      const processor = this.getProcessor(assessment.complexity);
      
      // Process request
      const response = await processor.process(request);
      
      // Add routing metadata
      response.metrics = {
        ...response.metrics,
        complexityAssessment: assessment,
        routingDecision: assessment.complexity,
        estimatedTimeMs: assessment.estimatedTimeMs
      };

      return response;
    } catch (error) {
      // Fallback to basic response
      return {
        requestId: request.id,
        tierUsed: RequestComplexity.ATOMIC,
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown routing error',
        metrics: {
          failed: true,
          routingError: true
        }
      };
    }
  }

  private getProcessor(complexity: RequestComplexity): TierProcessor {
    switch (complexity) {
      case RequestComplexity.DIRECT_RESPONSE:
        return this.tier1Processor;
      case RequestComplexity.ATOMIC:
        return this.tier2Processor;
      case RequestComplexity.MODERATE:
        return this.tier3Processor;
      case RequestComplexity.COMPLEX:
      case RequestComplexity.EXPERT:
        return this.tier4Processor;
      default:
        return this.tier2Processor; // Default fallback
    }
  }

  async getRouterStatus(): Promise<{
    llmServiceStatus: { isHealthy: boolean; currentModel: string; availableModels: string[] };
    mcpConnected: boolean;
    availableTools: string[];
  }> {
    const llmServiceStatus = await this.llmService.getStatus();
    const mcpConnected = this.llmService.isMCPConnected();
    const availableTools = mcpConnected ? await this.llmService.getAvailableMCPTools() : [];
    
    return {
      llmServiceStatus,
      mcpConnected,
      availableTools
    };
  }

  async testComplexityAssessment(query: string) {
    const request: LLMRequest = {
      id: `test_${Date.now()}`,
      query,
      userId: 'test_user',
      timestamp: Date.now()
    };

    const assessment = await this.complexityAssessor.assess(request);
    return {
      query,
      assessment,
      selectedTier: assessment.complexity,
      processor: this.getProcessor(assessment.complexity).constructor.name
    };
  }
} 