/**
 * Workflow Parameter Input Dialog
 * Collects required parameters before executing a workflow
 */
import React from 'react';
import { WorkflowTemplate } from '../../services/workflow-execution/workflow-types';
interface WorkflowParameterDialogProps {
    isOpen: boolean;
    workflow: WorkflowTemplate;
    onExecute: (parameters: Record<string, any>) => void;
    onCancel: () => void;
}
export declare const WorkflowParameterDialog: React.FC<WorkflowParameterDialogProps>;
export {};
//# sourceMappingURL=workflow-parameter-dialog.d.ts.map