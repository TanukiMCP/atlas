"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatService {
    conversations = new Map();
    currentConversationId = null;
    listeners = new Set();
    messageListeners = new Set();
    ollamaBaseUrl = 'http://localhost:11434';
    defaultModel = 'llama2';
    constructor() {
        this.loadConversationsFromStorage();
        this.initializeWelcomeConversation();
    }
    async sendMessage(content, context) {
        if (!content.trim()) {
            throw new Error('Message content cannot be empty');
        }
        const conversation = this.getCurrentConversation();
        if (!conversation) {
            throw new Error('No active conversation');
        }
        // Add user message
        const userMessage = {
            id: this.generateId(),
            content: content.trim(),
            role: 'user',
            timestamp: new Date()
        };
        conversation.messages.push(userMessage);
        conversation.updatedAt = new Date();
        this.saveConversationsToStorage();
        this.notifyMessageListeners();
        try {
            // Generate AI response
            const assistantMessage = await this.generateAIResponse(conversation, context);
            conversation.messages.push(assistantMessage);
            conversation.updatedAt = new Date();
            this.saveConversationsToStorage();
            this.notifyMessageListeners();
            return assistantMessage;
        }
        catch (error) {
            // Add error message if AI response fails
            const errorMessage = {
                id: this.generateId(),
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
                role: 'assistant',
                timestamp: new Date()
            };
            conversation.messages.push(errorMessage);
            conversation.updatedAt = new Date();
            this.saveConversationsToStorage();
            this.notifyMessageListeners();
            return errorMessage;
        }
    }
    async generateAIResponse(conversation, context) {
        const startTime = Date.now();
        try {
            // Try Ollama first
            const response = await this.callOllama(conversation, context);
            return {
                id: this.generateId(),
                content: response.content,
                role: 'assistant',
                timestamp: new Date(),
                metadata: {
                    model: response.model,
                    executionTime: Date.now() - startTime,
                    tokens: response.tokens
                }
            };
        }
        catch (ollamaError) {
            // Fallback to built-in responses
            return {
                id: this.generateId(),
                content: this.generateFallbackResponse(conversation.messages[conversation.messages.length - 1].content, context),
                role: 'assistant',
                timestamp: new Date(),
                metadata: {
                    model: 'built-in',
                    executionTime: Date.now() - startTime
                }
            };
        }
    }
    async callOllama(conversation, context) {
        const messages = conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        // Add context if provided
        if (context) {
            const contextMessage = this.buildContextMessage(context);
            if (contextMessage) {
                messages.unshift({
                    role: 'system',
                    content: contextMessage
                });
            }
        }
        const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.defaultModel,
                messages,
                stream: false
            })
        });
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            content: data.message?.content || 'Sorry, I could not generate a response.',
            model: data.model || this.defaultModel,
            tokens: data.eval_count
        };
    }
    buildContextMessage(context) {
        const parts = [];
        if (context.workspaceRoot) {
            parts.push(`Working in project: ${context.workspaceRoot}`);
        }
        if (context.currentFile) {
            parts.push(`Current file: ${context.currentFile}`);
        }
        if (context.selectedText) {
            parts.push(`Selected text:\n\`\`\`\n${context.selectedText}\n\`\`\``);
        }
        if (context.files && context.files.length > 0) {
            parts.push(`Available files: ${context.files.join(', ')}`);
        }
        return parts.length > 0
            ? `Context: ${parts.join('\n\n')}`
            : '';
    }
    generateFallbackResponse(userMessage, context) {
        const message = userMessage.toLowerCase();
        // Code-related queries
        if (message.includes('code') || message.includes('function') || message.includes('bug')) {
            return `I'd be happy to help with your code! ${context?.currentFile ? `I can see you're working on ${context.currentFile}.` : ''} Could you provide more details about what you're trying to accomplish?`;
        }
        // File operations
        if (message.includes('file') || message.includes('create') || message.includes('delete')) {
            return `I can help you with file operations. ${context?.files ? `I can see your workspace has ${context.files.length} files.` : ''} What would you like me to do?`;
        }
        // MCP tools
        if (message.includes('tool') || message.includes('mcp')) {
            return `I have access to various MCP tools including file operations, web search, code analysis, and more. What task would you like me to help with?`;
        }
        // Project help
        if (message.includes('project') || message.includes('setup')) {
            return `I can help you with project setup, configuration, and development tasks. What specific aspect of your project would you like assistance with?`;
        }
        // Default response
        return `I'm your AI development assistant! I can help you with coding, file operations, project setup, debugging, and much more. What would you like to work on today?`;
    }
    createNewConversation(title) {
        const id = this.generateId();
        const conversation = {
            id,
            title: title || `Conversation ${this.conversations.size + 1}`,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.conversations.set(id, conversation);
        this.currentConversationId = id;
        this.saveConversationsToStorage();
        this.notifyConversationListeners();
        this.notifyMessageListeners();
        return id;
    }
    switchToConversation(conversationId) {
        if (this.conversations.has(conversationId)) {
            this.currentConversationId = conversationId;
            this.notifyMessageListeners();
            return true;
        }
        return false;
    }
    deleteConversation(conversationId) {
        if (this.conversations.has(conversationId)) {
            this.conversations.delete(conversationId);
            if (this.currentConversationId === conversationId) {
                const remaining = Array.from(this.conversations.keys());
                this.currentConversationId = remaining.length > 0 ? remaining[0] : null;
            }
            this.saveConversationsToStorage();
            this.notifyConversationListeners();
            this.notifyMessageListeners();
            return true;
        }
        return false;
    }
    getCurrentConversation() {
        return this.currentConversationId ? this.conversations.get(this.currentConversationId) || null : null;
    }
    getCurrentMessages() {
        const conversation = this.getCurrentConversation();
        return conversation ? conversation.messages : [];
    }
    getAllConversations() {
        return Array.from(this.conversations.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    updateConversationTitle(conversationId, title) {
        const conversation = this.conversations.get(conversationId);
        if (conversation) {
            conversation.title = title;
            conversation.updatedAt = new Date();
            this.saveConversationsToStorage();
            this.notifyConversationListeners();
            return true;
        }
        return false;
    }
    clearCurrentConversation() {
        const conversation = this.getCurrentConversation();
        if (conversation) {
            conversation.messages = [];
            conversation.updatedAt = new Date();
            this.saveConversationsToStorage();
            this.notifyMessageListeners();
        }
    }
    exportConversation(conversationId) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        const exportData = {
            title: conversation.title,
            createdAt: conversation.createdAt,
            messages: conversation.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
            }))
        };
        return JSON.stringify(exportData, null, 2);
    }
    onConversationsChanged(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    onMessagesChanged(listener) {
        this.messageListeners.add(listener);
        return () => this.messageListeners.delete(listener);
    }
    initializeWelcomeConversation() {
        if (this.conversations.size === 0) {
            const welcomeId = this.createNewConversation('Welcome');
            const welcomeConversation = this.conversations.get(welcomeId);
            if (welcomeConversation) {
                welcomeConversation.messages.push({
                    id: this.generateId(),
                    content: 'Welcome to TanukiMCP Atlas! I\'m your AI development assistant. I can help you with coding, file operations, project setup, debugging, and much more. What would you like to work on today?',
                    role: 'assistant',
                    timestamp: new Date()
                });
                this.saveConversationsToStorage();
            }
        }
        else if (!this.currentConversationId) {
            // Set current conversation to the most recent one
            const conversations = this.getAllConversations();
            if (conversations.length > 0) {
                this.currentConversationId = conversations[0].id;
            }
        }
    }
    loadConversationsFromStorage() {
        try {
            const stored = localStorage.getItem('tanuki-atlas-conversations');
            if (stored) {
                const data = JSON.parse(stored);
                for (const conv of data.conversations) {
                    this.conversations.set(conv.id, {
                        ...conv,
                        createdAt: new Date(conv.createdAt),
                        updatedAt: new Date(conv.updatedAt),
                        messages: conv.messages.map((msg) => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp)
                        }))
                    });
                }
                this.currentConversationId = data.currentConversationId;
            }
        }
        catch (error) {
            console.warn('Failed to load conversations from storage:', error);
        }
    }
    saveConversationsToStorage() {
        try {
            const data = {
                conversations: Array.from(this.conversations.values()),
                currentConversationId: this.currentConversationId
            };
            localStorage.setItem('tanuki-atlas-conversations', JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save conversations to storage:', error);
        }
    }
    notifyConversationListeners() {
        const conversations = this.getAllConversations();
        this.listeners.forEach(listener => listener(conversations));
    }
    notifyMessageListeners() {
        const messages = this.getCurrentMessages();
        this.messageListeners.forEach(listener => listener(messages));
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    setModel(model) {
        this.defaultModel = model;
    }
    getAvailableModels() {
        return fetch(`${this.ollamaBaseUrl}/api/tags`)
            .then(response => response.json())
            .then(data => data.models?.map((m) => m.name) || [])
            .catch(() => [this.defaultModel]);
    }
}
exports.default = new ChatService();
//# sourceMappingURL=ChatService.js.map