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

class MCPClient {
  private servers: Map<string, MCPServer> = new Map();
  private connections: Map<string, WebSocket | null> = new Map();
  private requestId = 0;
  
  private pendingRequests: Map<string | number, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = new Map();

  constructor() {
    this.initializeDefaultServers();
  }

  private initializeDefaultServers() {
    // Add default MCP servers that might be available
    const defaultServers: Omit<MCPServer, 'id'>[] = [
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
  getServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  /**
   * Add a new MCP server
   */
  addServer(server: Omit<MCPServer, 'id'>): string {
    const id = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.servers.set(id, { ...server, id });
    return id;
  }

  /**
   * Remove a server
   */
  removeServer(serverId: string): boolean {
    this.disconnect(serverId);
    return this.servers.delete(serverId);
  }

  /**
   * Connect to a server
   */
  async connect(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server ${serverId} not found`);
    }

    if (server.protocol === 'websocket') {
      return this.connectWebSocket(serverId);
    } else {
      throw new Error(`Protocol ${server.protocol} not yet implemented`);
    }
  }

  /**
   * Disconnect from a server
   */
  disconnect(serverId: string): void {
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
  async sendRequest(serverId: string, method: string, params?: any): Promise<any> {
    const connection = this.connections.get(serverId);
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      throw new Error(`Not connected to server ${serverId}`);
    }

    const id = ++this.requestId;
    const request: MCPRequest = {
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

  private async connectWebSocket(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (!server) return;

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

      } catch (error) {
        server.status = 'error';
        server.error = error instanceof Error ? error.message : 'Unknown error';
        this.servers.set(serverId, server);
        reject(error);
      }
    });
  }

  private handleMessage(serverId: string, data: string): void {
    try {
      const message = JSON.parse(data);
      
      if ('id' in message && this.pendingRequests.has(message.id)) {
        const pending = this.pendingRequests.get(message.id)!;
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);
        
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
      }
    } catch (error) {
      console.error('Failed to parse MCP message:', error);
    }
  }
}

// Export singleton instance
export const mcpClient = new MCPClient();
export default mcpClient;