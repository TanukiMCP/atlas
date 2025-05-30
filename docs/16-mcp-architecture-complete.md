# TanukiMCP: Complete MCP Architecture

## 🎯 Hub-Based Dual MCP Architecture

TanukiMCP Atlas implements a sophisticated **Hub-Based Dual MCP Architecture** where the IDE simultaneously:

1. **Hosts a built-in MCP server** for core tools (100% uptime)
2. **Acts as an MCP client hub** for external servers 
3. **Routes between built-in and external tools** seamlessly
4. **Maintains complete local-only operation** (no cloud APIs)

## 🏗️ Architecture Overview

```typescript
┌─────────────────────────────────────────────────────────────┐
│                    TanukiMCP Atlas IDE                      │
├─────────────────────────────────────────────────────────────┤
│  Enhanced LLM Router (Multi-tier Processing)               │
│  ├── Ollama Integration (Local Models Only)                │
│  └── Tool Router (Unified Tool Discovery)                  │
├─────────────────────────────────────────────────────────────┤
│  Built-in MCP Server (FastMCP)    │  MCP Client Hub        │
│  ├── File Operations              │  ├── External stdio     │
│  ├── Code Operations              │  ├── External HTTP/SSE  │
│  ├── Task Management              │  └── External WebSocket │
│  └── Project Tools                │                         │
├─────────────────────────────────────────────────────────────┤
│  System Monitor │ Error Recovery │ Requirements Manager     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Communication Flow

### Built-in Tools (Zero Latency)
```
User Input → LLM → Tool Router → Built-in MCP Server → Direct Function Call → Result → LLM → UI
```

### External Tools (JSON-RPC)
```
User Input → LLM → Tool Router → MCP Client Hub → JSON-RPC Transport → External Server → Result → Hub → LLM → UI
```

## 🛠️ Built-in MCP Server Implementation

Following the [FastMCP template](https://github.com/mcpdotdirect/template-mcp-server):

```typescript
// packages/mcp-server/src/server.ts
import { FastMCP } from '@fastmcp/core';
import { z } from 'zod';

const server = new FastMCP({
  name: 'tanukimcp-builtin',
  version: '1.0.0',
  description: 'TanukiMCP Atlas Built-in Tools',
  capabilities: {
    tools: true,
    resources: true,
    prompts: true
  }
});

// Core file operations
server.addTool({
  name: 'read_file',
  description: 'Read file contents with optional pagination',
  parameters: z.object({
    path: z.string().describe('File path to read'),
    offset: z.number().optional().describe('Start line (0-indexed)'),
    length: z.number().optional().describe('Number of lines to read')
  }),
  execute: async (params) => {
    // Direct file system access through IDE
    return await ideFileSystem.readFile(params);
  }
});

server.addTool({
  name: 'write_file',
  description: 'Write content to file with diff tracking',
  parameters: z.object({
    path: z.string().describe('File path to write'),
    content: z.string().describe('File content'),
    mode: z.enum(['write', 'append']).optional().default('write')
  }),
  execute: async (params) => {
    const result = await ideFileSystem.writeFile(params);
    return { 
      success: true, 
      diff: result.diff,
      backup_created: result.backupPath 
    };
  }
});

// Task management integration
server.addTool({
  name: 'create_todolist',
  description: 'Create structured todolist for complex tasks',
  parameters: z.object({
    title: z.string().describe('Project title'),
    description: z.string().describe('Project description'),
    requirements: z.array(z.string()).describe('Requirements list')
  }),
  execute: async (params) => {
    return await taskManager.createTodolist(params);
  }
});

// Resource templates for dynamic content
server.addResourceTemplate({
  uriTemplate: 'project://{projectPath}',
  name: 'Project Context',
  description: 'Dynamic project information and file tree',
  mimeType: 'application/json',
  arguments: [
    {
      name: 'projectPath',
      description: 'Path to project directory',
      required: true
    }
  ],
  async load({ projectPath }) {
    const context = await projectAnalyzer.getProjectContext(projectPath);
    return { 
      text: JSON.stringify(context, null, 2)
    };
  }
});

// Export for different transports
export { server };
```

## 🌐 MCP Client Hub Implementation

```typescript
// packages/mcp-hub/src/client-hub.ts
import { MCPClient } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport, SSEClientTransport } from '@modelcontextprotocol/sdk/client/transport';

interface MCPHubService {
  // Server lifecycle management
  addServer(config: MCPServerConfig): Promise<void>;
  removeServer(serverId: string): Promise<void>;
  connectServer(serverId: string): Promise<void>;
  disconnectServer(serverId: string): Promise<void>;
  
  // Tool aggregation
  getAllAvailableTools(): Promise<ToolCatalog>;
  executeToolCall(toolCall: ToolCall): Promise<ToolResult>;
  resolveToolConflicts(): Promise<ConflictResolution[]>;
  
  // Health monitoring
  monitorServerHealth(): Promise<HealthReport>;
  getServerStatus(serverId: string): Promise<ServerStatus>;
}

interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  
  // Transport configuration (following FastMCP pattern)
  transport: {
    type: 'stdio' | 'sse' | 'websocket';
    
    // stdio transport (for local command-line servers)
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    
    // HTTP/SSE transport (for web-based servers)
    url?: string;
    headers?: Record<string, string>;
  };
  
  // Security and resource limits
  security: {
    sandboxed: boolean;
    allowedPaths: string[];
    maxExecutionTime: number;
    maxMemoryUsage: number;
    networkAccess: 'none' | 'local' | 'internet';
  };
  
  // Auto-management
  autoRestart: boolean;
  healthCheckInterval: number;
}

class MCPClientHub implements MCPHubService {
  private clients: Map<string, MCPClient> = new Map();
  private configs: Map<string, MCPServerConfig> = new Map();
  private healthMonitor: HealthMonitor;
  
  async addServer(config: MCPServerConfig): Promise<void> {
    this.configs.set(config.id, config);
    await this.connectServer(config.id);
  }
  
  async connectServer(serverId: string): Promise<void> {
    const config = this.configs.get(serverId);
    if (!config) throw new Error(`Server ${serverId} not found`);
    
    let transport;
    switch (config.transport.type) {
      case 'stdio':
        transport = new StdioClientTransport({
          command: config.transport.command!,
          args: config.transport.args || [],
          env: config.transport.env || {}
        });
        break;
        
      case 'sse':
        transport = new SSEClientTransport(config.transport.url!);
        break;
        
      default:
        throw new Error(`Unsupported transport: ${config.transport.type}`);
    }
    
    const client = new MCPClient({
      name: 'tanukimcp-atlas',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: true,
        resources: true,
        prompts: true
      }
    });
    
    await client.connect(transport);
    this.clients.set(serverId, client);
    
    // Start health monitoring
    this.healthMonitor.startMonitoring(serverId, client);
  }
  
  async getAllAvailableTools(): Promise<ToolCatalog> {
    const tools: ToolDefinition[] = [];
    
    // Get built-in tools
    const builtinTools = await builtinMCPServer.listTools();
    tools.push(...builtinTools.tools.map(tool => ({
      ...tool,
      source: 'builtin',
      reliability: 'high',
      latency: 'instant'
    })));
    
    // Get external tools
    for (const [serverId, client] of this.clients) {
      try {
        const serverTools = await client.listTools();
        tools.push(...serverTools.tools.map(tool => ({
          ...tool,
          source: serverId,
          reliability: 'medium',
          latency: 'network'
        })));
      } catch (error) {
        console.warn(`Failed to get tools from ${serverId}:`, error);
      }
    }
    
    return { tools, lastUpdated: new Date() };
  }
}
```

## 🎯 Tool Router & @ Symbol Integration

```typescript
// packages/renderer/src/components/tool-selector/ToolSelector.tsx
interface ToolSelectorProps {
  onToolSelect: (toolName: string, parameters: any) => void;
  context: string;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ onToolSelect, context }) => {
  const [availableTools, setAvailableTools] = useState<ToolDefinition[]>([]);
  const [filteredTools, setFilteredTools] = useState<ToolDefinition[]>([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const loadTools = async () => {
      const catalog = await mcpHub.getAllAvailableTools();
      setAvailableTools(catalog.tools);
      
      // Smart context-based filtering
      const contextFiltered = await smartToolFilter.filterByContext(
        catalog.tools, 
        context
      );
      setFilteredTools(contextFiltered);
    };
    
    loadTools();
  }, [context]);
  
  const categorizedTools = useMemo(() => {
    return groupBy(filteredTools, 'category');
  }, [filteredTools]);
  
  return (
    <div className="tool-selector">
      <input
        type="text"
        placeholder="Search tools... (type @ to open)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="tool-search"
      />
      
      <div className="tool-categories">
        {Object.entries(categorizedTools).map(([category, tools]) => (
          <div key={category} className="tool-category">
            <h3>{category}</h3>
            {tools.map(tool => (
              <ToolCard
                key={`${tool.source}-${tool.name}`}
                tool={tool}
                onSelect={() => onToolSelect(tool.name, {})}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ToolCardProps {
  tool: ToolDefinition & { source: string; reliability: string; latency: string };
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const getSourceIcon = (source: string) => {
    if (source === 'builtin') return '🏠';
    return '🌐';
  };
  
  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div 
      className="tool-card cursor-pointer p-3 border rounded hover:bg-gray-50"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {getSourceIcon(tool.source)} {tool.name}
        </span>
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${getReliabilityColor(tool.reliability)}`}>
            ●
          </span>
          <span className="text-xs text-gray-500">
            {tool.latency}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
    </div>
  );
};
```

## 📊 System Requirements & Model Management

```typescript
// packages/main/src/services/model-manager.ts
interface SystemCapabilities {
  ram: {
    total: number;
    available: number;
    recommended: number;
  };
  cpu: {
    cores: number;
    architecture: string;
    performance: number;
  };
  gpu: {
    available: boolean;
    vram?: number;
    compute?: string;
  };
  storage: {
    available: number;
    speed: 'hdd' | 'ssd' | 'nvme';
  };
}

interface ModelRequirements {
  minRam: number;
  recommendedRam: number;
  minCpu: number;
  preferredGpu?: boolean;
  storageNeeded: number;
  estimatedSpeed: {
    cpu: number; // tokens/second
    gpu?: number;
  };
}

class ModelManager {
  async assessSystemCapabilities(): Promise<SystemCapabilities> {
    const ram = await this.getMemoryInfo();
    const cpu = await this.getCpuInfo();
    const gpu = await this.getGpuInfo();
    const storage = await this.getStorageInfo();
    
    return { ram, cpu, gpu, storage };
  }
  
  async recommendModels(capabilities: SystemCapabilities): Promise<ModelRecommendation[]> {
    const availableModels = await ollama.listAvailableModels();
    const recommendations: ModelRecommendation[] = [];
    
    for (const model of availableModels) {
      const requirements = this.getModelRequirements(model);
      const compatibility = this.assessCompatibility(capabilities, requirements);
      
      if (compatibility.canRun) {
        recommendations.push({
          model,
          compatibility,
          recommendation: this.getRecommendationLevel(compatibility),
          warnings: this.getWarnings(capabilities, requirements)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.compatibility.score - a.compatibility.score);
  }
  
  private assessCompatibility(
    capabilities: SystemCapabilities, 
    requirements: ModelRequirements
  ): CompatibilityAssessment {
    const ramRatio = capabilities.ram.available / requirements.recommendedRam;
    const cpuRatio = capabilities.cpu.performance / requirements.minCpu;
    const storageOk = capabilities.storage.available > requirements.storageNeeded;
    
    const canRun = ramRatio >= 0.8 && cpuRatio >= 0.8 && storageOk;
    const score = Math.min(ramRatio, cpuRatio) * (storageOk ? 1 : 0.5);
    
    return {
      canRun,
      score,
      ramSufficient: ramRatio >= 1.0,
      cpuSufficient: cpuRatio >= 1.0,
      storageSufficient: storageOk,
      estimatedPerformance: this.estimatePerformance(capabilities, requirements)
    };
  }
  
  async downloadModelWithProgress(
    modelId: string, 
    onProgress: (progress: DownloadProgress) => void
  ): Promise<void> {
    // Pre-flight checks
    const requirements = this.getModelRequirements(modelId);
    const capabilities = await this.assessSystemCapabilities();
    const compatibility = this.assessCompatibility(capabilities, requirements);
    
    if (!compatibility.canRun) {
      throw new Error(`Insufficient system resources for ${modelId}`);
    }
    
    // Download with progress tracking
    await ollama.pullModel(modelId, (progress) => {
      onProgress({
        modelId,
        progress: progress.percentage,
        downloaded: progress.downloaded,
        total: progress.total,
        speed: progress.speed,
        eta: progress.eta
      });
    });
    
    // Post-installation benchmark
    const benchmarkResult = await this.benchmarkModel(modelId);
    await this.saveModelMetrics(modelId, benchmarkResult);
  }
}
```

## 🛡️ Comprehensive Error Handling

```typescript
// packages/shared/src/error-handling/mcp-error-handler.ts
class MCPErrorHandler {
  async handleToolExecutionError(
    error: Error, 
    toolCall: ToolCall, 
    context: ExecutionContext
  ): Promise<ErrorRecoveryResult> {
    const errorType = this.classifyError(error);
    
    switch (errorType) {
      case 'CONNECTION_LOST':
        return await this.handleConnectionError(toolCall, context);
        
      case 'TIMEOUT':
        return await this.handleTimeoutError(toolCall, context);
        
      case 'RESOURCE_EXHAUSTED':
        return await this.handleResourceError(toolCall, context);
        
      case 'TOOL_NOT_FOUND':
        return await this.handleMissingToolError(toolCall, context);
        
      default:
        return await this.handleGenericError(error, toolCall, context);
    }
  }
  
  private async handleConnectionError(
    toolCall: ToolCall, 
    context: ExecutionContext
  ): Promise<ErrorRecoveryResult> {
    // Try to reconnect
    const serverId = this.getServerForTool(toolCall.name);
    try {
      await mcpHub.reconnectServer(serverId);
      
      // Retry the tool call
      const result = await mcpHub.executeToolCall(toolCall);
      return {
        success: true,
        result,
        recovery: 'reconnected_and_retried',
        userMessage: `Reconnected to ${serverId} and completed the operation.`
      };
    } catch (reconnectError) {
      // Fall back to built-in alternative
      return await this.findBuiltinFallback(toolCall, context);
    }
  }
  
  private async findBuiltinFallback(
    toolCall: ToolCall, 
    context: ExecutionContext
  ): Promise<ErrorRecoveryResult> {
    const fallbacks = {
      'read_file': 'builtin_read_file',
      'write_file': 'builtin_write_file',
      'search_files': 'builtin_search_files'
    };
    
    const fallbackTool = fallbacks[toolCall.name];
    if (fallbackTool) {
      try {
        const result = await builtinMCPServer.executeTool({
          ...toolCall,
          name: fallbackTool
        });
        
        return {
          success: true,
          result,
          recovery: 'fallback_used',
          userMessage: `Used built-in ${toolCall.name} as fallback.`,
          warning: 'External server unavailable, using built-in alternative.'
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: fallbackError,
          recovery: 'no_fallback_available',
          userMessage: `Unable to execute ${toolCall.name}: external server unavailable and no built-in alternative exists.`,
          suggestions: [
            'Check the MCP server connection in settings',
            'Try restarting the external server',
            'Use alternative tools for this task'
          ]
        };
      }
    }
    
    return {
      success: false,
      error: new Error('No fallback available'),
      recovery: 'no_fallback_available',
      userMessage: `${toolCall.name} is currently unavailable.`,
      suggestions: [
        `Check the connection to the MCP server providing ${toolCall.name}`,
        'Try using alternative tools for this task'
      ]
    };
  }
}
```

## 📋 MCP Management Center UI

```typescript
// packages/renderer/src/components/mcp-management/MCPManagementCenter.tsx
const MCPManagementCenter: React.FC = () => {
  const [servers, setServers] = useState<MCPServerConfig[]>([]);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [availableTools, setAvailableTools] = useState<ToolCatalog | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      const [serverList, health, tools] = await Promise.all([
        mcpHub.listServers(),
        mcpHub.getHealthReport(),
        mcpHub.getAllAvailableTools()
      ]);
      
      setServers(serverList);
      setHealthReport(health);
      setAvailableTools(tools);
    };
    
    loadData();
    
    // Real-time updates
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mcp-management-center p-6">
      <h1 className="text-2xl font-bold mb-6">MCP Management Center</h1>
      
      {/* Built-in Tools Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🏠 Built-in Tools</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-green-800">Status: Always Available</span>
            <span className="text-green-600">100% Uptime</span>
          </div>
          <p className="text-green-700 mt-2">
            Core file operations, task management, and project tools are always available
            with instant response times.
          </p>
        </div>
      </section>
      
      {/* External Servers Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🌐 External MCP Servers</h2>
        <div className="space-y-4">
          {servers.map(server => (
            <MCPServerCard
              key={server.id}
              server={server}
              health={healthReport?.servers[server.id]}
              onReconnect={() => mcpHub.reconnectServer(server.id)}
              onRemove={() => mcpHub.removeServer(server.id)}
            />
          ))}
        </div>
        
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddServerModal(true)}
        >
          ➕ Add MCP Server
        </button>
      </section>
      
      {/* Tool Catalog Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🛠️ Tool Catalog</h2>
        {availableTools && (
          <ToolCatalogView 
            tools={availableTools.tools}
            onToolTest={(toolName) => testTool(toolName)}
          />
        )}
      </section>
    </div>
  );
};
```

## 🎯 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. ✅ **Remove API key functionality** completely
2. 🏗️ **Set up FastMCP-based built-in server**
3. 🧠 **Implement basic Ollama integration**
4. 📊 **Create system capability assessment**

### Phase 2: MCP Integration (Week 3-4)  
1. 🌐 **Implement MCP client hub**
2. 🔌 **Add stdio transport support**
3. 🛠️ **Create unified tool router**
4. 📱 **Build basic MCP management UI**

### Phase 3: Advanced Features (Week 5-6)
1. 🌍 **Add HTTP/SSE transport**
2. 🎯 **Implement @ symbol tool selector**
3. 🛡️ **Add comprehensive error handling**
4. 📈 **Create performance monitoring**

### Phase 4: Polish (Week 7-8)
1. 💡 **Enhanced system requirements communication**
2. 🎨 **Refine user interface**
3. 📚 **Comprehensive documentation**
4. 🧪 **Testing with multiple external servers**

This architecture provides the modularity, reliability, and local-first approach you need for a truly free, open-source, locally-run AI IDE with seamless MCP integration! 