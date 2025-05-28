import { MCPTool, Workflow, ProcessingTier } from '../types';
interface MCPServer {
    name: string;
    url: string;
    version: string;
    capabilities: string[];
    tools: MCPTool[];
}
interface ToolExecutionResult {
    success: boolean;
    data?: any;
    error?: string;
    executionTime: number;
}
declare class MCPService {
    private servers;
    private tools;
    private workflows;
    private processingTiers;
    private listeners;
    constructor();
    private initializeBuiltInTools;
    private initializeWorkflows;
    private initializeProcessingTiers;
    discoverMCPServers(): Promise<void>;
    private checkMCPServer;
    private registerMCPServer;
    executeTool(toolName: string, parameters?: any): Promise<ToolExecutionResult>;
    private isBuiltInTool;
    private executeBuiltInTool;
    private handleFileOperations;
    private handleWebSearch;
    private handleCodeAnalysis;
    private handleGitOperations;
    private handleTerminalExecution;
    private handlePackageManagement;
    executeWorkflow(workflowId: string, parameters?: any): Promise<ToolExecutionResult>;
    private executeWorkflowSteps;
    getAvailableTools(): MCPTool[];
    getAvailableWorkflows(): Workflow[];
    getProcessingTiers(): ProcessingTier[];
    getMCPServers(): MCPServer[];
    onToolsChanged(listener: () => void): () => void;
    private notifyListeners;
    refreshServers(): Promise<void>;
}
declare const _default: MCPService;
export default _default;
//# sourceMappingURL=MCPService.d.ts.map