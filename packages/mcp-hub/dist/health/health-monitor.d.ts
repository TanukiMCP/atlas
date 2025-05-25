import { EventEmitter } from 'events';
import { ServerHealth, ServerStatus, HealthReport, MCPServerConfig } from '../types';
export interface HealthMonitorEvents {
    'health:updated': (serverId: string, health: ServerHealth) => void;
    'server:unhealthy': (serverId: string, health: ServerHealth) => void;
    'server:recovered': (serverId: string, health: ServerHealth) => void;
}
export declare class HealthMonitor extends EventEmitter {
    private serverHealth;
    private healthCheckIntervals;
    private responseTimers;
    constructor();
    startMonitoring(serverId: string, config: MCPServerConfig): void;
    stopMonitoring(serverId: string): void;
    updateServerStatus(serverId: string, status: ServerStatus, error?: string): void;
    recordRequestStart(serverId: string, messageId: string): void;
    recordRequestEnd(serverId: string, messageId: string, success: boolean): void;
    updateToolCount(serverId: string, count: number): void;
    updateCapabilities(serverId: string, capabilities: {
        tools: boolean;
        resources: boolean;
        prompts: boolean;
    }): void;
    getServerHealth(serverId: string): ServerHealth | null;
    getAllServerHealth(): Map<string, ServerHealth>;
    generateHealthReport(): HealthReport;
    private performHealthCheck;
    private isUnhealthy;
    getHealthScore(serverId: string): number;
    getServerMetrics(serverId: string): {
        healthScore: number;
        availability: number;
        averageResponseTime: number;
        errorRate: number;
    } | null;
    destroy(): void;
}
