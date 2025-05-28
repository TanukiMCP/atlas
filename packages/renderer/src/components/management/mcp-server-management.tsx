/**
 * MCP Server Management Component
 * Provides UI for managing MCP servers, their configuration, and health monitoring
 */

import React, { useState, useEffect } from 'react';
import { MCPServer, MCPServerStatus } from '../../services/mcp-client';
import { useMCPStore } from '../../stores/mcp-store';

interface MCPServerCardProps {
  server: MCPServer;
  onConnect: (serverId: string) => void;
  onDisconnect: (serverId: string) => void;
  onRemove: (serverId: string) => void;
  onConfigure: (serverId: string) => void;
}

const MCPServerCard: React.FC<MCPServerCardProps> = ({
  server,
  onConnect,
  onDisconnect,
  onRemove,
  onConfigure
}) => {
  const getStatusColor = (status: MCPServerStatus) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: MCPServerStatus) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {server.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusText(server.status)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Transport:</span>
          <span className="text-gray-900 dark:text-white">{server.transport.type}</span>
        </div>
        
        {server.transport.type === 'websocket' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">URL:</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">
              {server.transport.url}
            </span>
          </div>
        )}
        
        {server.transport.type === 'stdio' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Command:</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">
              {server.transport.command}
            </span>
          </div>
        )}

        {server.capabilities && server.capabilities.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Capabilities:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {server.capabilities.map((cap, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {server.status === 'connected' ? (
            <button
              onClick={() => onDisconnect(server.id)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => onConnect(server.id)}
              disabled={server.status === 'connecting'}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {server.status === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          )}
          
          <button
            onClick={() => onConfigure(server.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Configure
          </button>
        </div>

        <button
          onClick={() => onRemove(server.id)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

interface AddServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (server: Omit<MCPServer, 'id' | 'status'>) => void;
}

const AddServerDialog: React.FC<AddServerDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [transportType, setTransportType] = useState<'websocket' | 'stdio'>('websocket');
  const [url, setUrl] = useState('');
  const [command, setCommand] = useState('');
  const [args, setArgs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const server: Omit<MCPServer, 'id' | 'status'> = {
      name,
      description,
      transport: transportType === 'websocket' 
        ? { type: 'websocket', url }
        : { type: 'stdio', command, args: args.split(' ').filter(Boolean) },
      capabilities: []
    };

    onAdd(server);    
    // Reset form
    setName('');
    setDescription('');
    setUrl('');
    setCommand('');
    setArgs('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add MCP Server
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Server Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="My MCP Server"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Server description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transport Type
            </label>
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value as 'websocket' | 'stdio')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="websocket">WebSocket</option>
              <option value="stdio">Standard I/O</option>
            </select>
          </div>          {transportType === 'websocket' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                WebSocket URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="ws://localhost:8080"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Command
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="python server.py"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Arguments (space-separated)
                </label>
                <input
                  type="text"
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="--port 8080 --debug"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};export const MCPServerManagement: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  
  const {
    servers,
    addServer,
    removeServer,
    connectToServer,
    disconnectFromServer,
    refreshServerStatus
  } = useMCPStore();

  useEffect(() => {
    // Refresh server status on mount
    refreshServerStatus();
    
    // Set up periodic health checks
    const interval = setInterval(refreshServerStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [refreshServerStatus]);

  const handleAddServer = (serverData: Omit<MCPServer, 'id' | 'status'>) => {
    addServer(serverData);
  };

  const handleConnect = (serverId: string) => {
    connectToServer(serverId);
  };

  const handleDisconnect = (serverId: string) => {
    disconnectFromServer(serverId);
  };

  const handleRemove = (serverId: string) => {
    if (confirm('Are you sure you want to remove this server?')) {
      removeServer(serverId);
    }
  };

  const handleConfigure = (serverId: string) => {
    setSelectedServer(serverId);
    // TODO: Open configuration dialog
    console.log('Configure server:', serverId);
  };

  const connectedServers = servers.filter(s => s.status === 'connected');
  const disconnectedServers = servers.filter(s => s.status !== 'connected');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            MCP Server Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {connectedServers.length} connected, {disconnectedServers.length} disconnected
          </p>
        </div>        
        <div className="flex space-x-2">
          <button
            onClick={refreshServerStatus}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ➕ Add Server
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {servers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              🔌
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No MCP Servers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first MCP server to get started with tool integration.
            </p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Server
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedServers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">
                  Connected Servers ({connectedServers.length})
                </h3>
                <div className="space-y-3">
                  {connectedServers.map(server => (
                    <MCPServerCard
                      key={server.id}
                      server={server}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      onRemove={handleRemove}
                      onConfigure={handleConfigure}
                    />
                  ))}
                </div>
              </div>
            )}            {disconnectedServers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Disconnected Servers ({disconnectedServers.length})
                </h3>
                <div className="space-y-3">
                  {disconnectedServers.map(server => (
                    <MCPServerCard
                      key={server.id}
                      server={server}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      onRemove={handleRemove}
                      onConfigure={handleConfigure}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddServerDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddServer}
      />
    </div>
  );
};