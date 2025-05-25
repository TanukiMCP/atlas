import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolExecutionResult, PerformanceMetrics } from '../types/tool-router-types';

export interface PerformanceMonitorEvents {
  'performance:degraded': (toolId: string, metrics: PerformanceMetrics) => void;
  'performance:improved': (toolId: string, metrics: PerformanceMetrics) => void;
  'threshold:exceeded': (toolId: string, metric: string, value: number, threshold: number) => void;
}

interface ToolMetrics {
  toolId: string;
  executionTimes: number[];
  successCount: number;
  totalCount: number;
  lastExecution: Date;
  averageExecutionTime: number;
  successRate: number;
  trendDirection: 'up' | 'down' | 'stable';
  weeklyUsage: number;
}

export class PerformanceMonitor extends EventEmitter<PerformanceMonitorEvents> {
  private toolMetrics: Map<string, ToolMetrics> = new Map();
  private performanceThresholds = {
    maxExecutionTime: 10000, // 10 seconds
    minSuccessRate: 80, // 80%
    maxFailureStreak: 3
  };
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring: boolean = false;

  constructor() {
    super();
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Check performance metrics every minute
    this.monitoringInterval = setInterval(() => {
      this.analyzePerformance();
    }, 60000);
    
    console.log('Performance monitoring started');
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }

  recordExecution(tool: UnifiedTool, result: ToolExecutionResult): void {
    const metrics = this.getOrCreateMetrics(tool.id);
    
    // Update execution times (keep last 100 executions)
    metrics.executionTimes.push(result.executionTime);
    if (metrics.executionTimes.length > 100) {
      metrics.executionTimes.shift();
    }
    
    // Update counts
    metrics.totalCount++;
    if (result.success) {
      metrics.successCount++;
    }
    
    // Update calculated metrics
    metrics.lastExecution = new Date();
    metrics.averageExecutionTime = metrics.executionTimes.reduce((sum, time) => sum + time, 0) / metrics.executionTimes.length;
    metrics.successRate = (metrics.successCount / metrics.totalCount) * 100;
    
    // Update trend
    metrics.trendDirection = this.calculateTrend(metrics.executionTimes);
    
    // Check for performance issues
    this.checkPerformanceThresholds(tool.id, metrics);
    
    // Update tool object
    tool.averageExecutionTime = metrics.averageExecutionTime;
    tool.successRate = metrics.successRate;
    tool.usageCount = metrics.totalCount;
    tool.lastUsed = metrics.lastExecution;
  }

  private getOrCreateMetrics(toolId: string): ToolMetrics {
    let metrics = this.toolMetrics.get(toolId);
    
    if (!metrics) {
      metrics = {
        toolId,
        executionTimes: [],
        successCount: 0,
        totalCount: 0,
        lastExecution: new Date(),
        averageExecutionTime: 0,
        successRate: 100,
        trendDirection: 'stable',
        weeklyUsage: 0
      };
      
      this.toolMetrics.set(toolId, metrics);
    }
    
    return metrics;
  }  private calculateTrend(executionTimes: number[]): 'up' | 'down' | 'stable' {
    if (executionTimes.length < 10) return 'stable';
    
    const recent = executionTimes.slice(-10);
    const older = executionTimes.slice(-20, -10);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, time) => sum + time, 0) / recent.length;
    const olderAvg = older.reduce((sum, time) => sum + time, 0) / older.length;
    
    const difference = (recentAvg - olderAvg) / olderAvg;
    
    if (difference > 0.1) return 'up'; // 10% slower
    if (difference < -0.1) return 'down'; // 10% faster
    return 'stable';
  }

  private checkPerformanceThresholds(toolId: string, metrics: ToolMetrics): void {
    // Check execution time threshold
    if (metrics.averageExecutionTime > this.performanceThresholds.maxExecutionTime) {
      this.emit('threshold:exceeded', toolId, 'execution_time', metrics.averageExecutionTime, this.performanceThresholds.maxExecutionTime);
    }
    
    // Check success rate threshold
    if (metrics.successRate < this.performanceThresholds.minSuccessRate) {
      this.emit('threshold:exceeded', toolId, 'success_rate', metrics.successRate, this.performanceThresholds.minSuccessRate);
      this.emit('performance:degraded', toolId, this.convertToPerformanceMetrics(metrics));
    }
    
    // Check for performance improvements
    if (metrics.trendDirection === 'down' && metrics.successRate > 95) {
      this.emit('performance:improved', toolId, this.convertToPerformanceMetrics(metrics));
    }
  }

  private analyzePerformance(): void {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    for (const [toolId, metrics] of this.toolMetrics.entries()) {
      // Update weekly usage
      if (metrics.lastExecution > oneWeekAgo) {
        metrics.weeklyUsage = this.calculateWeeklyUsage(metrics);
      }
      
      // Detect performance degradation patterns
      if (this.detectPerformanceDegradation(metrics)) {
        this.emit('performance:degraded', toolId, this.convertToPerformanceMetrics(metrics));
      }
    }
  }

  private calculateWeeklyUsage(metrics: ToolMetrics): number {
    // Simplified - in real implementation, would track daily usage
    return metrics.totalCount;
  }

  private detectPerformanceDegradation(metrics: ToolMetrics): boolean {
    // Check if performance has consistently degraded
    return metrics.trendDirection === 'up' && 
           metrics.successRate < this.performanceThresholds.minSuccessRate;
  }

  private convertToPerformanceMetrics(metrics: ToolMetrics): PerformanceMetrics {
    return {
      averageExecutionTime: metrics.averageExecutionTime,
      successRate: metrics.successRate,
      usageFrequency: metrics.weeklyUsage,
      lastWeekUsage: metrics.weeklyUsage,
      trendDirection: metrics.trendDirection
    };
  }

  async getToolMetrics(toolId: string): Promise<PerformanceMetrics> {
    const metrics = this.toolMetrics.get(toolId);
    
    if (!metrics) {
      return {
        averageExecutionTime: 0,
        successRate: 100,
        usageFrequency: 0,
        lastWeekUsage: 0,
        trendDirection: 'stable'
      };
    }
    
    return this.convertToPerformanceMetrics(metrics);
  }

  getAllMetrics(): Map<string, PerformanceMetrics> {
    const result = new Map<string, PerformanceMetrics>();
    
    for (const [toolId, metrics] of this.toolMetrics.entries()) {
      result.set(toolId, this.convertToPerformanceMetrics(metrics));
    }
    
    return result;
  }

  getTopPerformingTools(limit: number = 10): string[] {
    return Array.from(this.toolMetrics.entries())
      .sort((a, b) => {
        const scoreA = a[1].successRate - (a[1].averageExecutionTime / 1000);
        const scoreB = b[1].successRate - (b[1].averageExecutionTime / 1000);
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(([toolId]) => toolId);
  }

  async shutdown(): Promise<void> {
    this.stopMonitoring();
    this.removeAllListeners();
    this.toolMetrics.clear();
  }
}