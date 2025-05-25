import { EventEmitter } from 'events';
import { TransportConfig } from '../types';

export interface TransportEvents {
  'connect': () => void;
  'disconnect': () => void;
  'message': (message: any) => void;
  'error': (error: Error) => void;
}

export abstract class BaseTransport extends EventEmitter {
  protected config: TransportConfig;
  protected connected: boolean = false;
  protected reconnectTimer?: NodeJS.Timeout;
  protected connectionId?: string;

  constructor(config: TransportConfig) {
    super();
    this.config = config;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract send(message: any): Promise<void>;

  isConnected(): boolean {
    return this.connected;
  }

  getConfig(): TransportConfig {
    return this.config;
  }

  protected handleConnect(): void {
    this.connected = true;
    this.emit('connect');
  }

  protected handleDisconnect(): void {
    this.connected = false;
    this.emit('disconnect');
  }

  protected handleMessage(message: any): void {
    this.emit('message', message);
  }

  protected handleError(error: Error): void {
    this.emit('error', error);
  }

  protected scheduleReconnect(delay: number = 5000): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        this.handleError(error as Error);
        this.scheduleReconnect(delay * 2); // Exponential backoff
      }
    }, delay);
  }

  destroy(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.removeAllListeners();
  }
} 