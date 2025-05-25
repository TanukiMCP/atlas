import { BaseTransport } from './base-transport';
import { WebSocketTransportConfig } from '../types';
export declare class WebSocketTransport extends BaseTransport {
    private webSocket?;
    private pingInterval?;
    private pongTimeout?;
    constructor(config: WebSocketTransportConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: any): Promise<void>;
    private setupWebSocketHandlers;
    private startHeartbeat;
    private stopHeartbeat;
    private handlePong;
    destroy(): void;
}
