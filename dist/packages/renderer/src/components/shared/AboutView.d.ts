import React from 'react';
interface AboutViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const AboutView: React.FC<AboutViewProps>;
export {};
//# sourceMappingURL=AboutView.d.ts.map