import React, { useState, useEffect } from 'react';
import { mcpService, MCPTool } from '../../services/mcp-service';

interface ToolSelectorProps {
  isOpen: boolean;
  position: { x: number; y: number };
  operationalMode: 'agent' | 'chat';
  onToolSelect: (tool: MCPTool) => void;
  onClose: () => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  isOpen,
  position,
  operationalMode,
  onToolSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [availableTools, setAvailableTools] = useState<MCPTool[]>([]);

  // Load tools from MCP service
  useEffect(() => {
    if (isOpen && mcpService.isReady()) {
      const tools = mcpService.getAvailableTools(operationalMode);
      setAvailableTools(tools);
    }
  }, [isOpen, operationalMode]);

  const filteredTools = searchQuery 
    ? mcpService.searchTools(searchQuery, operationalMode)
    : availableTools;

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredTools.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredTools[selectedIndex]) {
            onToolSelect(filteredTools[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onToolSelect, onClose]);

  if (!isOpen) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'file': return 'var(--color-accent-secondary)';
      case 'code': return 'var(--color-accent)';
      case 'web': return '#4CAF50';
      case 'task': return '#FF9800';
      case 'project': return '#9C27B0';
      case 'thinking': return '#607D8B';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '320px',
        maxWidth: '400px',
        maxHeight: '400px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)'
          }}>
            Tool Selection ({operationalMode} mode)
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)'
            }}
          >
            ×
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{
            width: '100%',
            fontSize: '13px',
            padding: '6px 10px'
          }}
          autoFocus
        />
      </div>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '8px'
      }}>
        {filteredTools.length === 0 ? (
          <div style={{
            padding: '16px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '13px'
          }}>
            No tools found matching "{searchQuery}"
          </div>
        ) : (
          filteredTools.map((tool, index) => (
            <div
              key={tool.name}
              onClick={() => onToolSelect(tool)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? 'var(--color-bg-tertiary)' : 'transparent',
                border: index === selectedIndex ? '1px solid var(--color-accent)' : '1px solid transparent',
                marginBottom: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '16px' }}>{tool.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px'
                  }}>
                    {tool.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.3'
                  }}>
                    {tool.description}
                  </div>
                </div>
                <div style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: getCategoryColor(tool.category),
                  color: 'white',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {tool.category}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        fontSize: '11px',
        color: 'var(--color-text-muted)'
      }}>
        Use ↑↓ arrows to navigate, Enter to select, Esc to close
      </div>
    </div>
  );
};