import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Square, 
  Loader2, 
  Bot, 
  User, 
  Wrench, 
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { chatService, ChatMessage, ChatEvent } from '@/services/enhanced-chat-service';
import { ollamaService } from '@/services/ollama-service';
import { useViewStore } from '@/stores/viewStore';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'TanukiMCP'}
          </span>
          {message.metadata?.processingTier && (
            <Badge variant="outline" className="text-xs">
              Tier {message.metadata.processingTier}
            </Badge>
          )}
          {isStreaming && (
            <Loader2 className="w-3 h-3 animate-spin" />
          )}
        </div>
        
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        
        {message.metadata?.toolCalls && message.metadata.toolCalls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Tool Calls:</div>
            {message.metadata.toolCalls.map((tool, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <Wrench className="w-3 h-3" />
                <span>{tool.name}</span>
                {tool.duration && (
                  <Badge variant="secondary" className="text-xs">
                    {tool.duration}ms
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
        
        {message.metadata?.processingTime && (
          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {message.metadata.processingTime}ms
            {message.metadata.tokenUsage && (
              <span className="ml-2">
                {message.metadata.tokenUsage.total} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface TypingIndicatorProps {
  tier?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ tier }) => (
  <div className="flex justify-start mb-4">
    <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <span className="text-sm font-medium">TanukiMCP</span>
        {tier && (
          <Badge variant="outline" className="text-xs">
            {tier} tier
          </Badge>
        )}
        <Loader2 className="w-3 h-3 animate-spin" />
      </div>
      <div className="text-sm mt-1">Thinking...</div>
    </div>
  </div>
);

export const EnhancedChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingTier, setCurrentTypingTier] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [currentModel, setCurrentModel] = useState('');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { subjectMode, agentMode, isProcessing, setProcessing } = useViewStore();

  // Initialize and check Ollama connection
  useEffect(() => {
    const checkConnection = async () => {
      const health = await ollamaService.checkHealth();
      setConnectionStatus(health.isConnected ? 'connected' : 'disconnected');
      setCurrentModel(ollamaService.getCurrentModel());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    
    return () => clearInterval(interval);
  }, []);

  // Subscribe to chat events
  useEffect(() => {
    const unsubscribe = chatService.addEventListener((event: ChatEvent) => {
      switch (event.type) {
        case 'message':
          if (event.data.metadata?.streaming) {
            setStreamingMessage(event.data);
          } else {
            setMessages(prev => {
              const filtered = prev.filter(m => m.id !== event.data.id);
              return [...filtered, event.data];
            });
            setStreamingMessage(null);
          }
          break;
          
        case 'typing':
          setIsTyping(event.data.isTyping);
          setCurrentTypingTier(event.data.tier);
          break;
          
        case 'tool_call':
          // Could show tool execution status
          console.log('Tool call:', event.data);
          break;
          
        case 'error':
          console.error('Chat error:', event.data);
          setIsTyping(false);
          setStreamingMessage(null);
          break;
          
        case 'complete':
          setIsTyping(false);
          setStreamingMessage(null);
          setProcessing(false);
          break;
      }
    });

    return unsubscribe;
  }, [setProcessing]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingMessage, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const messageText = inputValue.trim();
    setInputValue('');
    setProcessing(true);

    try {
      await chatService.processChat({
        message: messageText,
        subjectMode,
        agentMode
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setProcessing(false);
    }
  };

  const handleStopProcessing = () => {
    chatService.stopProcessing();
    setProcessing(false);
    setIsTyping(false);
    setStreamingMessage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with status */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">TanukiMCP Chat</span>
          <Badge variant={agentMode ? "default" : "secondary"}>
            {agentMode ? 'Agent Mode' : 'Chat Mode'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {connectionStatus === 'connected' ? currentModel : 'Disconnected'}
            </span>
          </div>
          
          {isProcessing && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleStopProcessing}
              className="gap-1"
            >
              <Square className="w-3 h-3" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {connectionStatus === 'disconnected' && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-800 dark:text-yellow-200">
                Ollama Not Connected
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Please ensure Ollama is running and models are available.
              </div>
            </div>
          </div>
        )}

        {messages.length === 0 && connectionStatus === 'connected' && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Welcome to TanukiMCP Atlas</h3>
            <p className="text-muted-foreground">
              Start a conversation with your AI-powered development assistant.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline">Subject: {subjectMode}</Badge>
              <Badge variant="outline">Mode: {agentMode ? 'Agent' : 'Chat'}</Badge>
            </div>
          </div>
        )}

        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {streamingMessage && (
          <MessageBubble message={streamingMessage} isStreaming />
        )}

        {isTyping && !streamingMessage && (
          <TypingIndicator tier={currentTypingTier} />
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              connectionStatus === 'connected' 
                ? "Type your message... (use @tool_name for tool calls)"
                : "Waiting for Ollama connection..."
            }
            disabled={connectionStatus !== 'connected' || isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || connectionStatus !== 'connected' || isProcessing}
            className="gap-1"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Try: @file_read, @web_search, @calculator</span>
        </div>
      </div>
    </div>
  );
};