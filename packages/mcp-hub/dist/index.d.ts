export { MCPClientHub } from './client-hub';
import { MCPClientHub } from './client-hub';
export * from './types';
export { BaseTransport } from './transports/base-transport';
export { StdioTransport } from './transports/stdio-transport';
export { SSETransport } from './transports/sse-transport';
export { WebSocketTransport } from './transports/websocket-transport';
export { TransportFactory } from './transports/transport-factory';
export { HealthMonitor } from './health/health-monitor';
export declare function createStdioServerConfig(options: {
    id: string;
    name: string;
    description: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
}): any;
export declare function createSSEServerConfig(options: {
    id: string;
    name: string;
    description: string;
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
}): any;
export declare function createWebSocketServerConfig(options: {
    id: string;
    name: string;
    description: string;
    url: string;
    protocols?: string[];
    headers?: Record<string, string>;
}): any;
export declare function validateServerConfig(config: any): boolean;
export declare const commonServerConfigs: {
    filesystem: (options: {
        allowedPaths: string[];
    }) => any;
    git: () => any;
    database: (options: {
        connectionString: string;
    }) => any;
    web: (options: {
        baseUrl: string;
    }) => any;
};
export default MCPClientHub;
