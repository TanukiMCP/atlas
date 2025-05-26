import React from 'react';
interface ProcessingTierIndicatorProps {
    currentTier: 'basic' | 'advanced' | 'premium' | 'enterprise';
    isActive: boolean;
    complexity: number;
    estimatedTime?: string;
    queuePosition?: number;
}
export declare const ProcessingTierIndicator: React.FC<ProcessingTierIndicatorProps>;
export {};
//# sourceMappingURL=processing-tier-indicator.d.ts.map