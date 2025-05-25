# TanukiMCP Client Hub

The MCP Client Hub is a comprehensive solution for connecting to and managing external MCP (Model Context Protocol) servers. It provides a unified interface for tool aggregation, health monitoring, and automatic reconnection with support for multiple transport protocols.

## 🌟 Features

- **Multiple Transport Support**: stdio, HTTP/SSE, and WebSocket connections
- **Health Monitoring**: Automatic server health tracking with metrics
- **Auto-Reconnection**: Intelligent reconnection with exponential backoff
- **Tool Aggregation**: Unified tool catalog from all connected servers
- **Conflict Resolution**: Handle duplicate tool names across servers
- **Configuration Management**: Save, load, and export server configurations
- **Real-time Events**: EventEmitter-based architecture for real-time updates

## 📦 Installation

```bash
npm install @tanukimcp/mcp-hub
```

## 🚀 Quick Start

```typescript
import { MCPClientHub, createStdioServerConfig } from '@tanukimcp/mcp-hub';

// Create and initialize the hub
const hub = new MCPClientHub();
await hub.initialize();

// Add a filesystem MCP server
const fileServerConfig = createStdioServerConfig({
  id: 'filesystem',
  name: 'Filesystem Server',
  description: 'Provides file operations',
  command: 'npx',
  args: ['@modelcontextprotocol/server-filesystem', '--allowed-path', './']
});

await hub.addServer(fileServerConfig);

// Get all available tools
const catalog = await hub.getAllAvailableTools();
console.log(`Connected to ${catalog.sources.length} servers with ${catalog.totalTools} tools`);

// Execute a tool
const result = await hub.executeToolCall({
  name: 'read_file',
  arguments: { path: 'README.md' }
}, {
  sessionId: 'session-1',
  messageId: 'msg-1',
  timestamp: new Date(),
  retryCount: 0,
  timeoutMs: 30000
});

console.log('File content:', result.content[0].text);
```

## 🔧 Transport Types

### Stdio Transport

For local command-line MCP servers:

```typescript
import { createStdioServerConfig } from '@tanukimcp/mcp-hub';

const config = createStdioServerConfig({
  id: 'git-server',
  name: 'Git Operations',
  description: 'Git repository management',
  command: 'npx',
  args: ['@modelcontextprotocol/server-git'],
  env: { GIT_AUTHOR_NAME: 'Bot' },
  cwd: '/path/to/repo'
});
```

### SSE Transport

For HTTP-based MCP servers with Server-Sent Events:

```typescript
import { createSSEServerConfig } from '@tanukimcp/mcp-hub';

const config = createSSEServerConfig({
  id: 'web-server',
  name: 'Web API Server',
  description: 'Web scraping and API access',
  url: 'https://mcp-server.example.com/sse',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 30000
});
```

### WebSocket Transport

For real-time bidirectional communication:

```typescript
import { createWebSocketServerConfig } from '@tanukimcp/mcp-hub';

const config = createWebSocketServerConfig({
  id: 'realtime-server',
  name: 'Real-time Server',
  description: 'Real-time data processing',
  url: 'wss://mcp-server.example.com/ws',
  protocols: ['mcp-v1'],
  headers: { 'Authorization': 'Bearer token' }
});
```

## 📊 Health Monitoring

The hub continuously monitors server health and provides detailed metrics:

```typescript
// Get overall health report
const health = await hub.getHealthReport();
console.log({
  totalServers: health.totalServers,
  connectedServers: health.connectedServers,
  totalTools: health.totalTools
});

// Get specific server health
const serverHealth = await hub.getServerStatus('filesystem');
console.log({
  status: serverHealth.status,
  responseTime: serverHealth.responseTime,
  errorCount: serverHealth.errorCount,
  uptime: serverHealth.uptime
});

// Listen for health events
hub.on('server:unhealthy', (serverId, health) => {
  console.warn(`Server ${serverId} is unhealthy:`, health);
});

hub.on('server:recovered', (serverId, health) => {
  console.log(`Server ${serverId} has recovered:`, health);
});
```

## 🛠️ Tool Management

### Tool Catalog

```typescript
const catalog = await hub.getAllAvailableTools();

// Browse tools by category
catalog.tools.forEach(tool => {
  console.log(`${tool.name} (${tool.source}): ${tool.description}`);
  console.log(`  Category: ${tool.category}`);
  console.log(`  Reliability: ${tool.reliability}`);
  console.log(`  Success Rate: ${tool.successRate}%`);
});

// Handle conflicts
const conflicts = await hub.resolveToolConflicts();
conflicts.forEach(conflict => {
  console.log(`Tool "${conflict.toolName}" available from: ${conflict.sources.join(', ')}`);
  console.log(`Resolution: ${conflict.resolution}`);
});
```

### Tool Execution

```typescript
// Execute with full context
try {
  const result = await hub.executeToolCall({
    name: 'search_files',
    arguments: { 
      pattern: '*.ts',
      directory: './src' 
    }
  }, {
    sessionId: 'session-1',
    messageId: 'msg-2',
    timestamp: new Date(),
    retryCount: 0,
    timeoutMs: 15000
  });

  if (result.isError) {
    console.error('Tool execution failed:', result.content[0].text);
  } else {
    console.log('Search results:', result.content);
  }
} catch (error) {
  console.error('Tool execution error:', error);
}
```

## ⚙️ Configuration Management

### Export/Import

```typescript
// Export all configurations
const configJson = await hub.exportConfiguration();
await fs.writeFile('mcp-config.json', configJson);

// Import configurations
const configData = await fs.readFile('mcp-config.json', 'utf8');
await hub.importConfiguration(configData);
```

### Dynamic Updates

```typescript
// Update server configuration
await hub.updateServerConfig('filesystem', {
  healthCheckInterval: 15000,
  maxRetries: 5
});

// Enable/disable auto-restart
await hub.updateServerConfig('web-server', {
  autoRestart: false
});
```

## 🎛️ Event System

The hub emits various events for real-time monitoring:

```typescript
// Server connection events
hub.on('server:connected', (serverId) => {
  console.log(`✅ Server ${serverId} connected`);
});

hub.on('server:disconnected', (serverId, reason) => {
  console.log(`❌ Server ${serverId} disconnected: ${reason}`);
});

hub.on('server:error', (serverId, error) => {
  console.error(`🚨 Server ${serverId} error:`, error);
});

// Tool execution events
hub.on('tool:executed', (toolName, source, executionTime, success) => {
  console.log(`🔧 Tool ${toolName} from ${source}: ${executionTime}ms (${success ? 'success' : 'failed'})`);
});

// Catalog updates
hub.on('catalog:updated', (catalog) => {
  console.log(`📚 Tool catalog updated: ${catalog.totalTools} tools from ${catalog.sources.length} sources`);
});
```

## 🏭 Pre-configured Templates

Use common server configurations:

```typescript
import { commonServerConfigs } from '@tanukimcp/mcp-hub';

// Filesystem server with allowed paths
const fsServer = commonServerConfigs.filesystem({
  allowedPaths: ['/home/user/projects', '/tmp']
});

// Git server
const gitServer = commonServerConfigs.git();

// Database server
const dbServer = commonServerConfigs.database({
  connectionString: 'postgresql://user:pass@localhost/db'
});

// Web server
const webServer = commonServerConfigs.web({
  baseUrl: 'https://api.example.com'
});

// Add all servers
await Promise.all([
  hub.addServer(fsServer),
  hub.addServer(gitServer),
  hub.addServer(dbServer),
  hub.addServer(webServer)
]);
```

## 🔒 Security Features

### Sandboxing

```typescript
const secureConfig = createStdioServerConfig({
  id: 'secure-server',
  name: 'Secure Server',
  description: 'Sandboxed file operations',
  command: 'npx',
  args: ['@my/secure-mcp-server']
});

// Override security settings
secureConfig.security = {
  sandboxed: true,
  allowedPaths: ['/safe/directory'],
  maxExecutionTime: 10000,
  maxMemoryUsage: 128 * 1024 * 1024, // 128MB
  networkAccess: 'none'
};
```

### Validation

```typescript
import { validateServerConfig } from '@tanukimcp/mcp-hub';

// Validate before adding
if (validateServerConfig(config)) {
  await hub.addServer(config);
} else {
  console.error('Invalid server configuration');
}
```

## 🧪 Testing

Test your server connections:

```typescript
// Test individual server
const isHealthy = await hub.testServer('filesystem');
console.log(`Filesystem server healthy: ${isHealthy}`);

// Test all servers
const servers = await hub.listServers();
for (const server of servers) {
  const healthy = await hub.testServer(server.id);
  console.log(`${server.name}: ${healthy ? '✅' : '❌'}`);
}
```

## 🛠️ API Reference

### MCPClientHub

Main hub class for managing MCP server connections.

#### Methods

- `initialize()`: Initialize the hub and load saved configurations
- `addServer(config)`: Add and connect to a new MCP server
- `removeServer(serverId)`: Remove and disconnect from a server
- `connectServer(serverId)`: Connect to a configured server
- `disconnectServer(serverId)`: Disconnect from a server
- `reconnectServer(serverId)`: Reconnect to a server
- `executeToolCall(toolCall, context)`: Execute a tool from any connected server
- `getAllAvailableTools()`: Get unified tool catalog from all servers
- `getHealthReport()`: Get comprehensive health report
- `getServerStatus(serverId)`: Get health status for specific server
- `listServers()`: List all configured servers
- `exportConfiguration()`: Export all server configurations as JSON
- `importConfiguration(json)`: Import server configurations from JSON
- `shutdown()`: Gracefully shutdown all connections

#### Events

- `server:connected` - Server successfully connected
- `server:disconnected` - Server disconnected
- `server:error` - Server error occurred
- `tool:executed` - Tool execution completed
- `tool:failed` - Tool execution failed
- `catalog:updated` - Tool catalog updated
- `health:updated` - Health report updated

## 🤝 Contributing

This package is part of the TanukiMCP Atlas project. See the main repository for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details. 