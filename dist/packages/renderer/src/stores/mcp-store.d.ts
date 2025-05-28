/**
 * MCP Store - Zustand store for managing MCP server state
 * Handles server connections, status monitoring, and tool execution
 */
import { MCPServer, MCPServerStatus } from '../services/mcp-client';
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
export declare const useMCPStore: import("zustand").UseBoundStore<import("zustand").StoreApi<MCPState>>;
export {};
//# sourceMappingURL=mcp-store.d.ts.map