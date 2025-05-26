"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTracker = void 0;
const eventemitter3_1 = require("eventemitter3");
class PerformanceTracker extends eventemitter3_1.EventEmitter {
    processingHistory = [];
    performanceMetrics = new Map();
    optimizationRules = [];
    metricsWindow = 1000; // Keep last 1000 records per tier
    analysisInterval;
    constructor() {
        super();
        this.initializeOptimizationRules();
        this.startPeriodicAnalysis();
    }
    // Record processing execution for analysis
    recordProcessing(request, response) {
        const record = {
            requestId: request.id,
            tier: response.tier,
            startTime: new Date(Date.now() - response.processingTime),
            endTime: new Date(),
            duration: response.processingTime,
            qualityScore: response.qualityScore,
            success: true,
            resourceUsage: this.estimateResourceUsage(request, response)
        };
        this.processingHistory.push(record);
        // Maintain window size
        if (this.processingHistory.length > this.metricsWindow * 4) {
            this.processingHistory = this.processingHistory.slice(-this.metricsWindow * 4);
        }
        // Update metrics for this tier
        this.updateTierMetrics(response.tier);
        // Check for optimization opportunities
        this.analyzeOptimizationOpportunities(response.tier);
    }
    // Record processing failure
    recordFailure(request, tier, error) {
        const record = {
            requestId: request.id,
            tier,
            startTime: new Date(),
            endTime: new Date(),
            duration: 0,
            qualityScore: 0,
            success: false,
            errorType: error.name,
            resourceUsage: {
                cpuUsage: 0,
                memoryUsage: 0,
                modelLoadTime: 0,
                tokensProcessed: 0
            }
        };
        this.processingHistory.push(record);
        this.updateTierMetrics(tier);
    }
    // Record user satisfaction feedback
    recordUserSatisfaction(requestId, satisfaction) {
        const record = this.processingHistory.find(r => r.requestId === requestId);
        if (record) {
            record.userSatisfaction = satisfaction;
            this.updateTierMetrics(record.tier);
        }
    }
    // Get current performance metrics for a tier
    getCurrentMetrics(tier) {
        const tierMetrics = this.performanceMetrics.get(tier);
        return tierMetrics ? tierMetrics[tierMetrics.length - 1] : undefined;
    }
    // Get performance trends over time
    getPerformanceTrends(tier, timeWindow = 3600000) {
        const cutoff = new Date(Date.now() - timeWindow);
        const tierMetrics = this.performanceMetrics.get(tier) || [];
        return tierMetrics.filter(m => m.timestamp >= cutoff);
    }
    // Get optimization suggestions
    async getOptimizationSuggestions() {
        const suggestions = [];
        for (const rule of this.optimizationRules) {
            const suggestion = await rule.analyze(this.processingHistory, this.performanceMetrics);
            if (suggestion) {
                suggestions.push(suggestion);
            }
        }
        return suggestions.sort((a, b) => b.expectedImprovement - a.expectedImprovement);
    }
    // Analyze routing accuracy
    analyzeRoutingAccuracy() {
        const recentRecords = this.processingHistory.slice(-100); // Last 100 records
        let correctRouting = 0;
        let totalRouted = 0;
        for (const record of recentRecords) {
            if (record.success) {
                totalRouted++;
                // Determine if routing was optimal based on quality vs time trade-off
                const isOptimal = this.wasRoutingOptimal(record);
                if (isOptimal) {
                    correctRouting++;
                }
            }
        }
        return {
            accuracy: totalRouted > 0 ? correctRouting / totalRouted : 0,
            totalRequests: totalRouted,
            correctlyRouted: correctRouting,
            suggestions: this.generateRoutingImprovement(recentRecords)
        };
    }
    // Get tier utilization statistics
    getTierUtilization() {
        const recentRecords = this.processingHistory.slice(-200);
        const utilization = {
            atomic: { usage: 0, avgDuration: 0, avgQuality: 0 },
            moderate: { usage: 0, avgDuration: 0, avgQuality: 0 },
            complex: { usage: 0, avgDuration: 0, avgQuality: 0 },
            expert: { usage: 0, avgDuration: 0, avgQuality: 0 }
        };
        const tierCounts = {
            atomic: 0, moderate: 0, complex: 0, expert: 0
        };
        for (const record of recentRecords) {
            if (record.success) {
                tierCounts[record.tier]++;
                utilization[record.tier].avgDuration += record.duration;
                utilization[record.tier].avgQuality += record.qualityScore;
            }
        }
        for (const tier of Object.keys(utilization)) {
            const count = tierCounts[tier];
            if (count > 0) {
                utilization[tier].usage = count / recentRecords.length;
                utilization[tier].avgDuration /= count;
                utilization[tier].avgQuality /= count;
            }
        }
        return utilization;
    }
    // Private methods
    updateTierMetrics(tier) {
        const recentRecords = this.processingHistory
            .filter(r => r.tier === tier)
            .slice(-50); // Last 50 records for this tier
        if (recentRecords.length === 0)
            return;
        const successfulRecords = recentRecords.filter(r => r.success);
        const now = new Date();
        const metrics = {
            tier,
            averageResponseTime: this.calculateAverage(successfulRecords.map(r => r.duration)),
            averageQualityScore: this.calculateAverage(successfulRecords.map(r => r.qualityScore)),
            successRate: successfulRecords.length / recentRecords.length,
            userSatisfactionScore: this.calculateAverage(successfulRecords.map(r => r.userSatisfaction).filter(s => s !== undefined)),
            resourceEfficiency: this.calculateResourceEfficiency(successfulRecords),
            throughput: this.calculateThroughput(recentRecords),
            errorRate: (recentRecords.length - successfulRecords.length) / recentRecords.length,
            timestamp: now
        };
        let tierMetrics = this.performanceMetrics.get(tier) || [];
        tierMetrics.push(metrics);
        // Keep only recent metrics
        if (tierMetrics.length > 100) {
            tierMetrics = tierMetrics.slice(-100);
        }
        this.performanceMetrics.set(tier, tierMetrics);
    }
    analyzeOptimizationOpportunities(tier) {
        const metrics = this.getCurrentMetrics(tier);
        if (!metrics)
            return;
        // Check for performance degradation
        if (metrics.successRate < 0.8 || metrics.averageQualityScore < 70) {
            this.emit('performance:degraded', tier, metrics);
        }
        // Check for improvement opportunities
        const previousMetrics = this.performanceMetrics.get(tier);
        if (previousMetrics && previousMetrics.length > 1) {
            const previous = previousMetrics[previousMetrics.length - 2];
            const improvement = metrics.averageQualityScore - previous.averageQualityScore;
            if (improvement > 5) {
                this.emit('performance:improved', tier, improvement);
            }
        }
    }
    estimateResourceUsage(request, response) {
        // Estimate resource usage based on processing time and complexity
        const baseUsage = {
            atomic: { cpu: 10, memory: 50, loadTime: 0 },
            moderate: { cpu: 30, memory: 150, loadTime: 100 },
            complex: { cpu: 60, memory: 300, loadTime: 500 },
            expert: { cpu: 90, memory: 600, loadTime: 1000 }
        };
        const base = baseUsage[response.tier];
        const tokensProcessed = response.metadata.tokensUsed;
        return {
            cpuUsage: base.cpu + (tokensProcessed * 0.1),
            memoryUsage: base.memory + (tokensProcessed * 0.5),
            modelLoadTime: base.loadTime,
            tokensProcessed
        };
    }
    wasRoutingOptimal(record) {
        // Determine if the tier choice was optimal based on quality/time trade-off
        // This is a simplified heuristic - could be more sophisticated
        if (record.tier === 'atomic') {
            return record.duration < 2000 && record.qualityScore > 60;
        }
        else if (record.tier === 'moderate') {
            return record.duration < 8000 && record.qualityScore > 75;
        }
        else if (record.tier === 'complex') {
            return record.duration < 20000 && record.qualityScore > 85;
        }
        else { // expert
            return record.qualityScore > 90;
        }
    }
    calculateAverage(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    calculateResourceEfficiency(records) {
        if (records.length === 0)
            return 0;
        // Quality per unit resource used
        const efficiency = records.map(r => r.qualityScore / (r.resourceUsage.cpuUsage + r.resourceUsage.memoryUsage / 100));
        return this.calculateAverage(efficiency);
    }
    calculateThroughput(records) {
        if (records.length < 2)
            return 0;
        const timeSpan = records[records.length - 1].endTime.getTime() - records[0].startTime.getTime();
        return (records.length / timeSpan) * 60000; // requests per minute
    }
    generateRoutingImprovement(records) {
        const suggestions = [];
        // Analyze patterns and suggest improvements
        const overQualified = records.filter(r => r.tier === 'expert' && r.qualityScore < 85).length;
        if (overQualified > records.length * 0.2) {
            suggestions.push('Consider routing simple requests to lower tiers');
        }
        const underQualified = records.filter(r => r.tier === 'atomic' && r.qualityScore < 70).length;
        if (underQualified > records.length * 0.3) {
            suggestions.push('Route complex requests to higher tiers for better quality');
        }
        return suggestions;
    }
    initializeOptimizationRules() {
        // Initialize optimization analysis rules
        this.optimizationRules = [
            {
                name: 'Tier Rebalancing',
                analyze: async (history, metrics) => {
                    const utilization = this.getTierUtilization();
                    if (utilization.expert.usage > 0.4) {
                        return {
                            type: 'tier_rebalancing',
                            description: 'Expert tier is overutilized. Consider improving lower tiers.',
                            expectedImprovement: 15,
                            autoApplicable: false,
                            parameters: { targetTier: 'complex' }
                        };
                    }
                    return null;
                }
            },
            {
                name: 'Cache Optimization',
                analyze: async (history, metrics) => {
                    const atomicRecords = history.filter(r => r.tier === 'atomic').slice(-50);
                    const cacheableRequests = atomicRecords.length * 0.3; // Estimate
                    if (cacheableRequests > 10) {
                        return {
                            type: 'cache_optimization',
                            description: 'Increase atomic tier cache size for better performance.',
                            expectedImprovement: 8,
                            autoApplicable: true,
                            parameters: { newCacheSize: Math.ceil(cacheableRequests * 1.5) }
                        };
                    }
                    return null;
                }
            }
        ];
    }
    startPeriodicAnalysis() {
        this.analysisInterval = setInterval(() => {
            this.performPeriodicAnalysis();
        }, 60000); // Every minute
    }
    performPeriodicAnalysis() {
        // Clean old data
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
        this.processingHistory = this.processingHistory.filter(r => r.endTime >= cutoff);
        // Generate optimization suggestions
        this.getOptimizationSuggestions().then(suggestions => {
            suggestions.forEach(suggestion => {
                this.emit('optimization:suggestion', suggestion);
            });
        });
    }
    shutdown() {
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
        }
        this.removeAllListeners();
    }
}
exports.PerformanceTracker = PerformanceTracker;
//# sourceMappingURL=performance-tracker.js.map