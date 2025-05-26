interface OptimizationProfile {
    name: string;
    description: string;
    settings: {
        kvCacheType: 'q4_0' | 'q8_0' | 'f16' | 'f32';
        numParallel: number;
        maxLoadedModels: number;
        flashAttention: boolean;
        memoryMapping: boolean;
        memoryLocking: boolean;
        contextLength: number;
        batchSize: number;
        threadCount: number;
        gpuLayers?: number;
    };
}
export declare class OptimizationEngine {
    private profiles;
    private activeProfile;
    constructor();
    optimizeForHardware(systemInfo: any): Promise<OptimizationProfile>;
    getProfile(name: string): OptimizationProfile | undefined;
    getAllProfiles(): OptimizationProfile[];
    setActiveProfile(name: string): void;
    private initializeProfiles;
    applyOptimizations(profile: OptimizationProfile): Promise<void>;
}
export {};
//# sourceMappingURL=optimization-engine.d.ts.map