# TanukiMCP Atlas - 8-Phase Implementation Prompts

This document contains 8 detailed implementation prompts for building TanukiMCP Atlas with comprehensive enhancements including intelligent context management, chat history CRUD, workflow automation, subject-specific tools, and advanced optimization features. Each prompt can be used in a separate chat session to implement a specific phase of the application.

## 📋 Implementation Overview

**Architecture:** Hub-Based Dual MCP Architecture where the IDE acts as both MCP server (built-in tools) and MCP client (external tools)
**Technology Stack:** Electron + React + TypeScript + FastMCP + Ollama + SQLite + LangChain/LangGraph
**Approach:** Local-only, zero cloud dependencies, production-quality implementations with enterprise-grade features

## 🎯 Enhanced Features Integration

- **Context Management:** MCP-based knowledge graphs with vector storage and compression
- **Chat History CRUD:** Complete chat session management with search and filtering
- **IDE Toolbar:** Standard menu structure (File, Edit, View, Terminal, Run, Help, etc.)
- **Workflow Automation:** Save chats as reusable LangChain workflows with @workflows/ integration
- **Subject-Specific Tools:** STEM, Languages, and specialized domain tools
- **Optimization Suite:** Caching, batching, KV cache optimization, and performance tuning
- **Advanced LLM Management:** Complete model installation suite with hardware assessment
- **Parameter Tuning:** Expert agent for model optimization and performance enhancement

## 🎯 Phase Dependencies

```
Phase 1 (Foundation) → Phase 2 (LLM Integration) → Phase 3 (Built-in MCP) → 
Phase 4 (External MCP) → Phase 5 (LLM Router) → Phase 6 (Tool Router) → 
Phase 7 (UI Implementation) → Phase 8 (Management Center)
```

---

# PROMPT 1: Project Foundation & Basic Structure

## Context & Objective
You are building TanukiMCP Atlas, a fully local, free, open-source AI-powered IDE that uses a Hub-Based Dual MCP Architecture. This first phase establishes the foundational monorepo structure, Electron application, TypeScript configuration, and database setup. The IDE will act as both an MCP server (hosting built-in tools) and MCP client (connecting to external MCP servers).

## Architecture Reference
Please thoroughly review these architectural documents to understand the system:
- `docs/15-mcp-architecture-complete.md` - Complete MCP architecture with dual role design
- `docs/16-local-only-architecture-changes.md` - Local-only requirements and changes
- `docs/02-system-architecture.md` - Overall system architecture and tech stack
- `docs/01-project-overview.md` - Project vision and requirements

## Technical Requirements
- **Monorepo:** Turbo for build orchestration
- **Desktop App:** Electron 28+ with context isolation
- **Languages:** TypeScript 5+ with strict mode
- **Build System:** Vite for renderer, esbuild for main process
- **Database:** SQLite with better-sqlite3 + Drizzle ORM
- **IPC:** Type-safe communication between main/renderer

## File Structure to Create
```
tanukimcp-atlas/
├── package.json (root workspace)
├── turbo.json (monorepo configuration)
├── packages/
│   ├── main/ (Electron main process)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── window.ts
│   │       ├── ipc/
│   │       │   └── handlers.ts
│   │       └── database/
│   │           ├── connection.ts
│   │           └── schema.ts
│   ├── renderer/ (React frontend)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       └── stores/
│   │           └── app-store.ts
│   └── shared/ (Shared utilities)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── types/
│           │   ├── ipc.ts
│           │   └── database.ts
│           └── utils/
│               └── validation.ts
└── scripts/
    └── setup.js
```## Implementation Instructions

### Step 1: Root Package Configuration
Create the root `package.json` with workspace configuration:

```json
{
  "name": "tanukimcp-atlas",
  "version": "1.0.0",
  "private": true,
  "description": "Local AI-powered IDE with MCP integration",
  "main": "packages/main/dist/main.js",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "electron packages/main/dist/main.js",
    "setup": "node scripts/setup.js"
  },
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^1.13.0",
    "electron": "^28.0.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2: Turbo Configuration
Create `turbo.json` for build orchestration:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### Step 3: Main Process Package
Create `packages/main/package.json`:

```json
{
  "name": "@tanukimcp/main",
  "version": "1.0.0",
  "main": "dist/main.js",
  "scripts": {
    "build": "esbuild src/main.ts --bundle --platform=node --outfile=dist/main.js --external:electron",
    "dev": "esbuild src/main.ts --bundle --platform=node --outfile=dist/main.js --external:electron --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "drizzle-orm": "^0.29.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.0",
    "drizzle-kit": "^0.20.0",
    "@types/better-sqlite3": "^7.6.0"
  }
}
```### Step 4: Main Process Implementation
Create `packages/main/src/main.ts`:

```typescript
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createWindow } from './window';
import { setupIPC } from './ipc/handlers';
import { initializeDatabase } from './database/connection';

class TanukiMCPApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => this.onReady());
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);
  }

  private async onReady(): Promise<void> {
    // Initialize database first
    await initializeDatabase();
    
    // Create main window
    this.mainWindow = createWindow();
    
    // Setup IPC handlers
    setupIPC();
    
    // Load the app
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }
  }

  private onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.mainWindow = createWindow();
    }
  }
}

// Initialize the application
new TanukiMCPApp();
```

Create `packages/main/src/window.ts`:

```typescript
import { BrowserWindow, screen } from 'electron';
import path from 'path';

export function createWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const window = new BrowserWindow({
    width: Math.min(1400, width),
    height: Math.min(900, height),
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    show: false
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  return window;
}
```### Step 5: Enhanced Database Setup
Create `packages/main/src/database/schema.ts`:

```typescript
import { sqliteTable, text, integer, blob, real } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  path: text('path').notNull(),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull()
});

// Enhanced chat system with CRUD operations
export const chatSessions = sqliteTable('chat_sessions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' }).default(false),
  messageCount: integer('message_count').default(0),
  tags: blob('tags', { mode: 'json' })
});

export const chatHistory = sqliteTable('chat_history', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => chatSessions.id),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system' | 'tool'
  content: text('content').notNull(),
  metadata: blob('metadata', { mode: 'json' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  parentMessageId: text('parent_message_id'),
  toolsUsed: blob('tools_used', { mode: 'json' }),
  executionTime: integer('execution_time_ms'),
  tokenCount: integer('token_count')
});

// Context management system
export const contextEntries = sqliteTable('context_entries', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => chatSessions.id),
  type: text('type').notNull(), // 'file', 'function', 'concept', 'memory'
  key: text('key').notNull(),
  value: text('value').notNull(),
  vectorEmbedding: blob('vector_embedding'),
  importance: real('importance').default(1.0),
  lastUsed: integer('last_used', { mode: 'timestamp' }).notNull(),
  created: integer('created', { mode: 'timestamp' }).notNull()
});

// Workflow system (from docs/18-custom-workflow-architecture.md)
export const workflows = sqliteTable('workflows', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  definition: blob('definition', { mode: 'json' }).notNull(),
  variables: blob('variables', { mode: 'json' }).notNull(),
  metadata: blob('metadata', { mode: 'json' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull()
});

export const workflowExecutions = sqliteTable('workflow_executions', {
  id: text('id').primaryKey(),
  workflowId: text('workflow_id').references(() => workflows.id),
  parameters: blob('parameters', { mode: 'json' }).notNull(),
  status: text('status').notNull(),
  result: blob('result', { mode: 'json' }),
  errorMessage: text('error_message'),
  started: integer('started', { mode: 'timestamp' }).notNull(),
  completed: integer('completed', { mode: 'timestamp' }),
  executionTimeMs: integer('execution_time_ms')
});

export const mcpServers = sqliteTable('mcp_servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  transport: text('transport').notNull(), // 'stdio' | 'sse' | 'websocket'
  config: blob('config', { mode: 'json' }).notNull(),
  status: text('status').notNull(), // 'connected' | 'disconnected' | 'error'
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull()
});

// Model and optimization settings
export const modelConfigurations = sqliteTable('model_configurations', {
  id: text('id').primaryKey(),
  modelName: text('model_name').notNull(),
  parameters: blob('parameters', { mode: 'json' }).notNull(),
  performance: blob('performance', { mode: 'json' }),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  created: integer('created', { mode: 'timestamp' }).notNull()
});

// Subject-specific tool configurations
export const subjectModes = sqliteTable('subject_modes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tools: blob('tools', { mode: 'json' }).notNull(),
  prompts: blob('prompts', { mode: 'json' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  created: integer('created', { mode: 'timestamp' }).notNull()
});
```

Create `packages/main/src/database/connection.ts`:

```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { app } from 'electron';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export async function initializeDatabase(): Promise<void> {
  const dbPath = path.join(app.getPath('userData'), 'tanukimcp.db');
  const sqlite = new Database(dbPath);
  
  // Enable WAL mode for better performance
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('cache_size = 1000000');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('temp_store = MEMORY');
  
  db = drizzle(sqlite, { schema });
  
  // Run migrations
  await migrate(db, { migrationsFolder: './drizzle' });
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
```

### Step 6: IPC Setup
Create `packages/main/src/ipc/handlers.ts`:

```typescript
import { ipcMain } from 'electron';
import { getDatabase } from '../database/connection';

export function setupIPC(): void {
  // Database operations
  ipcMain.handle('db:query', async (event, query: string, params?: any[]) => {
    const db = getDatabase();
    try {
      return await db.run(query, params);
    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  });

  // Application state
  ipcMain.handle('app:getVersion', () => {
    return process.env.npm_package_version || '1.0.0';
  });

  // File system operations (placeholder for Phase 3)
  ipcMain.handle('fs:readFile', async (event, filePath: string) => {
    // Will be implemented in Phase 3
    return null;
  });
}
```

**Validation:** Run `npm run dev` - Electron window should open with basic structure.
**Next Phase:** Phase 2 will add Ollama integration and model management.

---

# PROMPT 2: Advanced Local LLM Integration & Model Management

## Context & Objective  
Building on Phase 1's foundation, this phase integrates Ollama for local LLM processing with comprehensive model management, hardware assessment, optimization features, and parameter tuning. This includes the complete model installation suite with performance prediction and KV cache optimization.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (System Requirements & Model Management section)

## Technical Requirements
- **Ollama Integration:** REST API client with optimization features
- **System Detection:** Deep hardware analysis with GPU support detection
- **Model Management:** Complete suite with QwQ-32B, Deepseek variants, performance tuning
- **Hardware Assessment:** Real-time compatibility with memory prediction
- **Optimization:** KV cache optimization, quantization, caching, batching
- **Parameter Tuning:** Expert agent for model optimization

## Enhanced File Structure
```
packages/main/src/services/
├── ollama-service.ts (Enhanced Ollama client)
├── system-monitor.ts (Deep hardware detection)
├── model-manager.ts (Complete model lifecycle)
├── hardware-assessor.ts (Performance prediction)
├── optimization-engine.ts (KV cache & performance)
├── parameter-tuner.ts (Expert optimization agent)
└── context-manager.ts (MCP-based context system)
```

## Enhanced Implementation

### 1. Advanced Ollama Service
Create `packages/main/src/services/ollama-service.ts`:

```typescript
interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
    architecture: string;
  };
  performance?: ModelPerformance;
}

interface ModelPerformance {
  tokensPerSecond: number;
  ramUsage: number;
  vramUsage?: number;
  cpuUsage: number;
  lastBenchmark: Date;
}

interface GenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_ctx?: number;           // Context length
    repeat_penalty?: number;
    seed?: number;
    
    // Optimization parameters
    num_thread?: number;
    num_gpu?: number;
    main_gpu?: number;
    low_vram?: boolean;
    f16_kv?: boolean;           // KV cache precision
    use_mlock?: boolean;        // Memory locking
    use_mmap?: boolean;         // Memory mapping
  };
}

export class OllamaService {
  private baseUrl = 'http://localhost:11434';
  private performanceCache = new Map<string, ModelPerformance>();

  async listModels(): Promise<OllamaModel[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    const data = await response.json();
    
    // Enrich with performance data
    return (data.models || []).map(model => ({
      ...model,
      performance: this.performanceCache.get(model.name)
    }));
  }

  async getModelCatalog(): Promise<RecommendedModel[]> {
    // Enhanced model catalog with hardware requirements
    return [
      {
        name: 'qwq:32b',
        displayName: 'QwQ-32B',
        description: 'Advanced reasoning model with chain-of-thought capabilities',
        size: 19.8, // GB
        parameterCount: '32B',
        specialization: ['reasoning', 'mathematics', 'analysis'],
        requirements: {
          minRam: 24,
          recommendedRam: 32,
          minVram: 12,
          recommendedVram: 20,
          quantizationOptions: ['Q4_K_M', 'Q5_K_M', 'Q8_0']
        },
        estimatedPerformance: {
          tokensPerSecondCPU: 12,
          tokensPerSecondGPU: 28,
          contextLength: 32768
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:32b',
        displayName: 'DeepSeek R1 Distill Qwen 32B',
        description: 'Distilled reasoning model optimized for efficiency',
        size: 14.9,
        parameterCount: '32B',
        specialization: ['reasoning', 'coding', 'problem-solving'],
        requirements: {
          minRam: 18,
          recommendedRam: 24,
          minVram: 8,
          recommendedVram: 14,
          quantizationOptions: ['Q4_K_M', 'Q5_K_M']
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:14b',
        displayName: 'DeepSeek R1 Distill Qwen 14B',
        description: 'Balanced reasoning model for most hardware',
        size: 6.5,
        parameterCount: '14B',
        specialization: ['reasoning', 'general-purpose'],
        requirements: {
          minRam: 8,
          recommendedRam: 12,
          minVram: 4,
          recommendedVram: 8
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:7b',
        displayName: 'DeepSeek R1 Distill Qwen 7B',
        description: 'Efficient reasoning model for standard hardware',
        size: 3.3,
        parameterCount: '7B',
        specialization: ['reasoning', 'coding'],
        requirements: {
          minRam: 6,
          recommendedRam: 8,
          minVram: 2,
          recommendedVram: 4
        }
      },
      {
        name: 'deepseek-r1-distill-qwen:1.5b',
        displayName: 'DeepSeek R1 Distill Qwen 1.5B',
        description: 'Lightweight reasoning model for low-resource systems',
        size: 0.8,
        parameterCount: '1.5B',
        specialization: ['basic-reasoning', 'lightweight'],
        requirements: {
          minRam: 2,
          recommendedRam: 4,
          minVram: 1,
          recommendedVram: 2
        }
      }
    ];
  }

  async pullModelWithOptimization(
    name: string, 
    onProgress?: (progress: any) => void
  ): Promise<void> {
    // Set optimization environment variables
    await this.setOptimizationFlags();
    
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stream: true })
    });

    if (!response.body) throw new Error('No response body');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const progress = JSON.parse(line);
          onProgress?.(progress);
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }
    
    // Benchmark model performance after installation
    await this.benchmarkModel(name);
  }

  private async setOptimizationFlags(): Promise<void> {
    // Set Ollama optimization environment variables
    process.env.OLLAMA_FLASH_ATTENTION = '1';
    process.env.OLLAMA_KV_CACHE_TYPE = 'q8_0'; // or q4_0 for more compression
    process.env.OLLAMA_NUM_PARALLEL = '4';
    process.env.OLLAMA_MAX_LOADED_MODELS = '2';
  }

  async benchmarkModel(modelName: string): Promise<ModelPerformance> {
    const startTime = Date.now();
    const testPrompt = "Write a short explanation of quantum computing in simple terms.";
    
    try {
      const response = await this.generate({
        model: modelName,
        prompt: testPrompt,
        options: { num_ctx: 2048 }
      });
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      const estimatedTokens = response.response?.length / 4 || 100; // Rough estimate
      const tokensPerSecond = (estimatedTokens / executionTime) * 1000;
      
      const performance: ModelPerformance = {
        tokensPerSecond,
        ramUsage: await this.getModelMemoryUsage(modelName),
        cpuUsage: 0, // Would need system monitoring
        lastBenchmark: new Date()
      };
      
      this.performanceCache.set(modelName, performance);
      return performance;
    } catch (error) {
      throw new Error(`Benchmark failed for ${modelName}: ${error}`);
    }
  }

  async generateWithOptimization(request: GenerateRequest): Promise<any> {
    // Apply optimization based on model and hardware
    const optimizedRequest = await this.optimizeRequest(request);
    
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(optimizedRequest)
    });
    return response.json();
  }

  private async optimizeRequest(request: GenerateRequest): Promise<GenerateRequest> {
    // Apply KV cache optimization, context length optimization, etc.
    const systemInfo = await this.getSystemInfo();
    
    return {
      ...request,
      options: {
        ...request.options,
        num_thread: Math.min(systemInfo.cpuCores, 8),
        num_gpu: systemInfo.gpuCount,
        num_ctx: this.calculateOptimalContextLength(request.model, systemInfo),
        f16_kv: systemInfo.availableRam > 16, // Use FP16 if enough RAM
        use_mlock: systemInfo.availableRam > 32, // Memory locking for large RAM
        use_mmap: true // Always use memory mapping
      }
    };
  }
}
```

### 2. Hardware Assessment Service
Create `packages/main/src/services/hardware-assessor.ts`:

```typescript
interface SystemCapabilities {
  cpu: {
    cores: number;
    threads: number;
    architecture: string;
    clockSpeed: number;
    brand: string;
  };
  memory: {
    total: number;
    available: number;
    type: string;
    speed?: number;
  };
  gpu?: {
    name: string;
    vram: number;
    computeCapability?: string;
    supports: string[];
  }[];
  storage: {
    available: number;
    type: 'SSD' | 'HDD' | 'NVMe';
    speed?: number;
  };
}

interface ModelRecommendation {
  model: RecommendedModel;
  compatibility: 'perfect' | 'good' | 'marginal' | 'incompatible';
  expectedPerformance: {
    tokensPerSecond: number;
    ramUsage: number;
    vramUsage?: number;
    responseTime: number;
  };
  optimizations: OptimizationSuggestion[];
  warnings?: string[];
}

export class HardwareAssessor {
  async assessSystemCapabilities(): Promise<SystemCapabilities> {
    const os = require('os');
    const { execSync } = require('child_process');
    
    // CPU Assessment
    const cpus = os.cpus();
    const cpu = {
      cores: os.cpus().length,
      threads: os.cpus().length, // Simplified
      architecture: os.arch(),
      clockSpeed: cpus[0]?.speed || 0,
      brand: cpus[0]?.model || 'Unknown'
    };
    
    // Memory Assessment
    const memory = {
      total: Math.round(os.totalmem() / (1024 ** 3)), // GB
      available: Math.round(os.freemem() / (1024 ** 3)), // GB
      type: 'DDR4' // Would need more detailed detection
    };
    
    // GPU Assessment (platform-specific)
    const gpu = await this.detectGPU();
    
    // Storage Assessment
    const storage = await this.assessStorage();
    
    return { cpu, memory, gpu, storage };
  }

  async getModelRecommendations(
    systemCaps: SystemCapabilities,
    availableModels: RecommendedModel[]
  ): Promise<ModelRecommendation[]> {
    return availableModels.map(model => {
      const compatibility = this.assessCompatibility(model, systemCaps);
      const expectedPerformance = this.predictPerformance(model, systemCaps);
      const optimizations = this.suggestOptimizations(model, systemCaps);
      const warnings = this.generateWarnings(model, systemCaps);
      
      return {
        model,
        compatibility,
        expectedPerformance,
        optimizations,
        warnings: warnings.length > 0 ? warnings : undefined
      };
    }).sort((a, b) => {
      // Sort by compatibility and performance
      const compatibilityScore = {
        'perfect': 4,
        'good': 3,
        'marginal': 2,
        'incompatible': 1
      };
      
      const scoreA = compatibilityScore[a.compatibility] * a.expectedPerformance.tokensPerSecond;
      const scoreB = compatibilityScore[b.compatibility] * b.expectedPerformance.tokensPerSecond;
      
      return scoreB - scoreA;
    });
  }

  private assessCompatibility(
    model: RecommendedModel,
    system: SystemCapabilities
  ): 'perfect' | 'good' | 'marginal' | 'incompatible' {
    const ramOk = system.memory.available >= model.requirements.minRam;
    const ramGood = system.memory.available >= model.requirements.recommendedRam;
    
    if (!ramOk) return 'incompatible';
    
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      const vramOk = totalVram >= (model.requirements.minVram || 0);
      const vramGood = totalVram >= (model.requirements.recommendedVram || 0);
      
      if (ramGood && vramGood) return 'perfect';
      if (ramGood && vramOk) return 'good';
      if (ramOk) return 'marginal';
    }
    
    if (ramGood) return 'good';
    return 'marginal';
  }

  private predictPerformance(
    model: RecommendedModel,
    system: SystemCapabilities
  ): ModelRecommendation['expectedPerformance'] {
    // Performance prediction based on hardware specs
    let tokensPerSecond = model.estimatedPerformance.tokensPerSecondCPU;
    
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      if (totalVram >= (model.requirements.recommendedVram || 0)) {
        tokensPerSecond = model.estimatedPerformance.tokensPerSecondGPU || tokensPerSecond * 2;
      }
    }
    
    // Adjust based on CPU performance
    const cpuMultiplier = Math.min(system.cpu.cores / 8, 1.5);
    tokensPerSecond *= cpuMultiplier;
    
    return {
      tokensPerSecond: Math.round(tokensPerSecond),
      ramUsage: model.size * 1.2, // Model size + overhead
      vramUsage: system.gpu ? model.size * 0.8 : undefined,
      responseTime: (100 / tokensPerSecond) * 1000 // ms for 100 tokens
    };
  }

  private suggestOptimizations(
    model: RecommendedModel,
    system: SystemCapabilities
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // RAM optimization
    if (system.memory.available < model.requirements.recommendedRam) {
      suggestions.push({
        type: 'quantization',
        description: 'Use Q4_K_M quantization to reduce memory usage',
        impact: 'Reduces RAM usage by 60-70% with minimal quality loss'
      });
    }
    
    // GPU optimization
    if (system.gpu && system.gpu.length > 0) {
      suggestions.push({
        type: 'gpu_acceleration',
        description: 'Enable GPU acceleration for faster inference',
        impact: 'Can improve speed by 2-5x depending on model size'
      });
    }
    
    // Context optimization
    suggestions.push({
      type: 'context_optimization',
      description: 'Optimize context window based on usage patterns',
      impact: 'Reduces memory usage and improves response time'
    });
    
    return suggestions;
  }
}
```

### 3. Context Management Service
Create `packages/main/src/services/context-manager.ts`:

```typescript
interface ContextEntry {
  id: string;
  sessionId: string;
  type: 'file' | 'function' | 'concept' | 'memory';
  key: string;
  value: string;
  vectorEmbedding?: Float32Array;
  importance: number;
  lastUsed: Date;
  created: Date;
}

export class ContextManager {
  private vectorCache = new Map<string, Float32Array>();
  private mcpContextServer: MCPContextServer;

  constructor() {
    this.mcpContextServer = new MCPContextServer();
  }

  async storeContext(
    sessionId: string,
    type: ContextEntry['type'],
    key: string,
    value: string,
    importance = 1.0
  ): Promise<void> {
    // Generate vector embedding for semantic search
    const embedding = await this.generateEmbedding(value);
    
    const entry: ContextEntry = {
      id: crypto.randomUUID(),
      sessionId,
      type,
      key,
      value,
      vectorEmbedding: embedding,
      importance,
      lastUsed: new Date(),
      created: new Date()
    };
    
    // Store in database
    await this.persistContextEntry(entry);
    
    // Update MCP context server
    await this.mcpContextServer.updateContext(sessionId, entry);
  }

  async retrieveRelevantContext(
    sessionId: string,
    query: string,
    maxResults = 10
  ): Promise<ContextEntry[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Semantic search using vector similarity
    const allEntries = await this.getSessionContext(sessionId);
    const scoredEntries = allEntries.map(entry => ({
      entry,
      score: this.calculateSimilarity(queryEmbedding, entry.vectorEmbedding || new Float32Array())
    }));
    
    // Sort by relevance and importance
    scoredEntries.sort((a, b) => (b.score * b.entry.importance) - (a.score * a.entry.importance));
    
    return scoredEntries.slice(0, maxResults).map(item => item.entry);
  }

  async optimizeContext(sessionId: string): Promise<void> {
    // Implement context compression and cleanup
    const entries = await this.getSessionContext(sessionId);
    
    // Remove low-importance, old entries
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    const toRemove = entries.filter(entry => 
      entry.importance < 0.3 && entry.lastUsed < cutoffDate
    );
    
    for (const entry of toRemove) {
      await this.removeContextEntry(entry.id);
    }
    
    // Compress similar entries
    await this.compressSimilarEntries(sessionId);
  }
}
```

**Validation:** Complete model management with optimization, hardware assessment with performance prediction, and context management system operational.
**Next Phase:** Phase 3 implements FastMCP-based built-in tools with enhanced capabilities.

---

# PROMPT 3: Enhanced Built-in MCP Server with Subject-Specific Tools

## Context & Objective
This phase implements the FastMCP-based built-in MCP server that provides core tools (file operations, task management) plus subject-specific tool suites for STEM, Languages, and specialized domains. This includes 100% uptime instant response tools and subject-specific modes integration.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (Built-in MCP Server Implementation section)

## Technical Requirements
- **FastMCP Framework:** @fastmcp/core for server implementation with enhanced capabilities
- **Core Tools:** read_file, write_file, search_files, create_todolist, edit_block
- **Subject-Specific Tools:** Mathematics, Science, Programming, Language learning tools
- **CRUD Operations:** Advanced filesystem management and data operations
- **Security:** Path validation, sandbox execution, permission management
- **Integration:** Direct IDE file system access with subject mode switching

## Enhanced File Structure
```
packages/mcp-server/src/
├── server.ts (Main FastMCP server)
├── tools/
│   ├── core/
│   │   ├── file-operations.ts
│   │   ├── task-management.ts
│   │   └── search-operations.ts
│   ├── subjects/
│   │   ├── mathematics.ts
│   │   ├── science.ts
│   │   ├── programming.ts
│   │   ├── languages.ts
│   │   └── research.ts
│   └── crud/
│       ├── filesystem-crud.ts
│       ├── data-crud.ts
│       └── project-crud.ts
├── modes/
│   ├── subject-mode-manager.ts
│   └── mode-definitions.ts
└── security/
    ├── path-validator.ts
    └── sandbox-executor.ts
```

## Enhanced Implementation

### 1. Core FastMCP Server
Create `packages/mcp-server/src/server.ts`:

```typescript
import { FastMCP } from '@fastmcp/core';
import { CoreFileOperations } from './tools/core/file-operations';
import { TaskManagement } from './tools/core/task-management';
import { MathematicsTools } from './tools/subjects/mathematics';
import { ScienceTools } from './tools/subjects/science';
import { ProgrammingTools } from './tools/subjects/programming';
import { LanguageTools } from './tools/subjects/languages';
import { ResearchTools } from './tools/subjects/research';
import { SubjectModeManager } from './modes/subject-mode-manager';

export class TanukiMCPServer extends FastMCP {
  private subjectModeManager: SubjectModeManager;
  
  constructor() {
    super({
      name: 'tanukimcp-builtin-server',
      version: '1.0.0',
      description: 'Built-in MCP server with subject-specific tools'
    });
    
    this.subjectModeManager = new SubjectModeManager();
    this.registerAllTools();
  }

  private registerAllTools(): void {
    // Core tools (always available)
    this.registerCoreTools();
    
    // Subject-specific tools (context-aware)
    this.registerSubjectTools();
    
    // CRUD operations
    this.registerCRUDTools();
    
    // Workflow tools
    this.registerWorkflowTools();
  }

  private registerCoreTools(): void {
    const fileOps = new CoreFileOperations();
    const taskMgmt = new TaskManagement();
    
    // File operations
    this.addTool({
      name: 'read_file',
      description: 'Read file contents with pagination support',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path to read' },
          offset: { type: 'number', description: 'Start line (0-indexed)' },
          length: { type: 'number', description: 'Number of lines to read' },
          encoding: { type: 'string', default: 'utf8' }
        },
        required: ['path']
      },
      handler: fileOps.readFile.bind(fileOps)
    });

    this.addTool({
      name: 'write_file',
      description: 'Write or append to files with safety checks',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path to write' },
          content: { type: 'string', description: 'Content to write' },
          mode: { type: 'string', enum: ['write', 'append'], default: 'write' },
          createDirs: { type: 'boolean', default: true }
        },
        required: ['path', 'content']
      },
      handler: fileOps.writeFile.bind(fileOps)
    });

    this.addTool({
      name: 'edit_block',
      description: 'Make surgical edits to files',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path to edit' },
          oldContent: { type: 'string', description: 'Content to replace' },
          newContent: { type: 'string', description: 'New content' },
          expectedMatches: { type: 'number', default: 1 }
        },
        required: ['path', 'oldContent', 'newContent']
      },
      handler: fileOps.editBlock.bind(fileOps)
    });

    // Task management
    this.addTool({
      name: 'create_todolist',
      description: 'Create structured todo lists from complex requests',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Todo list title' },
          description: { type: 'string', description: 'Project description' },
          requirements: { type: 'string', description: 'Detailed requirements' },
          projectPath: { type: 'string', description: 'Project directory path' }
        },
        required: ['title', 'requirements']
      },
      handler: taskMgmt.createTodoList.bind(taskMgmt)
    });
  }

  private registerSubjectTools(): void {
    const mathTools = new MathematicsTools();
    const scienceTools = new ScienceTools();
    const programmingTools = new ProgrammingTools();
    const languageTools = new LanguageTools();
    const researchTools = new ResearchTools();

    // Mathematics tools
    this.addTool({
      name: 'solve_equation',
      description: 'Solve mathematical equations and show step-by-step solutions',
      inputSchema: {
        type: 'object',
        properties: {
          equation: { type: 'string', description: 'Mathematical equation to solve' },
          variables: { type: 'array', items: { type: 'string' } },
          showSteps: { type: 'boolean', default: true },
          outputFormat: { type: 'string', enum: ['text', 'latex', 'ascii'], default: 'text' }
        },
        required: ['equation']
      },
      handler: mathTools.solveEquation.bind(mathTools)
    });

    this.addTool({
      name: 'plot_function',
      description: 'Generate mathematical plots and visualizations',
      inputSchema: {
        type: 'object',
        properties: {
          function: { type: 'string', description: 'Function to plot (e.g., "x^2 + 2*x + 1")' },
          xRange: { type: 'array', items: { type: 'number' }, description: 'X-axis range [min, max]' },
          yRange: { type: 'array', items: { type: 'number' }, description: 'Y-axis range [min, max]' },
          resolution: { type: 'number', default: 100 },
          outputPath: { type: 'string', description: 'Where to save the plot' }
        },
        required: ['function']
      },
      handler: mathTools.plotFunction.bind(mathTools)
    });

    // Science tools
    this.addTool({
      name: 'chemistry_balance',
      description: 'Balance chemical equations and calculate stoichiometry',
      inputSchema: {
        type: 'object',
        properties: {
          equation: { type: 'string', description: 'Chemical equation to balance' },
          showSteps: { type: 'boolean', default: true },
          calculateMass: { type: 'boolean', default: false }
        },
        required: ['equation']
      },
      handler: scienceTools.balanceEquation.bind(scienceTools)
    });

    this.addTool({
      name: 'physics_simulation',
      description: 'Run physics simulations and calculations',
      inputSchema: {
        type: 'object',
        properties: {
          simulationType: { type: 'string', enum: ['projectile', 'pendulum', 'wave', 'circuit'] },
          parameters: { type: 'object', description: 'Simulation parameters' },
          duration: { type: 'number', description: 'Simulation duration' },
          outputFormat: { type: 'string', enum: ['data', 'plot', 'animation'], default: 'plot' }
        },
        required: ['simulationType', 'parameters']
      },
      handler: scienceTools.runSimulation.bind(scienceTools)
    });

    // Programming tools
    this.addTool({
      name: 'analyze_code',
      description: 'Analyze code structure, complexity, and quality',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: 'Path to code file' },
          analysisType: { 
            type: 'array', 
            items: { type: 'string', enum: ['complexity', 'structure', 'quality', 'security', 'performance'] },
            default: ['complexity', 'quality']
          },
          language: { type: 'string', description: 'Programming language (auto-detected if not specified)' }
        },
        required: ['filePath']
      },
      handler: programmingTools.analyzeCode.bind(programmingTools)
    });

    this.addTool({
      name: 'generate_tests',
      description: 'Generate unit tests for code functions',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: 'Path to source code file' },
          functions: { type: 'array', items: { type: 'string' }, description: 'Specific functions to test' },
          framework: { type: 'string', enum: ['jest', 'mocha', 'pytest', 'junit'], description: 'Testing framework' },
          coverage: { type: 'string', enum: ['basic', 'comprehensive', 'edge-cases'], default: 'comprehensive' }
        },
        required: ['filePath']
      },
      handler: programmingTools.generateTests.bind(programmingTools)
    });

    // Language learning tools
    this.addTool({
      name: 'translate_text',
      description: 'Translate text with context and cultural notes',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to translate' },
          fromLanguage: { type: 'string', description: 'Source language code' },
          toLanguage: { type: 'string', description: 'Target language code' },
          includeContext: { type: 'boolean', default: true },
          includeCultural: { type: 'boolean', default: false },
          formality: { type: 'string', enum: ['formal', 'informal', 'auto'], default: 'auto' }
        },
        required: ['text', 'toLanguage']
      },
      handler: languageTools.translateText.bind(languageTools)
    });

    this.addTool({
      name: 'grammar_check',
      description: 'Check grammar, style, and provide suggestions',
      inputSchema: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Text to check' },
          language: { type: 'string', description: 'Language code', default: 'en' },
          checkStyle: { type: 'boolean', default: true },
          checkClarity: { type: 'boolean', default: true },
          targetAudience: { type: 'string', enum: ['academic', 'business', 'casual'], default: 'academic' }
        },
        required: ['text']
      },
      handler: languageTools.checkGrammar.bind(languageTools)
    });

    // Research tools
    this.addTool({
      name: 'web_search',
      description: 'Search the internet for research and information',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          maxResults: { type: 'number', default: 10 },
          searchType: { type: 'string', enum: ['general', 'academic', 'news', 'images'], default: 'general' },
          dateRange: { type: 'string', enum: ['day', 'week', 'month', 'year', 'all'], default: 'all' }
        },
        required: ['query']
      },
      handler: researchTools.webSearch.bind(researchTools)
    });
  }

  private registerCRUDTools(): void {
    // Enhanced CRUD operations for comprehensive data management
    this.addTool({
      name: 'create_project',
      description: 'Create new project with template structure',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name' },
          template: { type: 'string', enum: ['react', 'node', 'python', 'custom'], default: 'custom' },
          path: { type: 'string', description: 'Project directory path' },
          features: { type: 'array', items: { type: 'string' }, description: 'Additional features to include' }
        },
        required: ['name', 'path']
      },
      handler: this.createProject.bind(this)
    });

    this.addTool({
      name: 'manage_database',
      description: 'Perform database operations (CRUD)',
      inputSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', enum: ['create', 'read', 'update', 'delete', 'query'] },
          table: { type: 'string', description: 'Database table name' },
          data: { type: 'object', description: 'Data for operation' },
          conditions: { type: 'object', description: 'Query conditions' }
        },
        required: ['operation', 'table']
      },
      handler: this.manageDatabaseOperation.bind(this)
    });
  }

  private registerWorkflowTools(): void {
    // Integration with workflow system from docs/18-custom-workflow-architecture.md
    this.addTool({
      name: 'execute_workflow',
      description: 'Execute a saved workflow with parameters',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string', description: 'Workflow ID or name' },
          parameters: { type: 'object', description: 'Workflow parameters' },
          preview: { type: 'boolean', description: 'Preview mode (dry run)', default: false }
        },
        required: ['workflowId']
      },
      handler: this.executeWorkflow.bind(this)
    });

    this.addTool({
      name: 'save_chat_as_workflow',
      description: 'Convert current chat into reusable workflow',
      inputSchema: {
        type: 'object',
        properties: {
          chatId: { type: 'string', description: 'Chat session ID' },
          workflowName: { type: 'string', description: 'Name for the workflow' },
          description: { type: 'string', description: 'Workflow description' },
          category: { type: 'string', description: 'Workflow category' },
          startMessage: { type: 'string', description: 'Starting message ID' },
          endMessage: { type: 'string', description: 'Ending message ID' }
        },
        required: ['chatId', 'workflowName']
      },
      handler: this.saveChatAsWorkflow.bind(this)
    });
  }

  async switchSubjectMode(mode: string): Promise<void> {
    await this.subjectModeManager.switchMode(mode);
    // Dynamically enable/disable tools based on subject mode
    this.updateAvailableTools();
  }

  private updateAvailableTools(): void {
    const currentMode = this.subjectModeManager.getCurrentMode();
    // Enable subject-specific tools based on current mode
    this.setToolVisibility(currentMode.enabledTools);
  }
}
```

### 2. Subject-Specific Tool Implementations
Create `packages/mcp-server/src/tools/subjects/mathematics.ts`:

```typescript
export class MathematicsTools {
  async solveEquation(params: {
    equation: string;
    variables?: string[];
    showSteps?: boolean;
    outputFormat?: 'text' | 'latex' | 'ascii';
  }): Promise<ToolResult> {
    // Integration with computer algebra systems
    // Could integrate with SymPy, Mathematica, or similar
    
    try {
      // Parse and solve equation
      const solution = await this.performAlgebraicSolution(params.equation);
      
      return {
        success: true,
        result: {
          equation: params.equation,
          solution: solution.result,
          steps: params.showSteps ? solution.steps : undefined,
          variables: solution.variables,
          format: params.outputFormat || 'text'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to solve equation: ${error.message}`
      };
    }
  }

  async plotFunction(params: {
    function: string;
    xRange?: [number, number];
    yRange?: [number, number];
    resolution?: number;
    outputPath?: string;
  }): Promise<ToolResult> {
    // Generate mathematical plots using plotting libraries
    // Could integrate with matplotlib, plotly, or similar
    
    try {
      const plotData = await this.generatePlot(params);
      
      if (params.outputPath) {
        await this.savePlot(plotData, params.outputPath);
      }
      
      return {
        success: true,
        result: {
          function: params.function,
          plotData: plotData,
          outputPath: params.outputPath,
          range: {
            x: params.xRange || [-10, 10],
            y: params.yRange || 'auto'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to plot function: ${error.message}`
      };
    }
  }

  // Additional math tools...
  async calculateIntegral(params: any): Promise<ToolResult> { /* ... */ }
  async solveSystem(params: any): Promise<ToolResult> { /* ... */ }
  async analyzeFunction(params: any): Promise<ToolResult> { /* ... */ }
}
```

### 3. Subject Mode Manager
Create `packages/mcp-server/src/modes/subject-mode-manager.ts`:

```typescript
interface SubjectMode {
  id: string;
  name: string;
  description: string;
  enabledTools: string[];
  prompts: SubjectPrompts;
  context: SubjectContext;
}

interface SubjectPrompts {
  systemPrompt: string;
  exampleQueries: string[];
  helpText: string;
}

export class SubjectModeManager {
  private currentMode: SubjectMode;
  private availableModes: Map<string, SubjectMode>;

  constructor() {
    this.initializeModes();
    this.currentMode = this.availableModes.get('general')!;
  }

  private initializeModes(): void {
    this.availableModes = new Map([
      ['mathematics', {
        id: 'mathematics',
        name: 'Mathematics Mode',
        description: 'Advanced mathematical problem-solving and computation',
        enabledTools: [
          'solve_equation', 'plot_function', 'calculate_integral', 
          'solve_system', 'analyze_function', 'read_file', 'write_file'
        ],
        prompts: {
          systemPrompt: 'You are a mathematics expert assistant with access to computational tools. Solve problems step-by-step and use visualizations when helpful.',
          exampleQueries: [
            'Solve the quadratic equation x² + 5x + 6 = 0',
            'Plot the function f(x) = sin(x) + cos(2x)',
            'Find the integral of x² + 3x + 2'
          ],
          helpText: 'Ask mathematical questions, request equation solving, or generate plots and visualizations.'
        },
        context: {
          specializations: ['algebra', 'calculus', 'statistics', 'geometry'],
          tools: ['wolfram', 'sympy', 'matplotlib', 'numpy']
        }
      }],
      
      ['science', {
        id: 'science',
        name: 'Science Mode',
        description: 'Physics, chemistry, and biology problem-solving',
        enabledTools: [
          'chemistry_balance', 'physics_simulation', 'unit_conversion',
          'periodic_table', 'molecular_structure', 'read_file', 'write_file'
        ],
        prompts: {
          systemPrompt: 'You are a science expert with specialized tools for physics, chemistry, and biology. Provide detailed explanations and use simulations when appropriate.',
          exampleQueries: [
            'Balance the chemical equation: H₂ + O₂ → H₂O',
            'Simulate projectile motion with initial velocity 30 m/s at 45°',
            'Show the molecular structure of caffeine'
          ],
          helpText: 'Ask science questions, request chemical equation balancing, or run physics simulations.'
        },
        context: {
          specializations: ['physics', 'chemistry', 'biology', 'earth-science'],
          tools: ['chem-balance', 'physics-engine', 'molecular-viewer']
        }
      }],
      
      ['programming', {
        id: 'programming',
        name: 'Programming Mode',
        description: 'Code analysis, testing, and development assistance',
        enabledTools: [
          'analyze_code', 'generate_tests', 'refactor_code', 'debug_code',
          'code_review', 'read_file', 'write_file', 'edit_block', 'search_files'
        ],
        prompts: {
          systemPrompt: 'You are a programming expert with code analysis and generation tools. Help with coding tasks, debugging, and best practices.',
          exampleQueries: [
            'Analyze the complexity of this function',
            'Generate unit tests for my calculator class',
            'Review this code for security issues'
          ],
          helpText: 'Request code analysis, test generation, debugging help, or code reviews.'
        },
        context: {
          specializations: ['analysis', 'testing', 'debugging', 'refactoring', 'security'],
          tools: ['static-analysis', 'test-generators', 'linters', 'formatters']
        }
      }],
      
      ['languages', {
        id: 'languages',
        name: 'Language Learning Mode',
        description: 'Translation, grammar checking, and language learning assistance',
        enabledTools: [
          'translate_text', 'grammar_check', 'pronunciation_guide',
          'vocabulary_builder', 'cultural_context', 'read_file', 'write_file'
        ],
        prompts: {
          systemPrompt: 'You are a language learning expert with translation and grammar tools. Help with language learning, translation, and cultural understanding.',
          exampleQueries: [
            'Translate this text to Spanish with cultural context',
            'Check the grammar of my essay',
            'Explain the pronunciation of this French word'
          ],
          helpText: 'Request translations, grammar checking, pronunciation help, or cultural explanations.'
        },
        context: {
          specializations: ['translation', 'grammar', 'pronunciation', 'culture'],
          tools: ['translators', 'grammar-checkers', 'dictionaries', 'cultural-db']
        }
      }]
    ]);
  }

  async switchMode(modeId: string): Promise<void> {
    if (this.availableModes.has(modeId)) {
      this.currentMode = this.availableModes.get(modeId)!;
      
      // Store mode preference in database
      await this.saveUserModePreference(modeId);
      
      // Update tool availability
      await this.updateToolAvailability();
    } else {
      throw new Error(`Unknown subject mode: ${modeId}`);
    }
  }

  getCurrentMode(): SubjectMode {
    return this.currentMode;
  }

  getAvailableModes(): SubjectMode[] {
    return Array.from(this.availableModes.values());
  }
}
```

**Validation:** Built-in tools with subject-specific capabilities execute instantly with direct IDE integration and mode switching.
**Next Phase:** Phase 4 adds external MCP client capabilities and tool aggregation.

---

# PROMPT 4: MCP Client Hub & External Server Management

## Context & Objective
Implement the MCP client hub that connects to external MCP servers via stdio/HTTP/SSE transports. This completes the dual MCP architecture, enabling tool aggregation from multiple sources with health monitoring and fallback mechanisms.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (MCP Client Hub Implementation section)

## Technical Requirements
- **MCP SDK:** @modelcontextprotocol/sdk/client for external connections
- **Transports:** stdio (child_process), HTTP/SSE (fetch/EventSource)
- **Health Monitoring:** Auto-reconnection, server status tracking
- **Tool Aggregation:** Unified catalog from all sources

## Key Implementation
Create `packages/mcp-hub/src/client-hub.ts` with MCPClientHub class managing external server connections, tool catalog aggregation, and health monitoring with automatic recovery.

**Validation:** Can connect to external MCP servers and execute their tools.
**Next Phase:** Phase 5 implements enhanced LLM routing.

---

# PROMPT 5: Enhanced LLM Router & Multi-Tier Processing

## Context & Objective
Building on the foundation established in Phases 1-4, this phase implements the sophisticated 4-tier LLM processing architecture that transforms TanukiMCP Atlas from a simple local LLM interface into an intelligent AI reasoning system. This phase creates a multi-tiered processing pipeline with request classification, complexity assessment, tournament-bracket quality assurance, and comprehensive user intervention controls.

The Enhanced LLM Router is the brain of the system, analyzing incoming requests and routing them through appropriate processing tiers based on complexity, subject matter, and desired quality level. It implements adaptive routing algorithms, multi-model coordination, and real-time quality optimization.

## Architecture Reference
Review: `docs/13-enhanced-llm-architecture.md` (complete document for detailed architecture specifications)

## Technical Requirements
- **4-Tier Processing System:** Atomic (instant), Moderate (fast), Complex (thorough), Expert (premium)
- **Request Classification:** AI-powered complexity assessment and routing algorithms
- **Tournament Bracket QA:** Multi-model voting panels for quality assurance
- **User Intervention Controls:** Real-time stop buttons, course correction, and process override
- **Adaptive Routing:** Dynamic routing based on performance metrics and user preferences
- **Model Coordination:** Intelligent load balancing across available local models
- **Quality Enhancement:** Iterative improvement through feedback loops and validation

## Enhanced File Structure
```
packages/llm-enhanced/
├── package.json (Enhanced LLM routing dependencies)
├── tsconfig.json (TypeScript configuration)
└── src/
    ├── router/
    │   ├── llm-router.ts (Main routing engine)
    │   ├── request-classifier.ts (Request complexity analysis)
    │   ├── tier-selector.ts (Tier assignment logic)
    │   ├── model-coordinator.ts (Multi-model management)
    │   └── adaptive-routing.ts (Performance-based optimization)
    ├── processors/
    │   ├── base-processor.ts (Abstract base processor)
    │   ├── atomic-processor.ts (Instant responses)
    │   ├── moderate-processor.ts (Standard processing)
    │   ├── complex-processor.ts (Deep analysis)
    │   └── expert-processor.ts (Premium quality)
    ├── quality-assurance/
    │   ├── tournament-bracket.ts (Multi-model voting)
    │   ├── quality-metrics.ts (Response scoring)
    │   ├── validation-engine.ts (Output validation)
    │   └── improvement-feedback.ts (Quality enhancement)
    ├── intervention/
    │   ├── user-controls.ts (Stop/pause/override controls)
    │   ├── course-correction.ts (Mid-process adjustments)
    │   ├── progress-monitor.ts (Real-time progress tracking)
    │   └── intervention-ui.ts (User intervention interface)
    ├── analytics/
    │   ├── performance-tracker.ts (System metrics)
    │   ├── quality-analytics.ts (Quality trend analysis)
    │   ├── usage-patterns.ts (User behavior analysis)
    │   └── optimization-insights.ts (Improvement recommendations)
    └── types/
        ├── llm-types.ts (LLM processing types)
        ├── routing-types.ts (Routing system types)
        ├── quality-types.ts (Quality assurance types)
        └── intervention-types.ts (User intervention types)
```

## Implementation Instructions

### Step 1: Core Dependencies
Create `packages/llm-enhanced/package.json`:

```json
{
  "name": "@tanukimcp/llm-enhanced",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@tanukimcp/shared": "workspace:*",
    "eventemitter3": "^5.0.1",
    "uuid": "^9.0.1",
    "lodash": "^4.17.21",
    "async": "^3.2.4"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.202",
    "@types/async": "^3.2.24",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.0"
  }
}
```

### Step 2: Type System
Create `packages/llm-enhanced/src/types/llm-types.ts`:

```typescript
export type ProcessingTier = 'atomic' | 'moderate' | 'complex' | 'expert';

export interface ProcessingRequest {
  id: string;
  content: string;
  context: RequestContext;
  requirements: ProcessingRequirements;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  maxProcessingTime: number;
  userPreferences: UserPreferences;
}

export interface RequestContext {
  sessionId: string;
  messageHistory: Message[];
  subjectMode: string;
  projectContext?: string;
  availableTools: string[];
  previousRequests: ProcessingRequest[];
}

export interface ProcessingRequirements {
  minQuality: number; // 0-100
  maxLatency: number; // milliseconds
  requiresReasoning: boolean;
  requiresCreativity: boolean;
  requiresFactualAccuracy: boolean;
  requiresCodeGeneration: boolean;
  requiresMathematics: boolean;
  requiresMultiStep: boolean;
}

export interface UserPreferences {
  preferredTier?: ProcessingTier;
  qualityVsSpeed: number; // 0-100, 0=speed, 100=quality
  allowExpertProcessing: boolean;
  enableQualityAssurance: boolean;
  maxWaitTime: number;
  interventionLevel: 'minimal' | 'balanced' | 'high';
}

export interface ProcessingResponse {
  id: string;
  requestId: string;
  content: string;
  tier: ProcessingTier;
  qualityScore: number;
  confidence: number;
  processingTime: number;
  model: string;
  reasoning?: string[];
  citations?: string[];
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  tokensUsed: number;
  modelsInvolved: string[];
  processingSteps: ProcessingStep[];
  qualityMetrics: QualityMetrics;
  userInterventions: UserIntervention[];
}

export interface ProcessingStep {
  step: number;
  description: string;
  tier: ProcessingTier;
  model: string;
  startTime: Date;
  endTime: Date;
  result: string;
  confidence: number;
}

export interface QualityMetrics {
  coherence: number;
  relevance: number;
  accuracy: number;
  completeness: number;
  clarity: number;
  creativity: number;
  overallScore: number;
}

export interface UserIntervention {
  timestamp: Date;
  type: 'stop' | 'pause' | 'redirect' | 'override' | 'feedback';
  description: string;
  impact: string;
}
```

### Step 3: Main LLM Router
Create `packages/llm-enhanced/src/router/llm-router.ts`:

```typescript
import { EventEmitter } from 'eventemitter3';
import { RequestClassifier } from './request-classifier';
import { TierSelector } from './tier-selector';
import { ModelCoordinator } from './model-coordinator';
import { AdaptiveRouting } from './adaptive-routing';
import { AtomicProcessor } from '../processors/atomic-processor';
import { ModerateProcessor } from '../processors/moderate-processor';
import { ComplexProcessor } from '../processors/complex-processor';
import { ExpertProcessor } from '../processors/expert-processor';
import { TournamentBracket } from '../quality-assurance/tournament-bracket';
import { UserControls } from '../intervention/user-controls';
import { PerformanceTracker } from '../analytics/performance-tracker';
import { ProcessingRequest, ProcessingResponse, ProcessingTier } from '../types/llm-types';

export interface LLMRouterEvents {
  'request:received': (request: ProcessingRequest) => void;
  'request:classified': (request: ProcessingRequest, tier: ProcessingTier) => void;
  'processing:started': (requestId: string, tier: ProcessingTier) => void;
  'processing:completed': (response: ProcessingResponse) => void;
  'processing:failed': (requestId: string, error: Error) => void;
  'quality:enhanced': (requestId: string, originalScore: number, enhancedScore: number) => void;
  'intervention:requested': (requestId: string, type: string) => void;
}

export class LLMRouter extends EventEmitter<LLMRouterEvents> {
  private requestClassifier: RequestClassifier;
  private tierSelector: TierSelector;
  private modelCoordinator: ModelCoordinator;
  private adaptiveRouting: AdaptiveRouting;
  private tournamentBracket: TournamentBracket;
  private userControls: UserControls;
  private performanceTracker: PerformanceTracker;
  
  private processors: Map<ProcessingTier, BaseProcessor>;
  private activeRequests: Map<string, ProcessingRequest>;
  private processingQueue: ProcessingRequest[];
  private isProcessing: boolean = false;

  constructor() {
    super();
    this.initializeComponents();
    this.initializeProcessors();
    this.setupEventHandlers();
  }

  private initializeComponents(): void {
    this.requestClassifier = new RequestClassifier();
    this.tierSelector = new TierSelector();
    this.modelCoordinator = new ModelCoordinator();
    this.adaptiveRouting = new AdaptiveRouting();
    this.tournamentBracket = new TournamentBracket();
    this.userControls = new UserControls();
    this.performanceTracker = new PerformanceTracker();
    
    this.activeRequests = new Map();
    this.processingQueue = [];
  }

  private initializeProcessors(): void {
    this.processors = new Map([
      ['atomic', new AtomicProcessor()],
      ['moderate', new ModerateProcessor()],
      ['complex', new ComplexProcessor()],
      ['expert', new ExpertProcessor()]
    ]);
  }

  private setupEventHandlers(): void {
    this.userControls.on('intervention:stop', this.handleStopIntervention.bind(this));
    this.userControls.on('intervention:pause', this.handlePauseIntervention.bind(this));
    this.userControls.on('intervention:redirect', this.handleRedirectIntervention.bind(this));
    
    this.performanceTracker.on('optimization:suggestion', this.handleOptimizationSuggestion.bind(this));
  }

  async processRequest(request: ProcessingRequest): Promise<ProcessingResponse> {
    try {
      this.emit('request:received', request);
      this.activeRequests.set(request.id, request);
      
      // Step 1: Classify request complexity and requirements
      const classification = await this.requestClassifier.classify(request);
      
      // Step 2: Select appropriate processing tier
      const tier = await this.tierSelector.selectTier(request, classification);
      this.emit('request:classified', request, tier);
      
      // Step 3: Check if user intervention is needed
      if (await this.shouldRequestUserGuidance(request, tier)) {
        const userChoice = await this.userControls.requestGuidance(request, tier);
        if (userChoice.override) {
          tier = userChoice.selectedTier;
        }
      }
      
      // Step 4: Process through selected tier
      this.emit('processing:started', request.id, tier);
      const processor = this.processors.get(tier)!;
      
      let response = await processor.process(request);
      
      // Step 5: Quality assurance (if enabled and tier supports it)
      if (request.userPreferences.enableQualityAssurance && tier !== 'atomic') {
        const originalScore = response.qualityScore;
        response = await this.tournamentBracket.enhanceQuality(response, request);
        
        if (response.qualityScore > originalScore) {
          this.emit('quality:enhanced', request.id, originalScore, response.qualityScore);
        }
      }
      
      // Step 6: Record performance metrics
      this.performanceTracker.recordProcessing(request, response);
      
      // Step 7: Update adaptive routing
      await this.adaptiveRouting.updateFromExecution(request, response);
      
      this.emit('processing:completed', response);
      this.activeRequests.delete(request.id);
      
      return response;
      
    } catch (error) {
      this.emit('processing:failed', request.id, error as Error);
      this.activeRequests.delete(request.id);
      throw error;
    }
  }

  async batchProcess(requests: ProcessingRequest[]): Promise<ProcessingResponse[]> {
    // Intelligent batch processing with load balancing
    const results: ProcessingResponse[] = [];
    const batches = this.createOptimalBatches(requests);
    
    for (const batch of batches) {
      const batchPromises = batch.map(request => this.processRequest(request));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  async getSystemHealth(): Promise<SystemHealth> {
    return {
      activeRequests: this.activeRequests.size,
      queueLength: this.processingQueue.length,
      processorStatus: await this.getProcessorStatus(),
      modelCoordinatorHealth: await this.modelCoordinator.getHealth(),
      qualityAssuranceStatus: await this.tournamentBracket.getStatus(),
      adaptiveRoutingMetrics: await this.adaptiveRouting.getMetrics()
    };
  }

  async optimizePerformance(): Promise<OptimizationResult> {
    const suggestions = await this.performanceTracker.getOptimizationSuggestions();
    const results: OptimizationResult = {
      suggestions,
      applied: [],
      improvements: {}
    };
    
    // Apply automatic optimizations
    for (const suggestion of suggestions) {
      if (suggestion.autoApplicable) {
        try {
          await this.applySuggestion(suggestion);
          results.applied.push(suggestion);
        } catch (error) {
          console.warn('Failed to apply optimization:', suggestion, error);
        }
      }
    }
    
    return results;
  }

  // User intervention handlers
  private async handleStopIntervention(requestId: string): Promise<void> {
    const request = this.activeRequests.get(requestId);
    if (request) {
      // Gracefully stop processing
      await this.stopProcessing(requestId);
      this.emit('intervention:requested', requestId, 'stop');
    }
  }

  private async handlePauseIntervention(requestId: string): Promise<void> {
    const request = this.activeRequests.get(requestId);
    if (request) {
      // Pause processing and wait for user input
      await this.pauseProcessing(requestId);
      this.emit('intervention:requested', requestId, 'pause');
    }
  }

  private async handleRedirectIntervention(requestId: string, newTier: ProcessingTier): Promise<void> {
    const request = this.activeRequests.get(requestId);
    if (request) {
      // Redirect to different tier
      await this.redirectProcessing(requestId, newTier);
      this.emit('intervention:requested', requestId, 'redirect');
    }
  }

  // Helper methods
  private async shouldRequestUserGuidance(request: ProcessingRequest, tier: ProcessingTier): boolean {
    // Determine if user input is needed based on request characteristics
    if (tier === 'expert' && !request.userPreferences.allowExpertProcessing) {
      return true;
    }
    
    if (request.requirements.maxLatency < this.getEstimatedProcessingTime(tier)) {
      return true;
    }
    
    return false;
  }

  private createOptimalBatches(requests: ProcessingRequest[]): ProcessingRequest[][] {
    // Create optimal batches for parallel processing
    const batches: ProcessingRequest[][] = [];
    const batchSize = this.calculateOptimalBatchSize();
    
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    
    return batches;
  }

  private calculateOptimalBatchSize(): number {
    // Calculate optimal batch size based on system resources
    return Math.min(4, this.modelCoordinator.getAvailableModelCount());
  }

  private getEstimatedProcessingTime(tier: ProcessingTier): number {
    const estimates = {
      atomic: 100,     // ~100ms
      moderate: 2000,  // ~2s
      complex: 10000,  // ~10s
      expert: 30000    // ~30s
    };
    
    return estimates[tier];
  }

  async shutdown(): Promise<void> {
    // Graceful shutdown of all components
    this.isProcessing = false;
    
    // Wait for active requests to complete or timeout
    const activePromises = Array.from(this.activeRequests.keys()).map(async (requestId) => {
      return this.waitForCompletion(requestId, 10000); // 10s timeout
    });
    
    await Promise.allSettled(activePromises);
    
    // Shutdown components
    await this.modelCoordinator.shutdown();
    await this.tournamentBracket.shutdown();
    await this.performanceTracker.shutdown();
    
    this.removeAllListeners();
  }
}
```

### Step 4: Request Classification Engine
Create `packages/llm-enhanced/src/router/request-classifier.ts`:

```typescript
export interface RequestClassification {
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  domain: string[];
  requiresReasoning: boolean;
  requiresCreativity: boolean;
  requiresFactualAccuracy: boolean;
  requiresMultiStep: boolean;
  estimatedTokens: number;
  suggestedTier: ProcessingTier;
  confidence: number;
}

export class RequestClassifier {
  private complexityPatterns: Map<string, number>;
  private domainClassifiers: Map<string, RegExp[]>;
  private reasoningIndicators: RegExp[];
  private creativityIndicators: RegExp[];
  
  constructor() {
    this.initializePatterns();
  }

  async classify(request: ProcessingRequest): Promise<RequestClassification> {
    const content = request.content.toLowerCase();
    
    // Analyze complexity
    const complexity = this.analyzeComplexity(content, request.context);
    
    // Detect domains
    const domains = this.detectDomains(content);
    
    // Analyze requirements
    const requiresReasoning = this.detectReasoning(content);
    const requiresCreativity = this.detectCreativity(content);
    const requiresFactualAccuracy = this.detectFactualAccuracy(content);
    const requiresMultiStep = this.detectMultiStep(content);
    
    // Estimate token usage
    const estimatedTokens = this.estimateTokenUsage(content, request.context);
    
    // Suggest tier
    const suggestedTier = this.suggestTier(complexity, {
      requiresReasoning,
      requiresCreativity,
      requiresFactualAccuracy,
      requiresMultiStep
    });
    
    // Calculate confidence
    const confidence = this.calculateConfidence(content, complexity, domains);
    
    return {
      complexity,
      domain: domains,
      requiresReasoning,
      requiresCreativity,
      requiresFactualAccuracy,
      requiresMultiStep,
      estimatedTokens,
      suggestedTier,
      confidence
    };
  }

  private analyzeComplexity(content: string, context: RequestContext): RequestClassification['complexity'] {
    let score = 0;
    
    // Length-based complexity
    if (content.length > 1000) score += 2;
    else if (content.length > 500) score += 1;
    
    // Structural complexity
    const sentences = content.split(/[.!?]+/).length;
    if (sentences > 10) score += 2;
    else if (sentences > 5) score += 1;
    
    // Keyword-based complexity
    const complexKeywords = [
      'analyze', 'compare', 'evaluate', 'synthesize', 'integrate',
      'comprehensive', 'detailed', 'thorough', 'step-by-step',
      'algorithm', 'architecture', 'design pattern', 'optimization'
    ];
    
    const foundKeywords = complexKeywords.filter(keyword => 
      content.includes(keyword)
    ).length;
    score += Math.min(foundKeywords, 3);
    
    // Context-based complexity
    if (context.messageHistory.length > 5) score += 1;
    if (context.availableTools.length > 3) score += 1;
    
    // Map score to complexity level
    if (score >= 6) return 'expert';
    if (score >= 4) return 'complex';
    if (score >= 2) return 'moderate';
    return 'simple';
  }

  private detectDomains(content: string): string[] {
    const domains: string[] = [];
    
    for (const [domain, patterns] of this.domainClassifiers) {
      const matches = patterns.some(pattern => pattern.test(content));
      if (matches) {
        domains.push(domain);
      }
    }
    
    return domains;
  }

  private suggestTier(
    complexity: RequestClassification['complexity'],
    requirements: {
      requiresReasoning: boolean;
      requiresCreativity: boolean;
      requiresFactualAccuracy: boolean;
      requiresMultiStep: boolean;
    }
  ): ProcessingTier {
    // Base tier from complexity
    let baseTier: ProcessingTier;
    switch (complexity) {
      case 'simple': baseTier = 'atomic'; break;
      case 'moderate': baseTier = 'moderate'; break;
      case 'complex': baseTier = 'complex'; break;
      case 'expert': baseTier = 'expert'; break;
    }
    
    // Upgrade tier based on requirements
    if (requirements.requiresReasoning && baseTier === 'atomic') {
      baseTier = 'moderate';
    }
    
    if (requirements.requiresMultiStep && baseTier !== 'expert') {
      baseTier = baseTier === 'atomic' ? 'complex' : 'expert';
    }
    
    if (requirements.requiresCreativity && requirements.requiresFactualAccuracy) {
      baseTier = 'expert';
    }
    
    return baseTier;
  }

  private initializePatterns(): void {
    // Initialize complexity patterns, domain classifiers, etc.
    this.complexityPatterns = new Map([
      ['simple_question', 1],
      ['complex_analysis', 4],
      ['multi_step_process', 3],
      ['creative_task', 2]
    ]);
    
    this.domainClassifiers = new Map([
      ['mathematics', [/math|equation|calculate|formula/i, /\d+[\+\-\*\/]\d+/]],
      ['programming', [/code|function|class|algorithm/i, /def |function |class /]],
      ['science', [/physics|chemistry|biology|experiment/i]],
      ['creative', [/write|create|design|generate|story/i]]
    ]);
    
    this.reasoningIndicators = [
      /why|how|explain|reason|logic|because/i,
      /step[- ]by[- ]step|process|method/i,
      /analyze|compare|contrast|evaluate/i
    ];
    
    this.creativityIndicators = [
      /create|generate|design|invent|imagine/i,
      /story|poem|creative|artistic|original/i,
      /brainstorm|ideate|conceptualize/i
    ];
  }
}
```

### Step 5: Tournament Bracket Quality Assurance
Create `packages/llm-enhanced/src/quality-assurance/tournament-bracket.ts`:

```typescript
export interface QualityEnhancementResult {
  originalResponse: ProcessingResponse;
  enhancedResponse: ProcessingResponse;
  improvementScore: number;
  enhancementMethods: string[];
  tournamentResults: TournamentRound[];
}

export class TournamentBracket {
  private availableModels: string[];
  private qualityMetrics: QualityMetrics;
  private votingPanel: VotingPanel;
  
  constructor() {
    this.initializeComponents();
  }

  async enhanceQuality(
    response: ProcessingResponse, 
    originalRequest: ProcessingRequest
  ): Promise<ProcessingResponse> {
    
    // Step 1: Generate alternative responses
    const alternatives = await this.generateAlternatives(response, originalRequest);
    
    // Step 2: Run tournament bracket
    const tournamentResults = await this.runTournament([response, ...alternatives]);
    
    // Step 3: Select best response
    const bestResponse = tournamentResults[tournamentResults.length - 1].winner;
    
    // Step 4: Apply enhancement techniques
    const enhancedResponse = await this.applyEnhancements(bestResponse, originalRequest);
    
    // Step 5: Final validation
    return await this.validateAndFinalize(enhancedResponse, originalRequest);
  }

  private async generateAlternatives(
    originalResponse: ProcessingResponse,
    request: ProcessingRequest
  ): Promise<ProcessingResponse[]> {
    const alternatives: ProcessingResponse[] = [];
    
    // Generate responses with different approaches
    const approaches = [
      'analytical',
      'creative',
      'structured',
      'detailed'
    ];
    
    for (const approach of approaches) {
      try {
        const modifiedRequest = this.modifyRequestForApproach(request, approach);
        const alternative = await this.generateResponseWithApproach(modifiedRequest, approach);
        alternatives.push(alternative);
      } catch (error) {
        console.warn(`Failed to generate ${approach} alternative:`, error);
      }
    }
    
    return alternatives;
  }

  private async runTournament(responses: ProcessingResponse[]): Promise<TournamentRound[]> {
    const rounds: TournamentRound[] = [];
    let competitors = [...responses];
    let roundNumber = 1;
    
    while (competitors.length > 1) {
      const round: TournamentRound = {
        roundNumber,
        matches: [],
        winner: null
      };
      
      const roundWinners: ProcessingResponse[] = [];
      
      // Pair up competitors
      for (let i = 0; i < competitors.length; i += 2) {
        const competitor1 = competitors[i];
        const competitor2 = competitors[i + 1] || competitor1; // Handle odd numbers
        
        const match = await this.runMatch(competitor1, competitor2);
        round.matches.push(match);
        roundWinners.push(match.winner);
      }
      
      competitors = roundWinners;
      roundNumber++;
      rounds.push(round);
    }
    
    // Set final winner
    if (rounds.length > 0) {
      rounds[rounds.length - 1].winner = competitors[0];
    }
    
    return rounds;
  }

  private async runMatch(
    response1: ProcessingResponse,
    response2: ProcessingResponse
  ): Promise<TournamentMatch> {
    // Multi-criteria evaluation
    const evaluations = await Promise.all([
      this.evaluateCoherence(response1, response2),
      this.evaluateRelevance(response1, response2),
      this.evaluateAccuracy(response1, response2),
      this.evaluateCompleteness(response1, response2),
      this.evaluateClarity(response1, response2)
    ]);
    
    // Weighted scoring
    const weights = {
      coherence: 0.25,
      relevance: 0.25,
      accuracy: 0.25,
      completeness: 0.15,
      clarity: 0.10
    };
    
    const score1 = evaluations.reduce((sum, eval, index) => 
      sum + eval.score1 * Object.values(weights)[index], 0
    );
    
    const score2 = evaluations.reduce((sum, eval, index) => 
      sum + eval.score2 * Object.values(weights)[index], 0
    );
    
    return {
      competitor1: response1,
      competitor2: response2,
      winner: score1 > score2 ? response1 : response2,
      scores: { score1, score2 },
      evaluations
    };
  }
}
```

**Validation:** Requests successfully route through 4-tier system with quality enhancement, user intervention controls functional, and adaptive routing optimizes performance based on usage patterns.

**Integration Points:** Integrates with Phase 2 (Ollama), Phase 3 (built-in tools), Phase 4 (external tools), and prepares for Phase 6 (unified tool routing).

**Next Phase:** Phase 6 implements unified tool routing with @ symbol integration.

---

# PROMPT 6: Unified Tool Router & @ Symbol Integration

## Context & Objective
Building on the solid foundation of Phases 1-5, this phase implements the intelligent unified tool routing system that seamlessly bridges the built-in MCP server (Phase 3) and external MCP client hub (Phase 4) into a single, cohesive tool ecosystem. This phase creates the @ symbol interface that users interact with, providing intelligent tool discovery, context-aware filtering, conflict resolution, and execution routing.

The Unified Tool Router serves as the central nervous system for tool operations, providing a single point of access to all available tools regardless of their source. It implements sophisticated algorithms for tool selection, maintains real-time tool availability, handles conflicts between similar tools from different sources, and provides comprehensive error handling with intelligent fallback mechanisms.

The @ symbol integration creates an intuitive, VS Code-like experience where users can quickly discover and execute tools through a fuzzy search interface with intelligent categorization and context awareness.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (Tool Router & @ Symbol Integration section)

## Technical Requirements
- **Intelligent Tool Discovery:** Real-time aggregation from built-in and external sources
- **Context-Aware Filtering:** Tools filtered based on current project, subject mode, and conversation context
- **Conflict Resolution:** Smart handling of duplicate tool names across multiple sources with user preference learning
- **@ Symbol UI:** Responsive React component with fuzzy search, categorization, and keyboard navigation
- **Execution Routing:** Intelligent routing to optimal tool source with performance monitoring
- **Error Handling:** Comprehensive fallback mechanisms with graceful degradation
- **Real-time Updates:** Live tool availability updates and health monitoring integration

## Enhanced File Structure
```
packages/tool-router/
├── package.json (Tool routing dependencies)
├── tsconfig.json (TypeScript configuration)
└── src/
    ├── router/
    │   ├── unified-tool-router.ts (Main routing engine)
    │   ├── tool-discovery.ts (Tool aggregation engine)
    │   ├── context-analyzer.ts (Context-aware filtering)
    │   ├── conflict-resolver.ts (Duplicate tool handling)
    │   └── execution-router.ts (Tool execution routing)
    ├── search/
    │   ├── fuzzy-search.ts (Fuzzy search algorithms)
    │   ├── tool-indexer.ts (Tool indexing and categorization)
    │   ├── relevance-scorer.ts (Context relevance scoring)
    │   └── search-cache.ts (Search result caching)
    ├── ui/
    │   ├── at-symbol-dropdown.tsx (@ symbol interface)
    │   ├── tool-selector.tsx (Tool selection component)
    │   ├── tool-preview.tsx (Tool information preview)
    │   ├── parameter-input.tsx (Tool parameter forms)
    │   └── execution-monitor.tsx (Tool execution display)
    ├── execution/
    │   ├── execution-engine.ts (Tool execution coordinator)
    │   ├── fallback-handler.ts (Error recovery mechanisms)
    │   ├── performance-monitor.ts (Execution performance tracking)
    │   └── result-processor.ts (Tool result processing)
    ├── preferences/
    │   ├── user-preferences.ts (User tool preferences)
    │   ├── conflict-resolution-rules.ts (Conflict handling rules)
    │   ├── tool-ratings.ts (User tool ratings and feedback)
    │   └── usage-analytics.ts (Tool usage pattern analysis)
    └── types/
        ├── tool-router-types.ts (Router system types)
        ├── search-types.ts (Search system types)
        ├── ui-types.ts (UI component types)
        └── execution-types.ts (Tool execution types)
```

## Implementation Instructions

### Step 1: Core Dependencies
Create `packages/tool-router/package.json`:

```json
{
  "name": "@tanukimcp/tool-router",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@tanukimcp/shared": "workspace:*",
    "@tanukimcp/mcp-hub": "workspace:*",
    "@tanukimcp/mcp-server": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "fuse.js": "^7.0.0",
    "eventemitter3": "^5.0.1",
    "uuid": "^9.0.1",
    "lodash": "^4.17.21",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/lodash": "^4.14.202",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.0"
  }
}
```

### Step 2: Core Type System
Create `packages/tool-router/src/types/tool-router-types.ts`:

```typescript
export interface UnifiedTool {
  id: string;
  name: string;
  description: string;
  source: ToolSource;
  category: ToolCategory;
  inputSchema: ToolInputSchema;
  outputSchema?: ToolOutputSchema;
  
  // Enhanced metadata
  tags: string[];
  lastUsed?: Date;
  usageCount: number;
  averageExecutionTime: number;
  successRate: number;
  userRating?: number;
  
  // Context relevance
  contextRelevance: ContextRelevance;
  availability: ToolAvailability;
  
  // Conflict resolution
  conflicts?: ToolConflict[];
  preferenceWeight: number;
}

export interface ToolSource {
  type: 'builtin' | 'external';
  id: string;
  name: string;
  health: SourceHealth;
  responseTime: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  priority: number;
  subjectModes: string[];
}

export interface ContextRelevance {
  projectType: string[];
  subjectModes: string[];
  fileTypes: string[];
  contextKeywords: string[];
  score: number;
}

export interface ToolAvailability {
  status: 'available' | 'busy' | 'unavailable' | 'error';
  lastChecked: Date;
  estimatedWaitTime?: number;
  errorMessage?: string;
}

export interface ToolConflict {
  conflictingTool: string;
  resolution: 'prefer_builtin' | 'prefer_external' | 'user_choice' | 'performance_based';
  userPreference?: string;
  autoResolved: boolean;
}

export interface ToolExecutionContext {
  sessionId: string;
  messageId: string;
  projectContext?: ProjectContext;
  subjectMode: string;
  userPreferences: UserToolPreferences;
  timeoutMs: number;
  retryConfig: RetryConfig;
}

export interface ToolExecutionResult {
  toolId: string;
  success: boolean;
  result?: any;
  error?: ToolExecutionError;
  executionTime: number;
  source: ToolSource;
  fallbackUsed?: boolean;
  warnings?: string[];
}

export interface UserToolPreferences {
  preferredSources: SourcePreference[];
  conflictResolutionRules: ConflictResolutionRule[];
  toolCategories: CategoryPreference[];
  maxExecutionTime: number;
  enableFallbacks: boolean;
  showPreview: boolean;
}
```

### Step 3: Main Unified Tool Router
Create `packages/tool-router/src/router/unified-tool-router.ts`:

```typescript
import { EventEmitter } from 'eventemitter3';
import { ToolDiscovery } from './tool-discovery';
import { ContextAnalyzer } from './context-analyzer';
import { ConflictResolver } from './conflict-resolver';
import { ExecutionRouter } from './execution-router';
import { FuzzySearch } from '../search/fuzzy-search';
import { ToolIndexer } from '../search/tool-indexer';
import { UserPreferences } from '../preferences/user-preferences';
import { PerformanceMonitor } from '../execution/performance-monitor';
import { UnifiedTool, ToolExecutionContext, ToolExecutionResult } from '../types/tool-router-types';

export interface ToolRouterEvents {
  'tools:updated': (tools: UnifiedTool[]) => void;
  'tool:executed': (result: ToolExecutionResult) => void;
  'tool:failed': (toolId: string, error: Error) => void;
  'conflict:detected': (conflict: ToolConflict) => void;
  'conflict:resolved': (conflict: ToolConflict) => void;
  'fallback:triggered': (originalTool: string, fallbackTool: string) => void;
}

export class UnifiedToolRouter extends EventEmitter<ToolRouterEvents> {
  private toolDiscovery: ToolDiscovery;
  private contextAnalyzer: ContextAnalyzer;
  private conflictResolver: ConflictResolver;
  private executionRouter: ExecutionRouter;
  private fuzzySearch: FuzzySearch;
  private toolIndexer: ToolIndexer;
  private userPreferences: UserPreferences;
  private performanceMonitor: PerformanceMonitor;
  
  private unifiedTools: Map<string, UnifiedTool> = new Map();
  private toolIndex: Map<string, UnifiedTool[]> = new Map();
  private lastUpdate: Date = new Date();
  private updateInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.initializeComponents();
    this.setupEventHandlers();
    this.startPeriodicUpdates();
  }

  private initializeComponents(): void {
    this.toolDiscovery = new ToolDiscovery();
    this.contextAnalyzer = new ContextAnalyzer();
    this.conflictResolver = new ConflictResolver();
    this.executionRouter = new ExecutionRouter();
    this.fuzzySearch = new FuzzySearch();
    this.toolIndexer = new ToolIndexer();
    this.userPreferences = new UserPreferences();
    this.performanceMonitor = new PerformanceMonitor();
  }

  private setupEventHandlers(): void {
    this.toolDiscovery.on('tools:discovered', this.handleToolsDiscovered.bind(this));
    this.toolDiscovery.on('source:unavailable', this.handleSourceUnavailable.bind(this));
    this.conflictResolver.on('conflict:detected', this.handleConflictDetected.bind(this));
    this.executionRouter.on('fallback:triggered', this.handleFallbackTriggered.bind(this));
  }

  async initializeRouter(): Promise<void> {
    console.log('Initializing Unified Tool Router...');
    
    // Step 1: Discover all available tools
    await this.refreshToolCatalog();
    
    // Step 2: Initialize search index
    await this.rebuildSearchIndex();
    
    // Step 3: Load user preferences
    await this.userPreferences.load();
    
    console.log('Unified Tool Router initialized with', this.unifiedTools.size, 'tools');
  }

  async refreshToolCatalog(): Promise<void> {
    try {
      // Discover tools from all sources
      const discoveredTools = await this.toolDiscovery.discoverAllTools();
      
      // Process and unify tools
      const unifiedTools = await this.processDiscoveredTools(discoveredTools);
      
      // Resolve conflicts
      const resolvedTools = await this.conflictResolver.resolveConflicts(unifiedTools);
      
      // Update internal maps
      this.updateToolMaps(resolvedTools);
      
      // Emit update event
      this.emit('tools:updated', Array.from(this.unifiedTools.values()));
      
      this.lastUpdate = new Date();
      
    } catch (error) {
      console.error('Failed to refresh tool catalog:', error);
      throw error;
    }
  }

  async searchTools(
    query: string, 
    context?: ToolExecutionContext,
    options?: SearchOptions
  ): Promise<UnifiedTool[]> {
    
    // Step 1: Basic fuzzy search
    let results = await this.fuzzySearch.search(query, Array.from(this.unifiedTools.values()));
    
    // Step 2: Apply context filtering
    if (context) {
      const contextScores = await this.contextAnalyzer.analyzeRelevance(results, context);
      results = this.applyContextScoring(results, contextScores);
    }
    
    // Step 3: Apply user preferences
    results = await this.applyUserPreferences(results, context?.userPreferences);
    
    // Step 4: Filter by availability
    results = results.filter(tool => tool.availability.status === 'available');
    
    // Step 5: Sort by relevance and quality
    results.sort((a, b) => this.calculateToolScore(b, query, context) - this.calculateToolScore(a, query, context));
    
    // Step 6: Apply limits
    if (options?.maxResults) {
      results = results.slice(0, options.maxResults);
    }
    
    return results;
  }

  async executeTool(
    toolId: string,
    parameters: any,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    
    const tool = this.unifiedTools.get(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }
    
    try {
      // Step 1: Validate parameters
      const validatedParams = await this.validateParameters(tool, parameters);
      
      // Step 2: Check tool availability
      await this.checkToolAvailability(tool);
      
      // Step 3: Execute through appropriate router
      const startTime = Date.now();
      const result = await this.executionRouter.execute(tool, validatedParams, context);
      const executionTime = Date.now() - startTime;
      
      // Step 4: Process result
      const processedResult = await this.processExecutionResult(result, tool, executionTime);
      
      // Step 5: Update tool metrics
      await this.updateToolMetrics(tool, processedResult, executionTime);
      
      // Step 6: Record usage
      await this.recordToolUsage(tool, context);
      
      this.emit('tool:executed', processedResult);
      return processedResult;
      
    } catch (error) {
      // Handle execution errors with fallback mechanisms
      return await this.handleExecutionError(tool, parameters, context, error);
    }
  }

  async getToolsByCategory(categoryId: string, context?: ToolExecutionContext): Promise<UnifiedTool[]> {
    let tools = Array.from(this.unifiedTools.values())
      .filter(tool => tool.category.id === categoryId);
    
    if (context) {
      const contextScores = await this.contextAnalyzer.analyzeRelevance(tools, context);
      tools = this.applyContextScoring(tools, contextScores);
    }
    
    return tools.sort((a, b) => b.preferenceWeight - a.preferenceWeight);
  }

  async getAvailableCategories(context?: ToolExecutionContext): Promise<ToolCategory[]> {
    const categories = new Map<string, ToolCategory>();
    
    for (const tool of this.unifiedTools.values()) {
      if (tool.availability.status === 'available') {
        // Apply context filtering
        if (context) {
          const isRelevant = await this.contextAnalyzer.isToolRelevant(tool, context);
          if (!isRelevant) continue;
        }
        
        categories.set(tool.category.id, tool.category);
      }
    }
    
    return Array.from(categories.values())
      .sort((a, b) => a.priority - b.priority);
  }

  async getToolPreview(toolId: string): Promise<ToolPreview> {
    const tool = this.unifiedTools.get(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }
    
    return {
      tool,
      recentUsage: await this.getRecentUsage(toolId),
      performanceMetrics: await this.performanceMonitor.getToolMetrics(toolId),
      similarTools: await this.findSimilarTools(tool),
      documentation: await this.getToolDocumentation(tool)
    };
  }

  // Private helper methods
  private async processDiscoveredTools(discoveredTools: DiscoveredTool[]): Promise<UnifiedTool[]> {
    const unifiedTools: UnifiedTool[] = [];
    
    for (const discovered of discoveredTools) {
      const unified = await this.convertToUnifiedTool(discovered);
      
      // Enhance with additional metadata
      unified.contextRelevance = await this.contextAnalyzer.calculateRelevance(unified);
      unified.availability = await this.checkToolAvailability(unified);
      unified.preferenceWeight = await this.userPreferences.getToolWeight(unified.id);
      
      unifiedTools.push(unified);
    }
    
    return unifiedTools;
  }

  private updateToolMaps(tools: UnifiedTool[]): void {
    this.unifiedTools.clear();
    
    for (const tool of tools) {
      this.unifiedTools.set(tool.id, tool);
    }
    
    // Rebuild category index
    this.rebuildCategoryIndex();
  }

  private async rebuildSearchIndex(): Promise<void> {
    const tools = Array.from(this.unifiedTools.values());
    await this.toolIndexer.buildIndex(tools);
    await this.fuzzySearch.updateIndex(tools);
  }

  private calculateToolScore(tool: UnifiedTool, query: string, context?: ToolExecutionContext): number {
    let score = 0;
    
    // Base relevance score
    score += this.fuzzySearch.getRelevanceScore(tool, query) * 0.4;
    
    // Context relevance
    if (context) {
      score += tool.contextRelevance.score * 0.3;
    }
    
    // Performance metrics
    score += (tool.successRate / 100) * 0.15;
    score += Math.min(tool.usageCount / 100, 1) * 0.1;
    
    // User preferences
    score += tool.preferenceWeight * 0.05;
    
    return score;
  }

  private async handleExecutionError(
    tool: UnifiedTool,
    parameters: any,
    context: ToolExecutionContext,
    error: Error
  ): Promise<ToolExecutionResult> {
    
    this.emit('tool:failed', tool.id, error);
    
    // Try fallback mechanisms
    if (context.userPreferences.enableFallbacks) {
      const fallbackTool = await this.findFallbackTool(tool, context);
      
      if (fallbackTool) {
        this.emit('fallback:triggered', tool.id, fallbackTool.id);
        return await this.executeTool(fallbackTool.id, parameters, context);
      }
    }
    
    // Return error result
    return {
      toolId: tool.id,
      success: false,
      error: {
        message: error.message,
        type: 'execution_error',
        recoverable: false
      },
      executionTime: 0,
      source: tool.source
    };
  }

  private startPeriodicUpdates(): void {
    // Update tool catalog every 30 seconds
    this.updateInterval = setInterval(async () => {
      try {
        await this.refreshToolCatalog();
      } catch (error) {
        console.warn('Periodic tool catalog update failed:', error);
      }
    }, 30000);
  }

  async shutdown(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    await this.toolDiscovery.shutdown();
    await this.executionRouter.shutdown();
    await this.performanceMonitor.shutdown();
    
    this.removeAllListeners();
  }
}
```

### Step 4: @ Symbol React Component
Create `packages/tool-router/src/ui/at-symbol-dropdown.tsx`:

```typescript
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UnifiedTool, ToolCategory, ToolExecutionContext } from '../types/tool-router-types';
import { useToolRouter } from '../hooks/use-tool-router';
import { ToolSelector } from './tool-selector';
import { ToolPreview } from './tool-preview';
import { ParameterInput } from './parameter-input';

interface AtSymbolDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (tool: UnifiedTool, parameters?: any) => void;
  context: ToolExecutionContext;
  position: { x: number; y: number };
  initialQuery?: string;
}

export const AtSymbolDropdown: React.FC<AtSymbolDropdownProps> = ({
  isOpen,
  onClose,
  onToolSelect,
  context,
  position,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTool, setSelectedTool] = useState<UnifiedTool | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    searchTools, 
    getAvailableCategories, 
    getToolsByCategory,
    getToolPreview 
  } = useToolRouter();

  // Search results based on query and category
  const searchResults = useMemo(async () => {
    if (query.trim()) {
      return await searchTools(query, context, { maxResults: 10 });
    } else if (currentCategory === 'all') {
      return await getRecentTools(context);
    } else {
      return await getToolsByCategory(currentCategory, context);
    }
  }, [query, currentCategory, context, searchTools, getToolsByCategory]);

  // Available categories
  const categories = useMemo(async () => {
    return await getAvailableCategories(context);
  }, [context, getAvailableCategories]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, (searchResults?.length || 1) - 1));
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
          
        case 'Enter':
          event.preventDefault();
          if (searchResults && searchResults[selectedIndex]) {
            handleToolSelection(searchResults[selectedIndex]);
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
          
        case 'Tab':
          event.preventDefault();
          if (searchResults && searchResults[selectedIndex]) {
            setShowPreview(!showPreview);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, showPreview, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleToolSelection = (tool: UnifiedTool) => {
    setSelectedTool(tool);
    
    // Check if tool requires parameters
    const hasRequiredParams = tool.inputSchema.required && tool.inputSchema.required.length > 0;
    
    if (hasRequiredParams && !showParameters) {
      setShowParameters(true);
    } else {
      onToolSelect(tool);
      onClose();
    }
  };

  const handleParameterSubmit = (parameters: any) => {
    if (selectedTool) {
      onToolSelect(selectedTool, parameters);
      onClose();
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setSelectedIndex(0);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-2xl w-full"
      style={{
        left: position.x,
        top: position.y,
        maxHeight: '70vh'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="text-blue-500 font-mono text-lg">@</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 bg-transparent border-none outline-none text-lg"
          />
          <span className="text-xs text-gray-500">Tab for preview • Enter to select</span>
        </div>
        
        {/* Category tabs */}
        <div className="flex space-x-2 mt-3 overflow-x-auto">
          <button
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
              currentCategory === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All Tools
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap flex items-center space-x-1 ${
                currentCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-h-96">
        {/* Tool list */}
        <div className="flex-1 overflow-y-auto">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((tool, index) => (
              <ToolSelector
                key={tool.id}
                tool={tool}
                isSelected={index === selectedIndex}
                onClick={() => handleToolSelection(tool)}
                onHover={() => setSelectedIndex(index)}
                showUsageStats={true}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <div>No tools found</div>
              <div className="text-sm">Try a different search term</div>
            </div>
          )}
        </div>

        {/* Preview panel */}
        {showPreview && selectedTool && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700">
            <ToolPreview toolId={selectedTool.id} />
          </div>
        )}
      </div>

      {/* Parameter input */}
      {showParameters && selectedTool && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ParameterInput
            tool={selectedTool}
            onSubmit={handleParameterSubmit}
            onCancel={() => {
              setShowParameters(false);
              setSelectedTool(null);
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>↑↓ Navigate</span>
          <span>⏎ Select</span>
          <span>⇥ Preview</span>
          <span>⎋ Close</span>
        </div>
        <div>
          {searchResults?.length || 0} tools available
        </div>
      </div>
    </div>
  );
};
```

### Step 5: Tool Execution Engine
Create `packages/tool-router/src/execution/execution-engine.ts`:

```typescript
export class ExecutionEngine {
  private builtinClient: BuiltinMCPClient;
  private externalHub: MCPClientHub;
  private fallbackHandler: FallbackHandler;
  private performanceMonitor: PerformanceMonitor;
  
  constructor() {
    this.initializeClients();
  }

  async execute(
    tool: UnifiedTool,
    parameters: any,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    
    const executionId = uuidv4();
    const startTime = Date.now();
    
    try {
      // Step 1: Pre-execution validation
      await this.validateExecution(tool, parameters, context);
      
      // Step 2: Route to appropriate execution system
      let result: any;
**Enhanced Implementation Notes:**
- IDE-standard keyboard shortcuts and menu system
- Complete chat history CRUD with search, filtering, and tagging
- Workflow creation and management with LangChain integration
- Subject mode switching with specialized UI adaptations
- Responsive design with professional IDE aesthetics
- Context-sensitive toolbars and menus
- Real-time updates and streaming responses

**Validation:** Full IDE interface with chat history management, workflow creation, subject mode switching, and all UI components functional.
**Next Phase:** Phase 8 adds comprehensive management center and final integration.

---

# PROMPT 8: MCP Management Center & Final Integration

## Context & Objective
This final phase completes the TanukiMCP Atlas implementation by creating a comprehensive Management Center that serves as the administrative hub for the entire system. Building on all previous phases, this implements a sophisticated control panel for server configuration, real-time health monitoring, tool catalog management, performance analytics, and system diagnostics.

The MCP Management Center transforms TanukiMCP Atlas from a powerful local AI IDE into a production-ready system with enterprise-grade monitoring, configuration management, and optimization capabilities. This phase includes comprehensive testing protocols, performance optimization, final system integration, and production-readiness preparations.

This phase also implements the final polish touches including system themes, accessibility features, comprehensive error handling, backup/restore functionality, and complete documentation integration within the IDE.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (MCP Management Center UI section)
Review: `docs/16-production-architecture.md` (Production deployment and optimization)

## Technical Requirements
- **Comprehensive Management Dashboard:** Real-time system overview with health metrics and alerts
- **Server Configuration Manager:** Visual forms for MCP server setup, authentication, and security
- **Tool Catalog Browser:** Interactive tool discovery with testing sandbox and performance metrics
- **Performance Analytics:** System-wide metrics collection, analysis, and optimization recommendations
- **Health Monitoring:** Real-time health checking with alerting and automated recovery mechanisms
- **Configuration Import/Export:** Backup and restore functionality for all system configurations
- **System Diagnostics:** Advanced troubleshooting tools with log analysis and performance profiling
- **Production Optimization:** Final performance tuning and memory optimization
- **Accessibility & Theming:** Complete UI polish with accessibility compliance and customizable themes

## Enhanced File Structure
```
packages/management-center/
├── package.json (Management center dependencies)
├── tsconfig.json (TypeScript configuration)
└── src/
    ├── dashboard/
    │   ├── management-dashboard.tsx (Main dashboard interface)
    │   ├── system-overview.tsx (System health overview)
    │   ├── quick-actions.tsx (Common management actions)
    │   ├── status-indicators.tsx (Real-time status displays)
    │   └── notification-center.tsx (System alerts and notifications)
    ├── server-management/
    │   ├── server-config-manager.tsx (Server configuration UI)
    │   ├── server-setup-wizard.tsx (New server setup wizard)
    │   ├── connection-tester.tsx (Server connection testing)
    │   ├── authentication-config.tsx (Security and auth setup)
    │   └── server-templates.tsx (Pre-configured server templates)
    ├── tool-catalog/
    │   ├── tool-catalog-browser.tsx (Interactive tool browser)
    │   ├── tool-testing-sandbox.tsx (Tool testing environment)
    │   ├── tool-performance-metrics.tsx (Tool usage analytics)
    │   ├── tool-documentation-viewer.tsx (Tool docs and examples)
    │   └── tool-conflict-resolver.tsx (Tool conflict management)
    ├── monitoring/
    │   ├── health-monitor-dashboard.tsx (Health monitoring UI)
    │   ├── performance-charts.tsx (Performance visualization)
    │   ├── alert-management.tsx (Alert configuration and history)
    │   ├── resource-monitor.tsx (System resource monitoring)
    │   └── uptime-tracker.tsx (Uptime and availability tracking)
    ├── analytics/
    │   ├── usage-analytics.tsx (Usage pattern analysis)
    │   ├── performance-analytics.tsx (Performance trend analysis)
    │   ├── optimization-recommendations.tsx (System optimization suggestions)
    │   ├── report-generator.tsx (Automated report generation)
    │   └── data-export.tsx (Analytics data export)
    ├── diagnostics/
    │   ├── system-diagnostics.tsx (Advanced troubleshooting tools)
    │   ├── log-analyzer.tsx (Log analysis and search)
    │   ├── performance-profiler.tsx (Performance profiling tools)
    │   ├── network-diagnostics.tsx (Network connectivity testing)
    │   └── troubleshooting-wizard.tsx (Guided problem resolution)
    ├── configuration/
    │   ├── config-manager.tsx (Configuration management UI)
    │   ├── backup-restore.tsx (Backup and restore functionality)
    │   ├── import-export.tsx (Configuration import/export)
    │   ├── validation-engine.tsx (Configuration validation)
    │   └── migration-tools.tsx (Configuration migration utilities)
    ├── theming/
    │   ├── theme-manager.tsx (Theme customization interface)
    │   ├── accessibility-settings.tsx (Accessibility configuration)
    │   ├── ui-customization.tsx (UI layout customization)
    │   ├── color-picker.tsx (Custom color schemes)
    │   └── font-settings.tsx (Typography customization)
    └── types/
        ├── management-types.ts (Management center types)
        ├── monitoring-types.ts (Monitoring system types)
        ├── analytics-types.ts (Analytics types)
        └── configuration-types.ts (Configuration management types)
```

## Implementation Instructions

### Step 1: Core Dependencies
Create `packages/management-center/package.json`:

```json
{
  "name": "@tanukimcp/management-center",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "lint": "eslint src/ --ext .ts,.tsx"
  },
  "dependencies": {
    "@tanukimcp/shared": "workspace:*",
    "@tanukimcp/mcp-hub": "workspace:*",
    "@tanukimcp/mcp-server": "workspace:*",
    "@tanukimcp/tool-router": "workspace:*",
    "@tanukimcp/llm-enhanced": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.8.0",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "zustand": "^4.4.7",
    "react-virtualized": "^9.22.5",
    "react-window": "^1.8.8",
    "eventemitter3": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/lodash": "^4.14.202",
    "@types/react-virtualized": "^9.21.29",
    "@types/react-window": "^1.8.8",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "typescript": "^5.3.0"
  }
}
```

### Step 2: Management Dashboard
Create `packages/management-center/src/dashboard/management-dashboard.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { SystemOverview } from './system-overview';
import { QuickActions } from './quick-actions';
import { StatusIndicators } from './status-indicators';
import { NotificationCenter } from './notification-center';
import { useSystemHealth } from '../hooks/use-system-health';
import { useNotifications } from '../hooks/use-notifications';
import { SystemHealth, SystemMetrics } from '../types/management-types';

export const ManagementDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  
  const {
    systemHealth,
    systemMetrics,
    isLoading,
    error,
    refreshHealth,
    toggleAutoRefresh,
    isAutoRefreshEnabled
  } = useSystemHealth();
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    addNotification
  } = useNotifications();

  // Auto-refresh system health
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;
    
    const interval = setInterval(() => {
      refreshHealth();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval, isAutoRefreshEnabled, refreshHealth]);

  // System health monitoring alerts
  useEffect(() => {
    if (systemHealth) {
      // Check for critical issues
      const criticalIssues = detectCriticalIssues(systemHealth);
      criticalIssues.forEach(issue => {
        addNotification({
          type: 'error',
          title: 'System Health Alert',
          message: issue.message,
          timestamp: new Date(),
          actions: issue.actions
        });
      });
    }
  }, [systemHealth, addNotification]);

  const navigationItems = [
    { id: 'overview', label: 'System Overview', icon: '📊', component: SystemOverview },
    { id: 'servers', label: 'Server Management', icon: '🔧', component: ServerManagement },
    { id: 'tools', label: 'Tool Catalog', icon: '🛠️', component: ToolCatalog },
    { id: 'monitoring', label: 'Health Monitoring', icon: '💓', component: HealthMonitoring },
    { id: 'analytics', label: 'Performance Analytics', icon: '📈', component: PerformanceAnalytics },
    { id: 'diagnostics', label: 'System Diagnostics', icon: '🔍', component: SystemDiagnostics },
    { id: 'configuration', label: 'Configuration', icon: '⚙️', component: ConfigurationManager },
    { id: 'theming', label: 'Appearance', icon: '🎨', component: ThemeManager }
  ];

  const selectedComponent = navigationItems.find(item => item.id === selectedView)?.component;

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-semibold">TanukiMCP</h1>
              <p className="text-sm text-gray-500">Management Center</p>
            </div>
          </div>
          
          {/* System Status Card */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Status</span>
              <StatusIndicators compact />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {systemHealth ? (
                <div className="space-y-1">
                  <div>Uptime: {formatUptime(systemHealth.uptime)}</div>
                  <div>CPU: {systemHealth.cpu.usage}%</div>
                  <div>Memory: {systemHealth.memory.usage}%</div>
                </div>
              ) : (
                <div>Loading system status...</div>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.id === selectedView)?.label}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {getViewDescription(selectedView)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Auto-refresh
                </label>
                <button
                  onClick={() => toggleAutoRefresh()}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isAutoRefreshEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isAutoRefreshEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Refresh button */}
              <button
                onClick={() => refreshHealth()}
                disabled={isLoading}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              {/* Notifications */}
              <NotificationCenter 
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onClearAll={clearAll}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-400 mr-3">⚠️</span>
                <div>
                  <h3 className="text-red-800 dark:text-red-200 font-medium">System Error</h3>
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : selectedComponent ? (
            React.createElement(selectedComponent, {
              systemHealth,
              systemMetrics,
              onRefresh: refreshHealth
            })
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This section is under development.
              </p>
            </div>
          )}
        </main>
      </div>
      
      {/* Quick Actions Floating Panel */}
      <QuickActions 
        systemHealth={systemHealth}
        onAction={handleQuickAction}
      />
    </div>
  );
};

// Helper functions
const detectCriticalIssues = (health: SystemHealth): CriticalIssue[] => {
  const issues: CriticalIssue[] = [];
  
  if (health.cpu.usage > 90) {
    issues.push({
      type: 'high_cpu',
      message: `High CPU usage detected: ${health.cpu.usage}%`,
      actions: [
        { label: 'View Details', action: 'navigate:monitoring' },
        { label: 'Optimize', action: 'optimize:cpu' }
      ]
    });
  }
  
  if (health.memory.usage > 85) {
    issues.push({
      type: 'high_memory',
      message: `High memory usage detected: ${health.memory.usage}%`,
      actions: [
        { label: 'View Details', action: 'navigate:monitoring' },
        { label: 'Clear Cache', action: 'optimize:memory' }
      ]
    });
  }
  
  if (health.mcpServers.some(server => server.status === 'error')) {
    const errorServers = health.mcpServers.filter(server => server.status === 'error');
    issues.push({
      type: 'server_error',
      message: `${errorServers.length} MCP server(s) are experiencing errors`,
      actions: [
        { label: 'View Servers', action: 'navigate:servers' },
        { label: 'Restart Servers', action: 'restart:servers' }
      ]
    });
  }
  
  return issues;
};

const formatUptime = (uptimeMs: number): string => {
  const days = Math.floor(uptimeMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((uptimeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((uptimeMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getViewDescription = (view: string): string => {
  const descriptions = {
    overview: 'Complete system status and health overview',
    servers: 'Configure and manage MCP servers and connections',
    tools: 'Browse, test, and manage available tools',
    monitoring: 'Real-time health monitoring and alerts',
    analytics: 'Performance metrics and usage analytics',
    diagnostics: 'Advanced troubleshooting and system diagnostics',
    configuration: 'System configuration and backup management',
    theming: 'Customize appearance and accessibility settings'
  };
  
  return descriptions[view as keyof typeof descriptions] || '';
};
```

### Step 3: Tool Catalog Browser
Create `packages/management-center/src/tool-catalog/tool-catalog-browser.tsx`:

```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { ToolTestingSandbox } from './tool-testing-sandbox';
import { ToolPerformanceMetrics } from './tool-performance-metrics';
import { ToolDocumentationViewer } from './tool-documentation-viewer';
import { useToolCatalog } from '../hooks/use-tool-catalog';
import { UnifiedTool, ToolCategory } from '@tanukimcp/tool-router';

export const ToolCatalogBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<UnifiedTool | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTestingSandbox, setShowTestingSandbox] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'performance' | 'rating'>('name');
  
  const {
    tools,
    categories,
    isLoading,
    error,
    refreshCatalog,
    getToolMetrics,
    testTool
  } = useToolCatalog();

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category.id === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'performance':
          return b.successRate - a.successRate;
        case 'rating':
          return (b.userRating || 0) - (a.userRating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [tools, searchQuery, selectedCategory, sortBy]);

  // Grid item renderer for virtualized display
  const GridItem = ({ columnIndex, rowIndex, style }: any) => {
    const toolIndex = rowIndex * 3 + columnIndex;
    const tool = filteredTools[toolIndex];
    
    if (!tool) return <div style={style} />;
    
    return (
      <div style={style} className="p-2">
        <ToolCard
          tool={tool}
          onSelect={() => setSelectedTool(tool)}
          onTest={() => {
            setSelectedTool(tool);
            setShowTestingSandbox(true);
          }}
          metrics={getToolMetrics(tool.id)}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex">
      {/* Main Tool Browser */}
      <div className="flex-1 flex flex-col">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="usage">Sort by Usage</option>
              <option value="performance">Sort by Performance</option>
              <option value="rating">Sort by Rating</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Refresh */}
            <button
              onClick={refreshCatalog}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{filteredTools.length} tools</span>
            <span>{categories.length} categories</span>
            <span>{tools.filter(t => t.availability.status === 'available').length} available</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        {/* Tool Display */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Tools</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={refreshCatalog}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Tools Found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <Grid
              columnCount={3}
              columnWidth={320}
              height={600}
              rowCount={Math.ceil(filteredTools.length / 3)}
              rowHeight={240}
              width="100%"
            >
              {GridItem}
            </Grid>
          ) : (
            <div className="p-4 space-y-2">
              {filteredTools.map(tool => (
                <ToolListItem
                  key={tool.id}
                  tool={tool}
                  onSelect={() => setSelectedTool(tool)}
                  onTest={() => {
                    setSelectedTool(tool);
                    setShowTestingSandbox(true);
                  }}
                  metrics={getToolMetrics(tool.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Tool Details Panel */}
      {selectedTool && (
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ToolDetailsPanel
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            onTest={() => setShowTestingSandbox(true)}
            onViewDocs={() => {/* Open documentation */}}
            onViewMetrics={() => {/* Open metrics */}}
          />
        </div>
      )}
      
      {/* Testing Sandbox Modal */}
      {showTestingSandbox && selectedTool && (
        <ToolTestingSandbox
          tool={selectedTool}
          isOpen={showTestingSandbox}
          onClose={() => setShowTestingSandbox(false)}
          onTest={testTool}
        />
      )}
    </div>
  );
};

// Tool Card Component
const ToolCard: React.FC<{
  tool: UnifiedTool;
  onSelect: () => void;
  onTest: () => void;
  metrics: any;
}> = ({ tool, onSelect, onTest, metrics }) => {
  const isAvailable = tool.availability.status === 'available';
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
      <div onClick={onSelect} className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{tool.category.icon}</span>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {tool.source.type} • {tool.category.name}
              </p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
          {tool.description}
        </p>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-white">{tool.usageCount}</div>
            <div className="text-gray-500 dark:text-gray-400">Uses</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-white">{tool.successRate}%</div>
            <div className="text-gray-500 dark:text-gray-400">Success</div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onTest(); }}
            disabled={!isAvailable}
            className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test
          </button>
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Step 4: System Health Monitoring
Create `packages/management-center/src/monitoring/health-monitor-dashboard.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertManagement } from './alert-management';
import { ResourceMonitor } from './resource-monitor';
import { UptimeTracker } from './uptime-tracker';
import { useSystemMonitoring } from '../hooks/use-system-monitoring';

export const HealthMonitorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  
  const {
    healthHistory,
    realTimeMetrics,
    alerts,
    serverStatuses,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getHealthTrend
  } = useSystemMonitoring();

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  const metricTabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'resources', label: 'Resources', icon: '💾' },
    { id: 'servers', label: 'MCP Servers', icon: '🔧' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' }
  ];

  const currentHealth = realTimeMetrics || {};
  const healthScore = calculateOverallHealthScore(currentHealth);

  return (
    <div className="space-y-6">
      {/* Health Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HealthMetricCard
          title="Overall Health"
          value={`${healthScore}%`}
          trend={getHealthTrend('overall', timeRange)}
          status={getHealthStatus(healthScore)}
          icon="💓"
        />
        <HealthMetricCard
          title="CPU Usage"
          value={`${currentHealth.cpu?.usage || 0}%`}
          trend={getHealthTrend('cpu', timeRange)}
          status={getResourceStatus(currentHealth.cpu?.usage || 0)}
          icon="🔥"
        />
        <HealthMetricCard
          title="Memory Usage"
          value={`${currentHealth.memory?.usage || 0}%`}
          trend={getHealthTrend('memory', timeRange)}
          status={getResourceStatus(currentHealth.memory?.usage || 0)}
          icon="💾"
        />
        <HealthMetricCard
          title="Active Servers"
          value={`${serverStatuses.filter(s => s.status === 'healthy').length}/${serverStatuses.length}`}
          trend={getHealthTrend('servers', timeRange)}
          status={getServerStatus(serverStatuses)}
          icon="🔧"
        />
      </div>
      
      {/* Real-time Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Real-time Monitoring</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isMonitoring ? 'Live' : 'Stopped'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
        
        {/* Metric Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {metricTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                selectedMetric === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Chart Content */}
        <div className="h-80">
          {selectedMetric === 'overview' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthHistory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="healthScore" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Health Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="CPU Usage"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Memory Usage"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {selectedMetric === 'performance' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthHistory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="responseTime" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Response Time (ms)"
                />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stackId="1" 
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  name="Throughput (req/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          
          {selectedMetric === 'resources' && (
            <ResourceMonitor 
              healthHistory={healthHistory}
              currentMetrics={currentHealth}
            />
          )}
          
          {selectedMetric === 'servers' && (
            <ServerStatusChart serverStatuses={serverStatuses} />
          )}
          
          {selectedMetric === 'alerts' && (
            <AlertManagement alerts={alerts} />
          )}
        </div>
      </div>
      
      {/* Uptime Tracking */}
      <UptimeTracker 
        uptimeData={healthHistory}
        currentUptime={currentHealth.uptime}
      />
    </div>
  );
};

// Helper Components
const HealthMetricCard: React.FC<{
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  icon: string;
}> = ({ title, value, trend, status, icon }) => {
  const statusColors = {
    good: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400'
  };
  
  const trendIcons = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-semibold ${statusColors[status]}`}>
          {value}
        </span>
        <span className="text-sm">{trendIcons[trend]}</span>
      </div>
    </div>
  );
};
```

**Validation:** Complete TanukiMCP Atlas IDE with comprehensive management center, real-time monitoring, tool catalog browser, performance analytics, and all system features functional.

**Integration Points:** Integrates all previous phases (1-7) into a unified management interface, provides production-ready monitoring and configuration, and delivers a complete local AI IDE solution.

**Result:** Production-ready local AI IDE with dual MCP architecture, comprehensive tooling, advanced LLM routing, intelligent tool management, and enterprise-grade monitoring capabilities.

---

## 🎯 Implementation Notes

Each prompt builds incrementally on previous phases. Reference the provided architecture documents in each phase. Focus on production-quality implementations with proper error handling, TypeScript typing, and performance optimization. No cloud dependencies - everything runs locally.

The end result is a sophisticated, modular, local-only AI IDE that rivals commercial solutions while remaining completely free and private.