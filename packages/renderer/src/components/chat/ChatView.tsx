import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  Send, 
  Square, 
  Bot, 
  User,
  Zap,
  Clock,
  AlertCircle
} from 'lucide-react';
import chatService from '../../services/ChatService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tier?: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  processingTime?: number;
  isError?: boolean;
  isOffline?: boolean;
}

interface ChatViewProps {
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentModel,
  isConnected,
  subjectMode,
  agentMode,
  onProcessingChange
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to TanukiMCP Atlas! 🚀 I\'m your AI-powered development assistant with enhanced LLM processing architecture. I can help you with:\n\n• 💻 Code analysis and development\n• 🛠️ Tool integration via MCP\n• ⚡ Workflow automation\n• 🧠 Multi-tier intelligent processing\n• 📊 Project management and analytics\n\nTry asking me something or use @tool_name for tool calls!',
      timestamp: new Date(),
      tier: 'Tier 2'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onProcessingChange(isTyping);
  }, [isTyping, onProcessingChange]);

  const getSystemPrompt = (mode: string) => {
    const prompts: Record<string, string> = {
      general: "You are TanukiMCP Atlas, a helpful AI development assistant with access to advanced tools and multi-tier processing.",
      math: "You are TanukiMCP Atlas, a mathematical expert with deep knowledge of all areas of mathematics and computational analysis.",
      code: "You are TanukiMCP Atlas, a senior software engineer and programming expert with access to code analysis tools.",
      science: "You are TanukiMCP Atlas, a research scientist with expertise across scientific disciplines and analytical tools.",
      language: "You are TanukiMCP Atlas, a linguistic expert and polyglot translator with advanced language processing capabilities."
    };
    return prompts[mode] || prompts.general;
  };

  const determineTier = (message: string) => {
    const length = message.length;
    const hasTools = /@\w+/.test(message);
    const hasComplexTerms = /\b(analyze|compare|create|generate|build|develop|implement)\b/i.test(message);
    
    if (hasTools || (length > 200 && hasComplexTerms)) return 'Tier 4';
    if (hasComplexTerms || length > 150) return 'Tier 3';
    if (length > 50) return 'Tier 2';
    return 'Tier 1';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use ChatService with OpenRouter integration
      const response = await chatService.sendMessage(messageText);
      
      const assistantMessage: Message = {
        id: response.id,
        type: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        tier: determineTier(messageText),
        tokenUsage: {
          prompt: 0, // OpenRouter doesn't provide detailed token breakdown
          completion: response.metadata?.tokens || 0,
          total: response.metadata?.tokens || 0
        },
        processingTime: response.metadata?.executionTime || 0
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      onProcessingChange?.(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-green-500';
      case 'Tier 2': return 'bg-blue-500';
      case 'Tier 3': return 'bg-orange-500';
      case 'Tier 4': return 'bg-red-500';
      case 'Error': return 'bg-red-600';
      case 'Mock': return 'bg-yellow-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">TanukiMCP Enhanced Chat</h2>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mode: {agentMode ? 'Agent' : 'Chat'}</span>
            <span>•</span>
            <span>Subject: {subjectMode}</span>
            {isConnected && (
              <>
                <span>•</span>
                <span>Model: {currentModel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-3xl ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : msg.isError 
                  ? 'bg-destructive/10 border-destructive'
                  : msg.isOffline
                  ? 'bg-yellow-500/10 border-yellow-500'
                  : 'bg-muted'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {msg.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {msg.type === 'user' ? 'You' : 'TanukiMCP Assistant'}
                      </span>
                    </div>
                    
                    {msg.tier && (
                      <Badge variant="secondary" className={`text-xs ${getTierColor(msg.tier)} text-white`}>
                        {msg.tier}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock className="w-3 h-3" />
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <p className="leading-relaxed whitespace-pre-wrap text-sm">
                    {msg.content}
                  </p>
                  
                  {msg.tokenUsage && (
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Tokens: {msg.tokenUsage.total}
                      </div>
                      {msg.processingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {msg.processingTime}ms
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(msg.isError || msg.isOffline) && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {msg.isError ? 'Error occurred' : 'Offline mode'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">TanukiMCP Assistant</span>
                    <span className="text-xs text-muted-foreground">thinking...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (use @tool_name for tool calls)"
              disabled={isTyping}
              className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none min-h-[44px] max-h-32"
              rows={1}
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="lg"
              className="px-6"
            >
              {isTyping ? (
                <Square className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Available tools: @file_read, @web_search, @calculator, @code_execute</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 