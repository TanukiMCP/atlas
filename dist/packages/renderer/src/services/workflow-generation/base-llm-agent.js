"use strict";
/**
 * Base LLM Agent for Workflow Generation System
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLLMAgent = void 0;
class BaseLLMAgent {
    id;
    name;
    role;
    systemPrompt;
    model;
    temperature;
    maxTokens;
    timeout;
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.role = config.role;
        this.systemPrompt = config.systemPrompt;
        this.model = config.model || 'gpt-4';
        this.temperature = config.temperature || 0.7;
        this.maxTokens = config.maxTokens || 4096;
        this.timeout = config.timeout || 30000;
    }
    /**
     * Process a request using this LLM agent
     */
    async processRequest(request) {
        const startTime = Date.now();
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: this.formatUserMessage(request) }
            ];
            const response = await this.callLLMAPI(messages, {
                temperature: request.temperature || this.temperature,
                maxTokens: request.maxTokens || this.maxTokens,
                timeout: this.timeout
            });
            const processingTime = Date.now() - startTime;
            return {
                content: response.content,
                tokensUsed: response.tokensUsed,
                model: this.model,
                processingTime,
                confidence: this.calculateConfidence(response),
                metadata: this.extractMetadata(response)
            };
        }
        catch (error) {
            throw new Error(`LLM Agent ${this.name} failed: ${error.message}`);
        }
    }
    /**
     * Format the user message with context if provided
     */
    formatUserMessage(request) {
        let message = request.userMessage;
        if (request.context && Object.keys(request.context).length > 0) {
            const contextString = Object.entries(request.context)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join('\n');
            message = `${message}\n\n**Context:**\n${contextString}`;
        }
        return message;
    }
    /**
     * Calculate confidence score based on response characteristics
     */
    calculateConfidence(response) {
        // Default implementation - can be overridden by specific agents
        const contentLength = response.content.length;
        const hasStructuredFormat = this.hasStructuredFormat(response.content);
        const hasReasoningMarkers = this.hasReasoningMarkers(response.content);
        let confidence = 0.5; // Base confidence
        if (contentLength > 100)
            confidence += 0.1;
        if (contentLength > 500)
            confidence += 0.1;
        if (hasStructuredFormat)
            confidence += 0.2;
        if (hasReasoningMarkers)
            confidence += 0.1;
        return Math.min(confidence, 1.0);
    }
    /**
     * Extract metadata from the response
     */
    extractMetadata(response) {
        return {
            agent: this.name,
            role: this.role,
            timestamp: new Date().toISOString(),
            responseLength: response.content.length
        };
    }
    /**
     * Check if response has structured format
     */
    hasStructuredFormat(content) {
        return content.includes('```') ||
            content.includes('┌') ||
            content.includes('│') ||
            content.includes('{') ||
            content.includes('[');
    }
    /**
     * Check if response has reasoning markers
     */
    hasReasoningMarkers(content) {
        const reasoningMarkers = [
            'because', 'therefore', 'since', 'given that',
            'step 1', 'step 2', 'first', 'second', 'then',
            'analysis:', 'reasoning:', 'explanation:'
        ];
        const lowerContent = content.toLowerCase();
        return reasoningMarkers.some(marker => lowerContent.includes(marker));
    }
    /**
     * Get agent status information
     */
    getStatus() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            model: this.model,
            isHealthy: true // Basic implementation
        };
    }
}
exports.BaseLLMAgent = BaseLLMAgent;
//# sourceMappingURL=base-llm-agent.js.map