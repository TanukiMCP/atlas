import React from 'react';
interface ContextualToolbarProps {
    currentView: string;
    isProcessing?: boolean;
    agentMode?: boolean;
    onAgentModeToggle?: () => void;
    onStopProcessing?: () => void;
    onToolSelect?: () => void;
    onQuickSettings?: () => void;
}
export declare const ContextualToolbar: React.FC<ContextualToolbarProps>;
export {};
//# sourceMappingURL=ContextualToolbar.d.ts.map