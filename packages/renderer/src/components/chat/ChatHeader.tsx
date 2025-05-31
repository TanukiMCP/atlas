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
  onSettings
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            <Bot size={18} />
          </div>
          
          <div>
            <h2 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
              {title}
              {isConnected ? (
                <span className="ml-2 w-2 h-2 rounded-full bg-green-500" title="Connected"></span>
              ) : (
                <span className="ml-2 w-2 h-2 rounded-full bg-red-500" title="Disconnected"></span>
              )}
            </h2>
            
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="flex items-center mr-2">
            <Badge variant={operationalMode === 'agent' ? 'default' : 'outline'} className="mr-1">
              {operationalMode === 'agent' ? 'Agent' : 'Chat'}
            </Badge>
            
            {currentModel && (
              <Badge variant="secondary" className="text-xs">
                {currentModel.split('/').pop()?.replace('-', ' ')}
              </Badge>
            )}
          </div>
          
          <Button variant="ghost" size="icon" onClick={onRefresh} title="Refresh conversation">
            <RefreshCw size={16} />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onSettings} title="Settings">
            <Settings size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMaximize} 
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onClose} title="Close">
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="mr-2">{subjectMode}</span>
          <Separator orientation="vertical" className="h-3 mx-2" />
          <span>{messageCount} messages</span>
        </div>
      </div>
    </div>
  );
}; 