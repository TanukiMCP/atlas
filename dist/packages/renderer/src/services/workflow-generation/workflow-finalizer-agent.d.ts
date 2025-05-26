/**
 * LLM Agent 3: Workflow Finalizer & Templater (Hidden from User)
 * Validates and converts workflows to the locked template format
 */
import { BaseLLMAgent } from './base-llm-agent';
import { WorkflowFinalizationRequest, WorkflowFinalizationResponse, WorkflowTemplate, ValidationResult } from '../../types/workflow-types';
export declare class WorkflowFinalizerAgent extends BaseLLMAgent {
    constructor();
    /**
     * Finalize a workflow and ensure template compliance
     */
    finalizeWorkflow(request: WorkflowFinalizationRequest): Promise<WorkflowFinalizationResponse>;
    /**
     * Format the finalization request
     */
    private formatFinalizationRequest;
    /**
     * Parse and validate the finalization response
     */
    private parseFinalizationResponse;
    /**
     * Validate the basic structure of a finalized workflow
     */
    private validateWorkflowStructure;
    /**
     * Call the LLM API implementation
     */
    protected callLLMAPI(messages: Array<{
        role: string;
        content: string;
    }>, options: {
        temperature: number;
        maxTokens: number;
        timeout: number;
    }): Promise<{
        content: string;
        tokensUsed: number;
        metadata?: any;
    }>;
    /**
     * Validate response format
     */
    protected validateResponse(content: string): boolean;
    /**
     * Generate validation summary
     */
    generateValidationSummary(validationResults: ValidationResult[]): {
        errorCount: number;
        warningCount: number;
        infoCount: number;
        isValid: boolean;
        criticalIssues: ValidationResult[];
    };
    /**
     * Apply automatic fixes for common validation issues
     */
    applyAutomaticFixes(workflow: Partial<WorkflowTemplate>): {
        fixedWorkflow: Partial<WorkflowTemplate>;
        appliedFixes: string[];
    };
}
//# sourceMappingURL=workflow-finalizer-agent.d.ts.map