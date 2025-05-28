"use strict";
/**
 * Ollama LLM Service - Real local LLM integration for TanukiMCP Atlas
 * Provides streaming chat, model management, and health monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaService = void 0;
class OllamaService {
    baseUrl = 'http://localhost:11434';
    currentModel = '';
    healthStatus = {
        isConnected: false,
        models: [],
        lastChecked: new Date()
    };
    abortController = null;
    constructor(baseUrl) {
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
        this.checkHealth();
    }
    /**
     * Check Ollama server health and available models
     */
    async checkHealth() {
        try {
            // Check if Ollama is running
            const response = await fetch(`${this.baseUrl}/api/version`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) {
                throw new Error(`Ollama server responded with ${response.status}`);
            }
            const versionData = await response.json();
            // Get available models
            const modelsResponse = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            const modelsData = await modelsResponse.json();
            this.healthStatus = {
                isConnected: true,
                version: versionData.version,
                models: modelsData.models || [],
                lastChecked: new Date()
            };
            // Set default model if none selected and models are available
            if (!this.currentModel && this.healthStatus.models.length > 0) {
                this.currentModel = this.healthStatus.models[0].name;
            }
        }
        catch (error) {
            this.healthStatus = {
                isConnected: false,
                models: [],
                lastChecked: new Date(),
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
        return this.healthStatus;
    }
    /**
     * Get current health status
     */
    getHealthStatus() {
        return { ...this.healthStatus };
    }
    /**
     * Get available models
     */
    async getModels() {
        await this.checkHealth();
        return this.healthStatus.models;
    }
    /**
     * Set current model
     */
    setModel(modelName) {
        const modelExists = this.healthStatus.models.some(m => m.name === modelName);
        if (modelExists) {
            this.currentModel = modelName;
        }
        else {
            throw new Error(`Model '${modelName}' not found. Available models: ${this.healthStatus.models.map(m => m.name).join(', ')}`);
        }
    } /**
     * Get current model
     */
    getCurrentModel() {
        return this.currentModel;
    }
    /**
     * Send a chat message with streaming response
     */
    async chatStream(messages, onChunk, onComplete, onError, options) {
        if (!this.healthStatus.isConnected) {
            onError(new Error('Ollama is not connected. Please check if Ollama is running.'));
            return;
        }
        if (!this.currentModel) {
            onError(new Error('No model selected. Please select a model first.'));
            return;
        }
        // Cancel any existing request
        this.cancelCurrentRequest();
        // Create new abort controller
        this.abortController = new AbortController();
        const request = {
            model: this.currentModel,
            messages,
            stream: true,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                top_k: 40,
                repeat_penalty: 1.1,
                ...options
            }
        };
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                signal: this.abortController.signal
            });
            if (!response.ok) {
                throw new Error(`Chat request failed: ${response.statusText}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body available');
            }
            const decoder = new TextDecoder();
            let finalResponse = null;
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            // Call chunk callback
                            onChunk(data);
                            // Store final response
                            if (data.done) {
                                finalResponse = data;
                            }
                        }
                        catch (e) {
                            // Ignore malformed JSON lines
                        }
                    }
                }
                // Call completion callback with final response
                if (finalResponse) {
                    onComplete(finalResponse);
                }
            }
            finally {
                reader.releaseLock();
            }
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Request was cancelled, don't call error callback
                return;
            }
            onError(error instanceof Error ? error : new Error('Unknown error occurred'));
        }
        finally {
            this.abortController = null;
        }
    }
    /**
     * Cancel current chat request
     */
    cancelCurrentRequest() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    } /**
     * Send a non-streaming chat message
     */
    async chat(messages, options) {
        return new Promise((resolve, reject) => {
            let finalResponse = null;
            this.chatStream(messages, (chunk) => {
                if (chunk.done) {
                    finalResponse = chunk;
                }
            }, (response) => {
                resolve(response);
            }, (error) => {
                reject(error);
            }, options);
        });
    }
    /**
     * Check if a request is currently in progress
     */
    isRequestInProgress() {
        return this.abortController !== null;
    }
    /**
     * Set Ollama server URL
     */
    setBaseUrl(url) {
        this.baseUrl = url;
        this.checkHealth();
    }
    /**
     * Get current server URL
     */
    getBaseUrl() {
        return this.baseUrl;
    }
}
// Export singleton instance
exports.ollamaService = new OllamaService();
//# sourceMappingURL=ollama-service.js.map