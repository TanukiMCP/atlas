/**
 * Main Workflow Generation Service
 * Coordinates the three LLM agents to provide complete workflow generation functionality
 */
import { ChatTranscript, WorkflowGenerationUIState, WorkflowGenerationStep, WorkflowTemplate, WorkflowGenerationPreferences } from '../../types/workflow-types';
export interface WorkflowGenerationConfig {
    enableAutoSave: boolean;
    defaultComplexity: 'simple' | 'moderate' | 'complex';
    maxRefinementIterations: number;
    timeoutMs: number;
}
export interface WorkflowGenerationEvents {
    onStateChange: (state: WorkflowGenerationUIState) => void;
    onProgress: (step: WorkflowGenerationStep, progress: number) => void;
    onError: (error: string) => void;
    onComplete: (workflow: WorkflowTemplate) => void;
}
export declare class WorkflowGenerationService {
    private synthesizerAgent;
    private refinementAgent;
    private finalizerAgent;
    private config;
    private events;
    private currentState;
    constructor(config: WorkflowGenerationConfig, events: WorkflowGenerationEvents);
    /**
     * Start workflow generation from a chat transcript
     */
    generateWorkflowFromChat(chatTranscript: ChatTranscript, preferences?: Partial<WorkflowGenerationPreferences>): Promise<void>;
    /**
     * Synthesize initial workflow using Agent 1
     */
    private synthesizeWorkflow;
    /**
     * Refine workflow using Agent 2
     */
    refineWorkflow(userRequest: string): Promise<void>;
    /**
     * Regenerate workflow using Agent 1 (discard current refinements)
     */
    regenerateWorkflow(chatTranscript: ChatTranscript, preferences?: Partial<WorkflowGenerationPreferences>): Promise<void>;
    /**
     * Finalize and save workflow using Agent 3
     */
    finalizeWorkflow(): Promise<WorkflowTemplate>;
    /**
     * Update ASCII visualization directly (direct editing mode)
     */
    updateVisualization(newVisualization: string): void;
    /**
     * Close the workflow generation interface
     */
    closeWorkflowGeneration(): void;
    /**
     * Get current state
     */
    getCurrentState(): WorkflowGenerationUIState;
    /**
     * Update state and notify listeners
     */
    private updateState;
    /**
     * Handle errors
     */
    private handleError;
    /**
     * Get available tools from the tool router
     */
    private getAvailableTools;
    /**
     * Save workflow to storage
     */
    private saveWorkflow;
    /**
     * Get stored workflows
     */
    private getStoredWorkflows;
    /**
     * Get all stored workflows
     */
    getWorkflows(): Promise<WorkflowTemplate[]>;
    /**
     * Get workflow by ID
     */
    getWorkflow(workflowId: string): Promise<WorkflowTemplate | null>;
    /**
     * Delete workflow
     */
    deleteWorkflow(workflowId: string): Promise<void>;
    /**
     * Search workflows
     */
    searchWorkflows(query: string): Promise<WorkflowTemplate[]>;
    /**
     * Get agent status information
     */
    getAgentStatus(): {
        synthesizer: any;
        refinement: any;
        finalizer: any;
    };
}
//# sourceMappingURL=workflow-generation-service.d.ts.map