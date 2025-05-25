# 🦝 TanukiMCP Atlas - Phase 1 Foundation

**Local AI-powered IDE with Hub-Based Dual MCP Architecture**

TanukiMCP Atlas is a fully local, free, open-source AI-powered IDE that uses a sophisticated Hub-Based Dual MCP Architecture. The IDE acts as both an MCP server (hosting built-in tools) and MCP client (connecting to external MCP servers).

## 🎯 Project Status: Phase 1 Complete ✅

✅ **Foundation Structure**: Complete monorepo with Turbo orchestration  
✅ **Electron Application**: Main process with window management and security  
✅ **Database System**: SQLite with Drizzle ORM and comprehensive schema  
✅ **IPC Communication**: Type-safe communication between main/renderer  
✅ **React Frontend**: Modern UI with Zustand state management  
✅ **TypeScript**: Strict mode with comprehensive type definitions  
✅ **Build System**: Vite for renderer, esbuild for main process  

## 🏗️ Architecture Overview

```
TanukiMCP Atlas (Hub-Based Dual MCP Architecture)
├── Built-in MCP Server (FastMCP) - 100% uptime tools
│   ├── File Operations (read_file, write_file, edit_block)
│   ├── Task Management (create_todolist)
│   ├── Subject-Specific Tools (mathematics, programming, etc.)
│   └── CRUD Operations (comprehensive data management)
├── MCP Client Hub - External server integration
│   ├── stdio transport (local command-line servers)
│   ├── HTTP/SSE transport (web-based servers)
│   └── Tool aggregation with conflict resolution
├── Enhanced LLM Router (Multi-tier processing)
│   ├── Ollama Integration (Local models only)
│   └── Context-aware tool selection
└── Intelligent UI
    ├── Chat History CRUD
    ├── Workflow Management (save-chat-as-workflow)
    ├── Subject Mode Switching
    └── @ Symbol Tool Integration
```

## 📁 Project Structure

```
tanukimcp-atlas/
├── package.json (root workspace)
├── turbo.json (monorepo configuration)
├── packages/
│   ├── main/ (Electron main process)
│   │   ├── src/
│   │   │   ├── main.ts (Application entry point)
│   │   │   ├── window.ts (Window management)
│   │   │   ├── ipc/handlers.ts (IPC communication)
│   │   │   └── database/
│   │   │       ├── connection.ts (SQLite setup)
│   │   │       └── schema.ts (Comprehensive schema)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── renderer/ (React frontend)
│   │   ├── src/
│   │   │   ├── main.tsx (React entry point)
│   │   │   ├── App.tsx (Main application)
│   │   │   ├── stores/app-store.ts (Zustand state)
│   │   │   └── index.css (Professional styling)
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/ (Shared utilities)
│       ├── src/
│       │   ├── types/
│       │   │   ├── ipc.ts (IPC type definitions)
│       │   │   └── database.ts (Database types)
│       │   └── utils/
│       │       └── validation.ts (Validation utilities)
│       ├── package.json
│       └── tsconfig.json
└── scripts/
    └── setup.js (Development setup)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**: Required for development
- **npm**: Package manager
- **Git**: Version control
- **Ollama** (optional): For local LLM support

### Installation

1. **Clone and setup**:
   ```bash
   git clone https://github.com/TanukiMCP/atlas
   cd tanukimcp-atlas
   npm run setup  # Runs system checks and creates missing directories
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

### Optional: Ollama Setup

For local LLM support, install Ollama and recommended models:

```bash
# Install Ollama (see https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Install recommended models
ollama pull deepseek-r1-distill-qwen:7b  # Efficient reasoning model
ollama pull qwq:32b                      # Advanced reasoning (requires 24GB+ RAM)
```

## 🧠 Enhanced Features (Phase 1 Foundation)

### Database Schema
- **Projects**: Workspace management with metadata
- **Chat Sessions**: CRUD operations with favorites, archiving, tagging
- **Chat History**: Complete message tracking with tool usage analytics
- **Context Entries**: Intelligent context management with vector embeddings
- **Workflows**: Save-chat-as-workflow with LangChain integration
- **MCP Servers**: External server configuration and health monitoring
- **Model Configurations**: Performance tracking and optimization
- **Subject Modes**: Specialized tool modes (mathematics, programming, etc.)
- **Settings**: User preferences and system configuration
- **Analytics**: Performance and usage tracking

### Type-Safe Architecture
- **IPC Communication**: Fully typed channels with validation
- **Database Operations**: Type-safe queries with Drizzle ORM
- **State Management**: Zustand with TypeScript integration
- **Validation**: Comprehensive data validation utilities

### Professional UI
- **Dark/Light Themes**: CSS custom properties for theming
- **Responsive Design**: Mobile-friendly responsive layout
- **IDE-Style Interface**: Title bar, sidebar, status bar
- **Error Handling**: Comprehensive error boundaries and recovery
- **Loading States**: Professional loading and transition states

## 🎯 Coming in Future Phases

### Phase 2: Advanced Local LLM Integration
- Complete Ollama integration with model management
- Hardware assessment and performance prediction
- KV cache optimization and parameter tuning
- Model installation suite with progress tracking

### Phase 3: Built-in MCP Server
- FastMCP-based built-in tools with 100% uptime
- Subject-specific tool suites (STEM, Languages, etc.)
- Enhanced file operations with security
- Task management and TodoList visualization

### Phase 4: External MCP Integration
- MCP client hub for external servers
- stdio/HTTP/SSE transport support
- Tool aggregation with conflict resolution
- Health monitoring and automatic recovery

### Phase 5-8: Advanced Features
- Enhanced LLM routing with multi-tier processing
- Unified tool router with @ symbol integration
- Complete UI implementation with workflow management
- MCP management center with comprehensive monitoring

## 📋 Development Commands

```bash
# Development
npm run dev          # Start all packages in development mode
npm run build        # Build all packages for production
npm start           # Start built application

# Individual packages
npm run dev --workspace=@tanukimcp/renderer    # Start only renderer
npm run build --workspace=@tanukimcp/main      # Build only main process

# Utilities
npm run type-check   # Run TypeScript type checking
npm run clean       # Clean all build outputs
npm run setup       # Run development setup checks
```

## 🛠️ Technical Stack

- **Desktop**: Electron 28+ with context isolation
- **Frontend**: React 18 + TypeScript + Zustand
- **Backend**: Node.js with TypeScript
- **Database**: SQLite + better-sqlite3 + Drizzle ORM
- **Build**: Turbo (monorepo) + Vite (renderer) + esbuild (main)
- **Styling**: CSS Custom Properties + Modern CSS
- **Architecture**: Hub-Based Dual MCP with local-only operation

## 🔐 Security & Privacy

- **100% Local**: No cloud APIs or external services required
- **Context Isolation**: Electron security best practices
- **Input Validation**: Comprehensive validation for all data
- **Path Sanitization**: Safe file system operations
- **Rate Limiting**: Built-in rate limiting utilities
- **No Telemetry**: Complete privacy with optional local analytics

## 📚 Documentation

- **Architecture**: `docs/15-mcp-architecture-complete.md`
- **Local-Only Changes**: `docs/16-local-only-architecture-changes.md`
- **Implementation Guide**: `docs/17-implementation-prompts.md`
- **System Architecture**: `docs/02-system-architecture.md`
- **Project Overview**: `docs/01-project-overview.md`

## 🤝 Contributing

TanukiMCP Atlas is designed for the community. The monorepo structure makes it easy to contribute to specific areas:

- **Core Features**: `packages/main/` and `packages/shared/`
- **UI Components**: `packages/renderer/`
- **Documentation**: `docs/`
- **Build Tools**: `scripts/` and root configuration

## 📄 License

MIT License - see `LICENSE` file for details.

## 🎉 What's Next?

With Phase 1 complete, you have a solid foundation for building the world's most advanced local AI IDE. The architecture is designed for:

- **Modularity**: Easy to extend and modify
- **Performance**: Optimized for local operation
- **Scalability**: Monorepo structure supports growth
- **Type Safety**: Comprehensive TypeScript coverage
- **Local-First**: Complete privacy and control

Ready to start Phase 2? Check out `docs/17-implementation-prompts.md` for the next implementation guide!

---

**Built with ❤️ for the open source community**  
*No cloud required. No subscriptions. No limits.* 