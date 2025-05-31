/**
 * ToolSelector component - Displays a dropdown of available tools
 * when the user types '@' in the chat input
 */

import React, { useState, useEffect, useRef } from 'react';
import MCPService from '../services/MCPService';
import { MCPTool } from '../types/index';
import { formatToolInvocation } from '../utils/parseToolInvocation';
import { Search, Wrench, ExternalLink } from 'lucide-react';

interface ToolSelectorProps {
  visible: boolean;
  position: { x: number; y: number } | null;
  onSelect: (toolName: string) => void;
  onClose: () => void;
  searchText: string;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  visible,
  position,
  onSelect,
  onClose,
  searchText
}) => {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [filteredTools, setFilteredTools] = useState<MCPTool[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Fetch available tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        // Use MCPService to get available tools
        const availableTools = MCPService.getAvailableTools();
        setTools(availableTools);
        setFilteredTools(availableTools);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError('Failed to load tools');
        setLoading(false);
      }
    };

    if (visible) {
      fetchTools();
    }
  }, [visible]);

  // Filter tools based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredTools(tools);
      return;
    }

    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    setFilteredTools(filtered);
    setSelectedIndex(0); // Reset selection when filter changes
  }, [searchText, tools]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredTools.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredTools[selectedIndex]) {
            onSelect(filteredTools[selectedIndex].name);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, filteredTools, selectedIndex, onSelect, onClose]);

  // Handle click outside
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, onClose]);

  if (!visible || !position) {
    return null;
  }

  // Calculate position to ensure it's always visible on screen
  const calculatePosition = () => {
    if (!position) return {};
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default dimensions for the selector
    const selectorWidth = 300;
    const selectorHeight = 350;
    
    // Calculate positions that keep the selector within viewport
    let left = position.x;
    let top = position.y;
    
    // Adjust if would go off right edge
    if (left + selectorWidth > viewportWidth) {
      left = Math.max(0, viewportWidth - selectorWidth - 10);
    }
    
    // Adjust if would go off bottom edge
    if (top + selectorHeight > viewportHeight) {
      top = Math.max(0, viewportHeight - selectorHeight - 10);
    }
    
    return { left, top };
  };

  const positionStyle = calculatePosition();

  return (
    <div
      ref={selectorRef}
      className="fixed z-[9999] bg-card border border-border rounded-lg shadow-lg overflow-hidden"
      style={{
        ...positionStyle,
        width: '300px',
        maxHeight: '350px',
      }}
      data-testid="tool-selector"
    >
      <div className="p-2 border-b border-border bg-muted/50 sticky top-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Available Tools {filteredTools.length > 0 && `(${filteredTools.length})`}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted"
          >
            ×
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchText}
            className="w-full pl-8 pr-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => {/* This should be handled by the parent component */}}
          />
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[270px]">
        {loading ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            Loading tools...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-sm text-destructive">
            {error}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            No tools found matching '{searchText}'
          </div>
        ) : (
          <div className="py-1">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.name}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === selectedIndex 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelect(tool.name)}
                data-index={index}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium">{tool.name}</span>
                  {tool.serverId && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {tool.serverName || tool.serverId}
                    </span>
                  )}
                </div>
                {tool.description && (
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-border bg-muted/30 text-xs text-muted-foreground flex justify-between items-center">
        <div>↑↓ to navigate</div>
        <div>↵ to select</div>
      </div>
    </div>
  );
};

export default ToolSelector; 