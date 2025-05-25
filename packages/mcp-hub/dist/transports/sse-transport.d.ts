import { BaseTransport } from './base-transport';
import { SSETransportConfig } from '../types';
export declare class SSETransport extends BaseTransport {
    private eventSource?;
    private sessionId?;
    private baseUrl;
    private headers;
    constructor(config: SSETransportConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: any): Promise<void>;
    private setupEventSourceHandlers;
    destroy(): void;
}
