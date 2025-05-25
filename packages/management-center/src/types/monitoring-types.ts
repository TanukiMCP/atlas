/**
 * Monitoring and health tracking types
 */

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  timestamp: number;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  cooldown: number;
  notifications: AlertNotification[];
}

export interface AlertNotification {
  type: 'email' | 'webhook' | 'desktop' | 'log';
  target: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: number;
  resolvedAt?: number;
  acknowledgedAt?: number;
  metadata: Record<string, any>;
}

export interface PerformanceData {
  timestamp: number;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  healthScore: number;
}