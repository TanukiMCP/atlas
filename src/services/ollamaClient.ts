interface OllamaModel {
  name: string;
  size: string;
  digest: string;
  modified_at: string;
}

interface OllamaModelList {
  models: OllamaModel[];
}

class OllamaClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    return response.json();
  }

  async listModels(): Promise<OllamaModelList> {
    return this.request<OllamaModelList>('/api/tags');
  }

  async pullModel(modelName: string, onProgress?: (progress: number) => void): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: modelName }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Parse the chunk as UTF-8 text
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.status === 'downloading' && data.completed && data.total) {
            const progress = (data.completed / data.total) * 100;
            onProgress?.(progress);
          }
        } catch (e) {
          console.warn('Failed to parse Ollama response chunk:', e);
        }
      }
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    await this.request('/api/delete', {
      method: 'DELETE',
      body: JSON.stringify({ name: modelName }),
    });
  }

  async getModelInfo(modelName: string): Promise<OllamaModel> {
    return this.request<OllamaModel>(`/api/show`, {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });
  }

  // Generate a response from a model
  async generate(modelName: string, prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    stream?: boolean;
    onToken?: (token: string) => void;
  } = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
          top_p: options.topP,
          top_k: options.topK,
        },
        stream: options.stream,
      }),
    });

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
  }
}

// Create a singleton instance
export const ollamaClient = new OllamaClient();

// Export the class for testing or custom instances
export { OllamaClient }; 