import { ConnectionInfo, ConnectionStatus } from '../types';
interface ConnectionConfig {
    url: string;
    healthEndpoint: string;
    timeout: number;
    retryInterval: number;
    maxRetries: number;
}
declare class ConnectionManager {
    private connections;
    private configs;
    private retryTimers;
    private listeners;
    private healthCheckInterval;
    constructor();
    private initializeDefaultConnections;
    checkConnection(service: string): Promise<ConnectionStatus>;
    private checkOllamaViaIPC;
    connectService(service: string): Promise<boolean>;
    disconnectService(service: string): Promise<void>;
    connectAll(): Promise<void>;
    getConnectionStatus(service: string): ConnectionInfo | undefined;
    getAllConnections(): ConnectionInfo[];
    onConnectionsChanged(listener: (connections: ConnectionInfo[]) => void): () => void;
    addCustomConnection(service: string, config: ConnectionConfig): void;
    removeConnection(service: string): void;
    private updateConnectionStatus;
    private scheduleRetry;
    private clearRetryTimer;
    private startHealthMonitoring;
    private notifyListeners;
    destroy(): void;
}
declare const _default: ConnectionManager;
export default _default;
//# sourceMappingURL=ConnectionManager.d.ts.map