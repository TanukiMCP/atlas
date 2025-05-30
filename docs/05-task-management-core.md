# Task Management & Workflow Orchestration Core

## 📋 Core Concepts: Plans, Steps, and Execution

Task management in TanukiMCP Atlas revolves around creating and executing dynamic plans. These plans are composed of steps, where each step typically involves an MCP Tool call (which could be a Clear-Thought reasoning tool or an action tool). OpenRouter LLM calls are primarily made by the `OpenRouterService` or by MCP Tools (like Clear-Thought) that require LLM capabilities for their logic.

```typescript
// Conceptual representation of a Plan and its Steps
interface TaskPlan {
  id: string;
  goal: string; // The overall objective
  description?: string;
  steps: PlanStep[];
  status: 'draft' | 'ready' | 'in-progress' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStepIndex: number;
  context: any; // Overall context for the plan execution
  createdAt: Date;
  updatedAt: Date;
}

interface PlanStep {
  id: string;
  planId: string;
  title: string; // User-friendly title for the step
  description?: string; // More details about what this step entails
  toolId: string; // Identifier of the MCP Tool to be executed (e.g., "clear.thought.deductive", "file.system.writeFile")
  toolParams: any; // Parameters to pass to the MCP Tool
  dependencies: string[]; // IDs of other PlanSteps that must complete first
  status: 'pending' | 'ready' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  result?: ToolResult<any>; // Result from the MCP Tool execution
  estimatedTime?: number; // Optional: estimated duration
  actualTime?: number; // Optional: actual duration
  retries?: number; // Number of times this step has been retried
}

// Service responsible for managing and executing plans
interface WorkflowOrchestrator {
  // Uses Clear-Thought (as an MCP Tool) or other planning logic to generate a plan
  createPlan(params: {
    goal: string;
    initialContext?: any;
    preferredOpenRouterModelId?: string; // For LLM steps within planning
  }): Promise<TaskPlan>;

  // Executes a given plan, step-by-step
  executePlan(planId: string): Promise<AsyncIterator<PlanStepExecutionUpdate>>;

  // Finds the next executable step in a plan
  findNextStep(planId: string): Promise<PlanStep | null>;

  // Executes a single step of a plan
  executeStep(planId: string, stepId: string): Promise<ToolResult<any>>;

  // Allows for adapting the plan if a step fails or new info arises (potentially using Clear-Thought)
  adaptPlan(planId: string, failedStepId?: string, newInformation?: any): Promise<TaskPlan>;
  
  // Get the current status of a plan
  getPlanStatus(planId: string): Promise<TaskPlan>;
}

interface PlanStepExecutionUpdate {
  planId: string;
  stepId: string;
  status: PlanStep['status'];
  result?: ToolResult<any>;
  logs?: string[];
  progressPercentage?: number; // Overall plan progress
}

// ToolResult is defined in 04-tool-system-architecture.md
```

## Workflow Lifecycle

1.  **Goal Definition**: User specifies a high-level goal or task.
2.  **Plan Generation**: The `WorkflowOrchestrator` (potentially using Clear-Thought tools via MCP) decomposes the goal into a `TaskPlan` consisting of sequential or parallel `PlanStep`s. Each step specifies an MCP Tool and its parameters.
3.  **Context Assembly**: For each step, relevant context (from previous steps, user input, or application state) is gathered.
4.  **Step Execution**: The orchestrator calls the specified MCP Tool for the current step. 
    *   If the tool is a Clear-Thought reasoning tool, it might perform its own internal LLM calls via OpenRouter (accessed through its execution context).
    *   If it's an action tool (e.g., file write), it performs the action.
5.  **Result Handling**: The `ToolResult` from the MCP Tool is stored. The orchestrator updates the step status and overall plan progress.
6.  **Iteration/Adaptation**: 
    *   If a step succeeds, the orchestrator moves to the next eligible step based on dependencies.
    *   If a step fails, the orchestrator might trigger a re-planning phase (again, potentially using Clear-Thought) to adapt the `TaskPlan`, retry the step, or halt execution.
7.  **Completion**: The workflow concludes when all steps are completed or if the plan is halted due to unrecoverable errors or user cancellation.

This model moves away from a rigid "TodoList" structure to a more flexible plan-based execution model where Clear-Thought tools play a significant role in planning and adaptation, and MCP Tools execute the individual steps, all leveraging OpenRouter for underlying LLM needs.