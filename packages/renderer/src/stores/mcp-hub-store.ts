import { create } from 'zustand';

// Definitions based on docs/06-mcp-integration.md

export type MCPServerTransportType = 'stdio' | 'sse' | 'websocket';
export type MCPServerStatus = 'connected' | 'disconnected' | 'error' | 'unknown' | 'connecting';

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  transport: {
    type: MCPServerTransportType;
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    url?: string;
    headers?: Record<string, string>;
  };
  capabilities: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
    logging: boolean;
  };
  security: {
    sandboxed: boolean;
    allowedPaths: string[];
    blockedCommands: string[];
    maxExecutionTime: number;
    maxMemoryUsage: number;
  };
  status: MCPServerStatus;
  lastConnected?: Date;
  lastError?: string;
  isAutoRestart: boolean;
}

export interface ToolParameter {
  name: string;
  type: string; // e.g., 'string', 'number', 'boolean', 'array', 'object'
  description?: string;
  required?: boolean;
  defaultValue?: any;
}

export interface ToolDefinition {
  id: string; // Unique ID for the tool, perhaps serverId + toolName
  name: string;
  description: string;
  version?: string;
  parameters?: ToolParameter[];
  sourceServerId: string;
  sourceServerName: string; // For display purposes
  category?: string;
  // icon?: string; // Consider adding for UI
}

interface MCPHubState {
  mcpServers: MCPServerConfig[];
  availableTools: ToolDefinition[];
  isLoadingServers: boolean;
  isLoadingTools: boolean;
  error: string | null;

  // Server Actions
  addServer: (config: Omit<MCPServerConfig, 'id' | 'status'>) => Promise<void>;
  removeServer: (serverId: string) => Promise<void>;
  updateServerConfig: (serverId: string, config: Partial<Omit<MCPServerConfig, 'id' | 'status'>>) => Promise<void>;
  connectServer: (serverId: string) => Promise<void>;
  disconnectServer: (serverId: string) => Promise<void>;
  fetchServers: () => Promise<void>; // To load initial/persisted servers

  // Tool Actions
  fetchAllTools: () => Promise<void>; // Aggregates tools from all connected servers
}

export const useMCPHubStore = create<MCPHubState>((set, get) => ({
  mcpServers: [],
  availableTools: [],
  isLoadingServers: false,
  isLoadingTools: false,
  error: null,

  // Server Actions Implementation (initially mock/local state changes)
  fetchServers: async () => {
    set({ isLoadingServers: true, error: null });
    // Mock: In a real app, this would fetch from a backend or local persistence
    // For now, initialize with a sample server for UI development
    const sampleServer: MCPServerConfig = {
      id: 'sample-openrouter-mcp',
      name: 'OpenRouter MCP',
      description: 'MCP interface for OpenRouter models',
      status: 'connected',
      version: '1.0.0',
      transport: { type: 'websocket', url: 'http://localhost:11435' },
      capabilities: { tools: true, resources: false, prompts: false, logging: false },
      security: { sandboxed: true, allowedPaths: [], blockedCommands: [], maxExecutionTime: 30000, maxMemoryUsage: 512 },
      isAutoRestart: false,
    };
    setTimeout(() => { // Simulate async call
        set({ mcpServers: [sampleServer], isLoadingServers: false });
    }, 500);
  },

  addServer: async (config) => {
    set(state => {
      const newServer: MCPServerConfig = {
        ...config,
        id: `mcp_${Date.now()}`,
        status: 'disconnected', // Initial status
      };
      return { mcpServers: [...state.mcpServers, newServer], error: null };
    });
    // TODO: Persist or send to backend
  },

  removeServer: async (serverId) => {
    set(state => ({
      mcpServers: state.mcpServers.filter(s => s.id !== serverId),
      availableTools: state.availableTools.filter(t => t.sourceServerId !== serverId), // Remove tools from this server
      error: null,
    }));
    // TODO: Persist or send to backend
  },

  updateServerConfig: async (serverId, configUpdate) => {
    set(state => ({
      mcpServers: state.mcpServers.map(s => 
        s.id === serverId ? { ...s, ...configUpdate } : s
      ),
      error: null,
    }));
    // TODO: Persist or send to backend
  },

  connectServer: async (serverId) => {
    set(state => ({
      mcpServers: state.mcpServers.map(s => 
        s.id === serverId ? { ...s, status: 'connecting' } : s
      ),
      error: null,
    }));
    // Mock connection success/failure and tool loading
    setTimeout(() => {
      const server = get().mcpServers.find(s => s.id === serverId);
      if (server) {
        const success = Math.random() > 0.2; // Simulate 80% success rate
        set(state => ({
          mcpServers: state.mcpServers.map(s => 
            s.id === serverId ? { ...s, status: success ? 'connected' : 'error', lastError: success ? undefined : 'Failed to connect (mock)' } : s
          ),
        }));
        if (success) {
          get().fetchAllTools(); // Fetch tools if connected
        }
      }
    }, 1000);
  },

  disconnectServer: async (serverId) => {
    set(state => ({
      mcpServers: state.mcpServers.map(s => 
        s.id === serverId ? { ...s, status: 'disconnected' } : s
      ),
      availableTools: state.availableTools.filter(t => t.sourceServerId !== serverId), // Remove tools from this server
      error: null,
    }));
  },

  // Tool Actions Implementation
  fetchAllTools: async () => {
    set({ isLoadingTools: true, error: null });
    const connectedServers = get().mcpServers.filter(s => s.status === 'connected');
    let allTools: ToolDefinition[] = [];

    // Mock: In a real app, this would fetch tools for each connected server
    for (const server of connectedServers) {
      // Simulate fetching tools for this server
      if (server.id === 'sample-openrouter-mcp') {
        allTools.push(
          { 
            id: 'openrouter-mcp-summarize', name: 'Summarize Text', description: 'Summarizes long text using OpenRouter models.', 
            sourceServerId: server.id, sourceServerName: server.name, category: 'Text Processing',
            parameters: [{name: 'text', type: 'string', description: 'Text to summarize', required: true}]
          },
          { 
            id: 'openrouter-mcp-translate', name: 'Translate Text', description: 'Translates text using OpenRouter language models.', 
            sourceServerId: server.id, sourceServerName: server.name, category: 'Language',
            parameters: [
              {name: 'text', type: 'string', description: 'Text to translate', required: true},
              {name: 'target_language', type: 'string', description: 'Target language code (e.g., es, fr)', required: true}
            ]
          }
        );
      }
    }
    setTimeout(() => { // Simulate async call
        set({ availableTools: allTools, isLoadingTools: false });
    }, 500);
  },
})); 