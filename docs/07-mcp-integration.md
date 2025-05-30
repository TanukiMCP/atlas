# MCP Integration Architecture

## 🚀 MCP (Management Center Platform) Core Concepts

TanukiMCP Atlas utilizes an internal MCP framework to manage and execute all its tools, including Clear-Thought reasoning tools and various action-oriented tools (file system, web search, etc.). This provides a unified and extensible system for all non-LLM operations and for orchestrating LLM calls via the `OpenRouterService` when needed by a tool.

While the original MCP concept might involve connecting to external MCP *servers*, in the context of Atlas as a self-contained Electron application, the "MCP Hub" is an internal system that discovers, manages, and executes tools defined *within* the Atlas application itself (e.g., in the `packages/tools/` directory or as part of Clear-Thought).

## 🛠️ Internal Tool Management & Execution Service

```typescript
// Represents the internal service that manages and executes all MCP tools within Atlas
interface InternalMCPService {
  // Tool Discovery & Registration (during application startup)
  discoverAndRegisterTools(): Promise<void>;

  // Get a list of all available (registered) tools
  listAvailableTools(filter?: ToolFilter): Promise<MCPToolSummary[]>;

  // Get the detailed definition (including schema) for a specific tool
  getToolDefinition(toolId: string): Promise<MCPTool<any, any> | null>;

  // Execute a tool
  executeTool<InputParams, OutputResult>(
    toolId: string, 
    params: InputParams, 
    // executionContext might be implicitly provided by the service
  ): Promise<ToolResult<OutputResult>>;

  // Potentially stream results or progress from a tool if it supports it
  streamToolExecution?<InputParams, OutputResult>(
    toolId: string, 
    params: InputParams
  ): AsyncIterable<ToolProgressUpdate<OutputResult>>;
}

// Summary of a tool for listing purposes
interface MCPToolSummary {
  id: string;
  name: string;
  description: string;
  category?: string; // e.g., "File System", "Reasoning", "Web"
}

interface ToolFilter {
  category?: string;
  nameContains?: string;
}

// MCPTool and ToolResult interfaces are defined in 04-tool-system-architecture.md

// Progress update for streaming tool executions
interface ToolProgressUpdate<PartialOutputResult> {
  step: string; // Description of the current progress step
  progressPercentage?: number;
  intermediateResult?: PartialOutputResult; // For tools that yield intermediate data
  log?: string;
}
```

## ⚙️ Tool Definition and Structure

As defined in `04-tool-system-architecture.md`, each MCP tool (including Clear-Thought tools) will have:
1.  **Unique ID**: e.g., `clear.thought.sequentialThinking`, `file.system.readFile`.
2.  **Name & Description**: User-friendly information.
3.  **Input & Output Schemas**: JSON Schema definitions for parameters and results.
4.  **`execute` Method**: The core logic of the tool, which receives parameters and an `MCPExecutionContext`.

### `MCPExecutionContext` (Reiteration from Doc 04)
The `MCPExecutionContext` provided to each tool's `execute` method is crucial. It allows tools to:
-   Call other MCP tools (enabling composition and orchestration).
-   Access the `OpenRouterService` if the tool needs to perform LLM operations directly (e.g., a Clear-Thought tool using an LLM for a specific reasoning step).
-   Interact with application state or databases.
-   Request user confirmation if needed.

## 🔩 Workflow

1.  **Tool Discovery**: On startup, the `InternalMCPService` scans predefined locations (e.g., `packages/tools/implementations/`) for tool definitions and registers them.
2.  **Tool Listing/Selection**: The UI can query `InternalMCPService` to display available tools. Users or automated agents select tools for execution.
3.  **Execution**: 
    *   The `InternalMCPService` is requested to execute a specific tool with given parameters.
    *   It instantiates or invokes the tool, providing it with the necessary `MCPExecutionContext`.
    *   The tool performs its logic. If it's a Clear-Thought tool, this might involve complex reasoning, internal state management, or orchestrating other tools and OpenRouter calls.
    *   The tool returns a `ToolResult`.
4.  **Result Handling**: The calling service or UI processes the `ToolResult`.

This internal MCP approach simplifies integration by removing the need for external server management, connection handling, and complex health monitoring, focusing instead on a robust, extensible tool execution framework within the Atlas application. The primary "integration" is how different parts of Atlas (UI, agents, Clear-Thought planning) use this internal service to get things done.