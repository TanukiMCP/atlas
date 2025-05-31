import { MCPClientInterface, MCPToolCall, MCPToolResult } from './mcp-client-adapter';

export interface LLMServiceConfig {
  defaultModel?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerationOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export class LLMService {
  private defaultModel: string;
  private mcpClient: MCPClientInterface | null = null;
  private isInitialized = false;
  private openRouterService: any;

  constructor(config: LLMServiceConfig = {}) {
    this.defaultModel = config.defaultModel || 'meta-llama/llama-3.1-8b-instruct:free';
  }

  setOpenRouterService(service: any): void {
    this.openRouterService = service;
    console.log('OpenRouter service configured in LLMService');
  }

  async initialize(): Promise<void> {
    // OpenRouter initialization placeholder
    this.isInitialized = true;
    console.log('LLM Service initialized with OpenRouter');
  }

  async chat(messages: ChatMessage[], options: GenerationOptions = {}): Promise<string> {
    if (!this.openRouterService) {
      throw new Error('OpenRouterService not configured');
    }
    // Use OpenRouter chat-like interface
    const request = {
      model: this.defaultModel,
      messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      stream: false
    };
    const response = await this.openRouterService.generate(request);
    return response.content;
  }

  async generate(prompt: string, options: GenerationOptions = {}): Promise<string> {
    if (!this.openRouterService) {
      throw new Error('OpenRouterService not configured');
    }
    // Transform prompt to user message
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    const request = {
      model: this.defaultModel,
      messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      stream: false
    };
    const response = await this.openRouterService.generate(request);
    return response.content;
  }

  setMCPClient(client: MCPClientInterface): void {
    this.mcpClient = client;
  }

  async getStatus(): Promise<{ isHealthy: boolean; currentModel: string; availableModels: string[] }> {
    return {
      isHealthy: this.openRouterService !== null,
      currentModel: this.defaultModel,
      availableModels: await this.getAvailableModels()
    };
  }

  isHealthy(): boolean {
    return this.openRouterService !== null;
  }

  getCurrentModel(): string {
    return this.defaultModel;
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.openRouterService) {
      return [this.defaultModel];
    }
    
    try {
      const models = await this.openRouterService.getAvailableModels();
      return models.map((m: any) => m.id || m);
    } catch (error) {
      console.error('Failed to get available models:', error);
      return [this.defaultModel];
    }
  }

  setModel(modelName: string): void {
    this.defaultModel = modelName;
  }

  async executeMCPTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    if (!this.mcpClient) {
      return {
        success: false,
        error: 'MCP client not configured'
      };
    }

    return await this.mcpClient.executeToolCall(toolCall);
  }

  isMCPConnected(): boolean {
    return this.mcpClient?.isConnected() || false;
  }

  async getAvailableMCPTools(): Promise<string[]> {
    if (!this.mcpClient) {
      return [];
    }
    return await this.mcpClient.getAvailableTools();
  }
}

// Singleton instance
export const llmService = new LLMService(); 