"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  tanukiApp: () => tanukiApp
});
module.exports = __toCommonJS(main_exports);
var import_electron4 = require("electron");
var import_path3 = __toESM(require("path"));

// src/window.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"));
function createWindow() {
  const { width, height } = import_electron.screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = Math.min(1400, Math.floor(width * 0.9));
  const windowHeight = Math.min(900, Math.floor(height * 0.9));
  const window = new import_electron.BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1024,
    minHeight: 768,
    center: true,
    // Window appearance
    titleBarStyle: "hiddenInset",
    // macOS-style title bar
    frame: true,
    transparent: false,
    backgroundColor: "#1a1a1a",
    // Dark theme background
    // Security settings
    webPreferences: {
      nodeIntegration: false,
      // Disable node integration in renderer
      contextIsolation: true,
      // Enable context isolation
      sandbox: false,
      // Disable sandbox for better performance
      preload: import_path.default.join(__dirname, "preload.js"),
      // Will be created later
      webSecurity: true,
      // Enable web security
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      // Additional security
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
      disableBlinkFeatures: "Auxclick"
    },
    // Performance settings
    show: false,
    // Don't show until ready
    paintWhenInitiallyHidden: false,
    // Window behavior
    autoHideMenuBar: false,
    // Keep menu bar visible for IDE functionality
    fullscreenable: true,
    maximizable: true,
    minimizable: true,
    resizable: true,
    // Icon (will be added later)
    // icon: path.join(__dirname, '../assets/icon.png'),
    // Development
    ...process.env.NODE_ENV === "development" && {
      webPreferences: {
        ...import_electron.BrowserWindow.prototype.webPreferences,
        devTools: true
      }
    }
  });
  window.once("ready-to-show", () => {
    console.log("\u{1FA9F} Window ready to show");
    window.show();
    if (process.env.NODE_ENV === "development") {
      window.focus();
    }
  });
  window.on("closed", () => {
    console.log("\u{1FA9F} Window closed");
  });
  window.on("maximize", () => {
    console.log("\u{1FA9F} Window maximized");
  });
  window.on("unmaximize", () => {
    console.log("\u{1FA9F} Window unmaximized");
  });
  window.on("minimize", () => {
    console.log("\u{1FA9F} Window minimized");
  });
  window.on("restore", () => {
    console.log("\u{1FA9F} Window restored");
  });
  window.on("focus", () => {
  });
  window.on("blur", () => {
  });
  window.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== "http://localhost:5173" && parsedUrl.origin !== "file://") {
      console.warn("\u{1F6AB} Blocked navigation to external URL:", navigationUrl);
      event.preventDefault();
    }
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    console.warn("\u{1F6AB} Blocked attempt to open new window:", url);
    return { action: "deny" };
  });
  window.webContents.on("console-message", (event, level, message, line, sourceId) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Renderer [${level}]:`, message);
    }
  });
  window.webContents.on("crashed", (event, killed) => {
    console.error("\u{1F4A5} Renderer process crashed:", { killed });
    if (!killed) {
      window.reload();
    }
  });
  window.webContents.on("unresponsive", () => {
    console.warn("\u26A0\uFE0F Renderer process became unresponsive");
  });
  window.webContents.on("responsive", () => {
    console.log("\u2705 Renderer process became responsive again");
  });
  window.on("resize", () => {
    saveWindowState(window);
  });
  window.on("move", () => {
    saveWindowState(window);
  });
  restoreWindowState(window);
  return window;
}
function saveWindowState(window) {
  try {
    const bounds = window.getBounds();
    const state = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: window.isMaximized(),
      isFullScreen: window.isFullScreen()
    };
    global.windowState = state;
  } catch (error) {
    console.error("Failed to save window state:", error);
  }
}
function restoreWindowState(window) {
  try {
    const state = global.windowState;
    if (state) {
      const { workArea } = import_electron.screen.getPrimaryDisplay();
      if (state.x >= workArea.x && state.x < workArea.x + workArea.width && state.y >= workArea.y && state.y < workArea.y + workArea.height) {
        window.setBounds({
          x: state.x,
          y: state.y,
          width: Math.min(state.width, workArea.width),
          height: Math.min(state.height, workArea.height)
        });
      }
      if (state.isMaximized) {
        window.maximize();
      }
      if (state.isFullScreen) {
        window.setFullScreen(true);
      }
    }
  } catch (error) {
    console.error("Failed to restore window state:", error);
  }
}

// src/ipc/handlers.ts
var import_electron3 = require("electron");

// src/database/connection.ts
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_better_sqlite32 = require("drizzle-orm/better-sqlite3");
var import_path2 = __toESM(require("path"));
var import_electron2 = require("electron");

// src/database/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analytics: () => analytics,
  chatHistory: () => chatHistory,
  chatHistoryRelations: () => chatHistoryRelations,
  chatSessions: () => chatSessions,
  chatSessionsRelations: () => chatSessionsRelations,
  contextEntries: () => contextEntries,
  mcpServers: () => mcpServers,
  modelConfigurations: () => modelConfigurations,
  projects: () => projects,
  projectsRelations: () => projectsRelations,
  settings: () => settings,
  subjectModes: () => subjectModes,
  workflowExecutions: () => workflowExecutions,
  workflowExecutionsRelations: () => workflowExecutionsRelations,
  workflows: () => workflows,
  workflowsRelations: () => workflowsRelations
});
var import_sqlite_core = require("drizzle-orm/sqlite-core");
var import_drizzle_orm = require("drizzle-orm");
var projects = (0, import_sqlite_core.sqliteTable)("projects", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  name: (0, import_sqlite_core.text)("name").notNull(),
  path: (0, import_sqlite_core.text)("path").notNull(),
  description: (0, import_sqlite_core.text)("description"),
  language: (0, import_sqlite_core.text)("language"),
  // Primary programming language
  framework: (0, import_sqlite_core.text)("framework"),
  // Framework or platform
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull(),
  lastOpened: (0, import_sqlite_core.integer)("last_opened", { mode: "timestamp" }),
  isActive: (0, import_sqlite_core.integer)("is_active", { mode: "boolean" }).default(true),
  settings: (0, import_sqlite_core.blob)("settings", { mode: "json" })
  // Project-specific settings
});
var chatSessions = (0, import_sqlite_core.sqliteTable)("chat_sessions", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  projectId: (0, import_sqlite_core.text)("project_id").references(() => projects.id),
  title: (0, import_sqlite_core.text)("title").notNull(),
  description: (0, import_sqlite_core.text)("description"),
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull(),
  isArchived: (0, import_sqlite_core.integer)("is_archived", { mode: "boolean" }).default(false),
  isFavorite: (0, import_sqlite_core.integer)("is_favorite", { mode: "boolean" }).default(false),
  messageCount: (0, import_sqlite_core.integer)("message_count").default(0),
  tags: (0, import_sqlite_core.blob)("tags", { mode: "json" }),
  subjectMode: (0, import_sqlite_core.text)("subject_mode").default("general"),
  // mathematics, programming, etc.
  modelUsed: (0, import_sqlite_core.text)("model_used"),
  // Which LLM model was primarily used
  totalTokens: (0, import_sqlite_core.integer)("total_tokens").default(0),
  executionTime: (0, import_sqlite_core.integer)("execution_time_ms").default(0)
});
var chatHistory = (0, import_sqlite_core.sqliteTable)("chat_history", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  sessionId: (0, import_sqlite_core.text)("session_id").references(() => chatSessions.id, { onDelete: "cascade" }),
  role: (0, import_sqlite_core.text)("role").notNull(),
  // 'user' | 'assistant' | 'system' | 'tool'
  content: (0, import_sqlite_core.text)("content").notNull(),
  metadata: (0, import_sqlite_core.blob)("metadata", { mode: "json" }),
  timestamp: (0, import_sqlite_core.integer)("timestamp", { mode: "timestamp" }).notNull(),
  parentMessageId: (0, import_sqlite_core.text)("parent_message_id"),
  toolsUsed: (0, import_sqlite_core.blob)("tools_used", { mode: "json" }),
  executionTime: (0, import_sqlite_core.integer)("execution_time_ms"),
  tokenCount: (0, import_sqlite_core.integer)("token_count"),
  model: (0, import_sqlite_core.text)("model"),
  // Which model generated this message
  temperature: (0, import_sqlite_core.real)("temperature"),
  // Model parameters used
  complexity: (0, import_sqlite_core.text)("complexity"),
  // atomic | moderate | complex | expert
  qualityScore: (0, import_sqlite_core.real)("quality_score")
  // Quality assessment score
});
var contextEntries = (0, import_sqlite_core.sqliteTable)("context_entries", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  sessionId: (0, import_sqlite_core.text)("session_id").references(() => chatSessions.id, { onDelete: "cascade" }),
  type: (0, import_sqlite_core.text)("type").notNull(),
  // 'file', 'function', 'concept', 'memory', 'error', 'solution'
  key: (0, import_sqlite_core.text)("key").notNull(),
  value: (0, import_sqlite_core.text)("value").notNull(),
  vectorEmbedding: (0, import_sqlite_core.blob)("vector_embedding"),
  // For semantic search
  importance: (0, import_sqlite_core.real)("importance").default(1),
  lastUsed: (0, import_sqlite_core.integer)("last_used", { mode: "timestamp" }).notNull(),
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  source: (0, import_sqlite_core.text)("source"),
  // Where this context came from
  expiry: (0, import_sqlite_core.integer)("expiry", { mode: "timestamp" }),
  // When to auto-remove
  compressed: (0, import_sqlite_core.integer)("compressed", { mode: "boolean" }).default(false)
});
var workflows = (0, import_sqlite_core.sqliteTable)("workflows", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  name: (0, import_sqlite_core.text)("name").notNull(),
  description: (0, import_sqlite_core.text)("description"),
  category: (0, import_sqlite_core.text)("category").notNull(),
  // 'project-management', 'code-generation', etc.
  definition: (0, import_sqlite_core.blob)("definition", { mode: "json" }).notNull(),
  // LangChain workflow definition
  variables: (0, import_sqlite_core.blob)("variables", { mode: "json" }).notNull(),
  // Required/optional variables
  metadata: (0, import_sqlite_core.blob)("metadata", { mode: "json" }).notNull(),
  // Additional metadata
  isActive: (0, import_sqlite_core.integer)("is_active", { mode: "boolean" }).default(true),
  isPublic: (0, import_sqlite_core.integer)("is_public", { mode: "boolean" }).default(false),
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull(),
  createdBy: (0, import_sqlite_core.text)("created_by"),
  // User/source identification
  version: (0, import_sqlite_core.text)("version").default("1.0.0"),
  tags: (0, import_sqlite_core.blob)("tags", { mode: "json" }),
  estimatedTime: (0, import_sqlite_core.integer)("estimated_time_ms"),
  // Expected execution time
  successRate: (0, import_sqlite_core.real)("success_rate"),
  // Historical success rate
  usageCount: (0, import_sqlite_core.integer)("usage_count").default(0)
});
var workflowExecutions = (0, import_sqlite_core.sqliteTable)("workflow_executions", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  workflowId: (0, import_sqlite_core.text)("workflow_id").references(() => workflows.id, { onDelete: "cascade" }),
  sessionId: (0, import_sqlite_core.text)("session_id").references(() => chatSessions.id),
  parameters: (0, import_sqlite_core.blob)("parameters", { mode: "json" }).notNull(),
  status: (0, import_sqlite_core.text)("status").notNull(),
  // 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  result: (0, import_sqlite_core.blob)("result", { mode: "json" }),
  errorMessage: (0, import_sqlite_core.text)("error_message"),
  errorStack: (0, import_sqlite_core.text)("error_stack"),
  started: (0, import_sqlite_core.integer)("started", { mode: "timestamp" }).notNull(),
  completed: (0, import_sqlite_core.integer)("completed", { mode: "timestamp" }),
  executionTimeMs: (0, import_sqlite_core.integer)("execution_time_ms"),
  stepsCompleted: (0, import_sqlite_core.integer)("steps_completed").default(0),
  totalSteps: (0, import_sqlite_core.integer)("total_steps"),
  progress: (0, import_sqlite_core.real)("progress").default(0)
  // 0.0 to 1.0
});
var mcpServers = (0, import_sqlite_core.sqliteTable)("mcp_servers", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  name: (0, import_sqlite_core.text)("name").notNull(),
  description: (0, import_sqlite_core.text)("description"),
  transport: (0, import_sqlite_core.text)("transport").notNull(),
  // 'stdio' | 'sse' | 'websocket'
  config: (0, import_sqlite_core.blob)("config", { mode: "json" }).notNull(),
  status: (0, import_sqlite_core.text)("status").notNull(),
  // 'connected' | 'disconnected' | 'error' | 'unknown'
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull(),
  lastConnected: (0, import_sqlite_core.integer)("last_connected", { mode: "timestamp" }),
  lastError: (0, import_sqlite_core.text)("last_error"),
  isAutoRestart: (0, import_sqlite_core.integer)("is_auto_restart", { mode: "boolean" }).default(true),
  restartCount: (0, import_sqlite_core.integer)("restart_count").default(0),
  version: (0, import_sqlite_core.text)("version"),
  capabilities: (0, import_sqlite_core.blob)("capabilities", { mode: "json" }),
  healthScore: (0, import_sqlite_core.real)("health_score").default(1),
  // 0.0 to 1.0
  responseTime: (0, import_sqlite_core.integer)("response_time_ms"),
  // Average response time
  uptime: (0, import_sqlite_core.integer)("uptime_seconds").default(0)
});
var modelConfigurations = (0, import_sqlite_core.sqliteTable)("model_configurations", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  modelName: (0, import_sqlite_core.text)("model_name").notNull(),
  displayName: (0, import_sqlite_core.text)("display_name"),
  parameters: (0, import_sqlite_core.blob)("parameters", { mode: "json" }).notNull(),
  performance: (0, import_sqlite_core.blob)("performance", { mode: "json" }),
  isDefault: (0, import_sqlite_core.integer)("is_default", { mode: "boolean" }).default(false),
  isInstalled: (0, import_sqlite_core.integer)("is_installed", { mode: "boolean" }).default(false),
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  lastUsed: (0, import_sqlite_core.integer)("last_used", { mode: "timestamp" }),
  usageCount: (0, import_sqlite_core.integer)("usage_count").default(0),
  averageTokensPerSecond: (0, import_sqlite_core.real)("avg_tokens_per_second"),
  averageResponseTime: (0, import_sqlite_core.integer)("avg_response_time_ms"),
  memoryUsage: (0, import_sqlite_core.integer)("memory_usage_mb"),
  diskSize: (0, import_sqlite_core.integer)("disk_size_mb"),
  downloadProgress: (0, import_sqlite_core.real)("download_progress").default(0),
  // 0.0 to 1.0
  lastBenchmark: (0, import_sqlite_core.integer)("last_benchmark", { mode: "timestamp" })
});
var subjectModes = (0, import_sqlite_core.sqliteTable)("subject_modes", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  name: (0, import_sqlite_core.text)("name").notNull(),
  displayName: (0, import_sqlite_core.text)("display_name").notNull(),
  description: (0, import_sqlite_core.text)("description"),
  icon: (0, import_sqlite_core.text)("icon"),
  // Emoji or icon identifier
  tools: (0, import_sqlite_core.blob)("tools", { mode: "json" }).notNull(),
  // Available tools in this mode
  prompts: (0, import_sqlite_core.blob)("prompts", { mode: "json" }),
  // Mode-specific prompts
  systemPrompt: (0, import_sqlite_core.text)("system_prompt"),
  // Default system prompt for this mode
  isActive: (0, import_sqlite_core.integer)("is_active", { mode: "boolean" }).default(true),
  isBuiltIn: (0, import_sqlite_core.integer)("is_built_in", { mode: "boolean" }).default(false),
  created: (0, import_sqlite_core.integer)("created", { mode: "timestamp" }).notNull(),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull(),
  usageCount: (0, import_sqlite_core.integer)("usage_count").default(0),
  color: (0, import_sqlite_core.text)("color"),
  // Theme color for UI
  shortcuts: (0, import_sqlite_core.blob)("shortcuts", { mode: "json" })
  // Keyboard shortcuts
});
var settings = (0, import_sqlite_core.sqliteTable)("settings", {
  key: (0, import_sqlite_core.text)("key").primaryKey(),
  value: (0, import_sqlite_core.blob)("value", { mode: "json" }).notNull(),
  category: (0, import_sqlite_core.text)("category"),
  // 'ui', 'performance', 'models', etc.
  description: (0, import_sqlite_core.text)("description"),
  isUserConfigurable: (0, import_sqlite_core.integer)("is_user_configurable", { mode: "boolean" }).default(true),
  updated: (0, import_sqlite_core.integer)("updated", { mode: "timestamp" }).notNull()
});
var analytics = (0, import_sqlite_core.sqliteTable)("analytics", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  event: (0, import_sqlite_core.text)("event").notNull(),
  // Event type
  data: (0, import_sqlite_core.blob)("data", { mode: "json" }),
  timestamp: (0, import_sqlite_core.integer)("timestamp", { mode: "timestamp" }).notNull(),
  sessionId: (0, import_sqlite_core.text)("session_id"),
  modelUsed: (0, import_sqlite_core.text)("model_used"),
  executionTime: (0, import_sqlite_core.integer)("execution_time_ms"),
  memoryUsage: (0, import_sqlite_core.integer)("memory_usage_mb"),
  cpuUsage: (0, import_sqlite_core.real)("cpu_usage_percent"),
  success: (0, import_sqlite_core.integer)("success", { mode: "boolean" })
});
var projectsRelations = (0, import_drizzle_orm.relations)(projects, ({ many }) => ({
  chatSessions: many(chatSessions)
}));
var chatSessionsRelations = (0, import_drizzle_orm.relations)(chatSessions, ({ one, many }) => ({
  project: one(projects, {
    fields: [chatSessions.projectId],
    references: [projects.id]
  }),
  messages: many(chatHistory),
  contextEntries: many(contextEntries),
  workflowExecutions: many(workflowExecutions)
}));
var chatHistoryRelations = (0, import_drizzle_orm.relations)(chatHistory, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatHistory.sessionId],
    references: [chatSessions.id]
  })
}));
var workflowsRelations = (0, import_drizzle_orm.relations)(workflows, ({ many }) => ({
  executions: many(workflowExecutions)
}));
var workflowExecutionsRelations = (0, import_drizzle_orm.relations)(workflowExecutions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id]
  }),
  session: one(chatSessions, {
    fields: [workflowExecutions.sessionId],
    references: [chatSessions.id]
  })
}));

// ../../node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// ../../node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// ../../node_modules/uuid/dist/esm-node/native.js
var import_crypto2 = __toESM(require("crypto"));
var native_default = {
  randomUUID: import_crypto2.default.randomUUID
};

// ../../node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/database/connection.ts
var db;
var sqlite;
async function initializeDatabase() {
  try {
    const userDataPath = import_electron2.app.getPath("userData");
    const dbPath = import_path2.default.join(userDataPath, "tanukimcp.db");
    console.log(`\u{1F4CA} Database path: ${dbPath}`);
    sqlite = new import_better_sqlite3.default(dbPath);
    configureDatabase(sqlite);
    db = (0, import_better_sqlite32.drizzle)(sqlite, { schema: schema_exports });
    console.log("\u{1F504} Running database migrations...");
    await runMigrations();
    await initializeDefaultData();
    console.log("\u2705 Database initialized successfully");
  } catch (error) {
    console.error("\u274C Failed to initialize database:", error);
    throw error;
  }
}
function configureDatabase(sqlite2) {
  sqlite2.pragma("journal_mode = WAL");
  sqlite2.pragma("synchronous = NORMAL");
  sqlite2.pragma("cache_size = 1000000");
  sqlite2.pragma("foreign_keys = ON");
  sqlite2.pragma("temp_store = MEMORY");
  sqlite2.pragma("busy_timeout = 5000");
  sqlite2.pragma("optimize");
  console.log("\u2699\uFE0F Database configured with performance optimizations");
}
async function runMigrations() {
  try {
    const migrationsFolder = import_path2.default.join(__dirname, "../../../drizzle");
    await createTablesIfNotExist();
    console.log("\u2705 Migrations completed");
  } catch (error) {
    console.error("\u274C Migration failed:", error);
    throw error;
  }
}
async function createTablesIfNotExist() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      description TEXT,
      language TEXT,
      framework TEXT,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      last_opened INTEGER,
      is_active INTEGER DEFAULT 1,
      settings TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      project_id TEXT REFERENCES projects(id),
      title TEXT NOT NULL,
      description TEXT,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      is_archived INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      message_count INTEGER DEFAULT 0,
      tags TEXT,
      subject_mode TEXT DEFAULT 'general',
      model_used TEXT,
      total_tokens INTEGER DEFAULT 0,
      execution_time_ms INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      timestamp INTEGER NOT NULL,
      parent_message_id TEXT,
      tools_used TEXT,
      execution_time_ms INTEGER,
      token_count INTEGER,
      model TEXT,
      temperature REAL,
      complexity TEXT,
      quality_score REAL
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT,
      description TEXT,
      is_user_configurable INTEGER DEFAULT 1,
      updated INTEGER NOT NULL
    )`
  ];
  for (const tableSQL of tables) {
    sqlite.exec(tableSQL);
  }
  const indices = [
    "CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id)",
    "CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created)",
    "CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id)",
    "CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp)",
    "CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category)"
  ];
  for (const indexSQL of indices) {
    sqlite.exec(indexSQL);
  }
}
async function initializeDefaultData() {
  try {
    const settingsCount = sqlite.prepare("SELECT COUNT(*) as count FROM settings").get();
    if (settingsCount.count === 0) {
      console.log("\u{1F527} Initializing default settings...");
      const defaultSettings = [
        {
          key: "app.theme",
          value: JSON.stringify("dark"),
          category: "ui",
          description: "Application theme (light/dark)",
          updated: Date.now()
        },
        {
          key: "app.version",
          value: JSON.stringify("1.0.0"),
          category: "system",
          description: "Application version",
          updated: Date.now()
        },
        {
          key: "models.default",
          value: JSON.stringify(""),
          category: "models",
          description: "Default LLM model",
          updated: Date.now()
        },
        {
          key: "performance.max_context_entries",
          value: JSON.stringify(1e3),
          category: "performance",
          description: "Maximum context entries to maintain",
          updated: Date.now()
        },
        {
          key: "ui.show_welcome",
          value: JSON.stringify(true),
          category: "ui",
          description: "Show welcome screen on startup",
          updated: Date.now()
        }
      ];
      const insertSetting = sqlite.prepare(`
        INSERT INTO settings (key, value, category, description, updated)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const setting of defaultSettings) {
        insertSetting.run(
          setting.key,
          setting.value,
          setting.category,
          setting.description,
          setting.updated
        );
      }
      console.log("\u2705 Default settings initialized");
    }
    await initializeDefaultSubjectModes();
  } catch (error) {
    console.error("\u274C Failed to initialize default data:", error);
    throw error;
  }
}
async function initializeDefaultSubjectModes() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS subject_modes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      tools TEXT NOT NULL,
      prompts TEXT,
      system_prompt TEXT,
      is_active INTEGER DEFAULT 1,
      is_built_in INTEGER DEFAULT 0,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      usage_count INTEGER DEFAULT 0,
      color TEXT,
      shortcuts TEXT
    )
  `);
  const modesCount = sqlite.prepare("SELECT COUNT(*) as count FROM subject_modes").get();
  if (modesCount.count === 0) {
    console.log("\u{1F9E0} Initializing default subject modes...");
    const defaultModes = [
      {
        id: v4_default(),
        name: "general",
        displayName: "General",
        description: "General purpose AI assistance",
        icon: "\u{1F4AC}",
        tools: JSON.stringify(["read_file", "write_file", "create_todolist"]),
        systemPrompt: "You are a helpful AI assistant. Be concise, accurate, and helpful.",
        isBuiltIn: 1,
        color: "#6366f1"
      },
      {
        id: v4_default(),
        name: "programming",
        displayName: "Programming",
        description: "Code analysis, debugging, and development assistance",
        icon: "\u{1F4BB}",
        tools: JSON.stringify(["read_file", "write_file", "analyze_code", "generate_tests"]),
        systemPrompt: "You are an expert programmer. Focus on code quality, best practices, and clear explanations.",
        isBuiltIn: 1,
        color: "#10b981"
      },
      {
        id: v4_default(),
        name: "mathematics",
        displayName: "Mathematics",
        description: "Mathematical problem solving and analysis",
        icon: "\u{1F3AF}",
        tools: JSON.stringify(["solve_equation", "plot_function", "read_file", "write_file"]),
        systemPrompt: "You are a mathematics expert. Show step-by-step solutions and use mathematical notation when appropriate.",
        isBuiltIn: 1,
        color: "#f59e0b"
      }
    ];
    const insertMode = sqlite.prepare(`
      INSERT INTO subject_modes (
        id, name, display_name, description, icon, tools, system_prompt, 
        is_built_in, created, updated, color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = Date.now();
    for (const mode of defaultModes) {
      insertMode.run(
        mode.id,
        mode.name,
        mode.displayName,
        mode.description,
        mode.icon,
        mode.tools,
        mode.systemPrompt,
        mode.isBuiltIn,
        now,
        now,
        mode.color
      );
    }
    console.log("\u2705 Default subject modes initialized");
  }
}
function getRawDatabase() {
  if (!sqlite) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return sqlite;
}
function checkDatabaseHealth() {
  try {
    const result = sqlite.prepare("SELECT 1 as test").get();
    const dbSize = sqlite.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get();
    const tableCount = sqlite.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get();
    return {
      isHealthy: true,
      details: {
        testQuery: result,
        databaseSize: dbSize.size,
        tableCount: tableCount.count,
        walMode: sqlite.pragma("journal_mode", { simple: true }),
        foreignKeys: sqlite.pragma("foreign_keys", { simple: true })
      }
    };
  } catch (error) {
    return {
      isHealthy: false,
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}
function closeDatabase() {
  if (sqlite) {
    try {
      sqlite.close();
      console.log("\u{1F4CA} Database connection closed");
    } catch (error) {
      console.error("\u274C Error closing database:", error);
    }
  }
}
import_electron2.app.on("before-quit", () => {
  closeDatabase();
});

// src/ipc/handlers.ts
function setupIPC() {
  console.log("\u{1F50C} Setting up IPC handlers...");
  setupDatabaseHandlers();
  setupAppHandlers();
  setupSettingsHandlers();
  setupChatHandlers();
  setupFileSystemHandlers();
  setupLLMHandlers();
  console.log("\u2705 IPC handlers registered");
}
function setupDatabaseHandlers() {
  import_electron3.ipcMain.handle("db:query", async (event, query, params) => {
    try {
      const db2 = getRawDatabase();
      const queryType = query.trim().toUpperCase().split(" ")[0];
      if (!["SELECT", "INSERT", "UPDATE", "DELETE"].includes(queryType)) {
        throw new Error(`Query type ${queryType} not allowed`);
      }
      if (params) {
        return db2.prepare(query).all(params);
      } else {
        return db2.prepare(query).all();
      }
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("db:health", async () => {
    return checkDatabaseHealth();
  });
}
function setupAppHandlers() {
  import_electron3.ipcMain.handle("app:getVersion", () => {
    return process.env.npm_package_version || "1.0.0";
  });
  import_electron3.ipcMain.handle("app:getPath", async (event, name) => {
    const { app: app4 } = require("electron");
    try {
      return app4.getPath(name);
    } catch (error) {
      console.error(`Failed to get path for ${name}:`, error);
      throw error;
    }
  });
}
function setupSettingsHandlers() {
  import_electron3.ipcMain.handle("settings:get", async (event, key) => {
    try {
      const db2 = getRawDatabase();
      const result = db2.prepare("SELECT value FROM settings WHERE key = ?").get(key);
      if (result) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error(`Failed to get setting ${key}:`, error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("settings:set", async (event, key, value) => {
    try {
      const db2 = getRawDatabase();
      const stmt = db2.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updated)
        VALUES (?, ?, ?)
      `);
      stmt.run(key, JSON.stringify(value), Date.now());
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("settings:getAll", async () => {
    try {
      const db2 = getRawDatabase();
      const results = db2.prepare("SELECT * FROM settings").all();
      return results.map((row) => ({
        ...row,
        value: JSON.parse(row.value)
      }));
    } catch (error) {
      console.error("Failed to get all settings:", error);
      throw error;
    }
  });
}
function setupChatHandlers() {
  import_electron3.ipcMain.handle("chat:createSession", async (event, sessionData) => {
    try {
      const db2 = getRawDatabase();
      const id = v4_default();
      const now = Date.now();
      const stmt = db2.prepare(`
        INSERT INTO chat_sessions (
          id, title, description, created, updated, subject_mode
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        sessionData.title || "New Chat",
        sessionData.description || null,
        now,
        now,
        sessionData.subjectMode || "general"
      );
      return {
        id,
        title: sessionData.title || "New Chat",
        description: sessionData.description || null,
        created: now,
        updated: now,
        subjectMode: sessionData.subjectMode || "general",
        messageCount: 0,
        isArchived: false,
        isFavorite: false
      };
    } catch (error) {
      console.error("Failed to create chat session:", error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("chat:getSession", async (event, sessionId) => {
    try {
      const db2 = getRawDatabase();
      const session = db2.prepare("SELECT * FROM chat_sessions WHERE id = ?").get(sessionId);
      if (!session) {
        throw new Error(`Chat session ${sessionId} not found`);
      }
      return session;
    } catch (error) {
      console.error(`Failed to get chat session ${sessionId}:`, error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("chat:updateSession", async (event, sessionId, updates) => {
    try {
      const db2 = getRawDatabase();
      const updateFields = [];
      const updateValues = [];
      if (updates.title !== void 0) {
        updateFields.push("title = ?");
        updateValues.push(updates.title);
      }
      if (updates.description !== void 0) {
        updateFields.push("description = ?");
        updateValues.push(updates.description);
      }
      if (updates.isArchived !== void 0) {
        updateFields.push("is_archived = ?");
        updateValues.push(updates.isArchived ? 1 : 0);
      }
      if (updates.isFavorite !== void 0) {
        updateFields.push("is_favorite = ?");
        updateValues.push(updates.isFavorite ? 1 : 0);
      }
      if (updateFields.length > 0) {
        updateFields.push("updated = ?");
        updateValues.push(Date.now());
        updateValues.push(sessionId);
        const query = `UPDATE chat_sessions SET ${updateFields.join(", ")} WHERE id = ?`;
        const stmt = db2.prepare(query);
        stmt.run(...updateValues);
      }
      return true;
    } catch (error) {
      console.error(`Failed to update chat session ${sessionId}:`, error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("chat:deleteSession", async (event, sessionId) => {
    try {
      const db2 = getRawDatabase();
      db2.prepare("DELETE FROM chat_sessions WHERE id = ?").run(sessionId);
      return true;
    } catch (error) {
      console.error(`Failed to delete chat session ${sessionId}:`, error);
      throw error;
    }
  });
  import_electron3.ipcMain.handle("chat:listSessions", async () => {
    try {
      const db2 = getRawDatabase();
      const sessions = db2.prepare(`
        SELECT * FROM chat_sessions 
        ORDER BY updated DESC
      `).all();
      return sessions;
    } catch (error) {
      console.error("Failed to list chat sessions:", error);
      throw error;
    }
  });
}
function setupFileSystemHandlers() {
  import_electron3.ipcMain.handle("fs:readFile", async (event, filePath) => {
    console.log(`\u{1F4C1} [Placeholder] Read file: ${filePath}`);
    return null;
  });
  import_electron3.ipcMain.handle("fs:writeFile", async (event, filePath, content) => {
    console.log(`\u{1F4C1} [Placeholder] Write file: ${filePath}`);
    return true;
  });
  import_electron3.ipcMain.handle("fs:exists", async (event, filePath) => {
    console.log(`\u{1F4C1} [Placeholder] Check file exists: ${filePath}`);
    return false;
  });
}
function setupLLMHandlers() {
  import_electron3.ipcMain.handle("ollama:listModels", async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.listModels();
  });
  import_electron3.ipcMain.handle("ollama:getModelCatalog", async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.getModelCatalog();
  });
  import_electron3.ipcMain.handle("ollama:installModel", async (event, modelName) => {
    const services = tanukiApp.getServices();
    return await services.modelManager.installModel(modelName);
  });
  import_electron3.ipcMain.handle("ollama:deleteModel", async (event, modelName) => {
    const services = tanukiApp.getServices();
    return await services.ollama.deleteModel(modelName);
  });
  import_electron3.ipcMain.handle("ollama:generate", async (event, request) => {
    const services = tanukiApp.getServices();
    return await services.ollama.generateWithOptimization(request);
  });
  import_electron3.ipcMain.handle("ollama:checkHealth", async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.checkOllamaHealth();
  });
  import_electron3.ipcMain.handle("ollama:benchmarkModel", async (event, modelName) => {
    const services = tanukiApp.getServices();
    return await services.ollama.benchmarkModel(modelName);
  });
  import_electron3.ipcMain.handle("system:getCapabilities", async () => {
    const services = tanukiApp.getServices();
    return await services.hardwareAssessor.assessSystemCapabilities();
  });
  import_electron3.ipcMain.handle("system:getCurrentMetrics", async () => {
    const services = tanukiApp.getServices();
    return await services.systemMonitor.getCurrentMetrics();
  });
  import_electron3.ipcMain.handle("models:getRecommendations", async () => {
    const services = tanukiApp.getServices();
    return await services.modelManager.getRecommendedModels();
  });
  import_electron3.ipcMain.handle("models:getInstallationStatus", async (event, modelName) => {
    const services = tanukiApp.getServices();
    return services.modelManager.getInstallationStatus(modelName);
  });
  import_electron3.ipcMain.handle("optimization:getProfiles", async () => {
    const services = tanukiApp.getServices();
    return services.optimizationEngine.getAllProfiles();
  });
  import_electron3.ipcMain.handle("optimization:optimizeForHardware", async (event, systemInfo) => {
    const services = tanukiApp.getServices();
    return await services.optimizationEngine.optimizeForHardware(systemInfo);
  });
  import_electron3.ipcMain.handle("parameters:getPreset", async (event, task) => {
    const services = tanukiApp.getServices();
    return services.parameterTuner.getPreset(task);
  });
  import_electron3.ipcMain.handle("parameters:getAllPresets", async () => {
    const services = tanukiApp.getServices();
    return services.parameterTuner.getAllPresets();
  });
  import_electron3.ipcMain.handle("parameters:optimizeForTask", async (event, task, modelName) => {
    const services = tanukiApp.getServices();
    return await services.parameterTuner.optimizeForTask(task, modelName);
  });
  import_electron3.ipcMain.handle("context:store", async (event, sessionId, type, key, value, importance) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.storeContext(sessionId, type, key, value, importance);
  });
  import_electron3.ipcMain.handle("context:retrieve", async (event, sessionId, query, maxResults) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.retrieveRelevantContext(sessionId, query, maxResults);
  });
  import_electron3.ipcMain.handle("context:optimize", async (event, sessionId) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.optimizeContext(sessionId);
  });
}

// src/services/ollama-service.ts
var OllamaService = class {
  baseUrl = "http://localhost:11434";
  performanceCache = /* @__PURE__ */ new Map();
  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return (data.models || []).map((model) => ({
        ...model,
        performance: this.performanceCache.get(model.name)
      }));
    } catch (error) {
      console.error("Failed to list models:", error);
      return [];
    }
  }
  async checkOllamaHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  async generate(request) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    return response.json();
  }
  async getModelCatalog() {
    return [
      {
        name: "qwq:32b",
        displayName: "QwQ-32B",
        description: "Advanced reasoning model with chain-of-thought capabilities",
        size: 19.8,
        parameterCount: "32B",
        specialization: ["reasoning", "mathematics", "analysis"],
        requirements: {
          minRam: 24,
          recommendedRam: 32,
          minVram: 12,
          recommendedVram: 20,
          quantizationOptions: ["Q4_K_M", "Q5_K_M", "Q8_0"]
        },
        estimatedPerformance: {
          tokensPerSecondCPU: 12,
          tokensPerSecondGPU: 28,
          contextLength: 32768
        }
      },
      {
        name: "deepseek-r1-distill-qwen:32b",
        displayName: "DeepSeek R1 Distill Qwen 32B",
        description: "Distilled reasoning model optimized for efficiency",
        size: 14.9,
        parameterCount: "32B",
        specialization: ["reasoning", "coding", "problem-solving"],
        requirements: {
          minRam: 18,
          recommendedRam: 24,
          minVram: 8,
          recommendedVram: 14,
          quantizationOptions: ["Q4_K_M", "Q5_K_M"]
        },
        estimatedPerformance: {
          tokensPerSecondCPU: 10,
          tokensPerSecondGPU: 25,
          contextLength: 32768
        }
      }
    ];
  }
  async pullModelWithOptimization(name, onProgress) {
    await this.setOptimizationFlags();
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, stream: true })
    });
    if (!response.body)
      throw new Error("No response body");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());
      for (const line of lines) {
        try {
          const progress = JSON.parse(line);
          onProgress?.(progress);
        } catch (e) {
        }
      }
    }
    await this.benchmarkModel(name);
  }
  async setOptimizationFlags() {
    process.env.OLLAMA_FLASH_ATTENTION = "1";
    process.env.OLLAMA_KV_CACHE_TYPE = "q8_0";
    process.env.OLLAMA_NUM_PARALLEL = "4";
    process.env.OLLAMA_MAX_LOADED_MODELS = "2";
  }
  async benchmarkModel(modelName) {
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
      const estimatedTokens = response.response?.length / 4 || 100;
      const tokensPerSecond = estimatedTokens / executionTime * 1e3;
      const performance = {
        tokensPerSecond,
        ramUsage: await this.getModelMemoryUsage(modelName),
        cpuUsage: 0,
        lastBenchmark: /* @__PURE__ */ new Date()
      };
      this.performanceCache.set(modelName, performance);
      return performance;
    } catch (error) {
      throw new Error(`Benchmark failed for ${modelName}: ${error}`);
    }
  }
  async generateWithOptimization(request) {
    const optimizedRequest = await this.optimizeRequest(request);
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(optimizedRequest)
    });
    return response.json();
  }
  async optimizeRequest(request) {
    const systemInfo = await this.getSystemInfo();
    return {
      ...request,
      options: {
        ...request.options,
        num_thread: Math.min(systemInfo.cpuCores, 8),
        num_gpu: systemInfo.gpuCount,
        num_ctx: this.calculateOptimalContextLength(request.model, systemInfo),
        f16_kv: systemInfo.availableRam > 16,
        use_mlock: systemInfo.availableRam > 32,
        use_mmap: true
      }
    };
  }
  async getSystemInfo() {
    const os = require("os");
    return {
      cpuCores: os.cpus().length,
      availableRam: Math.round(os.freemem() / 1024 ** 3),
      gpuCount: 0,
      totalVram: 0
    };
  }
  calculateOptimalContextLength(modelName, systemInfo) {
    const baseContext = 2048;
    const maxContext = 32768;
    if (systemInfo.availableRam > 16) {
      return Math.min(maxContext, baseContext * 4);
    } else if (systemInfo.availableRam > 8) {
      return Math.min(maxContext, baseContext * 2);
    }
    return baseContext;
  }
  async getModelMemoryUsage(modelName) {
    const models = await this.listModels();
    const model = models.find((m) => m.name === modelName);
    return model ? model.size * 1.2 : 0;
  }
  async deleteModel(modelName) {
    await fetch(`${this.baseUrl}/api/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName })
    });
    this.performanceCache.delete(modelName);
  }
  getPerformanceMetrics(modelName) {
    return this.performanceCache.get(modelName);
  }
};

// src/services/system-monitor.ts
var SystemMonitor = class {
  metricsCache = /* @__PURE__ */ new Map();
  lastUpdate = 0;
  updateInterval = 5e3;
  // 5 seconds
  async getSystemInfo() {
    const os = require("os");
    const { execSync } = require("child_process");
    const cpus = os.cpus();
    const cpu = {
      brand: this.getCPUBrand(),
      model: cpus[0]?.model || "Unknown",
      cores: cpus.length,
      threads: cpus.length,
      // Simplified
      clockSpeed: cpus[0]?.speed || 0,
      architecture: os.arch(),
      cache: await this.getCPUCache()
    };
    const memory = {
      total: Math.round(os.totalmem() / 1024 ** 3),
      available: Math.round(os.freemem() / 1024 ** 3),
      used: Math.round((os.totalmem() - os.freemem()) / 1024 ** 3),
      type: await this.getMemoryType(),
      speed: await this.getMemorySpeed(),
      slots: await this.getMemorySlots()
    };
    return {
      cpu,
      memory,
      gpu: await this.detectGPUs(),
      storage: await this.getStorageInfo()
    };
  }
  getCPUBrand() {
    const os = require("os");
    const cpus = os.cpus();
    if (cpus[0]?.model.includes("Intel"))
      return "Intel";
    if (cpus[0]?.model.includes("AMD"))
      return "AMD";
    return "Unknown";
  }
  async getCPUCache() {
    return {
      l1d: void 0,
      l1i: void 0,
      l2: void 0,
      l3: void 0
    };
  }
  async getMemoryType() {
    return "DDR4";
  }
  async getMemorySpeed() {
    return void 0;
  }
  async getMemorySlots() {
    return 4;
  }
  async detectGPUs() {
    try {
      const { execSync } = require("child_process");
      if (process.platform === "win32") {
        return await this.detectWindowsGPUs();
      } else if (process.platform === "linux") {
        return await this.detectLinuxGPUs();
      } else if (process.platform === "darwin") {
        return await this.detectMacGPUs();
      }
      return [];
    } catch (error) {
      console.error("GPU detection failed:", error);
      return [];
    }
  }
  async detectWindowsGPUs() {
    try {
      const { execSync } = require("child_process");
      const output = execSync("wmic path win32_VideoController get name,AdapterRAM", { encoding: "utf8" });
      return [];
    } catch (error) {
      return [];
    }
  }
  async detectLinuxGPUs() {
    return [];
  }
  async detectMacGPUs() {
    return [];
  }
  async getStorageInfo() {
    const os = require("os");
    return {
      drives: [{
        name: "Primary Drive",
        type: "SSD",
        size: 500,
        // GB - simplified
        available: 250,
        speed: void 0
      }]
    };
  }
  async getCurrentMetrics() {
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return this.metricsCache.get("current") || this.getDefaultMetrics();
    }
    const metrics = await this.collectMetrics();
    this.metricsCache.set("current", metrics);
    this.lastUpdate = now;
    return metrics;
  }
  async collectMetrics() {
    const os = require("os");
    return {
      cpu: {
        usage: await this.getCPUUsage(),
        temperature: void 0,
        frequency: os.cpus()[0]?.speed || 0
      },
      memory: {
        usage: Math.round((os.totalmem() - os.freemem()) / os.totalmem() * 100),
        available: Math.round(os.freemem() / 1024 ** 3),
        cached: 0
      },
      gpu: [],
      disk: {
        readSpeed: 0,
        writeSpeed: 0,
        usage: 0
      }
    };
  }
  async getCPUUsage() {
    return Math.random() * 100;
  }
  getDefaultMetrics() {
    return {
      cpu: { usage: 0, frequency: 0 },
      memory: { usage: 0, available: 0, cached: 0 },
      gpu: [],
      disk: { readSpeed: 0, writeSpeed: 0, usage: 0 }
    };
  }
};

// src/services/hardware-assessor.ts
var HardwareAssessor = class {
  async assessSystemCapabilities() {
    const os = require("os");
    const cpus = os.cpus();
    const cpu = {
      cores: os.cpus().length,
      threads: os.cpus().length,
      architecture: os.arch(),
      clockSpeed: cpus[0]?.speed || 0,
      brand: cpus[0]?.model || "Unknown"
    };
    const memory = {
      total: Math.round(os.totalmem() / 1024 ** 3),
      available: Math.round(os.freemem() / 1024 ** 3),
      type: "DDR4"
    };
    const gpu = await this.detectGPU();
    const storage = await this.assessStorage();
    return { cpu, memory, gpu, storage };
  }
  async getModelRecommendations(systemCaps, availableModels) {
    return availableModels.map((model) => {
      const compatibility = this.assessCompatibility(model, systemCaps);
      const expectedPerformance = this.predictPerformance(model, systemCaps);
      const optimizations = this.suggestOptimizations(model, systemCaps);
      const warnings = this.generateWarnings(model, systemCaps);
      return {
        model,
        compatibility,
        expectedPerformance,
        optimizations,
        warnings: warnings.length > 0 ? warnings : void 0
      };
    }).sort((a, b) => {
      const compatibilityScore = {
        "perfect": 4,
        "good": 3,
        "marginal": 2,
        "incompatible": 1
      };
      const scoreA = compatibilityScore[a.compatibility] * a.expectedPerformance.tokensPerSecond;
      const scoreB = compatibilityScore[b.compatibility] * b.expectedPerformance.tokensPerSecond;
      return scoreB - scoreA;
    });
  }
  assessCompatibility(model, system) {
    const ramOk = system.memory.available >= model.requirements.minRam;
    const ramGood = system.memory.available >= model.requirements.recommendedRam;
    if (!ramOk)
      return "incompatible";
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      const vramOk = totalVram >= (model.requirements.minVram || 0);
      const vramGood = totalVram >= (model.requirements.recommendedVram || 0);
      if (ramGood && vramGood)
        return "perfect";
      if (ramGood && vramOk)
        return "good";
      if (ramOk)
        return "marginal";
    }
    if (ramGood)
      return "good";
    return "marginal";
  }
  predictPerformance(model, system) {
    let tokensPerSecond = model.estimatedPerformance.tokensPerSecondCPU;
    if (system.gpu && system.gpu.length > 0) {
      const totalVram = system.gpu.reduce((sum, gpu) => sum + gpu.vram, 0);
      if (totalVram >= (model.requirements.recommendedVram || 0)) {
        tokensPerSecond = model.estimatedPerformance.tokensPerSecondGPU || tokensPerSecond * 2;
      }
    }
    const cpuMultiplier = Math.min(system.cpu.cores / 8, 1.5);
    tokensPerSecond *= cpuMultiplier;
    return {
      tokensPerSecond: Math.round(tokensPerSecond),
      ramUsage: model.size * 1.2,
      vramUsage: system.gpu ? model.size * 0.8 : void 0,
      responseTime: 100 / tokensPerSecond * 1e3
    };
  }
  suggestOptimizations(model, system) {
    const suggestions = [];
    if (system.memory.available < model.requirements.recommendedRam) {
      suggestions.push({
        type: "quantization",
        description: "Use Q4_K_M quantization to reduce memory usage",
        impact: "Reduces RAM usage by 60-70% with minimal quality loss"
      });
    }
    if (system.gpu && system.gpu.length > 0) {
      suggestions.push({
        type: "gpu_acceleration",
        description: "Enable GPU acceleration for faster inference",
        impact: "Can improve speed by 2-5x depending on model size"
      });
    }
    suggestions.push({
      type: "context_optimization",
      description: "Optimize context window based on usage patterns",
      impact: "Reduces memory usage and improves response time"
    });
    return suggestions;
  }
  generateWarnings(model, system) {
    const warnings = [];
    if (system.memory.available < model.requirements.minRam) {
      warnings.push("Insufficient RAM - performance will be severely degraded");
    }
    if (!system.gpu || system.gpu.length === 0) {
      warnings.push("No GPU detected - will use CPU-only inference (slower)");
    }
    if (system.storage.type === "HDD") {
      warnings.push("HDD storage detected - SSD recommended for better performance");
    }
    return warnings;
  }
  async detectGPU() {
    try {
      if (process.platform === "win32") {
        return await this.detectWindowsGPU();
      } else if (process.platform === "linux") {
        return await this.detectLinuxGPU();
      }
      return [];
    } catch (error) {
      console.error("GPU detection failed:", error);
      return [];
    }
  }
  async detectWindowsGPU() {
    return [];
  }
  async detectLinuxGPU() {
    return [];
  }
  async assessStorage() {
    return {
      available: 100,
      type: "SSD",
      speed: 500
    };
  }
};

// src/services/model-manager.ts
var ModelManager = class {
  ollamaService;
  hardwareAssessor;
  installations = /* @__PURE__ */ new Map();
  configurations = /* @__PURE__ */ new Map();
  constructor() {
    this.ollamaService = new OllamaService();
    this.hardwareAssessor = new HardwareAssessor();
  }
  async getRecommendedModels() {
    const catalog = await this.ollamaService.getModelCatalog();
    const systemCaps = await this.hardwareAssessor.assessSystemCapabilities();
    return this.hardwareAssessor.getModelRecommendations(systemCaps, catalog);
  }
  async installModel(modelName, onProgress) {
    const installation = {
      modelName,
      status: "downloading",
      progress: 0
    };
    this.installations.set(modelName, installation);
    onProgress?.(installation);
    try {
      await this.ollamaService.pullModelWithOptimization(modelName, (progress) => {
        installation.progress = this.calculateProgress(progress);
        installation.status = progress.status === "success" ? "completed" : "downloading";
        this.installations.set(modelName, installation);
        onProgress?.(installation);
      });
      installation.status = "completed";
      installation.progress = 100;
      this.installations.set(modelName, installation);
      onProgress?.(installation);
    } catch (error) {
      installation.status = "failed";
      installation.error = error.message;
      this.installations.set(modelName, installation);
      onProgress?.(installation);
      throw error;
    }
  }
  async uninstallModel(modelName) {
    try {
      await this.ollamaService.deleteModel(modelName);
      this.installations.delete(modelName);
      this.configurations.delete(modelName);
    } catch (error) {
      throw new Error(`Failed to uninstall model ${modelName}: ${error.message}`);
    }
  }
  calculateProgress(progress) {
    if (progress.completed && progress.total) {
      return Math.round(progress.completed / progress.total * 100);
    }
    return 0;
  }
  getInstallationStatus(modelName) {
    return this.installations.get(modelName);
  }
};

// src/services/optimization-engine.ts
var OptimizationEngine = class {
  profiles = /* @__PURE__ */ new Map();
  activeProfile = "balanced";
  constructor() {
    this.initializeProfiles();
  }
  async optimizeForHardware(systemInfo) {
    if (systemInfo.memory.available > 16 && systemInfo.gpu?.length > 0) {
      return this.profiles.get("performance");
    } else if (systemInfo.memory.available < 8) {
      return this.profiles.get("memory");
    }
    return this.profiles.get("balanced");
  }
  getProfile(name) {
    return this.profiles.get(name);
  }
  getAllProfiles() {
    return Array.from(this.profiles.values());
  }
  setActiveProfile(name) {
    if (this.profiles.has(name)) {
      this.activeProfile = name;
    }
  }
  initializeProfiles() {
    this.profiles.set("performance", {
      name: "Performance",
      description: "Maximum speed, higher memory usage",
      settings: {
        kvCacheType: "f16",
        numParallel: 8,
        maxLoadedModels: 1,
        flashAttention: true,
        memoryMapping: true,
        memoryLocking: true,
        contextLength: 4096,
        batchSize: 512,
        threadCount: -1,
        gpuLayers: -1
      }
    });
    this.profiles.set("memory", {
      name: "Memory Efficient",
      description: "Lower memory usage, moderate speed",
      settings: {
        kvCacheType: "q4_0",
        numParallel: 2,
        maxLoadedModels: 1,
        flashAttention: true,
        memoryMapping: false,
        memoryLocking: false,
        contextLength: 2048,
        batchSize: 128,
        threadCount: 4,
        gpuLayers: 20
      }
    });
    this.profiles.set("balanced", {
      name: "Balanced",
      description: "Good balance of speed and memory usage",
      settings: {
        kvCacheType: "q8_0",
        numParallel: 4,
        maxLoadedModels: 2,
        flashAttention: true,
        memoryMapping: true,
        memoryLocking: false,
        contextLength: 3072,
        batchSize: 256,
        threadCount: 6,
        gpuLayers: 32
      }
    });
  }
  async applyOptimizations(profile) {
    process.env.OLLAMA_KV_CACHE_TYPE = profile.settings.kvCacheType;
    process.env.OLLAMA_NUM_PARALLEL = profile.settings.numParallel.toString();
    process.env.OLLAMA_MAX_LOADED_MODELS = profile.settings.maxLoadedModels.toString();
    process.env.OLLAMA_FLASH_ATTENTION = profile.settings.flashAttention ? "1" : "0";
  }
};

// src/services/parameter-tuner.ts
var ParameterTuner = class {
  presets = /* @__PURE__ */ new Map();
  tuningHistory = [];
  constructor() {
    this.initializePresets();
  }
  getPreset(task) {
    return this.presets.get(task);
  }
  getDefaultParameters() {
    return {
      temperature: 0.5,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
      num_ctx: 2048
    };
  }
  getAllPresets() {
    return new Map(this.presets);
  }
  initializePresets() {
    this.presets.set("coding", {
      temperature: 0.1,
      top_p: 0.95,
      top_k: 40,
      repeat_penalty: 1.1,
      num_ctx: 4096
    });
    this.presets.set("creative", {
      temperature: 0.8,
      top_p: 0.9,
      top_k: 50,
      repeat_penalty: 1.05,
      num_ctx: 2048
    });
    this.presets.set("analytical", {
      temperature: 0.2,
      top_p: 0.9,
      top_k: 30,
      repeat_penalty: 1.15,
      num_ctx: 4096
    });
    this.presets.set("conversational", {
      temperature: 0.7,
      top_p: 0.95,
      top_k: 40,
      repeat_penalty: 1.1,
      num_ctx: 2048
    });
  }
  async generateParameterVariations(base) {
    const variations = [];
    const tempVariations = [base.temperature * 0.8, base.temperature, base.temperature * 1.2];
    const topPVariations = [Math.max(0.1, base.top_p - 0.1), base.top_p, Math.min(1, base.top_p + 0.1)];
    for (const temp of tempVariations) {
      for (const topP of topPVariations) {
        variations.push({
          ...base,
          temperature: Math.max(0.01, Math.min(2, temp)),
          top_p: topP
        });
      }
    }
    return variations;
  }
  async optimizeForTask(task, modelName) {
    const preset = this.getPreset(task) || this.getDefaultParameters();
    return preset;
  }
};

// src/services/context-manager.ts
var ContextManager = class {
  vectorCache = /* @__PURE__ */ new Map();
  mcpContextServer;
  constructor() {
    this.mcpContextServer = {};
  }
  async storeContext(sessionId, type, key, value, importance = 1) {
    const embedding = await this.generateEmbedding(value);
    const entry = {
      id: crypto.randomUUID(),
      sessionId,
      type,
      key,
      value,
      vectorEmbedding: embedding,
      importance,
      lastUsed: /* @__PURE__ */ new Date(),
      created: /* @__PURE__ */ new Date()
    };
    await this.persistContextEntry(entry);
    await this.mcpContextServer.updateContext(sessionId, entry);
  }
  async retrieveRelevantContext(sessionId, query, maxResults = 10) {
    const queryEmbedding = await this.generateEmbedding(query);
    const allEntries = await this.getSessionContext(sessionId);
    const scoredEntries = allEntries.map((entry) => ({
      entry,
      score: this.calculateSimilarity(queryEmbedding, entry.vectorEmbedding || new Float32Array())
    }));
    scoredEntries.sort((a, b) => b.score * b.entry.importance - a.score * a.entry.importance);
    return scoredEntries.slice(0, maxResults).map((item) => item.entry);
  }
  async optimizeContext(sessionId) {
    const entries = await this.getSessionContext(sessionId);
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
    const toRemove = entries.filter(
      (entry) => entry.importance < 0.3 && entry.lastUsed < cutoffDate
    );
    for (const entry of toRemove) {
      await this.removeContextEntry(entry.id);
    }
    await this.compressSimilarEntries(sessionId);
  }
  async generateEmbedding(text2) {
    const hash = this.simpleHash(text2);
    const embedding = new Float32Array(384);
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = Math.sin(hash + i) * 0.1;
    }
    return embedding;
  }
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
  calculateSimilarity(a, b) {
    if (a.length !== b.length)
      return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  async persistContextEntry(entry) {
  }
  async getSessionContext(sessionId) {
    return [];
  }
  async removeContextEntry(entryId) {
  }
  async compressSimilarEntries(sessionId) {
  }
};

// src/main.ts
var TanukiMCPApp = class {
  mainWindow = null;
  isQuitting = false;
  // Phase 2: LLM and Model Management Services
  ollamaService;
  systemMonitor;
  modelManager;
  hardwareAssessor;
  optimizationEngine;
  parameterTuner;
  contextManager;
  constructor() {
    this.setupEventHandlers();
    this.initializeServices();
  }
  initializeServices() {
    console.log("\u{1F527} Initializing Phase 2 services...");
    this.ollamaService = new OllamaService();
    this.systemMonitor = new SystemMonitor();
    this.modelManager = new ModelManager();
    this.hardwareAssessor = new HardwareAssessor();
    this.optimizationEngine = new OptimizationEngine();
    this.parameterTuner = new ParameterTuner();
    this.contextManager = new ContextManager();
    console.log("\u2705 Phase 2 services initialized");
  }
  setupEventHandlers() {
    import_electron4.app.whenReady().then(() => this.onReady());
    import_electron4.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    import_electron4.app.on("activate", this.onActivate.bind(this));
    import_electron4.app.on("before-quit", this.onBeforeQuit.bind(this));
    import_electron4.app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
      if (url.startsWith("http://localhost")) {
        event.preventDefault();
        callback(true);
      } else {
        callback(false);
      }
    });
  }
  async onReady() {
    try {
      console.log("\u{1F680} TanukiMCP Atlas starting...");
      console.log("\u{1F4CA} Initializing database...");
      await initializeDatabase();
      console.log("\u2705 Database initialized");
      console.log("\u{1F50D} Assessing system capabilities...");
      await this.assessSystemCapabilities();
      console.log("\u2705 System assessment complete");
      console.log("\u{1FA9F} Creating main window...");
      this.mainWindow = createWindow();
      console.log("\u{1F50C} Setting up IPC handlers...");
      setupIPC();
      console.log("\u2705 IPC handlers ready");
      await this.loadApplication();
      console.log("\u{1F389} TanukiMCP Atlas ready!");
    } catch (error) {
      console.error("\u274C Failed to initialize TanukiMCP Atlas:", error);
      import_electron4.app.quit();
    }
  }
  async loadApplication() {
    if (!this.mainWindow)
      return;
    if (process.env.NODE_ENV === "development") {
      const devServerUrl = "http://localhost:5173";
      console.log(`\u{1F527} Loading from dev server: ${devServerUrl}`);
      try {
        await this.mainWindow.loadURL(devServerUrl);
        this.mainWindow.webContents.openDevTools();
      } catch (error) {
        console.error("Failed to load dev server, falling back to file:", error);
        await this.loadProductionFile();
      }
    } else {
      await this.loadProductionFile();
    }
  }
  async loadProductionFile() {
    if (!this.mainWindow)
      return;
    const indexPath = import_path3.default.join(__dirname, "../renderer/dist/index.html");
    console.log(`\u{1F4C1} Loading from file: ${indexPath}`);
    await this.mainWindow.loadFile(indexPath);
  }
  onWindowAllClosed() {
    if (process.platform !== "darwin") {
      import_electron4.app.quit();
    }
  }
  onActivate() {
    if (import_electron4.BrowserWindow.getAllWindows().length === 0) {
      this.mainWindow = createWindow();
      this.loadApplication();
    }
  }
  onBeforeQuit() {
    this.isQuitting = true;
  }
  async assessSystemCapabilities() {
    try {
      const ollamaHealthy = await this.ollamaService.checkOllamaHealth();
      if (ollamaHealthy) {
        console.log("\u2705 Ollama service is running");
      } else {
        console.log("\u26A0\uFE0F  Ollama service not detected - model management will be limited");
      }
      const systemCaps = await this.hardwareAssessor.assessSystemCapabilities();
      console.log("\u{1F4BB} System specs:", {
        cpu: systemCaps.cpu.cores + " cores",
        memory: systemCaps.memory.total + "GB RAM",
        gpu: systemCaps.gpu?.length ? systemCaps.gpu.length + " GPU(s)" : "None detected"
      });
      const catalog = await this.ollamaService.getModelCatalog();
      const recommendations = await this.hardwareAssessor.getModelRecommendations(systemCaps, catalog);
      console.log("\u{1F916} Recommended models:", recommendations.slice(0, 3).map((r) => r.model.displayName));
      const optimalProfile = await this.optimizationEngine.optimizeForHardware(systemCaps);
      await this.optimizationEngine.applyOptimizations(optimalProfile);
      console.log("\u26A1 Applied optimization profile:", optimalProfile.name);
    } catch (error) {
      console.error("Failed to assess system capabilities:", error);
    }
  }
  getMainWindow() {
    return this.mainWindow;
  }
  // Expose services for IPC handlers
  getServices() {
    return {
      ollama: this.ollamaService,
      systemMonitor: this.systemMonitor,
      modelManager: this.modelManager,
      hardwareAssessor: this.hardwareAssessor,
      optimizationEngine: this.optimizationEngine,
      parameterTuner: this.parameterTuner,
      contextManager: this.contextManager
    };
  }
};
var tanukiApp = new TanukiMCPApp();
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tanukiApp
});
//# sourceMappingURL=main.js.map
