/**
 * TanukiMCP Apollo Service - Advanced Model Management
 * Named after Apollo, Greek god of knowledge, prophecy, and enlightenment
 * Provides comprehensive model discovery, installation, configuration, and optimization
 */

import { 
  TanukiModel, 
  ModelInstallation, 
  ModelConfiguration, 
  ModelPerformance, 
  SystemCapabilities,
  ModelCategory,
  ModelCapability
} from '../types';

export class TanukiApolloService {
  private baseUrl = 'http://127.0.0.1:11434';
  private currentModel: string | null = null;
  private installations = new Map<string, ModelInstallation>();
  private configurations = new Map<string, ModelConfiguration>();
  private performanceCache = new Map<string, ModelPerformance>();

  /**
   * Get all installed models with enhanced metadata
   */
  async getInstalledModels(): Promise<TanukiModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      
      return (data.models || []).map(model => this.enrichModelData(model, true));
    } catch (error) {
      console.error('Failed to get installed models:', error);
      return [];
    }
  }

  /**
   * Get comprehensive model catalog with Greek mythology categorization
   */
  async getModelCatalog(): Promise<TanukiModel[]> {
    return [
      // TanukiMCP Apollo - Knowledge & Reasoning Models
      {
        name: 'qwq:32b',
        displayName: 'QwQ-32B (Apollo)',
        description: 'Advanced reasoning model with chain-of-thought capabilities. Perfect for complex analysis and mathematical reasoning.',
        size: 19.8,
        parameterCount: '32B',
        family: 'qwq',
        isInstalled: false,
        capabilities: ['reasoning', 'mathematics', 'analysis', 'problem-solving'],
        category: 'tanukimcp-apollo',
        requirements: {
          minRam: 24,
          recommendedRam: 32,
          minVram: 12,
          recommendedVram: 20,
          diskSpace: 20
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:32b',
        displayName: 'DeepSeek R1 Distill (Apollo)',
        description: 'Distilled reasoning model optimized for efficiency while maintaining strong analytical capabilities.',
        size: 14.9,
        parameterCount: '32B',
        family: 'deepseek',
        isInstalled: false,
        capabilities: ['reasoning', 'coding', 'problem-solving', 'analysis'],
        category: 'tanukimcp-apollo',
        requirements: {
          minRam: 18,
          recommendedRam: 24,
          minVram: 8,
          recommendedVram: 14,
          diskSpace: 15
        }
      },

      // TanukiMCP Athena - Strategy & Coding Models
      {
        name: 'deepseek-coder-v2:16b',
        displayName: 'DeepSeek Coder V2 (Athena)',
        description: 'Strategic coding model with advanced programming capabilities and architectural insight.',
        size: 9.4,
        parameterCount: '16B',
        family: 'deepseek',
        isInstalled: false,
        capabilities: ['coding', 'problem-solving', 'analysis'],
        category: 'tanukimcp-athena',
        requirements: {
          minRam: 12,
          recommendedRam: 16,
          minVram: 6,
          recommendedVram: 10,
          diskSpace: 10
        }
      },
      {
        name: 'codellama:34b',
        displayName: 'Code Llama 34B (Athena)',
        description: 'Meta\'s strategic coding model with excellent architectural planning and code generation.',
        size: 19.0,
        parameterCount: '34B',
        family: 'llama',
        isInstalled: false,
        capabilities: ['coding', 'problem-solving', 'analysis'],
        category: 'tanukimcp-athena',
        requirements: {
          minRam: 20,
          recommendedRam: 24,
          minVram: 10,
          recommendedVram: 16,
          diskSpace: 20
        }
      },

      // TanukiMCP Hermes - Communication & Chat Models
      {
        name: 'llama3.2:3b',
        displayName: 'Llama 3.2 3B (Hermes)',
        description: 'Fast and efficient communication model, perfect for quick conversations and assistance.',
        size: 2.0,
        parameterCount: '3B',
        family: 'llama',
        isInstalled: false,
        capabilities: ['conversation', 'creative-writing', 'multilingual'],
        category: 'tanukimcp-hermes',
        requirements: {
          minRam: 4,
          recommendedRam: 6,
          minVram: 2,
          recommendedVram: 4,
          diskSpace: 3
        }
      },
      {
        name: 'mistral:7b',
        displayName: 'Mistral 7B (Hermes)',
        description: 'Balanced communication model with excellent conversational abilities and multilingual support.',
        size: 4.1,
        parameterCount: '7B',
        family: 'mistral',
        isInstalled: false,
        capabilities: ['conversation', 'creative-writing', 'multilingual', 'reasoning'],
        category: 'tanukimcp-hermes',
        requirements: {
          minRam: 8,
          recommendedRam: 10,
          minVram: 4,
          recommendedVram: 6,
          diskSpace: 5
        }
      },

      // TanukiMCP Artemis - Specialized & Hunting Models
      {
        name: 'phi3:14b',
        displayName: 'Phi-3 14B (Artemis)',
        description: 'Specialized model for precise tasks and focused problem hunting with high accuracy.',
        size: 7.9,
        parameterCount: '14B',
        family: 'phi',
        isInstalled: false,
        capabilities: ['reasoning', 'problem-solving', 'analysis'],
        category: 'tanukimcp-artemis',
        requirements: {
          minRam: 10,
          recommendedRam: 14,
          minVram: 5,
          recommendedVram: 8,
          diskSpace: 8
        }
      },

      // TanukiMCP Hephaestus - Tool & Creation Models
      {
        name: 'llama3.2:1b',
        displayName: 'Llama 3.2 1B (Hephaestus)',
        description: 'Lightweight tool creation model, perfect for quick tasks and efficient processing.',
        size: 1.3,
        parameterCount: '1B',
        family: 'llama',
        isInstalled: false,
        capabilities: ['conversation', 'problem-solving'],
        category: 'tanukimcp-hephaestus',
        requirements: {
          minRam: 2,
          recommendedRam: 4,
          minVram: 1,
          recommendedVram: 2,
          diskSpace: 2
        }
      },

      // TanukiMCP Dionysus - Creative & Experimental Models
      {
        name: 'llama3.1:8b',
        displayName: 'Llama 3.1 8B (Dionysus)',
        description: 'Creative and experimental model with strong creative writing and innovative thinking capabilities.',
        size: 4.7,
        parameterCount: '8B',
        family: 'llama',
        isInstalled: false,
        capabilities: ['creative-writing', 'conversation', 'reasoning'],
        category: 'tanukimcp-dionysus',
        requirements: {
          minRam: 8,
          recommendedRam: 10,
          minVram: 4,
          recommendedVram: 6,
          diskSpace: 5
        }
      }
    ];
  }

  /**
   * Install a model with progress tracking
   */
  async installModel(modelName: string, onProgress?: (progress: ModelInstallation) => void): Promise<void> {
    const installation: ModelInstallation = {
      modelName,
      status: 'downloading',
      progress: 0,
      startedAt: new Date()
    };

    this.installations.set(modelName, installation);
    onProgress?.(installation);

    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName, stream: true })
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
            
            if (progress.total && progress.completed) {
              installation.progress = Math.round((progress.completed / progress.total) * 100);
            }
            
            if (progress.status === 'success') {
              installation.status = 'completed';
              installation.progress = 100;
            }

            this.installations.set(modelName, installation);
            onProgress?.(installation);
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }

      // Benchmark the newly installed model
      await this.benchmarkModel(modelName);

    } catch (error) {
      installation.status = 'failed';
      installation.error = error.message;
      this.installations.set(modelName, installation);
      onProgress?.(installation);
      throw error;
    }
  }

  /**
   * Uninstall a model
   */
  async uninstallModel(modelName: string): Promise<void> {
    await fetch(`${this.baseUrl}/api/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName })
    });

    this.performanceCache.delete(modelName);
    this.configurations.delete(modelName);
  }

  /**
   * Switch to a different model
   */
  async switchModel(modelName: string): Promise<void> {
    this.currentModel = modelName;
    
    // Warm up the model with a simple request
    try {
      await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: 'Hello',
          stream: false
        })
      });
    } catch (error) {
      console.warn('Model warmup failed:', error);
    }
  }

  /**
   * Get current model
   */
  getCurrentModel(): string | null {
    return this.currentModel;
  }

  /**
   * Configure model parameters
   */
  setModelConfiguration(modelName: string, config: Partial<ModelConfiguration>): void {
    const existing = this.configurations.get(modelName) || {
      modelName,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repeatPenalty: 1.1,
      contextLength: 4096,
      isDefault: false
    };

    this.configurations.set(modelName, { ...existing, ...config });
  }

  /**
   * Get model configuration
   */
  getModelConfiguration(modelName: string): ModelConfiguration | undefined {
    return this.configurations.get(modelName);
  }

  /**
   * Benchmark model performance
   */
  async benchmarkModel(modelName: string): Promise<ModelPerformance> {
    const startTime = Date.now();
    const testPrompt = "Explain the concept of recursion in programming in exactly 50 words.";

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: testPrompt,
          stream: false
        })
      });

      const data = await response.json();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const tokenCount = data.response?.split(' ').length || 0;
      const tokensPerSecond = tokenCount / duration;

      const performance: ModelPerformance = {
        tokensPerSecond,
        memoryUsage: 0, // Would need system monitoring
        contextLength: data.context?.length || 4096,
        averageLatency: duration * 1000, // milliseconds
        benchmarkScore: Math.round(tokensPerSecond * 10) // Simple scoring
      };

      this.performanceCache.set(modelName, performance);
      return performance;
    } catch (error) {
      console.error('Benchmark failed:', error);
      throw error;
    }
  }

  /**
   * Get installation status
   */
  getInstallationStatus(modelName: string): ModelInstallation | undefined {
    return this.installations.get(modelName);
  }

  /**
   * Get all active installations
   */
  getActiveInstallations(): ModelInstallation[] {
    return Array.from(this.installations.values())
      .filter(installation => installation.status === 'downloading' || installation.status === 'installing');
  }

  /**
   * Get system capabilities for model recommendations
   */
  async getSystemCapabilities(): Promise<SystemCapabilities> {
    // This would typically come from the main process
    // For now, return mock data that can be enhanced later
    return {
      totalRam: 16,
      availableRam: 12,
      totalVram: 8,
      availableVram: 6,
      cpuCores: 8,
      gpuInfo: {
        name: 'NVIDIA RTX 4060',
        memory: 8192,
        computeCapability: '8.9'
      },
      diskSpace: 500,
      recommendedModels: ['llama3.2:3b', 'mistral:7b', 'phi3:14b']
    };
  }

  /**
   * Get model recommendations based on system capabilities
   */
  async getRecommendedModels(): Promise<TanukiModel[]> {
    const capabilities = await this.getSystemCapabilities();
    const catalog = await this.getModelCatalog();

    return catalog.filter(model => 
      model.requirements.minRam <= capabilities.availableRam &&
      model.requirements.diskSpace <= capabilities.diskSpace
    ).sort((a, b) => {
      // Prioritize models that fit well within system capabilities
      const aFit = capabilities.availableRam / a.requirements.recommendedRam;
      const bFit = capabilities.availableRam / b.requirements.recommendedRam;
      return bFit - aFit;
    });
  }

  /**
   * Enrich model data with performance and metadata
   */
  private enrichModelData(rawModel: any, isInstalled: boolean): TanukiModel {
    const performance = this.performanceCache.get(rawModel.name);
    
    // Categorize model based on name patterns
    let category: ModelCategory = 'tanukimcp-hermes'; // default
    let capabilities: ModelCapability[] = ['conversation'];

    if (rawModel.name.includes('qwq') || rawModel.name.includes('deepseek-r1')) {
      category = 'tanukimcp-apollo';
      capabilities = ['reasoning', 'mathematics', 'analysis'];
    } else if (rawModel.name.includes('coder') || rawModel.name.includes('codellama')) {
      category = 'tanukimcp-athena';
      capabilities = ['coding', 'problem-solving'];
    } else if (rawModel.name.includes('phi')) {
      category = 'tanukimcp-artemis';
      capabilities = ['reasoning', 'problem-solving'];
    } else if (rawModel.name.includes('1b') || rawModel.name.includes('3b')) {
      category = 'tanukimcp-hephaestus';
      capabilities = ['conversation', 'problem-solving'];
    }

    return {
      name: rawModel.name,
      displayName: rawModel.name,
      description: `${rawModel.details?.family || 'Unknown'} model with ${rawModel.details?.parameter_size || 'unknown'} parameters`,
      size: rawModel.size / (1024 * 1024 * 1024), // Convert to GB
      parameterCount: rawModel.details?.parameter_size || 'Unknown',
      family: rawModel.details?.family || 'unknown',
      quantization: rawModel.details?.quantization_level,
      isInstalled,
      performance,
      capabilities,
      category,
      requirements: {
        minRam: 4,
        recommendedRam: 8,
        diskSpace: rawModel.size / (1024 * 1024 * 1024)
      }
    };
  }

  /**
   * Check if OpenRouter service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
} 