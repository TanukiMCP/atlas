/**
 * Real Chat Interface with OpenRouter LLM Integration
 * Provides streaming LLM communication through OpenRouter API
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLLMStore, OpenRouterMessage } from '../../stores/llm-store';
import { WorkflowGenerationDialog } from '../workflows/workflow-generation-dialog';
import { ChatTranscript, WorkflowTemplate } from '../../types/workflow-types';
import { AlertCircle, Bot, User, Loader2, StopCircle, Settings, MessageSquare } from 'lucide-react';
import ToolCallsContainer from './ToolCallsContainer';
import ModelSelector from '../llm/ModelSelector';
import { SubjectModeDropdown } from '../shared/subject-mode-dropdown';
import { useViewStore } from '../../stores/viewStore';
import { ToolSelector } from '../ToolSelector';
import MCPService from '../../services/MCPService';

interface RealChatInterfaceProps {
  onAtSymbolTrigger?: (event: React.KeyboardEvent, position: { x: number; y: number }) => void;
}

export const RealChatInterface: React.FC<RealChatInterfaceProps> = ({ onAtSymbolTrigger }) => {
  const [message, setMessage] = useState('');
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedMessageForWorkflow, setSelectedMessageForWorkflow] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Tool selector state
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [toolSelectorPosition, setToolSelectorPosition] = useState<{ x: number; y: number } | null>(null);
  const [toolSearchText, setToolSearchText] = useState('');
  const [inputCursorPosition, setInputCursorPosition] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    clearCurrentSession,
    loadSession
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

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle @ symbol to trigger tool selector
    if (event.key === '@') {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const caretPos = target.selectionStart || 0;
      setInputCursorPosition(caretPos + 1); // +1 for the @ we're adding
      
      // Calculate position based on textarea and cursor
      const textBeforeCursor = target.value.substring(0, caretPos);
      const lines = textBeforeCursor.split('\n');
      const currentLineIndex = lines.length - 1;
      const currentColumnIndex = lines[currentLineIndex].length;
      
      // Calculate position relative to textarea
      const lineHeight = parseInt(window.getComputedStyle(target).lineHeight) || 20;
      const charWidth = 8; // Approximate character width
      
      // Calculate position relative to textarea
      const x = rect.left + (currentColumnIndex * charWidth);
      const y = rect.top + ((currentLineIndex + 1) * lineHeight);
      
      setToolSelectorPosition({ x, y });
      setToolSearchText('');
      setShowToolSelector(true);
    }
    
    // Handle escape key to close tool selector
    if (event.key === 'Escape' && showToolSelector) {
      setShowToolSelector(false);
      return;
    }
    
    // Update tool search text when typing after @
    if (showToolSelector && event.currentTarget.selectionStart) {
      const cursorPos = event.currentTarget.selectionStart;
      const textBeforeCursor = message.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex >= 0) {
        const searchText = textBeforeCursor.substring(lastAtIndex + 1);
        setToolSearchText(searchText);
      }
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

  const handleToolSelect = (toolName: string) => {
    const cursorPos = inputCursorPosition;
    
    // Find the position of the @ symbol that triggered the selector
    const textBeforeCursor = message.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex >= 0) {
      // Replace the @searchText with the selected @tool
      const textBefore = message.substring(0, lastAtIndex);
      const textAfter = message.substring(cursorPos);
      const newValue = `${textBefore}@${toolName} ${textAfter}`;
      
      setMessage(newValue);
      
      // Focus back on input and set cursor after the inserted tool
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = lastAtIndex + toolName.length + 2; // +2 for @ and space
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    
    setShowToolSelector(false);
  };

  // Helper function to extract tool calls from a message
  interface ToolCall {
    name: string;
    parameters: Record<string, any>;
  }

  const extractToolCalls = (message: string): ToolCall[] => {
    const toolCallRegex = /@([a-zA-Z0-9._-]+)(?:\s+(\{.*?\}))?/g;
    const toolCalls: ToolCall[] = [];
    let match;
    
    while ((match = toolCallRegex.exec(message)) !== null) {
      const toolName = match[1];
      let parameters = {};
      
      // Try to parse parameters if they exist
      if (match[2]) {
        try {
          parameters = JSON.parse(match[2]);
        } catch (e) {
          console.warn(`Failed to parse parameters for tool ${toolName}:`, e);
        }
      }
      
      toolCalls.push({ name: toolName, parameters });
    }
    
    return toolCalls;
  };

  // Helper function to format tool results
  const formatToolResults = (results: Array<{ tool: string, success: boolean, result?: any, error?: string }>) => {
    return results.map(result => {
      if (result.success) {
        return `@${result.tool}: ${typeof result.result === 'object' ? JSON.stringify(result.result, null, 2) : result.result}`;
      } else {
        return `@${result.tool}: Error - ${result.error}`;
      }
    }).join('\n\n');
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
      // Check for tool calls in the message
      const toolCalls = extractToolCalls(userMessage);
      
      if (toolCalls.length > 0 && agentMode) {
        // Process tool calls
        const results = await Promise.all(toolCalls.map(async (toolCall) => {
          try {
            const result = await MCPService.executeTool(toolCall.name, toolCall.parameters || {});
            return { 
              tool: toolCall.name, 
              success: true, 
              result: result.data || result 
            };
          } catch (error) {
            return { 
              tool: toolCall.name, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }));
        
        // Format results for display
        const resultsMessage = formatToolResults(results);
        
        // Send the original message
        await sendMessage(userMessage);
        
        // Then send the tool results as a system message
        if (resultsMessage) {
          // Create a system message manually since sendMessage expects a user message
          if (currentSession) {
            const systemMessage: OpenRouterMessage = {
              role: 'system',
              content: `Tool Results:\n${resultsMessage}`,
              timestamp: new Date()
            };
            
            // Add the system message to the current session
            if (currentSession) {
              const updatedSession = {
                ...currentSession,
                messages: [...currentSession.messages, systemMessage],
                updatedAt: new Date()
              };
              
              // This is a workaround since we can't directly use the store's set function
              // We'll use the store's API to update the session
              if (updatedSession.id) {
                // First load the session to make sure it's current
                loadSession(updatedSession.id);
                // Then clear and recreate with the same ID but updated messages
                clearCurrentSession();
                createNewSession(updatedSession.name);
                // Now send all messages again (this is not ideal but works as a workaround)
                for (const msg of updatedSession.messages) {
                  if (msg.role === 'user') {
                    await sendMessage(msg.content);
                  }
                }
              }
            }
          }
        }
      } else {
        // Regular message without tool calls
        await sendMessage(userMessage);
      }
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

  // Update tool search text when typing after @
  useEffect(() => {
    if (!showToolSelector || !textareaRef.current) return;
    
    const handleInput = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const cursorPos = textarea.selectionStart || 0;
      const textBeforeCursor = textarea.value.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex >= 0) {
        const searchText = textBeforeCursor.substring(lastAtIndex + 1);
        setToolSearchText(searchText);
      } else {
        // If we can't find @ symbol before cursor, close the selector
        setShowToolSelector(false);
      }
    };
    
    const textarea = textareaRef.current;
    textarea.addEventListener('input', handleInput);
    
    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, [showToolSelector]);

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
          {/* Subject Context */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-muted border border-border">
            <span className="text-xs font-semibold text-muted-foreground">Subject</span>
            <div className="min-w-[180px]">
              <SubjectModeDropdown currentMode={subjectMode} onModeChange={handleSubjectModeChange} />
            </div>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {currentSession?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-md p-6">
              <Bot className="w-12 h-12 text-primary mx-auto opacity-50" />
              <h3 className="text-lg font-semibold">Start a conversation</h3>
              <p className="text-muted-foreground text-sm">
                Ask questions, get help with tasks, or explore what TanukiMCP Atlas can do.
              </p>
            </div>
          </div>
        )}
        
        {currentSession?.messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
            <div className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 max-w-[85%]`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border border-border'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col">
                <div className={`rounded-lg p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
                
                <div className={`text-xs text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Message */}
        {isStreaming && streamingMessage && (
          <div className="flex justify-start mb-6">
            <div className="flex flex-row gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted border border-border">
                <Bot className="w-4 h-4" />
              </div>
              
              <div className="flex flex-col">
                <div className="rounded-lg p-4 bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{streamingMessage}</div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background">
        {/* Agent/Chat Mode Toggle - Cursor Style */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-md p-1">
              <button
                onClick={() => handleModeToggle('agent')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                  agentMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={agentMode}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Agent</span>
              </button>
              <button
                onClick={() => handleModeToggle('chat')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                  !agentMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={!agentMode}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
            
            {isStreaming && (
              <button 
                onClick={cancelCurrentRequest}
                className="flex items-center gap-1 px-3 py-1 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md text-sm"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => clearCurrentSession()}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 hover:bg-muted rounded"
            >
              Clear chat
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agentMode ? 'TanukiMCP Agent' : 'TanukiMCP Chat'}...`}
            className="w-full border rounded-lg p-3 pr-12 min-h-[100px] max-h-[200px] resize-none focus:outline-none focus:ring-1 focus:ring-primary bg-background"
            disabled={isStreaming}
            ref={textareaRef}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isStreaming}
            className={`absolute bottom-3 right-3 p-2 rounded-md ${
              message.trim() && !isStreaming 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Type <span className="bg-muted px-1 rounded">@</span> to access tools
          </div>
          <div>
            {isConnected ? 'Connected to OpenRouter' : 'Not connected'}
          </div>
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

      {/* Tool Selector */}
      {showToolSelector && (
        <ToolSelector
          visible={showToolSelector}
          position={toolSelectorPosition}
          searchText={toolSearchText}
          onSelect={handleToolSelect}
          onClose={() => setShowToolSelector(false)}
        />
      )}
    </div>
  );
};