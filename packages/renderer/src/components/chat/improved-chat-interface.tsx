import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Send, Paperclip, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ChatMessage } from './chat-message';
import { ChatHeader } from './chat-header';
import { Textarea } from '../ui/textarea';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    executionTime?: number;
    tokens?: number;
    toolsUsed?: string[];
  };
}

interface ImprovedChatInterfaceProps {
  onAtSymbolTrigger?: (position: { x: number; y: number }) => void;
  operationalMode?: 'agent' | 'chat';
  currentModel?: string;
  isConnected?: boolean;
  onMaximize?: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

export const ImprovedChatInterface: React.FC<ImprovedChatInterfaceProps> = ({
  onAtSymbolTrigger,
  operationalMode = 'agent',
  currentModel,
  isConnected = true,
  onMaximize,
  onClose,
  onRefresh,
  onSettings,
}) => {
  const [message, setMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessageId = Date.now().toString();
    addMessage({
      id: userMessageId,
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    setMessage('');

    // Simulate streaming response
    setIsStreaming(true);
    setStreamingMessage('');

    // This is where you'd normally connect to your chat service
    // For now, we'll simulate a streaming response
    const response = "I'm a simulated streaming response that demonstrates the animated text feature. This helps users understand that the AI is actively thinking and responding to their query.";
    
    let currentResponse = '';
    for (const char of response) {
      currentResponse += char;
      setStreamingMessage(currentResponse);
      await new Promise(resolve => setTimeout(resolve, 20)); // Simulate streaming delay
    }

    // Add assistant message
    addMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      metadata: {
        model: currentModel,
        executionTime: 1200,
        tokens: 150,
        toolsUsed: ['web-search', 'code-analysis']
      }
    });

    setIsStreaming(false);
    setStreamingMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@' && onAtSymbolTrigger) {
      const textarea = e.currentTarget;
      // We need a way to get the cursor position within the textarea
      // For simplicity, let's use the bottom-left of the textarea
      // A more accurate solution would involve a library or more complex logic
      // to calculate the exact caret position.
      const rect = textarea.getBoundingClientRect();
      onAtSymbolTrigger({ x: rect.left, y: rect.bottom });
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize?.();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        title="TanukiMCP Atlas"
        subtitle="AI Development Assistant"
        isConnected={isConnected}
        currentModel={currentModel}
        operationalMode={operationalMode}
        messageCount={messages.length}
        isMaximized={isMaximized}
        onMaximize={handleMaximize}
        onClose={onClose}
        onRefresh={onRefresh}
        onSettings={onSettings}
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-border flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Welcome to TanukiMCP Atlas
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    I'm your AI development assistant. Ask me anything about coding,
                    development, or use tools with @commands.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRetry={() => {}}
                onCopy={() => {}}
              />
            ))
          )}

          {/* Streaming Message */}
          {isStreaming && streamingMessage && (
            <ChatMessage
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingMessage,
                timestamp: new Date(),
              }}
              isStreaming={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-gradient-to-t from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  operationalMode === 'agent'
                    ? "Type your message... (use @ for tools)"
                    : "Type your message..."
                }
                className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                rows={1}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 opacity-50 hover:opacity-100"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isStreaming}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}; 