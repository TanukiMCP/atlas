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

export class OpenRouterService {
  private baseUrl = 'https://openrouter.ai/api/v1';
  private apiKey: string | null = null;
  private freeModels: FreeModelConfig[] = [
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

  constructor() {
    // API key is optional for free models, but improves rate limits when provided
    this.apiKey = process.env.OPENROUTER_API_KEY || null;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey || null;
  }

  async checkHealth(): Promise<{
    isConnected: boolean;
    availableModels: FreeModelConfig[];
    lastChecked: Date;
    error?: string;
  }> {
    try {
      const availableModels = await this.getAvailableFreeModels();
      return {
        isConnected: true,
        availableModels,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        isConnected: false,
        availableModels: [],
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAvailableFreeModels(): Promise<FreeModelConfig[]> {
    try {
      // For free models, we return our curated list
      // In a real implementation, you might want to verify availability via API
      return this.freeModels.filter(model => model.isAvailable);
    } catch (error) {
      console.error('Failed to get available free models:', error);
      return [];
    }
  }

  // Ensure model is a free model (used to enforce free-only approach)
  ensureFreeModel(modelId: string): string {
    // If the provided model ID is in our free model list, use it
    const isFreeModel = this.freeModels.some(model => model.id === modelId);
    
    if (isFreeModel) {
      return modelId;
    }
    
    // If not a free model, return the default free model
    console.log(`Warning: Non-free model requested (${modelId}). Using default free model instead.`);
    return 'meta-llama/llama-3.1-8b-instruct:free';
  }

  async generate(request: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }): Promise<{
    content: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }> {
    // Ensure we're only using free models
    const model = this.ensureFreeModel(request.model);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://tanukimcp.com',
      'X-Title': 'TanukiMCP Atlas'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: false // For simplicity, we'll start without streaming
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  }

  async getModelRecommendations(taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general'): Promise<FreeModelConfig[]> {
    const availableModels = await this.getAvailableFreeModels();
    
    return availableModels
      .filter(model => model.specialization.includes(taskType) || model.specialization.includes('general'))
      .sort((a, b) => {
        // Prioritize models that specialize in the requested task
        const aSpecific = a.specialization.includes(taskType) ? 1 : 0;
        const bSpecific = b.specialization.includes(taskType) ? 1 : 0;
        return bSpecific - aSpecific;
      });
  }

  // Helper method to get the best free model for a task
  async getBestFreeModelForTask(taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general'): Promise<FreeModelConfig | null> {
    const recommendations = await this.getModelRecommendations(taskType);
    return recommendations.length > 0 ? recommendations[0] : null;
  }

  // Check if we have enough quota for a request (simplified implementation)
  canMakeRequest(modelId: string, estimatedTokens: number): boolean {
    // In a real implementation, this would track actual usage
    // For now, we assume we can always make requests within reasonable limits
    return estimatedTokens < 4000; // Conservative token limit per request
  }

  getModelInfo(modelId: string): FreeModelConfig | null {
    return this.freeModels.find(model => model.id === modelId) || null;
  }
} 