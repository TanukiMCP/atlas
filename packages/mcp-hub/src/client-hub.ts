import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import {
  IMCPHubService,
  MCPServerConfig,
  ToolCall,
  ToolResult,
  ToolCatalog,
  EnhancedToolDefinition,
  ToolConflict,
  HealthReport,
  ServerHealth,
  ExecutionContext,
  ErrorRecoveryResult,
  MCPHubEvents
} from './types';
import { TransportFactory } from './transports/transport-factory';
import { BaseTransport } from './transports/base-transport';
import { HealthMonitor } from './health/health-monitor';

interface MCPConnection {
  id: string;
  config: MCPServerConfig;
  transport: BaseTransport;
  tools: EnhancedToolDefinition[];
  lastToolSync: Date;
  messageQueue: any[];
  connected: boolean;
}

export class MCPClientHub extends EventEmitter implements IMCPHubService {
  private connections: Map<string, MCPConnection> = new Map();
  private configs: Map<string, MCPServerConfig> = new Map();
  private healthMonitor: HealthMonitor;
  private toolCache: Map<string, EnhancedToolDefinition[]> = new Map();
  private conflictResolutions: Map<string, ToolConflict> = new Map();
  private pendingRequests: Map<string, { resolve: any; reject: any; timeout: NodeJS.Timeout }> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.healthMonitor = new HealthMonitor();
    this.setupHealthMonitorListeners();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Initializing MCP Client Hub...');
    
    // Load saved configurations
    await this.loadSavedConfigurations();
    
    // Auto-connect to servers with autoRestart enabled
    await this.autoConnectServers();
    
    this.isInitialized = true;
    console.log('MCP Client Hub initialized');
  }

  async addServer(config: MCPServerConfig): Promise<void> {
    console.log(`Adding MCP server: ${config.name} (${config.id})`);
    
    // Validate configuration
    TransportFactory.validateConfig(config.transport);
    
    // Store configuration
    this.configs.set(config.id, config);
    await this.saveConfiguration(config);
    
    // Connect immediately
    await this.connectServer(config.id);
  }

  async removeServer(serverId: string): Promise<void> {
    console.log(`Removing MCP server: ${serverId}`);
    
    // Disconnect if connected
    await this.disconnectServer(serverId);
    
    // Remove from all maps
    this.configs.delete(serverId);
    this.connections.delete(serverId);
    this.toolCache.delete(serverId);
    
    // Stop health monitoring
    this.healthMonitor.stopMonitoring(serverId);
    
    // Remove from storage
    await this.removeStoredConfiguration(serverId);
    
    this.emit('server:removed', serverId);
  }

  async connectServer(serverId: string): Promise<void> {
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }

    console.log(`Connecting to MCP server: ${config.name}`);
    
    // Disconnect if already connected
    if (this.connections.has(serverId)) {
      await this.disconnectServer(serverId);
    }

    try {
      // Create transport
      const transport = TransportFactory.create(config.transport);
      
      // Set up transport event handlers
      this.setupTransportHandlers(serverId, transport);
      
      // Create connection record
      const connection: MCPConnection = {
        id: serverId,
        config,
        transport,
        tools: [],
        lastToolSync: new Date(),
        messageQueue: [],
        connected: false
      };
      
      this.connections.set(serverId, connection);
      
      // Start health monitoring
      this.healthMonitor.startMonitoring(serverId, config);
      this.healthMonitor.updateServerStatus(serverId, 'connecting');
      
      // Attempt connection
      await transport.connect();
      
      // Initialize MCP session
      await this.initializeMCPSession(serverId);
      
      console.log(`Successfully connected to MCP server: ${config.name}`);
      
         } catch (error) {
       const errorMessage = error instanceof Error ? error.message : String(error);
       console.error(`Failed to connect to MCP server ${config.name}:`, error);
       this.healthMonitor.updateServerStatus(serverId, 'error', errorMessage);
      
      // Schedule retry if auto-restart is enabled
      if (config.autoRestart) {
        setTimeout(() => {
          this.reconnectServer(serverId);
        }, config.retryDelay);
      }
      
      throw error;
    }
  }

  async disconnectServer(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection) return;

    console.log(`Disconnecting from MCP server: ${connection.config.name}`);
    
    try {
      await connection.transport.disconnect();
    } catch (error) {
      console.warn(`Error disconnecting from ${serverId}:`, error);
    }
    
    connection.connected = false;
    this.healthMonitor.updateServerStatus(serverId, 'disconnected');
    
    this.emit('server:disconnected', serverId, 'Manual disconnect');
  }

  async reconnectServer(serverId: string): Promise<void> {
    console.log(`Reconnecting to MCP server: ${serverId}`);
    
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }
    
    await this.disconnectServer(serverId);
    await this.connectServer(serverId);
  }

  async executeToolCall(toolCall: ToolCall, context: ExecutionContext): Promise<ToolResult> {
    const messageId = uuidv4();
    
    // Find the server that provides this tool
    const { serverId, tool } = this.findToolProvider(toolCall.name);
    
    if (serverId === 'builtin') {
      // Route to built-in tools (would need integration with built-in MCP server)
      throw new Error('Built-in tool execution not implemented in hub');
    }
    
    const connection = this.connections.get(serverId);
    if (!connection || !connection.connected) {
      throw new Error(`Server ${serverId} is not connected`);
    }
    
    try {
      // Record request start for metrics
      this.healthMonitor.recordRequestStart(serverId, messageId);
      
      // Send tool call request
      const mcpRequest = {
        jsonrpc: '2.0',
        id: messageId,
        method: 'tools/call',
        params: {
          name: toolCall.name,
          arguments: toolCall.arguments
        }
      };
      
      // Send request and wait for response
      const result = await this.sendRequestAndWaitForResponse(serverId, mcpRequest, context.timeoutMs);
      
      // Record successful completion
      this.healthMonitor.recordRequestEnd(serverId, messageId, true);
      
      // Update tool usage metrics
      this.updateToolMetrics(serverId, toolCall.name, true);
      
      this.emit('tool:executed', toolCall.name, serverId, Date.now() - context.timestamp.getTime(), true);
      
      return this.formatToolResult(result);
      
    } catch (error) {
      // Record failed completion
      this.healthMonitor.recordRequestEnd(serverId, messageId, false);
      this.updateToolMetrics(serverId, toolCall.name, false);
      
             this.emit('tool:failed', toolCall.name, serverId, error);
       
       // Attempt error recovery
       const errorObj = error instanceof Error ? error : new Error(String(error));
       return await this.handleToolExecutionError(errorObj, toolCall, context);
    }
  }

  async getAllAvailableTools(): Promise<ToolCatalog> {
    const tools: EnhancedToolDefinition[] = [];
    const sources: string[] = ['builtin'];
    const categories = new Set<string>();
    const conflicts: ToolConflict[] = [];
    
    // Add built-in tools (placeholder - would integrate with built-in MCP server)
    const builtinTools = await this.getBuiltinTools();
    tools.push(...builtinTools);
    builtinTools.forEach(tool => categories.add(tool.category));
    
    // Add external tools
    for (const [serverId, connection] of this.connections) {
      if (connection.connected && connection.tools.length > 0) {
        sources.push(serverId);
        tools.push(...connection.tools);
        connection.tools.forEach(tool => categories.add(tool.category));
      }
    }
    
    // Detect and resolve conflicts
    const toolsByName = new Map<string, EnhancedToolDefinition[]>();
    for (const tool of tools) {
      if (!toolsByName.has(tool.name)) {
        toolsByName.set(tool.name, []);
      }
      toolsByName.get(tool.name)!.push(tool);
    }
    
    for (const [toolName, toolVersions] of toolsByName) {
      if (toolVersions.length > 1) {
        const conflict: ToolConflict = {
          toolName,
          sources: toolVersions.map(t => t.source),
          resolution: 'prefer_builtin', // Default resolution
          selectedSource: toolVersions.find(t => t.source === 'builtin')?.source || toolVersions[0].source
        };
        conflicts.push(conflict);
        this.conflictResolutions.set(toolName, conflict);
      }
    }
    
    const catalog: ToolCatalog = {
      tools,
      lastUpdated: new Date(),
      sources,
      categories: Array.from(categories),
      totalTools: tools.length,
      conflicts
    };
    
    this.emit('catalog:updated', catalog);
    return catalog;
  }

  async resolveToolConflicts(): Promise<ToolConflict[]> {
    return Array.from(this.conflictResolutions.values());
  }

  async getHealthReport(): Promise<HealthReport> {
    const report = this.healthMonitor.generateHealthReport();
    
    // Add built-in tools count
    const builtinTools = await this.getBuiltinTools();
    report.builtinTools = builtinTools.length;
    report.totalTools = report.externalTools + report.builtinTools;
    
    this.emit('health:updated', report);
    return report;
  }

  async getServerStatus(serverId: string): Promise<ServerHealth | null> {
    return this.healthMonitor.getServerHealth(serverId);
  }

  async testServer(serverId: string): Promise<boolean> {
    const connection = this.connections.get(serverId);
    if (!connection) return false;
    
    try {
      // Send a ping request
      const pingRequest = {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'ping'
      };
      
      await this.sendRequestAndWaitForResponse(serverId, pingRequest, 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Configuration management
  async updateServerConfig(serverId: string, updates: Partial<MCPServerConfig>): Promise<void> {
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }
    
    const updatedConfig = { ...config, ...updates };
    this.configs.set(serverId, updatedConfig);
    await this.saveConfiguration(updatedConfig);
    
    // Reconnect if transport configuration changed
    if (updates.transport) {
      await this.reconnectServer(serverId);
    }
  }

  async getServerConfig(serverId: string): Promise<MCPServerConfig | null> {
    return this.configs.get(serverId) || null;
  }

  async listServers(): Promise<MCPServerConfig[]> {
    return Array.from(this.configs.values());
  }

  async exportConfiguration(): Promise<string> {
    const configs = Array.from(this.configs.values());
    return JSON.stringify(configs, null, 2);
  }

  async importConfiguration(configJson: string): Promise<void> {
    const configs: MCPServerConfig[] = JSON.parse(configJson);
    
    for (const config of configs) {
      await this.addServer(config);
    }
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down MCP Client Hub...');
    
    // Disconnect all servers
    const disconnectPromises = Array.from(this.connections.keys()).map(
      serverId => this.disconnectServer(serverId)
    );
    await Promise.all(disconnectPromises);
    
    // Cleanup
    this.healthMonitor.destroy();
    this.connections.clear();
    this.configs.clear();
    this.toolCache.clear();
    this.conflictResolutions.clear();
    
    // Clear pending requests
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Hub shutting down'));
    }
    this.pendingRequests.clear();
    
    this.removeAllListeners();
    this.isInitialized = false;
    
    console.log('MCP Client Hub shutdown complete');
  }

  // Private helper methods
  private setupTransportHandlers(serverId: string, transport: BaseTransport): void {
    transport.on('connect', () => {
      const connection = this.connections.get(serverId);
      if (connection) {
        connection.connected = true;
        this.healthMonitor.updateServerStatus(serverId, 'connected');
        this.emit('server:connected', serverId);
      }
    });

    transport.on('disconnect', () => {
      const connection = this.connections.get(serverId);
      if (connection) {
        connection.connected = false;
        this.healthMonitor.updateServerStatus(serverId, 'disconnected');
        this.emit('server:disconnected', serverId, 'Transport disconnected');
      }
    });

    transport.on('message', (message) => {
      this.handleIncomingMessage(serverId, message);
    });

    transport.on('error', (error) => {
      this.healthMonitor.updateServerStatus(serverId, 'error', error.message);
      this.emit('server:error', serverId, error);
    });
  }

  private async initializeMCPSession(serverId: string): Promise<void> {
    const initRequest = {
      jsonrpc: '2.0',
      id: uuidv4(),
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: true,
          resources: true,
          prompts: true
        },
        clientInfo: {
          name: 'TanukiMCP Atlas',
          version: '1.0.0'
        }
      }
    };

    const response = await this.sendRequestAndWaitForResponse(serverId, initRequest, 10000);
    
    // Update capabilities
    this.healthMonitor.updateCapabilities(serverId, response.capabilities || {
      tools: true,
      resources: true,
      prompts: true
    });

    // Sync tools
    await this.syncServerTools(serverId);
  }

  private async syncServerTools(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (!connection) return;

    try {
      const toolsRequest = {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'tools/list'
      };

      const response = await this.sendRequestAndWaitForResponse(serverId, toolsRequest, 10000);
      
      const tools: EnhancedToolDefinition[] = (response.tools || []).map((tool: any) => ({
        ...tool,
        source: serverId,
        reliability: 'medium',
        latency: 'network',
        category: this.categorizeToolName(tool.name),
        tags: this.extractToolTags(tool),
        usageCount: 0,
        averageExecutionTime: 0,
        successRate: 100
      }));

      connection.tools = tools;
      connection.lastToolSync = new Date();
      
      this.toolCache.set(serverId, tools);
      this.healthMonitor.updateToolCount(serverId, tools.length);
      
      console.log(`Synced ${tools.length} tools from ${connection.config.name}`);
      
    } catch (error) {
      console.error(`Failed to sync tools from ${serverId}:`, error);
    }
  }

  private async sendRequestAndWaitForResponse(serverId: string, request: any, timeoutMs: number): Promise<any> {
    const connection = this.connections.get(serverId);
    if (!connection || !connection.connected) {
      throw new Error(`Server ${serverId} is not connected`);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error(`Request timeout: ${request.method}`));
      }, timeoutMs);

      this.pendingRequests.set(request.id, { resolve, reject, timeout });
      
      connection.transport.send(request).catch(error => {
        this.pendingRequests.delete(request.id);
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  private handleIncomingMessage(serverId: string, message: any): void {
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      clearTimeout(pending.timeout);

      if (message.error) {
        pending.reject(new Error(message.error.message || 'MCP error'));
      } else {
        pending.resolve(message.result);
      }
    }
  }

  private findToolProvider(toolName: string): { serverId: string; tool: EnhancedToolDefinition } {
    // Check for conflict resolution
    const conflict = this.conflictResolutions.get(toolName);
    if (conflict && conflict.selectedSource) {
      const serverId = conflict.selectedSource;
      const tools = this.toolCache.get(serverId) || [];
      const tool = tools.find(t => t.name === toolName);
      if (tool) {
        return { serverId, tool };
      }
    }

    // Search all sources
    for (const [serverId, tools] of this.toolCache) {
      const tool = tools.find(t => t.name === toolName);
      if (tool) {
        return { serverId, tool };
      }
    }

    throw new Error(`Tool not found: ${toolName}`);
  }

  private async handleToolExecutionError(error: Error, toolCall: ToolCall, context: ExecutionContext): Promise<ToolResult> {
    // Comprehensive error recovery logic would go here
    // For now, just return the error
    return {
      content: [{
        type: 'text',
        text: `Tool execution failed: ${error.message}`
      }],
      isError: true
    };
  }

  private formatToolResult(result: any): ToolResult {
    if (result.content) {
      return result;
    }

    // Convert simple result to standard format
    return {
      content: [{
        type: 'text',
        text: typeof result === 'string' ? result : JSON.stringify(result)
      }]
    };
  }

  private setupHealthMonitorListeners(): void {
    this.healthMonitor.on('server:unhealthy', (serverId, health) => {
      console.warn(`Server ${serverId} is unhealthy:`, health);
      // Could trigger auto-recovery here
    });

    this.healthMonitor.on('server:recovered', (serverId, health) => {
      console.log(`Server ${serverId} has recovered:`, health);
    });
  }

  // Stub methods for integration points
  private async getBuiltinTools(): Promise<EnhancedToolDefinition[]> {
    // This would integrate with the built-in MCP server
    return [];
  }

  private categorizeToolName(toolName: string): string {
    // Simple categorization logic
    if (toolName.includes('file') || toolName.includes('read') || toolName.includes('write')) {
      return 'file-operations';
    }
    if (toolName.includes('search') || toolName.includes('find')) {
      return 'search';
    }
    if (toolName.includes('create') || toolName.includes('generate')) {
      return 'generation';
    }
    return 'general';
  }

  private extractToolTags(tool: any): string[] {
    const tags = [];
    if (tool.description) {
      // Extract tags from description or other metadata
      if (tool.description.includes('file')) tags.push('file');
      if (tool.description.includes('search')) tags.push('search');
      if (tool.description.includes('create')) tags.push('create');
    }
    return tags;
  }

  private updateToolMetrics(serverId: string, toolName: string, success: boolean): void {
    // Update tool usage metrics
    const tools = this.toolCache.get(serverId) || [];
    const tool = tools.find(t => t.name === toolName);
    if (tool) {
      tool.usageCount++;
      if (success) {
        tool.successRate = (tool.successRate * (tool.usageCount - 1) + 100) / tool.usageCount;
      } else {
        tool.successRate = (tool.successRate * (tool.usageCount - 1)) / tool.usageCount;
      }
    }
  }

  // Storage integration points (would integrate with main app database)
  private async loadSavedConfigurations(): Promise<void> {
    // Load from database
  }

  private async saveConfiguration(config: MCPServerConfig): Promise<void> {
    // Save to database
  }

  private async removeStoredConfiguration(serverId: string): Promise<void> {
    // Remove from database
  }

  private async autoConnectServers(): Promise<void> {
    for (const config of this.configs.values()) {
      if (config.autoRestart) {
        try {
          await this.connectServer(config.id);
        } catch (error) {
          console.warn(`Failed to auto-connect to ${config.name}:`, error);
        }
      }
    }
  }
} 