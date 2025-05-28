import React from 'react';
interface WorkflowManagerViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const WorkflowManagerView: React.FC<WorkflowManagerViewProps>;
export {};
//# sourceMappingURL=WorkflowManagerView.d.ts.map