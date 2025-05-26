"use strict";
/**
 * Workflow Execution Service
 * Handles execution of saved workflows with parameter collection and step orchestration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionService = void 0;
class WorkflowExecutionService {
    config;
    events;
    activeExecutions = new Map();
    toolRouter; // Reference to tool router for executing tools
    constructor(config, events, toolRouter) {
        this.config = config;
        this.events = events;
        this.toolRouter = toolRouter;
    }
    /**
     * Execute a workflow with provided parameters
     */
    async executeWorkflow(workflow, parameters = {}) {
        const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const execution = {
            executionId,
            workflowId: workflow.workflowId,
            status: 'pending',
            startTime: new Date().toISOString(),
            parameters,
            results: [],
            errors: []
        };
        this.activeExecutions.set(executionId, execution);
        try {
            // Validate parameters
            this.validateWorkflowParameters(workflow, parameters);
            // Start execution
            execution.status = 'running';
            execution.currentStep = workflow.steps[0]?.stepId;
            this.events.onExecutionStart(execution);
            // Execute workflow steps
            await this.executeWorkflowSteps(workflow, execution);
            // Complete execution
            execution.status = 'completed';
            execution.endTime = new Date().toISOString();
            this.events.onExecutionComplete(execution);
        }
        catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date().toISOString();
            this.events.onExecutionError(execution, error.message);
            throw error;
        }
        finally {
            // Update stored execution
            this.activeExecutions.set(executionId, execution);
        }
        return execution;
    }
    /**
     * Validate workflow parameters against schema
     */
    validateWorkflowParameters(workflow, parameters) {
        const requiredParams = workflow.parameters.filter(p => p.required);
        for (const param of requiredParams) {
            if (!(param.name in parameters)) {
                throw new Error(`Required parameter missing: ${param.name}`);
            }
            // Type validation
            const value = parameters[param.name];
            if (!this.validateParameterType(value, param.type)) {
                throw new Error(`Parameter ${param.name} has invalid type. Expected ${param.type}`);
            }
            // Value validation
            if (param.validation) {
                this.validateParameterValue(value, param.validation, param.name);
            }
        }
    }
    /**
     * Validate parameter type
     */
    validateParameterType(value, expectedType) {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'array':
                return Array.isArray(value);
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            case 'file':
                return typeof value === 'string' || (value && value.path);
            default:
                return true;
        }
    }
    /**
     * Execute workflow steps in order
     */
    async executeWorkflowSteps(workflow, execution) {
        let currentStepId = workflow.steps[0]?.stepId;
        const stepMap = new Map(workflow.steps.map(step => [step.stepId, step]));
        const executionContext = { ...execution.parameters };
        while (currentStepId && currentStepId !== 'end') {
            const step = stepMap.get(currentStepId);
            if (!step) {
                throw new Error(`Step not found: ${currentStepId}`);
            }
            execution.currentStep = currentStepId;
            this.events.onStepStart(currentStepId, step.name);
            try {
                const stepResult = await this.executeStep(step, executionContext);
                execution.results.push(stepResult);
                this.events.onStepComplete(currentStepId, stepResult);
                // Update execution context with step outputs
                if (stepResult.output && typeof stepResult.output === 'object') {
                    Object.assign(executionContext, stepResult.output);
                }
                // Determine next step
                currentStepId = stepResult.success ? step.onSuccess : step.onError;
                if (currentStepId === 'abort') {
                    throw new Error(`Workflow aborted at step: ${step.name}`);
                }
                // Update progress
                const completedSteps = execution.results.length;
                const totalSteps = workflow.steps.length;
                const progress = Math.round((completedSteps / totalSteps) * 100);
                this.events.onProgress(execution.executionId, progress);
            }
            catch (error) {
                const stepError = {
                    stepId: currentStepId,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                    retryCount: 0,
                    fatal: true
                };
                execution.errors.push(stepError);
                this.events.onStepError(currentStepId, stepError);
                // Handle error based on step configuration
                if (step.onError === 'abort') {
                    throw error;
                }
                else {
                    currentStepId = step.onError;
                }
            }
        }
    }
    /**
     * Execute a single workflow step
     */
    async executeStep(step, context) {
        const startTime = Date.now();
        try {
            // Prepare inputs
            const stepInputs = this.prepareStepInputs(step.inputs, context);
            // Execute tool calls
            const toolResults = [];
            for (const toolCall of step.toolCalls) {
                const toolResult = await this.executeToolCall(toolCall, stepInputs, context);
                toolResults.push(toolResult);
            }
            // Prepare outputs
            const stepOutputs = this.prepareStepOutputs(step.outputs, toolResults, context);
            return {
                stepId: step.stepId,
                success: true,
                output: stepOutputs,
                duration: Date.now() - startTime,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                stepId: step.stepId,
                success: false,
                output: { error: error.message },
                duration: Date.now() - startTime,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * Execute a tool call
     */
    async executeToolCall(toolCall, stepInputs, context) {
        if (!this.toolRouter) {
            throw new Error('Tool router not available');
        }
        // Resolve parameter values from context
        const resolvedParameters = this.resolveParameterValues(toolCall.parameters, {
            ...context,
            ...stepInputs
        });
        // Execute tool via tool router
        const result = await this.toolRouter.executeTool(toolCall.toolName, resolvedParameters);
        if (!result.success) {
            throw new Error(`Tool execution failed: ${result.error}`);
        }
        return result.data;
    }
    /**
     * Resolve parameter values with variable substitution
     */
    resolveParameterValues(parameters, context) {
        const resolved = {};
        for (const [key, value] of Object.entries(parameters)) {
            if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
                // Variable substitution
                const varName = value.slice(2, -1);
                resolved[key] = context[varName] ?? value;
            }
            else {
                resolved[key] = value;
            }
        }
        return resolved;
    }
    /**
     * Prepare step inputs from context
     */
    prepareStepInputs(inputs, context) {
        const stepInputs = {};
        for (const inputName of inputs) {
            if (inputName in context) {
                stepInputs[inputName] = context[inputName];
            }
        }
        return stepInputs;
    }
    /**
     * Prepare step outputs for next steps
     */
    prepareStepOutputs(outputs, toolResults, context) {
        const stepOutputs = {};
        // Map tool results to named outputs
        outputs.forEach((outputName, index) => {
            if (index < toolResults.length) {
                stepOutputs[outputName] = toolResults[index];
            }
        });
        return stepOutputs;
    }
    /**
     * Get execution status
     */
    getExecution(executionId) {
        return this.activeExecutions.get(executionId) || null;
    }
    /**
     * Cancel execution
     */
    async cancelExecution(executionId) {
        const execution = this.activeExecutions.get(executionId);
        if (execution && execution.status === 'running') {
            execution.status = 'cancelled';
            execution.endTime = new Date().toISOString();
            this.events.onExecutionComplete(execution);
        }
    }
    /**
     * Get all active executions
     */
    getActiveExecutions() {
        return Array.from(this.activeExecutions.values()).filter(exec => exec.status === 'running' || exec.status === 'pending');
    }
}
exports.WorkflowExecutionService = WorkflowExecutionService;
//# sourceMappingURL=workflow-execution-service.js.map