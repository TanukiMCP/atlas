# LLM Integration Architecture (OpenRouter)

## 🚀 OpenRouter Service Interface

All Large Language Model (LLM) functionalities in TanukiMCP Atlas are accessed exclusively through the OpenRouter API. A dedicated `OpenRouterService` within the Electron main process manages this integration.

```typescript
interface OpenRouterService {
  // Initialize with the user's API key
  initialize(apiKey: string): Promise<boolean>;

  // List available models from OpenRouter (with potential caching)
  listModels(filter?: ModelFilter): Promise<OpenRouterModel[]>;

  // Get details for a specific model
  getModelDetails(modelId: string): Promise<OpenRouterModel | null>;

  // Generate text completion (non-streaming)
  generate(request: OpenRouterGenerateRequest): Promise<OpenRouterGenerateResponse>;

  // Stream text completion
  stream(request: OpenRouterStreamRequest): AsyncIterable<OpenRouterStreamResponseChunk>;

  // Get embeddings (if supported by the model and OpenRouter)
  getEmbeddings?(request: OpenRouterEmbeddingsRequest): Promise<OpenRouterEmbeddingsResponse>;

  // Check the health/connectivity to OpenRouter and validity of API key
  healthCheck(): Promise<{ connected: boolean; authenticated: boolean; error?: string }>;

  // Store and retrieve the API key securely
  setApiKey(apiKey: string): Promise<void>;
  getApiKey(): Promise<string | null>;
  clearApiKey(): Promise<void>;
}

interface OpenRouterConfig {
  // API key is managed by OpenRouterService, not directly in a static config here
  defaultModelId?: string;    // User-preferred default model for general tasks
  timeoutMs: number;         // Request timeout in ms (e.g., 30000)
  maxRetries: number;        // Max retry attempts for network issues (e.g., 3)
}

// --- Request and Response Structures (Simplified examples) ---

interface OpenRouterModel {
  id: string;                // e.g., "anthropic/claude-3-haiku"
  name: string;              // Human-readable name (e.g., "Claude 3 Haiku")
  description?: string;
  pricing: { prompt: string; completion: string; request?: string; image?: string };
  context_length?: number;
  architecture?: { modality: string; tokenizer: string; };
  // ... other fields provided by OpenRouter API
}

interface ModelFilter {
  freeOnly?: boolean;
  minContextLength?: number;
  // ... other potential filters based on OpenRouter model properties
}

interface OpenRouterGenerateRequest {
  model: string; // Model ID
  prompt?: string;
  messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  // ... other OpenRouter supported generation parameters
  stream?: false; // Explicitly false for non-streaming
}

interface OpenRouterGenerateResponse {
  id?: string;
  choices: Array<{
    message?: { role: string; content: string; };
    text?: string; // For older completion models
    finish_reason?: string;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  // ... other OpenRouter response fields
}

interface OpenRouterStreamRequest extends Omit<OpenRouterGenerateRequest, 'stream'> {
  stream: true;
}

interface OpenRouterStreamResponseChunk {
  id?: string;
  choices: Array<{
    delta?: { role?: string; content?: string; };
    text?: string; // For older completion models
    finish_reason?: string;
  }>;
  // ... other OpenRouter streaming response fields
}

// Embeddings are optional and depend on OpenRouter and model support
interface OpenRouterEmbeddingsRequest {
  model: string;
  input: string | string[];
}

interface OpenRouterEmbeddingsResponse {
  data: Array<{ embedding: number[]; index: number; }>;
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}
```

## 🎯 Model Management

Model management is simplified due to the OpenRouter-exclusive architecture:

1.  **No Local Installation/Management**: The application does not download, install, or manage local model files. All models are accessed via the OpenRouter API.
2.  **Dynamic Listing**: The `OpenRouterService` fetches the list of available models (including free and paid tiers) directly from OpenRouter.
3.  **User Selection**: Users can select their preferred models from the list provided by OpenRouter, often filtered by criteria like "free only".
4.  **API Key Management**: Secure storage and handling of the user's OpenRouter API key is a critical function of the `OpenRouterService`.
5.  **Capability Discovery**: Model capabilities (context length, supported modalities, pricing) are discovered through the OpenRouter API rather than being hardcoded or locally defined.

This approach eliminates the complexity of local model setup, resource management, and quantization, focusing instead on providing a seamless interface to the diverse range of models available through OpenRouter.