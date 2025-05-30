# TanukiMCP Atlas - Complete Design Map

## Executive Summary

TanukiMCP Atlas is an Intelligence Amplification Platform that transforms LLMs accessed via OpenRouter into superintelligent agents. This is achieved through sophisticated tool orchestration (MCP Tools), contextual enhancement, and advanced reasoning frameworks (Clear-Thought). The core insight is that well-equipped LLMs, regardless of size, can achieve superior performance when provided with the right tools and guidance.

**Core Value Proposition:**
- **Intelligence Amplification**: OpenRouter LLMs + MCP Tools + Clear-Thought = superior performance.
- **Built-in Enhancement Stack**: Clear-Thought for reasoning, MCP Tools for action, and robust context management.
- **Intelligent Request Routing**: Smart routing of requests to appropriate OpenRouter models.
- **Agent Orchestration**: Multi-agent handoffs with persistent memory and context.
- **Cloud-Powered**: All LLM operations are via OpenRouter; requires an API key.

## 1. Intelligence Amplification Architecture

### Core Request Processing Pipeline
```
User Request → Request Router (LLM-powered) → Subject Mode Selection → Tool Context Assembly (MCP) → Enhanced Model Processing (OpenRouter + Clear-Thought) → Agent Orchestration → Response Generation
```

### Enhancement Stack (Built-in)
```
Intelligence Amplification Platform
├── Request Classification Router
│   ├── Subject Mode Detection (Math/Code/Science/Language)
│   ├── Complexity Analysis (Simple/Complex/Multi-agent)
│   └── Tool Requirement Assessment (for MCP Tools)
├── Tool Context Assembly Layer (MCP-centric)
│   ├── Documentation Retrieval (via MCP Tools)
│   ├── User Memory Management (via MCP Tools & session state)
│   ├── File Operations (via MCP Tools like Desktop Commander)
│   ├── Clear-Thought (Reasoning Enhancement)
│   └── Custom MCP Extensions
├── Enhanced Model Processing (OpenRouter)
│   ├── Access to various models via OpenRouter API
│   └── Dynamic Model Selection based on task
└── Agent Orchestration Engine
    ├── Multi-agent Task Distribution
    ├── Agent Handoff Protocols
    ├── Shift Notes & Context Preservation
    └── Memory Persistence Between Sessions
└── Preload Scripts (Security bridge for Electron)
```

### Technology Choices
- **Bundler**: Vite (Electron + React)
- **TypeScript**: v5.x with project references
- **Package Manager**: PNPM (workspace support)
- **Database**: SQLite with Drizzle ORM (via `better-sqlite3`)
- **IPC**: Batched messages with structured cloning for Electron
- **Monorepo Structure**: Likely Turborepo or similar for managing `packages/*`

## 2. OpenRouter Integration Layer

### Model Management & Access
- All models are accessed via the OpenRouter API.
- The application manages an OpenRouter API key (user-provided).
- `ModelConfiguration`, `ModelCapability` and similar local management concepts are superseded by OpenRouter's model offerings and API.
- The system may still internally track preferred models or capabilities available through OpenRouter.

### OpenRouter Service Implementation
```typescript
// Simplified conceptual representation
class OpenRouterService {
  private apiKey: string;
  private currentModelId?: string; // User-selected or task-selected OpenRouter model

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async streamCompletion(request: OpenRouterCompletionRequest): Promise<AsyncIterator<string>> {
    // Interface with OpenRouter API for streaming completions
    // Handle API key, model selection, parameters
  }

  async getEmbeddings(text: string, modelId: string): Promise<number[]> {
    // Interface with OpenRouter API for embeddings (if supported by selected model)
  }
  
  async listAvailableModels(): Promise<OpenRouterModel[]> {
    // Fetch and cache available models from OpenRouter
  }
}
```
- The `OllamaService` is replaced by a dedicated `OpenRouterService`.
- Request queuing and model instance management are handled by OpenRouter.

### Model Selection Intelligence
- The system selects the most appropriate OpenRouter model for a given task based on:
  - Task requirements (coding, reasoning, etc.)
  - User preferences (e.g., preferred free models)
  - Model capabilities listed by OpenRouter.
- This is less about managing local model instances and more about choosing the right OpenRouter endpoint/model.

## 3. Tool System Architecture (MCP Tools + Clear-Thought)

### Tool Discovery and Management
- Tools are managed via the MCP (Management Center Platform) framework.
- This includes "Desktop Commander" like file system tools, and Clear-Thought reasoning tools.
```typescript
interface ToolManager { // Conceptual
  // MCP Integration
  discoverMCPTools(): Promise<MCPTool[]>; // Tools defined within the MCP ecosystem

  // Intelligent Tool Selection
  selectTools(context: TaskContext): Promise<ToolSet>; // Select appropriate MCP tools
}

interface MCPTool { // Simplified
  id: string;
  name: string;
  description: string;
  schema: JSONSchema; // Input schema for the tool
  execute(params: any): Promise<any>; // Tool execution logic
}
```

### @ Symbol Tool Interface (Similar to Cursor)
- The UI provides a way to invoke MCP Tools, potentially using an "@" symbol or similar mechanism.
- Suggestions are based on context and available MCP Tools.
```typescript
interface ToolSelectorUI {
  getAvailableTools(context: string): MCPTool[]; // Show available MCP Tools
  suggestTools(codeContext: CodeContext): MCPTool[]; // Suggest relevant MCP Tools
  renderToolPicker(): ReactElement; // UI for selecting tools
}
```

## 4. Task Engine (Powered by Clear-Thought & MCP Tools)

### Task Decomposition System
- Complex goals are broken down into a sequence of tasks.
- Clear-Thought tools can be used for planning and decomposition.
- Each task may involve one or more MCP tool calls.
```typescript
interface TaskEngine {
  createPlan(goal: string, context: ProjectContext): Promise<TaskPlan>; // Uses Clear-Thought
  executePlan(plan: TaskPlan): Promise<ExecutionResult>; // Executes MCP Tools
  adaptPlan(plan: TaskPlan, feedback: Feedback): Promise<TaskPlan>; // Re-planning with Clear-Thought
}

interface TaskStep { // A step in the plan
  id: string;
  description: string;
  toolId: string; // MCP Tool to use
  toolParams: any; // Parameters for the MCP tool
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}
```
- The concept of a `TodolistEngine` evolves into a more dynamic `TaskEngine` that heavily relies on Clear-Thought for planning and MCP Tools for execution, rather than predefined `TodoItem` types. Task types are implicitly defined by the capabilities of the available MCP Tools.

### Execution Engine with Error Recovery
- The Task Engine executes the plan step-by-step.
- Error handling involves:
  - Retrying MCP tool calls.
  - Using Clear-Thought to analyze failures and suggest alternative steps or tools.
  - Allowing user intervention.
```typescript
class TaskExecutor { // Conceptual
  async executeStep(step: TaskStep): Promise<ExecutionResult> {
    try {
      // Pre-execution validation (e.g., tool availability, schema match)
      const tool = getMCPToolById(step.toolId);
      // Execute MCP tool
      const result = await tool.execute(step.toolParams);
      // Post-execution validation (can use Clear-Thought for complex checks)
      return result;
    } catch (error) {
      // Error recovery: May involve Clear-Thought to re-plan or select alternative MCP tool
      return this.handleExecutionError(error, step);
    }
  }
}
```

## 5. Enhanced Database Schema

### Performance-Optimized SQLite Design
```sql
-- Enable performance optimizations
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000; -- 64MB cache
PRAGMA temp_store = MEMORY;

-- Core entities with optimized indexes
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  settings JSON
);

CREATE INDEX idx_projects_path ON projects(path);
CREATE INDEX idx_projects_updated ON projects(updated_at);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT,
  model_used TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX idx_conversations_project ON conversations(project_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at);

CREATE TABLE todolists (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  execution_context JSON,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE INDEX idx_todolists_conversation ON todolists(conversation_id);
CREATE INDEX idx_todolists_status ON todolists(status);

CREATE TABLE todo_items (
  id TEXT PRIMARY KEY,
  todolist_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  dependencies JSON,
  required_tools JSON,
  validation_criteria JSON,
  execution_result JSON,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (todolist_id) REFERENCES todolists(id)
);

CREATE INDEX idx_todo_items_todolist ON todo_items(todolist_id);
CREATE INDEX idx_todo_items_order ON todo_items(todolist_id, order_index);
CREATE INDEX idx_todo_items_status ON todo_items(status);
```

## 6. UI/UX Design (2025 Standards)

### Component Architecture
```typescript
interface AppLayout {
  sidebar: {
    fileExplorer: FileExplorerPanel;
    chatHistory: ChatHistoryPanel;
    toolbox: ToolboxPanel;
  };
  mainArea: {
    editor: MonacoEditor;
    chatInterface: ChatInterface;
    diffViewer: DiffViewer;
  };
  bottomPanel: {
    todolistDashboard: TodolistDashboard;
    terminal: IntegratedTerminal;
    logs: LogsPanel;
  };
}
```

### Modern UI Features
- **Animated Code Generation**: Real-time typing animation for generated code
- **Visual Diff Engine**: Side-by-side with highlighted changes
- **Smart File Explorer**: Virtual scrolling, search, Git integration
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Drag & Drop**: Files, code blocks, todo items
- **Command Palette**: Global search and actions (Cmd+K)

## 7. Performance Optimizations (2025 Best Practices)

### Electron Optimizations
```typescript
// V8 Snapshots for faster startup
app.commandLine.appendSwitch('snapshot-blob', path.join(__dirname, 'v8_context_snapshot.bin'));

// GPU acceleration
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-gpu-rasterization');

// Memory optimization
app.commandLine.appendSwitch('max-old-space-size', '4096');
app.commandLine.appendSwitch('js-flags', '--expose-gc');
```

### IPC Optimization
```typescript
class OptimizedIPC {
  private messageQueue: IPCMessage[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  
  send(channel: string, data: any) {
    this.messageQueue.push({ channel, data, timestamp: Date.now() });
    
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.flushMessages();
        this.batchTimeout = null;
      }, 16); // 60fps batching
    }
  }
  
  private flushMessages() {
    if (this.messageQueue.length > 0) {
      ipcRenderer.send('batch-messages', this.messageQueue);
      this.messageQueue = [];
    }
  }
}
```

### Bundle Optimization
```typescript
// Vite config for optimal Electron bundling
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['electron'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          monaco: ['monaco-editor'],
          ui: ['@chakra-ui/react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['electron']
  }
});
```

## 8. Security Framework

### Sandboxing and Isolation
```typescript
// Secure preload script
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  readFile: (path: string) => ipcRenderer.invoke('file:read', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('file:write', path, content),
  
  // Ollama operations
  streamCompletion: (request: CompletionRequest) => 
    ipcRenderer.invoke('ollama:stream', request),
  
  // Tool operations (with permission system)
  executeTool: (toolId: string, params: any) => 
    ipcRenderer.invoke('tool:execute', toolId, params),
});
```

### Permission System
```typescript
interface PermissionManager {
  requestPermission(tool: string, action: string): Promise<boolean>;
  checkPermission(tool: string, action: string): boolean;
  revokePermission(tool: string, action: string): void;
}
```

## 9. MCP Integration Hub

### MCP Client Implementation
```typescript
class MCPClientHub {
  private servers = new Map<string, MCPServer>();
  
  async discoverServers(): Promise<MCPServerInfo[]> {
    // Auto-discover local MCP servers
    return this.scanForMCPServers();
  }
  
  async installServer(serverInfo: MCPServerInfo): Promise<void> {
    // Install and register MCP server
    await this.downloadAndInstall(serverInfo);
    await this.registerServer(serverInfo);
  }
  
  async getAvailableTools(): Promise<MCPTool[]> {
    const allTools: MCPTool[] = [];
    
    for (const server of this.servers.values()) {
      const tools = await server.listTools();
      allTools.push(...tools);
    }
    
    return allTools;
  }
}
```

### Template MCP Server Generator
```typescript
interface MCPServerTemplate {
  generateServer(config: ServerConfig): Promise<string>; // Generated code
  validateServer(code: string): Promise<ValidationResult>;
  deployServer(code: string, config: ServerConfig): Promise<void>;
}
```

## 10. Development Workflow

### Project Structure (Nx Monorepo)
```
tanukimcp-atlas/
├── apps/
│   ├── desktop/                 # Main Electron app
│   │   ├── main/               # Main process
│   │   ├── renderer/           # Renderer process
│   │   └── preload/            # Preload scripts
│   └── mcp-server-template/    # Template server
├── libs/
│   ├── shared/                 # Shared types/utils
│   ├── ollama/                 # Ollama integration
│   ├── tools/                  # Tool management
│   ├── todolist/               # Todolist engine
│   ├── ui/                     # UI components
│   └── database/               # Database layer
├── tools/
│   ├── scripts/                # Build/dev scripts
│   └── generators/             # Nx generators
└── docs/                       # Documentation
```

### Build Pipeline
```typescript
// Multi-stage build with caching
const buildConfig = {
  stages: [
    'lint',
    'type-check',
    'test',
    'build-main',
    'build-renderer',
    'build-preload',
    'package'
  ],
  cache: {
    enabled: true,
    strategy: 'incremental'
  },
  targets: ['win32', 'darwin', 'linux']
};
```

## 11. Future Roadmap

### Phase 1: MVP (3 months)
- Basic Electron app with React frontend
- Ollama integration for local LLMs
- Simple chat interface
- File explorer with basic operations
- SQLite database setup

### Phase 2: Core Features (6 months)
- Todolist engine implementation
- Tool system with desktop-commander integration
- @ symbol tool selector
- Animated diff viewer
- Basic MCP client

### Phase 3: Advanced Features (9 months)
- MCP server hub and template generator
- Advanced performance optimizations
- Multi-model support
- Plugin ecosystem
- Cloud sync (optional)

### Phase 4: Polish & Scale (12 months)
- Enterprise features
- Advanced AI reasoning models
- Collaborative features
- Performance monitoring
- Community marketplace

## 12. Success Metrics

### Technical Metrics
- Startup time: < 3 seconds
- Memory usage: < 512MB base
- Chat response latency: < 200ms
- File operations: < 100ms
- Tool execution: < 500ms

### User Experience Metrics
- Task completion rate: > 85%
- User retention: > 70% after 30 days
- Time to first value: < 5 minutes
- Error recovery rate: > 90%

### Business Metrics
- Cost savings vs. cloud LLMs: > 80%
- Community adoption: 10k+ users in year 1
- MCP server ecosystem: 50+ community servers
- GitHub stars: 5k+ in year 1

## Conclusion

TanukiMCP: Atlas represents the next generation of AI-powered development tools, combining the power of local LLMs with sophisticated task orchestration. By implementing this comprehensive design, we create a free, privacy-focused alternative to expensive cloud-based AI coding assistants while advancing the state of the art in AI-human collaboration for software development.

The todolist-based approach is our key differentiator, making LLMs more reliable and systematic in handling complex development tasks. Combined with a rich ecosystem of tools via MCP and desktop-commander integration, Atlas will empower developers to work more efficiently while maintaining complete control over their data and development environment. 