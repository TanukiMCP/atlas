/**
 * TypeScript types for TanukiMCP Atlas Workflow System
 * These types correspond to the workflow-template.schema.json
 */
export interface WorkflowTemplate {
    workflowId: string;
    name: string;
    description: string;
    triggerPhrase?: string;
    tags: string[];
    version: string;
    createdAt: string;
    updatedAt?: string;
    steps: WorkflowStep[];
    parameters: WorkflowParameter[];
    metadata?: WorkflowMetadata;
}
export interface WorkflowStep {
    stepId: string;
    name: string;
    description: string;
    toolCalls: ToolCall[];
    inputs: string[];
    outputs: string[];
    onSuccess: string | 'end';
    onError: string | 'abort';
    visualization?: string;
    conditions?: StepCondition[];
}
export interface ToolCall {
    toolName: string;
    parameters: Record<string, any>;
    timeout?: number;
    retryPolicy?: RetryPolicy;
}
export interface RetryPolicy {
    maxRetries: number;
    backoffMs: number;
    exponentialBackoff: boolean;
}
export interface StepCondition {
    type: 'input' | 'output' | 'variable' | 'function';
    expression: string;
    value?: any;
}
export interface WorkflowParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
    description: string;
    required: boolean;
    defaultValue?: any;
    validation?: ParameterValidation;
}
export interface ParameterValidation {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
    enum?: any[];
}
export interface WorkflowMetadata {
    author?: string;
    category?: string;
    complexity?: 'simple' | 'moderate' | 'complex' | 'expert';
    estimatedDuration?: number;
    dependencies?: string[];
    usageStats?: UsageStats;
}
export interface UsageStats {
    executionCount: number;
    successRate: number;
    averageDuration: number;
    lastExecuted?: string;
}
export interface ChatTranscript {
    messages: ChatMessage[];
    sessionId: string;
    context: ChatContext;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    timestamp: string;
    metadata?: any;
}
export interface ChatContext {
    subjectMode: string;
    projectContext?: string;
    availableTools: string[];
    userPreferences: any;
}
export interface LLMAgent {
    id: string;
    name: string;
    role: LLMAgentRole;
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
}
export type LLMAgentRole = 'synthesizer' | 'refinement' | 'finalizer';
export interface WorkflowSynthesisRequest {
    chatTranscript: ChatTranscript;
    userPreferences: WorkflowGenerationPreferences;
}
export interface WorkflowGenerationPreferences {
    complexity: 'simple' | 'moderate' | 'complex';
    includeVisualization: boolean;
    autoSave: boolean;
    tags: string[];
}
export interface WorkflowSynthesisResponse {
    asciiVisualization: string;
    structuredWorkflow: Partial<WorkflowTemplate>;
    confidence: number;
    reasoning: string[];
}
export interface WorkflowRefinementRequest {
    currentWorkflow: Partial<WorkflowTemplate>;
    currentVisualization: string;
    userRequest: string;
    context: RefinementContext;
}
export interface RefinementContext {
    previousRefinements: string[];
    availableTools: string[];
    constraints: string[];
}
export interface WorkflowRefinementResponse {
    updatedVisualization: string;
    updatedWorkflow: Partial<WorkflowTemplate>;
    changes: WorkflowChange[];
    explanation: string;
}
export interface WorkflowChange {
    type: 'add' | 'modify' | 'remove';
    target: 'step' | 'parameter' | 'metadata';
    description: string;
    before?: any;
    after?: any;
}
export interface WorkflowFinalizationRequest {
    workflowVisualization: string;
    partialWorkflow: Partial<WorkflowTemplate>;
    validationContext: ValidationContext;
}
export interface ValidationContext {
    availableTools: string[];
    schemaVersion: string;
    enforcedConstraints: string[];
}
export interface WorkflowFinalizationResponse {
    finalizedWorkflow: WorkflowTemplate;
    validationResults: ValidationResult[];
    schemaCompliance: boolean;
}
export interface ValidationResult {
    field: string;
    isValid: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
export interface WorkflowExecution {
    executionId: string;
    workflowId: string;
    status: WorkflowExecutionStatus;
    startTime: string;
    endTime?: string;
    currentStep?: string;
    parameters: Record<string, any>;
    results: WorkflowExecutionResult[];
    errors: WorkflowExecutionError[];
}
export type WorkflowExecutionStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
export interface WorkflowExecutionResult {
    stepId: string;
    success: boolean;
    output: any;
    duration: number;
    timestamp: string;
}
export interface WorkflowExecutionError {
    stepId: string;
    error: string;
    timestamp: string;
    retryCount: number;
    fatal: boolean;
}
export interface WorkflowGenerationUIState {
    isOpen: boolean;
    currentStep: WorkflowGenerationStep;
    loading: boolean;
    error?: string;
    workflowVisualization: string;
    partialWorkflow: Partial<WorkflowTemplate>;
    refinementHistory: RefinementHistoryItem[];
    userInput: string;
}
export type WorkflowGenerationStep = 'analyzing' | 'synthesizing' | 'visualizing' | 'preview' | 'refining' | 'finalizing' | 'complete';
export interface RefinementHistoryItem {
    id: string;
    timestamp: string;
    userRequest: string;
    agentResponse: string;
    changesSummary: string;
}
export interface WorkflowStorage {
    saveWorkflow: (workflow: WorkflowTemplate) => Promise<void>;
    loadWorkflow: (workflowId: string) => Promise<WorkflowTemplate | null>;
    listWorkflows: (filters?: WorkflowFilter) => Promise<WorkflowSummary[]>;
    deleteWorkflow: (workflowId: string) => Promise<void>;
    updateWorkflow: (workflow: WorkflowTemplate) => Promise<void>;
    searchWorkflows: (query: string) => Promise<WorkflowSummary[]>;
}
export interface WorkflowFilter {
    tags?: string[];
    category?: string;
    complexity?: string;
    author?: string;
    dateRange?: {
        start: string;
        end: string;
    };
}
export interface WorkflowSummary {
    workflowId: string;
    name: string;
    description: string;
    tags: string[];
    complexity?: string;
    lastUsed?: string;
    usageCount: number;
    successRate: number;
}
//# sourceMappingURL=workflow-types.d.ts.map