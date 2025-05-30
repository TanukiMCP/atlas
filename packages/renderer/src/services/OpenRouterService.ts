import { mcpService } from './mcp-service';
import { toolContextService } from './ToolContextService';
import { eventBus } from './event-bus';

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
    
    // Get available tools
    const availableTools = mcpService.getAvailableTools('agent');
    
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
        tools: availableTools.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters || {}
          }
        }))
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
    // Register the tool call for approval if needed
    const toolCall = {
      id: `tool-call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      toolName,
      parameters,
      timestamp: new Date(),
      status: 'pending'
    };
    
    const callId = toolContextService.registerToolCall(toolCall);
    
    // If auto-approved, execute immediately
    if (toolCall.status === 'approved') {
      return mcpService.executeTool({
        toolName,
        parameters,
        requestId: callId
      });
    }
    
    // Otherwise, wait for approval/rejection
    return new Promise((resolve, reject) => {
      const approvedSubscription = eventBus.on('tool:approved', (approvedToolCall: any) => {
        if (approvedToolCall.id === callId) {
          approvedSubscription();
          rejectedSubscription();
          
          // Execute the approved tool
          mcpService.executeTool({
            toolName,
            parameters,
            requestId: callId
          })
            .then(resolve)
            .catch(reject);
        }
      });
      
      const rejectedSubscription = eventBus.on('tool:rejected', (rejectedToolCall: any) => {
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
    const freeModels = [
      {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        displayName: 'Llama 3.1 8B (Free)',
        description: 'Fast and capable model for general conversation and reasoning',
        specialization: ['conversation', 'reasoning', 'general'],
        isAvailable: true,
        rateLimits: {
          requestsPerMinute: 10,
          tokensPerDay: 200000
        }
      },
      {
        id: 'google/gemma-2-9b-it:free',
        displayName: 'Gemma 2 9B (Free)',
        description: 'Google\'s efficient model optimized for instruction following',
        specialization: ['conversation', 'instruction-following', 'coding'],
        isAvailable: true,
        rateLimits: {
          requestsPerMinute: 10,
          tokensPerDay: 200000
        }
      },
      {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        displayName: 'Phi-3 Mini (Free)',
        description: 'Compact yet powerful model from Microsoft, great for coding tasks',
        specialization: ['coding', 'problem-solving', 'reasoning'],
        isAvailable: true,
        rateLimits: {
          requestsPerMinute: 15,
          tokensPerDay: 100000
        }
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        displayName: 'Mistral 7B (Free)',
        description: 'Balanced model with strong multilingual capabilities',
        specialization: ['conversation', 'multilingual', 'creative-writing'],
        isAvailable: true,
        rateLimits: {
          requestsPerMinute: 10,
          tokensPerDay: 150000
        }
      }
    ];
    
    return freeModels;
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