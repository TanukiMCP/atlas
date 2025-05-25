"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportFactory = void 0;
const stdio_transport_1 = require("./stdio-transport");
const sse_transport_1 = require("./sse-transport");
const websocket_transport_1 = require("./websocket-transport");
class TransportFactory {
    static create(config) {
        switch (config.type) {
            case 'stdio':
                return new stdio_transport_1.StdioTransport(config);
            case 'sse':
                return new sse_transport_1.SSETransport(config);
            case 'websocket':
                return new websocket_transport_1.WebSocketTransport(config);
            default:
                throw new Error(`Unsupported transport type: ${config.type}`);
        }
    }
    static validateConfig(config) {
        if (!config.type) {
            throw new Error('Transport type is required');
        }
        switch (config.type) {
            case 'stdio':
                this.validateStdioConfig(config);
                break;
            case 'sse':
                this.validateSSEConfig(config);
                break;
            case 'websocket':
                this.validateWebSocketConfig(config);
                break;
            default:
                throw new Error(`Unsupported transport type: ${config.type}`);
        }
    }
    static validateStdioConfig(config) {
        if (!config.command) {
            throw new Error('Stdio transport requires a command');
        }
        if (typeof config.command !== 'string') {
            throw new Error('Stdio transport command must be a string');
        }
        if (config.args && !Array.isArray(config.args)) {
            throw new Error('Stdio transport args must be an array');
        }
        if (config.env && typeof config.env !== 'object') {
            throw new Error('Stdio transport env must be an object');
        }
    }
    static validateSSEConfig(config) {
        if (!config.url) {
            throw new Error('SSE transport requires a URL');
        }
        if (typeof config.url !== 'string') {
            throw new Error('SSE transport URL must be a string');
        }
        try {
            new URL(config.url);
        }
        catch (error) {
            throw new Error(`SSE transport URL is invalid: ${config.url}`);
        }
        if (config.headers && typeof config.headers !== 'object') {
            throw new Error('SSE transport headers must be an object');
        }
        if (config.timeout && typeof config.timeout !== 'number') {
            throw new Error('SSE transport timeout must be a number');
        }
    }
    static validateWebSocketConfig(config) {
        if (!config.url) {
            throw new Error('WebSocket transport requires a URL');
        }
        if (typeof config.url !== 'string') {
            throw new Error('WebSocket transport URL must be a string');
        }
        try {
            const url = new URL(config.url);
            if (!['ws:', 'wss:'].includes(url.protocol)) {
                throw new Error('WebSocket URL must use ws:// or wss:// protocol');
            }
        }
        catch (error) {
            throw new Error(`WebSocket transport URL is invalid: ${config.url}`);
        }
        if (config.protocols && !Array.isArray(config.protocols)) {
            throw new Error('WebSocket transport protocols must be an array');
        }
        if (config.headers && typeof config.headers !== 'object') {
            throw new Error('WebSocket transport headers must be an object');
        }
    }
    static getSupportedTransports() {
        return ['stdio', 'sse', 'websocket'];
    }
    static getTransportDescription(type) {
        switch (type) {
            case 'stdio':
                return 'Child process with stdin/stdout communication (local servers)';
            case 'sse':
                return 'Server-Sent Events over HTTP (web-based servers)';
            case 'websocket':
                return 'WebSocket bidirectional communication (real-time servers)';
            default:
                return 'Unknown transport type';
        }
    }
    static getDefaultConfig(type) {
        switch (type) {
            case 'stdio':
                return {
                    type: 'stdio',
                    command: '',
                    args: [],
                    env: {}
                };
            case 'sse':
                return {
                    type: 'sse',
                    url: '',
                    headers: {},
                    timeout: 30000
                };
            case 'websocket':
                return {
                    type: 'websocket',
                    url: '',
                    protocols: [],
                    headers: {}
                };
            default:
                throw new Error(`No default config for transport type: ${type}`);
        }
    }
}
exports.TransportFactory = TransportFactory;
