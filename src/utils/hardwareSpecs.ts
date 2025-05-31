import os from 'os';
import si from 'systeminformation';

export interface HardwareSpecs {
  totalMemoryGB: number;
  freeMemoryGB: number;
  cpuCores: number;
  gpuInfo: {
    name: string;
    memoryGB: number;
    isVulkan: boolean;
  }[];
  diskSpaceGB: number;
  osInfo: {
    platform: string;
    version: string;
  };
}

export interface ModelRequirements {
  minRAMGB: number;
  minVRAMGB: number;
  minCPUCores: number;
  minDiskSpaceGB: number;
  recommendedGPU: boolean;
}

// Hardware scanning function
export async function scanHardwareSpecs(): Promise<HardwareSpecs> {
  const [cpuData, memData, gpuData, diskData] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.graphics(),
    si.fsSize()
  ]);

  const gpuInfo = gpuData.controllers.map(gpu => ({
    name: gpu.name,
    memoryGB: gpu.memoryTotal / 1024,
    isVulkan: gpu.vendor.toLowerCase().includes('nvidia') || gpu.vendor.toLowerCase().includes('amd')
  }));

  return {
    totalMemoryGB: Math.round(memData.total / (1024 * 1024 * 1024)),
    freeMemoryGB: Math.round(memData.available / (1024 * 1024 * 1024)),
    cpuCores: cpuData.physicalCores,
    gpuInfo,
    diskSpaceGB: Math.round(diskData[0].size / (1024 * 1024 * 1024)),
    osInfo: {
      platform: os.platform(),
      version: os.release()
    }
  };
}

// Model requirements mapping
export const MODEL_REQUIREMENTS: Record<string, ModelRequirements> = {
  '3B': {
    minRAMGB: 8,
    minVRAMGB: 4,
    minCPUCores: 4,
    minDiskSpaceGB: 12,
    recommendedGPU: false
  },
  '7B': {
    minRAMGB: 16,
    minVRAMGB: 8,
    minCPUCores: 4,
    minDiskSpaceGB: 16,
    recommendedGPU: true
  },
  '13B': {
    minRAMGB: 32,
    minVRAMGB: 16,
    minCPUCores: 8,
    minDiskSpaceGB: 24,
    recommendedGPU: true
  },
  '33B': {
    minRAMGB: 64,
    minVRAMGB: 24,
    minCPUCores: 8,
    minDiskSpaceGB: 32,
    recommendedGPU: true
  },
  '70B': {
    minRAMGB: 128,
    minVRAMGB: 48,
    minCPUCores: 16,
    minDiskSpaceGB: 64,
    recommendedGPU: true
  }
};

// Check if system meets model requirements
export function checkModelCompatibility(
  specs: HardwareSpecs,
  modelSize: keyof typeof MODEL_REQUIREMENTS
): {
  compatible: boolean;
  reason?: string;
  warnings: string[];
} {
  const requirements = MODEL_REQUIREMENTS[modelSize];
  const warnings: string[] = [];

  if (!requirements) {
    return { compatible: false, reason: 'Unknown model size', warnings };
  }

  if (specs.totalMemoryGB < requirements.minRAMGB) {
    return {
      compatible: false,
      reason: `Insufficient RAM: ${specs.totalMemoryGB}GB available, ${requirements.minRAMGB}GB required`,
      warnings
    };
  }

  if (requirements.recommendedGPU) {
    const hasCapableGPU = specs.gpuInfo.some(gpu => gpu.memoryGB >= requirements.minVRAMGB);
    if (!hasCapableGPU) {
      if (modelSize === '7B' || modelSize === '13B') {
        warnings.push(`No GPU with ${requirements.minVRAMGB}GB VRAM found. Model will run slower on CPU.`);
      } else {
        return {
          compatible: false,
          reason: `GPU with ${requirements.minVRAMGB}GB VRAM required for this model size`,
          warnings
        };
      }
    }
  }

  if (specs.cpuCores < requirements.minCPUCores) {
    warnings.push(`CPU cores (${specs.cpuCores}) below recommended (${requirements.minCPUCores}). Performance may be impacted.`);
  }

  if (specs.diskSpaceGB < requirements.minDiskSpaceGB) {
    return {
      compatible: false,
      reason: `Insufficient disk space: ${specs.diskSpaceGB}GB available, ${requirements.minDiskSpaceGB}GB required`,
      warnings
    };
  }

  return { compatible: true, warnings };
}

// Calculate maximum safe context length based on available resources
export function calculateMaxContextLength(specs: HardwareSpecs, modelSize: keyof typeof MODEL_REQUIREMENTS): number {
  const requirements = MODEL_REQUIREMENTS[modelSize];
  if (!requirements) return 2048; // Default safe value

  // Base context on available memory (RAM or VRAM, whichever is lower)
  const availableMemoryGB = Math.min(
    specs.freeMemoryGB,
    Math.max(...specs.gpuInfo.map(gpu => gpu.memoryGB)) || specs.freeMemoryGB
  );

  // Rough estimation: 1GB memory = ~2048 tokens for safe operation
  // This is a conservative estimate that accounts for model weights and overhead
  const memoryBasedContext = Math.floor((availableMemoryGB * 2048) / requirements.minRAMGB);

  // Cap based on model size to prevent unrealistic values
  const modelSizeBasedCap = {
    '3B': 8192,
    '7B': 16384,
    '13B': 32768,
    '33B': 65536,
    '70B': 128000
  }[modelSize];

  return Math.min(memoryBasedContext, modelSizeBasedCap || 2048);
} 