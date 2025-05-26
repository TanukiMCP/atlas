import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolExecutionResult, PerformanceMetrics } from '../types/tool-router-types';
export interface PerformanceMonitorEvents {
    'performance:degraded': (toolId: string, metrics: PerformanceMetrics) => void;
    'performance:improved': (toolId: string, metrics: PerformanceMetrics) => void;
    'threshold:exceeded': (toolId: string, metric: string, value: number, threshold: number) => void;
}
export declare class PerformanceMonitor extends EventEmitter<PerformanceMonitorEvents> {
    private toolMetrics;
    private performanceThresholds;
    private monitoringInterval?;
    private isMonitoring;
    constructor();
    startMonitoring(): void;
    stopMonitoring(): void;
    recordExecution(tool: UnifiedTool, result: ToolExecutionResult): void;
    private getOrCreateMetrics;
    private calculateTrend;
    private checkPerformanceThresholds;
    private analyzePerformance;
    private calculateWeeklyUsage;
    private detectPerformanceDegradation;
    private convertToPerformanceMetrics;
    getToolMetrics(toolId: string): Promise<PerformanceMetrics>;
    getAllMetrics(): Map<string, PerformanceMetrics>;
    getTopPerformingTools(limit?: number): string[];
    shutdown(): Promise<void>;
}
//# sourceMappingURL=performance-monitor.d.ts.map