/**
 * ToolSelector component - Displays a dropdown of available tools
 * when the user types '@' in the chat input
 */

import React, { useState, useEffect, useRef } from 'react';
import MCPService from '../services/MCPService';
import { MCPTool } from '../types/index';
import { formatToolInvocation } from '../utils/parseToolInvocation';

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
  const selectorRef = useRef<HTMLDivElement>(null);

  // Fetch available tools
  useEffect(() => {
    setTools(MCPService.getAvailableTools());
  }, []);

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

  // Scroll selected item into view
  useEffect(() => {
    if (visible && selectorRef.current) {
      const selectedElement = selectorRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, visible]);

  if (!visible || !position) return null;

  return (
    <div
      ref={selectorRef}
      className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: '300px',
        maxHeight: '350px'
      }}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available Tools {filteredTools.length > 0 && `(${filteredTools.length})`}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Select a tool or continue typing to filter
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[300px]">
        {filteredTools.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No tools match your search
          </div>
        ) : (
          <ul className="py-1">
            {filteredTools.map((tool, index) => (
              <li
                key={tool.name}
                data-index={index}
                className={`px-3 py-2 cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
                onClick={() => onSelect(tool.name)}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{tool.icon || '🔧'}</span>
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    {tool.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ToolSelector; 