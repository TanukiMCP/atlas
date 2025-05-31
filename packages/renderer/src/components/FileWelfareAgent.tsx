import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, PanelRight, PanelRightClose, AtSign, ImagePlus } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

interface FileWelfareAgentProps {
  filePath: string;
  fileContent: string;
  language: string;
  onClose: () => void;
}

interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const FileWelfareAgent: React.FC<FileWelfareAgentProps> = ({
  filePath,
  fileContent,
  language,
  onClose
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: `I'm your file welfare agent for ${filePath}. I maintain context about this file and can help you with implementation, improvements, or any questions.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your AI service with file context
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: AgentMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed ${filePath} and can help with your request: "${inputValue.trim()}". In a real implementation, I would have context about this ${language} file and could perform actions on it.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from file welfare agent:', error);
      
      // Add error message
      const errorMessage: AgentMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: AgentMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    return (
      <div 
        key={message.id}
        className={cn(
          "mb-3",
          isUser ? "flex justify-end" : "flex justify-start"
        )}
      >
        <div className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" :
          isSystem ? "bg-muted text-muted-foreground text-center mx-auto max-w-fit" :
          "bg-card border"
        )}>
          <div className="space-y-1">
            <div className="flex items-center gap-1 mb-1">
              {!isUser && !isSystem && <Bot className="w-3 h-3" />}
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "file-welfare-agent bg-background border-l border-border transition-all duration-300 flex flex-col h-full",
      isExpanded ? "w-80" : "w-10"
    )}>
      {isExpanded ? (
        <>
          {/* Header */}
          <div className="p-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">File Welfare Agent</span>
            </div>
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                      <PanelRightClose className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Collapse</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* File context */}
          <div className="px-3 py-2 bg-muted/50 text-xs">
            <div className="font-medium truncate" title={filePath}>{filePath.split('/').pop()}</div>
            <div className="text-muted-foreground truncate">{language} file</div>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex justify-start mb-3">
                  <div className="bg-card border rounded-lg px-3 py-2 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3 h-3" />
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input area */}
          <div className="p-3 border-t border-border">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this file..."
                className="resize-none pr-16 min-h-[40px] max-h-[120px] text-sm"
                rows={1}
              />
              <div className="absolute bottom-1 right-1 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reference files</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload media</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  size="icon" 
                  className="h-8 w-8"
                  disabled={!inputValue.trim() || isLoading}
                  onClick={handleSendMessage}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10"
                  onClick={() => setIsExpanded(true)}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Expand File Agent</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}; 