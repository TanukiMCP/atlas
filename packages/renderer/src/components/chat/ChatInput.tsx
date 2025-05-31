import React, { useRef, useEffect, useState } from 'react';
import { Send, Paperclip, X, AlertCircle, Image, StopCircle } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { ToolSelector } from '../shared/tool-selector';

export const ChatInput: React.FC = () => {
  const { 
    state, 
    dispatch, 
    sendMessage, 
    stopGeneration,
    handleToolSelect,
    handleFileSelect,
    handleFileUpload,
    handleMediaUpload,
    removeFile,
    cancelMediaPreview,
    calculateTotalTokens,
    getModelContextLimit
  } = useChatContext();
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [tokenLimit, setTokenLimit] = useState(4000); // Default token limit
  
  // Estimate token count for the input text
  const estimateTokenCount = (text: string): number => {
    // Rough token estimation (4 characters per token average)
    return Math.ceil(text.length / 4);
  };
  
  // Update token count when input changes
  useEffect(() => {
    const inputTokens = estimateTokenCount(state.inputValue);
    const conversationTokens = calculateTotalTokens();
    setTokenCount(inputTokens);
    
    // Get token limit based on current model
    const limit = getModelContextLimit(state.currentModel);
    setTokenLimit(limit);
  }, [state.inputValue, state.currentModel, calculateTotalTokens, getModelContextLimit]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch({ type: 'SET_INPUT_VALUE', value });
    
    // Update tool selector when typing after @
    if (state.showToolSelector) {
      console.log('[ChatInput] Input changed while ToolSelector is visible.');
      const cursorPos = e.target.selectionStart || 0;
      
      // Find the last @ before cursor
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex >= 0) {
        // Extract search text (everything between @ and cursor)
        const searchText = textBeforeCursor.substring(lastAtIndex + 1);
        dispatch({ type: 'SET_TOOL_SEARCH_TEXT', text: searchText });
        dispatch({ type: 'SET_INPUT_CURSOR_POSITION', position: cursorPos });
        console.log('[ChatInput] Tool search text:', searchText, 'Cursor pos:', cursorPos);
      } else {
        // No @ found before cursor, close selector
        console.log('[ChatInput] No @ found before cursor, closing ToolSelector.');
        dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false });
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Special handling for @ symbol to trigger tool selector
    if (e.key === '@' && !state.showToolSelector) {
      console.log('[ChatInput] @ key pressed, attempting to show ToolSelector.');
      
      // Get accurate position for the tool selector
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      
      // Get cursor position within textarea
      const caretPos = target.selectionStart || 0;
      dispatch({ type: 'SET_INPUT_CURSOR_POSITION', position: caretPos + 1 }); // +1 for the @ we're adding
      
      // Get the text before the cursor to calculate line and column
      const textBeforeCursor = target.value.substring(0, caretPos);
      const lines = textBeforeCursor.split('\n');
      const currentLineIndex = lines.length - 1;
      const currentColumnIndex = lines[currentLineIndex].length;
      
      // Calculate position based on line and column
      const lineHeight = parseInt(window.getComputedStyle(target).lineHeight) || 20;
      const charWidth = 8; // Approximate character width
      
      // Calculate position relative to textarea
      const x = rect.left + (currentColumnIndex * charWidth);
      const y = rect.top + ((currentLineIndex + 1) * lineHeight);
      
      dispatch({ type: 'SET_TOOL_SELECTOR_POSITION', position: { x, y } });
      console.log('[ChatInput] ToolSelector position:', { x, y });
      dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: true });
      dispatch({ type: 'SET_TOOL_SEARCH_TEXT', text: '' });
    }
    
    // Handle escape key to close tool selector
    if (e.key === 'Escape' && state.showToolSelector) {
      console.log('[ChatInput] Escape key pressed, closing ToolSelector.');
      dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false });
      return;
    }
    
    // Only handle Enter if not inside tool selector (which handles its own keys)
    if (e.key === 'Enter' && !e.shiftKey && !state.showToolSelector) {
      e.preventDefault();
      sendMessage('');
    }
  };
  
  // Calculate if message exceeds token limit
  const isExceedingLimit = () => {
    const inputTokens = tokenCount;
    const conversationTokens = state.totalTokens;
    return inputTokens + conversationTokens > tokenLimit;
  };
  
  // Calculate how many tokens to remove to fit within limit
  const tokensToRemove = () => {
    const inputTokens = tokenCount;
    const conversationTokens = state.totalTokens;
    return inputTokens + conversationTokens - tokenLimit;
  };
  
  // Check if we can send a message
  const canSendMessage = () => {
    return (
      (state.inputValue.trim() || 
       state.uploadingFiles.length > 0 || 
       state.selectedFiles.length > 0 ||
       state.mediaPreview !== null) && 
      !isExceedingLimit() &&
      !state.isLoading
    );
  };
  
  return (
    <>
      {/* File Upload Preview */}
      {state.uploadingFiles.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {state.uploadingFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center bg-white dark:bg-gray-700 rounded px-2 py-1 text-xs"
              >
                <span className="mr-1 truncate max-w-[150px]">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {state.selectedFiles.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex flex-wrap gap-2">
            {state.selectedFiles.map((path, index) => (
              <div 
                key={`${path}-${index}`}
                className="flex items-center bg-white dark:bg-gray-700 rounded px-2 py-1 text-xs"
              >
                <span className="mr-1 truncate max-w-[150px]">{path.split('/').pop()}</span>
                <button 
                  onClick={() => dispatch({ type: 'REMOVE_SELECTED_FILE', path })}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Media Preview */}
      {state.mediaPreview && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-green-50 dark:bg-green-900/20">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Media Preview: {state.mediaPreview.name}
              </span>
              <button 
                onClick={cancelMediaPreview}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex justify-center bg-white dark:bg-gray-800 rounded-lg p-2 max-h-48 overflow-hidden">
              {state.mediaPreview.type.startsWith('image/') && (
                <img 
                  src={state.mediaPreview.data} 
                  alt={state.mediaPreview.name}
                  className="max-h-40 rounded object-contain"
                />
              )}
              {state.mediaPreview.type.startsWith('video/') && (
                <video 
                  src={state.mediaPreview.data} 
                  controls
                  className="max-h-40 rounded"
                />
              )}
              {state.mediaPreview.type.startsWith('audio/') && (
                <audio 
                  src={state.mediaPreview.data} 
                  controls
                  className="w-full"
                />
              )}
              {!/^(image|video|audio)\//.test(state.mediaPreview.type) && (
                <div className="flex items-center justify-center h-40 w-full">
                  <span className="text-gray-500 dark:text-gray-400">
                    Unsupported media type: {state.mediaPreview.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Token Counter */}
      {tokenCount > 0 && (
        <div className={`border-t border-gray-200 dark:border-gray-700 p-2 ${
          isExceedingLimit() ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="text-xs flex items-center">
              {isExceedingLimit() && (
                <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
              )}
              <span>
                Token count: <span className={isExceedingLimit() ? 'font-bold text-red-600 dark:text-red-400' : ''}>
                  {(tokenCount + state.totalTokens).toLocaleString()}
                </span> / {tokenLimit.toLocaleString()} 
                <span className="ml-2 text-muted-foreground">
                  (Input: {tokenCount.toLocaleString()}, Conversation: {state.totalTokens.toLocaleString()})
                </span>
              </span>
            </div>
            {isExceedingLimit() && (
              <div className="text-xs text-red-600 dark:text-red-400">
                Please remove {tokensToRemove().toLocaleString()} tokens to fit within limit
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3 relative">
          <textarea
            ref={inputRef}
            value={state.inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Type @ for tools, Press Enter to send, Shift+Enter for new line)"
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={state.isLoading}
          />
          
          {/* Media Upload Button */}
          <button
            onClick={handleMediaUpload}
            disabled={state.isLoading}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload media (images, videos, audio)"
          >
            <Image size={20} />
          </button>
          
          {/* File Upload Button */}
          <button
            onClick={handleFileUpload}
            disabled={state.isLoading}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload files"
          >
            <Paperclip size={20} />
          </button>
          
          {/* Send/Stop Button */}
          {state.isGenerating ? (
            <button
              onClick={stopGeneration}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <StopCircle size={20} />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={() => sendMessage('')}
              disabled={!canSendMessage()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Type @ to access tools and browse files
        </div>

        {/* Tool Selector */}
        {state.showToolSelector && state.toolSelectorPos && (
          <ToolSelector
            isOpen={state.showToolSelector}
            position={state.toolSelectorPos}
            operationalMode="chat"
            onToolSelect={handleToolSelect}
            onFileSelect={handleFileSelect}
            onClose={() => dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false })}
            currentModel={state.currentModel}
          />
        )}
      </div>
    </>
  );
}; 