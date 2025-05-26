"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMonitor = void 0;
const events_1 = require("events");
class HealthMonitor extends events_1.EventEmitter {
    serverHealth = new Map();
    healthCheckIntervals = new Map();
    responseTimers = new Map();
    constructor() {
        super();
    }
    startMonitoring(serverId, config) {
        // Initialize health record
        const health = {
            serverId,
            status: 'connecting',
            lastSeen: new Date(),
            responseTime: 0,
            errorCount: 0,
            connectionAttempts: 0,
            toolCount: 0,
            uptime: 0
        };
        this.serverHealth.set(serverId, health);
        // Set up periodic health checks
        const interval = setInterval(() => {
            this.performHealthCheck(serverId);
        }, config.healthCheckInterval);
        this.healthCheckIntervals.set(serverId, interval);
    }
    stopMonitoring(serverId) {
        const interval = this.healthCheckIntervals.get(serverId);
        if (interval) {
            clearInterval(interval);
            this.healthCheckIntervals.delete(serverId);
        }
        this.serverHealth.delete(serverId);
        this.responseTimers.delete(serverId);
    }
    updateServerStatus(serverId, status, error) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return;
        const wasUnhealthy = this.isUnhealthy(health);
        health.status = status;
        health.lastSeen = new Date();
        if (error) {
            health.lastError = error;
            health.errorCount++;
        }
        if (status === 'connected') {
            health.connectionAttempts = 0;
            // Calculate uptime
            const now = Date.now();
            health.uptime = now;
        }
        else if (status === 'connecting') {
            health.connectionAttempts++;
        }
        this.serverHealth.set(serverId, health);
        this.emit('health:updated', serverId, health);
        // Check for health state changes
        const isNowUnhealthy = this.isUnhealthy(health);
        if (!wasUnhealthy && isNowUnhealthy) {
            this.emit('server:unhealthy', serverId, health);
        }
        else if (wasUnhealthy && !isNowUnhealthy) {
            this.emit('server:recovered', serverId, health);
        }
    }
    recordRequestStart(serverId, messageId) {
        this.responseTimers.set(serverId, {
            start: Date.now(),
            messageId
        });
    }
    recordRequestEnd(serverId, messageId, success) {
        const timer = this.responseTimers.get(serverId);
        if (!timer || timer.messageId !== messageId)
            return;
        const responseTime = Date.now() - timer.start;
        this.responseTimers.delete(serverId);
        const health = this.serverHealth.get(serverId);
        if (!health)
            return;
        // Update response time (rolling average)
        if (health.responseTime === 0) {
            health.responseTime = responseTime;
        }
        else {
            health.responseTime = (health.responseTime * 0.8) + (responseTime * 0.2);
        }
        if (!success) {
            health.errorCount++;
        }
        health.lastSeen = new Date();
        this.serverHealth.set(serverId, health);
        this.emit('health:updated', serverId, health);
    }
    updateToolCount(serverId, count) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return;
        health.toolCount = count;
        this.serverHealth.set(serverId, health);
        this.emit('health:updated', serverId, health);
    }
    updateCapabilities(serverId, capabilities) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return;
        health.capabilities = capabilities;
        this.serverHealth.set(serverId, health);
        this.emit('health:updated', serverId, health);
    }
    getServerHealth(serverId) {
        return this.serverHealth.get(serverId) || null;
    }
    getAllServerHealth() {
        return new Map(this.serverHealth);
    }
    generateHealthReport() {
        const servers = {};
        let connectedServers = 0;
        let totalTools = 0;
        let externalTools = 0;
        for (const [serverId, health] of this.serverHealth) {
            servers[serverId] = health;
            if (health.status === 'connected') {
                connectedServers++;
            }
            totalTools += health.toolCount;
            externalTools += health.toolCount;
        }
        return {
            generated: new Date(),
            servers,
            totalServers: this.serverHealth.size,
            connectedServers,
            totalTools,
            builtinTools: 0, // Will be updated by the main hub
            externalTools
        };
    }
    async performHealthCheck(serverId) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return;
        // Simple ping check - could be enhanced with actual MCP ping
        const now = new Date();
        const timeSinceLastSeen = now.getTime() - health.lastSeen.getTime();
        // Consider server unhealthy if no activity for 2 minutes
        if (timeSinceLastSeen > 120000 && health.status === 'connected') {
            this.updateServerStatus(serverId, 'error', 'Health check timeout');
        }
    }
    isUnhealthy(health) {
        return (health.status === 'error' ||
            health.status === 'disconnected' ||
            health.errorCount > 10 ||
            health.responseTime > 30000 // 30 seconds
        );
    }
    // Utility methods for health analysis
    getHealthScore(serverId) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return 0;
        let score = 100;
        // Deduct points for errors
        score -= Math.min(health.errorCount * 2, 50);
        // Deduct points for slow response times
        if (health.responseTime > 1000) {
            score -= Math.min((health.responseTime - 1000) / 100, 30);
        }
        // Deduct points for disconnected status
        if (health.status !== 'connected') {
            score -= 40;
        }
        // Deduct points for connection attempts
        score -= Math.min(health.connectionAttempts * 5, 20);
        return Math.max(score, 0);
    }
    getServerMetrics(serverId) {
        const health = this.serverHealth.get(serverId);
        if (!health)
            return null;
        const healthScore = this.getHealthScore(serverId);
        // Calculate availability based on uptime vs total time
        const totalTime = Date.now() - (health.uptime || Date.now());
        const availability = totalTime > 0 ? (health.uptime / totalTime) * 100 : 0;
        // Error rate calculation would need more detailed tracking
        const errorRate = health.errorCount > 0 ? (health.errorCount / (health.errorCount + 100)) * 100 : 0;
        return {
            healthScore,
            availability,
            averageResponseTime: health.responseTime,
            errorRate
        };
    }
    destroy() {
        // Clear all intervals
        for (const interval of this.healthCheckIntervals.values()) {
            clearInterval(interval);
        }
        this.healthCheckIntervals.clear();
        this.serverHealth.clear();
        this.responseTimers.clear();
        this.removeAllListeners();
    }
}
exports.HealthMonitor = HealthMonitor;
//# sourceMappingURL=health-monitor.js.map