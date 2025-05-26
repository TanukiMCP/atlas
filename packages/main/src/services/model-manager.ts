import { OllamaService } from './ollama-service';
import { HardwareAssessor } from './hardware-assessor';

interface ModelInstallation {
  modelName: string;
  status: 'downloading' | 'installing' | 'completed' | 'failed';
  progress: number;
  estimatedTime?: number;
  error?: string;
}

interface ModelConfiguration {
  name: string;
  parameters: {
    temperature: number;
    top_p: number;
    top_k: number;
    num_ctx: number;
    repeat_penalty: number;
    seed?: number;
  };
  optimizations: {
    quantization?: string;
    num_thread?: number;
    num_gpu?: number;
    f16_kv?: boolean;
    use_mlock?: boolean;
    use_mmap?: boolean;
  };
  isDefault: boolean;
}

export class ModelManager {
  private ollamaService: OllamaService;
  private hardwareAssessor: HardwareAssessor;
  private installations = new Map<string, ModelInstallation>();
  private configurations = new Map<string, ModelConfiguration>();

  constructor() {
    this.ollamaService = new OllamaService();
    this.hardwareAssessor = new HardwareAssessor();
  }

  async getRecommendedModels(): Promise<any[]> {
    const catalog = await this.ollamaService.getModelCatalog();
    const systemCaps = await this.hardwareAssessor.assessSystemCapabilities();
    
    return this.hardwareAssessor.getModelRecommendations(systemCaps, catalog);
  }

  async installModel(
    modelName: string,
    onProgress?: (progress: ModelInstallation) => void
  ): Promise<void> {
    const installation: ModelInstallation = {
      modelName,
      status: 'downloading',
      progress: 0
    };
    
    this.installations.set(modelName, installation);
    onProgress?.(installation);
    
    try {
      await this.ollamaService.pullModelWithOptimization(modelName, (progress) => {
        installation.progress = this.calculateProgress(progress);
        installation.status = progress.status === 'success' ? 'completed' : 'downloading';
        this.installations.set(modelName, installation);
        onProgress?.(installation);
      });
      
      installation.status = 'completed';
      installation.progress = 100;
      this.installations.set(modelName, installation);
      onProgress?.(installation);
      
    } catch (error) {
      installation.status = 'failed';
      installation.error = error.message;
      this.installations.set(modelName, installation);
      onProgress?.(installation);
      throw error;
    }
  }

  async uninstallModel(modelName: string): Promise<void> {
    try {
      await this.ollamaService.deleteModel(modelName);
      this.installations.delete(modelName);
      this.configurations.delete(modelName);
    } catch (error) {
      throw new Error(`Failed to uninstall model ${modelName}: ${error.message}`);
    }
  }

  private calculateProgress(progress: any): number {
    if (progress.completed && progress.total) {
      return Math.round((progress.completed / progress.total) * 100);
    }
    return 0;
  }

  getInstallationStatus(modelName: string): ModelInstallation | undefined {
    return this.installations.get(modelName);
  }
}