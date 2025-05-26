interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
    architecture: string;
  };
  performance?: ModelPerformance;
}

interface ModelPerformance {
  tokensPerSecond: number;
  ramUsage: number;
  vramUsage?: number;
  cpuUsage: number;
  lastBenchmark: Date;
}

interface RecommendedModel {
  name: string;
  displayName: string;
  description: string;
  size: number;
  parameterCount: string;
  specialization: string[];
  requirements: {
    minRam: number;
    recommendedRam: number;
    minVram?: number;
    recommendedVram?: number;
    quantizationOptions?: string[];
  };
  estimatedPerformance: {
    tokensPerSecondCPU: number;
    tokensPerSecondGPU?: number;
    contextLength: number;
  };
}interface GenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_ctx?: number;
    repeat_penalty?: number;
    seed?: number;
    num_thread?: number;
    num_gpu?: number;
    main_gpu?: number;
    low_vram?: boolean;
    f16_kv?: boolean;
    use_mlock?: boolean;
    use_mmap?: boolean;
  };
}

interface SystemInfo {
  cpuCores: number;
  availableRam: number;
  gpuCount: number;
  totalVram: number;
}export class OllamaService {
  private baseUrl = 'http://localhost:11434';
  private performanceCache = new Map<string, ModelPerformance>();

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      
      // Enrich with performance data
      return (data.models || []).map(model => ({
        ...model,
        performance: this.performanceCache.get(model.name)
      }));
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  async checkOllamaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async generate(request: GenerateRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return response.json();
  }

  async getModelCatalog(): Promise<RecommendedModel[]> {
    return [
      {
        name: 'qwq:32b',
        displayName: 'QwQ-32B',
        description: 'Advanced reasoning model with chain-of-thought capabilities',
        size: 19.8,
        parameterCount: '32B',
        specialization: ['reasoning', 'mathematics', 'analysis'],
        requirements: {
          minRam: 24,
          recommendedRam: 32,
          minVram: 12,
          recommendedVram: 20,
          quantizationOptions: ['Q4_K_M', 'Q5_K_M', 'Q8_0']
        },
        estimatedPerformance: {
          tokensPerSecondCPU: 12,
          tokensPerSecondGPU: 28,
          contextLength: 32768
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:32b',
        displayName: 'DeepSeek R1 Distill Qwen 32B',
        description: 'Distilled reasoning model optimized for efficiency',
        size: 14.9,
        parameterCount: '32B',
        specialization: ['reasoning', 'coding', 'problem-solving'],
        requirements: {
          minRam: 18,
          recommendedRam: 24,
          minVram: 8,
          recommendedVram: 14,
          quantizationOptions: ['Q4_K_M', 'Q5_K_M']
        },
        estimatedPerformance: {
          tokensPerSecondCPU: 10,
          tokensPerSecondGPU: 25,
          contextLength: 32768
        }
      }
    ];
  }  async pullModelWithOptimization(
    name: string, 
    onProgress?: (progress: any) => void
  ): Promise<void> {
    await this.setOptimizationFlags();
    
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stream: true })
    });

    if (!response.body) throw new Error('No response body');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const progress = JSON.parse(line);
          onProgress?.(progress);
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }
    
    await this.benchmarkModel(name);
  }

  private async setOptimizationFlags(): Promise<void> {
    process.env.OLLAMA_FLASH_ATTENTION = '1';
    process.env.OLLAMA_KV_CACHE_TYPE = 'q8_0';
    process.env.OLLAMA_NUM_PARALLEL = '4';
    process.env.OLLAMA_MAX_LOADED_MODELS = '2';
  }

  async benchmarkModel(modelName: string): Promise<ModelPerformance> {
    const startTime = Date.now();
    const testPrompt = "Write a short explanation of quantum computing in simple terms.";
    
    try {
      const response = await this.generate({
        model: modelName,
        prompt: testPrompt,
        options: { num_ctx: 2048 }
      });
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      const estimatedTokens = response.response?.length / 4 || 100;
      const tokensPerSecond = (estimatedTokens / executionTime) * 1000;
      
      const performance: ModelPerformance = {
        tokensPerSecond,
        ramUsage: await this.getModelMemoryUsage(modelName),
        cpuUsage: 0,
        lastBenchmark: new Date()
      };
      
      this.performanceCache.set(modelName, performance);
      return performance;
    } catch (error) {
      throw new Error(`Benchmark failed for ${modelName}: ${error}`);
    }
  }

  async generateWithOptimization(request: GenerateRequest): Promise<any> {
    const optimizedRequest = await this.optimizeRequest(request);
    
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(optimizedRequest)
    });
    return response.json();
  }

  private async optimizeRequest(request: GenerateRequest): Promise<GenerateRequest> {
    const systemInfo = await this.getSystemInfo();
    
    return {
      ...request,
      options: {
        ...request.options,
        num_thread: Math.min(systemInfo.cpuCores, 8),
        num_gpu: systemInfo.gpuCount,
        num_ctx: this.calculateOptimalContextLength(request.model, systemInfo),
        f16_kv: systemInfo.availableRam > 16,
        use_mlock: systemInfo.availableRam > 32,
        use_mmap: true
      }
    };
  }

  private async getSystemInfo(): Promise<SystemInfo> {
    const os = require('os');
    return {
      cpuCores: os.cpus().length,
      availableRam: Math.round(os.freemem() / (1024 ** 3)),
      gpuCount: 0,
      totalVram: 0
    };
  }

  private calculateOptimalContextLength(modelName: string, systemInfo: SystemInfo): number {
    const baseContext = 2048;
    const maxContext = 32768;
    
    if (systemInfo.availableRam > 16) {
      return Math.min(maxContext, baseContext * 4);
    } else if (systemInfo.availableRam > 8) {
      return Math.min(maxContext, baseContext * 2);
    }
    
    return baseContext;
  }

  private async getModelMemoryUsage(modelName: string): Promise<number> {
    const models = await this.listModels();
    const model = models.find(m => m.name === modelName);
    return model ? model.size * 1.2 : 0;
  }

  async deleteModel(modelName: string): Promise<void> {
    await fetch(`${this.baseUrl}/api/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName })
    });
    
    this.performanceCache.delete(modelName);
  }

  getPerformanceMetrics(modelName: string): ModelPerformance | undefined {
    return this.performanceCache.get(modelName);
  }
}