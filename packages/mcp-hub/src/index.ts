// Main MCP Hub exports
export { MCPClientHub } from './client-hub';
import { MCPClientHub } from './client-hub';
import { TransportFactory } from './transports/transport-factory';

// Types
export * from './types';

// Transport implementations
export { BaseTransport } from './transports/base-transport';
export { StdioTransport } from './transports/stdio-transport';
export { SSETransport } from './transports/sse-transport';
export { WebSocketTransport } from './transports/websocket-transport';
export { TransportFactory } from './transports/transport-factory';

// Health monitoring
export { HealthMonitor } from './health/health-monitor';

// Utility functions for creating server configurations
export function createStdioServerConfig(options: {
  id: string;
  name: string;
  description: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}): any {
  return {
    id: options.id,
    name: options.name,
    description: options.description,
    transport: {
      type: 'stdio' as const,
      command: options.command,
      args: options.args || [],
      env: options.env || {},
      cwd: options.cwd
    },
    security: {
      sandboxed: true,
      allowedPaths: [],
      maxExecutionTime: 30000,
      maxMemoryUsage: 512 * 1024 * 1024, // 512MB
      networkAccess: 'none' as const
    },
    autoRestart: true,
    healthCheckInterval: 30000,
    maxRetries: 3,
    retryDelay: 5000,
    created: new Date()
  };
}

export function createSSEServerConfig(options: {
  id: string;
  name: string;
  description: string;
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}): any {
  return {
    id: options.id,
    name: options.name,
    description: options.description,
    transport: {
      type: 'sse' as const,
      url: options.url,
      headers: options.headers || {},
      timeout: options.timeout || 30000
    },
    security: {
      sandboxed: true,
      allowedPaths: [],
      maxExecutionTime: 30000,
      maxMemoryUsage: 256 * 1024 * 1024, // 256MB
      networkAccess: 'internet' as const
    },
    autoRestart: true,
    healthCheckInterval: 30000,
    maxRetries: 3,
    retryDelay: 5000,
    created: new Date()
  };
}

export function createWebSocketServerConfig(options: {
  id: string;
  name: string;
  description: string;
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
}): any {
  return {
    id: options.id,
    name: options.name,
    description: options.description,
    transport: {
      type: 'websocket' as const,
      url: options.url,
      protocols: options.protocols || [],
      headers: options.headers || {}
    },
    security: {
      sandboxed: true,
      allowedPaths: [],
      maxExecutionTime: 30000,
      maxMemoryUsage: 256 * 1024 * 1024, // 256MB
      networkAccess: 'internet' as const
    },
    autoRestart: true,
    healthCheckInterval: 30000,
    maxRetries: 3,
    retryDelay: 5000,
    created: new Date()
  };
}

// Validation functions
export function validateServerConfig(config: any): boolean {
  try {
    TransportFactory.validateConfig(config.transport);
    return true;
  } catch {
    return false;
  }
}

// Pre-configured server templates for common MCP servers
export const commonServerConfigs = {
  // Example configurations for popular MCP servers
  filesystem: (options: { allowedPaths: string[] }) => createStdioServerConfig({
    id: 'filesystem-mcp',
    name: 'Filesystem MCP Server',
    description: 'Provides file system operations',
    command: 'npx',
    args: ['@modelcontextprotocol/server-filesystem', JSON.stringify({ allowedPaths: options.allowedPaths })]
  }),

  git: () => createStdioServerConfig({
    id: 'git-mcp',
    name: 'Git MCP Server',
    description: 'Provides Git repository operations',
    command: 'npx',
    args: ['@modelcontextprotocol/server-git']
  }),

  database: (options: { connectionString: string }) => createStdioServerConfig({
    id: 'database-mcp',
    name: 'Database MCP Server',
    description: 'Provides database operations',
    command: 'npx',
    args: ['@modelcontextprotocol/server-database', options.connectionString]
  }),

  web: (options: { baseUrl: string }) => createSSEServerConfig({
    id: 'web-mcp',
    name: 'Web MCP Server',
    description: 'Provides web scraping and API access',
    url: options.baseUrl
  })
};

// Export everything needed for the hub
export default MCPClientHub; 