import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolExecutionContext, ToolExecutionResult } from '../types/tool-router-types';
export interface ExecutionRouterEvents {
    'execution:started': (toolId: string, source: string) => void;
    'execution:completed': (toolId: string, result: ToolExecutionResult) => void;
    'execution:failed': (toolId: string, error: Error) => void;
    'fallback:triggered': (originalTool: string, fallbackTool: string) => void;
    'timeout:occurred': (toolId: string, timeoutMs: number) => void;
}
export declare class ExecutionRouter extends EventEmitter<ExecutionRouterEvents> {
    private builtinExecutor;
    private externalExecutor;
    private activeExecutions;
    private executionQueue;
    constructor();
    private initializeExecutors;
    execute(tool: UnifiedTool, parameters: any, context: ToolExecutionContext): Promise<ToolExecutionResult>;
    private performExecution;
    private executeBuiltinTool;
    private executeExternalTool;
    private categorizeError;
    private isRecoverableError;
    private getMemoryUsage;
    abortExecution(toolId: string, messageId: string): Promise<boolean>;
    getActiveExecutions(): string[];
    shutdown(): Promise<void>;
}
//# sourceMappingURL=execution-router.d.ts.map