import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare class TanukiMCPServer extends Server {
    private subjectModeManager;
    private fileOps;
    private taskMgmt;
    private mathTools;
    private scienceTools;
    private programmingTools;
    private languageTools;
    private researchTools;
    constructor();
    private initializeTools;
    private registerAllTools;
    private registerCoreTools;
    private registerSubjectTools;
    private registerCRUDTools;
    private registerWorkflowTools;
    switchSubjectMode(mode: string): Promise<void>;
    private updateAvailableTools;
    private createProject;
    private manageDatabaseOperation;
    private executeWorkflow;
    private saveChatAsWorkflow;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare const server: TanukiMCPServer;
//# sourceMappingURL=server.d.ts.map