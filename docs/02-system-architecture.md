# TanukiMCP: Atlas - System Architecture

## 🏗️ Core Technology Stack

```typescript
// Frontend Architecture
Frontend: Electron 28+ + React 18+ + TypeScript 5+
UI Framework: Tailwind CSS 3+ + Headless UI + Framer Motion
State Management: Zustand + React Query for server state
Styling: CSS-in-TS with Stitches + Radix Design System

// Backend Architecture  
Backend: Node.js 20+ + Fastify (high performance HTTP server)
Database: SQLite 3+ with better-sqlite3 driver + Drizzle ORM
LLM Integration: Ollama REST API (localhost:11434) + OpenAI SDK structure
File Operations: Node.js fs/promises + chokidar + micromatch for patterns

// Enhanced LLM Processing Architecture (NEW)
LLM Router: Multi-tier request classification and routing system
Quality Assurance: Tournament-bracket AI agent council for task enhancement
Execution Engine: Iterative task completion with progress tracking
User Intervention: Real-time stop/correction system with context preservation

// IPC & Communication
Electron IPC: Typed channels with validation using zod schemas
WebSocket: ws library for real-time tool execution updates
Streaming: Server-Sent Events for LLM response streaming

// Development Tools
Build System: Vite 5+ for renderer, esbuild for main process
Testing: Vitest + React Testing Library + Playwright for E2E
Code Quality: ESLint + Prettier + TypeScript strict mode
```

## 📁 Application Structure

```
tanukimcp-atlas/
├── packages/
│   ├── main/                          # Electron main process
│   │   ├── src/
│   │   │   ├── ipc/                   # IPC handlers
│   │   │   │   ├── chat.ts            # Chat management
│   │   │   │   ├── files.ts           # File operations  
│   │   │   │   ├── ollama.ts          # LLM integration
│   │   │   │   ├── llm-enhanced.ts    # Enhanced LLM processing
│   │   │   │   └── tools.ts           # Tool execution
│   │   │   ├── services/              # Core services
│   │   │   │   ├── database.ts        # SQLite operations
│   │   │   │   ├── file-watcher.ts    # File system monitoring
│   │   │   │   ├── tool-executor.ts   # Tool execution engine
│   │   │   │   └── llm-processor.ts   # Enhanced LLM processor
│   │   │   ├── security/              # Security policies
│   │   │   └── main.ts                # Entry point
│   │   └── package.json
│   ├── renderer/                      # React frontend
│   │   ├── src/
│   │   │   ├── components/            # React components
│   │   │   │   ├── chat/              # Chat interface
│   │   │   │   ├── file-tree/         # File explorer
│   │   │   │   ├── tool-selector/     # @ symbol interface
│   │   │   │   ├── diff-viewer/       # Code diffing
│   │   │   │   ├── llm-controls/      # LLM interaction controls
│   │   │   │   │   ├── stop-button.tsx        # Emergency stop
│   │   │   │   │   ├── tier-indicator.tsx     # Processing tier display
│   │   │   │   │   ├── progress-tracker.tsx   # Task progress
│   │   │   │   │   └── intervention-panel.tsx # User correction panel
│   │   │   │   └── quality-monitor/   # Quality assurance display
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── stores/                # Zustand stores
│   │   │   ├── services/              # API clients
│   │   │   └── main.tsx               # Entry point
│   │   ├── index.html
│   │   └── package.json
│   ├── server/                        # Local HTTP server
│   │   ├── src/
│   │   │   ├── routes/                # API endpoints
│   │   │   │   ├── chat.ts            # Chat operations
│   │   │   │   ├── tools.ts           # Tool definitions
│   │   │   │   ├── ollama.ts          # Ollama proxy
│   │   │   │   ├── mcp.ts             # MCP client hub
│   │   │   │   └── llm-enhanced.ts    # Enhanced LLM endpoints
│   │   │   ├── middleware/            # Request processing
│   │   │   ├── database/              # Database schemas
│   │   │   │   ├── migrations/        # Schema versions
│   │   │   │   └── schema.ts          # Drizzle schema
│   │   │   └── server.ts              # Fastify server
│   │   └── package.json
│   ├── shared/                        # Shared utilities
│   │   ├── types/                     # TypeScript definitions
│   │   │   ├── chat.ts                # Chat message types
│   │   │   ├── tools.ts               # Tool interfaces
│   │   │   ├── ollama.ts              # Ollama API types
│   │   │   ├── mcp.ts                 # MCP protocol types
│   │   │   └── llm-enhanced.ts        # Enhanced LLM types
│   │   ├── constants/                 # Application constants
│   │   ├── utils/                     # Utility functions
│   │   └── validation/                # Zod schemas
│   ├── tools/                         # Built-in tool implementations
│   │   ├── core/                      # Core tool engine
│   │   │   ├── base-tool.ts           # Abstract tool class
│   │   │   ├── tool-registry.ts       # Tool registration
│   │   │   └── execution-context.ts   # Tool execution context
│   │   ├── file-operations/           # File system tools
│   │   ├── code-operations/           # Code-specific tools
│   │   ├── task-management/           # Task system tools
│   │   ├── web-research/              # Web tools
│   │   └── project-management/        # Project tools
│   ├── llm-enhanced/                  # Enhanced LLM Processing (NEW)
│   │   ├── src/
│   │   │   ├── router/                # Request routing and classification
│   │   │   │   ├── request-classifier.ts      # Classify request types
│   │   │   │   ├── complexity-assessor.ts     # Evaluate task complexity
│   │   │   │   ├── tier-router.ts             # Route to processing tiers
│   │   │   │   └── hybrid-manager.ts          # Dynamic tier switching
│   │   │   ├── processors/            # Processing tier implementations
│   │   │   │   ├── atomic-processor.ts        # Fast single-step tasks
│   │   │   │   ├── moderate-processor.ts      # Multi-step tasks
│   │   │   │   ├── complex-processor.ts       # Sophisticated pipeline
│   │   │   │   └── expert-processor.ts        # Full tournament system
│   │   │   ├── planning/              # Task planning and context gathering
│   │   │   │   ├── time-aware.ts              # Temporal context
│   │   │   │   ├── profile-definer.ts         # Agent persona creation
│   │   │   │   ├── tool-router.ts             # Tool inventory and selection
│   │   │   │   ├── tasklist-generator.ts      # Master task planning
│   │   │   │   └── web-search-router.ts       # Search necessity detection
│   │   │   ├── quality-assurance/     # Tournament bracket system
│   │   │   │   ├── tournament-manager.ts      # Bracket orchestration
│   │   │   │   ├── enhancement-agents.ts      # Task improvement agents
│   │   │   │   ├── voting-system.ts           # Judge consensus system
│   │   │   │   ├── expert-panel.ts            # Final quality review
│   │   │   │   └── quality-metrics.ts         # Scoring and evaluation
│   │   │   ├── execution/             # Task execution engine
│   │   │   │   ├── task-sequencer.ts          # Next task identification
│   │   │   │   ├── executor-engine.ts         # Task implementation
│   │   │   │   ├── progress-tracker.ts        # Completion monitoring
│   │   │   │   └── loop-controller.ts         # Execution flow control
│   │   │   ├── communication/         # User-facing output
│   │   │   │   ├── result-synthesizer.ts      # Response formatting
│   │   │   │   ├── suggestion-generator.ts    # Next steps creation
│   │   │   │   ├── early-stopping.ts          # Quality optimization
│   │   │   │   └── summary-engine.ts          # Executive summaries
│   │   │   ├── intervention/          # User control systems
│   │   │   │   ├── stop-handler.ts            # Emergency stop processing
│   │   │   │   ├── correction-processor.ts    # User correction handling
│   │   │   │   ├── course-corrector.ts        # Dynamic plan adjustment
│   │   │   │   └── context-preserver.ts       # State management
│   │   │   ├── recovery/              # Failure handling
│   │   │   │   ├── failure-detector.ts        # Issue identification
│   │   │   │   ├── recovery-strategies.ts     # Problem resolution
│   │   │   │   ├── resilience-manager.ts      # System stability
│   │   │   │   └── health-monitor.ts          # Performance tracking
│   │   │   └── monitoring/            # System analytics
│   │   │       ├── performance-tracker.ts     # Speed and efficiency
│   │   │       ├── quality-monitor.ts         # Output quality assessment
│   │   │       ├── usage-analytics.ts         # User behavior analysis
│   │   │       └── alert-system.ts            # Notification management
│   │   └── package.json
│   ├── mcp-hub/                       # MCP client integration
│   │   ├── src/
│   │   │   ├── client/                # MCP client implementation
│   │   │   ├── registry/              # Server registry
│   │   │   └── proxy/                 # Request proxying
│   │   └── package.json
│   └── templates/                     # MCP server templates
├── scripts/                           # Development scripts
├── docs/                             # Documentation
├── package.json                      # Root package configuration
└── turbo.json                        # Monorepo configuration
```

## 🔗 Inter-Process Communication Architecture

```typescript
// IPC Channel Definitions
interface IPCChannels {
  // Chat operations
  'chat:send-message': { request: ChatMessage; response: ChatResponse };
  'chat:get-history': { request: { limit?: number }; response: ChatMessage[] };
  'chat:clear-history': { request: void; response: void };
  
  // File operations
  'files:read': { request: { path: string; offset?: number }; response: FileContent };
  'files:write': { request: { path: string; content: string }; response: void };
  'files:watch': { request: { path: string }; response: void };
  'files:unwatch': { request: { path: string }; response: void };
  
  // Tool operations
  'tools:list': { request: void; response: ToolDefinition[] };
  'tools:execute': { request: ToolCall; response: ToolResult };
  'tools:select': { request: { query: string; context: string }; response: string[] };
  
  // Ollama operations
  'ollama:models': { request: void; response: OllamaModel[] };
  'ollama:generate': { request: GenerateRequest; response: GenerateResponse };
  'ollama:stream': { request: StreamRequest; response: void };
  
  // Enhanced LLM operations (NEW)
  'llm-enhanced:route-request': { 
    request: { content: string; context: RequestContext }; 
    response: ProcessingRoute; 
  };
  'llm-enhanced:process-atomic': { 
    request: AtomicRequest; 
    response: AtomicResponse; 
  };
  'llm-enhanced:process-moderate': { 
    request: ModerateRequest; 
    response: ModerateResponse; 
  };
  'llm-enhanced:process-complex': { 
    request: ComplexRequest; 
    response: ComplexResponse; 
  };
  'llm-enhanced:stop-execution': { 
    request: { sessionId: string; reason?: string }; 
    response: StopResponse; 
  };
  'llm-enhanced:correct-course': { 
    request: { sessionId: string; correction: UserCorrection }; 
    response: CorrectionResponse; 
  };
  'llm-enhanced:monitor-progress': { 
    request: { sessionId: string }; 
    response: ProgressUpdate; 
  };
  'llm-enhanced:get-quality-metrics': { 
    request: { sessionId: string }; 
    response: QualityMetrics; 
  };
}

// Type-safe IPC implementation
class TypedIPC {
  async invoke<T extends keyof IPCChannels>(
    channel: T,
    data: IPCChannels[T]['request']
  ): Promise<IPCChannels[T]['response']> {
    return ipcRenderer.invoke(channel, data);
  }
  
  on<T extends keyof IPCChannels>(
    channel: T,
    handler: (data: IPCChannels[T]['response']) => void
  ): void {
    ipcRenderer.on(channel, (_, data) => handler(data));
  }
}
```

## 🧠 Enhanced LLM Processing Layer

The Enhanced LLM Processing Layer is a revolutionary addition that transforms TanukiMCP: Atlas into a sophisticated AI reasoning system. This layer sits between the user interface and the core LLM integration, providing:

### 🎭 Multi-Tier Architecture
- **Tier 1**: Request Router - Intelligent classification and routing
- **Tier 2**: Atomic Processor - Fast single-step execution  
- **Tier 3**: Moderate Processor - Multi-step task handling
- **Tier 4**: Complex Processor - Full sophisticated pipeline

### 🏆 Quality Assurance System
- **Tournament Bracket**: AI agents compete to enhance task plans
- **Voting Mechanism**: Consensus-based quality evaluation
- **Expert Panel**: Final quality validation and optimization

### 🔄 Adaptive Processing
- **Dynamic Routing**: Real-time tier switching based on complexity
- **Hybrid Mode**: Combination of multiple processing approaches
- **Learning Adaptation**: Continuous improvement from user feedback

### 🛑 User Intervention
- **Emergency Stop**: Instant halt with context preservation
- **Course Correction**: Real-time plan adjustment capabilities
- **Progressive Enhancement**: User-guided quality improvement

This architecture ensures that simple requests are handled quickly while complex tasks receive the sophisticated reasoning and quality assurance they require, all while maintaining complete user control and system reliability.