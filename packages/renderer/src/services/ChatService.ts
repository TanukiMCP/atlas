/**
 * Enhanced chat service using OpenRouter for LLM operations
 */

import { RequestComplexity } from '../../../llm-enhanced/src/index';
import { parseToolInvocation } from '../utils/parseToolInvocation';
import { useMCPStore } from '../stores/mcp-store';
import MCPService from './MCPService';

// No need to redefine window.electronAPI as it's already defined in electron.d.ts

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
  media?: MediaItem[];
}

export interface MediaItem {
  id: string;
  type: string;
  name: string;
  data: string;
  previewUrl?: string;
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
  media?: MediaItem[];
}

class ChatService {
  private conversations: Map<string, Conversation> = new Map();
  private currentConversationId: string | null = null;
  private listeners: Set<(conversations: Conversation[]) => void> = new Set();
  private messageListeners: Set<(messages: ChatMessage[]) => void> = new Set();
  private defaultModel = 'meta-llama/llama-3.1-8b-instruct:free';

  constructor() {
    this.loadConversationsFromStorage();
    this.initializeWelcomeConversation();
  }

  async sendMessage(content: string, context?: ChatContext, isAgentMode: boolean = false): Promise<ChatMessage> {
    if (!content.trim() && (!context?.media || context.media.length === 0)) {
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
      timestamp: new Date(),
      media: context?.media || []
    };

    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date();
    this.saveConversationsToStorage();
    this.notifyMessageListeners();

    try {
      // Check if this is a tool invocation (starts with @)
      const toolInvocation = parseToolInvocation(content.trim());
      
      if (toolInvocation) {
        // This is a tool invocation - execute the tool
        const startTime = Date.now();
        const result = await this.executeToolInvocation(toolInvocation);
        
        // Format tool result as assistant message
        const assistantMessage: ChatMessage = {
          id: this.generateId(),
          content: result.success 
            ? typeof result.data === 'string' 
              ? result.data 
              : JSON.stringify(result.data, null, 2)
            : `Error executing tool: ${result.error}`,
          role: 'assistant',
          timestamp: new Date(),
          metadata: {
            executionTime: Date.now() - startTime,
            toolsUsed: [toolInvocation.toolName]
          }
        };
        
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = new Date();
        this.saveConversationsToStorage();
        this.notifyMessageListeners();

        return assistantMessage;
      } else {
        // Regular message - choose Chat or Agent mode
        let assistantMessage: ChatMessage;
        if (isAgentMode) {
          assistantMessage = await this.generateAgentResponse(content, context);
        } else {
          assistantMessage = await this.generateAIResponse(conversation, context);
        }
        
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = new Date();
        this.saveConversationsToStorage();
        this.notifyMessageListeners();

        return assistantMessage;
      }
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

  /**
   * Executes a tool invocation and returns the result
   * @param toolInvocation Tool invocation to execute
   * @returns Result of the tool execution
   */
  private async executeToolInvocation(toolInvocation: ReturnType<typeof parseToolInvocation>) {
    if (!toolInvocation) {
      throw new Error('Invalid tool invocation');
    }
    
    try {
      // Find the actual tool with the given name
      // This accounts for differences between the invocation syntax (@ToolName)
      // and the actual registered tool name (ClearThought.ToolName)
      let actualToolName = toolInvocation.toolName;
      
      // First try direct match
      const allTools = MCPService.getAvailableTools();
      let matchedTool = allTools.find(t => t.name.toLowerCase() === actualToolName.toLowerCase());
      
      // If no direct match, try more permissive matching
      if (!matchedTool) {
        // If user just provided the name part (e.g., @DecisionFramework)
        // try to find a tool with that suffix
        matchedTool = allTools.find(t => {
          const parts = t.name.split('.');
          return parts[parts.length - 1].toLowerCase() === actualToolName.toLowerCase();
        });
        
        if (matchedTool) {
          actualToolName = matchedTool.name;
        }
      }
      
      // Execute the tool using MCPService
      const result = await MCPService.executeTool(actualToolName, toolInvocation.parameters);
      
      return result;
    } catch (error) {
      console.error('Tool execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0
      };
    }
  }

  private async generateAIResponse(conversation: Conversation, context?: ChatContext): Promise<ChatMessage> {
    const startTime = Date.now();
    const userMessage = conversation.messages[conversation.messages.length - 1]?.content || '';

    try {
      // Use OpenRouter through IPC for model inference
      const response = await this.callOpenRouter(conversation, context);
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
    } catch (openrouterError) {
      // Service failed - throw descriptive error
      console.error('AI service failed:', openrouterError);
      
      throw new Error(
        `AI service is currently unavailable. This may be because:\n\n` +
        `• OpenRouter service is not connected or API key is missing\n` +
        `• Rate limits have been exceeded\n` +
        `• There are network connectivity issues\n` +
        `• The AI service is overloaded or temporarily down\n\n` +
        `Please check:\n` +
        `1. OpenRouter API key is properly configured in Settings\n` +
        `2. Internet connection is stable\n` +
        `3. OpenRouter service status\n` +
        `4. Try again in a few moments\n\n` +
        `Error: ${openrouterError instanceof Error ? openrouterError.message : 'Unknown error'}`
      );
    }
  }

  private async callOpenRouter(conversation: Conversation, context?: ChatContext): Promise<{content: string; model: string; tokens?: number}> {
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

    // Use IPC to call OpenRouter service
    if (!window.electronAPI?.invoke) {
      throw new Error('Electron API not available - cannot communicate with OpenRouter service');
    }

    try {
      const response = await window.electronAPI.invoke('openrouter:generate', {
        messages,
        model: 'meta-llama/llama-3.1-8b-instruct:free', // Use first free model as default
        temperature: 0.7,
        max_tokens: 1000
      });

      return {
        content: response.content || 'Sorry, I could not generate a response.',
        model: response.model || 'meta-llama/llama-3.1-8b-instruct:free',
        tokens: response.usage?.total_tokens
      };
    } catch (error) {
      console.error('OpenRouter IPC call failed:', error);
      throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    // Use OpenRouter models through IPC
    if (!window.electronAPI?.invoke) {
      return Promise.resolve([this.defaultModel]);
    }
    
    return window.electronAPI.invoke('openrouter:listModels')
      .then((models: any[]) => models.map(m => m.id))
      .catch(() => [this.defaultModel]);
  }

  /**
   * Call Enhanced LLM service for Agent Mode
   */
  private async generateAgentResponse(query: string, context?: ChatContext): Promise<ChatMessage> {
    const startTime = Date.now();
    // Prepare request payload
    const requestPayload = {
      query,
      userId: this.currentConversationId || 'default',
      metadata: { workspaceRoot: context?.workspaceRoot }
    };
    if (!window.electronAPI?.invoke) {
      throw new Error('Electron API not available - cannot call agent service');
    }
    const response: any = await window.electronAPI.invoke('enhancedLLM:processRequest', requestPayload);
    return {
      id: this.generateId(),
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
      metadata: {
        tierUsed: response.metrics?.routingDecision || 'complex',
        executionTime: Date.now() - startTime,
        tokens: response.metrics?.tokensEstimate
      }
    };
  }
}

export default new ChatService(); 