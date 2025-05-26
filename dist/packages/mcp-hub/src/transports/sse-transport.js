"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSETransport = void 0;
const base_transport_1 = require("./base-transport");
class SSETransport extends base_transport_1.BaseTransport {
    eventSource;
    sessionId;
    baseUrl;
    headers;
    constructor(config) {
        super(config);
        this.baseUrl = config.url;
        this.headers = config.headers || {};
    }
    async connect() {
        if (this.connected || this.eventSource) {
            await this.disconnect();
        }
        const config = this.config;
        try {
            // First, establish a session with the server
            const response = await fetch(`${this.baseUrl}/sse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.headers
                },
                body: JSON.stringify({
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
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const initResult = await response.json();
            this.sessionId = initResult.sessionId;
            // Set up EventSource for receiving messages
            const sseUrl = `${this.baseUrl}/sse/${this.sessionId}`;
            this.eventSource = new EventSource(sseUrl);
            this.setupEventSourceHandlers();
            // Wait for connection confirmation
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('SSE connection timeout'));
                }, config.timeout || 10000);
                this.eventSource.addEventListener('open', () => {
                    clearTimeout(timeout);
                    this.handleConnect();
                    resolve();
                });
                this.eventSource.addEventListener('error', (event) => {
                    clearTimeout(timeout);
                    reject(new Error('SSE connection failed'));
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to connect to MCP server via SSE: ${error}`);
        }
    }
    async disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = undefined;
        }
        if (this.sessionId) {
            // Notify server of disconnection
            try {
                await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
                    method: 'DELETE',
                    headers: this.headers
                });
            }
            catch (error) {
                console.warn('Failed to notify server of disconnection:', error);
            }
            this.sessionId = undefined;
        }
        this.handleDisconnect();
    }
    async send(message) {
        if (!this.sessionId || !this.connected) {
            throw new Error('Transport not connected');
        }
        const response = await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.headers
            },
            body: JSON.stringify(message)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        // For SSE, we don't return the response here as it will come via EventSource
    }
    setupEventSourceHandlers() {
        if (!this.eventSource)
            return;
        this.eventSource.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            }
            catch (error) {
                console.warn('Failed to parse SSE message:', event.data, error);
            }
        });
        this.eventSource.addEventListener('error', (event) => {
            console.error('SSE connection error:', event);
            this.handleError(new Error('SSE connection error'));
            // Auto-reconnect
            this.scheduleReconnect();
        });
        // Handle custom event types
        this.eventSource.addEventListener('notification', (event) => {
            try {
                const notification = JSON.parse(event.data);
                this.handleMessage(notification);
            }
            catch (error) {
                console.warn('Failed to parse SSE notification:', event.data, error);
            }
        });
        this.eventSource.addEventListener('progress', (event) => {
            try {
                const progress = JSON.parse(event.data);
                this.handleMessage(progress);
            }
            catch (error) {
                console.warn('Failed to parse SSE progress:', event.data, error);
            }
        });
    }
    destroy() {
        this.disconnect();
        super.destroy();
    }
}
exports.SSETransport = SSETransport;
//# sourceMappingURL=sse-transport.js.map