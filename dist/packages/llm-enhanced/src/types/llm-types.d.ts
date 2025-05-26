export type ProcessingTier = 'atomic' | 'moderate' | 'complex' | 'expert';
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    timestamp: Date;
    metadata?: any;
}
export interface ProcessingRequest {
    id: string;
    content: string;
    context: RequestContext;
    requirements: ProcessingRequirements;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    maxProcessingTime: number;
    userPreferences: UserPreferences;
}
export interface RequestContext {
    sessionId: string;
    messageHistory: Message[];
    subjectMode: string;
    projectContext?: string;
    availableTools: string[];
    previousRequests: ProcessingRequest[];
}
export interface ProcessingRequirements {
    minQuality: number;
    maxLatency: number;
    requiresReasoning: boolean;
    requiresCreativity: boolean;
    requiresFactualAccuracy: boolean;
    requiresCodeGeneration: boolean;
    requiresMathematics: boolean;
    requiresMultiStep: boolean;
}
export interface UserPreferences {
    preferredTier?: ProcessingTier;
    qualityVsSpeed: number;
    allowExpertProcessing: boolean;
    enableQualityAssurance: boolean;
    maxWaitTime: number;
    interventionLevel: 'minimal' | 'balanced' | 'high';
}
export interface ProcessingResponse {
    id: string;
    requestId: string;
    content: string;
    tier: ProcessingTier;
    qualityScore: number;
    confidence: number;
    processingTime: number;
    model: string;
    reasoning?: string[];
    citations?: string[];
    metadata: ResponseMetadata;
}
export interface ResponseMetadata {
    tokensUsed: number;
    modelsInvolved: string[];
    processingSteps: ProcessingStep[];
    qualityMetrics: QualityMetrics;
    userInterventions: UserIntervention[];
}
export interface ProcessingStep {
    step: number;
    description: string;
    tier: ProcessingTier;
    model: string;
    startTime: Date;
    endTime: Date;
    result: string;
    confidence: number;
}
export interface QualityMetrics {
    coherence: number;
    relevance: number;
    accuracy: number;
    completeness: number;
    clarity: number;
    creativity: number;
    overallScore: number;
}
export interface UserIntervention {
    timestamp: Date;
    type: 'stop' | 'pause' | 'resume' | 'redirect' | 'override' | 'feedback';
    description: string;
    impact: string;
}
export interface TournamentRound {
    roundNumber: number;
    matches: TournamentMatch[];
    winner: ProcessingResponse | null;
}
export interface TournamentMatch {
    competitor1: ProcessingResponse;
    competitor2: ProcessingResponse;
    winner: ProcessingResponse;
    scores: {
        score1: number;
        score2: number;
    };
    evaluations: MatchEvaluation[];
}
export interface MatchEvaluation {
    criterion: string;
    score1: number;
    score2: number;
    reasoning: string;
}
export interface SystemHealth {
    activeRequests: number;
    queueLength: number;
    processorStatus: ProcessorHealth[];
    modelCoordinatorHealth: ModelCoordinatorHealth;
    qualityAssuranceStatus: QualityAssuranceStatus;
    adaptiveRoutingMetrics: AdaptiveRoutingMetrics;
}
export interface ProcessorHealth {
    tier: ProcessingTier;
    isHealthy: boolean;
    activeRequests: number;
    averageProcessingTime: number;
    successRate: number;
}
export interface ModelCoordinatorHealth {
    availableModels: number;
    totalMemoryUsage: number;
    averageResponseTime: number;
    loadBalanceEfficiency: number;
}
export interface QualityAssuranceStatus {
    tournamentActive: boolean;
    averageImprovement: number;
    processingOverhead: number;
}
export interface AdaptiveRoutingMetrics {
    routingAccuracy: number;
    learningRate: number;
    optimizationGains: number;
}
export interface OptimizationResult {
    suggestions: OptimizationSuggestion[];
    applied: OptimizationSuggestion[];
    improvements: Record<string, number>;
}
export interface OptimizationSuggestion {
    type: string;
    description: string;
    expectedImprovement: number;
    autoApplicable: boolean;
    parameters?: Record<string, any>;
}
export interface UserChoice {
    override: boolean;
    selectedTier: ProcessingTier;
    reason?: string;
}
export interface RequestClassification {
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    domain: string[];
    requiresReasoning: boolean;
    requiresCreativity: boolean;
    requiresFactualAccuracy: boolean;
    requiresMultiStep: boolean;
    estimatedTokens: number;
    suggestedTier: ProcessingTier;
    confidence: number;
}
//# sourceMappingURL=llm-types.d.ts.map