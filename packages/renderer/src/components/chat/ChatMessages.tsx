import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { AnimatedText } from '../ui/animated-text';
import { AlertCircle } from 'lucide-react';

export const ChatMessages: React.FC = () => {
  const { state, getModelContextLimit } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  // Calculate token usage percentage
  const getTokenUsagePercentage = () => {
    const modelLimit = getModelContextLimit(state.currentModel);
    return (state.totalTokens / modelLimit) * 100;
  };

  // Get token warning level
  const getTokenWarningLevel = () => {
    const percentage = getTokenUsagePercentage();
    if (percentage > 90) return 'critical';
    if (percentage > 75) return 'warning';
    if (percentage > 50) return 'info';
    return 'normal';
  };

  const renderMessage = (message: any) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card border shadow-sm text-card-foreground'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          ) : (
            <AnimatedText 
              text={message.content} 
              className="whitespace-pre-wrap leading-relaxed"
              speed={5}
            />
          )}
          
          {/* Message metadata */}
          {message.metadata && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs opacity-70">
              <div className="flex flex-wrap gap-2">
                {message.metadata.model && (
                  <span>Model: {message.metadata.model.split('/').pop()}</span>
                )}
                {message.metadata.executionTime && (
                  <span>Time: {(message.metadata.executionTime / 1000).toFixed(1)}s</span>
                )}
                {message.metadata.tierUsed && (
                  <span>Tier: {message.metadata.tierUsed}</span>
                )}
                {message.metadata.qualityScore && (
                  <span>Quality: {Math.round(message.metadata.qualityScore * 100)}%</span>
                )}
                {message.metadata.tokens && (
                  <span>Tokens: {message.metadata.tokens}</span>
                )}
              </div>
              {message.metadata.toolsUsed && message.metadata.toolsUsed.length > 0 && (
                <div className="mt-1">
                  Tools: {message.metadata.toolsUsed.join(', ')}
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs opacity-50 mt-1">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Token Usage Warning */}
      {state.totalTokens > 0 && getTokenWarningLevel() !== 'normal' && (
        <div className={`mb-4 p-3 rounded-md ${
          getTokenWarningLevel() === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
          getTokenWarningLevel() === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
          'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`w-5 h-5 mr-2 ${
              getTokenWarningLevel() === 'critical' ? 'text-red-500' :
              getTokenWarningLevel() === 'warning' ? 'text-yellow-500' :
              'text-blue-500'
            }`} />
            <div>
              <div className="font-medium">
                {getTokenWarningLevel() === 'critical' ? 'High Token Usage' :
                 getTokenWarningLevel() === 'warning' ? 'Moderate Token Usage' :
                 'Token Usage Notice'}
              </div>
              <div className="text-sm mt-1">
                {getTokenWarningLevel() === 'critical' ? 
                  `This conversation is using ${Math.round(getTokenUsagePercentage())}% of the available context window. Consider starting a new conversation soon.` :
                 getTokenWarningLevel() === 'warning' ?
                  `This conversation is using ${Math.round(getTokenUsagePercentage())}% of the available context window.` :
                  `This conversation is using ${Math.round(getTokenUsagePercentage())}% of the available context window.`
                }
              </div>
            </div>
          </div>
        </div>
      )}
      
      {state.messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Ask me anything! I can help with coding, analysis, creative writing, 
              problem-solving, and more. I have access to various tools and can 
              adapt my processing complexity to your needs.
            </p>
          </div>
        </div>
      ) : (
        <>
          {state.messages.map(renderMessage)}
          {state.isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}; 