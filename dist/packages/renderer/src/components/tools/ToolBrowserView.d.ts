import React from 'react';
interface ToolBrowserViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const ToolBrowserView: React.FC<ToolBrowserViewProps>;
export {};
//# sourceMappingURL=ToolBrowserView.d.ts.map