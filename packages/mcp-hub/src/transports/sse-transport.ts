import { BaseTransport } from './base-transport';
import { SSETransportConfig } from '../types';

// Define EventSource interface for Node.js environment
interface EventSource {
  addEventListener(type: string, listener: (event: any) => void): void;
  close(): void;
}

declare const EventSource: {
  new (url: string): EventSource;
};

export class SSETransport extends BaseTransport {
  private eventSource?: EventSource;
  private sessionId?: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: SSETransportConfig) {
    super(config);
    this.baseUrl = config.url;
    this.headers = config.headers || {};
  }

  async connect(): Promise<void> {
    if (this.connected || this.eventSource) {
      await this.disconnect();
    }

    const config = this.config as SSETransportConfig;
    
    try {
      // First, establish a session with the server
      const response = await fetch(`${this.baseUrl}/sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify({
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: true,
              resources: true,
              prompts: true
            },
            clientInfo: {
              name: 'TanukiMCP Atlas',
              version: '1.0.0'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const initResult = await response.json() as { sessionId: string };
      this.sessionId = initResult.sessionId;

      // Set up EventSource for receiving messages
      const sseUrl = `${this.baseUrl}/sse/${this.sessionId}`;
      this.eventSource = new EventSource(sseUrl);

      this.setupEventSourceHandlers();

      // Wait for connection confirmation
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('SSE connection timeout'));
        }, config.timeout || 10000);

        this.eventSource!.addEventListener('open', () => {
          clearTimeout(timeout);
          this.handleConnect();
          resolve();
        });

        this.eventSource!.addEventListener('error', (event) => {
          clearTimeout(timeout);
          reject(new Error('SSE connection failed'));
        });
      });

    } catch (error) {
      throw new Error(`Failed to connect to MCP server via SSE: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    if (this.sessionId) {
      // Notify server of disconnection
      try {
        await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
          method: 'DELETE',
          headers: this.headers
        });
      } catch (error) {
        console.warn('Failed to notify server of disconnection:', error);
      }
      this.sessionId = undefined;
    }

    this.handleDisconnect();
  }

  async send(message: any): Promise<void> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Transport not connected');
    }

    const response = await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // For SSE, we don't return the response here as it will come via EventSource
  }

  private setupEventSourceHandlers(): void {
    if (!this.eventSource) return;

    this.eventSource.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.warn('Failed to parse SSE message:', event.data, error);
      }
    });

    this.eventSource.addEventListener('error', (event) => {
      console.error('SSE connection error:', event);
      this.handleError(new Error('SSE connection error'));
      
      // Auto-reconnect
      this.scheduleReconnect();
    });

    // Handle custom event types
    this.eventSource.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        this.handleMessage(notification);
      } catch (error) {
        console.warn('Failed to parse SSE notification:', event.data, error);
      }
    });

    this.eventSource.addEventListener('progress', (event) => {
      try {
        const progress = JSON.parse(event.data);
        this.handleMessage(progress);
      } catch (error) {
        console.warn('Failed to parse SSE progress:', event.data, error);
      }
    });
  }

  destroy(): void {
    this.disconnect();
    super.destroy();
  }
} 