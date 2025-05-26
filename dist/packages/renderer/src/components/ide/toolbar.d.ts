import React from 'react';
interface ToolbarProps {
    currentMode: string;
    onModeChange: (mode: string) => void;
    onAtSymbolTrigger: () => void;
    operationalMode?: 'agent' | 'chat';
    onOperationalModeChange?: (mode: 'agent' | 'chat') => void;
    onEmergencyStop?: () => void;
    onShowProcessingTier?: () => void;
    onShowToolPanel?: () => void;
    isProcessing?: boolean;
}
export declare const Toolbar: React.FC<ToolbarProps>;
export {};
//# sourceMappingURL=toolbar.d.ts.map