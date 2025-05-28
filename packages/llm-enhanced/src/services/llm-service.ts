import { MCPClientInterface, MCPToolCall, MCPToolResult } from './mcp-client-adapter';

export interface LLMServiceConfig {
  baseUrl?: string;
  defaultModel?: string;
  timeout?: number;
}

export interface LLMGenerateOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repeat_penalty?: number;
  max_tokens?: number;
}

import { OllamaServiceInterface } from './ollama-adapter';

export class LLMService {
  private defaultModel: string;
  private mcpClient: MCPClientInterface | null = null;
  private ollamaService: OllamaServiceInterface | null = null;

  constructor(config: LLMServiceConfig = {}) {
    this.defaultModel = config.defaultModel || 'llama3.1:latest';
  }

  setOllamaService(service: OllamaServiceInterface): void {
    this.ollamaService = service;
  }

  async initialize(): Promise<void> {
    if (!this.ollamaService) {
      throw new Error('Ollama service not configured');
    }

    await this.ollamaService.checkHealth();
    const models = await this.ollamaService.getModels();
    
    if (models.length > 0) {
      // Set the first available model as default if not already set
      const availableModel = models.find(m => m.name === this.defaultModel) || models[0];
      this.ollamaService.setModel(availableModel.name);
    }
  }

  setMCPClient(client: MCPClientInterface): void {
    this.mcpClient = client;
  }

  async generate(prompt: string, options: LLMGenerateOptions = {}): Promise<string> {
    if (!this.ollamaService) {
      throw new Error('Ollama service not configured');
    }

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await this.ollamaService.chat(messages, {
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9,
      top_k: options.top_k || 40,
      repeat_penalty: options.repeat_penalty || 1.1
    });

    return response.message.content;
  }

  async generateWithMessages(messages: Array<{ role: string; content: string }>, options: LLMGenerateOptions = {}): Promise<{ message: { content: string } }> {
    if (!this.ollamaService) {
      throw new Error('Ollama service not configured');
    }

    return await this.ollamaService.chat(messages, {
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9,
      top_k: options.top_k || 40,
      repeat_penalty: options.repeat_penalty || 1.1
    });
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

  async isHealthy(): Promise<boolean> {
    if (!this.ollamaService) {
      return false;
    }

    const health = await this.ollamaService.checkHealth();
    return health.isConnected;
  }

  getCurrentModel(): string {
    if (!this.ollamaService) {
      return '';
    }
    return this.ollamaService.getCurrentModel();
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.ollamaService) {
      return [];
    }

    const models = await this.ollamaService.getModels();
    return models.map(m => m.name);
  }

  setModel(modelName: string): void {
    if (!this.ollamaService) {
      throw new Error('Ollama service not configured');
    }
    this.ollamaService.setModel(modelName);
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