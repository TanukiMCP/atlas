"use strict";
/**
 * TanukiMCP Atlas - Example LLM Agent Integration
 * Demonstrates how to integrate dynamic prompt loading in LLM agents
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationEnhancer = exports.workflowSynthesizer = exports.complexityAssessor = exports.CommunicationExcellenceAgent = exports.WorkflowSynthesizerAgent = exports.ComplexityAssessorAgent = void 0;
const dynamic_prompt_loader_1 = require("./dynamic-prompt-loader");
/**
 * Example: Complexity Assessor Agent
 * Shows how to use dynamic prompt loading in practice
 */
class ComplexityAssessorAgent {
    promptId = 'routing.complexity_assessor.v1';
    async assessComplexity(userQuery, chatHistory = [], availableTools = []) {
        try {
            // Load the system prompt dynamically (user-modified or default)
            const systemPrompt = await (0, dynamic_prompt_loader_1.getExecutablePrompt)(this.promptId, {
                user_query: userQuery,
                chat_history: JSON.stringify(chatHistory),
                available_tools: JSON.stringify(availableTools)
            });
            // Here you would call your LLM API with the system prompt
            // For demonstration, we'll return a mock response
            console.log('Using system prompt:', systemPrompt);
            // Mock LLM response
            return {
                tier: 'moderate',
                confidence: 0.85,
                reasoning: 'Request involves multiple steps and file operations',
                estimated_time: '5-10 minutes',
                required_tools: ['read_file', 'write_file', 'search_code'],
                complexity_factors: ['multi-step', 'file-operations']
            };
        }
        catch (error) {
            console.error('Failed to assess complexity:', error);
            throw error;
        }
    }
}
exports.ComplexityAssessorAgent = ComplexityAssessorAgent;
/**
 * Example: Workflow Synthesizer Agent
 * Shows workflow generation with dynamic prompts
 */
class WorkflowSynthesizerAgent {
    promptId = 'workflow.synthesizer.v1';
    async synthesizeWorkflow(chatConversation, startMessage, endMessage) {
        try {
            const systemPrompt = await (0, dynamic_prompt_loader_1.getExecutablePrompt)(this.promptId, {
                chat_conversation: chatConversation,
                start_message: startMessage,
                end_message: endMessage
            });
            console.log('Workflow synthesis prompt:', systemPrompt);
            // Mock workflow synthesis result
            return {
                name: 'Generated Workflow',
                description: 'Auto-generated from chat conversation',
                steps: [
                    { id: 1, action: 'analyze_requirements', tool: 'analyze_code' },
                    { id: 2, action: 'create_structure', tool: 'write_file' },
                    { id: 3, action: 'implement_features', tool: 'edit_block' }
                ],
                variables: [
                    { name: 'project_path', type: 'string', required: true },
                    { name: 'requirements', type: 'string', required: true }
                ]
            };
        }
        catch (error) {
            console.error('Failed to synthesize workflow:', error);
            throw error;
        }
    }
}
exports.WorkflowSynthesizerAgent = WorkflowSynthesizerAgent;
/**
 * Example: Communication Excellence Agent
 * Shows response formatting with dynamic prompts
 */
class CommunicationExcellenceAgent {
    promptId = 'communication.excellence.v1';
    async enhanceResponse(rawResponse, userContext = {}, conversationHistory = []) {
        try {
            const systemPrompt = await (0, dynamic_prompt_loader_1.getExecutablePrompt)(this.promptId, {
                raw_response: rawResponse,
                user_context: JSON.stringify(userContext),
                conversation_history: JSON.stringify(conversationHistory)
            });
            console.log('Communication enhancement prompt:', systemPrompt);
            // Mock enhanced response
            return {
                formatted_response: `## Enhanced Response\n\n${rawResponse}\n\n### Next Steps\n- Review the implementation\n- Test the functionality\n- Deploy when ready`,
                suggestions: [
                    'Consider adding error handling',
                    'Add unit tests for better reliability',
                    'Document the new functionality'
                ],
                tone: 'professional',
                clarity_score: 0.92
            };
        }
        catch (error) {
            console.error('Failed to enhance communication:', error);
            throw error;
        }
    }
}
exports.CommunicationExcellenceAgent = CommunicationExcellenceAgent;
// Export instances for use throughout the application
exports.complexityAssessor = new ComplexityAssessorAgent();
exports.workflowSynthesizer = new WorkflowSynthesizerAgent();
exports.communicationEnhancer = new CommunicationExcellenceAgent();
//# sourceMappingURL=example-llm-agent.js.map