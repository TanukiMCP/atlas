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
      {/* Chat Header - Simplified */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Chat</h2>
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
                  : 'bg-card'
              }`}>
                <CardContent className="p-4 pb-3">
                  <div className="flex gap-2 items-start">
                    <div className="mt-1 shrink-0">
                      {msg.type === 'user' ? (
                        <User className="h-6 w-6" />
                      ) : (
                        <Bot className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      {(msg.tokenUsage || msg.processingTime) && (
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {msg.tokenUsage && (
                            <div>Tokens: {msg.tokenUsage.total}</div>
                          )}
                          {msg.processingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {msg.processingTime.toFixed(2)}s
                            </div>
                          )}
                          {msg.tier && (
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {msg.tier}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with Emergency Stop Button */}
      <div className="p-4 border-t border-border">
        <div className="max-w-4xl mx-auto relative">
          {isTyping && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              onClick={() => {
                // Cancel generation (no cancelGeneration method, just stop typing state)
                setIsTyping(false);
                onProcessingChange?.(false);
              }}
            >
              <Square className="w-4 h-4 mr-1" />
              Stop Generation
            </Button>
          )}
          <div className={`flex gap-2 rounded-lg border ${isTyping ? 'pr-36' : ''} focus-within:ring-1 focus-within:ring-primary focus-within:border-primary p-2 bg-background`}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isTyping ? "Press Enter to submit a new message..." : "Type your message here..."}
              className="flex-1 bg-transparent border-none focus:outline-none resize-none h-12 max-h-48 text-foreground placeholder:text-muted-foreground"
              disabled={!isConnected}
            />
            <Button
              variant="default"
              size="icon"
              disabled={!inputMessage.trim() || isTyping || !isConnected}
              onClick={sendMessage}
              className="shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {!isConnected && (
            <div className="mt-2 text-center text-sm text-destructive">
              <AlertCircle className="w-4 h-4 inline-block mr-1" />
              Not connected to OpenRouter. Please check your API key in Settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 