import React from 'react';
import { Bot, Settings, Maximize2, Minimize2, X, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  isConnected: boolean;
  currentModel?: string;
  operationalMode: 'agent' | 'chat';
  subjectMode?: string;
  messageCount: number;
  isMaximized?: boolean;
  onMaximize?: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'TanukiMCP Atlas',
  subtitle,
  isConnected,
  currentModel,
  operationalMode,
  subjectMode = 'General',
  messageCount,
  isMaximized,
  onMaximize,
  onClose,
  onRefresh,
  onSettings,
}) => {
  return (
    <div className="border-b border-border bg-gradient-to-b from-background to-muted/20">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-border flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-none mb-1">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="ghost" size="icon" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onSettings && (
              <Button variant="ghost" size="icon" onClick={onSettings}>
                <Settings className="w-4 h-4" />
              </Button>
            )}
            {onMaximize && (
              <Button variant="ghost" size="icon" onClick={onMaximize}>
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1.5 flex items-center gap-3 text-sm bg-muted/30">
        <Badge 
          variant={isConnected ? "default" : "destructive"}
          className="rounded-md"
        >
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
        
        <Separator orientation="vertical" className="h-4" />
        
        <Badge 
          variant="secondary"
          className={cn(
            "rounded-md",
            operationalMode === 'agent' 
              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300"
              : "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300"
          )}
        >
          {operationalMode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode'}
        </Badge>
        
        <Badge variant="outline" className="rounded-md">
          {subjectMode}
        </Badge>
        
        {currentModel && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-muted-foreground text-xs">
              Model: {currentModel}
            </span>
          </>
        )}
        
        <Separator orientation="vertical" className="h-4" />
        
        <span className="text-muted-foreground text-xs">
          {messageCount} messages
        </span>
      </div>
    </div>
  );
}; 