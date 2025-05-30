/**
 * LLM Store - Zustand store for managing LLM state and interactions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FreeModel {
  id: string;
  displayName: string;
  description: string;
  specialization: string[];
  isAvailable: boolean;
  rateLimits: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface OpenRouterHealthStatus {
  isConnected: boolean;
  availableModels: FreeModel[];
  lastChecked: Date;
  error?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: OpenRouterMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface LLMState {
  // Connection state
  isConnected: boolean;
  healthStatus: OpenRouterHealthStatus | null;
  
  // Models
  availableModels: FreeModel[];
  currentModel: string | null;
  isLoadingModels: boolean;
  
  // Chat state
  currentSession: ChatSession | null;
  chatSessions: ChatSession[];
  isStreaming: boolean;
  streamingMessage: string;
  
  // Actions
  checkHealth: () => Promise<void>;
  refreshModels: () => Promise<void>;
  setCurrentModel: (modelName: string) => void;
  
  // Chat actions
  createNewSession: (name?: string) => ChatSession;
  loadSession: (sessionId: string) => void;
  sendMessage: (content: string, onChunk?: (chunk: string) => void) => Promise<void>;
  cancelCurrentRequest: () => void;
  clearCurrentSession: () => void;
  deleteSession: (sessionId: string) => void;
  
  // Utility actions
  setStreamingMessage: (message: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  
  // New OpenRouter specific actions
  getModelRecommendations: (taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') => Promise<FreeModel[]>;
  getBestModelForTask: (taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') => Promise<FreeModel | null>;
}

export const useLLMStore = create<LLMState>()(
  persist(
    (set, get) => ({
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
        console.log('LLM Store: Checking OpenRouter health...');
        try {
          const healthStatus = await window.electronAPI.invoke('openrouter:checkHealth');
          console.log('LLM Store: Health status:', healthStatus);
          const selectedModel = healthStatus.availableModels.length > 0 ? healthStatus.availableModels[0].id : null;
          console.log('LLM Store: Setting model to:', selectedModel);
          set({
            isConnected: healthStatus.isConnected,
            healthStatus,
            availableModels: healthStatus.availableModels,
            currentModel: selectedModel
          });
        } catch (error) {
          console.error('LLM Store: Health check failed:', error);
          set({
            isConnected: false,
            healthStatus: {
              isConnected: false,
              availableModels: [],
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
          const availableModels = await window.electronAPI.invoke('openrouter:getAvailableModels');
          console.log('LLM Store: Available models:', availableModels);
          
          set({ 
            availableModels,
            isLoadingModels: false
          });
        } catch (error) {
          console.error('LLM Store: Failed to refresh models:', error);
          set({ 
            availableModels: [],
            isLoadingModels: false 
          });
        }
      },

      setCurrentModel: (modelName: string) => {
        set({ currentModel: modelName });
      },

      // Chat actions
      createNewSession: (name?: string) => {
        const session: ChatSession = {
          id: `session_${Date.now()}`,
          name: name || `Chat ${new Date().toLocaleString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: get().currentModel || 'meta-llama/llama-3.1-8b-instruct:free'
        };
        
        set(state => ({
          chatSessions: [...state.chatSessions, session],
          currentSession: session
        }));
        
        return session;
      },

      loadSession: (sessionId: string) => {
        const session = get().chatSessions.find(s => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      sendMessage: async (content: string, onChunk?: (chunk: string) => void) => {
        const state = get();
        
        if (!state.currentSession) {
          // Create new session if none exists
          get().createNewSession();
        }
        
        if (!state.isConnected) {
          throw new Error('Not connected to OpenRouter. Please check your internet connection.');
        }

        const userMessage: OpenRouterMessage = {
          role: 'user',
          content,
          timestamp: new Date()
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

        try {
          const response = await window.electronAPI.invoke('openrouter:generate', {
            model: state.currentModel,
            messages: [...(state.currentSession?.messages || []), userMessage].map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            temperature: 0.7,
            max_tokens: 1000
          });

          const assistantMessage: OpenRouterMessage = {
            role: 'assistant',
            content: response.content,
            timestamp: new Date()
          };

          // Add complete assistant message to session
          set(state => ({
            currentSession: state.currentSession ? {
              ...state.currentSession,
              messages: [...state.currentSession.messages, assistantMessage],
              updatedAt: new Date()
            } : null,
            isStreaming: false,
            streamingMessage: ''
          }));

          if (onChunk) {
            onChunk(response.content);
          }
        } catch (error) {
          set({ isStreaming: false, streamingMessage: '' });
          throw error;
        }
      },

      cancelCurrentRequest: () => {
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

      deleteSession: (sessionId: string) => {
        set(state => ({
          chatSessions: state.chatSessions.filter(s => s.id !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }));
      },

      // Utility actions
      setStreamingMessage: (message: string) => {
        set({ streamingMessage: message });
      },

      setIsStreaming: (streaming: boolean) => {
        set({ isStreaming: streaming });
      },

      // New OpenRouter specific actions
      getModelRecommendations: async (taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') => {
        try {
          return await window.electronAPI.invoke('openrouter:getRecommendations', taskType);
        } catch (error) {
          console.error('Failed to get model recommendations:', error);
          return [];
        }
      },

      getBestModelForTask: async (taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') => {
        try {
          return await window.electronAPI.invoke('openrouter:getBestModel', taskType);
        } catch (error) {
          console.error('Failed to get best model for task:', error);
          return null;
        }
      }
    }),
    {
      name: 'tanuki-llm-store',
      partialize: (state) => ({
        currentModel: state.currentModel,
        availableModels: state.availableModels,
      }),
    }
  )
);