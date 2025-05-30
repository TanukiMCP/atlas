# LLM Integration Architecture

## 🧠 Ollama Service Interface

```typescript
interface OllamaService {
  client: OllamaClient;
  listModels(): Promise<OllamaModel[]>;
  pullModel(name: string, onProgress?: (progress: PullProgress) => void): Promise<void>;
  deleteModel(name: string): Promise<void>;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  stream(request: StreamRequest): AsyncIterable<StreamResponse>;
  healthCheck(): Promise<HealthStatus>;
  getSystemInfo(): Promise<SystemInfo>;
}

interface OllamaConfig {
  endpoint: string;           // Default: http://localhost:11434
  model: string;             // Currently active model
  fallbackModel?: string;    // Fallback if primary fails
  parameters: {
    temperature: number;     // 0.0 - 2.0
    top_p: number;          // 0.0 - 1.0
    top_k: number;          // 1 - 100
    repeat_penalty: number;  // 0.0 - 2.0
    context_length: number;  // 2048 - 32768
    batch_size: number;      // 1 - 512
  };
  performance: {
    timeout: number;         // Request timeout in ms
    maxRetries: number;      // Max retry attempts
    concurrentRequests: number; // Max concurrent requests
  };
  streaming: {
    enabled: boolean;        // Enable streaming responses
    chunkSize: number;       // Stream chunk size
    bufferSize: number;      // Response buffer size
  };
}
```

## 🎯 Model Management

```typescript
interface OllamaModel {
  name: string;              // Model identifier (llama3.2:3b)
  displayName: string;       // Human-readable name
  size: number;             // Model size in bytes
  quantization: string;      // Quantization type (Q4_0, Q8_0, etc.)
  family: string;           // Model family (llama, mistral, etc.)
  capabilities: ModelCapabilities;
  performance: ModelPerformance;
  isInstalled: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
}

interface ModelCapabilities {
  maxContextLength: number;
  supportsFunction: boolean;    // Function calling support
  supportsImages: boolean;      // Vision capabilities
  supportsCode: boolean;        // Code generation quality
  languages: string[];          // Supported languages
  specializations: string[];    // math, reasoning, creative, etc.
}
```