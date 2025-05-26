/**
 * MCP Service - Real tool integration for TanukiMCP Atlas
 * Handles tool discovery, execution, and result management
 */
export interface MCPTool {
    name: string;
    description: string;
    category: 'file' | 'code' | 'web' | 'task' | 'project' | 'thinking';
    icon: string;
    parameters: MCPToolParameter[];
    operationalMode: 'agent' | 'chat' | 'both';
    schema?: any;
}
export interface MCPToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'file' | 'array';
    description: string;
    required: boolean;
    defaultValue?: any;
}
export interface MCPToolResult {
    success: boolean;
    result?: any;
    error?: string;
    executionTime: number;
    toolName: string;
    timestamp: Date;
}
export interface MCPExecutionContext {
    toolName: string;
    parameters: Record<string, any>;
    operationalMode: 'agent' | 'chat';
    sessionId?: string;
}
declare class MCPService {
    private tools;
    private isInitialized;
    constructor();
    private initializeTools;
    /**
     * Get available tools for the current operational mode
     */
    getAvailableTools(operationalMode: 'agent' | 'chat'): MCPTool[];
    /**
     * Search tools by name or description
     */
    searchTools(query: string, operationalMode: 'agent' | 'chat'): MCPTool[];
    /**
     * Execute a tool with given parameters
     */
    executeTool(context: MCPExecutionContext): Promise<MCPToolResult>;
    private validateParameters;
    private executeToolInternal;
    /**
     * Get tool by name
     */
    getTool(name: string): MCPTool | undefined;
    /**
     * Check if service is ready
     */
    isReady(): boolean;
}
export declare const mcpService: MCPService;
export {};
//# sourceMappingURL=mcp-service.d.ts.map