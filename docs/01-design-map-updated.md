# TanukiMCP: Atlas - Complete Design Map (2025 Updated)

## Executive Summary

TanukiMCP: Atlas is a free, local AI-powered desktop IDE that rivals Cursor/Windsurf using Ollama for local LLM hosting. The key innovation is systematic todolist-based task execution that makes LLMs more reliable for complex software development tasks.

**Core Value Proposition:**
- 100% free alternative to expensive cloud LLMs ($20-100/month)
- Complete data privacy with local processing
- Advanced tool management system with MCP extensibility
- Visual file management with animated code generation
- Sophisticated task orchestration via todolist engine

## 1. Updated System Architecture (2025)

### Frontend Stack
```
Frontend (Electron + React + TypeScript)
├── Main Process (Node.js)
│   ├── Ollama Integration Service
│   ├── Desktop Commander Tools
│   ├── MCP Client Hub
│   ├── SQLite Database (WAL mode)
│   └── File System Manager
├── Renderer Process (React + Vite)
│   ├── Monaco Editor (VS Code engine)
│   ├── File Explorer (Virtual scrolling)
│   ├── Chat Interface (Real-time streaming)
│   ├── Todolist Dashboard
│   └── Diff Viewer (Animated)
└── Preload Scripts (Security bridge)
```

### Technology Choices (Based on 2025 Research)
- **Bundler**: Vite (fastest for Electron + React)
- **TypeScript**: v5.x with project references
- **Package Manager**: PNPM (fastest workspace support)
- **Database**: SQLite with WAL mode + better-sqlite3
- **IPC**: Batched messages with structured cloning
- **Architecture**: Nx monorepo with workspaces

## 2. Ollama Integration Layer (Enhanced)

### Model Management
```typescript
interface ModelConfiguration {
  id: string;
  name: string;
  size: string;
  capabilities: ModelCapability[];
  resourceRequirements: ResourceSpec;
  contextWindow: number;
  streamingSupport: boolean;
}

interface ModelCapability {
  type: 'coding' | 'reasoning' | 'vision' | 'embedding';
  specialty?: string[];
  performance: PerformanceMetric;
}
```

### Ollama Service Implementation
```typescript
class OllamaService {
  private models = new Map<string, ModelInstance>();
  private requestQueue = new PriorityQueue<OllamaRequest>();
  
  async streamCompletion(request: CompletionRequest): Promise<AsyncIterator<string>> {
    // Batched streaming with backpressure handling
    return this.createBatchedStream(request);
  }
  
  async embeddings(text: string, model: string): Promise<number[]> {
    // For RAG and semantic search
    return this.getEmbeddings(text, model);
  }
  
  private createBatchedStream(request: CompletionRequest) {
    // Implement streaming with 50ms batching window
    // Based on performance research
  }
}
```

### Model Selection Intelligence
```typescript
interface TaskModelSelector {
  selectOptimalModel(task: TaskDescription): Promise<ModelRecommendation>;
  
  // Examples:
  // - Small fast model for simple queries
  // - Large reasoning model for complex problems
  // - Code-specialized model for development tasks
}
```

## 3. Tool System Architecture (MCP + Desktop Commander)

### Tool Discovery and Management
```typescript
interface ToolManager {
  // MCP Integration
  registerMCPServer(server: MCPServerConfig): Promise<void>;
  discoverMCPTools(): Promise<MCPTool[]>;
  
  // Desktop Commander Integration
  getSystemTools(): DesktopCommanderTool[];
  
  // Intelligent Tool Selection
  selectTools(context: TaskContext): Promise<ToolSet>;
}

interface MCPTool {
  id: string;
  name: string;
  description: string;
  schema: JSONSchema;
  capabilities: ToolCapability[];
  security: SecurityConstraints;
}
```

### @ Symbol Tool Interface (Like Cursor)
```typescript
interface ToolSelector {
  // When user types @, show available tools
  getAvailableTools(context: string): Tool[];
  
  // Intelligent suggestions based on context
  suggestTools(codeContext: CodeContext): ToolSuggestion[];
  
  // Visual tool picker with search
  renderToolPicker(): ReactElement;
}
```

## 4. Todolist Engine (Core Innovation)

### Task Decomposition System
```typescript
interface TodolistEngine {
  createTodolist(goal: string, context: ProjectContext): Promise<Todolist>;
  executeTodolist(todolist: Todolist): Promise<ExecutionResult>;
  adaptTodolist(todolist: Todolist, feedback: Feedback): Promise<Todolist>;
}

interface TodoItem {
  id: string;
  description: string;
  type: TaskType;
  dependencies: string[];
  estimatedComplexity: number;
  requiredTools: string[];
  validationCriteria: ValidationRule[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

enum TaskType {
  FILE_READ = 'file_read',
  FILE_WRITE = 'file_write',
  CODE_ANALYSIS = 'code_analysis',
  RESEARCH = 'research',
  TESTING = 'testing',
  REFACTORING = 'refactoring'
}
```

### Execution Engine with Error Recovery
```typescript
class TodolistExecutor {
  async executeItem(item: TodoItem): Promise<ExecutionResult> {
    try {
      // Pre-execution validation
      await this.validatePreConditions(item);
      
      // Execute with selected tools
      const result = await this.executeWithTools(item);
      
      // Post-execution validation
      await this.validateResult(result, item.validationCriteria);
      
      return result;
    } catch (error) {
      // Intelligent error recovery
      return this.handleExecutionError(error, item);
    }
  }
  
  private async handleExecutionError(error: Error, item: TodoItem): Promise<ExecutionResult> {
    // Analyze error and suggest fixes
    const analysis = await this.analyzeError(error);
    
    // Attempt automated recovery
    if (analysis.canAutoRecover) {
      return this.attemptRecovery(item, analysis.recoveryStrategy);
    }
    
    // Request human intervention with context
    return this.requestHumanIntervention(error, item, analysis);
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