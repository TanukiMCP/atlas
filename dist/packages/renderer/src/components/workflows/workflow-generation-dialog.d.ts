/**
 * Workflow Generation Dialog Component
 * Implements the exact wireframe layout: 4/5 ASCII visualization + 1/5 refinement chat
 */
import React from 'react';
import { ChatTranscript, WorkflowTemplate } from '../../types/workflow-types';
interface WorkflowGenerationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    chatTranscript: ChatTranscript;
    onWorkflowSaved: (workflow: WorkflowTemplate) => void;
}
export declare const WorkflowGenerationDialog: React.FC<WorkflowGenerationDialogProps>;
export {};
//# sourceMappingURL=workflow-generation-dialog.d.ts.map