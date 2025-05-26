"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMonitor = void 0;
class SystemMonitor {
    metricsCache = new Map();
    lastUpdate = 0;
    updateInterval = 5000; // 5 seconds
    async getSystemInfo() {
        const os = require('os');
        const { execSync } = require('child_process');
        // CPU Information
        const cpus = os.cpus();
        const cpu = {
            brand: this.getCPUBrand(),
            model: cpus[0]?.model || 'Unknown',
            cores: cpus.length,
            threads: cpus.length, // Simplified
            clockSpeed: cpus[0]?.speed || 0,
            architecture: os.arch(),
            cache: await this.getCPUCache()
        };
        // Memory Information
        const memory = {
            total: Math.round(os.totalmem() / (1024 ** 3)),
            available: Math.round(os.freemem() / (1024 ** 3)),
            used: Math.round((os.totalmem() - os.freemem()) / (1024 ** 3)),
            type: await this.getMemoryType(),
            speed: await this.getMemorySpeed(),
            slots: await this.getMemorySlots()
        };
        return {
            cpu,
            memory,
            gpu: await this.detectGPUs(),
            storage: await this.getStorageInfo()
        };
    }
    getCPUBrand() {
        const os = require('os');
        const cpus = os.cpus();
        if (cpus[0]?.model.includes('Intel'))
            return 'Intel';
        if (cpus[0]?.model.includes('AMD'))
            return 'AMD';
        return 'Unknown';
    }
    async getCPUCache() {
        // Platform-specific cache detection would go here
        return {
            l1d: undefined,
            l1i: undefined,
            l2: undefined,
            l3: undefined
        };
    }
    async getMemoryType() {
        // Memory type detection (DDR4, DDR5, etc.)
        return 'DDR4'; // Simplified
    }
    async getMemorySpeed() {
        // Memory speed detection
        return undefined;
    }
    async getMemorySlots() {
        // Memory slot detection
        return 4; // Simplified
    }
    async detectGPUs() {
        try {
            const { execSync } = require('child_process');
            if (process.platform === 'win32') {
                return await this.detectWindowsGPUs();
            }
            else if (process.platform === 'linux') {
                return await this.detectLinuxGPUs();
            }
            else if (process.platform === 'darwin') {
                return await this.detectMacGPUs();
            }
            return [];
        }
        catch (error) {
            console.error('GPU detection failed:', error);
            return [];
        }
    }
    async detectWindowsGPUs() {
        try {
            const { execSync } = require('child_process');
            // Use wmic to get GPU information
            const output = execSync('wmic path win32_VideoController get name,AdapterRAM', { encoding: 'utf8' });
            // Parse output and return GPU info
            return [];
        }
        catch (error) {
            return [];
        }
    }
    async detectLinuxGPUs() {
        // Linux GPU detection using lspci, nvidia-smi, etc.
        return [];
    }
    async detectMacGPUs() {
        // macOS GPU detection using system_profiler
        return [];
    }
    async getStorageInfo() {
        const os = require('os');
        return {
            drives: [{
                    name: 'Primary Drive',
                    type: 'SSD',
                    size: 500, // GB - simplified
                    available: 250,
                    speed: undefined
                }]
        };
    }
    async getCurrentMetrics() {
        const now = Date.now();
        if (now - this.lastUpdate < this.updateInterval) {
            return this.metricsCache.get('current') || this.getDefaultMetrics();
        }
        const metrics = await this.collectMetrics();
        this.metricsCache.set('current', metrics);
        this.lastUpdate = now;
        return metrics;
    }
    async collectMetrics() {
        const os = require('os');
        return {
            cpu: {
                usage: await this.getCPUUsage(),
                temperature: undefined,
                frequency: os.cpus()[0]?.speed || 0
            },
            memory: {
                usage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
                available: Math.round(os.freemem() / (1024 ** 3)),
                cached: 0
            },
            gpu: [],
            disk: {
                readSpeed: 0,
                writeSpeed: 0,
                usage: 0
            }
        };
    }
    async getCPUUsage() {
        // CPU usage calculation
        return Math.random() * 100; // Simplified
    }
    getDefaultMetrics() {
        return {
            cpu: { usage: 0, frequency: 0 },
            memory: { usage: 0, available: 0, cached: 0 },
            gpu: [],
            disk: { readSpeed: 0, writeSpeed: 0, usage: 0 }
        };
    }
}
exports.SystemMonitor = SystemMonitor;
//# sourceMappingURL=system-monitor.js.map