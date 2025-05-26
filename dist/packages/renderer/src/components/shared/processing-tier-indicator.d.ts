import React from 'react';
export type ProcessingTier = 'ATOMIC' | 'MODERATE' | 'COMPLEX' | 'EXPERT';
interface ProcessingTierIndicatorProps {
    currentTier: ProcessingTier;
    complexity: number;
    estimatedDuration: number;
    actualDuration?: number;
    isActive: boolean;
    onTierSwitch?: (tier: ProcessingTier) => void;
}
export declare const ProcessingTierIndicator: React.FC<ProcessingTierIndicatorProps>;
export {};
//# sourceMappingURL=processing-tier-indicator.d.ts.map