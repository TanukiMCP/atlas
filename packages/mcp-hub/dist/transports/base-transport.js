"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTransport = void 0;
const events_1 = require("events");
class BaseTransport extends events_1.EventEmitter {
    config;
    connected = false;
    reconnectTimer;
    connectionId;
    constructor(config) {
        super();
        this.config = config;
    }
    isConnected() {
        return this.connected;
    }
    getConfig() {
        return this.config;
    }
    handleConnect() {
        this.connected = true;
        this.emit('connect');
    }
    handleDisconnect() {
        this.connected = false;
        this.emit('disconnect');
    }
    handleMessage(message) {
        this.emit('message', message);
    }
    handleError(error) {
        this.emit('error', error);
    }
    scheduleReconnect(delay = 5000) {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        this.reconnectTimer = setTimeout(async () => {
            try {
                await this.connect();
            }
            catch (error) {
                this.handleError(error);
                this.scheduleReconnect(delay * 2); // Exponential backoff
            }
        }, delay);
    }
    destroy() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        this.removeAllListeners();
    }
}
exports.BaseTransport = BaseTransport;
