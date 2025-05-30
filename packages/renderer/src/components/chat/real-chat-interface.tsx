/**
 * Real Chat Interface with OpenRouter LLM Integration
 * Provides streaming LLM communication through OpenRouter API
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { WorkflowGenerationDialog } from '../workflows/workflow-generation-dialog';
import { ChatTranscript, WorkflowTemplate } from '../../types/workflow-types';
import { AlertCircle, Bot, User, Loader2, StopCircle, Settings } from 'lucide-react';
import ToolCallsContainer from './ToolCallsContainer';
import ModelSelector from '../llm/ModelSelector';
import { SubjectModeDropdown } from '../shared/subject-mode-dropdown';
import { useViewStore } from '../../stores/viewStore';

interface RealChatInterfaceProps {
  onAtSymbolTrigger?: (event: React.KeyboardEvent, position: { x: number; y: number }) => void;
}

export const RealChatInterface: React.FC<RealChatInterfaceProps> = ({ onAtSymbolTrigger }) => {
  const [message, setMessage] = useState('');
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedMessageForWorkflow, setSelectedMessageForWorkflow] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    healthStatus,
    availableModels,
    currentModel,
    currentSession,
    isStreaming,
    streamingMessage,
    checkHealth,
    refreshModels,
    setCurrentModel,
    createNewSession,
    sendMessage,
    cancelCurrentRequest,
    clearCurrentSession
  } = useLLMStore();

  // View store for agent/chat mode and subject mode
  const agentMode = useViewStore(state => state.agentMode);
  const setAgentMode = useViewStore(state => state.setAgentMode);
  const subjectMode = useViewStore(state => state.subjectMode);
  const setSubjectMode = useViewStore(state => state.setSubjectMode);

  // Handler for agent/chat toggle
  const handleModeToggle = (mode: 'agent' | 'chat') => {
    setAgentMode(mode === 'agent');
  };

  // Handler for subject mode change
  const handleSubjectModeChange = (mode: string) => {
    setSubjectMode(mode as any);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, streamingMessage]);

  useEffect(() => {
    // Check health on component mount
    checkHealth();
  }, [checkHealth]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === '@' && onAtSymbolTrigger) {
      const rect = event.currentTarget.getBoundingClientRect();
      onAtSymbolTrigger(event, { x: rect.left, y: rect.bottom });
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (isStreaming) {
        // Cancel current streaming, then send the new message
        await cancelCurrentRequest();
        if (message.trim()) {
          await handleSendMessage();
        }
      } else {
        await handleSendMessage();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isStreaming) return;

    if (!isConnected) {
      alert('Not connected to OpenRouter. Please check your OpenRouter API key and internet connection.');
      return;
    }

    if (!currentSession) {
      createNewSession();
    }

    const userMessage = message;
    setMessage('');

    try {
      await sendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveAsWorkflow = (fromMessage?: string) => {
    setSelectedMessageForWorkflow(fromMessage || null);
    setShowWorkflowDialog(true);
  };

  const createChatTranscript = (): ChatTranscript => {
    if (!currentSession) {
      return {
        messages: [],
        sessionId: 'empty',
        context: {
          subjectMode: 'general',
          projectContext: 'TanukiMCP Atlas Chat',
          availableTools: [],
          userPreferences: {}
        }
      };
    }

    return {
      messages: currentSession.messages.map((msg, index) => ({
        id: `msg-${index}-${Date.now()}`,
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString(),
        metadata: {}
      })),
      sessionId: currentSession.id,
      context: {
        subjectMode: 'general',
        projectContext: currentSession.name || 'TanukiMCP Atlas Chat',
        availableTools: [],
        userPreferences: {}
      }
    };
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
          <h3 className="text-lg font-semibold">Connection Required</h3>
          <p className="text-muted-foreground">
            Please check your OpenRouter API key and internet connection.
          </p>
          <button
            onClick={checkHealth}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Redesigned Chat Header */}
      <div className="w-full px-6 py-3 border-b border-border bg-background flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Bot className="w-6 h-6 text-primary shrink-0" />
          <span className="font-bold text-lg truncate">TanukiMCP Atlas Chat</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Model Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-muted border border-border">
            <span className="text-xs font-semibold text-muted-foreground">Model</span>
            <ModelSelector />
          </div>
          {/* Mode/Subject Context */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-muted border border-border">
            <span className="text-xs font-semibold text-muted-foreground">Mode</span>
            <button
              className={`px-2 py-1 rounded font-medium text-xs flex items-center gap-1 ${agentMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'}`}
              onClick={() => handleModeToggle('agent')}
              aria-pressed={agentMode}
            >
              <Bot className="w-4 h-4" /> Agent
            </button>
            <button
              className={`px-2 py-1 rounded font-medium text-xs flex items-center gap-1 ${!agentMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'}`}
              onClick={() => handleModeToggle('chat')}
              aria-pressed={!agentMode}
            >
              <span className="w-4 h-4">💬</span> Chat
            </button>
            <span className="text-xs font-semibold text-muted-foreground ml-3">Subject</span>
            <div className="min-w-[180px]">
              <SubjectModeDropdown currentMode={subjectMode} onModeChange={handleSubjectModeChange} />
            </div>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession?.messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                <span className="text-xs opacity-70">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Streaming Message */}
        {isStreaming && streamingMessage && (
          <div className="flex gap-3 justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4" />
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs opacity-70">Thinking...</span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{streamingMessage}</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (use @tool_name for tool calls)"
            className="flex-1 resize-none border border-border rounded-md px-3 py-2 text-sm min-h-[2.5rem] max-h-32"
            rows={1}
          />
          {isStreaming ? (
            <button
              onClick={cancelCurrentRequest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <StopCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          )}
        </div>
      </div>

      {/* Workflow Generation Dialog */}
      {showWorkflowDialog && (
        <WorkflowGenerationDialog
          isOpen={showWorkflowDialog}
          onClose={() => setShowWorkflowDialog(false)}
          chatTranscript={createChatTranscript()}
          onWorkflowSaved={(workflow: WorkflowTemplate) => {
            console.log('Workflow created:', workflow);
            setShowWorkflowDialog(false);
          }}
        />
      )}

      {/* Tool Calls Container (floating overlay) */}
      <div className="pointer-events-none">
        <div className="pointer-events-auto fixed bottom-4 right-4 z-50">
          <ToolCallsContainer />
        </div>
      </div>

      {/* Emergency Stop Button (floating in chat area) */}
      {isStreaming && (
        <div className="fixed bottom-24 right-4 z-50">
          <button
            onClick={cancelCurrentRequest}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors font-semibold text-base focus:outline-none focus:ring-2 focus:ring-red-400 animate-pulse"
            aria-label="Emergency Stop"
          >
            <StopCircle className="w-6 h-6" />
            Emergency Stop
          </button>
        </div>
      )}
    </div>
  );
};