/**
 * Adapter to bridge the actual OllamaService with the LLMService interface
 */

export interface OllamaServiceInterface {
  checkHealth(): Promise<{ isConnected: boolean }>;
  getModels(): Promise<Array<{ name: string }>>;
  setModel(modelName: string): void;
  getCurrentModel(): string;
  setBaseUrl(url: string): void;
  chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<{ message: { content: string } }>;
}

export class OllamaServiceAdapter implements OllamaServiceInterface {
  private currentModel: string = 'llama3.1:latest';
  private baseUrl: string = 'http://127.0.0.1:11434';

  constructor(private ollamaService: any) {}

  async checkHealth(): Promise<{ isConnected: boolean }> {
    const isConnected = await this.ollamaService.checkOllamaHealth();
    return { isConnected };
  }

  async getModels(): Promise<Array<{ name: string }>> {
    const models = await this.ollamaService.listModels();
    return models.map((model: any) => ({ name: model.name }));
  }

  setModel(modelName: string): void {
    this.currentModel = modelName;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
    // Note: The actual OllamaService doesn't have a setBaseUrl method
    // This is a limitation of the current implementation
  }

  async chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<{ message: { content: string } }> {
    // Convert to the format expected by OllamaService.generate
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const request = {
      model: this.currentModel,
      prompt,
      stream: false,
      ...options
    };

    const response = await this.ollamaService.generate(request);
    return {
      message: {
        content: response.response || response.content || ''
      }
    };
  }
}