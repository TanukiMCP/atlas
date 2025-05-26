import { Workflow, WorkflowExecution } from '../types/workflow-types';
export declare const useWorkflows: () => {
    workflows: Workflow[];
    executions: WorkflowExecution[];
    isLoading: boolean;
    createWorkflow: (workflowData: Partial<Workflow>) => Workflow;
    executeWorkflow: (workflowId: string) => WorkflowExecution | undefined;
};
//# sourceMappingURL=use-workflows.d.ts.map