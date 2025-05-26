"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransport = void 0;
const base_transport_1 = require("./base-transport");
class WebSocketTransport extends base_transport_1.BaseTransport {
    webSocket;
    pingInterval;
    pongTimeout;
    constructor(config) {
        super(config);
    }
    async connect() {
        if (this.connected || this.webSocket) {
            await this.disconnect();
        }
        const config = this.config;
        try {
            this.webSocket = new WebSocket(config.url, config.protocols);
            this.setupWebSocketHandlers();
            // Wait for connection
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('WebSocket connection timeout'));
                }, 10000);
                this.webSocket.addEventListener('open', () => {
                    clearTimeout(timeout);
                    this.handleConnect();
                    this.startHeartbeat();
                    resolve();
                });
                this.webSocket.addEventListener('error', (event) => {
                    clearTimeout(timeout);
                    reject(new Error(`WebSocket connection failed: ${event.message || 'Unknown error'}`));
                });
            });
        }
        catch (error) {
            throw new Error(`Failed to connect to MCP server via WebSocket: ${error}`);
        }
    }
    async disconnect() {
        this.stopHeartbeat();
        if (this.webSocket) {
            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.close(1000, 'Normal closure');
            }
            this.webSocket = undefined;
        }
        this.handleDisconnect();
    }
    async send(message) {
        if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }
        const jsonMessage = JSON.stringify(message);
        this.webSocket.send(jsonMessage);
    }
    setupWebSocketHandlers() {
        if (!this.webSocket)
            return;
        this.webSocket.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);
                // Handle heartbeat responses
                if (message.method === 'pong') {
                    this.handlePong();
                    return;
                }
                this.handleMessage(message);
            }
            catch (error) {
                console.warn('Failed to parse WebSocket message:', event.data, error);
            }
        });
        this.webSocket.addEventListener('close', (event) => {
            console.log(`WebSocket closed: ${event.code} ${event.reason}`);
            this.handleDisconnect();
            // Auto-reconnect on unexpected closure
            if (event.code !== 1000 && event.code !== 1001) {
                this.scheduleReconnect();
            }
        });
        this.webSocket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            this.handleError(new Error(`WebSocket error: ${event.message || 'Unknown error'}`));
        });
    }
    startHeartbeat() {
        this.stopHeartbeat();
        // Send ping every 30 seconds
        this.pingInterval = setInterval(() => {
            if (this.webSocket?.readyState === WebSocket.OPEN) {
                this.send({ method: 'ping', id: Date.now() });
                // Set timeout for pong response
                this.pongTimeout = setTimeout(() => {
                    console.warn('WebSocket ping timeout - reconnecting');
                    this.scheduleReconnect();
                }, 10000);
            }
        }, 30000);
    }
    stopHeartbeat() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = undefined;
        }
        if (this.pongTimeout) {
            clearTimeout(this.pongTimeout);
            this.pongTimeout = undefined;
        }
    }
    handlePong() {
        if (this.pongTimeout) {
            clearTimeout(this.pongTimeout);
            this.pongTimeout = undefined;
        }
    }
    destroy() {
        this.stopHeartbeat();
        this.disconnect();
        super.destroy();
    }
}
exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=websocket-transport.js.map