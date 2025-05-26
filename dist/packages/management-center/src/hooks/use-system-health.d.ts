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
export declare const useSystemHealth: () => UseSystemHealthReturn;
//# sourceMappingURL=use-system-health.d.ts.map