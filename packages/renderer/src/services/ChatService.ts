import { RequestComplexity } from '../../../llm-enhanced/src/index';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    model?: string;
    executionTime?: number;
    tokens?: number;
    tierUsed?: RequestComplexity | string;
    qualityScore?: number;
    toolsUsed?: string[];
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

class ChatService {
  private conversations: Map<string, Conversation> = new Map();
  private currentConversationId: string | null = null;
  private listeners: Set<(conversations: Conversation[]) => void> = new Set();
  private messageListeners: Set<(messages: ChatMessage[]) => void> = new Set();
  private ollamaBaseUrl = 'http://127.0.0.1:11434';
  private defaultModel = 'llama2';

  constructor() {
    this.loadConversationsFromStorage();
    this.initializeWelcomeConversation();
  }

  async sendMessage(content: string, context?: ChatContext): Promise<ChatMessage> {
    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    const conversation = this.getCurrentConversation();
    if (!conversation) {
      throw new Error('No active conversation');
    }

    // Add user message
    const userMessage: ChatMessage = {
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
    } catch (error) {
      // Add error message if AI response fails
      const errorMessage: ChatMessage = {
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

  private async generateAIResponse(conversation: Conversation, context?: ChatContext): Promise<ChatMessage> {
    const startTime = Date.now();
    const userMessage = conversation.messages[conversation.messages.length - 1]?.content || '';

    try {
      // Try direct Ollama since enhanced LLM service is not available in this context
      const response = await this.callOllama(conversation, context);
      return {
        id: this.generateId(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          model: response.model,
          executionTime: Date.now() - startTime,
          tokens: response.tokens,
          tierUsed: 'atomic' // Use string instead of enum
        }
      };
    } catch (ollamaError) {
      // Service failed - throw descriptive error
      console.error('AI service failed:', ollamaError);
      
      throw new Error(
        `AI service is currently unavailable. This may be because:\n\n` +
        `• Ollama is not running or not accessible at ${this.ollamaBaseUrl}\n` +
        `• The selected model (${this.defaultModel}) is not installed\n` +
        `• There are network connectivity issues\n` +
        `• The AI service is overloaded or temporarily down\n\n` +
        `Please check:\n` +
        `1. Ollama is running and accessible\n` +
        `2. The model is properly installed\n` +
        `3. Your network connection\n` +
        `4. Try again in a few moments\n\n` +
        `Error: ${ollamaError instanceof Error ? ollamaError.message : 'Unknown error'}`
      );
    }
  }

  private async callOllama(conversation: Conversation, context?: ChatContext): Promise<{content: string; model: string; tokens?: number}> {
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

  private buildContextMessage(context: ChatContext): string {
    const parts: string[] = [];
    
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

  createNewConversation(title?: string): string {
    const id = this.generateId();
    const conversation: Conversation = {
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

  switchToConversation(conversationId: string): boolean {
    if (this.conversations.has(conversationId)) {
      this.currentConversationId = conversationId;
      this.notifyMessageListeners();
      return true;
    }
    return false;
  }

  deleteConversation(conversationId: string): boolean {
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

  getCurrentConversation(): Conversation | null {
    return this.currentConversationId ? this.conversations.get(this.currentConversationId) || null : null;
  }

  getCurrentMessages(): ChatMessage[] {
    const conversation = this.getCurrentConversation();
    return conversation ? conversation.messages : [];
  }

  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  updateConversationTitle(conversationId: string, title: string): boolean {
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

  clearCurrentConversation(): void {
    const conversation = this.getCurrentConversation();
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = new Date();
      this.saveConversationsToStorage();
      this.notifyMessageListeners();
    }
  }

  exportConversation(conversationId: string): string {
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

  onConversationsChanged(listener: (conversations: Conversation[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onMessagesChanged(listener: (messages: ChatMessage[]) => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  private initializeWelcomeConversation(): void {
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
    } else if (!this.currentConversationId) {
      // Set current conversation to the most recent one
      const conversations = this.getAllConversations();
      if (conversations.length > 0) {
        this.currentConversationId = conversations[0].id;
      }
    }
  }

  private loadConversationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('tanuki-atlas-conversations');
      if (stored) {
        const data = JSON.parse(stored);
        for (const conv of data.conversations) {
          this.conversations.set(conv.id, {
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          });
        }
        this.currentConversationId = data.currentConversationId;
      }
    } catch (error) {
      console.warn('Failed to load conversations from storage:', error);
    }
  }

  private saveConversationsToStorage(): void {
    try {
      const data = {
        conversations: Array.from(this.conversations.values()),
        currentConversationId: this.currentConversationId
      };
      localStorage.setItem('tanuki-atlas-conversations', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save conversations to storage:', error);
    }
  }

  private notifyConversationListeners(): void {
    const conversations = this.getAllConversations();
    this.listeners.forEach(listener => listener(conversations));
  }

  private notifyMessageListeners(): void {
    const messages = this.getCurrentMessages();
    this.messageListeners.forEach(listener => listener(messages));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setModel(model: string): void {
    this.defaultModel = model;
  }

  getAvailableModels(): Promise<string[]> {
    return fetch(`${this.ollamaBaseUrl}/api/tags`)
      .then(response => response.json())
      .then(data => data.models?.map((m: any) => m.name) || [])
      .catch(() => [this.defaultModel]);
  }
}

export default new ChatService(); 