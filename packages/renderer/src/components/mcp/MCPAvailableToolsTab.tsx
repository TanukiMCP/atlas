import React, { useEffect, useState } from 'react';
import { useMCPHubStore, ToolDefinition } from '../../stores/mcp-hub-store';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Loader2,
  AlertCircle,
  Puzzle,
  RefreshCw,
  SearchCode,
  Server,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center">
            <Puzzle className="w-5 h-5 mr-2 text-indigo-500" />
            {tool.name}
          </CardTitle>
          {tool.category && <Badge variant="outline">{tool.category}</Badge>}
        </div>
        <CardDescription className="text-xs pt-1">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-1 pb-3">
        <div className="flex items-center text-xs text-muted-foreground">
            <Server className="w-3 h-3 mr-1" /> Provided by: {tool.sourceServerName}
        </div>
        {tool.version && 
            <div className="text-xs text-muted-foreground">Version: {tool.version}</div>
        }
        {/* TODO: Display parameters if needed, or an action button */}
      </CardContent>
      {/* <CardFooter><Button size="sm" variant="ghost">Details</Button></CardFooter> */}
    </Card>
  );
};

export const MCPAvailableToolsTab: React.FC = () => {
  const {
    availableTools,
    isLoadingTools,
    error,
    fetchAllTools, // For manual refresh
    mcpServers, // To check if any servers are connected
  } = useMCPHubStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Tools are primarily fetched when servers connect via the store's logic.
    // A manual fetch here could be for an explicit refresh.
    // If no servers are connected, it might not fetch anything meaningful yet.
    if (mcpServers.some(s => s.status === 'connected')) {
        fetchAllTools();
    }
  }, [fetchAllTools, mcpServers]);

  const filteredTools = availableTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tool.category && tool.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tool.sourceServerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    if (mcpServers.some(s => s.status === 'connected')) {
        fetchAllTools();
    }
  }

  if (isLoadingTools && availableTools.length === 0) { // Show loading only if no tools are displayed yet
    return <div className="flex items-center justify-center p-4"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading available tools...</div>;
  }

  if (error && availableTools.length === 0) {
    return <div className="p-4 text-red-500"><AlertCircle className="w-5 h-5 mr-2 inline" />Error loading tools: {error}</div>;
  }
  
  const hasConnectedServers = mcpServers.some(s => s.status === 'connected');

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-background z-10 py-2 px-1">
        <Input 
          placeholder="Search tools by name, description, category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoadingTools || !hasConnectedServers}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingTools ? 'animate-spin' : ''}`} />
          Refresh Tools
        </Button>
      </div>

      {!hasConnectedServers && availableTools.length === 0 && (
         <div className="text-center text-muted-foreground py-8">
          <Puzzle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="font-semibold">No Tools Available</p>
          <p className="text-sm">Connect to an MCP server to see its available tools.</p>
        </div>
      )}

      {hasConnectedServers && filteredTools.length === 0 && !isLoadingTools && (
        <div className="text-center text-muted-foreground py-8">
          <SearchCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="font-semibold">No tools found matching "{searchTerm}"</p>
          <p className="text-sm">Try a different search term or check connected MCP servers.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}; 