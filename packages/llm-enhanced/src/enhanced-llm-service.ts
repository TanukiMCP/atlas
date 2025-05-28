import { LLMRouter } from './router/router';
import { LLMService } from './services/llm-service';
import { mcpClientAdapter } from './services/mcp-client-adapter';
import { LLMRequest, LLMResponse } from './router/types';

export interface EnhancedLLMConfig {
  baseUrl?: string;
  defaultModel?: string;
  enableClearThought?: boolean;
}

export class EnhancedLLMService {
  private router: LLMRouter;
  private llmService: LLMService;
  private isInitialized = false;

  constructor(config: EnhancedLLMConfig = {}) {
    this.llmService = new LLMService(config);
    this.router = new LLMRouter(this.llmService);
  }

  async initialize(ollamaService: any, mcpHubService?: any): Promise<void> {
    try {
      // Set up Ollama service
      this.llmService.setOllamaService(ollamaService);
      
      // Set up MCP client if available
      if (mcpHubService) {
        mcpClientAdapter.setMCPHubService(mcpHubService);
        this.llmService.setMCPClient(mcpClientAdapter);
      }

      // Initialize LLM service
      await this.llmService.initialize();
      
      this.isInitialized = true;
      console.log('Enhanced LLM Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Enhanced LLM Service:', error);
      throw error;
    }
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
      ...routerStatus
    };
  }

  async testComplexityAssessment(query: string) {
    if (!this.isInitialized) {
      throw new Error('Enhanced LLM Service not initialized');
    }

    return await this.router.testComplexityAssessment(query);
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
export const enhancedLLMService = new EnhancedLLMService(); 