import { ollamaService, OllamaChatMessage } from './ollama-service';
import { mcpClient } from './mcp-client';

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

class EnhancedChatService {
  private currentSession: ChatSession | null = null;
  private eventCallbacks: ChatEventCallback[] = [];
  private isProcessing = false;

  // Processing tier routing
  private async routeRequest(request: ChatRequest): Promise<'atomic' | 'moderate' | 'complex' | 'expert'> {
    const { message, agentMode } = request;
    
    // Simple heuristic routing - in production this would be more sophisticated
    const messageLength = message.length;
    const hasComplexTerms = /\b(analyze|compare|create|generate|build|develop|implement)\b/i.test(message);
    const hasToolMentions = /@\w+/.test(message);
    
    if (agentMode || hasToolMentions) {
      if (messageLength > 200 || hasComplexTerms) {
        return 'complex';
      }
      return 'moderate';
    }
    
    if (messageLength < 50) {
      return 'atomic';
    }
    
    if (hasComplexTerms || messageLength > 150) {
      return 'moderate';
    }
    
    return 'atomic';
  }

  // Get system prompt based on subject mode
  private getSystemPrompt(subjectMode: string, tier: string): string {
    const basePrompts = {
      general: "You are a helpful AI assistant.",
      math: "You are a mathematical expert with deep knowledge of all areas of mathematics.",
      code: "You are a senior software engineer and programming expert.",
      science: "You are a research scientist with expertise across scientific disciplines.",
      language: "You are a linguistic expert and polyglot translator.",
      creative: "You are a creative writing expert and ideation specialist.",
      business: "You are a business strategy consultant and analyst."
    };

    const tierPrompts = {
      atomic: "Provide concise, direct answers.",
      moderate: "Provide detailed explanations with reasoning.",
      complex: "Provide comprehensive analysis with multiple perspectives and actionable insights.",
      expert: "Provide expert-level analysis with full documentation and alternative approaches."
    };

    return `${basePrompts[subjectMode] || basePrompts.general} ${tierPrompts[tier] || tierPrompts.moderate}`;
  }

  // Extract tool calls from message
  private extractToolCalls(message: string): string[] {
    const toolMatches = message.match(/@(\w+)/g);
    return toolMatches ? toolMatches.map(match => match.slice(1)) : [];
  }

  // Execute tool calls via MCP
  private async executeToolCalls(toolNames: string[], context: string): Promise<ToolCall[]> {
    const results: ToolCall[] = [];
    
    for (const toolName of toolNames) {
      const startTime = Date.now();
      try {
        this.emitEvent({
          type: 'tool_call',
          data: { tool: toolName, status: 'starting' },
          timestamp: new Date()
        });

        // This would connect to the actual MCP client
        const result = await this.simulateToolCall(toolName, context);
        
        results.push({
          id: `tool_${Date.now()}_${toolName}`,
          name: toolName,
          arguments: { context },
          result,
          duration: Date.now() - startTime
        });

        this.emitEvent({
          type: 'tool_call',
          data: { tool: toolName, status: 'complete', result },
          timestamp: new Date()
        });

      } catch (error) {
        results.push({
          id: `tool_${Date.now()}_${toolName}`,
          name: toolName,
          arguments: { context },
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        });

        this.emitEvent({
          type: 'tool_call',
          data: { tool: toolName, status: 'error', error },
          timestamp: new Date()
        });
      }
    }
    
    return results;
  }

  // Simulate tool calls (replace with real MCP integration)
  private async simulateToolCall(toolName: string, context: string): Promise<any> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const toolResults = {
      file_read: { content: "File content would be here", lines: 42 },
      web_search: { results: ["Search result 1", "Search result 2"] },
      code_execute: { output: "Code execution output", exitCode: 0 },
      calculator: { result: 42, calculation: "Complex math result" }
    };
    
    return toolResults[toolName] || { message: `${toolName} tool executed successfully` };
  }

  // Process chat request through appropriate tier
  public async processChat(request: ChatRequest): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Chat is already processing a request');
    }

    this.isProcessing = true;
    const startTime = Date.now();
    
    try {
      // Initialize session if needed
      if (!this.currentSession) {
        this.createSession(request.subjectMode);
      }

      // Route to appropriate processing tier
      const tier = await this.routeRequest(request);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: request.message,
        timestamp: new Date()
      };
      
      this.currentSession!.messages.push(userMessage);
      this.emitEvent({
        type: 'message',
        data: userMessage,
        timestamp: new Date()
      });

      // Show typing indicator
      this.emitEvent({
        type: 'typing',
        data: { tier, isTyping: true },
        timestamp: new Date()
      });

      // Extract and execute tool calls if any
      let toolCalls: ToolCall[] = [];
      const toolNames = this.extractToolCalls(request.message);
      
      if (toolNames.length > 0) {
        toolCalls = await this.executeToolCalls(toolNames, request.message);
      }

      // Build conversation context
      const systemPrompt = this.getSystemPrompt(request.subjectMode, tier);
      const conversationMessages: OllamaChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...this.currentSession!.messages.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // Add tool results to context if any
      if (toolCalls.length > 0) {
        const toolContext = toolCalls.map(tc => 
          `Tool ${tc.name}: ${tc.result ? JSON.stringify(tc.result) : tc.error}`
        ).join('\n');
        
        conversationMessages.push({
          role: 'system',
          content: `Tool execution results:\n${toolContext}`
        });
      }

      let assistantContent = '';
      
      // Stream response from Ollama
      await ollamaService.chatStream(
        conversationMessages,
        (chunk) => {
          if (chunk.message?.content) {
            assistantContent += chunk.message.content;
            
            this.emitEvent({
              type: 'message',
              data: {
                id: `msg_${Date.now()}_assistant_streaming`,
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date(),
                metadata: { processingTier: tier, streaming: true }
              },
              timestamp: new Date()
            });
          }
        },
        (finalResponse) => {
          // Stop typing indicator
          this.emitEvent({
            type: 'typing',
            data: { tier, isTyping: false },
            timestamp: new Date()
          });

          // Add final assistant message
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now()}_assistant`,
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
            metadata: {
              processingTier: tier,
              toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
              processingTime: Date.now() - startTime,
              tokenUsage: {
                prompt: finalResponse.prompt_eval_count || 0,
                completion: finalResponse.eval_count || 0,
                total: (finalResponse.prompt_eval_count || 0) + (finalResponse.eval_count || 0)
              }
            }
          };

          this.currentSession!.messages.push(assistantMessage);
          this.currentSession!.updated = new Date();

          this.emitEvent({
            type: 'complete',
            data: assistantMessage,
            timestamp: new Date()
          });
        },
        (error) => {
          this.emitEvent({
            type: 'typing',
            data: { tier, isTyping: false },
            timestamp: new Date()
          });
          
          this.emitEvent({
            type: 'error',
            data: { error: error.message, tier },
            timestamp: new Date()
          });
        }
      );

    } catch (error) {
      this.emitEvent({
        type: 'error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      });
    } finally {
      this.isProcessing = false;
    }
  }

  // Create new chat session
  public createSession(subjectMode: string): string {
    const sessionId = `session_${Date.now()}`;
    this.currentSession = {
      id: sessionId,
      messages: [],
      created: new Date(),
      updated: new Date(),
      subjectMode
    };
    return sessionId;
  }

  // Get current session
  public getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  // Clear current session
  public clearSession(): void {
    this.currentSession = null;
  }

  // Stop current processing
  public stopProcessing(): void {
    if (this.isProcessing) {
      ollamaService.cancelCurrentRequest();
      this.isProcessing = false;
      
      this.emitEvent({
        type: 'complete',
        data: { cancelled: true },
        timestamp: new Date()
      });
    }
  }

  // Event management
  public addEventListener(callback: ChatEventCallback): () => void {
    this.eventCallbacks.push(callback);
    return () => {
      const index = this.eventCallbacks.indexOf(callback);
      if (index > -1) {
        this.eventCallbacks.splice(index, 1);
      }
    };
  }

  private emitEvent(event: ChatEvent): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in chat event callback:', error);
      }
    });
  }

  // Get processing status
  public getProcessingStatus(): boolean {
    return this.isProcessing;
  }
}

export const chatService = new EnhancedChatService();