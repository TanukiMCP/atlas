import React from 'react';
interface EditorViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const EditorView: React.FC<EditorViewProps>;
export {};
//# sourceMappingURL=EditorView.d.ts.map