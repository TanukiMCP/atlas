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
}
interface GenerateRequest {
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
export declare class OllamaService {
    private baseUrl;
    private performanceCache;
    listModels(): Promise<OllamaModel[]>;
    checkOllamaHealth(): Promise<boolean>;
    generate(request: GenerateRequest): Promise<any>;
    getModelCatalog(): Promise<RecommendedModel[]>;
    pullModelWithOptimization(name: string, onProgress?: (progress: any) => void): Promise<void>;
    private setOptimizationFlags;
    benchmarkModel(modelName: string): Promise<ModelPerformance>;
    generateWithOptimization(request: GenerateRequest): Promise<any>;
    private optimizeRequest;
    private getSystemInfo;
    private calculateOptimalContextLength;
    private getModelMemoryUsage;
    deleteModel(modelName: string): Promise<void>;
    getPerformanceMetrics(modelName: string): ModelPerformance | undefined;
}
export {};
//# sourceMappingURL=ollama-service.d.ts.map