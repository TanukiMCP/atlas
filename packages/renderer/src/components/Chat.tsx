import React, { useState, useEffect, useRef } from 'react';
import chatService from '../services/ChatService';
import ErrorBoundary from './ErrorBoundary';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    model?: string;
    executionTime?: number;
    tokens?: number;
    tierUsed?: string;
    qualityScore?: number;
    toolsUsed?: string[];
  };
}

interface ChatState {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
}

const Chat: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputValue: '',
    isLoading: false,
    error: null,
    conversationId: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize chat service and load conversation
    initializeChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [state.messages]);

  const initializeChat = async () => {
    try {
      // Create a new conversation or use existing one
      const conversationId = chatService.createNewConversation('New Chat');
      const messages = chatService.getCurrentMessages();
      
      setState(prev => ({
        ...prev,
        conversationId,
        messages,
        error: null
      }));

      // Listen for message changes
      const unsubscribe = chatService.onMessagesChanged((messages) => {
        setState(prev => ({ ...prev, messages }));
      });

      // Store unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize chat'
      }));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!state.inputValue.trim() || state.isLoading) return;

    const userMessage = state.inputValue.trim();
    setState(prev => ({
      ...prev,
      inputValue: '',
      isLoading: true,
      error: null
    }));

    try {
      // Send message using ChatService
      await chatService.sendMessage(userMessage);
      
      setState(prev => ({
        ...prev,
        isLoading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetry = () => {
    setState(prev => ({ ...prev, error: null }));
    if (state.inputValue.trim()) {
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {/* Message metadata */}
          {message.metadata && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs opacity-70">
              <div className="flex flex-wrap gap-2">
                {message.metadata.model && (
                  <span>Model: {message.metadata.model}</span>
                )}
                {message.metadata.executionTime && (
                  <span>Time: {message.metadata.executionTime}ms</span>
                )}
                {message.metadata.tierUsed && (
                  <span>Tier: {message.metadata.tierUsed}</span>
                )}
                {message.metadata.qualityScore && (
                  <span>Quality: {Math.round(message.metadata.qualityScore * 100)}%</span>
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
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  if (state.error && !state.conversationId) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <span className="text-red-500 mr-3 text-xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Chat Unavailable
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Unable to initialize chat service
              </p>
            </div>
          </div>
          
          <p className="text-xs text-red-700 dark:text-red-300 mb-4 whitespace-pre-line">
            {state.error}
          </p>
          
          <div className="space-y-2">
            <button
              onClick={initializeChat}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
            <p className="text-xs text-red-600 dark:text-red-400 text-center">
              Make sure the AI service is running and properly configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            TanukiMCP Chat
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by Enhanced LLM Service with 4-Tier Processing
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
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

        {/* Error Display */}
        {state.error && state.conversationId && (
          <div className="border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-sm text-red-700 dark:text-red-300">
                  {state.error}
                </span>
              </div>
              <button
                onClick={handleRetry}
                className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            <textarea
              ref={inputRef}
              value={state.inputValue}
              onChange={(e) => setState(prev => ({ ...prev, inputValue: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={state.isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!state.inputValue.trim() || state.isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chat; 