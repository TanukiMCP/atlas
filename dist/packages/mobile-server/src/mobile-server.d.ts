export interface MobileServerConfig {
    port: number;
    host: string;
    autoStart: boolean;
    enableHTTPS: boolean;
    maxConnections: number;
    tokenExpiry: number;
}
export interface MobileClient {
    id: string;
    token: string;
    connectedAt: Date;
    lastActivity: Date;
    userAgent: string;
    ipAddress: string;
}
export interface MobileTool {
    name: string;
    description: string;
    category: 'thinking' | 'research' | 'context' | 'image' | 'text';
    parameters: any;
    mobileSafe: boolean;
}
export declare class MobileServer {
    private app;
    private server;
    private io;
    private config;
    private clients;
    private tokens;
    private isRunning;
    constructor(config: MobileServerConfig);
    private setupMiddleware;
    private setupRoutes;
    private setupWebSocket;
    private generateToken;
    private generateQRCode;
    private handleChatMessage;
    private getChatHistory;
    private clearChatHistory;
    private getAvailableTools;
    private executeTool;
    private getHealthStatus;
    private getConnectionStatus;
    private servePWAManifest;
    private serveServiceWorker;
    private authenticateToken;
    private isMobileSafeTool;
    private isLocalNetworkOrigin;
    private forwardToAtlas;
    private getMockMobileTools;
    start(): Promise<void>;
    stop(): Promise<void>;
    getConnectionInfo(): {
        url: string;
        qrCode?: string;
    };
    getConnectedClients(): MobileClient[];
}
declare global {
    namespace Express {
        interface Request {
            clientId?: string;
        }
    }
}
//# sourceMappingURL=mobile-server.d.ts.map