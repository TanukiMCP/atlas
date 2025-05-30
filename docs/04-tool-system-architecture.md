# TanukiMCP Atlas - Tool System Architecture

## 🧠 Core Enhancement Framework (Clear-Thought & MCP Tools)

**Fundamental Principle**: All LLM operations in TanukiMCP Atlas, accessed via OpenRouter, are designed to be augmented by a powerful suite of MCP (Management Center Platform) Tools. This includes the specialized Clear-Thought tools for advanced reasoning and a variety of general-purpose tools for actions like file operations, web searches, etc.

### Key Tool Categories & Their Roles

```typescript
interface AtlasToolEcosystem {
  // CLEAR-THOUGHT (MCP Reasoning Tools)
  clearThought: {
    purpose: 'Structured reasoning, planning, and problem-solving frameworks';
    capabilities: [
      'Sequential thinking for complex problems',
      'Mental model application (e.g., first principles, Occam's Razor)',
      'Scientific method application for hypothesis testing',
      'Collaborative reasoning simulation for diverse perspectives',
      'Decision-making frameworks for structured choices',
      'Metacognitive monitoring for self-assessment and correction'
    ];
    integration: 'Invoked as MCP tools for planning, analysis, or complex sub-tasks within a larger workflow. Can orchestrate other MCP tools or OpenRouter calls.';
  };

  // GENERAL MCP TOOLS (Action-Oriented)
  mcpActionTools: {
    purpose: 'Performing concrete actions and interacting with the environment';
    capabilities: {
      fileSystem: 'Read, write, list, search files and directories (like a Desktop Commander)',
      codeOperations: 'Code search, analysis, linting, basic modifications',
      webSearch: 'Perform web searches via an API',
      terminalCommands: 'Execute shell commands (with user approval)',
      dataManagement: 'Interact with the internal database or user-specific data stores',
      // ... and other extensible tools via the MCP framework
    };
    integration: 'Invoked directly by user, or by Clear-Thought planning tools, or by agentic workflows to interact with the system and external resources.';
  };

  // CONTEXT MANAGEMENT (Implicitly via Tools & Application State)
  contextManagement: {
    purpose: 'Maintaining and utilizing relevant context for LLM interactions';
    capabilities: [
      'Session history management',
      'Retrieval of relevant data via MCP data/file tools',
      'User preference storage and access',
      'Project-specific context awareness (e.g., currently open files)'
    ];
    integration: 'Primarily managed by the application core. MCP tools can contribute to or consume this context. OpenRouter calls are enriched with relevant context.';
  };
}
```

## 🎯 Tool System Overview

The TanukiMCP Atlas tool system is built upon the MCP framework. This provides a unified way to define, register, discover, and execute tools. Clear-Thought tools are a specialized set of MCP tools focused on reasoning and planning. Other MCP tools provide capabilities for file operations, code manipulation, web interaction, etc.

All tools are designed to be callable by the user, by automated agents, or by other tools (e.g., a Clear-Thought planning tool might call a file system tool).

## 🛠️ Core Tool Interfaces (Conceptual)

Tools within the MCP framework generally adhere to a common interface for execution and schema definition.

```typescript
// Generic MCP Tool Definition
interface MCPTool<InputParams, OutputResult> {
  id: string; // Unique identifier (e.g., "clear.thought.sequentialThinking", "file.system.readFile")
  name: string; // User-friendly name
  description: string; // What the tool does
  inputSchema: JSONSchema; // Defines the structure of InputParams
  outputSchema: JSONSchema; // Defines the structure of OutputResult
  
  // Core execution method
  execute(params: InputParams, executionContext: MCPExecutionContext): Promise<ToolResult<OutputResult>>;
}

interface MCPExecutionContext {
  // Access to other MCP tools (for orchestration)
  callTool: <NestedInput, NestedOutput>(toolId: string, params: NestedInput) => Promise<ToolResult<NestedOutput>>;
  
  // Access to OpenRouter service (for tools that need direct LLM calls)
  getOpenRouterService: () => OpenRouterService; 
  
  // Access to application state / databases
  getApplicationState: (key: string) => any;
  setApplicationState: (key: string, value: any) => void;

  // User interaction (e.g., for approvals, clarifications)
  requestUserConfirmation: (prompt: string) => Promise<boolean>;
}

interface ToolResult<Output = any> {
  success: boolean;
  result?: Output;
  error?: string;
  logs?: string[]; // For debugging or verbose output
}

// Example: File Read Tool (as an MCP Tool)
interface ReadFileParams {
  path: string;
  encoding?: string;
}
interface ReadFileResult {
  content: string;
  metadata: { size: number; lastModified: Date; };
}
// const readFileTool: MCPTool<ReadFileParams, ReadFileResult> = { ... };

// Example: Clear-Thought Sequential Thinking Tool (as an MCP Tool)
interface SequentialThinkingParams {
  problem: string;
  initialThoughts?: number;
  maxThoughts?: number;
}
interface SequentialThinkingResult {
  finalConclusion: string;
  thoughtProcess: Array<{ thoughtNumber: number; thought: string; }>;
}
// const sequentialThinkingTool: MCPTool<SequentialThinkingParams, SequentialThinkingResult> = { ... };
```

### Key Design Principles for Tools:
1.  **Atomicity & Composability**: Tools should ideally perform a single, well-defined function but can be composed into complex workflows by Clear-Thought or an agent orchestrator.
2.  **Schema-Defined Inputs/Outputs**: Enforces clarity and allows for validation and automated UI generation.
3.  **Contextual Execution**: Tools can access necessary context (other tools, OpenRouter, app state) via the `MCPExecutionContext`.
4.  **Error Handling**: Tools must report success/failure clearly.
5.  **Extensibility**: The MCP framework should make it easy to add new tools.

This architecture ensures that all functionalities, from simple file reads to complex reasoning, are handled through a consistent and extensible tool system, deeply integrated with OpenRouter for LLM capabilities.