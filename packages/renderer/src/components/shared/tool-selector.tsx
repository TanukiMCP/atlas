import React, { useState, useEffect } from 'react';
import { mcpService, MCPTool } from '../../services/mcp-service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { X, Search, Zap } from 'lucide-react';

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
    ? availableTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTools;

  const getCategoryColor = (category: string) => {
    const colors = {
      'file': 'bg-blue-100 text-blue-800',
      'web': 'bg-green-100 text-green-800', 
      'data': 'bg-purple-100 text-purple-800',
      'ai': 'bg-orange-100 text-orange-800',
      'system': 'bg-gray-100 text-gray-800',
      'thinking': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      <Card className="w-80 max-h-96 shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Tool Selection ({operationalMode} mode)
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64">
            <div className="p-3 space-y-2">
              {filteredTools.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {searchQuery ? `No tools found matching "${searchQuery}"` : 'No tools available'}
                </div>
              ) : (
                filteredTools.map((tool, index) => (
                  <div
                    key={tool.name}
                    onClick={() => onToolSelect(tool)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      index === selectedIndex 
                        ? 'bg-accent border-accent-foreground/20' 
                        : 'hover:bg-muted border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Zap className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {tool.name}
                          </span>
                          {tool.category && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-1.5 py-0.5 ${getCategoryColor(tool.category)}`}
                            >
                              {tool.category}
                            </Badge>
                          )}
                        </div>
                        {tool.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {tool.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t bg-muted/30 px-3 py-2">
            <p className="text-xs text-muted-foreground text-center">
              Click to select • {filteredTools.length} tools available
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};