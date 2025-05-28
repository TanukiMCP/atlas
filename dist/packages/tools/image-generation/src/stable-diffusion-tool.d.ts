import { z } from 'zod';
export interface StableDiffusionConfig {
    apiUrl: string;
    defaultModel: string;
    outputDirectory: string;
    maxConcurrentGenerations: number;
    enableProgressTracking: boolean;
}
export interface GenerationParams {
    prompt: string;
    negativePrompt?: string;
    width: number;
    height: number;
    steps: number;
    cfgScale: number;
    sampler: string;
    seed?: number;
    batchSize: number;
    model?: string;
}
export interface GenerationProgress {
    id: string;
    status: 'queued' | 'generating' | 'completed' | 'failed';
    progress: number;
    currentStep: number;
    totalSteps: number;
    estimatedTimeRemaining: number;
    previewImage?: string;
}
export interface GenerationResult {
    id: string;
    images: string[];
    parameters: GenerationParams;
    metadata: {
        generatedAt: Date;
        processingTime: number;
        model: string;
        seed: number;
    };
}
export declare const ImageGenerationSchema: z.ZodObject<{
    prompt: z.ZodString;
    enhancePrompt: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    style: z.ZodOptional<z.ZodString>;
    quality: z.ZodDefault<z.ZodOptional<z.ZodEnum<["draft", "standard", "high", "custom"]>>>;
    dimensions: z.ZodOptional<z.ZodObject<{
        width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width?: number | undefined;
        height?: number | undefined;
    }>>;
    variations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    customParams: z.ZodOptional<z.ZodObject<{
        steps: z.ZodOptional<z.ZodNumber>;
        cfgScale: z.ZodOptional<z.ZodNumber>;
        sampler: z.ZodOptional<z.ZodString>;
        seed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        steps?: number | undefined;
        cfgScale?: number | undefined;
        sampler?: string | undefined;
        seed?: number | undefined;
    }, {
        steps?: number | undefined;
        cfgScale?: number | undefined;
        sampler?: string | undefined;
        seed?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    enhancePrompt: boolean;
    quality: "high" | "draft" | "standard" | "custom";
    variations: number;
    style?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
    } | undefined;
    customParams?: {
        steps?: number | undefined;
        cfgScale?: number | undefined;
        sampler?: string | undefined;
        seed?: number | undefined;
    } | undefined;
}, {
    prompt: string;
    enhancePrompt?: boolean | undefined;
    style?: string | undefined;
    quality?: "high" | "draft" | "standard" | "custom" | undefined;
    dimensions?: {
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
    variations?: number | undefined;
    customParams?: {
        steps?: number | undefined;
        cfgScale?: number | undefined;
        sampler?: string | undefined;
        seed?: number | undefined;
    } | undefined;
}>;
export declare class StableDiffusionTool {
    private config;
    private activeGenerations;
    private generationQueue;
    constructor(config: StableDiffusionConfig);
    /**
     * Generate images based on user request
     */
    execute(params: z.infer<typeof ImageGenerationSchema>): Promise<{
        generationId: string;
        enhancedPrompt?: string;
        estimatedTime: number;
        status: string;
    }>;
    /**
     * Get generation progress
     */
    getProgress(generationId: string): GenerationProgress | null;
    /**
     * Get generation result
     */
    getResult(generationId: string): Promise<GenerationResult | null>;
    /**
     * Cancel generation
     */
    cancelGeneration(generationId: string): Promise<boolean>;
    /**
     * Enhance prompt using LLM
     */
    private enhancePrompt;
    /**
     * Prepare generation parameters based on user input
     */
    private prepareGenerationParams;
    /**
     * Process the generation queue
     */
    private processGenerationQueue;
    /**
     * Execute actual image generation
     */
    private executeGeneration;
    /**
     * Track generation progress (if supported by API)
     */
    private trackProgress;
    /**
     * Estimate generation time based on parameters
     */
    private estimateGenerationTime;
    /**
     * Get default negative prompt for quality
     */
    private getDefaultNegativePrompt;
    /**
     * Generate unique ID for generation
     */
    private generateId;
    /**
     * Ensure output directory exists
     */
    private ensureOutputDirectory;
    /**
     * Get available models from Stable Diffusion API
     */
    getAvailableModels(): Promise<string[]>;
    /**
     * Check if Stable Diffusion API is available
     */
    isAvailable(): Promise<boolean>;
}
//# sourceMappingURL=stable-diffusion-tool.d.ts.map