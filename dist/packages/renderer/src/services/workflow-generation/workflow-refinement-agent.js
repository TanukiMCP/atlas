"use strict";
/**
 * LLM Agent 2: Workflow Refinement
 * Interactive agent for refining workflows based on user feedback
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowRefinementAgent = void 0;
const base_llm_agent_1 = require("./base-llm-agent");
const REFINEMENT_SYSTEM_PROMPT = `You are an expert Workflow Refinement Agent for TanukiMCP Atlas. Your role is to understand user feedback and modify existing workflows with precision and intelligence.

CORE RESPONSIBILITIES:
1. Interpret user refinement requests with high accuracy
2. Modify workflow structures while maintaining integrity
3. Update ASCII visualizations to reflect changes
4. Provide clear explanations of modifications made
5. Ensure all changes preserve workflow executability

REFINEMENT CAPABILITIES:
- **Step Modifications**: Add, remove, modify, or reorder workflow steps
- **Tool Changes**: Update tool calls, parameters, and configurations
- **Flow Control**: Modify branching, conditions, and error handling
- **Parameter Updates**: Add, remove, or modify workflow parameters
- **Visualization Updates**: Maintain ASCII diagram accuracy and clarity
- **Metadata Changes**: Update descriptions, tags, and classifications

INTERPRETATION GUIDELINES:
- "Change step X to..." → Modify specific step content
- "Add a step after..." → Insert new step in sequence
- "Remove the step that..." → Delete identified step
- "Make it so that..." → Adjust workflow logic/flow
- "Add parameter for..." → Include new configurable parameter
- "Use tool Y instead of Z" → Replace tool calls
- "Add error handling for..." → Include failure recovery

ASCII VISUALIZATION MAINTENANCE:
- Keep diagrams properly aligned and formatted
- Update connections when steps are added/removed
- Maintain consistent box-drawing character usage
- Ensure visual flow matches logical flow
- Preserve readability and professional appearance

OUTPUT FORMAT:
Always return a JSON response with this exact structure:
{
  "updatedVisualization": "string with updated ASCII diagram",
  "updatedWorkflow": {partial workflow object with changes},
  "changes": [
    {
      "type": "add|modify|remove",
      "target": "step|parameter|metadata",
      "description": "clear description of change",
      "before": previous_value_if_applicable,
      "after": new_value
    }
  ],
  "explanation": "detailed explanation of modifications made"
}

QUALITY STANDARDS:
- All modifications must preserve workflow executability
- Changes must be logically consistent with existing structure
- ASCII diagrams must remain properly formatted
- Explanations must be clear and comprehensive
- Edge cases and impacts must be considered

Remember: You are refining existing work. Be precise, maintain quality, and clearly communicate all changes made.`;
class WorkflowRefinementAgent extends base_llm_agent_1.BaseLLMAgent {
    constructor() {
        const config = {
            id: 'workflow-refinement-v1',
            name: 'Workflow Refinement Agent',
            role: 'refinement',
            systemPrompt: REFINEMENT_SYSTEM_PROMPT,
            model: 'gpt-4',
            temperature: 0.3, // Lower temperature for precise modifications
            maxTokens: 5000
        };
        super(config);
    }
    /**
     * Refine a workflow based on user feedback
     */
    async refineWorkflow(request) {
        const llmRequest = {
            userMessage: this.formatRefinementRequest(request),
            context: {
                currentStepCount: request.currentWorkflow.steps?.length || 0,
                availableTools: request.context.availableTools,
                previousRefinements: request.context.previousRefinements,
                constraints: request.context.constraints
            },
            temperature: 0.3 // Precise modifications
        };
        const response = await this.processRequest(llmRequest);
        return this.parseRefinementResponse(response);
    }
    /**
     * Format the refinement request for the LLM
     */
    formatRefinementRequest(request) {
        const workflowJson = JSON.stringify(request.currentWorkflow, null, 2);
        return `Please refine this workflow based on the user's request:

CURRENT WORKFLOW STRUCTURE:
${workflowJson}

CURRENT ASCII VISUALIZATION:
${request.currentVisualization}

USER REFINEMENT REQUEST:
${request.userRequest}

CONTEXT:
- Available Tools: ${request.context.availableTools.join(', ')}
- Previous Refinements: ${request.context.previousRefinements.join('; ')}
- Constraints: ${request.context.constraints.join('; ')}

REFINEMENT REQUIREMENTS:
1. Interpret the user's request accurately
2. Make the requested modifications to the workflow structure
3. Update the ASCII visualization to reflect changes
4. Maintain workflow integrity and executability
5. Provide clear documentation of all changes made

Please respond with the updated workflow in the specified JSON format.`;
    }
    /**
     * Parse and validate the refinement response
     */
    parseRefinementResponse(response) {
        try {
            const jsonMatch = response.content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in refinement response');
            }
            const parsed = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (!parsed.updatedVisualization || !parsed.updatedWorkflow || !parsed.changes || !parsed.explanation) {
                throw new Error('Missing required fields in refinement response');
            }
            // Validate changes array
            if (!Array.isArray(parsed.changes)) {
                throw new Error('Changes must be an array');
            }
            // Validate each change object
            parsed.changes.forEach((change, index) => {
                if (!change.type || !change.target || !change.description) {
                    throw new Error(`Invalid change object at index ${index}`);
                }
                if (!['add', 'modify', 'remove'].includes(change.type)) {
                    throw new Error(`Invalid change type: ${change.type}`);
                }
                if (!['step', 'parameter', 'metadata'].includes(change.target)) {
                    throw new Error(`Invalid change target: ${change.target}`);
                }
            });
            return {
                updatedVisualization: parsed.updatedVisualization,
                updatedWorkflow: parsed.updatedWorkflow,
                changes: parsed.changes,
                explanation: parsed.explanation
            };
        }
        catch (error) {
            throw new Error(`Failed to parse refinement response: ${error.message}`);
        }
    }
    /**
     * Call the LLM API implementation
     */
    async callLLMAPI(messages, options) {
        // Simulate a refinement response
        const simulatedResponse = {
            content: JSON.stringify({
                updatedVisualization: this.generateUpdatedVisualization(),
                updatedWorkflow: this.generateUpdatedWorkflow(),
                changes: [
                    {
                        type: "modify",
                        target: "step",
                        description: "Updated step 2 to include additional validation",
                        before: "Basic validation",
                        after: "Enhanced validation with error checking"
                    }
                ],
                explanation: "Modified the workflow based on user request to add enhanced validation capabilities. The ASCII diagram has been updated to reflect the new step structure."
            }),
            tokensUsed: 1200,
            metadata: {
                model: this.model,
                temperature: options.temperature
            }
        };
        return simulatedResponse;
    }
    /**
     * Generate sample updated visualization
     */
    generateUpdatedVisualization() {
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
│    STEP 2: ENHANCED VALIDATION          │
│         ┌─────────────────────────┐     │
│         │ • Validate inputs       │     │
│         │ • Check constraints     │     │
│         │ • Error handling        │     │
│         └─────────────────────────┘     │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       STEP 3: EXECUTE MAIN TASK         │
│         ┌─────────────────────────┐     │
│         │ • Call required tools   │     │
│         │ • Process data          │     │
│         │ • Generate outputs      │     │
│         └─────────────────────────┘     │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      STEP 4: FINALIZE & RESPOND         │
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
     * Generate sample updated workflow
     */
    generateUpdatedWorkflow() {
        return {
            name: "Enhanced Workflow",
            description: "Workflow with improved validation and error handling",
            steps: [
                {
                    stepId: "analyze_request",
                    name: "Analyze Request",
                    description: "Parse and analyze the user request",
                    toolCalls: [],
                    inputs: ["user_request"],
                    outputs: ["parsed_requirements"],
                    onSuccess: "validate_inputs",
                    onError: "abort"
                },
                {
                    stepId: "validate_inputs",
                    name: "Enhanced Validation",
                    description: "Validate inputs with comprehensive error checking",
                    toolCalls: [],
                    inputs: ["parsed_requirements"],
                    outputs: ["validated_inputs"],
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
            tags: ["enhanced", "validation", "automation"]
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
            return !!(parsed.updatedVisualization &&
                parsed.updatedWorkflow &&
                parsed.changes &&
                parsed.explanation);
        }
        catch {
            return false;
        }
    }
    /**
     * Analyze the complexity of a refinement request
     */
    analyzeRefinementComplexity(userRequest) {
        const request = userRequest.toLowerCase();
        // Simple indicators
        const simpleMarkers = ['change', 'update', 'modify', 'replace'];
        const moderateMarkers = ['add', 'remove', 'insert', 'reorder'];
        const complexMarkers = ['restructure', 'redesign', 'completely change', 'overhaul'];
        let complexity = 'simple';
        let estimatedChanges = 1;
        const affectedComponents = [];
        if (complexMarkers.some(marker => request.includes(marker))) {
            complexity = 'complex';
            estimatedChanges = 5;
        }
        else if (moderateMarkers.some(marker => request.includes(marker))) {
            complexity = 'moderate';
            estimatedChanges = 3;
        }
        // Identify affected components
        if (request.includes('step'))
            affectedComponents.push('steps');
        if (request.includes('parameter'))
            affectedComponents.push('parameters');
        if (request.includes('tool'))
            affectedComponents.push('toolCalls');
        if (request.includes('flow') || request.includes('sequence'))
            affectedComponents.push('flow');
        if (request.includes('error') || request.includes('handling'))
            affectedComponents.push('errorHandling');
        return { complexity, estimatedChanges, affectedComponents };
    }
}
exports.WorkflowRefinementAgent = WorkflowRefinementAgent;
//# sourceMappingURL=workflow-refinement-agent.js.map