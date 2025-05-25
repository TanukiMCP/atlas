/**
 * Base LLM Agent for Workflow Generation System
 */

import { LLMAgent, LLMAgentRole } from '../../types/workflow-types';

export interface LLMAgentConfig {
  id: string;
  name: string;
  role: LLMAgentRole;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface LLMRequest {
  userMessage: string;
  context?: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  tokensUsed: number;
  model: string;
  processingTime: number;
  confidence?: number;
  metadata?: Record<string, any>;
}

export abstract class BaseLLMAgent implements LLMAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly role: LLMAgentRole;
  public readonly systemPrompt: string;
  public readonly model: string;
  public readonly temperature: number;
  public readonly maxTokens: number;
  private readonly timeout: number;

  constructor(config: LLMAgentConfig) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.systemPrompt = config.systemPrompt;
    this.model = config.model || 'gpt-4';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 4096;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Process a request using this LLM agent
   */
  async processRequest(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: this.formatUserMessage(request) }
      ];

      const response = await this.callLLMAPI(messages, {
        temperature: request.temperature || this.temperature,
        maxTokens: request.maxTokens || this.maxTokens,
        timeout: this.timeout
      });

      const processingTime = Date.now() - startTime;

      return {
        content: response.content,
        tokensUsed: response.tokensUsed,
        model: this.model,
        processingTime,
        confidence: this.calculateConfidence(response),
        metadata: this.extractMetadata(response)
      };
    } catch (error) {
      throw new Error(`LLM Agent ${this.name} failed: ${error.message}`);
    }
  }

  /**
   * Format the user message with context if provided
   */
  protected formatUserMessage(request: LLMRequest): string {
    let message = request.userMessage;
    
    if (request.context && Object.keys(request.context).length > 0) {
      const contextString = Object.entries(request.context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      message = `${message}\n\n**Context:**\n${contextString}`;
    }
    
    return message;
  }

  /**
   * Abstract method to call the actual LLM API
   * This should be implemented by concrete agent classes
   */
  protected abstract callLLMAPI(
    messages: Array<{ role: string; content: string }>,
    options: {
      temperature: number;
      maxTokens: number;
      timeout: number;
    }
  ): Promise<{
    content: string;
    tokensUsed: number;
    metadata?: any;
  }>;

  /**
   * Calculate confidence score based on response characteristics
   */
  protected calculateConfidence(response: any): number {
    // Default implementation - can be overridden by specific agents
    const contentLength = response.content.length;
    const hasStructuredFormat = this.hasStructuredFormat(response.content);
    const hasReasoningMarkers = this.hasReasoningMarkers(response.content);
    
    let confidence = 0.5; // Base confidence
    
    if (contentLength > 100) confidence += 0.1;
    if (contentLength > 500) confidence += 0.1;
    if (hasStructuredFormat) confidence += 0.2;
    if (hasReasoningMarkers) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Extract metadata from the response
   */
  protected extractMetadata(response: any): Record<string, any> {
    return {
      agent: this.name,
      role: this.role,
      timestamp: new Date().toISOString(),
      responseLength: response.content.length
    };
  }

  /**
   * Check if response has structured format
   */
  protected hasStructuredFormat(content: string): boolean {
    return content.includes('```') || 
           content.includes('┌') || 
           content.includes('│') ||
           content.includes('{') ||
           content.includes('[');
  }

  /**
   * Check if response has reasoning markers
   */
  protected hasReasoningMarkers(content: string): boolean {
    const reasoningMarkers = [
      'because', 'therefore', 'since', 'given that',
      'step 1', 'step 2', 'first', 'second', 'then',
      'analysis:', 'reasoning:', 'explanation:'
    ];
    
    const lowerContent = content.toLowerCase();
    return reasoningMarkers.some(marker => lowerContent.includes(marker));
  }

  /**
   * Validate response format for the specific agent type
   */
  protected abstract validateResponse(content: string): boolean;

  /**
   * Get agent status information
   */
  getStatus(): {
    id: string;
    name: string;
    role: LLMAgentRole;
    model: string;
    isHealthy: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      model: this.model,
      isHealthy: true // Basic implementation
    };
  }
}