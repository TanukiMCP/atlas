/**
 * LLM Agent 1: Workflow Synthesizer & Visualizer
 * Analyzes chat transcripts and generates ASCII workflow visualizations
 */
import { BaseLLMAgent } from './base-llm-agent';
import { WorkflowSynthesisRequest, WorkflowSynthesisResponse } from '../../types/workflow-types';
export declare class WorkflowSynthesizerAgent extends BaseLLMAgent {
    constructor();
    /**
     * Synthesize a workflow from a chat transcript
     */
    synthesizeWorkflow(request: WorkflowSynthesisRequest): Promise<WorkflowSynthesisResponse>;
    /**
     * Format the chat transcript for analysis
     */
    private formatSynthesisRequest;
    /**
     * Parse and validate the synthesis response
     */
    private parseSynthesisResponse;
    /**
     * Validate ASCII visualization format
     */
    private validateAsciiVisualization;
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
     * Generate a sample ASCII visualization
     */
    private generateSampleVisualization;
    /**
     * Generate a sample structured workflow
     */
    private generateSampleWorkflow;
    /**
     * Validate response format
     */
    protected validateResponse(content: string): boolean;
}
//# sourceMappingURL=workflow-synthesizer-agent.d.ts.map