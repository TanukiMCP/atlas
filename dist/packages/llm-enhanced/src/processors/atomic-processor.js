"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicProcessor = void 0;
const base_processor_1 = require("./base-processor");
class AtomicProcessor extends base_processor_1.BaseProcessor {
    responseCache = new Map();
    modelName = 'llama3.2:1b'; // Lightweight model for instant responses
    constructor() {
        super('atomic');
        this.initializeCache();
    }
    async process(request) {
        return this.processWithTimeout(request, 1000); // Hard 1s timeout
    }
    async generateResponse(request) {
        // Check cache first for instant responses
        const cacheKey = this.generateCacheKey(request);
        const cachedResponse = this.responseCache.get(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Generate quick response using lightweight model
        const prompt = this.buildAtomicPrompt(request);
        try {
            const response = await this.callOllamaModel(prompt, {
                temperature: 0.1, // Low temperature for consistency
                max_tokens: 150, // Short responses
                top_p: 0.9,
                stream: false
            });
            // Cache the response for future use
            this.responseCache.set(cacheKey, response);
            return response;
        }
        catch (error) {
            // Fallback to template response
            return this.generateTemplateResponse(request);
        }
    }
    async calculateQuality(response, request) {
        // Fast quality assessment for atomic responses
        const wordCount = response.split(/\s+/).length;
        const hasDirectAnswer = this.containsDirectAnswer(response, request.content);
        const isCoherent = this.assessCoherence(response);
        return {
            coherence: isCoherent ? 85 : 60,
            relevance: hasDirectAnswer ? 90 : 70,
            accuracy: 75, // Conservative estimate for speed
            completeness: Math.min(wordCount / 20 * 100, 90), // Based on response length
            clarity: 85,
            creativity: 40, // Atomic responses prioritize speed over creativity
            overallScore: hasDirectAnswer && isCoherent ? 80 : 65
        };
    }
    getModelName() {
        return this.modelName;
    }
    getProcessingSteps(request) {
        return [
            {
                step: 1,
                description: 'Cache lookup',
                tier: 'atomic',
                model: this.modelName,
                startTime: new Date(),
                endTime: new Date(),
                result: 'Cache check completed',
                confidence: 1.0
            },
            {
                step: 2,
                description: 'Lightweight model generation',
                tier: 'atomic',
                model: this.modelName,
                startTime: new Date(),
                endTime: new Date(),
                result: 'Response generated',
                confidence: 0.8
            }
        ];
    }
    initializeCache() {
        // Pre-populate cache with common responses
        const commonResponses = [
            { key: 'greeting', response: 'Hello! How can I assist you today?' },
            { key: 'thanks', response: 'You\'re welcome! Is there anything else I can help you with?' },
            { key: 'help', response: 'I\'m here to help! Please describe what you need assistance with.' },
            { key: 'unclear', response: 'Could you please clarify or provide more details about what you\'re looking for?' }
        ];
        commonResponses.forEach(({ key, response }) => {
            this.responseCache.set(key, response);
        });
    }
    generateCacheKey(request) {
        // Create a hash-like key for caching
        const content = request.content.toLowerCase().trim();
        const words = content.split(/\s+/).slice(0, 5).join(' '); // First 5 words
        return btoa(words).slice(0, 16); // Base64 encode and truncate
    }
    buildAtomicPrompt(request) {
        // Simple, direct prompt for atomic responses
        const context = request.context.subjectMode !== 'general'
            ? `Context: ${request.context.subjectMode} mode. `
            : '';
        return `${context}Provide a brief, direct answer to: ${request.content}

Keep your response concise (under 50 words) and focus on the most important information.`;
    }
    async callOllamaModel(prompt, options) {
        // This would integrate with the Ollama service from Phase 2
        // For now, return a placeholder that will be replaced with actual Ollama integration
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.modelName,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: options.temperature,
                    num_predict: options.max_tokens,
                    top_p: options.top_p
                }
            })
        });
        if (!response.ok) {
            throw new Error(`Ollama request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.response || '';
    }
    generateTemplateResponse(request) {
        // Fallback template responses when model fails
        const content = request.content.toLowerCase();
        if (content.includes('hello') || content.includes('hi')) {
            return 'Hello! How can I help you today?';
        }
        if (content.includes('thank')) {
            return 'You\'re welcome!';
        }
        if (content.includes('help')) {
            return 'I\'d be happy to help! Please provide more details about what you need.';
        }
        if (content.includes('?')) {
            return 'I understand you have a question. Could you provide more context so I can give you a helpful answer?';
        }
        return 'I received your message. Please provide more details so I can assist you better.';
    }
    containsDirectAnswer(response, question) {
        const questionWords = question.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        const responseWords = response.toLowerCase().split(/\s+/);
        const overlap = questionWords.filter(word => responseWords.includes(word));
        return overlap.length >= Math.min(2, questionWords.length * 0.3);
    }
    assessCoherence(response) {
        // Simple coherence check
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0)
            return false;
        if (sentences.length === 1)
            return true;
        // Check for basic sentence structure and word count
        const avgWordsPerSentence = response.split(/\s+/).length / sentences.length;
        return avgWordsPerSentence >= 3 && avgWordsPerSentence <= 25;
    }
    // Cache management
    clearCache() {
        this.responseCache.clear();
        this.initializeCache();
    }
    getCacheSize() {
        return this.responseCache.size;
    }
    getCacheHitRate() {
        // This would be tracked with actual metrics in production
        return 0.3; // Placeholder 30% hit rate
    }
}
exports.AtomicProcessor = AtomicProcessor;
//# sourceMappingURL=atomic-processor.js.map