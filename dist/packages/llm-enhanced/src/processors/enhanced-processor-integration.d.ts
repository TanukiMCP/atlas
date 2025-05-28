import { TaskAnalysis, ThinkingCapability } from '../../../tools/clear-thought/src/router/clear-thought-router';
export interface EnhancedProcessorConfig {
    enableClearThought: boolean;
    enableMobileServer: boolean;
    enableImageGeneration: boolean;
    clearThoughtConfig: {
        minComplexityForTier3: number;
        minComplexityForTier4: number;
        maxExecutionTime: number;
    };
    mobileServerConfig: {
        port: number;
        host: string;
        autoStart: boolean;
        tokenExpiry: number;
    };
    imageGenerationConfig: {
        apiUrl: string;
        defaultModel: string;
        outputDirectory: string;
        maxConcurrentGenerations: number;
    };
}
export interface ProcessingContext {
    requestId: string;
    userId: string;
    source: 'desktop' | 'mobile';
    complexity: number;
    tier: number;
    taskAnalysis?: TaskAnalysis;
    clearThoughtPlan?: ThinkingCapability[];
    enabledFeatures: string[];
}
export declare class EnhancedProcessorIntegration {
    private config;
    private clearThoughtRouter;
    private sequentialThinking;
    private mentalModels;
    private stableDiffusion;
    private mobileServer?;
    constructor(config: EnhancedProcessorConfig);
    private initializeComponents;
    /**
     * Enhanced request processing with Clear Thought integration
     */
    processRequest(request: string, context?: Partial<ProcessingContext>): Promise<{
        response: string;
        context: ProcessingContext;
        usedTools: string[];
        processingTime: number;
    }>;
    /**
     * Apply Clear Thought tools based on task analysis
     */
    private applyClearThoughtTools;
    /**
     * Execute individual Clear Thought tool
     */
    private executeClearThoughtTool;
    /**
     * Handle image generation requests
     */
    private handleImageGeneration;
    /**
     * Process request through appropriate tier
     */
    private processByTier;
    /**
     * Mobile server management
     */
    startMobileServer(): Promise<void>;
    stopMobileServer(): Promise<void>;
    getMobileServerInfo(): {
        url: string;
        isRunning: boolean;
    } | null;
    /**
     * Utility methods
     */
    private createProcessingContext;
    private shouldUseClearThought;
    private determineTier;
    private isImageGenerationRequest;
    private extractImagePrompt;
    private getEnabledFeatures;
    private generateRequestId;
    /**
     * Get system status
     */
    getSystemStatus(): {
        clearThought: {
            enabled: boolean;
            toolsAvailable: number;
        };
        mobileServer: {
            enabled: boolean;
            running: boolean;
            connections: number;
        };
        imageGeneration: {
            enabled: boolean;
            available: boolean;
        };
    };
}
//# sourceMappingURL=enhanced-processor-integration.d.ts.map