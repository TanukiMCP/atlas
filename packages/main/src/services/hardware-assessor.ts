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

interface ModelRequirements {
  minRam: number; // in MB
  recommendedRam: number; // in MB
  minVram?: number; // in MB
  recommendedVram?: number; // in MB
  diskSpace: number; // in MB
  cpuCores?: number;
  cpuSpeed?: number; // in GHz
}

interface RecommendedModel {
  id: string;
  name: string;
  parameterCount: string;
  quantization: string;
  purpose: string[];
  requirements: ModelRequirements;
}

interface HardwareAssessmentResult {
  capabilities: SystemCapabilities;
  isCapable: boolean;
  recommendedModels: RecommendedModel[];
  warnings: string[];
  limitations: string[];
  optimizationTips: string[];
}

export class HardwareAssessor {
  async assessSystemCapabilities(): Promise<SystemCapabilities> {
    const os = require('os');
    const { execSync } = require('child_process');
    const fs = require('fs').promises;
    const path = require('path');
    
    // CPU Assessment
    const cpus = os.cpus();
    const cpu = {
      cores: this.getPhysicalCores(),
      threads: os.cpus().length,
      architecture: os.arch(),
      clockSpeed: cpus[0]?.speed || 0,
      brand: cpus[0]?.model || 'Unknown'
    };
    
    // Memory Assessment
    const memory = {
      total: Math.round(os.totalmem() / (1024 * 1024)), // in MB
      available: Math.round(os.freemem() / (1024 * 1024)), // in MB
      type: await this.detectMemoryType()
    };
    
    // GPU Assessment (platform-specific)
    const gpu = await this.detectGPU();
    
    // Storage Assessment
    const storage = await this.assessStorage();
    
    return { cpu, memory, gpu, storage };
  }

  private getPhysicalCores(): number {
    try {
      const os = require('os');
      const { execSync } = require('child_process');
      
      if (process.platform === 'win32') {
        // Windows - use wmic
        const output = execSync('wmic cpu get NumberOfCores').toString();
        const match = output.match(/\d+/);
        if (match) {
          return parseInt(match[0]);
        }
      } else if (process.platform === 'darwin') {
        // macOS - use sysctl
        const output = execSync('sysctl -n hw.physicalcpu').toString();
        return parseInt(output.trim());
      } else if (process.platform === 'linux') {
        // Linux - parse /proc/cpuinfo
        const output = execSync("grep 'cpu cores' /proc/cpuinfo | uniq").toString();
        const match = output.match(/\d+/);
        if (match) {
          return parseInt(match[0]);
        }
      }
      
      // Fallback - assume hyperthreading (divide by 2)
      return Math.max(1, Math.floor(os.cpus().length / 2));
    } catch (error) {
      console.error('Error detecting physical CPU cores:', error);
      // Fallback - assume 2 cores
      return 2;
    }
  }

  private async detectMemoryType(): Promise<string> {
    try {
      const { execSync } = require('child_process');
      
      if (process.platform === 'win32') {
        // Windows - use wmic
        const output = execSync('wmic memorychip get SMBIOSMemoryType').toString();
        // Memory type codes: 26 = DDR4, 24 = DDR3, etc.
        if (output.includes('26')) return 'DDR4';
        if (output.includes('24')) return 'DDR3';
        if (output.includes('22')) return 'DDR2';
        if (output.includes('21')) return 'DDR';
      } else if (process.platform === 'darwin') {
        // macOS - use system_profiler
        const output = execSync('system_profiler SPMemoryDataType').toString();
        if (output.includes('DDR5')) return 'DDR5';
        if (output.includes('DDR4')) return 'DDR4';
        if (output.includes('DDR3')) return 'DDR3';
        if (output.includes('DDR2')) return 'DDR2';
      } else if (process.platform === 'linux') {
        // Linux - use dmidecode (requires root)
        try {
          const output = execSync('sudo dmidecode -t memory').toString();
          if (output.includes('DDR5')) return 'DDR5';
          if (output.includes('DDR4')) return 'DDR4';
          if (output.includes('DDR3')) return 'DDR3';
          if (output.includes('DDR2')) return 'DDR2';
        } catch (error) {
          // Likely permission issue, fall back to lshw
          try {
            const output = execSync('lshw -short -C memory').toString();
            if (output.includes('DDR5')) return 'DDR5';
            if (output.includes('DDR4')) return 'DDR4';
            if (output.includes('DDR3')) return 'DDR3';
            if (output.includes('DDR2')) return 'DDR2';
          } catch (e) {
            // Both failed, use generic
          }
        }
      }
      
      // Fallback - use generic
      return 'DDR';
    } catch (error) {
      console.error('Error detecting memory type:', error);
      return 'DDR';
    }
  }

  private async assessStorage(): Promise<{ available: number; type: 'SSD' | 'HDD' | 'NVMe'; speed?: number }> {
    try {
      const os = require('os');
      const fs = require('fs').promises;
      const path = require('path');
      const { execSync } = require('child_process');
      
      // Get available space on the system drive
      let available = 0;
      let type: 'SSD' | 'HDD' | 'NVMe' = 'HDD'; // Default to HDD
      
      if (process.platform === 'win32') {
        // Windows
        const homeDir = os.homedir();
        const drive = homeDir.split(path.sep)[0];
        
        // Get available space
        const output = execSync(`wmic logicaldisk where "DeviceID='${drive}'" get FreeSpace /format:csv`).toString();
        const lines = output.trim().split('\n');
        if (lines.length >= 2) {
          const values = lines[1].split(',');
          if (values.length >= 2) {
            available = Math.round(parseInt(values[1]) / (1024 * 1024)); // Convert to MB
          }
        }
        
        // Detect drive type
        try {
          const diskOutput = execSync('wmic diskdrive get MediaType, Model').toString();
          if (diskOutput.toLowerCase().includes('ssd') || diskOutput.toLowerCase().includes('solid state')) {
            type = 'SSD';
          }
          if (diskOutput.toLowerCase().includes('nvme')) {
            type = 'NVMe';
          }
        } catch (e) {
          console.error('Error detecting drive type:', e);
        }
      } else if (process.platform === 'darwin') {
        // macOS
        const homeDir = os.homedir();
        
        // Get available space
        const output = execSync(`df -k "${homeDir}"`).toString();
        const lines = output.trim().split('\n');
        if (lines.length >= 2) {
          const values = lines[1].split(/\s+/);
          if (values.length >= 4) {
            available = Math.round(parseInt(values[3]) * 1024 / (1024 * 1024)); // Convert to MB
          }
        }
        
        // Detect drive type
        try {
          const diskOutput = execSync('system_profiler SPNVMeDataType SPSerialATADataType').toString();
          if (diskOutput.includes('NVMe')) {
            type = 'NVMe';
          } else if (!diskOutput.includes('Rotational Rate')) {
            type = 'SSD';
          }
        } catch (e) {
          console.error('Error detecting drive type:', e);
        }
      } else if (process.platform === 'linux') {
        // Linux
        const homeDir = os.homedir();
        
        // Get available space
        const output = execSync(`df -k "${homeDir}"`).toString();
        const lines = output.trim().split('\n');
        if (lines.length >= 2) {
          const values = lines[1].split(/\s+/);
          if (values.length >= 4) {
            available = Math.round(parseInt(values[3]) * 1024 / (1024 * 1024)); // Convert to MB
          }
        }
        
        // Detect drive type
        try {
          // Get the device name
          const dfOutput = execSync(`df -P "${homeDir}" | tail -1 | cut -d' ' -f1`).toString().trim();
          const device = dfOutput.replace(/[0-9]+$/, ''); // Remove partition number
          
          // Check if it's rotational (HDD) or not (SSD/NVMe)
          const rotational = execSync(`lsblk -d -o name,rota | grep \`basename ${device}\` | awk '{print $2}'`).toString().trim();
          
          if (rotational === '0') {
            // It's not rotational, so it's an SSD or NVMe
            // Check if it's NVMe
            const nvme = execSync('lspci | grep -i nvme').toString();
            if (nvme.length > 0 && device.includes('nvme')) {
              type = 'NVMe';
            } else {
              type = 'SSD';
            }
          }
        } catch (e) {
          console.error('Error detecting drive type:', e);
        }
      }
      
      return { available, type };
    } catch (error) {
      console.error('Error assessing storage:', error);
      return { available: 50 * 1024, type: 'HDD' }; // Default fallback
    }
  }

  private async detectGPU(): Promise<{ name: string; vram: number; computeCapability?: string; supports: string[] }[] | undefined> {
    try {
      const { execSync } = require('child_process');
      const gpus: { name: string; vram: number; computeCapability?: string; supports: string[] }[] = [];
      
      if (process.platform === 'win32') {
        // Windows - use wmic and nvidia-smi if available
        try {
          const output = execSync('wmic path win32_VideoController get Name,AdapterRAM /format:csv').toString();
          const lines = output.trim().split('\n');
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 3) {
              const name = values[1];
              const vram = Math.round(parseInt(values[2]) / (1024 * 1024)); // Convert to MB
              
              const supports = [];
              if (name.toLowerCase().includes('nvidia')) {
                supports.push('cuda');
                // Try to get compute capability for NVIDIA GPUs
                try {
                  const nvidiaSmi = execSync('nvidia-smi --query-gpu=name,compute_cap --format=csv,noheader').toString();
                  const nvLines = nvidiaSmi.trim().split('\n');
                  for (const line of nvLines) {
                    if (line.toLowerCase().includes(name.toLowerCase())) {
                      const parts = line.split(',');
                      if (parts.length >= 2) {
                        const computeCapability = parts[1].trim();
                        gpus.push({ 
                          name, 
                          vram, 
                          computeCapability,
                          supports: [...supports, 'tensor-cores']
                        });
                      }
                    }
                  }
                } catch (e) {
                  // nvidia-smi not available
                  gpus.push({ name, vram, supports });
                }
              } else if (name.toLowerCase().includes('amd') || name.toLowerCase().includes('radeon')) {
                supports.push('rocm');
                gpus.push({ name, vram, supports });
              } else if (name.toLowerCase().includes('intel')) {
                supports.push('opengl');
                supports.push('openvino');
                gpus.push({ name, vram, supports });
              } else {
                supports.push('opengl');
                gpus.push({ name, vram, supports });
              }
            }
          }
        } catch (error) {
          console.error('Error detecting GPU with wmic:', error);
        }
      } else if (process.platform === 'darwin') {
        // macOS - use system_profiler
        try {
          const output = execSync('system_profiler SPDisplaysDataType').toString();
          const gpuBlocks = output.split('Graphics/Displays:')[1]?.split('Memory:');
          
          if (gpuBlocks) {
            for (const block of gpuBlocks) {
              const nameMatch = block.match(/Chipset Model: (.+?)[\r\n]/);
              const vramMatch = block.match(/VRAM \(Total\): (\d+) MB/);
              
              if (nameMatch) {
                const name = nameMatch[1];
                const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
                const supports = ['metal'];
                
                if (name.toLowerCase().includes('amd') || name.toLowerCase().includes('radeon')) {
                  supports.push('opencl');
                }
                
                gpus.push({ name, vram, supports });
              }
            }
          }
        } catch (error) {
          console.error('Error detecting GPU on macOS:', error);
        }
      } else if (process.platform === 'linux') {
        // Linux - try multiple approaches
        try {
          // Try lspci first
          const output = execSync('lspci | grep -i vga').toString();
          const lines = output.trim().split('\n');
          
          for (const line of lines) {
            const match = line.match(/VGA compatible controller: (.+)/);
            if (match) {
              const name = match[1];
              let vram = 0;
              const supports = ['opengl'];
              
              // Try to get VRAM for NVIDIA GPUs
              if (name.toLowerCase().includes('nvidia')) {
                supports.push('cuda');
                try {
                  const nvidiaSmi = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader').toString();
                  const nvLines = nvidiaSmi.trim().split('\n');
                  for (const nvLine of nvLines) {
                    if (nvLine.toLowerCase().includes(name.toLowerCase())) {
                      const memMatch = nvLine.match(/(\d+) MiB/);
                      if (memMatch) {
                        vram = parseInt(memMatch[1]);
                      }
                      
                      // Get compute capability
                      try {
                        const ccOutput = execSync('nvidia-smi --query-gpu=compute_cap --format=csv,noheader').toString();
                        const computeCapability = ccOutput.trim();
                        gpus.push({ 
                          name, 
                          vram, 
                          computeCapability,
                          supports: [...supports, 'tensor-cores'] 
                        });
                      } catch (e) {
                        gpus.push({ name, vram, supports });
                      }
                    }
                  }
                } catch (e) {
                  // nvidia-smi not available
                  gpus.push({ name, vram, supports });
                }
              } else if (name.toLowerCase().includes('amd') || name.toLowerCase().includes('radeon')) {
                supports.push('rocm');
                gpus.push({ name, vram, supports });
              } else if (name.toLowerCase().includes('intel')) {
                supports.push('openvino');
                gpus.push({ name, vram, supports });
              } else {
                gpus.push({ name, vram, supports });
              }
            }
          }
        } catch (error) {
          console.error('Error detecting GPU on Linux:', error);
        }
      }
      
      return gpus.length > 0 ? gpus : undefined;
    } catch (error) {
      console.error('GPU detection failed:', error);
      return undefined;
    }
  }

  async assessHardwareForLLM(): Promise<HardwareAssessmentResult> {
    const capabilities = await this.assessSystemCapabilities();
    const recommendedModels = this.getRecommendedModels(capabilities);
    const warnings = [];
    const limitations = [];
    const optimizationTips = [];
    
    // Check if the system meets minimum requirements
    const isCapable = this.isSystemCapableForLLM(capabilities);
    
    // Generate warnings
    if (capabilities.memory.available < 4 * 1024) { // Less than 4GB RAM
      warnings.push('Low available RAM may cause performance issues with larger models');
      optimizationTips.push('Close other applications to free up memory before running LLMs');
      optimizationTips.push('Use smaller quantized models (1B-3B parameters) for better performance');
    }
    
    if (!capabilities.gpu || capabilities.gpu.length === 0) {
      warnings.push('No GPU detected - inference will run on CPU only (slower)');
      optimizationTips.push('Consider using smaller models optimized for CPU inference');
    } else {
      // Check if GPU has enough VRAM
      const totalVram = capabilities.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      if (totalVram < 4 * 1024) { // Less than 4GB VRAM
        warnings.push('Limited GPU memory may restrict model size and performance');
        optimizationTips.push('Use heavily quantized models (Q4_0, Q4_1) to fit in limited VRAM');
      }
    }
    
    if (capabilities.storage.type === 'HDD') {
      warnings.push('HDD storage detected - model loading will be slower');
      optimizationTips.push('Consider moving model files to an SSD for faster loading times');
    }
    
    // Generate limitations
    if (capabilities.memory.available < 8 * 1024) { // Less than 8GB RAM
      limitations.push('Larger models (>13B parameters) will not run efficiently');
    }
    
    if (!capabilities.gpu || capabilities.gpu.length === 0 || 
        (capabilities.gpu.length > 0 && capabilities.gpu[0].vram < 8 * 1024)) {
      limitations.push('GPU acceleration will be limited or unavailable');
    }
    
    return {
      capabilities,
      isCapable,
      recommendedModels,
      warnings,
      limitations,
      optimizationTips
    };
  }

  private isSystemCapableForLLM(system: SystemCapabilities): boolean {
    // Minimum requirements: 4GB RAM, 2 CPU cores, 5GB disk space
    const minRequirements = {
      ram: 4 * 1024, // 4GB in MB
      cores: 2,
      disk: 5 * 1024 // 5GB in MB
    };
    
    return system.memory.available >= minRequirements.ram &&
           system.cpu.cores >= minRequirements.cores &&
           system.storage.available >= minRequirements.disk;
  }

  private getRecommendedModels(system: SystemCapabilities): RecommendedModel[] {
    const models: RecommendedModel[] = [];
    
    // Tiny models (1-2B parameters) - almost any system can run these
    if (system.memory.available >= 2 * 1024) { // 2GB+ RAM
      models.push({
        id: 'phi-2:q4_0',
        name: 'Phi-2',
        parameterCount: '2.7B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'code-assistance', 'writing'],
        requirements: {
          minRam: 2 * 1024,
          recommendedRam: 4 * 1024,
          diskSpace: 2 * 1024
        }
      });
      
      models.push({
        id: 'tinyllama:1b-q4_0',
        name: 'TinyLlama',
        parameterCount: '1.1B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'writing'],
        requirements: {
          minRam: 1.5 * 1024,
          recommendedRam: 3 * 1024,
          diskSpace: 1 * 1024
        }
      });
    }
    
    // Small models (3-7B parameters)
    if (system.memory.available >= 4 * 1024) { // 4GB+ RAM
      models.push({
        id: 'llama3:8b-instruct-q4_0',
        name: 'Llama 3 8B Instruct',
        parameterCount: '8B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'writing', 'reasoning'],
        requirements: {
          minRam: 4 * 1024,
          recommendedRam: 8 * 1024,
          diskSpace: 4 * 1024,
          minVram: 4 * 1024
        }
      });
      
      models.push({
        id: 'mistral:7b-instruct-q4_0',
        name: 'Mistral 7B Instruct',
        parameterCount: '7B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'writing', 'reasoning'],
        requirements: {
          minRam: 4 * 1024,
          recommendedRam: 8 * 1024,
          diskSpace: 4 * 1024,
          minVram: 4 * 1024
        }
      });
    }
    
    // Medium models (13-20B parameters)
    if (system.memory.available >= 8 * 1024) { // 8GB+ RAM
      models.push({
        id: 'llama3:70b-instruct-q4_0',
        name: 'Llama 3 70B Instruct',
        parameterCount: '70B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'reasoning', 'creative-writing', 'code-generation'],
        requirements: {
          minRam: 8 * 1024,
          recommendedRam: 16 * 1024,
          diskSpace: 40 * 1024,
          minVram: 8 * 1024,
          recommendedVram: 16 * 1024
        }
      });
      
      models.push({
        id: 'mixtral:8x7b-instruct-q4_0',
        name: 'Mixtral 8x7B Instruct',
        parameterCount: '8x7B',
        quantization: 'Q4_0',
        purpose: ['conversation', 'reasoning', 'creative-writing', 'code-generation'],
        requirements: {
          minRam: 8 * 1024,
          recommendedRam: 16 * 1024,
          diskSpace: 26 * 1024,
          minVram: 8 * 1024,
          recommendedVram: 16 * 1024
        }
      });
    }
    
    // Filter models based on GPU availability
    if (system.gpu && system.gpu.length > 0) {
      // Get total VRAM across all GPUs
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      
      // Keep only models that fit in VRAM or can run on CPU
      return models.filter(model => {
        return !model.requirements.minVram || model.requirements.minVram <= totalVram;
      });
    }
    
    return models;
  }

  private generateWarnings(
    model: RecommendedModel,
    system: SystemCapabilities
  ): string[] {
    const warnings: string[] = [];
    
    if (system.memory.available < model.requirements.minRam) {
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
}