import { BaseTransport } from './base-transport';
import { StdioTransportConfig } from '../types';
export declare class StdioTransport extends BaseTransport {
    private childProcess?;
    private messageBuffer;
    constructor(config: StdioTransportConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: any): Promise<void>;
    private setupChildProcessHandlers;
    private processMessages;
    destroy(): void;
}
//# sourceMappingURL=stdio-transport.d.ts.map