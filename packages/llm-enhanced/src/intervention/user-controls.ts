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

export class UserControls extends EventEmitter<UserControlsEvents> {
  private activeInterventions: Map<string, InterventionStatus> = new Map();
  private guidanceRequests: Map<string, PendingGuidance> = new Map();
  private interventionCallbacks: Map<string, InterventionCallbacks> = new Map();

  constructor() {
    super();
  }

  // Request user guidance for processing decisions
  async requestGuidance(
    request: ProcessingRequest, 
    suggestedTier: ProcessingTier
  ): Promise<UserChoice> {
    const guidanceId = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.guidanceRequests.delete(guidanceId);
        // Default choice if user doesn't respond
        resolve({
          override: false,
          selectedTier: suggestedTier,
          reason: 'No user response - using suggested tier'
        });
      }, request.userPreferences.maxWaitTime || 30000);

      this.guidanceRequests.set(guidanceId, {
        request,
        suggestedTier,
        resolve,
        reject,
        timeout,
        timestamp: new Date()
      });

      this.emit('guidance:requested', request, suggestedTier);
    });
  }

  // User provides guidance response
  provideGuidance(requestId: string, choice: UserChoice): void {
    const guidance = this.guidanceRequests.get(requestId);
    if (guidance) {
      clearTimeout(guidance.timeout);
      guidance.resolve(choice);
      this.guidanceRequests.delete(requestId);
      this.emit('guidance:received', requestId, choice);
    }
  }

  // Initialize intervention tracking for a request
  initializeIntervention(requestId: string, availableTiers: ProcessingTier[] = []): void {
    this.activeInterventions.set(requestId, {
      requestId,
      status: 'active',
      interventions: [],
      canRedirect: availableTiers.length > 1,
      availableTiers
    });
  }

  // Stop processing immediately
  stopProcessing(requestId: string, reason: string = 'User requested stop'): void {
    const intervention = this.recordIntervention(requestId, 'stop', reason);
    if (intervention) {
      intervention.status = 'stopped';
      this.emit('intervention:stop', requestId);
    }
  }

  // Pause processing for user input
  pauseProcessing(requestId: string, reason: string = 'User requested pause'): void {
    const intervention = this.recordIntervention(requestId, 'pause', reason);
    if (intervention) {
      intervention.status = 'paused';
      intervention.pausedAt = new Date();
      this.emit('intervention:pause', requestId);
    }
  }

  // Resume paused processing
  resumeProcessing(requestId: string, reason: string = 'User resumed processing'): void {
    const intervention = this.activeInterventions.get(requestId);
    if (intervention && intervention.status === 'paused') {
      this.recordIntervention(requestId, 'resume', reason);
      intervention.status = 'active';
      intervention.pausedAt = undefined;
      this.emit('intervention:resume', requestId);
    }
  }

  // Redirect to different processing tier
  redirectProcessing(
    requestId: string, 
    newTier: ProcessingTier, 
    reason: string = 'User redirected to different tier'
  ): void {
    const intervention = this.activeInterventions.get(requestId);
    if (intervention && intervention.canRedirect) {
      this.recordIntervention(requestId, 'redirect', `${reason} -> ${newTier}`);
      this.emit('intervention:redirect', requestId, newTier);
    }
  }

  // Override processing parameters
  overrideParameters(
    requestId: string, 
    overrides: any, 
    reason: string = 'User overrode parameters'
  ): void {
    this.recordIntervention(requestId, 'override', reason);
    this.emit('intervention:override', requestId, overrides);
  }

  // Get intervention status for a request
  getInterventionStatus(requestId: string): InterventionStatus | undefined {
    return this.activeInterventions.get(requestId);
  }

  // Check if request can be intervened
  canIntervene(requestId: string): boolean {
    const intervention = this.activeInterventions.get(requestId);
    return intervention ? intervention.status === 'active' || intervention.status === 'paused' : false;
  }

  // Get all active interventions
  getActiveInterventions(): InterventionStatus[] {
    return Array.from(this.activeInterventions.values())
      .filter(i => i.status === 'active' || i.status === 'paused');
  }

  // Mark processing as completed
  completeProcessing(requestId: string): void {
    const intervention = this.activeInterventions.get(requestId);
    if (intervention) {
      intervention.status = 'completed';
      // Keep for a short time for history, then clean up
      setTimeout(() => {
        this.activeInterventions.delete(requestId);
      }, 60000); // 1 minute
    }
  }

  // Set intervention callbacks for UI integration
  setInterventionCallbacks(requestId: string, callbacks: InterventionCallbacks): void {
    this.interventionCallbacks.set(requestId, callbacks);
  }

  // Clean up expired guidance requests
  cleanupExpiredGuidance(): void {
    const now = Date.now();
    for (const [id, guidance] of this.guidanceRequests.entries()) {
      if (now - guidance.timestamp.getTime() > 300000) { // 5 minutes
        clearTimeout(guidance.timeout);
        guidance.reject(new Error('Guidance request expired'));
        this.guidanceRequests.delete(id);
      }
    }
  }

  // Record intervention in history
  private recordIntervention(
    requestId: string, 
    type: UserIntervention['type'], 
    description: string
  ): InterventionStatus | undefined {
    const intervention = this.activeInterventions.get(requestId);
    if (intervention) {
      const userIntervention: UserIntervention = {
        timestamp: new Date(),
        type,
        description,
        impact: this.calculateInterventionImpact(type, intervention)
      };
      
      intervention.interventions.push(userIntervention);
      return intervention;
    }
    return undefined;
  }

  private calculateInterventionImpact(
    type: UserIntervention['type'], 
    intervention: InterventionStatus
  ): string {
    switch (type) {
      case 'stop':
        return 'Processing terminated early';
      case 'pause':
        return 'Processing paused for user input';
      case 'resume':
        return 'Processing resumed after pause';
      case 'redirect':
        return 'Processing tier changed mid-execution';
      case 'override':
        return 'Processing parameters modified';
      case 'feedback':
        return 'User provided feedback for future optimization';
      default:
        return 'Unknown impact';
    }
  }

  // Get intervention statistics
  getInterventionStats(): InterventionStats {
    const allInterventions = Array.from(this.activeInterventions.values());
    const totalInterventions = allInterventions.reduce(
      (sum, status) => sum + status.interventions.length, 0
    );

    const interventionTypes = allInterventions.flatMap(s => s.interventions)
      .reduce((counts, intervention) => {
        counts[intervention.type] = (counts[intervention.type] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

    return {
      totalRequests: allInterventions.length,
      totalInterventions,
      interventionRate: totalInterventions / Math.max(allInterventions.length, 1),
      interventionTypes,
      averageInterventionsPerRequest: totalInterventions / Math.max(allInterventions.length, 1)
    };
  }

  // Clean up all data
  shutdown(): void {
    // Clear all pending guidance requests
    for (const guidance of this.guidanceRequests.values()) {
      clearTimeout(guidance.timeout);
      guidance.reject(new Error('System shutting down'));
    }
    
    this.guidanceRequests.clear();
    this.activeInterventions.clear();
    this.interventionCallbacks.clear();
    this.removeAllListeners();
  }
}

// Supporting interfaces
interface PendingGuidance {
  request: ProcessingRequest;
  suggestedTier: ProcessingTier;
  resolve: (choice: UserChoice) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
  timestamp: Date;
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