import { EventEmitter } from 'eventemitter3';
import { DiscoveredTool } from '../types/tool-router-types';
export interface ToolDiscoveryEvents {
    'tools:discovered': (tools: DiscoveredTool[]) => void;
    'source:connected': (sourceId: string) => void;
    'source:disconnected': (sourceId: string) => void;
    'source:unavailable': (sourceId: string) => void;
    'discovery:complete': (toolCount: number) => void;
    'discovery:error': (sourceId: string, error: Error) => void;
}
export declare class ToolDiscovery extends EventEmitter<ToolDiscoveryEvents> {
    private builtinToolsSource;
    private externalSourcesHub;
    private discoveredTools;
    private sourcesStatus;
    private discoveryInterval?;
    private isDiscovering;
    constructor();
    private initializeSources;
    discoverAllTools(): Promise<DiscoveredTool[]>;
    private discoverBuiltinTools;
    private discoverExternalTools;
    private inferCategory;
    private extractTags;
    getSourceStatus(sourceId: string): Promise<boolean>;
    refreshSource(sourceId: string): Promise<DiscoveredTool[]>;
    startPeriodicDiscovery(intervalMs?: number): void;
    stopPeriodicDiscovery(): void;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=tool-discovery.d.ts.map