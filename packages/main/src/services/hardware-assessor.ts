interface SystemCapabilities {
  cpu: {
    cores: number;
    threads: number;
    architecture: string;
    clockSpeed: number;
    brand: string;
  };
  memory: {
    total: number;
    available: number;
    type: string;
    speed?: number;
  };
  gpu?: {
    name: string;
    vram: number;
    computeCapability?: string;
    supports: string[];
  }[];
  storage: {
    available: number;
    type: 'SSD' | 'HDD' | 'NVMe';
    speed?: number;
  };
}

interface ModelRecommendation {
  model: RecommendedModel;
  compatibility: 'perfect' | 'good' | 'marginal' | 'incompatible';
  expectedPerformance: {
    tokensPerSecond: number;
    ramUsage: number;
    vramUsage?: number;
    responseTime: number;
  };
  optimizations: OptimizationSuggestion[];
  warnings?: string[];
}

interface RecommendedModel {
  name: string;
  displayName: string;
  description: string;
  size: number;
  parameterCount: string;
  specialization: string[];
}interface OptimizationSuggestion {
  type: string;
  description: string;
  impact: string;
}

export class HardwareAssessor {
  async assessSystemCapabilities(): Promise<SystemCapabilities> {
    const os = require('os');
    
    // CPU Assessment
    const cpus = os.cpus();
    const cpu = {
      cores: os.cpus().length,
      threads: os.cpus().length,
      architecture: os.arch(),
      clockSpeed: cpus[0]?.speed || 0,
      brand: cpus[0]?.model || 'Unknown'
    };
    
    // Memory Assessment
    const memory = {
      total: Math.round(os.totalmem() / (1024 ** 3)),
      available: Math.round(os.freemem() / (1024 ** 3)),
      type: 'DDR4'
    };
    
    // GPU Assessment (platform-specific)
    const gpu = await this.detectGPU();
    
    // Storage Assessment
    const storage = await this.assessStorage();
    
    return { cpu, memory, gpu, storage };
  }

  async getModelRecommendations(
    systemCaps: SystemCapabilities,
    availableModels: RecommendedModel[]
  ): Promise<ModelRecommendation[]> {
    return availableModels.map(model => {
      const compatibility = this.assessCompatibility(model, systemCaps);
      const expectedPerformance = this.predictPerformance(model, systemCaps);
      const optimizations = this.suggestOptimizations(model, systemCaps);
      const warnings = this.generateWarnings(model, systemCaps);
      
      return {
        model,
        compatibility,
        expectedPerformance,
        optimizations,
        warnings: warnings.length > 0 ? warnings : undefined
      };
    }).sort((a, b) => {
      const compatibilityScore = {
        'perfect': 4, 'good': 3, 'marginal': 2, 'incompatible': 1
      };
      
      const scoreA = compatibilityScore[a.compatibility] * a.expectedPerformance.tokensPerSecond;
      const scoreB = compatibilityScore[b.compatibility] * b.expectedPerformance.tokensPerSecond;
      
      return scoreB - scoreA;
    });
  }

  private assessCompatibility(
    model: RecommendedModel,
    system: SystemCapabilities
  ): 'perfect' | 'good' | 'marginal' | 'incompatible' {
    const ramOk = system.memory.available >= (model as any).requirements.minRam;
    const ramGood = system.memory.available >= (model as any).requirements.recommendedRam;
    
    if (!ramOk) return 'incompatible';
    
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      const vramOk = totalVram >= ((model as any).requirements.minVram || 0);
      const vramGood = totalVram >= ((model as any).requirements.recommendedVram || 0);
      
      if (ramGood && vramGood) return 'perfect';
      if (ramGood && vramOk) return 'good';
      if (ramOk) return 'marginal';
    }
    
    if (ramGood) return 'good';
    return 'marginal';
  }

  private predictPerformance(
    model: RecommendedModel,
    system: SystemCapabilities
  ): ModelRecommendation['expectedPerformance'] {
    let tokensPerSecond = (model as any).estimatedPerformance.tokensPerSecondCPU;
    
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      if (totalVram >= ((model as any).requirements.recommendedVram || 0)) {
        tokensPerSecond = (model as any).estimatedPerformance.tokensPerSecondGPU || tokensPerSecond * 2;
      }
    }
    
    const cpuMultiplier = Math.min(system.cpu.cores / 8, 1.5);
    tokensPerSecond *= cpuMultiplier;
    
    return {
      tokensPerSecond: Math.round(tokensPerSecond),
      ramUsage: model.size * 1.2,
      vramUsage: system.gpu ? model.size * 0.8 : undefined,
      responseTime: (100 / tokensPerSecond) * 1000
    };
  }

  private suggestOptimizations(
    model: RecommendedModel,
    system: SystemCapabilities
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    if (system.memory.available < (model as any).requirements.recommendedRam) {
      suggestions.push({
        type: 'quantization',
        description: 'Use Q4_K_M quantization to reduce memory usage',
        impact: 'Reduces RAM usage by 60-70% with minimal quality loss'
      });
    }
    
    if (system.gpu && system.gpu.length > 0) {
      suggestions.push({
        type: 'gpu_acceleration',
        description: 'Enable GPU acceleration for faster inference',
        impact: 'Can improve speed by 2-5x depending on model size'
      });
    }
    
    suggestions.push({
      type: 'context_optimization',
      description: 'Optimize context window based on usage patterns',
      impact: 'Reduces memory usage and improves response time'
    });
    
    return suggestions;
  }
}  private generateWarnings(
    model: RecommendedModel,
    system: SystemCapabilities
  ): string[] {
    const warnings: string[] = [];
    
    if (system.memory.available < (model as any).requirements.minRam) {
      warnings.push('Insufficient RAM - performance will be severely degraded');
    }
    
    if (!system.gpu || system.gpu.length === 0) {
      warnings.push('No GPU detected - will use CPU-only inference (slower)');
    }
    
    if (system.storage.type === 'HDD') {
      warnings.push('HDD storage detected - SSD recommended for better performance');
    }
    
    return warnings;
  }

  private async detectGPU(): Promise<any[]> {
    try {
      if (process.platform === 'win32') {
        return await this.detectWindowsGPU();
      } else if (process.platform === 'linux') {
        return await this.detectLinuxGPU();
      }
      return [];
    } catch (error) {
      console.error('GPU detection failed:', error);
      return [];
    }
  }

  private async detectWindowsGPU(): Promise<any[]> {
    // Windows GPU detection using wmic
    return [];
  }

  private async detectLinuxGPU(): Promise<any[]> {
    // Linux GPU detection using lspci/nvidia-smi
    return [];
  }

  private async assessStorage(): Promise<any> {
    return {
      available: 100,
      type: 'SSD' as const,
      speed: 500
    };
  }
}