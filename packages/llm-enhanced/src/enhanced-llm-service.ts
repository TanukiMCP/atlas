import { LLMRouter } from './router/router';
import { LLMService } from './services/llm-service';
import { mcpClientAdapter } from './services/mcp-client-adapter';
import { LLMRequest, LLMResponse } from './router/types';
import { ComplexityAssessor } from './router/complexityAssessor';

export interface EnhancedLLMConfig {
  baseUrl?: string;
  defaultModel?: string;
  enableClearThought?: boolean;
  useLLMDrivenComplexity?: boolean;
}

export class EnhancedLLMService {
  private router: LLMRouter;
  private llmService: LLMService;
  private complexityAssessor: ComplexityAssessor;
  private isInitialized = false;
  private useLLMDrivenComplexity: boolean;

  constructor(config: EnhancedLLMConfig = {}) {
    this.llmService = new LLMService(config);
    this.complexityAssessor = new ComplexityAssessor(this.llmService);
    this.router = new LLMRouter(this.llmService);
    this.useLLMDrivenComplexity = config.useLLMDrivenComplexity !== false; // Enable by default
  }

  async initialize(openRouterService?: any, mcpHubService?: any): Promise<void> {
    console.log('Enhanced LLM Service initializing...');
    // Wire OpenRouter integration
    if (openRouterService) {
      this.llmService.setOpenRouterService(openRouterService);
      console.log('Enhanced LLM Service: OpenRouterService wired into LLMService');
      
      if (this.useLLMDrivenComplexity) {
        console.log('Enhanced LLM Service: LLM-driven complexity assessment enabled');
      } else {
        console.log('Enhanced LLM Service: Using rule-based complexity assessment');
      }
    } else {
      // If no OpenRouter service, disable LLM-driven complexity
      this.useLLMDrivenComplexity = false;
      console.log('Enhanced LLM Service: No OpenRouter service, using rule-based complexity assessment');
    }
    
    // Wire MCP hub integration
    if (mcpHubService) {
      mcpClientAdapter.setMCPHubService(mcpHubService);
      this.llmService.setMCPClient(mcpClientAdapter);
      console.log('Enhanced LLM Service: MCP Hub wired into LLMService');
    }
    
    // Initialize underlying LLMService
    await this.llmService.initialize();
    this.isInitialized = true;
    console.log('Enhanced LLM Service initialized and ready');
  }

  async generateResponse(query: string, userId: string = 'default', metadata?: Record<string, any>): Promise<LLMResponse> {
    if (!this.isInitialized) {
      throw new Error('Enhanced LLM Service not initialized. Call initialize() first.');
    }

    const request: LLMRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      userId,
      timestamp: Date.now(),
      metadata
    };

    return await this.router.routeRequest(request);
  }

  async getStatus() {
    if (!this.isInitialized) {
      return {
        initialized: false,
        error: 'Service not initialized'
      };
    }

    const routerStatus = await this.router.getRouterStatus();
    return {
      initialized: true,
      useLLMDrivenComplexity: this.useLLMDrivenComplexity,
      ...routerStatus
    };
  }

  async testComplexityAssessment(query: string) {
    if (!this.isInitialized) {
      throw new Error('Enhanced LLM Service not initialized');
    }

    return await this.router.testComplexityAssessment(query);
  }

  // Enable or disable LLM-driven complexity assessment
  setLLMDrivenComplexity(enabled: boolean): void {
    this.useLLMDrivenComplexity = enabled;
    console.log(`Enhanced LLM Service: LLM-driven complexity assessment ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Direct access to basic LLM functionality for backward compatibility
  async generateBasic(prompt: string, options?: any): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Enhanced LLM Service not initialized');
    }

    return await this.llmService.generate(prompt, options);
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getCurrentModel(): string {
    return this.llmService.getCurrentModel();
  }

  async setModel(modelName: string): Promise<void> {
    this.llmService.setModel(modelName);
  }
}

// Export singleton instance
export const enhancedLLMService = new EnhancedLLMService({ useLLMDrivenComplexity: true }); 