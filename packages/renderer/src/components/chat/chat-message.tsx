import React from 'react';
import { Bot, User, MoreHorizontal, Loader2, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AnimatedText } from '../ui/animated-text';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
      model?: string;
      executionTime?: number;
      tokens?: number;
      tierUsed?: string;
      qualityScore?: number;
      toolsUsed?: string[];
    };
  };
  isStreaming?: boolean;
  onRetry?: () => void;
  onCopy?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming,
  onRetry,
  onCopy,
}) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={cn(
      "group flex gap-3 relative py-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
        isUser ? "bg-primary text-primary-foreground" : 
        isSystem ? "bg-muted" : "bg-secondary"
      )}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : isSystem ? (
          <Zap className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[80%] min-w-[100px]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "rounded-lg px-4 py-2 shadow-sm",
          isUser ? "bg-primary text-primary-foreground" :
          isSystem ? "bg-muted text-muted-foreground" :
          "bg-card border"
        )}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {isUser ? 'You' : isSystem ? 'System' : 'Assistant'}
            </span>
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isStreaming ? (
              <AnimatedText 
                text={message.content} 
                className="whitespace-pre-wrap"
              />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>

          {/* Metadata */}
          {message.metadata && Object.keys(message.metadata).length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-2">
              {message.metadata.model && (
                <Badge variant="secondary" className="text-xs">
                  {message.metadata.model}
                </Badge>
              )}
              {message.metadata.executionTime && (
                <Badge variant="secondary" className="text-xs">
                  {message.metadata.executionTime}ms
                </Badge>
              )}
              {message.metadata.tokens && (
                <Badge variant="secondary" className="text-xs">
                  {message.metadata.tokens} tokens
                </Badge>
              )}
              {message.metadata.toolsUsed && message.metadata.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 w-full mt-1">
                  {message.metadata.toolsUsed.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          {!isUser && onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry}>
              <Loader2 className="w-4 h-4 mr-1" />
              Retry
            </Button>
          )}
          {onCopy && (
            <Button variant="ghost" size="sm" onClick={onCopy}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 