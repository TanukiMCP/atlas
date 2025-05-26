"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareAssessor = void 0;
class HardwareAssessor {
    async assessSystemCapabilities() {
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
    async getModelRecommendations(systemCaps, availableModels) {
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
    assessCompatibility(model, system) {
        const ramOk = system.memory.available >= model.requirements.minRam;
        const ramGood = system.memory.available >= model.requirements.recommendedRam;
        if (!ramOk)
            return 'incompatible';
        if (system.gpu && system.gpu.length > 0) {
            const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
            const vramOk = totalVram >= (model.requirements.minVram || 0);
            const vramGood = totalVram >= (model.requirements.recommendedVram || 0);
            if (ramGood && vramGood)
                return 'perfect';
            if (ramGood && vramOk)
                return 'good';
            if (ramOk)
                return 'marginal';
        }
        if (ramGood)
            return 'good';
        return 'marginal';
    }
    predictPerformance(model, system) {
        let tokensPerSecond = model.estimatedPerformance.tokensPerSecondCPU;
        if (system.gpu && system.gpu.length > 0) {
            const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
            if (totalVram >= (model.requirements.recommendedVram || 0)) {
                tokensPerSecond = model.estimatedPerformance.tokensPerSecondGPU || tokensPerSecond * 2;
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
    suggestOptimizations(model, system) {
        const suggestions = [];
        if (system.memory.available < model.requirements.recommendedRam) {
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
    generateWarnings(model, system) {
        const warnings = [];
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
    async detectGPU() {
        try {
            if (process.platform === 'win32') {
                return await this.detectWindowsGPU();
            }
            else if (process.platform === 'linux') {
                return await this.detectLinuxGPU();
            }
            return [];
        }
        catch (error) {
            console.error('GPU detection failed:', error);
            return [];
        }
    }
    async detectWindowsGPU() {
        // Windows GPU detection using wmic
        return [];
    }
    async detectLinuxGPU() {
        // Linux GPU detection using lspci/nvidia-smi
        return [];
    }
    async assessStorage() {
        return {
            available: 100,
            type: 'SSD',
            speed: 500
        };
    }
}
exports.HardwareAssessor = HardwareAssessor;
//# sourceMappingURL=hardware-assessor.js.map