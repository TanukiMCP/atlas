"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StableDiffusionTool = exports.ImageGenerationSchema = void 0;
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
exports.ImageGenerationSchema = zod_1.z.object({
    prompt: zod_1.z.string().describe('The image description or prompt'),
    enhancePrompt: zod_1.z.boolean().optional().default(true).describe('Whether to enhance the prompt with LLM'),
    style: zod_1.z.string().optional().describe('Art style (e.g., photorealistic, anime, oil painting)'),
    quality: zod_1.z.enum(['draft', 'standard', 'high', 'custom']).optional().default('standard'),
    dimensions: zod_1.z.object({
        width: zod_1.z.number().optional().default(768),
        height: zod_1.z.number().optional().default(768)
    }).optional(),
    variations: zod_1.z.number().min(1).max(4).optional().default(1).describe('Number of variations to generate'),
    customParams: zod_1.z.object({
        steps: zod_1.z.number().optional(),
        cfgScale: zod_1.z.number().optional(),
        sampler: zod_1.z.string().optional(),
        seed: zod_1.z.number().optional()
    }).optional()
});
class StableDiffusionTool {
    config;
    activeGenerations = new Map();
    generationQueue = [];
    constructor(config) {
        this.config = config;
        this.ensureOutputDirectory();
    }
    /**
     * Generate images based on user request
     */
    async execute(params) {
        const generationId = this.generateId();
        try {
            // Step 1: Enhance prompt if requested
            let finalPrompt = params.prompt;
            if (params.enhancePrompt) {
                finalPrompt = await this.enhancePrompt(params.prompt, params.style);
            }
            // Step 2: Prepare generation parameters
            const generationParams = this.prepareGenerationParams(params, finalPrompt);
            // Step 3: Queue generation
            const progress = {
                id: generationId,
                status: 'queued',
                progress: 0,
                currentStep: 0,
                totalSteps: generationParams.steps,
                estimatedTimeRemaining: this.estimateGenerationTime(generationParams)
            };
            this.activeGenerations.set(generationId, progress);
            this.generationQueue.push(generationId);
            // Step 4: Start generation (async)
            this.processGenerationQueue();
            return {
                generationId,
                enhancedPrompt: params.enhancePrompt ? finalPrompt : undefined,
                estimatedTime: progress.estimatedTimeRemaining,
                status: 'queued'
            };
        }
        catch (error) {
            throw new Error(`Failed to start image generation: ${error.message}`);
        }
    }
    /**
     * Get generation progress
     */
    getProgress(generationId) {
        return this.activeGenerations.get(generationId) || null;
    }
    /**
     * Get generation result
     */
    async getResult(generationId) {
        const progress = this.activeGenerations.get(generationId);
        if (!progress || progress.status !== 'completed') {
            return null;
        }
        try {
            const resultPath = path_1.default.join(this.config.outputDirectory, `${generationId}.json`);
            const resultData = await promises_1.default.readFile(resultPath, 'utf-8');
            return JSON.parse(resultData);
        }
        catch (error) {
            console.error('Failed to load generation result:', error);
            return null;
        }
    }
    /**
     * Cancel generation
     */
    async cancelGeneration(generationId) {
        const progress = this.activeGenerations.get(generationId);
        if (!progress) {
            return false;
        }
        if (progress.status === 'queued') {
            // Remove from queue
            const queueIndex = this.generationQueue.indexOf(generationId);
            if (queueIndex > -1) {
                this.generationQueue.splice(queueIndex, 1);
            }
            this.activeGenerations.delete(generationId);
            return true;
        }
        if (progress.status === 'generating') {
            // Interrupt current generation
            try {
                await axios_1.default.post(`${this.config.apiUrl}/sdapi/v1/interrupt`);
                progress.status = 'failed';
                return true;
            }
            catch (error) {
                console.error('Failed to interrupt generation:', error);
                return false;
            }
        }
        return false;
    }
    /**
     * Enhance prompt using LLM
     */
    async enhancePrompt(originalPrompt, style) {
        // This would integrate with Atlas LLM processor
        // For now, return enhanced version with style guidance
        const styleGuidance = style ? `, in ${style} style` : '';
        const enhancementPrompt = `
Enhance this image generation prompt to be more vivid, detailed, and specific. 
Add artistic and technical details that will result in a high-quality image.

Original prompt: "${originalPrompt}"
Style preference: ${style || 'photorealistic'}

Enhanced prompt should include:
- Vivid visual details
- Lighting and composition guidance  
- Technical quality indicators
- Artistic style elements

Return only the enhanced prompt, no explanations.
`;
        // Mock enhancement for now - would use actual LLM
        return `${originalPrompt}${styleGuidance}, highly detailed, professional photography, perfect lighting, sharp focus, 8k resolution, masterpiece`;
    }
    /**
     * Prepare generation parameters based on user input
     */
    prepareGenerationParams(params, prompt) {
        const qualityPresets = {
            draft: { steps: 20, cfgScale: 7, width: 512, height: 512 },
            standard: { steps: 30, cfgScale: 7.5, width: 768, height: 768 },
            high: { steps: 50, cfgScale: 8, width: 1024, height: 1024 },
            custom: { steps: 30, cfgScale: 7.5, width: 768, height: 768 }
        };
        const preset = qualityPresets[params.quality || 'standard'];
        return {
            prompt,
            negativePrompt: this.getDefaultNegativePrompt(),
            width: params.dimensions?.width || preset.width,
            height: params.dimensions?.height || preset.height,
            steps: params.customParams?.steps || preset.steps,
            cfgScale: params.customParams?.cfgScale || preset.cfgScale,
            sampler: params.customParams?.sampler || 'DPM++ 2M Karras',
            seed: params.customParams?.seed || -1,
            batchSize: params.variations || 1,
            model: this.config.defaultModel
        };
    }
    /**
     * Process the generation queue
     */
    async processGenerationQueue() {
        if (this.generationQueue.length === 0) {
            return;
        }
        const activeCount = Array.from(this.activeGenerations.values())
            .filter(p => p.status === 'generating').length;
        if (activeCount >= this.config.maxConcurrentGenerations) {
            return;
        }
        const generationId = this.generationQueue.shift();
        if (!generationId) {
            return;
        }
        const progress = this.activeGenerations.get(generationId);
        if (!progress) {
            return;
        }
        try {
            await this.executeGeneration(generationId, progress);
        }
        catch (error) {
            console.error(`Generation ${generationId} failed:`, error);
            progress.status = 'failed';
        }
        // Process next in queue
        setTimeout(() => this.processGenerationQueue(), 1000);
    }
    /**
     * Execute actual image generation
     */
    async executeGeneration(generationId, progress) {
        progress.status = 'generating';
        // Get generation parameters (stored separately)
        const paramsPath = path_1.default.join(this.config.outputDirectory, `${generationId}_params.json`);
        const paramsData = await promises_1.default.readFile(paramsPath, 'utf-8');
        const params = JSON.parse(paramsData);
        const startTime = Date.now();
        try {
            // Start generation
            const response = await axios_1.default.post(`${this.config.apiUrl}/sdapi/v1/txt2img`, {
                prompt: params.prompt,
                negative_prompt: params.negativePrompt,
                width: params.width,
                height: params.height,
                steps: params.steps,
                cfg_scale: params.cfgScale,
                sampler_name: params.sampler,
                seed: params.seed,
                batch_size: params.batchSize,
                n_iter: 1
            });
            if (response.data && response.data.images) {
                const result = {
                    id: generationId,
                    images: response.data.images,
                    parameters: params,
                    metadata: {
                        generatedAt: new Date(),
                        processingTime: Date.now() - startTime,
                        model: params.model || this.config.defaultModel,
                        seed: response.data.info?.seed || params.seed
                    }
                };
                // Save result
                const resultPath = path_1.default.join(this.config.outputDirectory, `${generationId}.json`);
                await promises_1.default.writeFile(resultPath, JSON.stringify(result, null, 2));
                // Save individual images
                for (let i = 0; i < result.images.length; i++) {
                    const imagePath = path_1.default.join(this.config.outputDirectory, `${generationId}_${i}.png`);
                    const imageBuffer = Buffer.from(result.images[i], 'base64');
                    await promises_1.default.writeFile(imagePath, imageBuffer);
                }
                progress.status = 'completed';
                progress.progress = 100;
            }
            else {
                throw new Error('No images returned from Stable Diffusion API');
            }
        }
        catch (error) {
            progress.status = 'failed';
            throw error;
        }
    }
    /**
     * Track generation progress (if supported by API)
     */
    async trackProgress(generationId) {
        if (!this.config.enableProgressTracking) {
            return;
        }
        const progress = this.activeGenerations.get(generationId);
        if (!progress || progress.status !== 'generating') {
            return;
        }
        try {
            const response = await axios_1.default.get(`${this.config.apiUrl}/sdapi/v1/progress`);
            if (response.data) {
                progress.progress = Math.round(response.data.progress * 100);
                progress.currentStep = response.data.state?.job_count || 0;
                progress.estimatedTimeRemaining = response.data.eta_relative || 0;
                if (response.data.current_image) {
                    progress.previewImage = response.data.current_image;
                }
            }
        }
        catch (error) {
            // Progress tracking failed, continue without it
            console.warn('Progress tracking failed:', error.message);
        }
        // Continue tracking if still generating
        if (progress.status === 'generating') {
            setTimeout(() => this.trackProgress(generationId), 2000);
        }
    }
    /**
     * Estimate generation time based on parameters
     */
    estimateGenerationTime(params) {
        // Rough estimation based on steps and dimensions
        const baseTime = 2; // seconds per step
        const dimensionMultiplier = (params.width * params.height) / (512 * 512);
        const batchMultiplier = params.batchSize;
        return Math.round(baseTime * params.steps * dimensionMultiplier * batchMultiplier);
    }
    /**
     * Get default negative prompt for quality
     */
    getDefaultNegativePrompt() {
        return 'low quality, blurry, pixelated, distorted, deformed, disfigured, bad anatomy, wrong proportions, watermark, signature, text, logo, worst quality, jpeg artifacts';
    }
    /**
     * Generate unique ID for generation
     */
    generateId() {
        return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Ensure output directory exists
     */
    async ensureOutputDirectory() {
        try {
            await promises_1.default.access(this.config.outputDirectory);
        }
        catch {
            await promises_1.default.mkdir(this.config.outputDirectory, { recursive: true });
        }
    }
    /**
     * Get available models from Stable Diffusion API
     */
    async getAvailableModels() {
        try {
            const response = await axios_1.default.get(`${this.config.apiUrl}/sdapi/v1/sd-models`);
            return response.data.map((model) => model.title);
        }
        catch (error) {
            console.error('Failed to get available models:', error);
            return [this.config.defaultModel];
        }
    }
    /**
     * Check if Stable Diffusion API is available
     */
    async isAvailable() {
        try {
            const response = await axios_1.default.get(`${this.config.apiUrl}/sdapi/v1/options`, {
                timeout: 5000
            });
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
}
exports.StableDiffusionTool = StableDiffusionTool;
//# sourceMappingURL=stable-diffusion-tool.js.map