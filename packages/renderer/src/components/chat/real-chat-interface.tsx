/**
 * Real Chat Interface with Ollama LLM Integration
 * Replaces mock responses with actual streaming LLM communication
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLLMStore } from '../../stores/llm-store';
import { OllamaChatMessage } from '../../services/ollama-service';
import { WorkflowGenerationDialog } from '../workflows/workflow-generation-dialog';
import { ChatTranscript, WorkflowTemplate } from '../../types/workflow-types';
import { AlertCircle, Bot, User, Loader2, StopCircle, Settings } from 'lucide-react';

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
  } = useLLMStore();  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, streamingMessage]);

  useEffect(() => {
    // Check health on component mount
    checkHealth();
  }, [checkHealth]);

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
    if (!message.trim() || isStreaming) return;

    if (!isConnected) {
      alert('Not connected to Ollama. Please check if Ollama is running and try again.');
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