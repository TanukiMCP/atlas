import React, { useState, useEffect, useRef } from 'react';
import { ChatViewProps } from '../types/index';
import ChatService from '../services/ChatService';
import ToolSelector from './ToolSelector';
import { formatToolInvocation } from '../utils/parseToolInvocation';

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

const ChatView: React.FC<ChatViewProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Tool selector state
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [toolSelectorPos, setToolSelectorPos] = useState<{ x: number; y: number } | null>(null);
  const [toolSearchText, setToolSearchText] = useState('');
  const [inputCursorPosition, setInputCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load current messages
    setMessages(ChatService.getCurrentMessages());

    // Subscribe to message updates
    const unsubscribe = ChatService.onMessagesChanged((newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const messageContent = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      await ChatService.sendMessage(messageContent, { workspaceRoot: undefined });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '@' && !showToolSelector) {
      // Position tool selector below the cursor
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const caretPos = target.selectionStart || 0;
      setInputCursorPosition(caretPos + 1); // +1 for the @ we're adding
      
      // Calculate position for tool selector
      const x = rect.left + 10; // Offset from left edge
      const y = rect.bottom + 5; // Position below input
      
      setToolSelectorPos({ x, y });
      setShowToolSelector(true);
      setToolSearchText('');
    }
    
    // Handle escape key to close tool selector
    if (e.key === 'Escape' && showToolSelector) {
      setShowToolSelector(false);
      return;
    }
    
    // Only handle Enter if not inside tool selector (which handles its own keys)
    if (e.key === 'Enter' && !showToolSelector) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Update tool selector when typing after @
    if (showToolSelector) {
      const cursorPos = e.target.selectionStart || 0;
      
      // Find the last @ before cursor
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex >= 0) {
        // Extract search text (everything between @ and cursor)
        const searchText = textBeforeCursor.substring(lastAtIndex + 1);
        setToolSearchText(searchText);
        setInputCursorPosition(cursorPos);
      } else {
        // No @ found before cursor, close selector
        setShowToolSelector(false);
      }
    }
  };

  const handleToolSelect = (toolName: string) => {
    const cursorPos = inputCursorPosition;
    
    // Find the position of the @ symbol that triggered the selector
    const textBeforeCursor = message.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex >= 0) {
      // Replace the @searchText with the selected @tool
      const textBefore = message.substring(0, lastAtIndex);
      const textAfter = message.substring(cursorPos);
      const newValue = `${textBefore}@${toolName} ${textAfter}`;
      
      setMessage(newValue);
      
      // Focus back on input and set cursor after the inserted tool
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = lastAtIndex + toolName.length + 2; // +2 for @ and space
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    
    setShowToolSelector(false);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    
    return (
      <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser 
            ? 'bg-secondary text-secondary-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>
        <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
          <div className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-card border border-border'
          }`}>
            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            {msg.metadata && (
              <div className="text-xs opacity-70 mt-2 flex items-center gap-2">
                {msg.metadata.model && (
                  <span>Model: {msg.metadata.model}</span>
                )}
                {msg.metadata.executionTime && (
                  <span>• {msg.metadata.executionTime}ms</span>
                )}
                {msg.metadata.tokens && (
                  <span>• {msg.metadata.tokens} tokens</span>
                )}
              </div>
            )}
          </div>
          <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : ''}`}>
            {formatTimestamp(msg.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  const clearConversation = () => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      ChatService.clearCurrentConversation();
    }
  };

  const createNewConversation = () => {
    ChatService.createNewConversation();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={createNewConversation}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
          >
            New Chat
          </button>
          <button
            onClick={clearConversation}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Chat Messages Area */}
      <div className="bg-card rounded-lg border border-border flex-1 flex flex-col min-h-0">
        {/* Messages Container */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-4xl mb-4">🤖</div>
              <div className="text-lg font-medium mb-2">Welcome to TanukiMCP Atlas</div>
              <div className="text-sm">Start a conversation with your AI development assistant</div>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm text-primary-foreground">
                🤖
              </div>
              <div className="flex-1">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2 relative">
            <input 
              ref={inputRef}
              type="text" 
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your code, project, or type @ to use tools..."
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Sending
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span className="text-xs opacity-70">Enter</span>
                </>
              )}
            </button>
            
            {/* Tool Selector */}
            <ToolSelector
              visible={showToolSelector}
              position={toolSelectorPos}
              onSelect={handleToolSelect}
              onClose={() => setShowToolSelector(false)}
              searchText={toolSearchText}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
            <span>Type @ to access tools, Enter to send</span>
            <span>{messages.length} messages in conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView; 