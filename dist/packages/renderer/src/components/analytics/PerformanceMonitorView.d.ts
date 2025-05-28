import React from 'react';
interface PerformanceMonitorViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const PerformanceMonitorView: React.FC<PerformanceMonitorViewProps>;
export {};
//# sourceMappingURL=PerformanceMonitorView.d.ts.map