/**
 * TanukiMCP Atlas - Example LLM Agent Integration
 * Demonstrates how to integrate dynamic prompt loading in LLM agents
 */
/**
 * Example: Complexity Assessor Agent
 * Shows how to use dynamic prompt loading in practice
 */
export declare class ComplexityAssessorAgent {
    private readonly promptId;
    assessComplexity(userQuery: string, chatHistory?: any[], availableTools?: string[]): Promise<{
        tier: string;
        confidence: number;
        reasoning: string;
        estimated_time: string;
        required_tools: string[];
        complexity_factors: string[];
    }>;
}
/**
 * Example: Workflow Synthesizer Agent
 * Shows workflow generation with dynamic prompts
 */
export declare class WorkflowSynthesizerAgent {
    private readonly promptId;
    synthesizeWorkflow(chatConversation: string, startMessage: string, endMessage: string): Promise<{
        name: string;
        description: string;
        steps: {
            id: number;
            action: string;
            tool: string;
        }[];
        variables: {
            name: string;
            type: string;
            required: boolean;
        }[];
    }>;
}
/**
 * Example: Communication Excellence Agent
 * Shows response formatting with dynamic prompts
 */
export declare class CommunicationExcellenceAgent {
    private readonly promptId;
    enhanceResponse(rawResponse: string, userContext?: any, conversationHistory?: any[]): Promise<{
        formatted_response: string;
        suggestions: string[];
        tone: string;
        clarity_score: number;
    }>;
}
export declare const complexityAssessor: ComplexityAssessorAgent;
export declare const workflowSynthesizer: WorkflowSynthesizerAgent;
export declare const communicationEnhancer: CommunicationExcellenceAgent;
//# sourceMappingURL=example-llm-agent.d.ts.map