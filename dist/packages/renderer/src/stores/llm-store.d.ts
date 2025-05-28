/**
 * LLM Store - Zustand store for managing LLM state and interactions
 */
import { OllamaModel, OllamaChatMessage, OllamaHealthStatus } from '../services/ollama-service';
export interface ChatSession {
    id: string;
    name: string;
    messages: OllamaChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    model: string;
}
export interface LLMState {
    isConnected: boolean;
    healthStatus: OllamaHealthStatus | null;
    availableModels: OllamaModel[];
    currentModel: string | null;
    isLoadingModels: boolean;
    currentSession: ChatSession | null;
    chatSessions: ChatSession[];
    isStreaming: boolean;
    streamingMessage: string;
    checkHealth: () => Promise<void>;
    refreshModels: () => Promise<void>;
    setCurrentModel: (modelName: string) => void;
    createNewSession: (name?: string) => ChatSession;
    loadSession: (sessionId: string) => void;
    sendMessage: (content: string, onChunk?: (chunk: string) => void) => Promise<void>;
    cancelCurrentRequest: () => void;
    clearCurrentSession: () => void;
    deleteSession: (sessionId: string) => void;
    setStreamingMessage: (message: string) => void;
    setIsStreaming: (streaming: boolean) => void;
}
export declare const useLLMStore: import("zustand").UseBoundStore<import("zustand").StoreApi<LLMState>>;
//# sourceMappingURL=llm-store.d.ts.map