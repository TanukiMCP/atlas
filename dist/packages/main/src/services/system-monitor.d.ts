interface SystemInfo {
    cpu: {
        brand: string;
        model: string;
        cores: number;
        threads: number;
        clockSpeed: number;
        architecture: string;
        cache: {
            l1d?: number;
            l1i?: number;
            l2?: number;
            l3?: number;
        };
    };
    memory: {
        total: number;
        available: number;
        used: number;
        type: string;
        speed?: number;
        slots: number;
    };
    gpu: {
        name: string;
        vendor: string;
        vram: number;
        driver?: string;
        computeCapability?: string;
        supports: string[];
    }[];
    storage: {
        drives: {
            name: string;
            type: 'SSD' | 'HDD' | 'NVMe';
            size: number;
            available: number;
            speed?: number;
        }[];
    };
}
interface PerformanceMetrics {
    cpu: {
        usage: number;
        temperature?: number;
        frequency: number;
    };
    memory: {
        usage: number;
        available: number;
        cached: number;
    };
    gpu: {
        usage: number;
        memory: number;
        temperature?: number;
    }[];
    disk: {
        readSpeed: number;
        writeSpeed: number;
        usage: number;
    };
}
export declare class SystemMonitor {
    private metricsCache;
    private lastUpdate;
    private updateInterval;
    getSystemInfo(): Promise<SystemInfo>;
    private getCPUBrand;
    private getCPUCache;
    private getMemoryType;
    private getMemorySpeed;
    private getMemorySlots;
    private detectGPUs;
    private detectWindowsGPUs;
    private detectLinuxGPUs;
    private detectMacGPUs;
    private getStorageInfo;
    getCurrentMetrics(): Promise<PerformanceMetrics>;
    private collectMetrics;
    private getCPUUsage;
    private getDefaultMetrics;
}
export {};
//# sourceMappingURL=system-monitor.d.ts.map