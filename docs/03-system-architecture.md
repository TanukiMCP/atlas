# TanukiMCP Atlas - System Architecture

## 🧠 Intelligence Amplification Pipeline (OpenRouter Based)

**Core Insight**: LLMs accessed via OpenRouter, when augmented with sophisticated tool orchestration (MCP Tools) and advanced reasoning (Clear-Thought), can achieve high performance for complex tasks.

### Core Request Processing Flow
```typescript
interface RequestProcessingPipeline {
  // 1. REQUEST CLASSIFICATION & ROUTING (Uses OpenRouter Models)
  router: {
    subjectMode: 'math' | 'code' | 'science' | 'language' | 'general';
    complexity: 'simple' | 'complex' | 'multi-agent';
    toolsRequired: string[]; // MCP Tools identified
    openRouterModelId: string; // Selected OpenRouter model for the task
  };
  
  // 2. TOOL CONTEXT ASSEMBLY (MCP Tools & Clear-Thought)
  contextAssembly: {
    documentationRetrieval: 'Via MCP search/file tools',
    userMemory: 'Session state and MCP data tools',
    fileSystemOperations: 'Via MCP Desktop Commander-like tools',
    clearThought: 'Reasoning enhancement & planning tools',
    customMCP: 'User-installed MCP tool extensions'
  };
  
  // 3. ENHANCED MODEL PROCESSING (OpenRouter + Clear-Thought)
  modelProcessing: {
    openRouter: 'All LLM calls via OpenRouter API using selected modelId',
    clearThoughtIntegration: 'Clear-Thought tools for pre/post processing, or as part of the main task'
  };
  
  // 4. AGENT ORCHESTRATION (MCP-driven)
  agentOrchestration: {
    taskDistribution: 'MCP workflows for multi-agent collaboration',
    handoffProtocols: 'Context transfer between MCP tool executions',
    shiftNotes: 'Detailed context for sequential MCP tool calls',
    memoryPersistence: 'Session continuity via app state and MCP data tools'
  };
}
```

## 🏗️ Core Technology Stack

```typescript
// Frontend Architecture
Frontend: Electron 28+ + React 18+ + TypeScript 5+
UI Framework: Tailwind CSS 3+ + shadcn/ui (Radix UI + Tailwind)
State Management: Zustand for global state, potentially other hooks for local/server state

// Backend (Electron Main Process & Potentially MCP Server)
BackendLogic: Node.js 20+ in Electron Main; MCP server might be separate Node.js process.
Database: SQLite 3+ with better-sqlite3 driver + Drizzle ORM (in Electron Main)
LLM Integration: OpenRouter API (via dedicated service in Electron Main)
File Operations: Node.js fs/promises (exposed via MCP Tools)

// Intelligence Amplification Architecture (CORE)
EnhancementStack: Clear-Thought (reasoning tools), MCP Tools (action tools), Context Management
RequestClassification: LLM-assisted routing to select appropriate OpenRouter models and MCP Tools.
ToolContextAssembly: Gathering necessary information using MCP Tools before major OpenRouter calls.
AgentOrchestration: Managing sequences of MCP Tool calls, potentially involving Clear-Thought for planning.

// IPC & Communication
ElectronIPC: Typed channels (e.g., using Zod for validation) between Renderer and Main.
Potentially WebSockets/HTTP: If MCP server is a separate process, for communication with it.
Streaming: Server-Sent Events or direct streaming from OpenRouter via Main process to Renderer.

// Development Tools
BuildSystem: Vite 5+ for renderer, esbuild for main process.
Testing: Vitest, React Testing Library, Playwright for E2E.
CodeQuality: ESLint, Prettier, TypeScript strict mode.
```

## 📁 Application Structure (Conceptual - Key Areas)

```
tanukimcp-atlas/
├── packages/
│   ├── main/                          # Electron main process
│   │   ├── src/
│   │   │   ├── ipc/                   # IPC handlers (OpenRouter, MCP Tools, Files, etc.)
│   │   │   ├── services/              # Core services (Database, OpenRouterService, MCPToolExecutor)
│   │   │   └── main.ts                # Entry point
│   ├── renderer/                      # React frontend
│   │   ├── src/
│   │   │   ├── components/            # UI Components (Chat, FileTree, Tool Selectors)
│   │   │   ├── features/              # Feature-specific modules (e.g., Chat, WorkflowBuilder)
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── stores/                # Zustand global stores
│   │   │   ├── services/              # API clients for Electron IPC
│   │   │   └── main.tsx               # Entry point
│   ├── shared/                        # Shared utilities, types, constants
│   │   ├── types/                     # TypeScript definitions (OpenRouter, MCP, Chat, etc.)
│   │   └── constants/                 # Application constants
│   ├── tools/                         # Built-in MCP Tool implementations (Clear-Thought, File Ops, etc.)
│   │   ├── definitions/             # Schemas and definitions for tools
│   │   └── implementations/         # Actual tool logic
│   ├── mcp-server/                    # Optional: If MCP Hub/Server is a separate process
│   │   ├── src/                     # Server logic, tool registration, execution
│   │   └── package.json
│   └── templates/                     # MCP server templates
├── scripts/                           # Development scripts
├── docs/                             # Documentation
├── package.json                      # Root package configuration
└── turbo.json                        # Monorepo configuration
```

This structure emphasizes a clear separation between the Electron main process (handling OpenRouter calls, database, core services), the renderer process (UI), shared code, and the MCP tool implementations. The `llm-enhanced` package might be refactored or its responsibilities distributed among `main` (OpenRouterService, orchestration) and `tools` (Clear-Thought implementations).

## Key Architectural Principles (OpenRouter Focused)

1.  **OpenRouter as Single LLM Gateway**: All LLM calls are funneled through a dedicated `OpenRouterService` in the main process. This service manages the API key, model selection, and communication with the OpenRouter API.
2.  **MCP Tools for Actions**: All external actions, file operations, web searches, and even complex reasoning steps (via Clear-Thought) are implemented as MCP Tools. This provides a unified and extensible way to add capabilities.
3.  **Clear-Thought for Reasoning**: Clear-Thought tools are a specialized set of MCP tools focused on planning, analysis, decision-making, and self-correction. They often orchestrate other MCP tools or OpenRouter calls.
4.  **Electron Main as Backend Core**: The Electron main process hosts critical backend logic: OpenRouter integration, database access, MCP tool execution orchestration, and managing application state.
5.  **Renderer for UI and User Interaction**: The React-based renderer process is responsible for all UI, user input, and presenting results. It communicates with the main process via IPC.
6.  **Centralized State Management**: Zustand (or similar) for global UI state in the renderer, while the main process manages persistent application data and core service states.

This architecture ensures that TanukiMCP Atlas leverages the power and flexibility of OpenRouter for its core LLM capabilities, while using the MCP and Clear-Thought frameworks to build a highly intelligent and extensible AI development platform.