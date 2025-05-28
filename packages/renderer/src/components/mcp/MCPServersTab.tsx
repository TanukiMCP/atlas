import React, { useEffect, useState } from 'react';
import { useMCPHubStore, MCPServerConfig, MCPServerStatus } from '../../stores/mcp-hub-store';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  PlusCircle,
  Trash2,
  Edit3,
  Power,
  PowerOff,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronRight,
  Settings2,
  Terminal,
  Globe,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Helper to get status color and icon
const getStatusIndicator = (status: MCPServerStatus) => {
  switch (status) {
    case 'connected':
      return { color: 'text-green-500', icon: <Power className="w-4 h-4" />, label: 'Connected' };
    case 'disconnected':
      return { color: 'text-gray-500', icon: <PowerOff className="w-4 h-4" />, label: 'Disconnected' };
    case 'connecting':
      return { color: 'text-blue-500', icon: <Loader2 className="w-4 h-4 animate-spin" />, label: 'Connecting' };
    case 'error':
      return { color: 'text-red-500', icon: <AlertCircle className="w-4 h-4" />, label: 'Error' };
    default:
      return { color: 'text-yellow-500', icon: <AlertCircle className="w-4 h-4" />, label: 'Unknown' };
  }
};

const MCPServerCard: React.FC<{ server: MCPServerConfig }> = ({ server }) => {
  const { connectServer, disconnectServer, removeServer } = useMCPHubStore();
  const statusInfo = getStatusIndicator(server.status);

  const handleConnect = () => connectServer(server.id);
  const handleDisconnect = () => disconnectServer(server.id);
  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove server "${server.name}"?`)) {
      removeServer(server.id);
    }
  };

  // TODO: Implement Edit functionality with a dialog

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {server.transport.type === 'stdio' ? (
                <Terminal className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
                <Globe className="w-5 h-5 mr-2 text-green-500" />
            )}
            {server.name}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={server.status === 'connected' ? 'default' : server.status === 'error' ? 'destructive' : 'secondary'} className={cn("capitalize", statusInfo.color)}>
                  {React.cloneElement(statusInfo.icon, { className: cn("w-3 h-3 mr-1", statusInfo.icon.props.className) })}
                  {statusInfo.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{server.status === 'error' && server.lastError ? server.lastError : `Status: ${server.status}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="text-xs pt-1">
          {server.description} (v{server.version})
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2 pb-3">
        <div>
          <strong>Transport:</strong> {server.transport.type}
          {server.transport.url && <span className="ml-2 text-muted-foreground text-xs">({server.transport.url})</span>}
          {server.transport.command && <span className="ml-2 text-muted-foreground text-xs">({server.transport.command})</span>}
        </div>
        {/* Add more details like capabilities if needed */}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {/* TODO: Implement Edit Button with DialogTrigger */}
        <Button variant="outline" size="sm" onClick={handleRemove} className="text-red-600 hover:text-red-700 hover:border-red-600">
          <Trash2 className="w-3 h-3 mr-1" /> Remove
        </Button>
        {server.status === 'connected' ? (
          <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={server.status === 'connecting'}>
            <PowerOff className="w-3 h-3 mr-1" /> Disconnect
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handleConnect} disabled={server.status === 'connecting' || server.status === 'connected'} className="bg-green-600 hover:bg-green-700">
            {server.status === 'connecting' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Power className="w-3 h-3 mr-1" />}
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// TODO: Create MCPServerForm component for Add/Edit Dialog

export const MCPServersTab: React.FC = () => {
  const {
    mcpServers,
    isLoadingServers,
    error,
    fetchServers,
    // addServer, // Will be used by the dialog form
  } = useMCPHubStore();

  useEffect(() => {
    fetchServers(); // Load servers on initial mount
  }, [fetchServers]);

  if (isLoadingServers) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading servers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500"><AlertCircle className="w-5 h-5 mr-2 inline" />Error loading servers: {error}</div>;
  }

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Managed MCP Servers</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchServers} disabled={isLoadingServers}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingServers ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* TODO: Implement Add Server DialogTrigger */}
          <Button variant="default" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Server
          </Button>
        </div>
      </div>

      {mcpServers.length === 0 && !isLoadingServers && (
        <div className="text-center text-muted-foreground py-8">
          <Settings2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="font-semibold">No MCP Servers Configured</p>
          <p className="text-sm">Click "Add Server" to connect to an MCP instance.</p>
        </div>
      )}

      <div>
        {mcpServers.map(server => (
          <MCPServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
}; 