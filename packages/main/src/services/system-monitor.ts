interface SystemInfo {
  cpu: {
    brand: string;
    model: string;
    cores: number;
    threads: number;
    clockSpeed: number;
    architecture: string;
    cache: {
      l1d?: number;
      l1i?: number;
      l2?: number;
      l3?: number;
    };
  };
  memory: {
    total: number;
    available: number;
    used: number;
    type: string;
    speed?: number;
    slots: number;
  };
  gpu: {
    name: string;
    vendor: string;
    vram: number;
    driver?: string;
    computeCapability?: string;
    supports: string[];
  }[];
  storage: {
    drives: {
      name: string;
      type: 'SSD' | 'HDD' | 'NVMe';
      size: number;
      available: number;
      speed?: number;
    }[];
  };
}interface PerformanceMetrics {
  cpu: {
    usage: number;
    temperature?: number;
    frequency: number;
  };
  memory: {
    usage: number;
    available: number;
    cached: number;
  };
  gpu: {
    usage: number;
    memory: number;
    temperature?: number;
  }[];
  disk: {
    readSpeed: number;
    writeSpeed: number;
    usage: number;
  };
}

export class SystemMonitor {
  private metricsCache = new Map<string, PerformanceMetrics>();
  private lastUpdate = 0;
  private updateInterval = 5000; // 5 seconds

  async getSystemInfo(): Promise<SystemInfo> {
    const os = require('os');
    const { execSync } = require('child_process');
    
    // CPU Information
    const cpus = os.cpus();
    const cpu = {
      brand: this.getCPUBrand(),
      model: cpus[0]?.model || 'Unknown',
      cores: cpus.length,
      threads: cpus.length, // Simplified
      clockSpeed: cpus[0]?.speed || 0,
      architecture: os.arch(),
      cache: await this.getCPUCache()
    };
    
    // Memory Information
    const memory = {
      total: Math.round(os.totalmem() / (1024 ** 3)),
      available: Math.round(os.freemem() / (1024 ** 3)),
      used: Math.round((os.totalmem() - os.freemem()) / (1024 ** 3)),
      type: await this.getMemoryType(),
      speed: await this.getMemorySpeed(),
      slots: await this.getMemorySlots()
    };
    
    return {
      cpu,
      memory,
      gpu: await this.detectGPUs(),
      storage: await this.getStorageInfo()
    };
  }

  private getCPUBrand(): string {
    const os = require('os');
    const cpus = os.cpus();
    if (cpus[0]?.model.includes('Intel')) return 'Intel';
    if (cpus[0]?.model.includes('AMD')) return 'AMD';
    return 'Unknown';
  }

  private async getCPUCache(): Promise<any> {
    // Platform-specific cache detection would go here
    return {
      l1d: undefined,
      l1i: undefined,
      l2: undefined,
      l3: undefined
    };
  }

  private async getMemoryType(): Promise<string> {
    // Memory type detection (DDR4, DDR5, etc.)
    return 'DDR4'; // Simplified
  }

  private async getMemorySpeed(): Promise<number | undefined> {
    // Memory speed detection
    return undefined;
  }

  private async getMemorySlots(): Promise<number> {
    // Memory slot detection
    return 4; // Simplified
  }

  private async detectGPUs(): Promise<any[]> {
    try {
      const { execSync } = require('child_process');
      
      if (process.platform === 'win32') {
        return await this.detectWindowsGPUs();
      } else if (process.platform === 'linux') {
        return await this.detectLinuxGPUs();
      } else if (process.platform === 'darwin') {
        return await this.detectMacGPUs();
      }
      
      return [];
    } catch (error) {
      console.error('GPU detection failed:', error);
      return [];
    }
  }

  private async detectWindowsGPUs(): Promise<any[]> {
    try {
      const { execSync } = require('child_process');
      // Use wmic to get GPU information
      const output = execSync('wmic path win32_VideoController get name,AdapterRAM', { encoding: 'utf8' });
      // Parse output and return GPU info
      return [];
    } catch (error) {
      return [];
    }
  }

  private async detectLinuxGPUs(): Promise<any[]> {
    // Linux GPU detection using lspci, nvidia-smi, etc.
    return [];
  }

  private async detectMacGPUs(): Promise<any[]> {
    // macOS GPU detection using system_profiler
    return [];
  }

  private async getStorageInfo(): Promise<any> {
    const os = require('os');
    
    return {
      drives: [{
        name: 'Primary Drive',
        type: 'SSD' as const,
        size: 500, // GB - simplified
        available: 250,
        speed: undefined
      }]
    };
  }

  async getCurrentMetrics(): Promise<PerformanceMetrics> {
    const now = Date.now();
    
    if (now - this.lastUpdate < this.updateInterval) {
      return this.metricsCache.get('current') || this.getDefaultMetrics();
    }
    
    const metrics = await this.collectMetrics();
    this.metricsCache.set('current', metrics);
    this.lastUpdate = now;
    
    return metrics;
  }

  private async collectMetrics(): Promise<PerformanceMetrics> {
    const os = require('os');
    
    return {
      cpu: {
        usage: await this.getCPUUsage(),
        temperature: undefined,
        frequency: os.cpus()[0]?.speed || 0
      },
      memory: {
        usage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
        available: Math.round(os.freemem() / (1024 ** 3)),
        cached: 0
      },
      gpu: [],
      disk: {
        readSpeed: 0,
        writeSpeed: 0,
        usage: 0
      }
    };
  }

  private async getCPUUsage(): Promise<number> {
    // CPU usage calculation
    return Math.random() * 100; // Simplified
  }

  private getDefaultMetrics(): PerformanceMetrics {
    return {
      cpu: { usage: 0, frequency: 0 },
      memory: { usage: 0, available: 0, cached: 0 },
      gpu: [],
      disk: { readSpeed: 0, writeSpeed: 0, usage: 0 }
    };
  }
}