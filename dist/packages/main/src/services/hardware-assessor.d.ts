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
}
interface OptimizationSuggestion {
    type: string;
    description: string;
    impact: string;
}
export declare class HardwareAssessor {
    assessSystemCapabilities(): Promise<SystemCapabilities>;
    getModelRecommendations(systemCaps: SystemCapabilities, availableModels: RecommendedModel[]): Promise<ModelRecommendation[]>;
    private assessCompatibility;
    private predictPerformance;
    private suggestOptimizations;
    private generateWarnings;
    private detectGPU;
    private detectWindowsGPU;
    private detectLinuxGPU;
    private assessStorage;
}
export {};
//# sourceMappingURL=hardware-assessor.d.ts.map