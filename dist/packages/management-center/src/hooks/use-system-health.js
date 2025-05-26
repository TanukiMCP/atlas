"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSystemHealth = void 0;
const react_1 = require("react");
const useSystemHealth = () => {
    const [systemHealth, setSystemHealth] = (0, react_1.useState)(null);
    const [systemMetrics, setSystemMetrics] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = (0, react_1.useState)(true);
    const fetchSystemHealth = (0, react_1.useCallback)(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Simulate API call - replace with actual system health API
            const health = {
                status: 'healthy',
                uptime: Date.now() - 3600000, // 1 hour ago
                cpu: {
                    usage: Math.random() * 100,
                    cores: 8,
                    load: [0.1, 0.2, 0.15]
                },
                memory: {
                    usage: Math.random() * 80,
                    total: 16 * 1024 * 1024 * 1024, // 16GB
                    used: 8 * 1024 * 1024 * 1024, // 8GB
                    free: 8 * 1024 * 1024 * 1024 // 8GB
                },
                disk: {
                    usage: Math.random() * 60,
                    total: 1000 * 1024 * 1024 * 1024, // 1TB
                    used: 600 * 1024 * 1024 * 1024, // 600GB
                    free: 400 * 1024 * 1024 * 1024 // 400GB
                },
                timestamp: Date.now()
            };
            const metrics = {
                healthScore: 85 + Math.random() * 15,
                responseTime: 50 + Math.random() * 100,
                errorRate: Math.random() * 5,
                activeConnections: Math.floor(Math.random() * 100),
                throughput: Math.random() * 1000,
                timestamp: Date.now()
            };
            setSystemHealth(health);
            setSystemMetrics(metrics);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch system health');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const refreshHealth = (0, react_1.useCallback)(async () => {
        await fetchSystemHealth();
    }, [fetchSystemHealth]);
    const toggleAutoRefresh = (0, react_1.useCallback)(() => {
        setIsAutoRefreshEnabled(prev => !prev);
    }, []);
    (0, react_1.useEffect)(() => {
        fetchSystemHealth();
    }, [fetchSystemHealth]);
    (0, react_1.useEffect)(() => {
        if (!isAutoRefreshEnabled)
            return;
        const interval = setInterval(() => {
            fetchSystemHealth();
        }, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [isAutoRefreshEnabled, fetchSystemHealth]);
    return {
        systemHealth,
        systemMetrics,
        isLoading,
        error,
        refreshHealth,
        toggleAutoRefresh,
        isAutoRefreshEnabled
    };
};
exports.useSystemHealth = useSystemHealth;
//# sourceMappingURL=use-system-health.js.map