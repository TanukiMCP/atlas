/**
 * MCP Store - Zustand store for managing MCP server state
 * Handles server connections, status monitoring, and tool execution
 */

import { create } from 'zustand';
import { MCPServer, MCPServerStatus, MCPClient } from '../services/mcp-client';
import { MCPTool } from '../types';
import { persist } from 'zustand/middleware';

export interface MCPToolExecution {
  id: string;
  toolName: string;
  parameters: any;
  result: any;
  serverId: string;
  timestamp: string;
  success: boolean;
  error?: string;
  executionTime: number;
}

export interface InstalledMCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  path: string;
  installDate: string;
  lastStarted?: string;
  autoStart: boolean;
  status: 'installed' | 'running' | 'stopped' | 'error';
  error?: string;
  command?: string;
  port?: number;
}

interface MCPState {
  servers: MCPServer[];
  connectedServers: Set<string>;
  availableTools: MCPTool[];
  toolExecutionHistory: MCPToolExecution[];
  installedServers: InstalledMCPServer[];
  isInitialized: boolean;
  lastHealthCheck: Date | null;
  isToolDiscoveryRunning: boolean;
  
  // Server management
  addServer: (server: Omit<MCPServer, 'id' | 'status'>) => void;
  removeServer: (serverId: string) => void;
  updateServerStatus: (serverId: string, status: MCPServerStatus) => void;
  connectToServer: (serverId: string) => Promise<void>;
  disconnectFromServer: (serverId: string) => Promise<void>;
  refreshServerStatus: () => Promise<void>;
  
  // Tool management
  refreshAvailableTools: () => Promise<void>;
  executeTool: (toolName: string, parameters: any) => Promise<any>;
  getToolsByCategory: (category: string) => MCPTool[];
  searchTools: (query: string) => MCPTool[];
  
  // Installed server management
  addInstalledServer: (server: Omit<InstalledMCPServer, 'id'>) => string;
  removeInstalledServer: (serverId: string) => void;
  updateInstalledServer: (serverId: string, updates: Partial<InstalledMCPServer>) => void;
  startInstalledServer: (serverId: string) => Promise<void>;
  stopInstalledServer: (serverId: string) => Promise<void>;
  
  // Initialization
  initialize: () => Promise<void>;

  setServers: (servers: MCPServer[]) => void;
}

const mcpClient = new MCPClient();

export const useMCPStore = create<MCPState>()(
  persist(
    (set, get) => ({
      servers: [],
      connectedServers: new Set<string>(),
      availableTools: [],
      toolExecutionHistory: [],
      installedServers: [],
      isInitialized: false,
      lastHealthCheck: null,
      isToolDiscoveryRunning: false,

      addServer: (serverData) => {
        const newServer: MCPServer = {
          ...serverData,
          id: `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'disconnected'
        };
        
        set(state => ({
          servers: [...state.servers, newServer]
        }));
        
        return newServer.id;
      },
      
      removeServer: (serverId) => {
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
        const { updateServerStatus, refreshAvailableTools } = get();
        const server = get().servers.find(s => s.id === serverId);
        
        if (!server) return;
        
        try {
          updateServerStatus(serverId, 'connecting');
          await mcpClient.connectToServer(server);
          
          set(state => ({
            connectedServers: new Set([...state.connectedServers, serverId])
          }));
          
          updateServerStatus(serverId, 'connected');
          
          // Refresh available tools when a new server connects
          refreshAvailableTools();
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
          
          // Refresh available tools after a server disconnects
          get().refreshAvailableTools();
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
      },

      refreshAvailableTools: async () => {
        const { connectedServers } = get();
        
        // Don't run multiple discovery processes simultaneously
        if (get().isToolDiscoveryRunning) return;
        
        set({ isToolDiscoveryRunning: true });
        
        try {
          const tools: MCPTool[] = [];
          
          // Get tools from all connected servers
          for (const serverId of connectedServers) {
            try {
              const serverTools = await mcpClient.getAvailableTools(serverId);
              
              // Process tools to match our MCPTool interface
              const processedTools = serverTools.map((tool: any) => ({
                name: tool.name,
                description: tool.description || `Tool provided by ${get().servers.find(s => s.id === serverId)?.name || 'unknown server'}`,
                category: tool.category || 'other',
                icon: tool.icon || '🔧',
                operationalMode: tool.operationalMode || 'both',
                available: true,
                parameters: tool.parameters || [],
                serverId: serverId,
                serverName: get().servers.find(s => s.id === serverId)?.name || 'Unknown Server'
              }));
              
              tools.push(...processedTools);
            } catch (error) {
              console.error(`Failed to get tools from server ${serverId}:`, error);
            }
          }
          
          // Add built-in tools
          const builtInTools = [
            {
              name: 'file.system.operations',
              description: 'Core file system operations',
              category: 'file',
              icon: '📁',
              operationalMode: 'both',
              available: true,
              parameters: [
                { name: 'operation', type: 'string', description: 'Operation to perform', required: true },
                { name: 'path', type: 'string', description: 'File path', required: true },
                { name: 'content', type: 'string', description: 'File content (for write operations)', required: false }
              ],
              serverId: 'built-in',
              serverName: 'Atlas Built-in Tools'
            },
            {
              name: 'terminal.command',
              description: 'Execute terminal commands',
              category: 'task',
              icon: '⚡',
              operationalMode: 'both',
              available: true,
              parameters: [
                { name: 'command', type: 'string', description: 'Command to execute', required: true },
                { name: 'cwd', type: 'string', description: 'Working directory', required: false }
              ],
              serverId: 'built-in',
              serverName: 'Atlas Built-in Tools'
            }
          ];
          
          tools.push(...builtInTools);
          
          // Update the store with the combined tools
          set({ availableTools: tools });
        } finally {
          set({ isToolDiscoveryRunning: false });
        }
      },

      executeTool: async (toolName, parameters) => {
        const { connectedServers, toolExecutionHistory } = get();
        const startTime = Date.now();
        
        // Handle built-in tools
        if (toolName === 'file.system.operations') {
          try {
            // Implementation for file system operations
            const result = await window.electronAPI.invoke('fs:operation', {
              operation: parameters.operation,
              path: parameters.path,
              content: parameters.content
            });
            
            const execution: MCPToolExecution = {
              id: `exec_${Date.now()}`,
              toolName,
              parameters,
              result,
              serverId: 'built-in',
              timestamp: new Date().toISOString(),
              success: true,
              executionTime: Date.now() - startTime
            };
            
            set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
            return result;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            const execution: MCPToolExecution = {
              id: `exec_${Date.now()}`,
              toolName,
              parameters,
              result: null,
              serverId: 'built-in',
              timestamp: new Date().toISOString(),
              success: false,
              error: errorMessage,
              executionTime: Date.now() - startTime
            };
            
            set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
            throw error;
          }
        }
        
        if (toolName === 'terminal.command') {
          try {
            // Implementation for terminal commands
            const result = await window.electronAPI.invoke('terminal:execute', {
              command: parameters.command,
              cwd: parameters.cwd
            });
            
            const execution: MCPToolExecution = {
              id: `exec_${Date.now()}`,
              toolName,
              parameters,
              result,
              serverId: 'built-in',
              timestamp: new Date().toISOString(),
              success: true,
              executionTime: Date.now() - startTime
            };
            
            set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
            return result;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            const execution: MCPToolExecution = {
              id: `exec_${Date.now()}`,
              toolName,
              parameters,
              result: null,
              serverId: 'built-in',
              timestamp: new Date().toISOString(),
              success: false,
              error: errorMessage,
              executionTime: Date.now() - startTime
            };
            
            set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
            throw error;
          }
        }
        
        // Find which server provides this tool
        const tool = get().availableTools.find(t => t.name === toolName);
        if (!tool) {
          const execution: MCPToolExecution = {
            id: `exec_${Date.now()}`,
            toolName,
            parameters,
            result: null,
            serverId: 'unknown',
            timestamp: new Date().toISOString(),
            success: false,
            error: `Tool ${toolName} not found`,
            executionTime: Date.now() - startTime
          };
          
          set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
          throw new Error(`Tool ${toolName} not available`);
        }
        
        // Execute on the specific server that provides the tool
        try {
          const result = await mcpClient.executeTool(tool.serverId, toolName, parameters);
          
          const execution: MCPToolExecution = {
            id: `exec_${Date.now()}`,
            toolName,
            parameters,
            result,
            serverId: tool.serverId,
            timestamp: new Date().toISOString(),
            success: true,
            executionTime: Date.now() - startTime
          };
          
          set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          const execution: MCPToolExecution = {
            id: `exec_${Date.now()}`,
            toolName,
            parameters,
            result: null,
            serverId: tool.serverId,
            timestamp: new Date().toISOString(),
            success: false,
            error: errorMessage,
            executionTime: Date.now() - startTime
          };
          
          set({ toolExecutionHistory: [execution, ...toolExecutionHistory].slice(0, 100) });
          throw error;
        }
      },
      
      getToolsByCategory: (category) => {
        return get().availableTools.filter(tool => tool.category === category);
      },
      
      searchTools: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().availableTools.filter(tool => 
          tool.name.toLowerCase().includes(lowerQuery) || 
          tool.description.toLowerCase().includes(lowerQuery)
        );
      },
      
      addInstalledServer: (server) => {
        const id = `installed_${Date.now()}`;
        const newServer: InstalledMCPServer = {
          ...server,
          id
        };
        
        set(state => ({
          installedServers: [...state.installedServers, newServer]
        }));
        
        return id;
      },
      
      removeInstalledServer: (serverId) => {
        set(state => ({
          installedServers: state.installedServers.filter(s => s.id !== serverId)
        }));
      },
      
      updateInstalledServer: (serverId, updates) => {
        set(state => ({
          installedServers: state.installedServers.map(server =>
            server.id === serverId ? { ...server, ...updates } : server
          )
        }));
      },
      
      startInstalledServer: async (serverId) => {
        const server = get().installedServers.find(s => s.id === serverId);
        if (!server || !server.command) return;
        
        try {
          // Start the server process
          await window.electronAPI.invoke('process:start', {
            command: server.command,
            cwd: server.path
          });
          
          // Update server status
          get().updateInstalledServer(serverId, { 
            status: 'running', 
            lastStarted: new Date().toISOString() 
          });
          
          // Try to connect to the server
          if (server.port) {
            const serverUrl = `ws://localhost:${server.port}`;
            const newServerId = get().addServer({
              name: server.name,
              url: serverUrl,
              protocol: 'websocket',
              capabilities: []
            });
            
            // Wait a bit for the server to start
            setTimeout(() => {
              get().connectToServer(newServerId);
            }, 2000);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          get().updateInstalledServer(serverId, { 
            status: 'error', 
            error: errorMessage 
          });
        }
      },
      
      stopInstalledServer: async (serverId) => {
        const server = get().installedServers.find(s => s.id === serverId);
        if (!server) return;
        
        try {
          // Find the connected server with matching port
          if (server.port) {
            const serverUrl = `ws://localhost:${server.port}`;
            const connectedServer = get().servers.find(s => s.url === serverUrl);
            
            if (connectedServer) {
              await get().disconnectFromServer(connectedServer.id);
              get().removeServer(connectedServer.id);
            }
          }
          
          // Stop the server process
          await window.electronAPI.invoke('process:stop', { serverId });
          
          // Update server status
          get().updateInstalledServer(serverId, { status: 'stopped' });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          get().updateInstalledServer(serverId, { 
            status: 'error', 
            error: errorMessage 
          });
        }
      },

      initialize: async () => {
        const { refreshServerStatus, refreshAvailableTools } = get();
        
        // Initialize default servers from MCP client
        const defaultServers = mcpClient.getDefaultServers();
        
        set(state => ({
          servers: [
            ...state.servers,
            ...defaultServers.filter(ds => 
              !state.servers.some(s => s.url === ds.url)
            )
          ]
        }));
        
        // Check initial status
        await refreshServerStatus();
        
        // Auto-connect to servers
        const serversToConnect = get().servers.filter(
          server => server.status === 'disconnected'
        );
        
        for (const server of serversToConnect) {
          try {
            await get().connectToServer(server.id);
          } catch (error) {
            console.error(`Failed to auto-connect to server ${server.name}:`, error);
          }
        }
        
        // Refresh available tools
        await refreshAvailableTools();
        
        set({ isInitialized: true });
      },

      setServers: (servers: MCPServer[]) => {
        set({ servers });
      }
    }),
    {
      name: 'mcp-store',
      // Only persist certain parts of the state
      partialize: (state) => ({
        installedServers: state.installedServers,
        toolExecutionHistory: state.toolExecutionHistory.slice(0, 20)
      })
    }
  )
);