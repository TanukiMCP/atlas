import { EventEmitter } from 'events';
import { TransportConfig } from '../types';
export interface TransportEvents {
    'connect': () => void;
    'disconnect': () => void;
    'message': (message: any) => void;
    'error': (error: Error) => void;
}
export declare abstract class BaseTransport extends EventEmitter {
    protected config: TransportConfig;
    protected connected: boolean;
    protected reconnectTimer?: NodeJS.Timeout;
    protected connectionId?: string;
    constructor(config: TransportConfig);
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract send(message: any): Promise<void>;
    isConnected(): boolean;
    getConfig(): TransportConfig;
    protected handleConnect(): void;
    protected handleDisconnect(): void;
    protected handleMessage(message: any): void;
    protected handleError(error: Error): void;
    protected scheduleReconnect(delay?: number): void;
    destroy(): void;
}
