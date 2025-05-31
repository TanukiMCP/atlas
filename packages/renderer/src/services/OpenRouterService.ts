import mcpService from './MCPService';
import { toolContextService } from './ToolContextService';
import { eventBus } from './event-bus';
import type { ToolCall } from '../components/chat/ToolCallApprovalPanel';
import type { MCPTool } from '../types/index';

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: number;
    completion: number;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider: {
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
  per_request_limits?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

interface FreeModelConfig {
  id: string;
  displayName: string;
  description: string;
  specialization: string[];
  isAvailable: boolean;
  rateLimits: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
}

interface OpenRouterRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string; }>;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: { role: string; content: string; };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenRouterModelData {
  id: string;
  name: string;
  description: string | null;
  context_length: number;
  pricing: {
    prompt: string; // these are strings like "0.000"
    completion: string;
  };
  // Add other fields if needed from the actual API response
}

interface OpenRouterAPIResponse {
  data: OpenRouterModelData[];
}

export class OpenRouterService {
  private apiKey: string | null = null;
  private baseUrl = 'https://openrouter.ai/api/v1';

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('openrouter_api_key', apiKey);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openrouter_api_key');
    }
    return this.apiKey;
  }

  /**
   * Send a chat completion request with tool context
   */
  async sendChatCompletion(messages: any[], options: { 
    model?: string, 
    stream?: boolean, 
    maxTokens?: number,
    temperature?: number
  } = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    const model = options.model || 'meta-llama/llama-3.1-8b-instruct:free';
    
    // Get available tools, typed correctly
    const availableTools: MCPTool[] = mcpService.getAvailableTools().filter(tool => tool.operationalMode === 'agent' || tool.operationalMode === 'both');
    
    // Enhance system message with tool context if enabled
    if (messages.length > 0 && messages[0].role === 'system' && toolContextService.getSettings().showToolContext) {
      const enhancedSystemMessage = toolContextService.generateEnhancedSystemPrompt(
        messages[0].content,
        availableTools
      );
      
      // Replace the system message with the enhanced one
      messages = [
        { ...messages[0], content: enhancedSystemMessage },
        ...messages.slice(1)
      ];
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'TanukiMCP Atlas'
      },
      body: JSON.stringify({
        model,
        messages,
        stream: options.stream || false,
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature || 0.7,
        tools: availableTools.map(tool => {
          const parametersSchema: { type: string, properties: any, required?: string[] } = {
            type: 'object',
            properties: {},
            required: []
          };
          if (tool.parameters) {
            tool.parameters.forEach(param => {
              parametersSchema.properties[param.name] = {
                type: param.type === 'file' ? 'string' : param.type, // map 'file' to 'string' for schema
                description: param.description
              };
              if (param.required) {
                parametersSchema.required?.push(param.name);
              }
            });
          }
          if (parametersSchema.required?.length === 0) {
            delete parametersSchema.required;
          }
          return {
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: parametersSchema
            }
          };
        })
      })
    };

    if (options.stream) {
      return fetch(`${this.baseUrl}/chat/completions`, requestOptions);
    } else {
      const response = await fetch(`${this.baseUrl}/chat/completions`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} ${errorData ? JSON.stringify(errorData) : ''}`);
      }
      
      return response.json();
    }
  }

  /**
   * Execute a tool with approval handling
   */
  async executeToolWithApproval(toolName: string, parameters: any): Promise<any> {
    const toolDefinition = mcpService.getTool(toolName);

    const toolCall: ToolCall = {
      id: `tool-call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      toolName,
      parameters,
      timestamp: new Date(),
      status: 'pending',
      category: toolDefinition?.category === 'Clear Thought' ? 'reasoning' : toolDefinition?.category?.toLowerCase() as ToolCall['category'] || 'other',
      description: toolDefinition?.description
    };
    
    const callId = toolContextService.registerToolCall(toolCall);
    
    if (toolCall.status === 'approved') {
      return mcpService.executeTool(toolName, parameters);
    }
    
    return new Promise((resolve, reject) => {
      const approvedSubscription = eventBus.on('tool:approved', (approvedToolCall: ToolCall) => {
        if (approvedToolCall.id === callId) {
          approvedSubscription();
          rejectedSubscription();
          
          mcpService.executeTool(approvedToolCall.toolName, approvedToolCall.parameters)
            .then(resolve)
            .catch(reject);
        }
      });
      
      const rejectedSubscription = eventBus.on('tool:rejected', (rejectedToolCall: ToolCall) => {
        if (rejectedToolCall.id === callId) {
          approvedSubscription();
          rejectedSubscription();
          reject(new Error('Tool execution rejected by user'));
        }
      });
    });
  }

  // Get available models
  async getAvailableModels(): Promise<FreeModelConfig[]> {
    if (!this.apiKey) {
      console.warn('OpenRouter API key not set. Returning empty model list.');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin, // Required by OpenRouter
          'X-Title': 'TanukiMCP Atlas'
        }
      });

      if (!response.ok) {
        console.error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        // Attempt to parse error body
        try {
          const errorData = await response.json();
          console.error('OpenRouter error details:', errorData);
        } catch (e) {
          // Ignore if error body is not JSON
        }
        return []; // Return empty on error
      }

      const apiResponse: OpenRouterAPIResponse = await response.json();
      
      // Filter for free models and map to FreeModelConfig
      // This is a heuristic: models with pricing "0.0" or "0" for prompt/completion, 
      // or IDs containing ":free" are considered free.
      // Also, provide some default rate limits as the /models endpoint doesn't give them.
      const freeModels = apiResponse.data
        .filter(model => 
          (model.id.includes(':free')) || 
          (model.pricing && (model.pricing.prompt === "0.0" || model.pricing.prompt === "0") && (model.pricing.completion === "0.0" || model.pricing.completion === "0"))
        )
        .map((model: OpenRouterModelData): FreeModelConfig => ({
          id: model.id,
          displayName: model.name || model.id, // Use name, fallback to id
          description: model.description || 'N/A',
          // Heuristic for specialization based on model name/description - needs improvement
          specialization: this.determineSpecialization(model),
          isAvailable: true, // Assuming all fetched free models are available
          rateLimits: { // Default rate limits for free models, as API doesn't provide this per model
            requestsPerMinute: 5, // Conservative default
            tokensPerDay: 100000  // Conservative default
          }
        }));

      return freeModels;

    } catch (error) {
      console.error('Failed to fetch or process models from OpenRouter:', error);
      return [];
    }
  }

  // Helper to determine specialization (heuristic, can be improved)
  private determineSpecialization(model: OpenRouterModelData): string[] {
    const specializations: string[] = [];
    const modelIdLower = model.id.toLowerCase();
    const modelNameLower = (model.name || '').toLowerCase();
    const modelDescLower = (model.description || '').toLowerCase();

    if (modelIdLower.includes('cod') || modelNameLower.includes('cod') || modelDescLower.includes('cod')) {
      specializations.push('coding');
    }
    if (modelIdLower.includes('instruct') || modelNameLower.includes('instruct')) {
      specializations.push('instruction-following');
    }
    if (modelIdLower.includes('chat') || modelNameLower.includes('chat') || modelDescLower.includes('chat') || modelIdLower.includes('convers') || modelNameLower.includes('convers')) {
      specializations.push('conversation');
    }
    if (modelIdLower.includes('reason') || modelNameLower.includes('reason') || modelDescLower.includes('reason')) {
      specializations.push('reasoning');
    }
     if (modelIdLower.includes('general') || modelNameLower.includes('general') || modelDescLower.includes('general')) {
      specializations.push('general');
    }
    if (modelIdLower.includes('writing') || modelNameLower.includes('writing') || modelDescLower.includes('writing')) {
      specializations.push('creative-writing');
    }
    if (specializations.length === 0) {
      specializations.push('general'); // Default if no specific keywords found
    }
    return Array.from(new Set(specializations)); // Remove duplicates
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TanukiMCP Atlas'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('OpenRouter health check failed:', error);
      return false;
    }
  }
}