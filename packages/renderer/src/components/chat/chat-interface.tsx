import React, { useState, useImperativeHandle, forwardRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onAtSymbolTrigger?: (event: React.KeyboardEvent, position: { x: number; y: number }) => void;
  operationalMode?: 'agent' | 'chat';
}

export interface ChatInterfaceHandle {
  insertText: (text: string) => void;
}

export const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(
  ({ onAtSymbolTrigger, operationalMode = 'agent' }, ref) => {
    const [message, setMessage] = useState('');
    useImperativeHandle(ref, () => ({
      insertText: (text: string) => setMessage(prev => prev + text),
    }));
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: '1',
        type: 'assistant',
        content: 'Welcome to TanukiMCP Atlas! I\'m here to help you with AI-driven WordPress automation, development workflows, and intelligent tooling. How can I assist you today?',
        timestamp: new Date()
      }
    ]);

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

    const handleSendMessage = () => {
      if (message.trim()) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message.trim(),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        
        // Simulate assistant response based on operational mode
        setTimeout(() => {
          const response: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: operationalMode === 'agent' 
              ? `I'm in Agent Mode and can help you with file operations, code execution, and complex workflows. You asked: "${newMessage.content}"`
              : `I'm in Chat Mode and can help with analysis, research, and conversational assistance. You asked: "${newMessage.content}"`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, response]);
        }, 1000);
      }
    };

    return (
      <div className="chat-interface">
        <div className="chat-messages custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              <div style={{ 
                background: msg.type === 'assistant' 
                  ? 'linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary))'
                  : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                marginLeft: msg.type === 'user' ? '20%' : '0',
                marginRight: msg.type === 'assistant' ? '20%' : '0'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: msg.type === 'assistant' 
                      ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))'
                      : 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-secondary-hover))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    {msg.type === 'assistant' ? '🦝' : '👤'}
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '13px',
                    color: msg.type === 'assistant' ? 'var(--color-text-primary)' : 'white'
                  }}>
                    {msg.type === 'assistant' ? `TanukiMCP Assistant (${operationalMode})` : 'You'}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: msg.type === 'assistant' ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.7)',
                    marginLeft: 'auto'
                  }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '14px',
                  color: msg.type === 'assistant' ? 'var(--color-text-secondary)' : 'white',
                  lineHeight: '1.5'
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-area">
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'flex-end',
            padding: '4px 0'
          }}>
            <div style={{
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: operationalMode === 'agent' ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '500'
            }}>
              {operationalMode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode'}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={operationalMode === 'agent' 
                ? "Type your message... (use @ for tools, I can execute actions)"
                : "Type your message... (conversational mode, thinking tools only)"}
              className="input"
              style={{ flex: 1 }}
            />
            <button 
              className="btn btn-primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
);