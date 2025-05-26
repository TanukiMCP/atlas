export interface IPCChannels {
    'db:query': {
        params: [string, any[]?];
        result: any;
    };
    'db:health': {
        params: [];
        result: {
            isHealthy: boolean;
            details: any;
        };
    };
    'app:getVersion': {
        params: [];
        result: string;
    };
    'app:getPath': {
        params: [string];
        result: string;
    };
    'settings:get': {
        params: [string];
        result: any;
    };
    'settings:set': {
        params: [string, any];
        result: void;
    };
    'settings:getAll': {
        params: [];
        result: any[];
    };
    'chat:createSession': {
        params: [any];
        result: any;
    };
    'chat:getSession': {
        params: [string];
        result: any;
    };
    'chat:updateSession': {
        params: [string, any];
        result: any;
    };
    'chat:deleteSession': {
        params: [string];
        result: void;
    };
    'chat:listSessions': {
        params: [];
        result: any[];
    };
    'fs:readFile': {
        params: [string];
        result: string | null;
    };
    'fs:writeFile': {
        params: [string, string];
        result: void;
    };
    'fs:exists': {
        params: [string];
        result: boolean;
    };
    'ollama:listModels': {
        params: [];
        result: any[];
    };
    'ollama:getModelCatalog': {
        params: [];
        result: any[];
    };
    'ollama:installModel': {
        params: [string];
        result: void;
    };
    'ollama:deleteModel': {
        params: [string];
        result: void;
    };
    'ollama:generate': {
        params: [any];
        result: any;
    };
    'ollama:checkHealth': {
        params: [];
        result: boolean;
    };
    'ollama:benchmarkModel': {
        params: [string];
        result: any;
    };
    'system:getCapabilities': {
        params: [];
        result: any;
    };
    'system:getCurrentMetrics': {
        params: [];
        result: any;
    };
    'models:getRecommendations': {
        params: [];
        result: any[];
    };
    'models:getInstallationStatus': {
        params: [string];
        result: any;
    };
    'optimization:getProfiles': {
        params: [];
        result: any[];
    };
    'optimization:getActiveProfile': {
        params: [];
        result: any;
    };
    'optimization:setProfile': {
        params: [string];
        result: void;
    };
    'optimization:optimizeForHardware': {
        params: [any];
        result: any;
    };
    'parameters:getPreset': {
        params: [string];
        result: any;
    };
    'parameters:getAllPresets': {
        params: [];
        result: any;
    };
    'parameters:optimizeForTask': {
        params: [string, string];
        result: any;
    };
    'context:store': {
        params: [string, string, string, string, number?];
        result: void;
    };
    'context:retrieve': {
        params: [string, string, number?];
        result: any[];
    };
    'context:optimize': {
        params: [string];
        result: void;
    };
}
export declare function setupIPC(): void;
export declare function cleanupIPC(): void;
//# sourceMappingURL=handlers.d.ts.map