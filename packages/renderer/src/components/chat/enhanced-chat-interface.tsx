/**
 * Enhanced Chat Interface with Workflow Generation Integration
 * Includes "Save as Workflow" buttons and comprehensive chat management
 * Now integrated with real LLM service
 */

import React, { useState, useRef, useEffect } from 'react';
import { WorkflowGenerationDialog } from '../workflows/workflow-generation-dialog';
import { ChatTranscript, ChatMessage, WorkflowTemplate } from '../../types/workflow-types';
import { useLLMStore } from '../../stores/llm-store';
import { LLMStatus } from '../llm/llm-status';

interface ChatInterfaceProps {
  onAtSymbolTrigger?: (event: React.KeyboardEvent, position: { x: number; y: number }) => void;
}

export const EnhancedChatInterface: React.FC<ChatInterfaceProps> = ({ onAtSymbolTrigger }) => {
  const [message, setMessage] = useState('');
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedMessageForWorkflow, setSelectedMessageForWorkflow] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use LLM store for real chat functionality
  const { 
    currentSession, 
    isConnected, 
    isLoading, 
    sendMessage: sendLLMMessage,
    createNewSession,
    cancelCurrentRequest
  } = useLLMStore();

  // Initialize with a new session if none exists
  useEffect(() => {
    if (!currentSession) {
      createNewSession();
    }
  }, [currentSession, createNewSession]);

  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (!message.trim() || !isConnected || isLoading) return;

    const messageToSend = message;
    setMessage('');

    try {
      await sendLLMMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could add error handling UI here
    }
  };

  const handleSaveAsWorkflow = (fromMessage?: string) => {
    setSelectedMessageForWorkflow(fromMessage || null);
    setShowWorkflowDialog(true);
  };

  const createChatTranscript = (): ChatTranscript => {
    let messagesToInclude = messages;
    
    // If a specific message was selected, include conversation up to that point
    if (selectedMessageForWorkflow) {
      const messageIndex = messages.findIndex(m => m.id === selectedMessageForWorkflow);
      if (messageIndex !== -1) {
        messagesToInclude = messages.slice(0, messageIndex + 1);
      }
    }

    return {
      messages: messagesToInclude,
      sessionId: `session_${Date.now()}`,
      context: {
        subjectMode: 'general',
        projectContext: 'TanukiMCP Atlas Chat',
        availableTools: [
          'read_file', 'write_file', 'search_files', 'search_code',
          'edit_block', 'create_todolist', 'execute_task', 'web_search'
        ],
        userPreferences: {}
      }
    };
  };

  const handleWorkflowSaved = (workflow: WorkflowTemplate) => {
    console.log('Workflow saved:', workflow);
    // In a real implementation, this would update UI to show the saved workflow
    setShowWorkflowDialog(false);
    setSelectedMessageForWorkflow(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleClearChat = () => {
    createNewSession();
  };

  return (
    <div className="chat-interface h-full flex flex-col">
      {/* Chat Header with Workflow Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            💬
          </div>
          <div>
            <h2 className="font-medium">TanukiMCP Assistant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {messages.length} messages
            </p>
          </div>
          <LLMStatus />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSaveAsWorkflow()}
            disabled={messages.length <= 1}
            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Save entire conversation as workflow"
          >
            🔧 Save as Workflow
          </button>
          <button
            onClick={handleClearChat}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id} className="group">
              <div
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-gray-50 dark:bg-gray-800 ml-8'
                    : 'bg-blue-50 dark:bg-blue-900/20 mr-8'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium text-sm ${
                        msg.role === 'user'
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-blue-900 dark:text-blue-100'
                      }`}>
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <div className={`text-sm ${
                      msg.role === 'user'
                        ? 'text-gray-800 dark:text-gray-200'
                        : 'text-blue-800 dark:text-blue-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                  
                  {/* Message Actions */}
                  {msg.role === 'user' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => handleSaveAsWorkflow(msg.id)}
                        className="p-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        title="Save conversation up to this message as workflow"
                      >
                        🔧
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (use @ for tools, Enter to send, Shift+Enter for new line)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={message.includes('\n') ? 3 : 1}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          {isLoading && (
            <button
              onClick={cancelCurrentRequest}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 self-end"
              title="Cancel current request"
            >
              ⏹️
            </button>
          )}
        </div>
        
        {/* Chat Tips */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Use @ to access tools, or save conversations as reusable workflows
        </div>
      </div>

      {/* Workflow Generation Dialog */}
      {showWorkflowDialog && (
        <WorkflowGenerationDialog
          isOpen={showWorkflowDialog}
          onClose={() => {
            setShowWorkflowDialog(false);
            setSelectedMessageForWorkflow(null);
          }}
          chatTranscript={createChatTranscript()}
          onWorkflowSaved={handleWorkflowSaved}
        />
      )}
    </div>
  );
};