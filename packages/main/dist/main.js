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
var import_electron11 = require("electron");
var import_path6 = __toESM(require("path"));

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
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    frame: true,
    transparent: false,
    backgroundColor: "#1a1a1a",
    // Dark theme background
    vibrancy: process.platform === "darwin" ? "under-window" : void 0,
    // Security settings
    webPreferences: {
      nodeIntegration: false,
      // Disable node integration in renderer
      contextIsolation: true,
      // Enable context isolation
      sandbox: false,
      // Disable sandbox for better performance
      preload: import_path.default.join(__dirname, "preload.js"),
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
    show: true,
    // Show immediately for debugging
    paintWhenInitiallyHidden: false,
    backgroundThrottling: false,
    // Keep app responsive when in background
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
    const { app: app8 } = require("electron");
    try {
      return app8.getPath(name);
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
  import_electron3.ipcMain.handle("enhancedLLM:processRequest", async (event, request) => {
    const services = tanukiApp.getServices();
    return await services.enhancedLLM.processRequest(request);
  });
  import_electron3.ipcMain.handle("enhancedLLM:getStatus", async (event) => {
    const services = tanukiApp.getServices();
    return services.enhancedLLM.getStatus();
  });
  import_electron3.ipcMain.handle("enhancedLLM:testTier", async (event, tier) => {
    const services = tanukiApp.getServices();
    return await services.enhancedLLM.testTier(tier);
  });
  import_electron3.ipcMain.handle("mcpHub:listServers", async (event) => {
    const services = tanukiApp.getServices();
    return services.mcpHub.listServers();
  });
  import_electron3.ipcMain.handle("mcpHub:connectServer", async (event, serverId) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.connectServer(serverId);
  });
  import_electron3.ipcMain.handle("mcpHub:disconnectServer", async (event, serverId) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.disconnectServer(serverId);
  });
  import_electron3.ipcMain.handle("mcpHub:executeCommand", async (event, serverId, command, params) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.executeCommand(serverId, command, params);
  });
}

// src/services/ollama-service.ts
var OllamaService = class {
  baseUrl = "http://127.0.0.1:11434";
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

// src/services/system-tray.ts
var import_electron4 = require("electron");
var import_path3 = __toESM(require("path"));
var SystemTrayService = class {
  tray = null;
  mainWindow = null;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.createTray();
  }
  createTray() {
    try {
      const iconPath = import_path3.default.join(__dirname, "../../../assets/TanukiMCPLogo.png");
      const trayIcon = import_electron4.nativeImage.createFromPath(iconPath);
      const resizedIcon = trayIcon.resize({ width: 16, height: 16 });
      this.tray = new import_electron4.Tray(resizedIcon);
      this.tray.setToolTip("TanukiMCP Atlas - AI Agentic IDE");
      this.setupTrayMenu();
      this.setupTrayEvents();
      console.log("\u2705 System tray created successfully");
    } catch (error) {
      console.error("\u274C Failed to create system tray:", error);
    }
  }
  setupTrayMenu() {
    if (!this.tray)
      return;
    const contextMenu = import_electron4.Menu.buildFromTemplate([
      {
        label: "TanukiMCP Atlas",
        type: "normal",
        enabled: false
      },
      { type: "separator" },
      {
        label: "Show Atlas",
        type: "normal",
        click: () => this.showMainWindow()
      },
      {
        label: "Hide Atlas",
        type: "normal",
        click: () => this.hideMainWindow()
      },
      { type: "separator" },
      {
        label: "New Project",
        type: "normal",
        accelerator: "CmdOrCtrl+N",
        click: () => this.sendToRenderer("new-project")
      },
      {
        label: "Open Project",
        type: "normal",
        accelerator: "CmdOrCtrl+O",
        click: () => this.sendToRenderer("open-project")
      },
      { type: "separator" },
      {
        label: "AI Chat",
        type: "normal",
        accelerator: "CmdOrCtrl+Shift+C",
        click: () => this.sendToRenderer("focus-chat")
      },
      {
        label: "Command Palette",
        type: "normal",
        accelerator: "CmdOrCtrl+Shift+P",
        click: () => this.sendToRenderer("command-palette")
      },
      { type: "separator" },
      {
        label: "Settings",
        type: "normal",
        click: () => this.sendToRenderer("open-settings")
      },
      {
        label: "About",
        type: "normal",
        click: () => this.sendToRenderer("show-about")
      },
      { type: "separator" },
      {
        label: "Quit Atlas",
        type: "normal",
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
        click: () => {
          import_electron4.app.quit();
        }
      }
    ]);
    this.tray.setContextMenu(contextMenu);
  }
  setupTrayEvents() {
    if (!this.tray || !this.mainWindow)
      return;
    this.tray.on("double-click", () => {
      if (this.mainWindow?.isVisible()) {
        this.hideMainWindow();
      } else {
        this.showMainWindow();
      }
    });
    if (process.platform === "win32") {
      this.tray.on("click", () => {
        if (this.mainWindow?.isVisible()) {
          this.hideMainWindow();
        } else {
          this.showMainWindow();
        }
      });
    }
  }
  showMainWindow() {
    if (!this.mainWindow)
      return;
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    this.mainWindow.show();
    this.mainWindow.focus();
    if (process.platform === "win32") {
      this.mainWindow.setAlwaysOnTop(true);
      this.mainWindow.setAlwaysOnTop(false);
    }
  }
  hideMainWindow() {
    if (!this.mainWindow)
      return;
    this.mainWindow.hide();
  }
  sendToRenderer(action, data) {
    if (!this.mainWindow)
      return;
    this.showMainWindow();
    this.mainWindow.webContents.send("tray-action", { action, data });
  }
  updateTrayMenu() {
    this.setupTrayMenu();
  }
  destroy() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// src/services/native-menu.ts
var import_electron5 = require("electron");
var NativeMenuService = class {
  mainWindow = null;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.createApplicationMenu();
  }
  createApplicationMenu() {
    const template = [
      {
        label: "File",
        submenu: [
          {
            label: "New Project",
            accelerator: "CmdOrCtrl+N",
            click: () => this.sendToRenderer("new-project")
          },
          {
            label: "Open Project",
            accelerator: "CmdOrCtrl+O",
            click: () => this.sendToRenderer("open-project")
          },
          { type: "separator" },
          {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click: () => this.sendToRenderer("save-file")
          },
          {
            label: "Save As...",
            accelerator: "CmdOrCtrl+Shift+S",
            click: () => this.sendToRenderer("save-file-as")
          },
          { type: "separator" },
          {
            label: "Exit",
            accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
            click: () => import_electron5.app.quit()
          }
        ]
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectall" },
          { type: "separator" },
          {
            label: "Find",
            accelerator: "CmdOrCtrl+F",
            click: () => this.sendToRenderer("find")
          },
          {
            label: "Replace",
            accelerator: "CmdOrCtrl+H",
            click: () => this.sendToRenderer("replace")
          }
        ]
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
          { type: "separator" },
          {
            label: "Command Palette",
            accelerator: "CmdOrCtrl+Shift+P",
            click: () => this.sendToRenderer("command-palette")
          }
        ]
      },
      {
        label: "AI",
        submenu: [
          {
            label: "Open Chat",
            accelerator: "CmdOrCtrl+Shift+C",
            click: () => this.sendToRenderer("focus-chat")
          },
          {
            label: "New Agent",
            accelerator: "CmdOrCtrl+Shift+A",
            click: () => this.sendToRenderer("new-agent")
          },
          {
            label: "Workflow Builder",
            accelerator: "CmdOrCtrl+Shift+W",
            click: () => this.sendToRenderer("workflow-builder")
          }
        ]
      },
      {
        label: "Tools",
        submenu: [
          {
            label: "MCP Servers",
            click: () => this.sendToRenderer("mcp-servers")
          },
          {
            label: "Model Manager",
            click: () => this.sendToRenderer("model-manager")
          },
          { type: "separator" },
          {
            label: "Settings",
            accelerator: "CmdOrCtrl+,",
            click: () => this.sendToRenderer("open-settings")
          }
        ]
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Documentation",
            click: () => import_electron5.shell.openExternal("https://tanukimcp.com/docs")
          },
          {
            label: "Community",
            click: () => import_electron5.shell.openExternal("https://github.com/TanukiMCP/atlas")
          },
          { type: "separator" },
          {
            label: "About TanukiMCP Atlas",
            click: () => this.sendToRenderer("show-about")
          }
        ]
      }
    ];
    const menu = import_electron5.Menu.buildFromTemplate(template);
    import_electron5.Menu.setApplicationMenu(menu);
  }
  sendToRenderer(action, data) {
    if (!this.mainWindow)
      return;
    this.mainWindow.webContents.send("menu-action", { action, data });
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// src/services/auto-updater.ts
var import_electron_updater = require("electron-updater");
var import_electron6 = require("electron");
var AutoUpdaterService = class {
  mainWindow = null;
  updateAvailable = false;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }
  setupAutoUpdater() {
    import_electron_updater.autoUpdater.autoDownload = false;
    import_electron_updater.autoUpdater.autoInstallOnAppQuit = true;
    import_electron_updater.autoUpdater.on("checking-for-update", () => {
      console.log("\u{1F50D} Checking for updates...");
      this.sendToRenderer("update-checking");
    });
    import_electron_updater.autoUpdater.on("update-available", (info) => {
      console.log("\u{1F4E6} Update available:", info.version);
      this.updateAvailable = true;
      this.showUpdateAvailableNotification(info);
      this.sendToRenderer("update-available", info);
    });
    import_electron_updater.autoUpdater.on("update-not-available", (info) => {
      console.log("\u2705 No updates available");
      this.sendToRenderer("update-not-available", info);
    });
    import_electron_updater.autoUpdater.on("error", (err) => {
      console.error("\u274C Update error:", err);
      this.sendToRenderer("update-error", err.message);
    });
    import_electron_updater.autoUpdater.on("download-progress", (progressObj) => {
      const message = `Downloaded ${progressObj.percent.toFixed(1)}%`;
      console.log("\u{1F4E5}", message);
      this.sendToRenderer("update-download-progress", progressObj);
    });
    import_electron_updater.autoUpdater.on("update-downloaded", (info) => {
      console.log("\u2705 Update downloaded:", info.version);
      this.showUpdateReadyNotification(info);
      this.sendToRenderer("update-downloaded", info);
    });
  }
  showUpdateAvailableNotification(info) {
    if (import_electron6.Notification.isSupported()) {
      const notification = new import_electron6.Notification({
        title: "TanukiMCP Atlas Update Available",
        body: `Version ${info.version} is available. Click to download.`,
        icon: require("path").join(__dirname, "../../../assets/TanukiMCPLogo.png")
      });
      notification.on("click", () => {
        this.downloadUpdate();
      });
      notification.show();
    }
  }
  showUpdateReadyNotification(info) {
    if (import_electron6.Notification.isSupported()) {
      const notification = new import_electron6.Notification({
        title: "TanukiMCP Atlas Update Ready",
        body: `Version ${info.version} has been downloaded. Restart to apply.`,
        icon: require("path").join(__dirname, "../../../assets/TanukiMCPLogo.png")
      });
      notification.on("click", () => {
        this.installUpdate();
      });
      notification.show();
    }
  }
  async checkForUpdates() {
    try {
      await import_electron_updater.autoUpdater.checkForUpdates();
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  }
  async downloadUpdate() {
    try {
      await import_electron_updater.autoUpdater.downloadUpdate();
    } catch (error) {
      console.error("Failed to download update:", error);
    }
  }
  installUpdate() {
    import_electron_updater.autoUpdater.quitAndInstall();
  }
  sendToRenderer(action, data) {
    if (!this.mainWindow)
      return;
    this.mainWindow.webContents.send("updater-action", { action, data });
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// src/services/notification-service.ts
var import_electron7 = require("electron");
var import_path4 = __toESM(require("path"));
var NotificationService = class {
  mainWindow = null;
  defaultIcon;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.defaultIcon = import_path4.default.join(__dirname, "../../../assets/TanukiMCPLogo.png");
  }
  showNotification(options) {
    if (!import_electron7.Notification.isSupported()) {
      console.warn("Notifications not supported on this platform");
      return;
    }
    const notification = new import_electron7.Notification({
      title: options.title,
      body: options.body,
      icon: options.icon || this.defaultIcon,
      silent: options.silent || false
    });
    if (options.onClick) {
      notification.on("click", options.onClick);
    }
    notification.show();
  }
  showBuildComplete(projectName) {
    this.showNotification({
      title: "Build Complete",
      body: `${projectName} has been built successfully`,
      onClick: () => this.focusMainWindow()
    });
  }
  showError(title, message) {
    this.showNotification({
      title: `Error: ${title}`,
      body: message,
      onClick: () => this.focusMainWindow()
    });
  }
  focusMainWindow() {
    if (!this.mainWindow)
      return;
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    this.mainWindow.show();
    this.mainWindow.focus();
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// src/services/crash-reporter.ts
var import_electron8 = require("electron");
var import_fs = require("fs");
var import_path5 = require("path");
var import_electron9 = require("electron");
var CrashReporterService = class {
  mainWindow = null;
  crashLogDir;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.crashLogDir = (0, import_path5.join)(import_electron9.app.getPath("userData"), "crash-logs");
    this.setupCrashReporter();
  }
  setupCrashReporter() {
    if (!(0, import_fs.existsSync)(this.crashLogDir)) {
      (0, import_fs.mkdirSync)(this.crashLogDir, { recursive: true });
    }
    import_electron8.crashReporter.start({
      productName: "TanukiMCP Atlas",
      companyName: "TanukiMCP",
      submitURL: "",
      uploadToServer: false,
      ignoreSystemCrashHandler: false,
      rateLimit: true,
      compress: true
    });
    console.log("\u2705 Crash reporter initialized");
  }
  logCrash(error, context) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const crashLog = {
      timestamp,
      context: context || "Unknown",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        appVersion: import_electron9.app.getVersion()
      }
    };
    const logFile = (0, import_path5.join)(this.crashLogDir, `crash-${Date.now()}.json`);
    try {
      (0, import_fs.writeFileSync)(logFile, JSON.stringify(crashLog, null, 2));
      console.log("\u{1F4A5} Crash logged to:", logFile);
    } catch (writeError) {
      console.error("Failed to write crash log:", writeError);
    }
  }
  async showCrashDialog(error) {
    const result = await import_electron8.dialog.showMessageBox(this.mainWindow, {
      type: "error",
      title: "Application Error",
      message: "TanukiMCP Atlas encountered an unexpected error",
      detail: `${error.message}

The error has been logged for debugging.`,
      buttons: ["Restart", "Close", "Report Issue"],
      defaultId: 0,
      cancelId: 1
    });
    switch (result.response) {
      case 0:
        import_electron9.app.relaunch();
        import_electron9.app.exit();
        break;
      case 2:
        require("electron").shell.openExternal("https://github.com/TanukiMCP/atlas/issues");
        break;
    }
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// src/services/protocol-handler.ts
var import_electron10 = require("electron");
var ProtocolHandlerService = class {
  mainWindow = null;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupProtocolHandler();
  }
  setupProtocolHandler() {
    if (!import_electron10.app.isDefaultProtocolClient("tanukimcp")) {
      import_electron10.app.setAsDefaultProtocolClient("tanukimcp");
    }
    import_electron10.app.on("second-instance", (event, commandLine, workingDirectory) => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore();
        }
        this.mainWindow.focus();
      }
      const url = commandLine.find((arg) => arg.startsWith("tanukimcp://"));
      if (url) {
        this.handleProtocolUrl(url);
      }
    });
    import_electron10.app.on("open-url", (event, url) => {
      event.preventDefault();
      this.handleProtocolUrl(url);
    });
    console.log("\u2705 Protocol handler registered for tanukimcp://");
  }
  handleProtocolUrl(url) {
    console.log("\u{1F517} Handling protocol URL:", url);
    try {
      const parsedUrl = new URL(url);
      const action = parsedUrl.hostname;
      const params = Object.fromEntries(parsedUrl.searchParams);
      this.focusMainWindow();
      this.sendToRenderer("protocol-action", { action, params, url });
    } catch (error) {
      console.error("Failed to parse protocol URL:", error);
    }
  }
  focusMainWindow() {
    if (!this.mainWindow)
      return;
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    this.mainWindow.show();
    this.mainWindow.focus();
  }
  sendToRenderer(action, data) {
    if (!this.mainWindow)
      return;
    this.mainWindow.webContents.send("protocol-action", { action, data });
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
};

// ../llm-enhanced/src/router/complexityAssessor.ts
var ComplexityAssessor = class {
  assess(request) {
    const query = request.query.toLowerCase();
    if (query.includes("thank you") || query.includes("yes") || query.includes("no")) {
      return {
        complexity: "DIRECT_RESPONSE" /* DIRECT_RESPONSE */,
        estimatedTimeMs: 2e3,
        reasoning: "Simple acknowledgement or affirmative/negative."
      };
    }
    if (query.split(" ").length < 10 && !query.includes("clear-thought")) {
      return {
        complexity: "ATOMIC" /* ATOMIC */,
        estimatedTimeMs: 1e4,
        reasoning: "Short query, likely a single step."
      };
    }
    if (query.includes("clear-thought") || query.includes("analyze") || query.includes("plan")) {
      return {
        complexity: "COMPLEX" /* COMPLEX */,
        estimatedTimeMs: 18e4,
        // 3 minutes
        reasoning: "Query indicates need for advanced reasoning or clear-thought tools."
      };
    }
    return {
      complexity: "MODERATE" /* MODERATE */,
      estimatedTimeMs: 3e4,
      reasoning: "Defaulting to moderate complexity."
    };
  }
};

// ../llm-enhanced/src/router/tier1Processor.ts
var Tier1Processor = class {
  async process(request) {
    let content = "Acknowledged.";
    if (request.query.toLowerCase().includes("thank you")) {
      content = "You are welcome!";
    }
    return {
      requestId: request.id,
      tierUsed: "DIRECT_RESPONSE" /* DIRECT_RESPONSE */,
      content,
      metrics: { processingTimeMs: 50 + Math.random() * 100 }
      // Simulate fast processing
    };
  }
};

// ../llm-enhanced/src/router/tier2Processor.ts
var Tier2Processor = class {
  llmService;
  constructor(llmService2) {
    this.llmService = llmService2;
  }
  async process(request) {
    const startTime = Date.now();
    try {
      const prompt = `You are a helpful AI assistant. Please provide a clear, concise response to the following query:

${request.query}

Keep your response focused and direct.`;
      const content = await this.llmService.generate(prompt, {
        temperature: 0.3,
        // Lower temperature for more focused responses
        top_p: 0.8,
        top_k: 30
      });
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: "ATOMIC" /* ATOMIC */,
        content,
        qualityScore: 0.8,
        // Good quality for atomic responses
        metrics: {
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          tokensEstimate: Math.ceil(content.length / 4)
          // Rough token estimate
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: "ATOMIC" /* ATOMIC */,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
        metrics: {
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }
};

// ../llm-enhanced/src/router/tier3Processor.ts
var Tier3Processor = class {
  llmService;
  constructor(llmService2) {
    this.llmService = llmService2;
  }
  async process(request) {
    const startTime = Date.now();
    try {
      const shouldUseSequentialThinking = this.shouldUseSequentialThinking(request.query);
      const shouldUseMentalModel = this.shouldUseMentalModel(request.query);
      let content = "";
      let toolsUsed = [];
      if (shouldUseSequentialThinking) {
        const thinkingResult = await this.useSequentialThinking(request.query);
        if (thinkingResult.success) {
          content += `**Structured Analysis:**
${thinkingResult.content}

`;
          toolsUsed.push("sequential-thinking");
        }
      }
      if (shouldUseMentalModel) {
        const mentalModelResult = await this.useMentalModel(request.query);
        if (mentalModelResult.success) {
          content += `**Mental Model Analysis:**
${mentalModelResult.content}

`;
          toolsUsed.push("mental-model");
        }
      }
      const finalPrompt = `You are an expert assistant. Based on the following analysis and the original query, provide a comprehensive response.

${content ? `Previous Analysis:
${content}` : ""}

Original Query: ${request.query}

Please provide a well-structured, thoughtful response that builds upon any analysis provided above.`;
      const llmResponse = await this.llmService.generate(finalPrompt, {
        temperature: 0.6,
        top_p: 0.9,
        top_k: 40
      });
      content += `**Final Response:**
${llmResponse}`;
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: "MODERATE" /* MODERATE */,
        content,
        qualityScore: 0.85,
        metrics: {
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          toolsUsed,
          tokensEstimate: Math.ceil(content.length / 4)
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: "MODERATE" /* MODERATE */,
        content: "I encountered an error while processing your request with enhanced reasoning tools. Let me provide a direct response instead.",
        error: error instanceof Error ? error.message : "Unknown error",
        metrics: {
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }
  shouldUseSequentialThinking(query) {
    const indicators = [
      "step by step",
      "analyze",
      "break down",
      "process",
      "methodology",
      "approach",
      "strategy",
      "plan",
      "solve",
      "problem"
    ];
    const lowerQuery = query.toLowerCase();
    return indicators.some((indicator) => lowerQuery.includes(indicator));
  }
  shouldUseMentalModel(query) {
    const indicators = [
      "first principles",
      "fundamental",
      "root cause",
      "why",
      "principle",
      "framework",
      "model",
      "theory",
      "concept",
      "understand"
    ];
    const lowerQuery = query.toLowerCase();
    return indicators.some((indicator) => lowerQuery.includes(indicator));
  }
  async useSequentialThinking(query) {
    const toolCall = {
      name: "sequentialthinking",
      arguments: {
        thought: `I need to analyze this query systematically: ${query}`,
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  async useMentalModel(query) {
    let modelName = "first_principles";
    if (query.toLowerCase().includes("decision") || query.toLowerCase().includes("choose")) {
      modelName = "opportunity_cost";
    } else if (query.toLowerCase().includes("simple") || query.toLowerCase().includes("complex")) {
      modelName = "occams_razor";
    }
    const toolCall = {
      name: "mentalmodel",
      arguments: {
        modelName,
        problem: query
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
};

// ../llm-enhanced/src/router/tier4Processor.ts
var Tier4Processor = class {
  llmService;
  constructor(llmService2) {
    this.llmService = llmService2;
  }
  async process(request) {
    const startTime = Date.now();
    try {
      const analysisResults = await this.performComprehensiveAnalysis(request.query);
      const finalPrompt = this.buildExpertPrompt(request.query, analysisResults);
      const expertResponse = await this.llmService.generate(finalPrompt, {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 50
      });
      const content = this.formatExpertResponse(analysisResults, expertResponse);
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: request.query.toLowerCase().includes("expert") ? "EXPERT" /* EXPERT */ : "COMPLEX" /* COMPLEX */,
        content,
        qualityScore: 0.95,
        metrics: {
          processingTimeMs: processingTime,
          modelUsed: this.llmService.getCurrentModel(),
          toolsUsed: analysisResults.toolsUsed,
          analysisDepth: "comprehensive",
          tokensEstimate: Math.ceil(content.length / 4)
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        requestId: request.id,
        tierUsed: "COMPLEX" /* COMPLEX */,
        content: "I encountered an error during comprehensive analysis. Let me provide a detailed response based on available information.",
        error: error instanceof Error ? error.message : "Unknown error",
        metrics: {
          processingTimeMs: processingTime,
          failed: true
        }
      };
    }
  }
  async performComprehensiveAnalysis(query) {
    const results = {
      sequentialThinking: null,
      mentalModel: null,
      designPattern: null,
      scientificMethod: null,
      collaborativeReasoning: null,
      toolsUsed: []
    };
    try {
      const thinkingResult = await this.useSequentialThinking(query);
      if (thinkingResult.success) {
        results.sequentialThinking = thinkingResult;
        results.toolsUsed.push("sequential-thinking");
      }
    } catch (error) {
      console.warn("Sequential thinking failed:", error);
    }
    try {
      const mentalModelResult = await this.useMentalModel(query);
      if (mentalModelResult.success) {
        results.mentalModel = mentalModelResult;
        results.toolsUsed.push("mental-model");
      }
    } catch (error) {
      console.warn("Mental model analysis failed:", error);
    }
    if (this.isDesignRelated(query)) {
      try {
        const designResult = await this.useDesignPattern(query);
        if (designResult.success) {
          results.designPattern = designResult;
          results.toolsUsed.push("design-pattern");
        }
      } catch (error) {
        console.warn("Design pattern analysis failed:", error);
      }
    }
    if (this.isScientificInquiry(query)) {
      try {
        const scientificResult = await this.useScientificMethod(query);
        if (scientificResult.success) {
          results.scientificMethod = scientificResult;
          results.toolsUsed.push("scientific-method");
        }
      } catch (error) {
        console.warn("Scientific method analysis failed:", error);
      }
    }
    if (this.requiresMultiplePerspectives(query)) {
      try {
        const collaborativeResult = await this.useCollaborativeReasoning(query);
        if (collaborativeResult.success) {
          results.collaborativeReasoning = collaborativeResult;
          results.toolsUsed.push("collaborative-reasoning");
        }
      } catch (error) {
        console.warn("Collaborative reasoning failed:", error);
      }
    }
    return results;
  }
  buildExpertPrompt(query, analysisResults) {
    let prompt = `You are an expert AI assistant with access to comprehensive analytical tools. Based on the following multi-faceted analysis, provide an authoritative, well-structured response.

Original Query: ${query}

`;
    if (analysisResults.sequentialThinking) {
      prompt += `**Structured Analysis:**
${analysisResults.sequentialThinking.content}

`;
    }
    if (analysisResults.mentalModel) {
      prompt += `**Mental Model Framework:**
${analysisResults.mentalModel.content}

`;
    }
    if (analysisResults.designPattern) {
      prompt += `**Design Pattern Analysis:**
${analysisResults.designPattern.content}

`;
    }
    if (analysisResults.scientificMethod) {
      prompt += `**Scientific Method Application:**
${analysisResults.scientificMethod.content}

`;
    }
    if (analysisResults.collaborativeReasoning) {
      prompt += `**Multi-Perspective Analysis:**
${analysisResults.collaborativeReasoning.content}

`;
    }
    prompt += `Please synthesize all the above analyses into a comprehensive, expert-level response that addresses the original query with depth, nuance, and practical insights.`;
    return prompt;
  }
  formatExpertResponse(analysisResults, expertResponse) {
    let content = "# Expert Analysis\n\n";
    if (analysisResults.toolsUsed.length > 0) {
      content += `*Analysis conducted using: ${analysisResults.toolsUsed.join(", ")}*

`;
    }
    content += expertResponse;
    if (analysisResults.toolsUsed.length > 1) {
      content += "\n\n---\n\n## Analytical Framework Summary\n\n";
      if (analysisResults.sequentialThinking) {
        content += "**Structured Thinking:** Applied systematic reasoning process\n";
      }
      if (analysisResults.mentalModel) {
        content += "**Mental Models:** Leveraged cognitive frameworks for deeper understanding\n";
      }
      if (analysisResults.designPattern) {
        content += "**Design Patterns:** Applied proven architectural solutions\n";
      }
      if (analysisResults.scientificMethod) {
        content += "**Scientific Method:** Used hypothesis-driven analysis\n";
      }
      if (analysisResults.collaborativeReasoning) {
        content += "**Multi-Perspective Analysis:** Considered diverse viewpoints\n";
      }
    }
    return content;
  }
  async useSequentialThinking(query) {
    const toolCall = {
      name: "sequentialthinking",
      arguments: {
        thought: `I need to perform a comprehensive analysis of this complex query: ${query}`,
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  async useMentalModel(query) {
    let modelName = "first_principles";
    if (query.toLowerCase().includes("decision") || query.toLowerCase().includes("choose")) {
      modelName = "opportunity_cost";
    } else if (query.toLowerCase().includes("error") || query.toLowerCase().includes("debug")) {
      modelName = "error_propagation";
    } else if (query.toLowerCase().includes("priority") || query.toLowerCase().includes("important")) {
      modelName = "pareto_principle";
    }
    const toolCall = {
      name: "mentalmodel",
      arguments: {
        modelName,
        problem: query
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  async useDesignPattern(query) {
    let patternName = "modular_architecture";
    if (query.toLowerCase().includes("api") || query.toLowerCase().includes("integration")) {
      patternName = "api_integration";
    } else if (query.toLowerCase().includes("state") || query.toLowerCase().includes("data")) {
      patternName = "state_management";
    } else if (query.toLowerCase().includes("async") || query.toLowerCase().includes("concurrent")) {
      patternName = "async_processing";
    } else if (query.toLowerCase().includes("scale") || query.toLowerCase().includes("performance")) {
      patternName = "scalability";
    } else if (query.toLowerCase().includes("security") || query.toLowerCase().includes("auth")) {
      patternName = "security";
    }
    const toolCall = {
      name: "designpattern",
      arguments: {
        patternName,
        context: query
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  async useScientificMethod(query) {
    const toolCall = {
      name: "scientificmethod",
      arguments: {
        stage: "observation",
        observation: query,
        inquiryId: `inquiry_${Date.now()}`,
        iteration: 0,
        nextStageNeeded: true
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  async useCollaborativeReasoning(query) {
    const toolCall = {
      name: "collaborativereasoning",
      arguments: {
        topic: query,
        personas: [
          {
            id: "analyst",
            name: "Systems Analyst",
            expertise: ["systems thinking", "analysis", "problem solving"],
            background: "Expert in breaking down complex problems",
            perspective: "Analytical and methodical",
            biases: ["over-analysis"],
            communication: { style: "structured", tone: "professional" }
          },
          {
            id: "creative",
            name: "Creative Strategist",
            expertise: ["innovation", "creative thinking", "ideation"],
            background: "Specialist in novel approaches and solutions",
            perspective: "Creative and unconventional",
            biases: ["novelty bias"],
            communication: { style: "inspirational", tone: "enthusiastic" }
          }
        ],
        contributions: [],
        stage: "problem-definition",
        activePersonaId: "analyst",
        sessionId: `session_${Date.now()}`,
        iteration: 0,
        nextContributionNeeded: true
      }
    };
    return await this.llmService.executeMCPTool(toolCall);
  }
  isDesignRelated(query) {
    const designKeywords = [
      "architecture",
      "design",
      "pattern",
      "structure",
      "system",
      "api",
      "interface",
      "module",
      "component",
      "framework"
    ];
    const lowerQuery = query.toLowerCase();
    return designKeywords.some((keyword) => lowerQuery.includes(keyword));
  }
  isScientificInquiry(query) {
    const scientificKeywords = [
      "hypothesis",
      "test",
      "experiment",
      "research",
      "study",
      "evidence",
      "prove",
      "validate",
      "investigate",
      "analyze"
    ];
    const lowerQuery = query.toLowerCase();
    return scientificKeywords.some((keyword) => lowerQuery.includes(keyword));
  }
  requiresMultiplePerspectives(query) {
    const complexityIndicators = [
      "complex",
      "complicated",
      "multifaceted",
      "various",
      "different",
      "perspective",
      "viewpoint",
      "opinion",
      "debate",
      "controversial"
    ];
    const lowerQuery = query.toLowerCase();
    return complexityIndicators.some((indicator) => lowerQuery.includes(indicator)) || query.length > 200;
  }
};

// ../llm-enhanced/src/router/router.ts
var LLMRouter = class {
  complexityAssessor;
  tier1Processor;
  tier2Processor;
  tier3Processor;
  tier4Processor;
  llmService;
  constructor(llmService2) {
    this.llmService = llmService2;
    this.complexityAssessor = new ComplexityAssessor();
    this.tier1Processor = new Tier1Processor();
    this.tier2Processor = new Tier2Processor(llmService2);
    this.tier3Processor = new Tier3Processor(llmService2);
    this.tier4Processor = new Tier4Processor(llmService2);
  }
  async routeRequest(request) {
    try {
      const assessment = this.complexityAssessor.assess(request);
      const processor = this.getProcessor(assessment.complexity);
      const response = await processor.process(request);
      response.metrics = {
        ...response.metrics,
        complexityAssessment: assessment,
        routingDecision: assessment.complexity,
        estimatedTimeMs: assessment.estimatedTimeMs
      };
      return response;
    } catch (error) {
      return {
        requestId: request.id,
        tierUsed: "ATOMIC" /* ATOMIC */,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        error: error instanceof Error ? error.message : "Unknown routing error",
        metrics: {
          failed: true,
          routingError: true
        }
      };
    }
  }
  getProcessor(complexity) {
    switch (complexity) {
      case "DIRECT_RESPONSE" /* DIRECT_RESPONSE */:
        return this.tier1Processor;
      case "ATOMIC" /* ATOMIC */:
        return this.tier2Processor;
      case "MODERATE" /* MODERATE */:
        return this.tier3Processor;
      case "COMPLEX" /* COMPLEX */:
      case "EXPERT" /* EXPERT */:
        return this.tier4Processor;
      default:
        return this.tier2Processor;
    }
  }
  async getRouterStatus() {
    const isHealthy = await this.llmService.isHealthy();
    const isMCPConnected = this.llmService.isMCPConnected();
    return {
      healthy: isHealthy,
      mcpConnected: isMCPConnected,
      currentModel: this.llmService.getCurrentModel(),
      availableModels: await this.llmService.getAvailableModels(),
      availableMCPTools: await this.llmService.getAvailableMCPTools(),
      tiers: {
        tier1: "Direct Response",
        tier2: "Atomic (Basic LLM)",
        tier3: "Moderate (LLM + Clear-Thought)",
        tier4: "Complex/Expert (Full Analysis)"
      }
    };
  }
  async testComplexityAssessment(query) {
    const request = {
      id: `test_${Date.now()}`,
      query,
      userId: "test_user",
      timestamp: Date.now()
    };
    const assessment = this.complexityAssessor.assess(request);
    return {
      query,
      assessment,
      selectedTier: assessment.complexity,
      processor: this.getProcessor(assessment.complexity).constructor.name
    };
  }
};

// ../llm-enhanced/src/services/llm-service.ts
var LLMService = class {
  defaultModel;
  mcpClient = null;
  ollamaService = null;
  constructor(config = {}) {
    this.defaultModel = config.defaultModel || "llama3.1:latest";
  }
  setOllamaService(service) {
    this.ollamaService = service;
  }
  async initialize() {
    if (!this.ollamaService) {
      throw new Error("Ollama service not configured");
    }
    await this.ollamaService.checkHealth();
    const models = await this.ollamaService.getModels();
    if (models.length > 0) {
      const availableModel = models.find((m) => m.name === this.defaultModel) || models[0];
      this.ollamaService.setModel(availableModel.name);
    }
  }
  setMCPClient(client) {
    this.mcpClient = client;
  }
  async generate(prompt, options = {}) {
    if (!this.ollamaService) {
      throw new Error("Ollama service not configured");
    }
    const messages = [
      { role: "user", content: prompt }
    ];
    const response = await this.ollamaService.chat(messages, {
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9,
      top_k: options.top_k || 40,
      repeat_penalty: options.repeat_penalty || 1.1
    });
    return response.message.content;
  }
  async generateWithMessages(messages, options = {}) {
    if (!this.ollamaService) {
      throw new Error("Ollama service not configured");
    }
    return await this.ollamaService.chat(messages, {
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9,
      top_k: options.top_k || 40,
      repeat_penalty: options.repeat_penalty || 1.1
    });
  }
  async executeMCPTool(toolCall) {
    if (!this.mcpClient) {
      return {
        success: false,
        error: "MCP client not configured"
      };
    }
    return await this.mcpClient.executeToolCall(toolCall);
  }
  async isHealthy() {
    if (!this.ollamaService) {
      return false;
    }
    const health = await this.ollamaService.checkHealth();
    return health.isConnected;
  }
  getCurrentModel() {
    if (!this.ollamaService) {
      return "";
    }
    return this.ollamaService.getCurrentModel();
  }
  async getAvailableModels() {
    if (!this.ollamaService) {
      return [];
    }
    const models = await this.ollamaService.getModels();
    return models.map((m) => m.name);
  }
  setModel(modelName) {
    if (!this.ollamaService) {
      throw new Error("Ollama service not configured");
    }
    this.ollamaService.setModel(modelName);
  }
  isMCPConnected() {
    return this.mcpClient?.isConnected() || false;
  }
  async getAvailableMCPTools() {
    if (!this.mcpClient) {
      return [];
    }
    return await this.mcpClient.getAvailableTools();
  }
};
var llmService = new LLMService();

// ../llm-enhanced/src/services/mcp-client-adapter.ts
var MCPClientAdapter = class {
  mcpHubService = null;
  setMCPHubService(service) {
    this.mcpHubService = service;
  }
  async executeToolCall(toolCall) {
    if (!this.mcpHubService) {
      return {
        success: false,
        error: "MCP hub service not configured"
      };
    }
    try {
      const result = await this.mcpHubService.executeTool(toolCall.name, toolCall.arguments);
      return {
        success: true,
        content: typeof result === "string" ? result : JSON.stringify(result),
        metadata: { toolName: toolCall.name }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: { toolName: toolCall.name }
      };
    }
  }
  isConnected() {
    return this.mcpHubService !== null;
  }
  async getAvailableTools() {
    if (!this.mcpHubService) {
      return [];
    }
    try {
      const tools = await this.mcpHubService.getAvailableTools();
      return tools.map((tool) => tool.name || tool.id);
    } catch (error) {
      console.error("Failed to get available MCP tools:", error);
      return [];
    }
  }
};
var mcpClientAdapter = new MCPClientAdapter();

// ../llm-enhanced/src/enhanced-llm-service.ts
var EnhancedLLMService = class {
  router;
  llmService;
  isInitialized = false;
  constructor(config = {}) {
    this.llmService = new LLMService(config);
    this.router = new LLMRouter(this.llmService);
  }
  async initialize(ollamaService, mcpHubService) {
    try {
      this.llmService.setOllamaService(ollamaService);
      if (mcpHubService) {
        mcpClientAdapter.setMCPHubService(mcpHubService);
        this.llmService.setMCPClient(mcpClientAdapter);
      }
      await this.llmService.initialize();
      this.isInitialized = true;
      console.log("Enhanced LLM Service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Enhanced LLM Service:", error);
      throw error;
    }
  }
  async generateResponse(query, userId = "default", metadata) {
    if (!this.isInitialized) {
      throw new Error("Enhanced LLM Service not initialized. Call initialize() first.");
    }
    const request = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      userId,
      timestamp: Date.now(),
      metadata
    };
    return await this.router.routeRequest(request);
  }
  async getStatus() {
    if (!this.isInitialized) {
      return {
        initialized: false,
        error: "Service not initialized"
      };
    }
    const routerStatus = await this.router.getRouterStatus();
    return {
      initialized: true,
      ...routerStatus
    };
  }
  async testComplexityAssessment(query) {
    if (!this.isInitialized) {
      throw new Error("Enhanced LLM Service not initialized");
    }
    return await this.router.testComplexityAssessment(query);
  }
  // Direct access to basic LLM functionality for backward compatibility
  async generateBasic(prompt, options) {
    if (!this.isInitialized) {
      throw new Error("Enhanced LLM Service not initialized");
    }
    return await this.llmService.generate(prompt, options);
  }
  isReady() {
    return this.isInitialized;
  }
  getCurrentModel() {
    return this.llmService.getCurrentModel();
  }
  async setModel(modelName) {
    this.llmService.setModel(modelName);
  }
};
var enhancedLLMService = new EnhancedLLMService();

// ../mcp-hub/src/client-hub.ts
var import_events3 = require("events");

// ../mcp-hub/src/transports/stdio-transport.ts
var import_child_process = require("child_process");

// ../mcp-hub/src/transports/base-transport.ts
var import_events = require("events");
var BaseTransport = class extends import_events.EventEmitter {
  config;
  connected = false;
  reconnectTimer;
  connectionId;
  constructor(config) {
    super();
    this.config = config;
  }
  isConnected() {
    return this.connected;
  }
  getConfig() {
    return this.config;
  }
  handleConnect() {
    this.connected = true;
    this.emit("connect");
  }
  handleDisconnect() {
    this.connected = false;
    this.emit("disconnect");
  }
  handleMessage(message) {
    this.emit("message", message);
  }
  handleError(error) {
    this.emit("error", error);
  }
  scheduleReconnect(delay = 5e3) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        this.handleError(error);
        this.scheduleReconnect(delay * 2);
      }
    }, delay);
  }
  destroy() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.removeAllListeners();
  }
};

// ../mcp-hub/src/transports/stdio-transport.ts
var StdioTransport = class extends BaseTransport {
  childProcess;
  messageBuffer = "";
  constructor(config) {
    super(config);
  }
  async connect() {
    if (this.connected || this.childProcess) {
      await this.disconnect();
    }
    const config = this.config;
    try {
      this.childProcess = (0, import_child_process.spawn)(config.command, config.args || [], {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, ...config.env },
        cwd: config.cwd || process.cwd()
      });
      this.setupChildProcessHandlers();
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 1e4);
        this.childProcess.on("spawn", () => {
          clearTimeout(timeout);
          this.handleConnect();
          resolve();
        });
        this.childProcess.on("error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(`Failed to start MCP server: ${error}`);
    }
  }
  async disconnect() {
    if (this.childProcess) {
      this.childProcess.kill("SIGTERM");
      setTimeout(() => {
        if (this.childProcess && !this.childProcess.killed) {
          this.childProcess.kill("SIGKILL");
        }
      }, 5e3);
      this.childProcess = void 0;
    }
    this.handleDisconnect();
  }
  async send(message) {
    if (!this.childProcess || !this.connected) {
      throw new Error("Transport not connected");
    }
    const jsonMessage = JSON.stringify(message) + "\n";
    return new Promise((resolve, reject) => {
      this.childProcess.stdin.write(jsonMessage, "utf8", (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  setupChildProcessHandlers() {
    if (!this.childProcess)
      return;
    this.childProcess.stdout.on("data", (data) => {
      this.messageBuffer += data.toString("utf8");
      this.processMessages();
    });
    this.childProcess.stderr.on("data", (data) => {
      console.warn(`MCP Server stderr: ${data.toString("utf8")}`);
    });
    this.childProcess.on("exit", (code, signal) => {
      console.log(`MCP Server exited with code ${code}, signal ${signal}`);
      this.handleDisconnect();
      const config = this.config;
      if (code !== 0 && !signal) {
        this.scheduleReconnect();
      }
    });
    this.childProcess.on("error", (error) => {
      console.error("MCP Server process error:", error);
      this.handleError(error);
    });
  }
  processMessages() {
    const lines = this.messageBuffer.split("\n");
    this.messageBuffer = lines.pop() || "";
    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line);
          this.handleMessage(message);
        } catch (error) {
          console.warn("Failed to parse JSON message:", line, error);
        }
      }
    }
  }
  destroy() {
    this.disconnect();
    super.destroy();
  }
};

// ../mcp-hub/src/transports/sse-transport.ts
var SSETransport = class extends BaseTransport {
  eventSource;
  sessionId;
  baseUrl;
  headers;
  constructor(config) {
    super(config);
    this.baseUrl = config.url;
    this.headers = config.headers || {};
  }
  async connect() {
    if (this.connected || this.eventSource) {
      await this.disconnect();
    }
    const config = this.config;
    try {
      const response = await fetch(`${this.baseUrl}/sse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers
        },
        body: JSON.stringify({
          method: "initialize",
          params: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: true,
              resources: true,
              prompts: true
            },
            clientInfo: {
              name: "TanukiMCP Atlas",
              version: "1.0.0"
            }
          }
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const initResult = await response.json();
      this.sessionId = initResult.sessionId;
      const sseUrl = `${this.baseUrl}/sse/${this.sessionId}`;
      this.eventSource = new EventSource(sseUrl);
      this.setupEventSourceHandlers();
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("SSE connection timeout"));
        }, config.timeout || 1e4);
        this.eventSource.addEventListener("open", () => {
          clearTimeout(timeout);
          this.handleConnect();
          resolve();
        });
        this.eventSource.addEventListener("error", (event) => {
          clearTimeout(timeout);
          reject(new Error("SSE connection failed"));
        });
      });
    } catch (error) {
      throw new Error(`Failed to connect to MCP server via SSE: ${error}`);
    }
  }
  async disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = void 0;
    }
    if (this.sessionId) {
      try {
        await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
          method: "DELETE",
          headers: this.headers
        });
      } catch (error) {
        console.warn("Failed to notify server of disconnection:", error);
      }
      this.sessionId = void 0;
    }
    this.handleDisconnect();
  }
  async send(message) {
    if (!this.sessionId || !this.connected) {
      throw new Error("Transport not connected");
    }
    const response = await fetch(`${this.baseUrl}/sse/${this.sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers
      },
      body: JSON.stringify(message)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  setupEventSourceHandlers() {
    if (!this.eventSource)
      return;
    this.eventSource.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.warn("Failed to parse SSE message:", event.data, error);
      }
    });
    this.eventSource.addEventListener("error", (event) => {
      console.error("SSE connection error:", event);
      this.handleError(new Error("SSE connection error"));
      this.scheduleReconnect();
    });
    this.eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data);
        this.handleMessage(notification);
      } catch (error) {
        console.warn("Failed to parse SSE notification:", event.data, error);
      }
    });
    this.eventSource.addEventListener("progress", (event) => {
      try {
        const progress = JSON.parse(event.data);
        this.handleMessage(progress);
      } catch (error) {
        console.warn("Failed to parse SSE progress:", event.data, error);
      }
    });
  }
  destroy() {
    this.disconnect();
    super.destroy();
  }
};

// ../mcp-hub/src/transports/websocket-transport.ts
var WebSocketTransport = class extends BaseTransport {
  webSocket;
  pingInterval;
  pongTimeout;
  constructor(config) {
    super(config);
  }
  async connect() {
    if (this.connected || this.webSocket) {
      await this.disconnect();
    }
    const config = this.config;
    try {
      this.webSocket = new WebSocket(config.url, config.protocols);
      this.setupWebSocketHandlers();
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
        }, 1e4);
        this.webSocket.addEventListener("open", () => {
          clearTimeout(timeout);
          this.handleConnect();
          this.startHeartbeat();
          resolve();
        });
        this.webSocket.addEventListener("error", (event) => {
          clearTimeout(timeout);
          reject(new Error(`WebSocket connection failed: ${event.message || "Unknown error"}`));
        });
      });
    } catch (error) {
      throw new Error(`Failed to connect to MCP server via WebSocket: ${error}`);
    }
  }
  async disconnect() {
    this.stopHeartbeat();
    if (this.webSocket) {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.close(1e3, "Normal closure");
      }
      this.webSocket = void 0;
    }
    this.handleDisconnect();
  }
  async send(message) {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    const jsonMessage = JSON.stringify(message);
    this.webSocket.send(jsonMessage);
  }
  setupWebSocketHandlers() {
    if (!this.webSocket)
      return;
    this.webSocket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.method === "pong") {
          this.handlePong();
          return;
        }
        this.handleMessage(message);
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", event.data, error);
      }
    });
    this.webSocket.addEventListener("close", (event) => {
      console.log(`WebSocket closed: ${event.code} ${event.reason}`);
      this.handleDisconnect();
      if (event.code !== 1e3 && event.code !== 1001) {
        this.scheduleReconnect();
      }
    });
    this.webSocket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
      this.handleError(new Error(`WebSocket error: ${event.message || "Unknown error"}`));
    });
  }
  startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.send({ method: "ping", id: Date.now() });
        this.pongTimeout = setTimeout(() => {
          console.warn("WebSocket ping timeout - reconnecting");
          this.scheduleReconnect();
        }, 1e4);
      }
    }, 3e4);
  }
  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = void 0;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = void 0;
    }
  }
  handlePong() {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = void 0;
    }
  }
  destroy() {
    this.stopHeartbeat();
    this.disconnect();
    super.destroy();
  }
};

// ../mcp-hub/src/transports/transport-factory.ts
var TransportFactory = class {
  static create(config) {
    switch (config.type) {
      case "stdio":
        return new StdioTransport(config);
      case "sse":
        return new SSETransport(config);
      case "websocket":
        return new WebSocketTransport(config);
      default:
        throw new Error(`Unsupported transport type: ${config.type}`);
    }
  }
  static validateConfig(config) {
    if (!config.type) {
      throw new Error("Transport type is required");
    }
    switch (config.type) {
      case "stdio":
        this.validateStdioConfig(config);
        break;
      case "sse":
        this.validateSSEConfig(config);
        break;
      case "websocket":
        this.validateWebSocketConfig(config);
        break;
      default:
        throw new Error(`Unsupported transport type: ${config.type}`);
    }
  }
  static validateStdioConfig(config) {
    if (!config.command) {
      throw new Error("Stdio transport requires a command");
    }
    if (typeof config.command !== "string") {
      throw new Error("Stdio transport command must be a string");
    }
    if (config.args && !Array.isArray(config.args)) {
      throw new Error("Stdio transport args must be an array");
    }
    if (config.env && typeof config.env !== "object") {
      throw new Error("Stdio transport env must be an object");
    }
  }
  static validateSSEConfig(config) {
    if (!config.url) {
      throw new Error("SSE transport requires a URL");
    }
    if (typeof config.url !== "string") {
      throw new Error("SSE transport URL must be a string");
    }
    try {
      new URL(config.url);
    } catch (error) {
      throw new Error(`SSE transport URL is invalid: ${config.url}`);
    }
    if (config.headers && typeof config.headers !== "object") {
      throw new Error("SSE transport headers must be an object");
    }
    if (config.timeout && typeof config.timeout !== "number") {
      throw new Error("SSE transport timeout must be a number");
    }
  }
  static validateWebSocketConfig(config) {
    if (!config.url) {
      throw new Error("WebSocket transport requires a URL");
    }
    if (typeof config.url !== "string") {
      throw new Error("WebSocket transport URL must be a string");
    }
    try {
      const url = new URL(config.url);
      if (!["ws:", "wss:"].includes(url.protocol)) {
        throw new Error("WebSocket URL must use ws:// or wss:// protocol");
      }
    } catch (error) {
      throw new Error(`WebSocket transport URL is invalid: ${config.url}`);
    }
    if (config.protocols && !Array.isArray(config.protocols)) {
      throw new Error("WebSocket transport protocols must be an array");
    }
    if (config.headers && typeof config.headers !== "object") {
      throw new Error("WebSocket transport headers must be an object");
    }
  }
  static getSupportedTransports() {
    return ["stdio", "sse", "websocket"];
  }
  static getTransportDescription(type) {
    switch (type) {
      case "stdio":
        return "Child process with stdin/stdout communication (local servers)";
      case "sse":
        return "Server-Sent Events over HTTP (web-based servers)";
      case "websocket":
        return "WebSocket bidirectional communication (real-time servers)";
      default:
        return "Unknown transport type";
    }
  }
  static getDefaultConfig(type) {
    switch (type) {
      case "stdio":
        return {
          type: "stdio",
          command: "",
          args: [],
          env: {}
        };
      case "sse":
        return {
          type: "sse",
          url: "",
          headers: {},
          timeout: 3e4
        };
      case "websocket":
        return {
          type: "websocket",
          url: "",
          protocols: [],
          headers: {}
        };
      default:
        throw new Error(`No default config for transport type: ${type}`);
    }
  }
};

// ../mcp-hub/src/health/health-monitor.ts
var import_events2 = require("events");
var HealthMonitor = class extends import_events2.EventEmitter {
  serverHealth = /* @__PURE__ */ new Map();
  healthCheckIntervals = /* @__PURE__ */ new Map();
  responseTimers = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  startMonitoring(serverId, config) {
    const health = {
      serverId,
      status: "connecting",
      lastSeen: /* @__PURE__ */ new Date(),
      responseTime: 0,
      errorCount: 0,
      connectionAttempts: 0,
      toolCount: 0,
      uptime: 0
    };
    this.serverHealth.set(serverId, health);
    const interval = setInterval(() => {
      this.performHealthCheck(serverId);
    }, config.healthCheckInterval);
    this.healthCheckIntervals.set(serverId, interval);
  }
  stopMonitoring(serverId) {
    const interval = this.healthCheckIntervals.get(serverId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(serverId);
    }
    this.serverHealth.delete(serverId);
    this.responseTimers.delete(serverId);
  }
  updateServerStatus(serverId, status, error) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return;
    const wasUnhealthy = this.isUnhealthy(health);
    health.status = status;
    health.lastSeen = /* @__PURE__ */ new Date();
    if (error) {
      health.lastError = error;
      health.errorCount++;
    }
    if (status === "connected") {
      health.connectionAttempts = 0;
      const now = Date.now();
      health.uptime = now;
    } else if (status === "connecting") {
      health.connectionAttempts++;
    }
    this.serverHealth.set(serverId, health);
    this.emit("health:updated", serverId, health);
    const isNowUnhealthy = this.isUnhealthy(health);
    if (!wasUnhealthy && isNowUnhealthy) {
      this.emit("server:unhealthy", serverId, health);
    } else if (wasUnhealthy && !isNowUnhealthy) {
      this.emit("server:recovered", serverId, health);
    }
  }
  recordRequestStart(serverId, messageId) {
    this.responseTimers.set(serverId, {
      start: Date.now(),
      messageId
    });
  }
  recordRequestEnd(serverId, messageId, success) {
    const timer = this.responseTimers.get(serverId);
    if (!timer || timer.messageId !== messageId)
      return;
    const responseTime = Date.now() - timer.start;
    this.responseTimers.delete(serverId);
    const health = this.serverHealth.get(serverId);
    if (!health)
      return;
    if (health.responseTime === 0) {
      health.responseTime = responseTime;
    } else {
      health.responseTime = health.responseTime * 0.8 + responseTime * 0.2;
    }
    if (!success) {
      health.errorCount++;
    }
    health.lastSeen = /* @__PURE__ */ new Date();
    this.serverHealth.set(serverId, health);
    this.emit("health:updated", serverId, health);
  }
  updateToolCount(serverId, count) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return;
    health.toolCount = count;
    this.serverHealth.set(serverId, health);
    this.emit("health:updated", serverId, health);
  }
  updateCapabilities(serverId, capabilities) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return;
    health.capabilities = capabilities;
    this.serverHealth.set(serverId, health);
    this.emit("health:updated", serverId, health);
  }
  getServerHealth(serverId) {
    return this.serverHealth.get(serverId) || null;
  }
  getAllServerHealth() {
    return new Map(this.serverHealth);
  }
  generateHealthReport() {
    const servers = {};
    let connectedServers = 0;
    let totalTools = 0;
    let externalTools = 0;
    for (const [serverId, health] of this.serverHealth) {
      servers[serverId] = health;
      if (health.status === "connected") {
        connectedServers++;
      }
      totalTools += health.toolCount;
      externalTools += health.toolCount;
    }
    return {
      generated: /* @__PURE__ */ new Date(),
      servers,
      totalServers: this.serverHealth.size,
      connectedServers,
      totalTools,
      builtinTools: 0,
      // Will be updated by the main hub
      externalTools
    };
  }
  async performHealthCheck(serverId) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return;
    const now = /* @__PURE__ */ new Date();
    const timeSinceLastSeen = now.getTime() - health.lastSeen.getTime();
    if (timeSinceLastSeen > 12e4 && health.status === "connected") {
      this.updateServerStatus(serverId, "error", "Health check timeout");
    }
  }
  isUnhealthy(health) {
    return health.status === "error" || health.status === "disconnected" || health.errorCount > 10 || health.responseTime > 3e4;
  }
  // Utility methods for health analysis
  getHealthScore(serverId) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return 0;
    let score = 100;
    score -= Math.min(health.errorCount * 2, 50);
    if (health.responseTime > 1e3) {
      score -= Math.min((health.responseTime - 1e3) / 100, 30);
    }
    if (health.status !== "connected") {
      score -= 40;
    }
    score -= Math.min(health.connectionAttempts * 5, 20);
    return Math.max(score, 0);
  }
  getServerMetrics(serverId) {
    const health = this.serverHealth.get(serverId);
    if (!health)
      return null;
    const healthScore = this.getHealthScore(serverId);
    const totalTime = Date.now() - (health.uptime || Date.now());
    const availability = totalTime > 0 ? health.uptime / totalTime * 100 : 0;
    const errorRate = health.errorCount > 0 ? health.errorCount / (health.errorCount + 100) * 100 : 0;
    return {
      healthScore,
      availability,
      averageResponseTime: health.responseTime,
      errorRate
    };
  }
  destroy() {
    for (const interval of this.healthCheckIntervals.values()) {
      clearInterval(interval);
    }
    this.healthCheckIntervals.clear();
    this.serverHealth.clear();
    this.responseTimers.clear();
    this.removeAllListeners();
  }
};

// ../mcp-hub/src/client-hub.ts
var MCPClientHub = class extends import_events3.EventEmitter {
  connections = /* @__PURE__ */ new Map();
  configs = /* @__PURE__ */ new Map();
  healthMonitor;
  toolCache = /* @__PURE__ */ new Map();
  conflictResolutions = /* @__PURE__ */ new Map();
  pendingRequests = /* @__PURE__ */ new Map();
  isInitialized = false;
  constructor() {
    super();
    this.healthMonitor = new HealthMonitor();
    this.setupHealthMonitorListeners();
  }
  async initialize() {
    if (this.isInitialized)
      return;
    console.log("Initializing MCP Client Hub...");
    await this.loadSavedConfigurations();
    await this.autoConnectServers();
    this.isInitialized = true;
    console.log("MCP Client Hub initialized");
  }
  async addServer(config) {
    console.log(`Adding MCP server: ${config.name} (${config.id})`);
    TransportFactory.validateConfig(config.transport);
    this.configs.set(config.id, config);
    await this.saveConfiguration(config);
    await this.connectServer(config.id);
  }
  async removeServer(serverId) {
    console.log(`Removing MCP server: ${serverId}`);
    await this.disconnectServer(serverId);
    this.configs.delete(serverId);
    this.connections.delete(serverId);
    this.toolCache.delete(serverId);
    this.healthMonitor.stopMonitoring(serverId);
    await this.removeStoredConfiguration(serverId);
    this.emit("server:removed", serverId);
  }
  async connectServer(serverId) {
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }
    console.log(`Connecting to MCP server: ${config.name}`);
    if (this.connections.has(serverId)) {
      await this.disconnectServer(serverId);
    }
    try {
      const transport = TransportFactory.create(config.transport);
      this.setupTransportHandlers(serverId, transport);
      const connection = {
        id: serverId,
        config,
        transport,
        tools: [],
        lastToolSync: /* @__PURE__ */ new Date(),
        messageQueue: [],
        connected: false
      };
      this.connections.set(serverId, connection);
      this.healthMonitor.startMonitoring(serverId, config);
      this.healthMonitor.updateServerStatus(serverId, "connecting");
      await transport.connect();
      await this.initializeMCPSession(serverId);
      console.log(`Successfully connected to MCP server: ${config.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to connect to MCP server ${config.name}:`, error);
      this.healthMonitor.updateServerStatus(serverId, "error", errorMessage);
      if (config.autoRestart) {
        setTimeout(() => {
          this.reconnectServer(serverId);
        }, config.retryDelay);
      }
      throw error;
    }
  }
  async disconnectServer(serverId) {
    const connection = this.connections.get(serverId);
    if (!connection)
      return;
    console.log(`Disconnecting from MCP server: ${connection.config.name}`);
    try {
      await connection.transport.disconnect();
    } catch (error) {
      console.warn(`Error disconnecting from ${serverId}:`, error);
    }
    connection.connected = false;
    this.healthMonitor.updateServerStatus(serverId, "disconnected");
    this.emit("server:disconnected", serverId, "Manual disconnect");
  }
  async reconnectServer(serverId) {
    console.log(`Reconnecting to MCP server: ${serverId}`);
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }
    await this.disconnectServer(serverId);
    await this.connectServer(serverId);
  }
  async executeToolCall(toolCall, context) {
    const messageId = v4_default();
    const { serverId, tool } = this.findToolProvider(toolCall.name);
    if (serverId === "builtin") {
      throw new Error("Built-in tool execution not implemented in hub");
    }
    const connection = this.connections.get(serverId);
    if (!connection || !connection.connected) {
      throw new Error(`Server ${serverId} is not connected`);
    }
    try {
      this.healthMonitor.recordRequestStart(serverId, messageId);
      const mcpRequest = {
        jsonrpc: "2.0",
        id: messageId,
        method: "tools/call",
        params: {
          name: toolCall.name,
          arguments: toolCall.arguments
        }
      };
      const result = await this.sendRequestAndWaitForResponse(serverId, mcpRequest, context.timeoutMs);
      this.healthMonitor.recordRequestEnd(serverId, messageId, true);
      this.updateToolMetrics(serverId, toolCall.name, true);
      this.emit("tool:executed", toolCall.name, serverId, Date.now() - context.timestamp.getTime(), true);
      return this.formatToolResult(result);
    } catch (error) {
      this.healthMonitor.recordRequestEnd(serverId, messageId, false);
      this.updateToolMetrics(serverId, toolCall.name, false);
      this.emit("tool:failed", toolCall.name, serverId, error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      return await this.handleToolExecutionError(errorObj, toolCall, context);
    }
  }
  async getAllAvailableTools() {
    const tools = [];
    const sources = ["builtin"];
    const categories = /* @__PURE__ */ new Set();
    const conflicts = [];
    const builtinTools = await this.getBuiltinTools();
    tools.push(...builtinTools);
    builtinTools.forEach((tool) => categories.add(tool.category));
    for (const [serverId, connection] of this.connections) {
      if (connection.connected && connection.tools.length > 0) {
        sources.push(serverId);
        tools.push(...connection.tools);
        connection.tools.forEach((tool) => categories.add(tool.category));
      }
    }
    const toolsByName = /* @__PURE__ */ new Map();
    for (const tool of tools) {
      if (!toolsByName.has(tool.name)) {
        toolsByName.set(tool.name, []);
      }
      toolsByName.get(tool.name).push(tool);
    }
    for (const [toolName, toolVersions] of toolsByName) {
      if (toolVersions.length > 1) {
        const conflict = {
          toolName,
          sources: toolVersions.map((t) => t.source),
          resolution: "prefer_builtin",
          // Default resolution
          selectedSource: toolVersions.find((t) => t.source === "builtin")?.source || toolVersions[0].source
        };
        conflicts.push(conflict);
        this.conflictResolutions.set(toolName, conflict);
      }
    }
    const catalog = {
      tools,
      lastUpdated: /* @__PURE__ */ new Date(),
      sources,
      categories: Array.from(categories),
      totalTools: tools.length,
      conflicts
    };
    this.emit("catalog:updated", catalog);
    return catalog;
  }
  async resolveToolConflicts() {
    return Array.from(this.conflictResolutions.values());
  }
  async getHealthReport() {
    const report = this.healthMonitor.generateHealthReport();
    const builtinTools = await this.getBuiltinTools();
    report.builtinTools = builtinTools.length;
    report.totalTools = report.externalTools + report.builtinTools;
    this.emit("health:updated", report);
    return report;
  }
  async getServerStatus(serverId) {
    return this.healthMonitor.getServerHealth(serverId);
  }
  async testServer(serverId) {
    const connection = this.connections.get(serverId);
    if (!connection)
      return false;
    try {
      const pingRequest = {
        jsonrpc: "2.0",
        id: v4_default(),
        method: "ping"
      };
      await this.sendRequestAndWaitForResponse(serverId, pingRequest, 5e3);
      return true;
    } catch (error) {
      return false;
    }
  }
  // Configuration management
  async updateServerConfig(serverId, updates) {
    const config = this.configs.get(serverId);
    if (!config) {
      throw new Error(`Server configuration not found: ${serverId}`);
    }
    const updatedConfig = { ...config, ...updates };
    this.configs.set(serverId, updatedConfig);
    await this.saveConfiguration(updatedConfig);
    if (updates.transport) {
      await this.reconnectServer(serverId);
    }
  }
  async getServerConfig(serverId) {
    return this.configs.get(serverId) || null;
  }
  async listServers() {
    return Array.from(this.configs.values());
  }
  async exportConfiguration() {
    const configs = Array.from(this.configs.values());
    return JSON.stringify(configs, null, 2);
  }
  async importConfiguration(configJson) {
    const configs = JSON.parse(configJson);
    for (const config of configs) {
      await this.addServer(config);
    }
  }
  async shutdown() {
    console.log("Shutting down MCP Client Hub...");
    const disconnectPromises = Array.from(this.connections.keys()).map(
      (serverId) => this.disconnectServer(serverId)
    );
    await Promise.all(disconnectPromises);
    this.healthMonitor.destroy();
    this.connections.clear();
    this.configs.clear();
    this.toolCache.clear();
    this.conflictResolutions.clear();
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Hub shutting down"));
    }
    this.pendingRequests.clear();
    this.removeAllListeners();
    this.isInitialized = false;
    console.log("MCP Client Hub shutdown complete");
  }
  // Private helper methods
  setupTransportHandlers(serverId, transport) {
    transport.on("connect", () => {
      const connection = this.connections.get(serverId);
      if (connection) {
        connection.connected = true;
        this.healthMonitor.updateServerStatus(serverId, "connected");
        this.emit("server:connected", serverId);
      }
    });
    transport.on("disconnect", () => {
      const connection = this.connections.get(serverId);
      if (connection) {
        connection.connected = false;
        this.healthMonitor.updateServerStatus(serverId, "disconnected");
        this.emit("server:disconnected", serverId, "Transport disconnected");
      }
    });
    transport.on("message", (message) => {
      this.handleIncomingMessage(serverId, message);
    });
    transport.on("error", (error) => {
      this.healthMonitor.updateServerStatus(serverId, "error", error.message);
      this.emit("server:error", serverId, error);
    });
  }
  async initializeMCPSession(serverId) {
    const initRequest = {
      jsonrpc: "2.0",
      id: v4_default(),
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: true,
          resources: true,
          prompts: true
        },
        clientInfo: {
          name: "TanukiMCP Atlas",
          version: "1.0.0"
        }
      }
    };
    const response = await this.sendRequestAndWaitForResponse(serverId, initRequest, 1e4);
    this.healthMonitor.updateCapabilities(serverId, response.capabilities || {
      tools: true,
      resources: true,
      prompts: true
    });
    await this.syncServerTools(serverId);
  }
  async syncServerTools(serverId) {
    const connection = this.connections.get(serverId);
    if (!connection)
      return;
    try {
      const toolsRequest = {
        jsonrpc: "2.0",
        id: v4_default(),
        method: "tools/list"
      };
      const response = await this.sendRequestAndWaitForResponse(serverId, toolsRequest, 1e4);
      const tools = (response.tools || []).map((tool) => ({
        ...tool,
        source: serverId,
        reliability: "medium",
        latency: "network",
        category: this.categorizeToolName(tool.name),
        tags: this.extractToolTags(tool),
        usageCount: 0,
        averageExecutionTime: 0,
        successRate: 100
      }));
      connection.tools = tools;
      connection.lastToolSync = /* @__PURE__ */ new Date();
      this.toolCache.set(serverId, tools);
      this.healthMonitor.updateToolCount(serverId, tools.length);
      console.log(`Synced ${tools.length} tools from ${connection.config.name}`);
    } catch (error) {
      console.error(`Failed to sync tools from ${serverId}:`, error);
    }
  }
  async sendRequestAndWaitForResponse(serverId, request, timeoutMs) {
    const connection = this.connections.get(serverId);
    if (!connection || !connection.connected) {
      throw new Error(`Server ${serverId} is not connected`);
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error(`Request timeout: ${request.method}`));
      }, timeoutMs);
      this.pendingRequests.set(request.id, { resolve, reject, timeout });
      connection.transport.send(request).catch((error) => {
        this.pendingRequests.delete(request.id);
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
  handleIncomingMessage(serverId, message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);
      clearTimeout(pending.timeout);
      if (message.error) {
        pending.reject(new Error(message.error.message || "MCP error"));
      } else {
        pending.resolve(message.result);
      }
    }
  }
  findToolProvider(toolName) {
    const conflict = this.conflictResolutions.get(toolName);
    if (conflict && conflict.selectedSource) {
      const serverId = conflict.selectedSource;
      const tools = this.toolCache.get(serverId) || [];
      const tool = tools.find((t) => t.name === toolName);
      if (tool) {
        return { serverId, tool };
      }
    }
    for (const [serverId, tools] of this.toolCache) {
      const tool = tools.find((t) => t.name === toolName);
      if (tool) {
        return { serverId, tool };
      }
    }
    throw new Error(`Tool not found: ${toolName}`);
  }
  async handleToolExecutionError(error, toolCall, context) {
    return {
      content: [{
        type: "text",
        text: `Tool execution failed: ${error.message}`
      }],
      isError: true
    };
  }
  formatToolResult(result) {
    if (result.content) {
      return result;
    }
    return {
      content: [{
        type: "text",
        text: typeof result === "string" ? result : JSON.stringify(result)
      }]
    };
  }
  setupHealthMonitorListeners() {
    this.healthMonitor.on("server:unhealthy", (serverId, health) => {
      console.warn(`Server ${serverId} is unhealthy:`, health);
    });
    this.healthMonitor.on("server:recovered", (serverId, health) => {
      console.log(`Server ${serverId} has recovered:`, health);
    });
  }
  // Stub methods for integration points
  async getBuiltinTools() {
    return [];
  }
  categorizeToolName(toolName) {
    if (toolName.includes("file") || toolName.includes("read") || toolName.includes("write")) {
      return "file-operations";
    }
    if (toolName.includes("search") || toolName.includes("find")) {
      return "search";
    }
    if (toolName.includes("create") || toolName.includes("generate")) {
      return "generation";
    }
    return "general";
  }
  extractToolTags(tool) {
    const tags = [];
    if (tool.description) {
      if (tool.description.includes("file"))
        tags.push("file");
      if (tool.description.includes("search"))
        tags.push("search");
      if (tool.description.includes("create"))
        tags.push("create");
    }
    return tags;
  }
  updateToolMetrics(serverId, toolName, success) {
    const tools = this.toolCache.get(serverId) || [];
    const tool = tools.find((t) => t.name === toolName);
    if (tool) {
      tool.usageCount++;
      if (success) {
        tool.successRate = (tool.successRate * (tool.usageCount - 1) + 100) / tool.usageCount;
      } else {
        tool.successRate = tool.successRate * (tool.usageCount - 1) / tool.usageCount;
      }
    }
  }
  // Storage integration points (would integrate with main app database)
  async loadSavedConfigurations() {
  }
  async saveConfiguration(config) {
  }
  async removeStoredConfiguration(serverId) {
  }
  async autoConnectServers() {
    for (const config of this.configs.values()) {
      if (config.autoRestart) {
        try {
          await this.connectServer(config.id);
        } catch (error) {
          console.warn(`Failed to auto-connect to ${config.name}:`, error);
        }
      }
    }
  }
};

// ../llm-enhanced/src/services/ollama-adapter.ts
var OllamaServiceAdapter = class {
  constructor(ollamaService) {
    this.ollamaService = ollamaService;
  }
  currentModel = "llama3.1:latest";
  baseUrl = "http://127.0.0.1:11434";
  async checkHealth() {
    const isConnected = await this.ollamaService.checkOllamaHealth();
    return { isConnected };
  }
  async getModels() {
    const models = await this.ollamaService.listModels();
    return models.map((model) => ({ name: model.name }));
  }
  setModel(modelName) {
    this.currentModel = modelName;
  }
  getCurrentModel() {
    return this.currentModel;
  }
  setBaseUrl(url) {
    this.baseUrl = url;
  }
  async chat(messages, options) {
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const request = {
      model: this.currentModel,
      prompt,
      stream: false,
      ...options
    };
    const response = await this.ollamaService.generate(request);
    return {
      message: {
        content: response.response || response.content || ""
      }
    };
  }
};

// src/main.ts
var TanukiMCPApp = class {
  mainWindow = null;
  trayService;
  menuService;
  autoUpdaterService;
  notificationService;
  crashReporterService;
  protocolHandlerService;
  // Services that might be initialized later or conditionally
  ollamaService;
  systemMonitor;
  modelManager;
  hardwareAssessor;
  optimizationEngine;
  parameterTuner;
  contextManager;
  enhancedLLMService;
  mcpClientHub;
  isQuitting = false;
  constructor() {
    this.setupEventHandlers();
  }
  async initializeServices() {
    console.log("\u{1F527} Initializing Phase 2 services...");
    this.ollamaService = new OllamaService();
    this.systemMonitor = new SystemMonitor();
    this.modelManager = new ModelManager();
    this.hardwareAssessor = new HardwareAssessor();
    this.optimizationEngine = new OptimizationEngine();
    this.parameterTuner = new ParameterTuner();
    this.contextManager = new ContextManager();
    console.log("\u2705 Phase 2 services initialized");
    console.log("\u{1F527} Initializing Enhanced LLM and MCP Hub...");
    this.mcpClientHub = new MCPClientHub();
    await this.mcpClientHub.initialize();
    const ollamaAdapter = new OllamaServiceAdapter(this.ollamaService);
    this.enhancedLLMService = new EnhancedLLMService();
    await this.enhancedLLMService.initialize(ollamaAdapter, this.mcpClientHub);
    console.log("\u2705 Enhanced LLM and MCP Hub initialized");
  }
  setupEventHandlers() {
    import_electron11.app.whenReady().then(() => this.onReady());
    import_electron11.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    import_electron11.app.on("activate", this.onActivate.bind(this));
    import_electron11.app.on("before-quit", this.onBeforeQuit.bind(this));
    import_electron11.app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
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
      await this.initializeServices();
      console.log("\u{1F680} TanukiMCP Atlas starting...");
      console.log("\u{1F4CA} Initializing database...");
      await initializeDatabase();
      console.log("\u2705 Database initialized");
      console.log("\u{1F50D} Assessing system capabilities...");
      await this.assessSystemCapabilities();
      console.log("\u2705 System assessment complete");
      console.log("\u{1FA9F} Creating main window...");
      this.mainWindow = createWindow();
      console.log("\u{1F5A5}\uFE0F Initializing desktop integration...");
      await this.initializeDesktopServices();
      console.log("\u2705 Desktop integration ready");
      console.log("\u{1F50C} Setting up IPC handlers...");
      setupIPC();
      console.log("\u2705 IPC handlers ready");
      await this.loadApplication();
      console.log("\u{1F389} TanukiMCP Atlas ready!");
    } catch (error) {
      console.error("\u274C Failed to initialize TanukiMCP Atlas:", error);
      import_electron11.app.quit();
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
    const projectRoot = import_path6.default.resolve(__dirname, "../../../");
    const indexPath = import_path6.default.join(projectRoot, "packages/renderer/dist/index.html");
    console.log(`\u{1F4C1} Loading from file: ${indexPath} (using projectRoot: ${projectRoot}, __dirname: ${__dirname})`);
    await this.mainWindow.loadFile(indexPath);
  }
  onWindowAllClosed() {
    if (process.platform !== "darwin") {
      import_electron11.app.quit();
    }
  }
  onActivate() {
    if (import_electron11.BrowserWindow.getAllWindows().length === 0) {
      this.mainWindow = createWindow();
      this.loadApplication();
    }
  }
  onBeforeQuit() {
    this.isQuitting = true;
  }
  async initializeDesktopServices() {
    if (!this.mainWindow)
      return;
    try {
      this.crashReporterService = new CrashReporterService(this.mainWindow);
      this.notificationService = new NotificationService(this.mainWindow);
      this.trayService = new SystemTrayService(this.mainWindow);
      this.menuService = new NativeMenuService(this.mainWindow);
      this.protocolHandlerService = new ProtocolHandlerService(this.mainWindow);
      if (process.env.NODE_ENV === "production") {
        this.autoUpdaterService = new AutoUpdaterService(this.mainWindow);
        setTimeout(() => {
          this.autoUpdaterService?.checkForUpdates();
        }, 5e3);
      }
      console.log("\u2705 Desktop integration services initialized");
    } catch (error) {
      console.error("\u274C Failed to initialize desktop services:", error);
      this.crashReporterService?.logCrash(error, "Desktop Services Initialization");
    }
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
      contextManager: this.contextManager,
      enhancedLLM: this.enhancedLLMService,
      mcpHub: this.mcpClientHub,
      systemTray: this.trayService,
      nativeMenu: this.menuService,
      autoUpdater: this.autoUpdaterService,
      notification: this.notificationService,
      crashReporter: this.crashReporterService,
      protocolHandler: this.protocolHandlerService
    };
  }
};
var tanukiApp = new TanukiMCPApp();
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  tanukiApp.getServices().crashReporter?.logCrash(error, "Uncaught Exception");
  tanukiApp.getServices().crashReporter?.showCrashDialog(error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  const error = reason instanceof Error ? reason : new Error(String(reason));
  tanukiApp.getServices().crashReporter?.logCrash(error, "Unhandled Rejection");
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tanukiApp
});
//# sourceMappingURL=main.js.map
