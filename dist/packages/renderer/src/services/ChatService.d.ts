interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
    metadata?: {
        model?: string;
        executionTime?: number;
        tokens?: number;
    };
}
interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
interface ChatContext {
    files?: string[];
    selectedText?: string;
    currentFile?: string;
    workspaceRoot?: string;
}
declare class ChatService {
    private conversations;
    private currentConversationId;
    private listeners;
    private messageListeners;
    private ollamaBaseUrl;
    private defaultModel;
    constructor();
    sendMessage(content: string, context?: ChatContext): Promise<ChatMessage>;
    private generateAIResponse;
    private callOllama;
    private buildContextMessage;
    private generateFallbackResponse;
    createNewConversation(title?: string): string;
    switchToConversation(conversationId: string): boolean;
    deleteConversation(conversationId: string): boolean;
    getCurrentConversation(): Conversation | null;
    getCurrentMessages(): ChatMessage[];
    getAllConversations(): Conversation[];
    updateConversationTitle(conversationId: string, title: string): boolean;
    clearCurrentConversation(): void;
    exportConversation(conversationId: string): string;
    onConversationsChanged(listener: (conversations: Conversation[]) => void): () => void;
    onMessagesChanged(listener: (messages: ChatMessage[]) => void): () => void;
    private initializeWelcomeConversation;
    private loadConversationsFromStorage;
    private saveConversationsToStorage;
    private notifyConversationListeners;
    private notifyMessageListeners;
    private generateId;
    setModel(model: string): void;
    getAvailableModels(): Promise<string[]>;
}
declare const _default: ChatService;
export default _default;
//# sourceMappingURL=ChatService.d.ts.map