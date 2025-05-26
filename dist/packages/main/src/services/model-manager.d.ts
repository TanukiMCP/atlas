interface ModelInstallation {
    modelName: string;
    status: 'downloading' | 'installing' | 'completed' | 'failed';
    progress: number;
    estimatedTime?: number;
    error?: string;
}
export declare class ModelManager {
    private ollamaService;
    private hardwareAssessor;
    private installations;
    private configurations;
    constructor();
    getRecommendedModels(): Promise<any[]>;
    installModel(modelName: string, onProgress?: (progress: ModelInstallation) => void): Promise<void>;
    uninstallModel(modelName: string): Promise<void>;
    private calculateProgress;
    getInstallationStatus(modelName: string): ModelInstallation | undefined;
}
export {};
//# sourceMappingURL=model-manager.d.ts.map