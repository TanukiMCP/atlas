import React from 'react';
interface Task {
    id: string;
    title: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    progress: number;
}
interface ProgressTrackerProps {
    isVisible: boolean;
    currentTier: 'ATOMIC' | 'MODERATE' | 'COMPLEX' | 'EXPERT';
    overallProgress: number;
    tasks: Task[];
    qualityScore?: number;
}
export declare const ProgressTracker: React.FC<ProgressTrackerProps>;
export {};
//# sourceMappingURL=progress-tracker-old.d.ts.map