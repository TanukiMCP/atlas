export interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    category: string;
    steps: WorkflowStep[];
    variables: WorkflowVariable[];
    metadata: {
        version: string;
        author?: string;
        tags?: string[];
        created: Date;
        updated: Date;
    };
}
export interface WorkflowStep {
    id: string;
    type: 'tool' | 'condition' | 'loop' | 'input';
    toolName?: string;
    parameters?: Record<string, any>;
    condition?: string;
    next?: string | string[];
    onError?: string;
}
export interface WorkflowVariable {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    description?: string;
    example?: any;
}
export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: 'running' | 'completed' | 'failed' | 'paused';
    currentStep?: string;
    parameters: Record<string, any>;
    result?: any;
    error?: string;
    startTime: Date;
    endTime?: Date;
    executionLog: WorkflowLogEntry[];
}
export interface WorkflowLogEntry {
    stepId: string;
    timestamp: Date;
    type: 'step_start' | 'step_complete' | 'step_error' | 'info';
    message: string;
    data?: any;
}
//# sourceMappingURL=workflow-types.d.ts.map