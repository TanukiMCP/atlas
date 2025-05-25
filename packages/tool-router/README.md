# TanukiMCP Tool Router

The intelligent unified tool routing system for TanukiMCP Atlas. This package provides sophisticated tool discovery, context-aware filtering, conflict resolution, and the @ symbol interface for tool execution.

## Features

### 🎯 Unified Tool Management
- **Real-time Discovery**: Aggregates tools from builtin and external MCP sources
- **Context-Aware Filtering**: Tools filtered based on project type, subject mode, and conversation context
- **Conflict Resolution**: Smart handling of duplicate tool names with user preference learning
- **Performance Monitoring**: Real-time tracking of tool performance and availability

### 🔍 @ Symbol Interface
- **VS Code-like Experience**: Familiar @ symbol interface with fuzzy search
- **Keyboard Navigation**: Complete keyboard accessibility (↑↓, ⏎, ⇥, ⎋)
- **Dynamic Categories**: Visual organization with subject-specific filtering
- **Parameter Forms**: Intelligent parameter input with validation and preview

### ⚡ Advanced Routing
- **Execution Optimization**: Routes to optimal tool source based on performance metrics
- **Fallback Mechanisms**: Graceful degradation with automatic alternative tool selection
- **Health Monitoring**: Real-time availability tracking with auto-recovery
- **User Learning**: Adapts to user preferences and usage patterns

## Architecture

```
tool-router/
├── router/          # Core routing engine
├── search/          # Fuzzy search and indexing
├── ui/              # React @ symbol interface
├── execution/       # Tool execution coordination
├── preferences/     # User preferences and analytics
└── types/           # TypeScript definitions
```

## Usage

### Basic Setup

```typescript
import { UnifiedToolRouter, AtSymbolDropdown } from '@tanukimcp/tool-router';

// Initialize the router
const toolRouter = new UnifiedToolRouter();
await toolRouter.initializeRouter();

// Use in React component
<AtSymbolDropdown
  isOpen={showDropdown}
  onClose={() => setShowDropdown(false)}
  onToolSelect={handleToolSelect}
  context={executionContext}
  position={{ x: 100, y: 100 }}
  toolRouter={toolRouter}
/>
```

### Advanced Usage

```typescript
// Search tools with context
const tools = await toolRouter.searchTools('file read', context, {
  maxResults: 10,
  categoryFilter: ['files'],
  minScore: 0.5
});

// Execute tool with parameters
const result = await toolRouter.executeTool('builtin:read_file', {
  path: '/path/to/file.txt'
}, context);

// Monitor performance
toolRouter.on('performance:degraded', (toolId, metrics) => {
  console.log(`Performance degraded for ${toolId}:`, metrics);
});
```

## Key Components

### UnifiedToolRouter
The main orchestration class that manages tool discovery, search, execution, and health monitoring.

### AtSymbolDropdown
The React component that provides the @ symbol interface with fuzzy search, category filtering, and keyboard navigation.

### ContextAnalyzer
Analyzes tool relevance based on project context, subject mode, file types, and usage patterns.

### ConflictResolver
Handles conflicts between tools with the same name from different sources using intelligent resolution strategies.

### PerformanceMonitor
Tracks tool performance metrics and detects degradation patterns with real-time alerting.

## Performance Features

- **Intelligent Caching**: Search results and tool metadata cached for optimal performance
- **Virtualized Rendering**: Handles large tool catalogs efficiently
- **Fuzzy Search**: Fast, intelligent search with Fuse.js integration
- **Real-time Updates**: Live tool availability with minimal overhead

## Integration

This package integrates with:
- `@tanukimcp/mcp-server` (builtin tools)
- `@tanukimcp/mcp-hub` (external tools)
- `@tanukimcp/llm-enhanced` (LLM routing)
- `@tanukimcp/shared` (common utilities)

## Contributing

This package is part of the TanukiMCP Atlas IDE project. See the main project documentation for contribution guidelines.