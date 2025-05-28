"use strict";
/**
 * MCP Client - Real MCP protocol implementation for TanukiMCP Atlas
 * Handles WebSocket/HTTP communication with MCP servers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpClient = void 0;
class MCPClient {
    servers = new Map();
    connections = new Map();
    requestId = 0;
    pendingRequests = new Map();
    constructor() {
        this.initializeDefaultServers();
    }
    initializeDefaultServers() {
        // Add default MCP servers that might be available
        const defaultServers = [
            {
                name: 'Desktop Commander',
                url: 'ws://localhost:8765',
                protocol: 'websocket',
                status: 'disconnected',
                capabilities: ['file_operations', 'command_execution', 'search']
            },
            {
                name: 'Clear Thought',
                url: 'ws://localhost:8766',
                protocol: 'websocket',
                status: 'disconnected',
                capabilities: ['thinking', 'reasoning', 'analysis']
            },
            {
                name: 'Puppeteer',
                url: 'ws://localhost:8767',
                protocol: 'websocket',
                status: 'disconnected',
                capabilities: ['web_automation', 'screenshots', 'navigation']
            }
        ];
        defaultServers.forEach(server => {
            const id = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.servers.set(id, { ...server, id });
        });
    }
    /**
     * Get all registered servers
     */
    getServers() {
        return Array.from(this.servers.values());
    }
    /**
     * Add a new MCP server
     */
    addServer(server) {
        const id = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.servers.set(id, { ...server, id });
        return id;
    }
    /**
     * Remove a server
     */
    removeServer(serverId) {
        this.disconnect(serverId);
        return this.servers.delete(serverId);
    }
    /**
     * Connect to a server
     */
    async connect(serverId) {
        const server = this.servers.get(serverId);
        if (!server) {
            throw new Error(`Server ${serverId} not found`);
        }
        if (server.protocol === 'websocket') {
            return this.connectWebSocket(serverId);
        }
        else {
            throw new Error(`Protocol ${server.protocol} not yet implemented`);
        }
    }
    /**
     * Disconnect from a server
     */
    disconnect(serverId) {
        const connection = this.connections.get(serverId);
        if (connection) {
            connection.close();
            this.connections.delete(serverId);
        }
        const server = this.servers.get(serverId);
        if (server) {
            server.status = 'disconnected';
            this.servers.set(serverId, server);
        }
    }
    /**
     * Send a request to a server
     */
    async sendRequest(serverId, method, params) {
        const connection = this.connections.get(serverId);
        if (!connection || connection.readyState !== WebSocket.OPEN) {
            throw new Error(`Not connected to server ${serverId}`);
        }
        const id = ++this.requestId;
        const request = {
            jsonrpc: '2.0',
            id,
            method,
            params
        };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(id);
                reject(new Error('Request timeout'));
            }, 30000);
            this.pendingRequests.set(id, { resolve, reject, timeout });
            connection.send(JSON.stringify(request));
        });
    }
    async connectWebSocket(serverId) {
        const server = this.servers.get(serverId);
        if (!server)
            return;
        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(server.url);
                ws.onopen = () => {
                    server.status = 'connected';
                    server.lastPing = new Date();
                    this.servers.set(serverId, server);
                    this.connections.set(serverId, ws);
                    resolve();
                };
                ws.onerror = (error) => {
                    server.status = 'error';
                    server.error = 'Connection failed';
                    this.servers.set(serverId, server);
                    reject(new Error('WebSocket connection failed'));
                };
                ws.onclose = () => {
                    server.status = 'disconnected';
                    this.servers.set(serverId, server);
                    this.connections.delete(serverId);
                };
                ws.onmessage = (event) => {
                    this.handleMessage(serverId, event.data);
                };
            }
            catch (error) {
                server.status = 'error';
                server.error = error instanceof Error ? error.message : 'Unknown error';
                this.servers.set(serverId, server);
                reject(error);
            }
        });
    }
    handleMessage(serverId, data) {
        try {
            const message = JSON.parse(data);
            if ('id' in message && this.pendingRequests.has(message.id)) {
                const pending = this.pendingRequests.get(message.id);
                clearTimeout(pending.timeout);
                this.pendingRequests.delete(message.id);
                if (message.error) {
                    pending.reject(new Error(message.error.message));
                }
                else {
                    pending.resolve(message.result);
                }
            }
        }
        catch (error) {
            console.error('Failed to parse MCP message:', error);
        }
    }
}
// Export singleton instance
exports.mcpClient = new MCPClient();
exports.default = exports.mcpClient;
//# sourceMappingURL=mcp-client.js.map