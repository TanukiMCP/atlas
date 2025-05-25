"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonServerConfigs = exports.HealthMonitor = exports.TransportFactory = exports.WebSocketTransport = exports.SSETransport = exports.StdioTransport = exports.BaseTransport = exports.MCPClientHub = void 0;
exports.createStdioServerConfig = createStdioServerConfig;
exports.createSSEServerConfig = createSSEServerConfig;
exports.createWebSocketServerConfig = createWebSocketServerConfig;
exports.validateServerConfig = validateServerConfig;
// Main MCP Hub exports
var client_hub_1 = require("./client-hub");
Object.defineProperty(exports, "MCPClientHub", { enumerable: true, get: function () { return client_hub_1.MCPClientHub; } });
const client_hub_2 = require("./client-hub");
const transport_factory_1 = require("./transports/transport-factory");
// Types
__exportStar(require("./types"), exports);
// Transport implementations
var base_transport_1 = require("./transports/base-transport");
Object.defineProperty(exports, "BaseTransport", { enumerable: true, get: function () { return base_transport_1.BaseTransport; } });
var stdio_transport_1 = require("./transports/stdio-transport");
Object.defineProperty(exports, "StdioTransport", { enumerable: true, get: function () { return stdio_transport_1.StdioTransport; } });
var sse_transport_1 = require("./transports/sse-transport");
Object.defineProperty(exports, "SSETransport", { enumerable: true, get: function () { return sse_transport_1.SSETransport; } });
var websocket_transport_1 = require("./transports/websocket-transport");
Object.defineProperty(exports, "WebSocketTransport", { enumerable: true, get: function () { return websocket_transport_1.WebSocketTransport; } });
var transport_factory_2 = require("./transports/transport-factory");
Object.defineProperty(exports, "TransportFactory", { enumerable: true, get: function () { return transport_factory_2.TransportFactory; } });
// Health monitoring
var health_monitor_1 = require("./health/health-monitor");
Object.defineProperty(exports, "HealthMonitor", { enumerable: true, get: function () { return health_monitor_1.HealthMonitor; } });
// Utility functions for creating server configurations
function createStdioServerConfig(options) {
    return {
        id: options.id,
        name: options.name,
        description: options.description,
        transport: {
            type: 'stdio',
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
            networkAccess: 'none'
        },
        autoRestart: true,
        healthCheckInterval: 30000,
        maxRetries: 3,
        retryDelay: 5000,
        created: new Date()
    };
}
function createSSEServerConfig(options) {
    return {
        id: options.id,
        name: options.name,
        description: options.description,
        transport: {
            type: 'sse',
            url: options.url,
            headers: options.headers || {},
            timeout: options.timeout || 30000
        },
        security: {
            sandboxed: true,
            allowedPaths: [],
            maxExecutionTime: 30000,
            maxMemoryUsage: 256 * 1024 * 1024, // 256MB
            networkAccess: 'internet'
        },
        autoRestart: true,
        healthCheckInterval: 30000,
        maxRetries: 3,
        retryDelay: 5000,
        created: new Date()
    };
}
function createWebSocketServerConfig(options) {
    return {
        id: options.id,
        name: options.name,
        description: options.description,
        transport: {
            type: 'websocket',
            url: options.url,
            protocols: options.protocols || [],
            headers: options.headers || {}
        },
        security: {
            sandboxed: true,
            allowedPaths: [],
            maxExecutionTime: 30000,
            maxMemoryUsage: 256 * 1024 * 1024, // 256MB
            networkAccess: 'internet'
        },
        autoRestart: true,
        healthCheckInterval: 30000,
        maxRetries: 3,
        retryDelay: 5000,
        created: new Date()
    };
}
// Validation functions
function validateServerConfig(config) {
    try {
        transport_factory_1.TransportFactory.validateConfig(config.transport);
        return true;
    }
    catch {
        return false;
    }
}
// Pre-configured server templates for common MCP servers
exports.commonServerConfigs = {
    // Example configurations for popular MCP servers
    filesystem: (options) => createStdioServerConfig({
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
    database: (options) => createStdioServerConfig({
        id: 'database-mcp',
        name: 'Database MCP Server',
        description: 'Provides database operations',
        command: 'npx',
        args: ['@modelcontextprotocol/server-database', options.connectionString]
    }),
    web: (options) => createSSEServerConfig({
        id: 'web-mcp',
        name: 'Web MCP Server',
        description: 'Provides web scraping and API access',
        url: options.baseUrl
    })
};
// Export everything needed for the hub
exports.default = client_hub_2.MCPClientHub;
