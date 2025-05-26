import { EventEmitter } from 'eventemitter3';
import { ProcessingRequest, ProcessingTier, UserChoice, UserIntervention } from '../types/llm-types';
export interface UserControlsEvents {
    'intervention:stop': (requestId: string) => void;
    'intervention:pause': (requestId: string) => void;
    'intervention:resume': (requestId: string) => void;
    'intervention:redirect': (requestId: string, newTier: ProcessingTier) => void;
    'intervention:override': (requestId: string, overrides: any) => void;
    'guidance:requested': (request: ProcessingRequest, suggestedTier: ProcessingTier) => void;
    'guidance:received': (requestId: string, choice: UserChoice) => void;
}
export interface InterventionStatus {
    requestId: string;
    status: 'active' | 'paused' | 'stopped' | 'completed';
    interventions: UserIntervention[];
    pausedAt?: Date;
    canRedirect: boolean;
    availableTiers: ProcessingTier[];
}
export declare class UserControls extends EventEmitter<UserControlsEvents> {
    private activeInterventions;
    private guidanceRequests;
    private interventionCallbacks;
    constructor();
    requestGuidance(request: ProcessingRequest, suggestedTier: ProcessingTier): Promise<UserChoice>;
    provideGuidance(requestId: string, choice: UserChoice): void;
    initializeIntervention(requestId: string, availableTiers?: ProcessingTier[]): void;
    stopProcessing(requestId: string, reason?: string): void;
    pauseProcessing(requestId: string, reason?: string): void;
    resumeProcessing(requestId: string, reason?: string): void;
    redirectProcessing(requestId: string, newTier: ProcessingTier, reason?: string): void;
    overrideParameters(requestId: string, overrides: any, reason?: string): void;
    getInterventionStatus(requestId: string): InterventionStatus | undefined;
    canIntervene(requestId: string): boolean;
    getActiveInterventions(): InterventionStatus[];
    completeProcessing(requestId: string): void;
    setInterventionCallbacks(requestId: string, callbacks: InterventionCallbacks): void;
    cleanupExpiredGuidance(): void;
    private recordIntervention;
    private calculateInterventionImpact;
    getInterventionStats(): InterventionStats;
    shutdown(): void;
}
interface InterventionCallbacks {
    onStop?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onRedirect?: (newTier: ProcessingTier) => void;
    onOverride?: (overrides: any) => void;
}
interface InterventionStats {
    totalRequests: number;
    totalInterventions: number;
    interventionRate: number;
    interventionTypes: Record<string, number>;
    averageInterventionsPerRequest: number;
}
export {};
//# sourceMappingURL=user-controls.d.ts.map