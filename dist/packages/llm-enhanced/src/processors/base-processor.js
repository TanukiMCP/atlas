"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
const eventemitter3_1 = require("eventemitter3");
class BaseProcessor extends eventemitter3_1.EventEmitter {
    tier;
    isProcessing = false;
    activeRequests = new Map();
    constructor(tier) {
        super();
        this.tier = tier;
    }
    async processWithTimeout(request, timeoutMs = this.getDefaultTimeout()) {
        const abortController = new AbortController();
        this.activeRequests.set(request.id, abortController);
        try {
            this.emit('processing:started', request.id);
            const startTime = Date.now();
            // Generate response with timeout
            const responsePromise = this.generateResponse(request);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Processing timeout')), timeoutMs);
            });
            const content = await Promise.race([responsePromise, timeoutPromise]);
            // Calculate quality metrics
            const qualityMetrics = await this.calculateQuality(content, request);
            this.emit('quality:calculated', request.id, qualityMetrics);
            const processingTime = Date.now() - startTime;
            const response = {
                id: crypto.randomUUID(),
                requestId: request.id,
                content,
                tier: this.tier,
                qualityScore: qualityMetrics.overallScore,
                confidence: this.calculateConfidence(qualityMetrics),
                processingTime,
                model: this.getModelName(),
                reasoning: this.extractReasoning(content),
                citations: this.extractCitations(content),
                metadata: {
                    tokensUsed: this.estimateTokenCount(content),
                    modelsInvolved: [this.getModelName()],
                    processingSteps: this.getProcessingSteps(request),
                    qualityMetrics,
                    userInterventions: []
                }
            };
            this.emit('processing:completed', request.id, response);
            return response;
        }
        catch (error) {
            this.emit('processing:error', request.id, error);
            throw error;
        }
        finally {
            this.activeRequests.delete(request.id);
        }
    }
    async cancelRequest(requestId) {
        const controller = this.activeRequests.get(requestId);
        if (controller) {
            controller.abort();
            this.activeRequests.delete(requestId);
        }
    }
    getDefaultTimeout() {
        const timeouts = {
            atomic: 1000, // 1s
            moderate: 5000, // 5s  
            complex: 15000, // 15s
            expert: 45000 // 45s
        };
        return timeouts[this.tier];
    }
    calculateConfidence(metrics) {
        // Weighted confidence calculation
        return (metrics.coherence * 0.3 +
            metrics.relevance * 0.3 +
            metrics.accuracy * 0.2 +
            metrics.completeness * 0.2);
    }
    extractReasoning(content) {
        // Extract reasoning steps from content
        const reasoningPattern = /(?:step \d+|first|second|third|finally|therefore|because|since)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi;
        return content.match(reasoningPattern) || [];
    }
    extractCitations(content) {
        // Extract citations and sources
        const citationPattern = /\[.*?\]|\(.*?\)|source:.*$/gim;
        return content.match(citationPattern) || [];
    }
    estimateTokenCount(content) {
        // Rough token estimation (4 characters per token average)
        return Math.ceil(content.length / 4);
    }
    async getHealth() {
        return {
            tier: this.tier,
            isHealthy: !this.isProcessing || this.activeRequests.size < 5,
            activeRequests: this.activeRequests.size,
            averageProcessingTime: await this.getAverageProcessingTime(),
            successRate: await this.getSuccessRate()
        };
    }
    async getAverageProcessingTime() {
        // Implement based on historical data
        return 0;
    }
    async getSuccessRate() {
        // Implement based on historical data
        return 100;
    }
}
exports.BaseProcessor = BaseProcessor;
//# sourceMappingURL=base-processor.js.map