import React from 'react';
import { RealChatInterface } from './chat/real-chat-interface';
import { ErrorBoundary } from './ErrorBoundary';

interface ChatProps {
  isConnected?: boolean;
  currentModel?: string;
  operationalMode?: 'agent' | 'chat';
  onMaximize?: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

const Chat: React.FC<ChatProps> = (props) => {
  return (
    <ErrorBoundary>
      <RealChatInterface />
    </ErrorBoundary>
  );
};

export default Chat; 