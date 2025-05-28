import { ConnectionInfo, ConnectionStatus } from '../types';

// Add type declaration for electronAPI
declare global {
  interface Window {
    electronAPI?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

interface ConnectionConfig {
  url: string;
  healthEndpoint: string;
  timeout: number;
  retryInterval: number;
  maxRetries: number;
}

class ConnectionManager {
  private connections: Map<string, ConnectionInfo> = new Map();
  private configs: Map<string, ConnectionConfig> = new Map();
  private retryTimers: Map<string, NodeJS.Timeout> = new Map();
  private listeners: Set<(connections: ConnectionInfo[]) => void> = new Set();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDefaultConnections();
    this.startHealthMonitoring();
  }

  private initializeDefaultConnections(): void {
    this.configs.set('Ollama', {
      url: 'http://127.0.0.1:11434',
      healthEndpoint: '/api/version',
      timeout: 5000,
      retryInterval: 10000,
      maxRetries: 5
    });

    this.configs.set('MCP Server', {
      url: 'ws://localhost:8080',
      healthEndpoint: '/health',
      timeout: 5000,
      retryInterval: 15000,
      maxRetries: 3
    });

    // Initialize connection states
    for (const [service] of this.configs) {
      this.connections.set(service, {
        service,
        status: 'disconnected'
      });
    }
  }

  async checkConnection(service: string): Promise<ConnectionStatus> {
    const config = this.configs.get(service);
    if (!config) {
      return 'error';
    }

    try {
      // Use IPC for Ollama health check instead of direct fetch
      if (service === 'Ollama') {
        const isHealthy = await this.checkOllamaViaIPC();
        if (isHealthy) {
          await this.updateConnectionStatus(service, 'connected');
          return 'connected';
        } else {
          await this.updateConnectionStatus(service, 'disconnected');
          return 'disconnected';
        }
      }

      // For other services, use the original fetch-based approach
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(`${config.url}${config.healthEndpoint}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        await this.updateConnectionStatus(service, 'connected');
        return 'connected';
      } else {
        await this.updateConnectionStatus(service, 'error');
        return 'error';
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        await this.updateConnectionStatus(service, 'error');
        return 'error';
      }
      
      await this.updateConnectionStatus(service, 'disconnected');
      return 'disconnected';
    }
  }

  private async checkOllamaViaIPC(): Promise<boolean> {
    try {
      // Use Electron's IPC to check Ollama health via main process
      if (window.electronAPI && window.electronAPI.invoke) {
        const isHealthy = await window.electronAPI.invoke('ollama:checkHealth');
        return isHealthy;
      } else {
        console.warn('Electron IPC not available, falling back to direct fetch');
        // Fallback to direct fetch if IPC is not available
        const response = await fetch('http://127.0.0.1:11434/api/version', {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        return response.ok;
      }
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }

  async connectService(service: string): Promise<boolean> {
    const config = this.configs.get(service);
    if (!config) {
      return false;
    }

    await this.updateConnectionStatus(service, 'connecting');
    
    const status = await this.checkConnection(service);
    
    if (status === 'connected') {
      this.clearRetryTimer(service);
      return true;
    } else {
      this.scheduleRetry(service);
      return false;
    }
  }

  async disconnectService(service: string): Promise<void> {
    this.clearRetryTimer(service);
    await this.updateConnectionStatus(service, 'disconnected');
  }

  async connectAll(): Promise<void> {
    const promises = Array.from(this.configs.keys()).map(service => 
      this.connectService(service)
    );
    await Promise.all(promises);
  }

  getConnectionStatus(service: string): ConnectionInfo | undefined {
    return this.connections.get(service);
  }

  getAllConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values());
  }

  onConnectionsChanged(listener: (connections: ConnectionInfo[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  addCustomConnection(service: string, config: ConnectionConfig): void {
    this.configs.set(service, config);
    this.connections.set(service, {
      service,
      status: 'disconnected'
    });
    this.notifyListeners();
  }

  removeConnection(service: string): void {
    this.clearRetryTimer(service);
    this.configs.delete(service);
    this.connections.delete(service);
    this.notifyListeners();
  }

  private async updateConnectionStatus(service: string, status: ConnectionStatus): Promise<void> {
    const connection = this.connections.get(service);
    if (connection) {
      connection.status = status;
      if (status === 'connected') {
        connection.lastConnected = new Date();
      }
      this.connections.set(service, connection);
      this.notifyListeners();
    }
  }

  private scheduleRetry(service: string): void {
    const config = this.configs.get(service);
    if (!config) return;

    this.clearRetryTimer(service);
    
    const timer = setTimeout(async () => {
      const connection = this.connections.get(service);
      if (connection && connection.status !== 'connected') {
        await this.connectService(service);
      }
    }, config.retryInterval);

    this.retryTimers.set(service, timer);
  }

  private clearRetryTimer(service: string): void {
    const timer = this.retryTimers.get(service);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(service);
    }
  }

  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      for (const service of this.configs.keys()) {
        const connection = this.connections.get(service);
        if (connection && connection.status === 'connected') {
          const status = await this.checkConnection(service);
          if (status !== 'connected') {
            this.scheduleRetry(service);
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }

  private notifyListeners(): void {
    const connections = this.getAllConnections();
    this.listeners.forEach(listener => listener(connections));
  }

  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    for (const timer of this.retryTimers.values()) {
      clearTimeout(timer);
    }
    
    this.retryTimers.clear();
    this.listeners.clear();
  }
}

export default new ConnectionManager(); 