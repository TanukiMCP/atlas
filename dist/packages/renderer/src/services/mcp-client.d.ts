/**
 * MCP Client - Real MCP protocol implementation for TanukiMCP Atlas
 * Handles WebSocket/HTTP communication with MCP servers
 */
export interface MCPServer {
    id: string;
    name: string;
    url: string;
    protocol: 'websocket' | 'http';
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastPing?: Date;
    error?: string;
    capabilities?: string[];
}
export interface MCPRequest {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: any;
}
export interface MCPResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface MCPNotification {
    jsonrpc: '2.0';
    method: string;
    params?: any;
}
declare class MCPClient {
    private servers;
    private connections;
    private requestId;
    private pendingRequests;
    constructor();
    private initializeDefaultServers;
    /**
     * Get all registered servers
     */
    getServers(): MCPServer[];
    /**
     * Add a new MCP server
     */
    addServer(server: Omit<MCPServer, 'id'>): string;
    /**
     * Remove a server
     */
    removeServer(serverId: string): boolean;
    /**
     * Connect to a server
     */
    connect(serverId: string): Promise<void>;
    /**
     * Disconnect from a server
     */
    disconnect(serverId: string): void;
    /**
     * Send a request to a server
     */
    sendRequest(serverId: string, method: string, params?: any): Promise<any>;
    private connectWebSocket;
    private handleMessage;
}
export declare const mcpClient: MCPClient;
export default mcpClient;
//# sourceMappingURL=mcp-client.d.ts.map