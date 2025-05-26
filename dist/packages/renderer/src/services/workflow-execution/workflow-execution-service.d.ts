/**
 * Workflow Execution Service
 * Handles execution of saved workflows with parameter collection and step orchestration
 */
import { WorkflowTemplate, WorkflowExecution, WorkflowExecutionResult, WorkflowExecutionError } from '../../types/workflow-types';
export interface WorkflowExecutionConfig {
    maxExecutionTime: number;
    maxRetries: number;
    enableLogging: boolean;
    enableProgressTracking: boolean;
}
export interface WorkflowExecutionEvents {
    onExecutionStart: (execution: WorkflowExecution) => void;
    onStepStart: (stepId: string, stepName: string) => void;
    onStepComplete: (stepId: string, result: WorkflowExecutionResult) => void;
    onStepError: (stepId: string, error: WorkflowExecutionError) => void;
    onExecutionComplete: (execution: WorkflowExecution) => void;
    onExecutionError: (execution: WorkflowExecution, error: string) => void;
    onProgress: (executionId: string, progress: number) => void;
}
export declare class WorkflowExecutionService {
    private config;
    private events;
    private activeExecutions;
    private toolRouter;
    constructor(config: WorkflowExecutionConfig, events: WorkflowExecutionEvents, toolRouter: any);
    /**
     * Execute a workflow with provided parameters
     */
    executeWorkflow(workflow: WorkflowTemplate, parameters?: Record<string, any>): Promise<WorkflowExecution>;
    /**
     * Validate workflow parameters against schema
     */
    private validateWorkflowParameters;
    /**
     * Validate parameter type
     */
    private validateParameterType;
    /**
     * Execute workflow steps in order
     */
    private executeWorkflowSteps;
    /**
     * Execute a single workflow step
     */
    private executeStep;
    /**
     * Execute a tool call
     */
    private executeToolCall;
    /**
     * Resolve parameter values with variable substitution
     */
    private resolveParameterValues;
    /**
     * Prepare step inputs from context
     */
    private prepareStepInputs;
    /**
     * Prepare step outputs for next steps
     */
    private prepareStepOutputs;
    /**
     * Get execution status
     */
    getExecution(executionId: string): WorkflowExecution | null;
    /**
     * Cancel execution
     */
    cancelExecution(executionId: string): Promise<void>;
    /**
     * Get all active executions
     */
    getActiveExecutions(): WorkflowExecution[];
}
//# sourceMappingURL=workflow-execution-service.d.ts.map