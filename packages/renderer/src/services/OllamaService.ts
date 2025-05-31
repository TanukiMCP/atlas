import { TanukiModel, ModelRequirements, SystemCapabilities } from '../types';

interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    parameter_size?: string;
    quantization_level?: string;
    format?: string;
  };
}

interface OllamaGenerateParams {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
    repeat_penalty?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    seed?: number;
    mirostat?: number;
    mirostat_eta?: number;
    mirostat_tau?: number;
    num_ctx?: number;
    num_batch?: number;
    num_gpu?: number;
    num_thread?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaService {
  private baseUrl: string;
  private isConnected: boolean = false;
  private systemCapabilities: SystemCapabilities | null = null;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the base URL for the Ollama API
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Check if Ollama server is running
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.error('Ollama server connection check failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Get list of available models from Ollama
   */
  async listModels(): Promise<TanukiModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform Ollama models to TanukiModel format
      const models: TanukiModel[] = data.models?.map((model: OllamaModelInfo) => {
        // Extract model family and size from name
        const nameParts = model.name.split(':');
        const modelName = nameParts[0];
        const modelVariant = nameParts.length > 1 ? nameParts[1] : '';
        
        // Extract parameter count from model name (e.g., llama2-7b -> 7B)
        const paramMatch = modelName.match(/(\d+)b/i);
        const parameterCount = paramMatch ? `${paramMatch[1]}B` : 
                              (model.details?.parameter_size || 'Unknown');
        
        // Determine quantization from model variant or details
        let quantization = undefined;
        if (modelVariant.includes('q4')) {
          quantization = 'Q4';
        } else if (modelVariant.includes('q5')) {
          quantization = 'Q5';
        } else if (modelVariant.includes('q8')) {
          quantization = 'Q8';
        } else if (model.details?.quantization_level) {
          quantization = model.details.quantization_level;
        }
        
        // Calculate model size based on parameter count and quantization
        const baseSize = parseInt(paramMatch?.[1] || '7') * 1024; // Default to 7B model size
        const quantMultiplier = quantization === 'Q4' ? 0.25 : 
                              quantization === 'Q5' ? 0.3 : 
                              quantization === 'Q8' ? 0.5 : 1.0;
        
        const modelSize = Math.round(baseSize * quantMultiplier);
        
        // Determine model capabilities based on name
        const capabilities: any[] = [];
        if (modelName.includes('chat') || modelName.includes('instruct')) {
          capabilities.push('conversation');
        }
        if (modelName.includes('code') || modelName.includes('coder')) {
          capabilities.push('coding');
        }
        if (modelName.includes('math')) {
          capabilities.push('mathematics');
        }
        if (modelName.includes('vision') || modelName.includes('vl')) {
          capabilities.push('vision');
        }
        
        // Add basic capabilities that most models have
        capabilities.push('reasoning', 'problem-solving');
        
        // Determine category based on model family
        let category = 'tanukimcp-apollo';
        if (modelName.includes('llama') || modelName.includes('mistral')) {
          category = 'tanukimcp-hermes';
        } else if (modelName.includes('code') || modelName.includes('deepseek')) {
          category = 'tanukimcp-athena';
        } else if (modelName.includes('phi') || modelName.includes('gemma')) {
          category = 'tanukimcp-artemis';
        }
        
        // Calculate requirements based on model size
        const requirements: ModelRequirements = {
          minRam: modelSize * 1.2, // 20% overhead
          recommendedRam: modelSize * 2,
          diskSpace: modelSize * 2,
          minVram: modelSize,
          recommendedVram: modelSize * 1.5
        };
        
        return {
          name: model.name,
          displayName: modelName,
          description: `${modelName} (${parameterCount}${quantization ? `, ${quantization}` : ''})`,
          size: modelSize,
          parameterCount,
          family: modelName.split('-')[0],
          quantization,
          isInstalled: true,
          capabilities: capabilities,
          category,
          requirements
        };
      }) || [];
      
      return models;
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      throw error;
    }
  }

  /**
   * Install (pull) a model from Ollama
   */
  async installModel(modelName: string, onProgress?: (progress: number) => void): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to install model: ${response.statusText}`);
      }
      
      if (response.body && onProgress) {
        const reader = response.body.getReader();
        let done = false;
        
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(Boolean);
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.status === 'downloading' && data.completed && data.total) {
                const progress = (data.completed / data.total) * 100;
                onProgress(progress);
              }
            } catch (e) {
              console.warn('Failed to parse progress data:', e);
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error installing Ollama model:', error);
      throw error;
    }
  }

  /**
   * Uninstall (delete) a model from Ollama
   */
  async uninstallModel(modelName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to uninstall model: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error uninstalling Ollama model:', error);
      throw error;
    }
  }

  /**
   * Generate a response from a model
   */
  async generate(modelName: string, prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    stream?: boolean;
    onToken?: (token: string) => void;
  } = {}): Promise<string> {
    try {
      const generateParams: OllamaGenerateParams = {
        model: modelName,
        prompt,
        stream: options.stream,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
          top_p: options.topP,
          top_k: options.topK,
        }
      };
      
      // Add hardware optimization parameters based on system capabilities
      if (this.systemCapabilities) {
        // Set number of threads based on available CPU cores
        generateParams.options!.num_thread = Math.max(1, Math.min(8, this.systemCapabilities.cpuCores - 1));
        
        // Set GPU usage if available
        if (this.systemCapabilities.gpuInfo) {
          generateParams.options!.num_gpu = 1;
        }
      }

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateParams),
      });

      if (!response.ok) {
        throw new Error(`Ollama generation failed: ${response.statusText}`);
      }

      if (options.stream && options.onToken) {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        let fullResponse = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.response) {
                options.onToken(data.response);
                fullResponse += data.response;
              }
            } catch (e) {
              console.warn('Failed to parse Ollama response chunk:', e);
            }
          }
        }
        return fullResponse;
      } else {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error('Error generating response from Ollama:', error);
      throw error;
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(modelName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get model info: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting Ollama model info:', error);
      throw error;
    }
  }

  /**
   * Set system capabilities for optimizing model generation
   */
  setSystemCapabilities(capabilities: SystemCapabilities): void {
    this.systemCapabilities = capabilities;
  }

  /**
   * Get Ollama server version
   */
  async getVersion(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      
      if (!response.ok) {
        throw new Error(`Failed to get version: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.version;
    } catch (error) {
      console.error('Error getting Ollama version:', error);
      throw error;
    }
  }

  /**
   * Create a chat completion (conversation)
   */
  async chat(modelName: string, messages: Array<{role: string, content: string}>, options: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    onToken?: (token: string) => void;
  } = {}): Promise<string> {
    try {
      // Convert messages to a prompt format Ollama can understand
      let prompt = '';
      for (const message of messages) {
        if (message.role === 'system') {
          prompt += `<|system|>\n${message.content}\n`;
        } else if (message.role === 'user') {
          prompt += `<|user|>\n${message.content}\n`;
        } else if (message.role === 'assistant') {
          prompt += `<|assistant|>\n${message.content}\n`;
        }
      }
      
      // Add the final assistant prompt to trigger the response
      prompt += '<|assistant|>\n';
      
      // Use the generate method with the formatted prompt
      return await this.generate(modelName, prompt, options);
    } catch (error) {
      console.error('Error in Ollama chat:', error);
      throw error;
    }
  }
} 