/**
 * Core types for TanukiMCP Management Center
 */

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: number;
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    usage: number;
    total: number;
    used: number;
    free: number;
  };
  disk: {
    usage: number;
    total: number;
    used: number;
    free: number;
  };
  timestamp: number;
}

export interface SystemMetrics {
  healthScore: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  throughput: number;
  timestamp: number;
}export interface ServerStatus {
  id: string;
  name: string;
  type: 'builtin' | 'external';
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  lastPing: number;
  responseTime: number;
  version?: string;
  endpoint?: string;
  capabilities: string[];
  toolCount: number;
  memoryUsage: number;
  errorCount: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  badge?: string | number;
  disabled?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  handler: () => void;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  handler: () => void;
  disabled?: boolean;
  category: string;
}

export interface StatusIndicator {
  id: string;
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  tooltip?: string;
}