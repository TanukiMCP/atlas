/**
 * Ollama LLM Service - Real local LLM integration for TanukiMCP Atlas
 * Provides streaming chat, model management, and health monitoring
 */

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[];
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_ctx?: number;
  };
}export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaHealthStatus {
  isConnected: boolean;
  version?: string;
  models: OllamaModel[];
  lastChecked: Date;
  error?: string;
}

export type ChatStreamCallback = (chunk: OllamaChatResponse) => void;
export type ChatCompleteCallback = (finalResponse: OllamaChatResponse) => void;
export type ChatErrorCallback = (error: Error) => void;

class OllamaService {
  private baseUrl: string = 'http://localhost:11434';
  private currentModel: string = '';
  private healthStatus: OllamaHealthStatus = {
    isConnected: false,
    models: [],
    lastChecked: new Date()
  };
  private abortController: AbortController | null = null;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    this.checkHealth();
  }

  /**
   * Check Ollama server health and available models
   */
  async checkHealth(): Promise<OllamaHealthStatus> {
    try {
      // Check if Ollama is running
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Ollama server responded with ${response.status}`);
      }      const versionData = await response.json();
      
      // Get available models
      const modelsResponse = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      const modelsData = await modelsResponse.json();

      this.healthStatus = {
        isConnected: true,
        version: versionData.version,
        models: modelsData.models || [],
        lastChecked: new Date()
      };

      // Set default model if none selected and models are available
      if (!this.currentModel && this.healthStatus.models.length > 0) {
        this.currentModel = this.healthStatus.models[0].name;
      }

    } catch (error) {
      this.healthStatus = {
        isConnected: false,
        models: [],
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return this.healthStatus;
  }

  /**
   * Get current health status
   */
  getHealthStatus(): OllamaHealthStatus {
    return { ...this.healthStatus };
  }

  /**
   * Get available models
   */
  async getModels(): Promise<OllamaModel[]> {
    await this.checkHealth();
    return this.healthStatus.models;
  }

  /**
   * Set current model
   */
  setModel(modelName: string): void {
    const modelExists = this.healthStatus.models.some(m => m.name === modelName);
    if (modelExists) {
      this.currentModel = modelName;
    } else {
      throw new Error(`Model '${modelName}' not found. Available models: ${this.healthStatus.models.map(m => m.name).join(', ')}`);
    }
  }  /**
   * Get current model
   */
  getCurrentModel(): string {
    return this.currentModel;
  }

  /**
   * Send a chat message with streaming response
   */
  async chatStream(
    messages: OllamaChatMessage[],
    onChunk: ChatStreamCallback,
    onComplete: ChatCompleteCallback,
    onError: ChatErrorCallback,
    options?: OllamaChatRequest['options']
  ): Promise<void> {
    if (!this.healthStatus.isConnected) {
      onError(new Error('Ollama is not connected. Please check if Ollama is running.'));
      return;
    }

    if (!this.currentModel) {
      onError(new Error('No model selected. Please select a model first.'));
      return;
    }

    // Cancel any existing request
    this.cancelCurrentRequest();
    
    // Create new abort controller
    this.abortController = new AbortController();

    const request: OllamaChatRequest = {
      model: this.currentModel,
      messages,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        repeat_penalty: 1.1,
        ...options
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body available');
      }

      const decoder = new TextDecoder();
      let finalResponse: OllamaChatResponse | null = null;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const data: OllamaChatResponse = JSON.parse(line);
              
              // Call chunk callback
              onChunk(data);
              
              // Store final response
              if (data.done) {
                finalResponse = data;
              }
            } catch (e) {
              // Ignore malformed JSON lines
            }
          }
        }

        // Call completion callback with final response
        if (finalResponse) {
          onComplete(finalResponse);
        }

      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't call error callback
        return;
      }
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Cancel current chat request
   */
  cancelCurrentRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }  /**
   * Send a non-streaming chat message
   */
  async chat(
    messages: OllamaChatMessage[],
    options?: OllamaChatRequest['options']
  ): Promise<OllamaChatResponse> {
    return new Promise((resolve, reject) => {
      let finalResponse: OllamaChatResponse | null = null;

      this.chatStream(
        messages,
        (chunk) => {
          if (chunk.done) {
            finalResponse = chunk;
          }
        },
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Check if a request is currently in progress
   */
  isRequestInProgress(): boolean {
    return this.abortController !== null;
  }

  /**
   * Set Ollama server URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.checkHealth();
  }

  /**
   * Get current server URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const ollamaService = new OllamaService();