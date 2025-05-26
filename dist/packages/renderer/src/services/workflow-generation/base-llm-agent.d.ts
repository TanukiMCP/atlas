/**
 * Base LLM Agent for Workflow Generation System
 */
import { LLMAgent, LLMAgentRole } from '../../types/workflow-types';
export interface LLMAgentConfig {
    id: string;
    name: string;
    role: LLMAgentRole;
    systemPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
}
export interface LLMRequest {
    userMessage: string;
    context?: Record<string, any>;
    temperature?: number;
    maxTokens?: number;
}
export interface LLMResponse {
    content: string;
    tokensUsed: number;
    model: string;
    processingTime: number;
    confidence?: number;
    metadata?: Record<string, any>;
}
export declare abstract class BaseLLMAgent implements LLMAgent {
    readonly id: string;
    readonly name: string;
    readonly role: LLMAgentRole;
    readonly systemPrompt: string;
    readonly model: string;
    readonly temperature: number;
    readonly maxTokens: number;
    private readonly timeout;
    constructor(config: LLMAgentConfig);
    /**
     * Process a request using this LLM agent
     */
    processRequest(request: LLMRequest): Promise<LLMResponse>;
    /**
     * Format the user message with context if provided
     */
    protected formatUserMessage(request: LLMRequest): string;
    /**
     * Abstract method to call the actual LLM API
     * This should be implemented by concrete agent classes
     */
    protected abstract callLLMAPI(messages: Array<{
        role: string;
        content: string;
    }>, options: {
        temperature: number;
        maxTokens: number;
        timeout: number;
    }): Promise<{
        content: string;
        tokensUsed: number;
        metadata?: any;
    }>;
    /**
     * Calculate confidence score based on response characteristics
     */
    protected calculateConfidence(response: any): number;
    /**
     * Extract metadata from the response
     */
    protected extractMetadata(response: any): Record<string, any>;
    /**
     * Check if response has structured format
     */
    protected hasStructuredFormat(content: string): boolean;
    /**
     * Check if response has reasoning markers
     */
    protected hasReasoningMarkers(content: string): boolean;
    /**
     * Validate response format for the specific agent type
     */
    protected abstract validateResponse(content: string): boolean;
    /**
     * Get agent status information
     */
    getStatus(): {
        id: string;
        name: string;
        role: LLMAgentRole;
        model: string;
        isHealthy: boolean;
    };
}
//# sourceMappingURL=base-llm-agent.d.ts.map