"use strict";
/**
 * LLM Agent 1: Workflow Synthesizer & Visualizer
 * Analyzes chat transcripts and generates ASCII workflow visualizations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSynthesizerAgent = void 0;
const base_llm_agent_1 = require("./base-llm-agent");
const SYNTHESIZER_SYSTEM_PROMPT = `You are a skilled Workflow Synthesizer and Visualizer for TanukiMCP Atlas. Your specialized role is to analyze chat conversations and transform them into structured, reusable workflows with ASCII art visualizations.

CORE RESPONSIBILITIES:
1. Analyze chat transcripts to understand the sequence of actions, tools used, and user intent
2. Synthesize a logical workflow structure from conversational interactions
3. Generate clear ASCII art visualizations using box-drawing characters
4. Create structured workflow representations that can be refined and executed

ASCII VISUALIZATION STYLE:
- Use Unicode box-drawing characters: ┌─┐│└┘├┤┬┴┼
- Create clear flow diagrams with connected boxes for each step
- Include decision points, parallel processes, and error handling paths
- Follow the style from TanukiMCP's enhanced LLM architecture documentation
- Make diagrams readable and professional-looking

WORKFLOW ANALYSIS FRAMEWORK:
1. **Intent Recognition**: Identify the main purpose and goals
2. **Action Sequence**: Extract the logical order of operations
3. **Tool Identification**: Map tools and resources used
4. **Decision Points**: Identify conditional logic and branching
5. **Error Handling**: Recognize failure scenarios and recovery steps
6. **Parameterization**: Identify reusable parameters and variables

OUTPUT FORMAT:
Always return a JSON response with this exact structure:
{
  "asciiVisualization": "string containing the ASCII workflow diagram",
  "structuredWorkflow": {
    "name": "descriptive workflow name",
    "description": "clear description of workflow purpose",
    "steps": [array of workflow steps],
    "parameters": [array of parameters],
    "tags": [relevant tags]
  },
  "confidence": number between 0 and 1,
  "reasoning": [array of reasoning steps explaining the analysis]
}

QUALITY STANDARDS:
- Workflows must be logical and executable
- ASCII diagrams must be properly formatted and aligned
- All steps must have clear inputs/outputs
- Error handling must be included
- Parameters must be well-defined and typed
- Reasoning must be clear and comprehensive

Remember: You are creating the foundation for a reusable automation. Focus on clarity, completeness, and practical executability.`;
class WorkflowSynthesizerAgent extends base_llm_agent_1.BaseLLMAgent {
    constructor() {
        const config = {
            id: 'workflow-synthesizer-v1',
            name: 'Workflow Synthesizer & Visualizer',
            role: 'synthesizer',
            systemPrompt: SYNTHESIZER_SYSTEM_PROMPT,
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 6000
        };
        super(config);
    }
    /**
     * Synthesize a workflow from a chat transcript
     */
    async synthesizeWorkflow(request) {
        const llmRequest = {
            userMessage: this.formatSynthesisRequest(request),
            context: {
                chatLength: request.chatTranscript.messages.length,
                subjectMode: request.chatTranscript.context.subjectMode,
                availableTools: request.chatTranscript.context.availableTools,
                preferences: request.userPreferences
            }
        };
        const response = await this.processRequest(llmRequest);
        return this.parseSynthesisResponse(response);
    }
    /**
     * Format the chat transcript for analysis
     */
    formatSynthesisRequest(request) {
        const { chatTranscript, userPreferences } = request;
        const messagesText = chatTranscript.messages
            .map(msg => `[${msg.role.toUpperCase()}]: ${msg.content}`)
            .join('\n');
        return `Please analyze this chat conversation and create a reusable workflow:

CHAT TRANSCRIPT:
${messagesText}

CONTEXT:
- Subject Mode: ${chatTranscript.context.subjectMode}
- Available Tools: ${chatTranscript.context.availableTools.join(', ')}
- Project Context: ${chatTranscript.context.projectContext || 'None'}

USER PREFERENCES:
- Complexity Level: ${userPreferences.complexity}
- Include Visualization: ${userPreferences.includeVisualization}
- Suggested Tags: ${userPreferences.tags.join(', ')}

TASK:
1. Analyze the conversation flow to identify the main workflow pattern
2. Create a structured workflow with clear steps, inputs, and outputs
3. Generate an ASCII art visualization showing the workflow flow
4. Ensure the workflow is reusable with proper parameterization
5. Include error handling and decision points where appropriate

Please provide your analysis in the specified JSON format.`;
    }
    /**
     * Parse and validate the synthesis response
     */
    parseSynthesisResponse(response) {
        try {
            // Extract JSON from the response content
            const jsonMatch = response.content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            const parsed = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (!parsed.asciiVisualization || !parsed.structuredWorkflow || !parsed.confidence) {
                throw new Error('Missing required fields in synthesis response');
            }
            // Ensure confidence is within valid range
            parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));
            // Validate ASCII visualization format
            if (!this.validateAsciiVisualization(parsed.asciiVisualization)) {
                console.warn('ASCII visualization may have formatting issues');
            }
            return {
                asciiVisualization: parsed.asciiVisualization,
                structuredWorkflow: parsed.structuredWorkflow,
                confidence: parsed.confidence,
                reasoning: parsed.reasoning || []
            };
        }
        catch (error) {
            throw new Error(`Failed to parse synthesis response: ${error.message}`);
        }
    }
    /**
     * Validate ASCII visualization format
     */
    validateAsciiVisualization(ascii) {
        // Check for box-drawing characters
        const boxChars = ['┌', '─', '┐', '│', '└', '┘', '├', '┤', '┬', '┴', '┼'];
        const hasBoxChars = boxChars.some(char => ascii.includes(char));
        // Check for reasonable structure
        const lines = ascii.split('\n');
        const hasMultipleLines = lines.length > 3;
        const hasConsistentIndentation = lines.some(line => line.includes('  '));
        return hasBoxChars && hasMultipleLines && hasConsistentIndentation;
    }
    /**
     * Call the LLM API implementation
     */
    async callLLMAPI(messages, options) {
        // In a real implementation, this would call an actual LLM API
        // For now, we'll simulate the call and return a structured response
        // This is where you would integrate with your actual LLM service:
        // - OpenAI API
        // - Anthropic Claude
        // - Local LLM service
        // - Other LLM providers
        const simulatedResponse = {
            content: JSON.stringify({
                asciiVisualization: this.generateSampleVisualization(),
                structuredWorkflow: this.generateSampleWorkflow(),
                confidence: 0.85,
                reasoning: [
                    "Identified main workflow pattern from chat conversation",
                    "Extracted tool usage patterns and logical flow",
                    "Created parameterized steps for reusability",
                    "Added error handling for robust execution"
                ]
            }),
            tokensUsed: 1500,
            metadata: {
                model: this.model,
                temperature: options.temperature
            }
        };
        return simulatedResponse;
    }
    /**
     * Generate a sample ASCII visualization
     */
    generateSampleVisualization() {
        return `┌─────────────────────────────────────────┐
│           WORKFLOW START                │
│           User Request Entry             │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         STEP 1: ANALYZE REQUEST         │
│         ┌─────────────────────────┐     │
│         │ • Parse user input      │     │
│         │ • Identify requirements │     │
│         │ • Set context variables │     │
│         └─────────────────────────┘     │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       STEP 2: EXECUTE MAIN TASK         │
│         ┌─────────────────────────┐     │
│         │ • Call required tools   │     │
│         │ • Process data          │     │
│         │ • Generate outputs      │     │
│         └─────────────────────────┘     │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      STEP 3: FINALIZE & RESPOND         │
│         ┌─────────────────────────┐     │
│         │ • Format results        │     │
│         │ • Validate outputs      │     │
│         │ • Return to user        │     │
│         └─────────────────────────┘     │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│             WORKFLOW END                │
└─────────────────────────────────────────┘`;
    }
    /**
     * Generate a sample structured workflow
     */
    generateSampleWorkflow() {
        return {
            name: "Generated Workflow",
            description: "Workflow synthesized from chat conversation",
            steps: [
                {
                    stepId: "analyze_request",
                    name: "Analyze Request",
                    description: "Parse and analyze the user request",
                    toolCalls: [],
                    inputs: ["user_request"],
                    outputs: ["parsed_requirements"],
                    onSuccess: "execute_task",
                    onError: "abort"
                }
            ],
            parameters: [
                {
                    name: "user_request",
                    type: "string",
                    description: "The user's input request",
                    required: true
                }
            ],
            tags: ["generated", "automation"]
        };
    }
    /**
     * Validate response format
     */
    validateResponse(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch)
                return false;
            const parsed = JSON.parse(jsonMatch[0]);
            return !!(parsed.asciiVisualization && parsed.structuredWorkflow && parsed.confidence);
        }
        catch {
            return false;
        }
    }
}
exports.WorkflowSynthesizerAgent = WorkflowSynthesizerAgent;
//# sourceMappingURL=workflow-synthesizer-agent.js.map