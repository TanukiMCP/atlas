/**
 * LLM Agent 2: Workflow Refinement
 * Interactive agent for refining workflows based on user feedback
 */
import { BaseLLMAgent } from './base-llm-agent';
import { WorkflowRefinementRequest, WorkflowRefinementResponse } from '../../types/workflow-types';
export declare class WorkflowRefinementAgent extends BaseLLMAgent {
    constructor();
    /**
     * Refine a workflow based on user feedback
     */
    refineWorkflow(request: WorkflowRefinementRequest): Promise<WorkflowRefinementResponse>;
    /**
     * Format the refinement request for the LLM
     */
    private formatRefinementRequest;
    /**
     * Parse and validate the refinement response
     */
    private parseRefinementResponse;
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
     * Generate sample updated visualization
     */
    private generateUpdatedVisualization;
    /**
     * Generate sample updated workflow
     */
    private generateUpdatedWorkflow;
    /**
     * Validate response format
     */
    protected validateResponse(content: string): boolean;
    /**
     * Analyze the complexity of a refinement request
     */
    analyzeRefinementComplexity(userRequest: string): {
        complexity: 'simple' | 'moderate' | 'complex';
        estimatedChanges: number;
        affectedComponents: string[];
    };
}
//# sourceMappingURL=workflow-refinement-agent.d.ts.map