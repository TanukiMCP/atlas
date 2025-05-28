/**
 * Ollama LLM Service - Real local LLM integration for TanukiMCP Atlas
 * Provides streaming chat, model management, and health monitoring
 */
export interface OllamaModel {
    name: string;
    size: number;
    digest: string;
    modified_at: string;
    details?: {
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
}
export interface OllamaChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    images?: string[];
}
export interface OllamaChatRequest {
    model: string;
    messages: OllamaChatMessage[];
    stream?: boolean;
    options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        repeat_penalty?: number;
        seed?: number;
        num_ctx?: number;
    };
}
export interface OllamaChatResponse {
    model: string;
    created_at: string;
    message: OllamaChatMessage;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
export interface OllamaHealthStatus {
    isConnected: boolean;
    version?: string;
    models: OllamaModel[];
    lastChecked: Date;
    error?: string;
}
export type ChatStreamCallback = (chunk: OllamaChatResponse) => void;
export type ChatCompleteCallback = (finalResponse: OllamaChatResponse) => void;
export type ChatErrorCallback = (error: Error) => void;
declare class OllamaService {
    private baseUrl;
    private currentModel;
    private healthStatus;
    private abortController;
    constructor(baseUrl?: string);
    /**
     * Check Ollama server health and available models
     */
    checkHealth(): Promise<OllamaHealthStatus>;
    /**
     * Get current health status
     */
    getHealthStatus(): OllamaHealthStatus;
    /**
     * Get available models
     */
    getModels(): Promise<OllamaModel[]>;
    /**
     * Set current model
     */
    setModel(modelName: string): void; /**
     * Get current model
     */
    getCurrentModel(): string;
    /**
     * Send a chat message with streaming response
     */
    chatStream(messages: OllamaChatMessage[], onChunk: ChatStreamCallback, onComplete: ChatCompleteCallback, onError: ChatErrorCallback, options?: OllamaChatRequest['options']): Promise<void>;
    /**
     * Cancel current chat request
     */
    cancelCurrentRequest(): void; /**
     * Send a non-streaming chat message
     */
    chat(messages: OllamaChatMessage[], options?: OllamaChatRequest['options']): Promise<OllamaChatResponse>;
    /**
     * Check if a request is currently in progress
     */
    isRequestInProgress(): boolean;
    /**
     * Set Ollama server URL
     */
    setBaseUrl(url: string): void;
    /**
     * Get current server URL
     */
    getBaseUrl(): string;
}
export declare const ollamaService: OllamaService;
export {};
//# sourceMappingURL=ollama-service.d.ts.map