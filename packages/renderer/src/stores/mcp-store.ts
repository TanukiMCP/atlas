/**
 * MCP Store - Zustand store for managing MCP server state
 * Handles server connections, status monitoring, and tool execution
 */

import { create } from 'zustand';
import { MCPServer, MCPServerStatus, MCPClient } from '../services/mcp-client';

interface MCPState {
  servers: MCPServer[];
  connectedServers: Set<string>;
  availableTools: any[];
  toolExecutionHistory: any[];
  isInitialized: boolean;
  lastHealthCheck: Date | null;
  
  addServer: (server: Omit<MCPServer, 'id' | 'status'>) => void;
  removeServer: (serverId: string) => void;
  updateServerStatus: (serverId: string, status: MCPServerStatus) => void;
  connectToServer: (serverId: string) => Promise<void>;
  disconnectFromServer: (serverId: string) => Promise<void>;
  refreshServerStatus: () => Promise<void>;
  refreshAvailableTools: () => Promise<void>;
  executeTool: (toolName: string, parameters: any) => Promise<any>;
  initialize: () => Promise<void>;
}

const mcpClient = new MCPClient();

export const useMCPStore = create<MCPState>((set, get) => ({
  servers: [],
  connectedServers: new Set(),
  availableTools: [],
  toolExecutionHistory: [],
  isInitialized: false,
  lastHealthCheck: null,

  addServer: (serverData) => {
    const newServer: MCPServer = {
      ...serverData,
      id: `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'disconnected'
    };
    
    set(state => ({
      servers: [...state.servers, newServer]
    }));
  },  removeServer: (serverId) => {
    const { disconnectFromServer } = get();
    disconnectFromServer(serverId);
    
    set(state => ({
      servers: state.servers.filter(s => s.id !== serverId),
      connectedServers: new Set([...state.connectedServers].filter(id => id !== serverId))
    }));
  },

  updateServerStatus: (serverId, status) => {
    set(state => ({
      servers: state.servers.map(server =>
        server.id === serverId ? { ...server, status } : server
      )
    }));
  },

  connectToServer: async (serverId) => {
    const { updateServerStatus } = get();
    const server = get().servers.find(s => s.id === serverId);
    
    if (!server) return;
    
    try {
      updateServerStatus(serverId, 'connecting');
      await mcpClient.connectToServer(server);
      
      set(state => ({
        connectedServers: new Set([...state.connectedServers, serverId])
      }));
      
      updateServerStatus(serverId, 'connected');
    } catch (error) {
      console.error('Failed to connect to server:', error);
      updateServerStatus(serverId, 'error');
    }
  },

  disconnectFromServer: async (serverId) => {
    const { updateServerStatus } = get();
    
    try {
      await mcpClient.disconnectFromServer(serverId);
      
      set(state => ({
        connectedServers: new Set([...state.connectedServers].filter(id => id !== serverId))
      }));
      
      updateServerStatus(serverId, 'disconnected');
    } catch (error) {
      console.error('Failed to disconnect from server:', error);
    }
  },

  refreshServerStatus: async () => {
    const { servers, updateServerStatus } = get();
    
    for (const server of servers) {
      try {
        const isConnected = await mcpClient.checkServerHealth(server.id);
        updateServerStatus(server.id, isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        updateServerStatus(server.id, 'error');
      }
    }
    
    set({ lastHealthCheck: new Date() });
  },  refreshAvailableTools: async () => {
    const { connectedServers } = get();
    const tools = [];
    
    for (const serverId of connectedServers) {
      try {
        const serverTools = await mcpClient.getAvailableTools(serverId);
        tools.push(...serverTools);
      } catch (error) {
        console.error(`Failed to get tools from server ${serverId}:`, error);
      }
    }
    
    set({ availableTools: tools });
  },

  executeTool: async (toolName, parameters) => {
    const { connectedServers } = get();
    
    for (const serverId of connectedServers) {
      try {
        const result = await mcpClient.executeTool(serverId, toolName, parameters);
        
        // Add to execution history
        set(state => ({
          toolExecutionHistory: [
            ...state.toolExecutionHistory,
            {
              id: `exec_${Date.now()}`,
              toolName,
              parameters,
              result,
              serverId,
              timestamp: new Date().toISOString()
            }
          ]
        }));
        
        return result;
      } catch (error) {
        console.error(`Failed to execute tool ${toolName} on server ${serverId}:`, error);
        continue;
      }
    }
    
    throw new Error(`Tool ${toolName} not available on any connected server`);
  },

  initialize: async () => {
    const { refreshServerStatus } = get();
    
    // Load default servers
    const defaultServers = mcpClient.getDefaultServers();
    set({ servers: defaultServers });
    
    // Check initial status
    await refreshServerStatus();
    
    set({ isInitialized: true });
  }
}));