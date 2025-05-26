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
        result: Setting[];
    };
    'chat:createSession': {
        params: [NewChatSessionData];
        result: ChatSession;
    };
    'chat:getSession': {
        params: [string];
        result: ChatSession;
    };
    'chat:updateSession': {
        params: [string, Partial<ChatSession>];
        result: boolean;
    };
    'chat:deleteSession': {
        params: [string];
        result: boolean;
    };
    'chat:listSessions': {
        params: [];
        result: ChatSession[];
    };
    'chat:addMessage': {
        params: [NewChatMessage];
        result: ChatMessage;
    };
    'chat:getMessages': {
        params: [string, number?, number?];
        result: ChatMessage[];
    };
    'chat:updateMessage': {
        params: [string, Partial<ChatMessage>];
        result: boolean;
    };
    'chat:deleteMessage': {
        params: [string];
        result: boolean;
    };
    'fs:readFile': {
        params: [string];
        result: string | null;
    };
    'fs:writeFile': {
        params: [string, string];
        result: boolean;
    };
    'fs:exists': {
        params: [string];
        result: boolean;
    };
    'fs:listDirectory': {
        params: [string];
        result: FileSystemEntry[];
    };
    'fs:createDirectory': {
        params: [string];
        result: boolean;
    };
    'project:create': {
        params: [NewProjectData];
        result: Project;
    };
    'project:open': {
        params: [string];
        result: Project;
    };
    'project:list': {
        params: [];
        result: Project[];
    };
    'project:update': {
        params: [string, Partial<Project>];
        result: boolean;
    };
    'project:delete': {
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
    'model:list': {
        params: [];
        result: ModelInfo[];
    };
    'model:install': {
        params: [string];
        result: boolean;
    };
    'model:uninstall': {
        params: [string];
        result: boolean;
    };
    'model:getStatus': {
        params: [string];
        result: ModelStatus;
    };
    'mcp:listServers': {
        params: [];
        result: MCPServerInfo[];
    };
    'mcp:addServer': {
        params: [MCPServerConfig];
        result: boolean;
    };
    'mcp:removeServer': {
        params: [string];
        result: boolean;
    };
    'mcp:getServerStatus': {
        params: [string];
        result: MCPServerStatus;
    };
    'mode:list': {
        params: [];
        result: SubjectMode[];
    };
    'mode:get': {
        params: [string];
        result: SubjectMode;
    };
    'mode:set': {
        params: [string];
        result: boolean;
    };
    'mode:create': {
        params: [NewSubjectMode];
        result: SubjectMode;
    };
    'mode:update': {
        params: [string, Partial<SubjectMode>];
        result: boolean;
    };
    'mode:delete': {
        params: [string];
        result: boolean;
    };
}
export interface Setting {
    key: string;
    value: any;
    category: string;
    description?: string;
    isUserConfigurable: boolean;
    updated: number;
}
export interface Project {
    id: string;
    name: string;
    path: string;
    description?: string;
    language?: string;
    framework?: string;
    created: number;
    updated: number;
    lastOpened?: number;
    isActive: boolean;
    settings?: any;
}
export interface NewProjectData {
    name: string;
    path: string;
    description?: string;
    language?: string;
    framework?: string;
}
export interface ChatSession {
    id: string;
    projectId?: string;
    title: string;
    description?: string;
    created: number;
    updated: number;
    isArchived: boolean;
    isFavorite: boolean;
    messageCount: number;
    tags?: string[];
    subjectMode: string;
    modelUsed?: string;
    totalTokens: number;
    executionTime: number;
}
export interface NewChatSessionData {
    title: string;
    description?: string;
    projectId?: string;
    subjectMode?: string;
}
export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    metadata?: any;
    timestamp: number;
    parentMessageId?: string;
    toolsUsed?: string[];
    executionTime?: number;
    tokenCount?: number;
    model?: string;
    temperature?: number;
    complexity?: 'atomic' | 'moderate' | 'complex' | 'expert';
    qualityScore?: number;
}
export interface NewChatMessage {
    sessionId: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    metadata?: any;
    parentMessageId?: string;
    toolsUsed?: string[];
    executionTime?: number;
    tokenCount?: number;
    model?: string;
    temperature?: number;
    complexity?: 'atomic' | 'moderate' | 'complex' | 'expert';
    qualityScore?: number;
}
export interface FileSystemEntry {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    modified?: number;
    created?: number;
}
export interface ModelInfo {
    name: string;
    displayName: string;
    size: number;
    isInstalled: boolean;
    isDefault: boolean;
    parameters?: any;
    performance?: ModelPerformance;
    downloadProgress?: number;
}
export interface ModelPerformance {
    tokensPerSecond: number;
    ramUsage: number;
    vramUsage?: number;
    averageResponseTime: number;
    lastBenchmark: number;
}
export interface ModelStatus {
    name: string;
    status: 'available' | 'downloading' | 'installing' | 'ready' | 'error';
    progress?: number;
    error?: string;
}
export interface MCPServerInfo {
    id: string;
    name: string;
    description?: string;
    status: 'connected' | 'disconnected' | 'error';
    version?: string;
    capabilities?: string[];
    tools?: MCPTool[];
}
export interface MCPServerConfig {
    name: string;
    description?: string;
    transport: {
        type: 'stdio' | 'sse' | 'websocket';
        command?: string;
        args?: string[];
        env?: Record<string, string>;
        url?: string;
        headers?: Record<string, string>;
    };
    security?: {
        sandboxed: boolean;
        allowedPaths: string[];
        blockedCommands: string[];
        maxExecutionTime: number;
        maxMemoryUsage: number;
    };
    autoRestart?: boolean;
}
export interface MCPServerStatus {
    id: string;
    status: 'connected' | 'disconnected' | 'error' | 'connecting';
    lastConnected?: number;
    lastError?: string;
    responseTime?: number;
    uptime?: number;
    healthScore?: number;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any;
    source: string;
    reliability: 'high' | 'medium' | 'low';
    latency: 'instant' | 'fast' | 'medium' | 'slow';
}
export interface SubjectMode {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    tools: string[];
    prompts?: any;
    systemPrompt?: string;
    isActive: boolean;
    isBuiltIn: boolean;
    created: number;
    updated: number;
    usageCount: number;
    color?: string;
    shortcuts?: any;
}
export interface NewSubjectMode {
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    tools: string[];
    prompts?: any;
    systemPrompt?: string;
    color?: string;
    shortcuts?: any;
}
export interface IPCEvents {
    'chat:messageAdded': ChatMessage;
    'chat:sessionUpdated': ChatSession;
    'model:downloadProgress': {
        modelName: string;
        progress: number;
    };
    'mcp:serverStatusChanged': {
        serverId: string;
        status: MCPServerStatus;
    };
    'app:notification': Notification;
    'app:error': {
        code: string;
        message: string;
        details?: any;
    };
}
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    persistent?: boolean;
    actions?: NotificationAction[];
}
export interface NotificationAction {
    label: string;
    action: string;
    primary?: boolean;
}
export interface IPCError {
    code: string;
    message: string;
    details?: any;
    stack?: string;
}
export interface IPCResponse<T = any> {
    success: boolean;
    data?: T;
    error?: IPCError;
}
export type IPCChannelMap = {
    [K in keyof IPCChannels]: {
        request: IPCChannels[K]['params'];
        response: IPCChannels[K]['result'];
    };
};
//# sourceMappingURL=ipc.d.ts.map