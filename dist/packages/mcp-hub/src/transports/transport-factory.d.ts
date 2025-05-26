import { BaseTransport } from './base-transport';
import { TransportConfig } from '../types';
export declare class TransportFactory {
    static create(config: TransportConfig): BaseTransport;
    static validateConfig(config: TransportConfig): void;
    private static validateStdioConfig;
    private static validateSSEConfig;
    private static validateWebSocketConfig;
    static getSupportedTransports(): string[];
    static getTransportDescription(type: string): string;
    static getDefaultConfig(type: string): Partial<TransportConfig>;
}
//# sourceMappingURL=transport-factory.d.ts.map