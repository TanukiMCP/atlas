import { ClearThoughtRouter, TaskAnalysis, ThinkingCapability } from '../../../tools/clear-thought/src/router/clear-thought-router';
import { SequentialThinkingTool } from '../../../tools/clear-thought/src/tools/sequential-thinking';
import { MentalModelsTool } from '../../../tools/clear-thought/src/tools/mental-models';
import { StableDiffusionTool } from '../../../tools/image-generation/src/stable-diffusion-tool';
import { MobileServer } from '../../../mobile-server/src/mobile-server';

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

export class EnhancedProcessorIntegration {
  private config: EnhancedProcessorConfig;
  private clearThoughtRouter: ClearThoughtRouter;
  private sequentialThinking: SequentialThinkingTool;
  private mentalModels: MentalModelsTool;
  private stableDiffusion: StableDiffusionTool;
  private mobileServer?: MobileServer;

  constructor(config: EnhancedProcessorConfig) {
    this.config = config;
    this.initializeComponents();
  }

  private initializeComponents(): void {
    // Initialize Clear Thought tools
    if (this.config.enableClearThought) {
      this.clearThoughtRouter = new ClearThoughtRouter();
      this.sequentialThinking = new SequentialThinkingTool();
      this.mentalModels = new MentalModelsTool();
    }

    // Initialize image generation
    if (this.config.enableImageGeneration) {
      this.stableDiffusion = new StableDiffusionTool(this.config.imageGenerationConfig);
    }

    // Initialize mobile server
    if (this.config.enableMobileServer) {
      this.mobileServer = new MobileServer(this.config.mobileServerConfig);
      if (this.config.mobileServerConfig.autoStart) {
        this.startMobileServer();
      }
    }
  }

  /**
   * Enhanced request processing with Clear Thought integration
   */
  public async processRequest(
    request: string, 
    context: Partial<ProcessingContext> = {}
  ): Promise<{
    response: string;
    context: ProcessingContext;
    usedTools: string[];
    processingTime: number;
  }> {
    const startTime = Date.now();
    const processingContext = this.createProcessingContext(request, context);
    const usedTools: string[] = [];

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

    } catch (error) {
      console.error('Enhanced processing failed:', error);
      throw error;
    }
  }

  /**
   * Apply Clear Thought tools based on task analysis
   */
  private async applyClearThoughtTools(
    request: string, 
    context: ProcessingContext
  ): Promise<{
    enhancedRequest: string;
    usedTools: string[];
    insights: string[];
  }> {
    const usedTools: string[] = [];
    const insights: string[] = [];
    let enhancedRequest = request;

    if (!context.taskAnalysis) {
      return { enhancedRequest, usedTools, insights };
    }

    // Get appropriate tools for the tier
    let selectedTools: ThinkingCapability[] = [];
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
        const result = await this.executeClearThoughtTool(
          toolConfig.capability, 
          enhancedRequest, 
          context
        );
        
        if (result) {
          enhancedRequest = result.enhancedRequest || enhancedRequest;
          insights.push(result.insight);
          usedTools.push(toolConfig.capability);
        }
      } catch (error) {
        console.warn(`Clear Thought tool ${toolConfig.capability} failed:`, error);
      }
    }

    return { enhancedRequest, usedTools, insights };
  }

  /**
   * Execute individual Clear Thought tool
   */
  private async executeClearThoughtTool(
    capability: ThinkingCapability,
    request: string,
    context: ProcessingContext
  ): Promise<{
    enhancedRequest?: string;
    insight: string;
  } | null> {
    switch (capability) {
      case ThinkingCapability.SEQUENTIAL_THINKING:
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

      case ThinkingCapability.MENTAL_MODELS:
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
  private async handleImageGeneration(
    request: string, 
    context: ProcessingContext
  ): Promise<{ response: string }> {
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
  private async processByTier(
    request: string, 
    context: ProcessingContext
  ): Promise<string> {
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
  public async startMobileServer(): Promise<void> {
    if (!this.mobileServer) {
      throw new Error('Mobile server not initialized');
    }

    try {
      await this.mobileServer.start();
      console.log('Mobile server started successfully');
    } catch (error) {
      console.error('Failed to start mobile server:', error);
      throw error;
    }
  }

  public async stopMobileServer(): Promise<void> {
    if (this.mobileServer) {
      await this.mobileServer.stop();
    }
  }

  public getMobileServerInfo(): { url: string; isRunning: boolean } | null {
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
  private createProcessingContext(
    request: string, 
    partial: Partial<ProcessingContext>
  ): ProcessingContext {
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

  private shouldUseClearThought(context: ProcessingContext): boolean {
    return this.config.enableClearThought && 
           context.complexity >= this.config.clearThoughtConfig.minComplexityForTier3;
  }

  private determineTier(complexity: number): number {
    if (complexity <= 2) return 1; // Direct response
    if (complexity <= 4) return 2; // Atomic processing
    if (complexity <= 6) return 3; // Moderate processing
    return 4; // Complex processing
  }

  private isImageGenerationRequest(request: string): boolean {
    const imageKeywords = [
      'generate image', 'create image', 'draw', 'paint', 'visualize',
      'make a picture', 'show me', 'illustrate', 'design'
    ];
    
    const lowerRequest = request.toLowerCase();
    return imageKeywords.some(keyword => lowerRequest.includes(keyword));
  }

  private extractImagePrompt(request: string): string {
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

  private getEnabledFeatures(): string[] {
    const features: string[] = [];
    if (this.config.enableClearThought) features.push('clear_thought');
    if (this.config.enableMobileServer) features.push('mobile_server');
    if (this.config.enableImageGeneration) features.push('image_generation');
    return features;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system status
   */
  public getSystemStatus(): {
    clearThought: { enabled: boolean; toolsAvailable: number };
    mobileServer: { enabled: boolean; running: boolean; connections: number };
    imageGeneration: { enabled: boolean; available: boolean };
  } {
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