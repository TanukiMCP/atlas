import React from 'react';
interface SettingsViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const SettingsView: React.FC<SettingsViewProps>;
export {};
//# sourceMappingURL=SettingsView.d.ts.map