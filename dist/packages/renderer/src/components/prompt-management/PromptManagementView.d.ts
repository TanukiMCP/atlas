import React from 'react';
interface PromptManagementViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const PromptManagementView: React.FC<PromptManagementViewProps>;
export {};
//# sourceMappingURL=PromptManagementView.d.ts.map