import { BaseTransport } from './base-transport';
import { WebSocketTransportConfig } from '../types';

// Define WebSocket interface for Node.js environment
interface WebSocket {
  readyState: number;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

declare const WebSocket: {
  new (url: string, protocols?: string[]): WebSocket;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
};

export class WebSocketTransport extends BaseTransport {
  private webSocket?: WebSocket;
  private pingInterval?: NodeJS.Timeout;
  private pongTimeout?: NodeJS.Timeout;

  constructor(config: WebSocketTransportConfig) {
    super(config);
  }

  async connect(): Promise<void> {
    if (this.connected || this.webSocket) {
      await this.disconnect();
    }

    const config = this.config as WebSocketTransportConfig;
    
    try {
      this.webSocket = new WebSocket(config.url, config.protocols);
      
      this.setupWebSocketHandlers();

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.webSocket!.addEventListener('open', () => {
          clearTimeout(timeout);
          this.handleConnect();
          this.startHeartbeat();
          resolve();
        });

        this.webSocket!.addEventListener('error', (event: any) => {
          clearTimeout(timeout);
          reject(new Error(`WebSocket connection failed: ${event.message || 'Unknown error'}`));
        });
      });

    } catch (error) {
      throw new Error(`Failed to connect to MCP server via WebSocket: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.stopHeartbeat();

    if (this.webSocket) {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.close(1000, 'Normal closure');
      }
      this.webSocket = undefined;
    }

    this.handleDisconnect();
  }

  async send(message: any): Promise<void> {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const jsonMessage = JSON.stringify(message);
    this.webSocket.send(jsonMessage);
  }

  private setupWebSocketHandlers(): void {
    if (!this.webSocket) return;

    this.webSocket.addEventListener('message', (event: any) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle heartbeat responses
        if (message.method === 'pong') {
          this.handlePong();
          return;
        }

        this.handleMessage(message);
      } catch (error) {
        console.warn('Failed to parse WebSocket message:', event.data, error);
      }
    });

    this.webSocket.addEventListener('close', (event: any) => {
      console.log(`WebSocket closed: ${event.code} ${event.reason}`);
      this.handleDisconnect();
      
      // Auto-reconnect on unexpected closure
      if (event.code !== 1000 && event.code !== 1001) {
        this.scheduleReconnect();
      }
    });

    this.webSocket.addEventListener('error', (event: any) => {
      console.error('WebSocket error:', event);
      this.handleError(new Error(`WebSocket error: ${event.message || 'Unknown error'}`));
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    // Send ping every 30 seconds
    this.pingInterval = setInterval(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.send({ method: 'ping', id: Date.now() });
        
        // Set timeout for pong response
        this.pongTimeout = setTimeout(() => {
          console.warn('WebSocket ping timeout - reconnecting');
          this.scheduleReconnect();
        }, 10000);
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
    
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = undefined;
    }
  }

  private handlePong(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = undefined;
    }
  }

  destroy(): void {
    this.stopHeartbeat();
    this.disconnect();
    super.destroy();
  }
} 