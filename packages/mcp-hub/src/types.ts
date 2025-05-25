import { EventEmitter } from 'events';

// Core MCP Types
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Transport Configuration
export type TransportType = 'stdio' | 'sse' | 'websocket';

export interface StdioTransportConfig {
  type: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}

export interface SSETransportConfig {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface WebSocketTransportConfig {
  type: 'websocket';
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
}

export type TransportConfig = StdioTransportConfig | SSETransportConfig | WebSocketTransportConfig;

// Server Configuration
export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  transport: TransportConfig;
  
  // Security and resource limits
  security: {
    sandboxed: boolean;
    allowedPaths: string[];
    maxExecutionTime: number;
    maxMemoryUsage: number;
    networkAccess: 'none' | 'local' | 'internet';
  };
  
  // Auto-management
  autoRestart: boolean;
  healthCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
  
  // Metadata
  version?: string;
  author?: string;
  homepage?: string;
  tags?: string[];
  
  // Runtime state
  created: Date;
  lastConnected?: Date;
  lastDisconnected?: Date;
}

// Health Monitoring
export type ServerStatus = 'connected' | 'connecting' | 'disconnected' | 'error' | 'disabled';

export interface ServerHealth {
  serverId: string;
  status: ServerStatus;
  lastSeen: Date;
  responseTime: number;
  errorCount: number;
  connectionAttempts: number;
  lastError?: string;
  capabilities?: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
  };
  toolCount: number;
  uptime: number;
}

export interface HealthReport {
  generated: Date;
  servers: Record<string, ServerHealth>;
  totalServers: number;
  connectedServers: number;
  totalTools: number;
  builtinTools: number;
  externalTools: number;
}

// Tool Catalog
export interface EnhancedToolDefinition extends ToolDefinition {
  source: string; // 'builtin' or server ID
  reliability: 'high' | 'medium' | 'low';
  latency: 'instant' | 'fast' | 'network' | 'slow';
  category: string;
  tags: string[];
  lastUsed?: Date;
  usageCount: number;
  averageExecutionTime: number;
  successRate: number;
}

export interface ToolCatalog {
  tools: EnhancedToolDefinition[];
  lastUpdated: Date;
  sources: string[];
  categories: string[];
  totalTools: number;
  conflicts: ToolConflict[];
}

export interface ToolConflict {
  toolName: string;
  sources: string[];
  resolution: 'prefer_builtin' | 'prefer_external' | 'user_choice' | 'rename';
  selectedSource?: string;
}

// Error Handling
export interface ErrorRecoveryResult {
  success: boolean;
  result?: ToolResult;
  error?: Error;
  recovery: 'none' | 'retry' | 'reconnected_and_retried' | 'fallback_used' | 'no_fallback_available';
  userMessage: string;
  warning?: string;
  suggestions?: string[];
}

export interface ExecutionContext {
  sessionId: string;
  messageId: string;
  userId?: string;
  timestamp: Date;
  retryCount: number;
  timeoutMs: number;
}

// Events
export interface MCPHubEvents {
  'server:connected': (serverId: string) => void;
  'server:disconnected': (serverId: string, reason: string) => void;
  'server:error': (serverId: string, error: Error) => void;
  'server:reconnecting': (serverId: string, attempt: number) => void;
  'tool:executed': (toolName: string, source: string, executionTime: number, success: boolean) => void;
  'tool:failed': (toolName: string, source: string, error: Error) => void;
  'catalog:updated': (catalog: ToolCatalog) => void;
  'health:updated': (report: HealthReport) => void;
}

// Hub Service Interface
export interface IMCPHubService extends EventEmitter {
  // Server lifecycle management
  addServer(config: MCPServerConfig): Promise<void>;
  removeServer(serverId: string): Promise<void>;
  connectServer(serverId: string): Promise<void>;
  disconnectServer(serverId: string): Promise<void>;
  reconnectServer(serverId: string): Promise<void>;
  
  // Configuration management
  updateServerConfig(serverId: string, updates: Partial<MCPServerConfig>): Promise<void>;
  getServerConfig(serverId: string): Promise<MCPServerConfig | null>;
  listServers(): Promise<MCPServerConfig[]>;
  
  // Tool aggregation
  getAllAvailableTools(): Promise<ToolCatalog>;
  executeToolCall(toolCall: ToolCall, context: ExecutionContext): Promise<ToolResult>;
  resolveToolConflicts(): Promise<ToolConflict[]>;
  
  // Health monitoring
  getHealthReport(): Promise<HealthReport>;
  getServerStatus(serverId: string): Promise<ServerHealth | null>;
  
  // Utility methods
  testServer(serverId: string): Promise<boolean>;
  exportConfiguration(): Promise<string>;
  importConfiguration(config: string): Promise<void>;
  
  // Lifecycle
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

// Connection Management
export interface ConnectionManager {
  connect(serverId: string, config: MCPServerConfig): Promise<void>;
  disconnect(serverId: string): Promise<void>;
  reconnect(serverId: string): Promise<void>;
  isConnected(serverId: string): boolean;
  getConnectionStatus(serverId: string): ServerStatus;
}

// Analytics and Metrics
export interface ToolMetrics {
  toolName: string;
  source: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  averageExecutionTime: number;
  lastExecuted: Date;
  totalExecutionTime: number;
}

export interface ServerMetrics {
  serverId: string;
  connectionTime: Date;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageResponseTime: number;
  uptime: number;
  downtime: number;
} 