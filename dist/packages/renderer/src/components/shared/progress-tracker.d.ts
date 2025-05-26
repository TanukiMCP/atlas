import React from 'react';
interface ProgressStep {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    details?: string;
}
interface ProgressTrackerProps {
    isVisible: boolean;
    title: string;
    steps: ProgressStep[];
    currentTier: 'basic' | 'advanced' | 'premium';
    onClose: () => void;
}
export declare const ProgressTracker: React.FC<ProgressTrackerProps>;
export {};
//# sourceMappingURL=progress-tracker.d.ts.map