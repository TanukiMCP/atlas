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

  constructor(config: LLMServiceConfig = {}) {
    this.defaultModel = config.defaultModel || 'meta-llama/llama-3.1-8b-instruct:free';
  }

  setOpenRouterService(service: any): void {
    // OpenRouter service integration placeholder
    console.log('OpenRouter service set');
  }

  async initialize(): Promise<void> {
    // OpenRouter initialization placeholder
    this.isInitialized = true;
    console.log('LLM Service initialized with OpenRouter');
  }

  async chat(messages: ChatMessage[], options: GenerationOptions = {}): Promise<string> {
    // OpenRouter chat implementation placeholder
    return 'OpenRouter response placeholder';
  }

  async generate(prompt: string, options: GenerationOptions = {}): Promise<string> {
    // OpenRouter generation implementation placeholder
    return 'OpenRouter generation placeholder';
  }

  setMCPClient(client: MCPClientInterface): void {
    this.mcpClient = client;
  }

  async getStatus(): Promise<{ isHealthy: boolean; currentModel: string; availableModels: string[] }> {
    return {
      isHealthy: true,
      currentModel: this.defaultModel,
      availableModels: [this.defaultModel]
    };
  }

  getCurrentModel(): string {
    return this.defaultModel;
  }

  async getAvailableModels(): Promise<string[]> {
    return [this.defaultModel];
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