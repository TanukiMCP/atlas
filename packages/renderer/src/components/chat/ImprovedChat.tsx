import React, { useState } from 'react';
import { ChatProvider, useChatContext } from '../../contexts/ChatContext';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import ToolSelector from '../ToolSelector';
import { ErrorBoundary } from '../ErrorBoundary';
import { useLLMStore } from '../../stores/llm-store';

interface ImprovedChatProps {
  isConnected?: boolean;
  currentModel?: string;
  operationalMode?: 'agent' | 'chat';
  onMaximize?: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

// Inner component to use the context
const ChatContent: React.FC<ImprovedChatProps> = ({
  isConnected = true,
  currentModel: propCurrentModel,
  operationalMode = 'chat',
  onMaximize,
  onClose,
  onRefresh,
  onSettings
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { state, dispatch, handleToolSelect } = useChatContext();
  
  // Use the LLM store's currentModel if the prop is not provided
  const { currentModel: storeCurrentModel } = useLLMStore();
  const currentModel = propCurrentModel || storeCurrentModel || 'meta-llama/llama-3.1-8b-instruct';

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize?.();
  };

  return (
    <div className={`h-full flex flex-col ${isMaximized ? 'fixed inset-0 z-50' : ''}`}>
      <ChatHeader
        isConnected={isConnected}
        currentModel={currentModel}
        operationalMode={operationalMode as 'agent' | 'chat'}
        messageCount={state.messages.length}
        isMaximized={isMaximized}
        onMaximize={handleMaximize}
        onClose={onClose}
        onRefresh={onRefresh}
        onSettings={onSettings}
        subtitle="Powered by Enhanced LLM Service"
      />
      
      <ChatMessages />
      
      {/* Error Display */}
      {state.error && (
        <div className="border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-sm text-red-700 dark:text-red-300">
                {state.error}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_ERROR', error: null })}
              className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      <ChatInput />
      
      {/* Tool Selector */}
      <ToolSelector
        visible={state.showToolSelector}
        position={state.toolSelectorPos}
        onSelect={handleToolSelect}
        onClose={() => dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false })}
        searchText={state.toolSearchText}
      />
    </div>
  );
};

// Main component that provides the context
export const ImprovedChat: React.FC<ImprovedChatProps> = (props) => {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <ChatContent {...props} />
      </ChatProvider>
    </ErrorBoundary>
  );
}; 