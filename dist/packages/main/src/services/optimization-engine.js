"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationEngine = void 0;
class OptimizationEngine {
    profiles = new Map();
    activeProfile = 'balanced';
    constructor() {
        this.initializeProfiles();
    }
    async optimizeForHardware(systemInfo) {
        // Analyze hardware and return optimized profile
        if (systemInfo.memory.available > 16 && systemInfo.gpu?.length > 0) {
            return this.profiles.get('performance');
        }
        else if (systemInfo.memory.available < 8) {
            return this.profiles.get('memory');
        }
        return this.profiles.get('balanced');
    }
    getProfile(name) {
        return this.profiles.get(name);
    }
    getAllProfiles() {
        return Array.from(this.profiles.values());
    }
    setActiveProfile(name) {
        if (this.profiles.has(name)) {
            this.activeProfile = name;
        }
    }
    initializeProfiles() {
        // Performance profile
        this.profiles.set('performance', {
            name: 'Performance',
            description: 'Maximum speed, higher memory usage',
            settings: {
                kvCacheType: 'f16',
                numParallel: 8,
                maxLoadedModels: 1,
                flashAttention: true,
                memoryMapping: true,
                memoryLocking: true,
                contextLength: 4096,
                batchSize: 512,
                threadCount: -1,
                gpuLayers: -1
            }
        });
        // Memory efficient profile
        this.profiles.set('memory', {
            name: 'Memory Efficient',
            description: 'Lower memory usage, moderate speed',
            settings: {
                kvCacheType: 'q4_0',
                numParallel: 2,
                maxLoadedModels: 1,
                flashAttention: true,
                memoryMapping: false,
                memoryLocking: false,
                contextLength: 2048,
                batchSize: 128,
                threadCount: 4,
                gpuLayers: 20
            }
        });
        // Balanced profile
        this.profiles.set('balanced', {
            name: 'Balanced',
            description: 'Good balance of speed and memory usage',
            settings: {
                kvCacheType: 'q8_0',
                numParallel: 4,
                maxLoadedModels: 2,
                flashAttention: true,
                memoryMapping: true,
                memoryLocking: false,
                contextLength: 3072,
                batchSize: 256,
                threadCount: 6,
                gpuLayers: 32
            }
        });
    }
    async applyOptimizations(profile) {
        // Apply optimization settings to Ollama environment
        process.env.OLLAMA_KV_CACHE_TYPE = profile.settings.kvCacheType;
        process.env.OLLAMA_NUM_PARALLEL = profile.settings.numParallel.toString();
        process.env.OLLAMA_MAX_LOADED_MODELS = profile.settings.maxLoadedModels.toString();
        process.env.OLLAMA_FLASH_ATTENTION = profile.settings.flashAttention ? '1' : '0';
    }
}
exports.OptimizationEngine = OptimizationEngine;
//# sourceMappingURL=optimization-engine.js.map