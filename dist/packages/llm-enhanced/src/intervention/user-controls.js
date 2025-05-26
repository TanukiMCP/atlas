"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControls = void 0;
const eventemitter3_1 = require("eventemitter3");
class UserControls extends eventemitter3_1.EventEmitter {
    activeInterventions = new Map();
    guidanceRequests = new Map();
    interventionCallbacks = new Map();
    constructor() {
        super();
    }
    // Request user guidance for processing decisions
    async requestGuidance(request, suggestedTier) {
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
    provideGuidance(requestId, choice) {
        const guidance = this.guidanceRequests.get(requestId);
        if (guidance) {
            clearTimeout(guidance.timeout);
            guidance.resolve(choice);
            this.guidanceRequests.delete(requestId);
            this.emit('guidance:received', requestId, choice);
        }
    }
    // Initialize intervention tracking for a request
    initializeIntervention(requestId, availableTiers = []) {
        this.activeInterventions.set(requestId, {
            requestId,
            status: 'active',
            interventions: [],
            canRedirect: availableTiers.length > 1,
            availableTiers
        });
    }
    // Stop processing immediately
    stopProcessing(requestId, reason = 'User requested stop') {
        const intervention = this.recordIntervention(requestId, 'stop', reason);
        if (intervention) {
            intervention.status = 'stopped';
            this.emit('intervention:stop', requestId);
        }
    }
    // Pause processing for user input
    pauseProcessing(requestId, reason = 'User requested pause') {
        const intervention = this.recordIntervention(requestId, 'pause', reason);
        if (intervention) {
            intervention.status = 'paused';
            intervention.pausedAt = new Date();
            this.emit('intervention:pause', requestId);
        }
    }
    // Resume paused processing
    resumeProcessing(requestId, reason = 'User resumed processing') {
        const intervention = this.activeInterventions.get(requestId);
        if (intervention && intervention.status === 'paused') {
            this.recordIntervention(requestId, 'resume', reason);
            intervention.status = 'active';
            intervention.pausedAt = undefined;
            this.emit('intervention:resume', requestId);
        }
    }
    // Redirect to different processing tier
    redirectProcessing(requestId, newTier, reason = 'User redirected to different tier') {
        const intervention = this.activeInterventions.get(requestId);
        if (intervention && intervention.canRedirect) {
            this.recordIntervention(requestId, 'redirect', `${reason} -> ${newTier}`);
            this.emit('intervention:redirect', requestId, newTier);
        }
    }
    // Override processing parameters
    overrideParameters(requestId, overrides, reason = 'User overrode parameters') {
        this.recordIntervention(requestId, 'override', reason);
        this.emit('intervention:override', requestId, overrides);
    }
    // Get intervention status for a request
    getInterventionStatus(requestId) {
        return this.activeInterventions.get(requestId);
    }
    // Check if request can be intervened
    canIntervene(requestId) {
        const intervention = this.activeInterventions.get(requestId);
        return intervention ? intervention.status === 'active' || intervention.status === 'paused' : false;
    }
    // Get all active interventions
    getActiveInterventions() {
        return Array.from(this.activeInterventions.values())
            .filter(i => i.status === 'active' || i.status === 'paused');
    }
    // Mark processing as completed
    completeProcessing(requestId) {
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
    setInterventionCallbacks(requestId, callbacks) {
        this.interventionCallbacks.set(requestId, callbacks);
    }
    // Clean up expired guidance requests
    cleanupExpiredGuidance() {
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
    recordIntervention(requestId, type, description) {
        const intervention = this.activeInterventions.get(requestId);
        if (intervention) {
            const userIntervention = {
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
    calculateInterventionImpact(type, intervention) {
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
    getInterventionStats() {
        const allInterventions = Array.from(this.activeInterventions.values());
        const totalInterventions = allInterventions.reduce((sum, status) => sum + status.interventions.length, 0);
        const interventionTypes = allInterventions.flatMap(s => s.interventions)
            .reduce((counts, intervention) => {
            counts[intervention.type] = (counts[intervention.type] || 0) + 1;
            return counts;
        }, {});
        return {
            totalRequests: allInterventions.length,
            totalInterventions,
            interventionRate: totalInterventions / Math.max(allInterventions.length, 1),
            interventionTypes,
            averageInterventionsPerRequest: totalInterventions / Math.max(allInterventions.length, 1)
        };
    }
    // Clean up all data
    shutdown() {
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
exports.UserControls = UserControls;
//# sourceMappingURL=user-controls.js.map