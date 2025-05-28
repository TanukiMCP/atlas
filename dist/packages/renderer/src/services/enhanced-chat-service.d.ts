export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        processingTier?: 'atomic' | 'moderate' | 'complex' | 'expert';
        toolCalls?: ToolCall[];
        processingTime?: number;
        tokenUsage?: {
            prompt: number;
            completion: number;
            total: number;
        };
    };
}
export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, any>;
    result?: any;
    error?: string;
    duration?: number;
}
export interface ChatRequest {
    message: string;
    subjectMode: string;
    agentMode: boolean;
    context?: string[];
}
export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    created: Date;
    updated: Date;
    title?: string;
    subjectMode: string;
}
export type ChatEventType = 'message' | 'typing' | 'tool_call' | 'error' | 'complete';
export interface ChatEvent {
    type: ChatEventType;
    data: any;
    timestamp: Date;
}
export type ChatEventCallback = (event: ChatEvent) => void;
declare class EnhancedChatService {
    private currentSession;
    private eventCallbacks;
    private isProcessing;
    private routeRequest;
    private getSystemPrompt;
    private extractToolCalls;
    private executeToolCalls;
    private simulateToolCall;
    processChat(request: ChatRequest): Promise<void>;
    createSession(subjectMode: string): string;
    getCurrentSession(): ChatSession | null;
    clearSession(): void;
    stopProcessing(): void;
    addEventListener(callback: ChatEventCallback): () => void;
    private emitEvent;
    getProcessingStatus(): boolean;
}
export declare const chatService: EnhancedChatService;
export {};
//# sourceMappingURL=enhanced-chat-service.d.ts.map