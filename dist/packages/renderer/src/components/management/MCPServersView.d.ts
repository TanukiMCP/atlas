import React from 'react';
interface MCPServersViewProps {
    onViewChange: (view: string) => void;
    currentModel: string;
    isConnected: boolean;
    subjectMode: string;
    agentMode: boolean;
    onProcessingChange: (processing: boolean) => void;
}
export declare const MCPServersView: React.FC<MCPServersViewProps>;
export {};
//# sourceMappingURL=MCPServersView.d.ts.map