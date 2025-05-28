"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedProcessorIntegration = void 0;
const clear_thought_router_1 = require("../../../tools/clear-thought/src/router/clear-thought-router");
const sequential_thinking_1 = require("../../../tools/clear-thought/src/tools/sequential-thinking");
const mental_models_1 = require("../../../tools/clear-thought/src/tools/mental-models");
const stable_diffusion_tool_1 = require("../../../tools/image-generation/src/stable-diffusion-tool");
const mobile_server_1 = require("../../../mobile-server/src/mobile-server");
class EnhancedProcessorIntegration {
    config;
    clearThoughtRouter;
    sequentialThinking;
    mentalModels;
    stableDiffusion;
    mobileServer;
    constructor(config) {
        this.config = config;
        this.initializeComponents();
    }
    initializeComponents() {
        // Initialize Clear Thought tools
        if (this.config.enableClearThought) {
            this.clearThoughtRouter = new clear_thought_router_1.ClearThoughtRouter();
            this.sequentialThinking = new sequential_thinking_1.SequentialThinkingTool();
            this.mentalModels = new mental_models_1.MentalModelsTool();
        }
        // Initialize image generation
        if (this.config.enableImageGeneration) {
            this.stableDiffusion = new stable_diffusion_tool_1.StableDiffusionTool(this.config.imageGenerationConfig);
        }
        // Initialize mobile server
        if (this.config.enableMobileServer) {
            this.mobileServer = new mobile_server_1.MobileServer(this.config.mobileServerConfig);
            if (this.config.mobileServerConfig.autoStart) {
                this.startMobileServer();
            }
        }
    }
    /**
     * Enhanced request processing with Clear Thought integration
     */
    async processRequest(request, context = {}) {
        const startTime = Date.now();
        const processingContext = this.createProcessingContext(request, context);
        const usedTools = [];
        try {
            // Step 1: Analyze request complexity and determine tier
            if (this.config.enableClearThought) {
                processingContext.taskAnalysis = this.clearThoughtRouter.analyzeTask(request, context);
                processingContext.complexity = processingContext.taskAnalysis.complexity;
                processingContext.tier = this.determineTier(processingContext.complexity);
            }
            // Step 2: Apply Clear Thought tools for Tier 3+ requests
            let enhancedRequest = request;
            if (this.shouldUseClearThought(processingContext)) {
                const clearThoughtResult = await this.applyClearThoughtTools(request, processingContext);
                enhancedRequest = clearThoughtResult.enhancedRequest;
                usedTools.push(...clearThoughtResult.usedTools);
            }
            // Step 3: Check for image generation requests
            if (this.isImageGenerationRequest(enhancedRequest)) {
                const imageResult = await this.handleImageGeneration(enhancedRequest, processingContext);
                return {
                    response: imageResult.response,
                    context: processingContext,
                    usedTools: [...usedTools, 'image_generation'],
                    processingTime: Date.now() - startTime
                };
            }
            // Step 4: Process through appropriate tier
            const response = await this.processByTier(enhancedRequest, processingContext);
            return {
                response,
                context: processingContext,
                usedTools,
                processingTime: Date.now() - startTime
            };
        }
        catch (error) {
            console.error('Enhanced processing failed:', error);
            throw error;
        }
    }
    /**
     * Apply Clear Thought tools based on task analysis
     */
    async applyClearThoughtTools(request, context) {
        const usedTools = [];
        const insights = [];
        let enhancedRequest = request;
        if (!context.taskAnalysis) {
            return { enhancedRequest, usedTools, insights };
        }
        // Get appropriate tools for the tier
        let selectedTools = [];
        if (context.tier >= 3) {
            selectedTools = this.clearThoughtRouter.selectToolsForTier3(context.taskAnalysis);
        }
        if (context.tier >= 4) {
            selectedTools.push(...this.clearThoughtRouter.getAdvancedToolset(context.taskAnalysis));
        }
        // Create execution plan
        const executionPlan = this.clearThoughtRouter.createExecutionPlan(selectedTools);
        // Execute thinking tools in order
        for (const toolConfig of executionPlan) {
            try {
                const result = await this.executeClearThoughtTool(toolConfig.capability, enhancedRequest, context);
                if (result) {
                    enhancedRequest = result.enhancedRequest || enhancedRequest;
                    insights.push(result.insight);
                    usedTools.push(toolConfig.capability);
                }
            }
            catch (error) {
                console.warn(`Clear Thought tool ${toolConfig.capability} failed:`, error);
            }
        }
        return { enhancedRequest, usedTools, insights };
    }
    /**
     * Execute individual Clear Thought tool
     */
    async executeClearThoughtTool(capability, request, context) {
        switch (capability) {
            case clear_thought_router_1.ThinkingCapability.SEQUENTIAL_THINKING:
                const thinkingResult = await this.sequentialThinking.execute({
                    thought: `Analyzing request: ${request}`,
                    thoughtNumber: 1,
                    totalThoughts: 3,
                    nextThoughtNeeded: true
                });
                return {
                    insight: `Sequential thinking applied: ${thinkingResult.thought}`,
                    enhancedRequest: `[Enhanced with sequential thinking] ${request}`
                };
            case clear_thought_router_1.ThinkingCapability.MENTAL_MODELS:
                const suggestion = this.mentalModels.suggestModel(request);
                const modelResult = await this.mentalModels.execute({
                    modelName: suggestion.recommendedModel,
                    problem: request
                });
                return {
                    insight: `Mental model (${suggestion.recommendedModel}) applied: ${modelResult.conclusion}`,
                    enhancedRequest: `[Enhanced with ${suggestion.recommendedModel}] ${request}`
                };
            default:
                return null;
        }
    }
    /**
     * Handle image generation requests
     */
    async handleImageGeneration(request, context) {
        if (!this.stableDiffusion) {
            throw new Error('Image generation not available');
        }
        // Extract image prompt from request
        const imagePrompt = this.extractImagePrompt(request);
        const result = await this.stableDiffusion.execute({
            prompt: imagePrompt,
            enhancePrompt: true,
            quality: 'standard',
            variations: 1
        });
        return {
            response: `🎨 **Image Generation Started**

**Enhanced Prompt:** ${result.enhancedPrompt || imagePrompt}
**Generation ID:** ${result.generationId}
**Estimated Time:** ${result.estimatedTime} seconds

Your image is being generated! I'll update you with progress and show the result when complete.

*Generating with vivid detail and professional quality...*`
        };
    }
    /**
     * Process request through appropriate tier
     */
    async processByTier(request, context) {
        // This would integrate with the existing tier processors
        // For now, return enhanced response based on tier
        switch (context.tier) {
            case 1:
                return `[Tier 1 - Direct Response] ${request}`;
            case 2:
                return `[Tier 2 - Atomic Processing] Processed: ${request}`;
            case 3:
                return `[Tier 3 - Moderate Processing with Clear Thought] Enhanced analysis of: ${request}`;
            case 4:
                return `[Tier 4 - Complex Processing with Full Clear Thought Suite] Comprehensive analysis of: ${request}`;
            default:
                return `[Default Processing] ${request}`;
        }
    }
    /**
     * Mobile server management
     */
    async startMobileServer() {
        if (!this.mobileServer) {
            throw new Error('Mobile server not initialized');
        }
        try {
            await this.mobileServer.start();
            console.log('Mobile server started successfully');
        }
        catch (error) {
            console.error('Failed to start mobile server:', error);
            throw error;
        }
    }
    async stopMobileServer() {
        if (this.mobileServer) {
            await this.mobileServer.stop();
        }
    }
    getMobileServerInfo() {
        if (!this.mobileServer) {
            return null;
        }
        const connectionInfo = this.mobileServer.getConnectionInfo();
        return {
            url: connectionInfo.url,
            isRunning: true // Would check actual status
        };
    }
    /**
     * Utility methods
     */
    createProcessingContext(request, partial) {
        return {
            requestId: partial.requestId || this.generateRequestId(),
            userId: partial.userId || 'default',
            source: partial.source || 'desktop',
            complexity: partial.complexity || 1,
            tier: partial.tier || 1,
            enabledFeatures: this.getEnabledFeatures(),
            ...partial
        };
    }
    shouldUseClearThought(context) {
        return this.config.enableClearThought &&
            context.complexity >= this.config.clearThoughtConfig.minComplexityForTier3;
    }
    determineTier(complexity) {
        if (complexity <= 2)
            return 1; // Direct response
        if (complexity <= 4)
            return 2; // Atomic processing
        if (complexity <= 6)
            return 3; // Moderate processing
        return 4; // Complex processing
    }
    isImageGenerationRequest(request) {
        const imageKeywords = [
            'generate image', 'create image', 'draw', 'paint', 'visualize',
            'make a picture', 'show me', 'illustrate', 'design'
        ];
        const lowerRequest = request.toLowerCase();
        return imageKeywords.some(keyword => lowerRequest.includes(keyword));
    }
    extractImagePrompt(request) {
        // Simple extraction - would be more sophisticated in production
        const patterns = [
            /generate (?:an? )?image of (.+)/i,
            /create (?:an? )?image of (.+)/i,
            /draw (.+)/i,
            /paint (.+)/i,
            /visualize (.+)/i,
            /make (?:a )?picture of (.+)/i,
            /show me (.+)/i,
            /illustrate (.+)/i
        ];
        for (const pattern of patterns) {
            const match = request.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        return request; // Fallback to full request
    }
    getEnabledFeatures() {
        const features = [];
        if (this.config.enableClearThought)
            features.push('clear_thought');
        if (this.config.enableMobileServer)
            features.push('mobile_server');
        if (this.config.enableImageGeneration)
            features.push('image_generation');
        return features;
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Get system status
     */
    getSystemStatus() {
        return {
            clearThought: {
                enabled: this.config.enableClearThought,
                toolsAvailable: this.clearThoughtRouter ? 11 : 0
            },
            mobileServer: {
                enabled: this.config.enableMobileServer,
                running: !!this.mobileServer,
                connections: this.mobileServer?.getConnectedClients().length || 0
            },
            imageGeneration: {
                enabled: this.config.enableImageGeneration,
                available: !!this.stableDiffusion
            }
        };
    }
}
exports.EnhancedProcessorIntegration = EnhancedProcessorIntegration;
//# sourceMappingURL=enhanced-processor-integration.js.map