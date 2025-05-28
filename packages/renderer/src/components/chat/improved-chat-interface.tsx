import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Archive, 
  Edit3, 
  Download,
  Search,
  MoreHorizontal,
  Send,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useChatHistory } from '../../hooks/use-chat-history';
import { ChatSession } from '../../types/chat-types';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ImprovedChatInterfaceProps {
  onAtSymbolTrigger?: (event: React.KeyboardEvent, position: { x: number; y: number }) => void;
  operationalMode?: 'agent' | 'chat';
}

export interface ImprovedChatInterfaceHandle {
  insertText: (text: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const ImprovedChatInterface = forwardRef<ImprovedChatInterfaceHandle, ImprovedChatInterfaceProps>(
  ({ onAtSymbolTrigger, operationalMode = 'agent' }, ref) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const {
      sessions,
      currentSession,
      createSession,
      updateSession,
      deleteSession,
      archiveSession,
      exportSession,
      setCurrentSession
    } = useChatHistory();

    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: '1',
        type: 'assistant',
        content: 'Welcome to TanukiMCP Assistant! I\'m here to help you with development tasks, file operations, and intelligent automation. How can I assist you today?',
        timestamp: new Date()
      }
    ]);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    // Focus input when component mounts
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    useImperativeHandle(ref, () => ({
      insertText: (text: string) => setMessage(prev => prev + text),
      addMessage: (newMessage: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const fullMessage: ChatMessage = {
          ...newMessage,
          id: Date.now().toString(),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fullMessage]);
      }
    }));

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === '@' && onAtSymbolTrigger) {
        const rect = event.currentTarget.getBoundingClientRect();
        onAtSymbolTrigger(event, { x: rect.left, y: rect.bottom });
      }
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };

    const handleSendMessage = async () => {
      if (message.trim() && !isTyping) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message.trim(),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        // Simulate assistant response with streaming
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: operationalMode === 'agent' 
              ? `I'm in Agent Mode and can help you with file operations, code execution, and complex workflows. You asked: "${userMessage.content}"`
              : `I'm in Chat Mode and can help with analysis, research, and conversational assistance. You asked: "${userMessage.content}"`,
            timestamp: new Date(),
            isStreaming: true
          };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Simulate streaming completion
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, isStreaming: false }
                : msg
            ));
            setIsTyping(false);
          }, 2000);
        }, 500);
      }
    };

    const handleNewChat = () => {
      createSession({
        title: `New Chat ${new Date().toLocaleTimeString()}`,
        description: 'Fresh conversation session'
      });
      setMessages([{
        id: '1',
        type: 'assistant',
        content: 'Hello! I\'m ready to help you with your next task. What would you like to work on?',
        timestamp: new Date()
      }]);
    };

    const handleSelectSession = (session: ChatSession) => {
      setCurrentSession(session);
      // In a real implementation, load session messages
      setMessages([{
        id: '1',
        type: 'assistant',
        content: `Loaded session: ${session.title}. How can I continue helping you?`,
        timestamp: new Date()
      }]);
    };

    const toggleSessionSelection = (sessionId: string) => {
      setSelectedSessionIds(prev => 
        prev.includes(sessionId) 
          ? prev.filter(id => id !== sessionId)
          : [...prev, sessionId]
      );
    };

    const handleBulkDelete = () => {
      selectedSessionIds.forEach(id => deleteSession(id));
      setSelectedSessionIds([]);
    };

    const handleBulkArchive = () => {
      selectedSessionIds.forEach(id => archiveSession(id));
      setSelectedSessionIds([]);
    };

    const filteredSessions = sessions.filter(session =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex h-full bg-background">
        {/* Chat Sessions Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border bg-card/50 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Chat Sessions</h2>
                <Button size="sm" onClick={handleNewChat} className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Session Management Actions */}
            {selectedSessionIds.length > 0 && (
              <div className="p-3 bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedSessionIds.length} selected
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={handleBulkArchive} className="h-7 px-2">
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleBulkDelete} className="h-7 px-2">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Sessions List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors border",
                      currentSession?.id === session.id
                        ? "bg-primary/10 border-primary/20"
                        : "bg-background hover:bg-muted/50 border-transparent",
                      selectedSessionIds.includes(session.id) && "ring-2 ring-primary/20"
                    )}
                    onClick={() => handleSelectSession(session)}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSessionIds.includes(session.id)}
                        onChange={() => toggleSessionSelection(session.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <h4 className="font-medium text-sm truncate">{session.title}</h4>
                        </div>
                        
                        {session.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {session.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground mt-2 gap-2">
                          <span>{session.metadata.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{session.messages.length} messages</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportSession(session.id);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!showSidebar && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowSidebar(true)}
                    className="h-8 w-8 p-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <h1 className="font-semibold">
                    {currentSession?.title || 'TanukiMCP Assistant'}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      operationalMode === 'agent' 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    )}>
                      {operationalMode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode'}
                    </span>
                    <span>•</span>
                    <span>{messages.length} messages</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {showSidebar && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowSidebar(false)}
                  >
                    Hide Sidebar
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 relative">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4 pb-20">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex gap-3 max-w-none",
                    msg.type === 'user' ? "justify-end" : "justify-start"
                  )}>
                    {msg.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                        🦝
                      </div>
                    )}
                    
                    <div className={cn(
                      "rounded-lg px-4 py-3 max-w-[85%] break-words",
                      msg.type === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted border"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {msg.type === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                        {msg.isStreaming && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                    
                    {msg.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium flex-shrink-0">
                        👤
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      🦝
                    </div>
                    <div className="bg-muted border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Assistant is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card/30">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={operationalMode === 'agent' 
                    ? "Type your message... (use @ for tools, I can execute actions)"
                    : "Type your message... (conversational mode, thinking tools only)"}
                  disabled={isTyping}
                  className="min-h-[44px] resize-none"
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="h-11 px-4"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImprovedChatInterface.displayName = 'ImprovedChatInterface'; 