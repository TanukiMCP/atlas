interface ContextEntry {
    id: string;
    sessionId: string;
    type: 'file' | 'function' | 'concept' | 'memory';
    key: string;
    value: string;
    vectorEmbedding?: Float32Array;
    importance: number;
    lastUsed: Date;
    created: Date;
}
export declare class ContextManager {
    private vectorCache;
    private mcpContextServer;
    constructor();
    storeContext(sessionId: string, type: ContextEntry['type'], key: string, value: string, importance?: number): Promise<void>;
    retrieveRelevantContext(sessionId: string, query: string, maxResults?: number): Promise<ContextEntry[]>;
    optimizeContext(sessionId: string): Promise<void>;
    private generateEmbedding;
    private simpleHash;
    private calculateSimilarity;
    private persistContextEntry;
    private getSessionContext;
    private removeContextEntry;
    private compressSimilarEntries;
}
export {};
//# sourceMappingURL=context-manager.d.ts.map