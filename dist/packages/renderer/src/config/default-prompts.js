"use strict";
/**
 * TanukiMCP Atlas - Default System Prompts
 * Comprehensive collection of all system prompts used by LLM agents
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SYSTEM_PROMPTS = void 0;
const prompt_types_1 = require("../types/prompt-types");
// Helper function to create prompts
const createPrompt = (id, name, description, categoryId, agentModule, purpose, content, variables = [], guidance = '', complexity = 'medium', tags = []) => {
    const category = prompt_types_1.DEFAULT_PROMPT_CATEGORIES.find(c => c.id === categoryId);
    return {
        id,
        name,
        description,
        category,
        agentModule,
        purpose,
        defaultContent: content,
        variables,
        guidance,
        version: '1.0.0',
        created: new Date(),
        lastModified: new Date(),
        isModified: false,
        estimatedTokens: Math.ceil(content.length / 4),
        complexity,
        tags
    };
};
exports.DEFAULT_SYSTEM_PROMPTS = {
    // LLM Routing Layer Prompts
    'routing.complexity_assessor.v1': createPrompt('routing.complexity_assessor.v1', 'Complexity Assessor', 'Evaluates the complexity of user requests for proper routing', 'llm-routing', 'llm-router', 'Analyze user queries to determine appropriate processing tier', `You are a complexity assessment agent for TanukiMCP Atlas.`, [], 'Focus on identifying scope and complexity.', 'medium', ['routing', 'classification']), // Task Processors
    'task.atomic.quick_analyzer.v1': createPrompt('task.atomic.quick_analyzer.v1', 'Quick Analyzer', 'Rapid analysis for simple, direct requests', 'task-processors', 'atomic-processor', 'Provide quick analysis and direct responses for simple queries', `You are a quick analysis agent for atomic-tier requests. Provide direct, concise responses.

User Query: {{user_query}}
Context: {{context}}

Provide a clear, direct response. Be concise but complete.`, [], 'Keep responses focused and actionable. Avoid over-analysis.', 'low', ['atomic', 'analysis', 'quick-response']),
    // Workflow Generation
    'workflow.synthesizer.v1': createPrompt('workflow.synthesizer.v1', 'Workflow Synthesizer', 'Analyzes chat conversations and generates workflow templates', 'workflow-generation', 'workflow-agent-1', 'Convert chat conversations into structured, reusable workflows', `You are LLM Agent 1: Workflow Synthesizer & Visualizer for TanukiMCP Atlas.

Your task is to analyze a chat conversation and create a structured workflow template.

Chat Conversation: {{chat_conversation}}
Start Message: {{start_message}}
End Message: {{end_message}}

Create a workflow with:
1. Clear step-by-step process
2. Identified variables and parameters
3. Tool mappings for each step
4. ASCII visualization of the workflow

Respond with structured workflow data.`, [], 'Focus on creating reusable, parameterized workflows.', 'high', ['workflow', 'synthesis', 'automation']),
    // Communication Layer
    'communication.excellence.v1': createPrompt('communication.excellence.v1', 'Communication Excellence', 'Ensures clear, helpful communication with users', 'communication', 'communication-layer', 'Format and enhance responses for optimal user experience', `You are the Communication Excellence Layer for TanukiMCP Atlas.

Your role is to take technical responses and format them for optimal user experience.

Raw Response: {{raw_response}}
User Context: {{user_context}}
Conversation History: {{conversation_history}}

Enhance the response with:
- Clear structure and formatting
- Helpful explanations
- Next steps or suggestions
- Professional but friendly tone`, [], 'Focus on clarity, helpfulness, and user experience.', 'medium', ['communication', 'formatting', 'user-experience'])
};
//# sourceMappingURL=default-prompts.js.map