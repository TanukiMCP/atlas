import { useState, useEffect, useCallback } from 'react';
import { SystemHealth, SystemMetrics } from '../types/management-types';

export interface UseSystemHealthReturn {
  systemHealth: SystemHealth | null;
  systemMetrics: SystemMetrics | null;
  isLoading: boolean;
  error: string | null;
  refreshHealth: () => Promise<void>;
  toggleAutoRefresh: () => void;
  isAutoRefreshEnabled: boolean;
}

export const useSystemHealth = (): UseSystemHealthReturn => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);

  const fetchSystemHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call - replace with actual system health API
      const health: SystemHealth = {
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
          used: 8 * 1024 * 1024 * 1024,  // 8GB
          free: 8 * 1024 * 1024 * 1024   // 8GB
        },
        disk: {
          usage: Math.random() * 60,
          total: 1000 * 1024 * 1024 * 1024, // 1TB
          used: 600 * 1024 * 1024 * 1024,   // 600GB
          free: 400 * 1024 * 1024 * 1024    // 400GB
        },
        timestamp: Date.now()
      };

      const metrics: SystemMetrics = {
        healthScore: 85 + Math.random() * 15,
        responseTime: 50 + Math.random() * 100,
        errorRate: Math.random() * 5,
        activeConnections: Math.floor(Math.random() * 100),
        throughput: Math.random() * 1000,
        timestamp: Date.now()
      };

      setSystemHealth(health);
      setSystemMetrics(metrics);