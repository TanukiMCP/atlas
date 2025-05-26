"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
class OllamaService {
    baseUrl = 'http://localhost:11434';
    performanceCache = new Map();
    async listModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            // Enrich with performance data
            return (data.models || []).map(model => ({
                ...model,
                performance: this.performanceCache.get(model.name)
            }));
        }
        catch (error) {
            console.error('Failed to list models:', error);
            return [];
        }
    }
    async checkOllamaHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
    async generate(request) {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return response.json();
    }
    async getModelCatalog() {
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
    }
    async pullModelWithOptimization(name, onProgress) {
        await this.setOptimizationFlags();
        const response = await fetch(`${this.baseUrl}/api/pull`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, stream: true })
        });
        if (!response.body)
            throw new Error('No response body');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            for (const line of lines) {
                try {
                    const progress = JSON.parse(line);
                    onProgress?.(progress);
                }
                catch (e) {
                    // Skip invalid JSON lines
                }
            }
        }
        await this.benchmarkModel(name);
    }
    async setOptimizationFlags() {
        process.env.OLLAMA_FLASH_ATTENTION = '1';
        process.env.OLLAMA_KV_CACHE_TYPE = 'q8_0';
        process.env.OLLAMA_NUM_PARALLEL = '4';
        process.env.OLLAMA_MAX_LOADED_MODELS = '2';
    }
    async benchmarkModel(modelName) {
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
            const performance = {
                tokensPerSecond,
                ramUsage: await this.getModelMemoryUsage(modelName),
                cpuUsage: 0,
                lastBenchmark: new Date()
            };
            this.performanceCache.set(modelName, performance);
            return performance;
        }
        catch (error) {
            throw new Error(`Benchmark failed for ${modelName}: ${error}`);
        }
    }
    async generateWithOptimization(request) {
        const optimizedRequest = await this.optimizeRequest(request);
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(optimizedRequest)
        });
        return response.json();
    }
    async optimizeRequest(request) {
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
    async getSystemInfo() {
        const os = require('os');
        return {
            cpuCores: os.cpus().length,
            availableRam: Math.round(os.freemem() / (1024 ** 3)),
            gpuCount: 0,
            totalVram: 0
        };
    }
    calculateOptimalContextLength(modelName, systemInfo) {
        const baseContext = 2048;
        const maxContext = 32768;
        if (systemInfo.availableRam > 16) {
            return Math.min(maxContext, baseContext * 4);
        }
        else if (systemInfo.availableRam > 8) {
            return Math.min(maxContext, baseContext * 2);
        }
        return baseContext;
    }
    async getModelMemoryUsage(modelName) {
        const models = await this.listModels();
        const model = models.find(m => m.name === modelName);
        return model ? model.size * 1.2 : 0;
    }
    async deleteModel(modelName) {
        await fetch(`${this.baseUrl}/api/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: modelName })
        });
        this.performanceCache.delete(modelName);
    }
    getPerformanceMetrics(modelName) {
        return this.performanceCache.get(modelName);
    }
}
exports.OllamaService = OllamaService;
//# sourceMappingURL=ollama-service.js.map