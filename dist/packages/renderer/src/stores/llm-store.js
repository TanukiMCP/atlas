"use strict";
/**
 * LLM Store - Zustand store for managing LLM state and interactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLLMStore = void 0;
const zustand_1 = require("zustand");
const ollama_service_1 = require("../services/ollama-service");
exports.useLLMStore = (0, zustand_1.create)((set, get) => ({
    // Initial state
    isConnected: false,
    healthStatus: null,
    availableModels: [],
    currentModel: null,
    isLoadingModels: false,
    currentSession: null,
    chatSessions: [],
    isStreaming: false,
    streamingMessage: '',
    // Health and connection actions
    checkHealth: async () => {
        console.log('LLM Store: Checking health...');
        try {
            const healthStatus = await ollama_service_1.ollamaService.checkHealth();
            console.log('LLM Store: Health status:', healthStatus);
            const selectedModel = healthStatus.models.length > 0 ? healthStatus.models[0].name : null;
            console.log('LLM Store: Setting model to:', selectedModel);
            set({
                isConnected: healthStatus.isConnected,
                healthStatus,
                availableModels: healthStatus.models,
                currentModel: selectedModel
            });
        }
        catch (error) {
            console.error('LLM Store: Health check failed:', error);
            set({
                isConnected: false,
                healthStatus: {
                    isConnected: false,
                    models: [],
                    lastChecked: new Date(),
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }
    },
    refreshModels: async () => {
        console.log('LLM Store: Starting refreshModels...');
        set({ isLoadingModels: true });
        try {
            const models = await ollama_service_1.ollamaService.getModels();
            console.log('LLM Store: Got models:', models);
            const currentModel = get().currentModel;
            // Set default model if none is selected
            if (!currentModel && models.length > 0) {
                const defaultModel = models.find(m => m.name.includes('llama3.1')) || models[0];
                console.log('LLM Store: Setting default model:', defaultModel.name);
                ollama_service_1.ollamaService.setModel(defaultModel.name);
                set({
                    availableModels: models,
                    currentModel: defaultModel.name,
                    isLoadingModels: false
                });
                console.log('LLM Store: Model set successfully:', defaultModel.name);
            }
            else {
                console.log('LLM Store: Using existing model:', currentModel);
                set({
                    availableModels: models,
                    isLoadingModels: false
                });
            }
        }
        catch (error) {
            set({ isLoadingModels: false });
            console.error('LLM Store: Failed to refresh models:', error);
        }
    },
    setCurrentModel: (modelName) => {
        try {
            ollama_service_1.ollamaService.setModel(modelName);
            set({ currentModel: modelName });
        }
        catch (error) {
            console.error('Failed to set model:', error);
        }
    }, // Chat actions
    createNewSession: (name) => {
        const session = {
            id: `session_${Date.now()}`,
            name: name || `Chat ${new Date().toLocaleString()}`,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            model: get().currentModel || 'llama3.1:latest'
        };
        set(state => ({
            chatSessions: [...state.chatSessions, session],
            currentSession: session
        }));
        return session;
    },
    loadSession: (sessionId) => {
        const session = get().chatSessions.find(s => s.id === sessionId);
        if (session) {
            set({ currentSession: session });
        }
    },
    sendMessage: async (content, onChunk) => {
        const state = get();
        if (!state.currentSession) {
            // Create new session if none exists
            get().createNewSession();
        }
        if (!state.isConnected) {
            throw new Error('Not connected to Ollama. Please check if Ollama is running.');
        }
        const userMessage = {
            role: 'user',
            content
        };
        // Add user message to current session
        set(state => ({
            currentSession: state.currentSession ? {
                ...state.currentSession,
                messages: [...state.currentSession.messages, userMessage],
                updatedAt: new Date()
            } : null,
            isStreaming: true,
            streamingMessage: ''
        }));
        let assistantMessage = '';
        try {
            await ollama_service_1.ollamaService.chatStream([...(state.currentSession?.messages || []), userMessage], (chunk) => {
                if (chunk.message?.content) {
                    assistantMessage += chunk.message.content;
                    set({ streamingMessage: assistantMessage });
                    if (onChunk) {
                        onChunk(chunk.message.content);
                    }
                }
            }, (finalResponse) => {
                // Add complete assistant message to session
                const completeAssistantMessage = {
                    role: 'assistant',
                    content: assistantMessage
                };
                set(state => ({
                    currentSession: state.currentSession ? {
                        ...state.currentSession,
                        messages: [...state.currentSession.messages, completeAssistantMessage],
                        updatedAt: new Date()
                    } : null,
                    isStreaming: false,
                    streamingMessage: ''
                }));
            }, (error) => {
                set({ isStreaming: false, streamingMessage: '' });
                throw error;
            });
        }
        catch (error) {
            set({ isStreaming: false, streamingMessage: '' });
            throw error;
        }
    },
    cancelCurrentRequest: () => {
        ollama_service_1.ollamaService.cancelCurrentRequest();
        set({ isStreaming: false, streamingMessage: '' });
    },
    clearCurrentSession: () => {
        set(state => ({
            currentSession: state.currentSession ? {
                ...state.currentSession,
                messages: [],
                updatedAt: new Date()
            } : null
        }));
    },
    deleteSession: (sessionId) => {
        set(state => ({
            chatSessions: state.chatSessions.filter(s => s.id !== sessionId),
            currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }));
    },
    // Utility actions
    setStreamingMessage: (message) => {
        set({ streamingMessage: message });
    },
    setIsStreaming: (streaming) => {
        set({ isStreaming: streaming });
    }
}));
//# sourceMappingURL=llm-store.js.map