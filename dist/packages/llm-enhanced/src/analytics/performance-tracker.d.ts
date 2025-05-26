import { EventEmitter } from 'eventemitter3';
import { ProcessingRequest, ProcessingResponse, ProcessingTier, OptimizationSuggestion } from '../types/llm-types';
export interface PerformanceTrackerEvents {
    'optimization:suggestion': (suggestion: OptimizationSuggestion) => void;
    'performance:degraded': (tier: ProcessingTier, metrics: PerformanceMetrics) => void;
    'performance:improved': (tier: ProcessingTier, improvement: number) => void;
}
export interface PerformanceMetrics {
    tier: ProcessingTier;
    averageResponseTime: number;
    averageQualityScore: number;
    successRate: number;
    userSatisfactionScore: number;
    resourceEfficiency: number;
    throughput: number;
    errorRate: number;
    timestamp: Date;
}
export interface ProcessingRecord {
    requestId: string;
    tier: ProcessingTier;
    startTime: Date;
    endTime: Date;
    duration: number;
    qualityScore: number;
    success: boolean;
    userSatisfaction?: number;
    resourceUsage: ResourceUsage;
    errorType?: string;
}
export interface ResourceUsage {
    cpuUsage: number;
    memoryUsage: number;
    modelLoadTime: number;
    tokensProcessed: number;
}
export declare class PerformanceTracker extends EventEmitter<PerformanceTrackerEvents> {
    private processingHistory;
    private performanceMetrics;
    private optimizationRules;
    private metricsWindow;
    private analysisInterval?;
    constructor();
    recordProcessing(request: ProcessingRequest, response: ProcessingResponse): void;
    recordFailure(request: ProcessingRequest, tier: ProcessingTier, error: Error): void;
    recordUserSatisfaction(requestId: string, satisfaction: number): void;
    getCurrentMetrics(tier: ProcessingTier): PerformanceMetrics | undefined;
    getPerformanceTrends(tier: ProcessingTier, timeWindow?: number): PerformanceMetrics[];
    getOptimizationSuggestions(): Promise<OptimizationSuggestion[]>;
    analyzeRoutingAccuracy(): RoutingAnalysis;
    getTierUtilization(): Record<ProcessingTier, TierUtilization>;
    private updateTierMetrics;
    private analyzeOptimizationOpportunities;
    private estimateResourceUsage;
    private wasRoutingOptimal;
    private calculateAverage;
    private calculateResourceEfficiency;
    private calculateThroughput;
    private generateRoutingImprovement;
    private initializeOptimizationRules;
    private startPeriodicAnalysis;
    private performPeriodicAnalysis;
    shutdown(): void;
}
interface RoutingAnalysis {
    accuracy: number;
    totalRequests: number;
    correctlyRouted: number;
    suggestions: string[];
}
interface TierUtilization {
    usage: number;
    avgDuration: number;
    avgQuality: number;
}
export {};
//# sourceMappingURL=performance-tracker.d.ts.map