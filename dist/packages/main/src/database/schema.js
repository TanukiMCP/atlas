"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowExecutionsRelations = exports.workflowsRelations = exports.chatHistoryRelations = exports.chatSessionsRelations = exports.projectsRelations = exports.analytics = exports.settings = exports.subjectModes = exports.modelConfigurations = exports.mcpServers = exports.workflowExecutions = exports.workflows = exports.contextEntries = exports.chatHistory = exports.chatSessions = exports.projects = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
// Projects table for workspace management
exports.projects = (0, sqlite_core_1.sqliteTable)('projects', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    path: (0, sqlite_core_1.text)('path').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    language: (0, sqlite_core_1.text)('language'), // Primary programming language
    framework: (0, sqlite_core_1.text)('framework'), // Framework or platform
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull(),
    lastOpened: (0, sqlite_core_1.integer)('last_opened', { mode: 'timestamp' }),
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true),
    settings: (0, sqlite_core_1.blob)('settings', { mode: 'json' }) // Project-specific settings
});
// Enhanced chat system with CRUD operations
exports.chatSessions = (0, sqlite_core_1.sqliteTable)('chat_sessions', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    projectId: (0, sqlite_core_1.text)('project_id').references(() => exports.projects.id),
    title: (0, sqlite_core_1.text)('title').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull(),
    isArchived: (0, sqlite_core_1.integer)('is_archived', { mode: 'boolean' }).default(false),
    isFavorite: (0, sqlite_core_1.integer)('is_favorite', { mode: 'boolean' }).default(false),
    messageCount: (0, sqlite_core_1.integer)('message_count').default(0),
    tags: (0, sqlite_core_1.blob)('tags', { mode: 'json' }),
    subjectMode: (0, sqlite_core_1.text)('subject_mode').default('general'), // mathematics, programming, etc.
    modelUsed: (0, sqlite_core_1.text)('model_used'), // Which LLM model was primarily used
    totalTokens: (0, sqlite_core_1.integer)('total_tokens').default(0),
    executionTime: (0, sqlite_core_1.integer)('execution_time_ms').default(0)
});
exports.chatHistory = (0, sqlite_core_1.sqliteTable)('chat_history', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    sessionId: (0, sqlite_core_1.text)('session_id').references(() => exports.chatSessions.id, { onDelete: 'cascade' }),
    role: (0, sqlite_core_1.text)('role').notNull(), // 'user' | 'assistant' | 'system' | 'tool'
    content: (0, sqlite_core_1.text)('content').notNull(),
    metadata: (0, sqlite_core_1.blob)('metadata', { mode: 'json' }),
    timestamp: (0, sqlite_core_1.integer)('timestamp', { mode: 'timestamp' }).notNull(),
    parentMessageId: (0, sqlite_core_1.text)('parent_message_id'),
    toolsUsed: (0, sqlite_core_1.blob)('tools_used', { mode: 'json' }),
    executionTime: (0, sqlite_core_1.integer)('execution_time_ms'),
    tokenCount: (0, sqlite_core_1.integer)('token_count'),
    model: (0, sqlite_core_1.text)('model'), // Which model generated this message
    temperature: (0, sqlite_core_1.real)('temperature'), // Model parameters used
    complexity: (0, sqlite_core_1.text)('complexity'), // atomic | moderate | complex | expert
    qualityScore: (0, sqlite_core_1.real)('quality_score') // Quality assessment score
});
// Context management system for intelligent context handling
exports.contextEntries = (0, sqlite_core_1.sqliteTable)('context_entries', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    sessionId: (0, sqlite_core_1.text)('session_id').references(() => exports.chatSessions.id, { onDelete: 'cascade' }),
    type: (0, sqlite_core_1.text)('type').notNull(), // 'file', 'function', 'concept', 'memory', 'error', 'solution'
    key: (0, sqlite_core_1.text)('key').notNull(),
    value: (0, sqlite_core_1.text)('value').notNull(),
    vectorEmbedding: (0, sqlite_core_1.blob)('vector_embedding'), // For semantic search
    importance: (0, sqlite_core_1.real)('importance').default(1.0),
    lastUsed: (0, sqlite_core_1.integer)('last_used', { mode: 'timestamp' }).notNull(),
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    source: (0, sqlite_core_1.text)('source'), // Where this context came from
    expiry: (0, sqlite_core_1.integer)('expiry', { mode: 'timestamp' }), // When to auto-remove
    compressed: (0, sqlite_core_1.integer)('compressed', { mode: 'boolean' }).default(false)
});
// Workflow system for saving and reusing chat patterns
exports.workflows = (0, sqlite_core_1.sqliteTable)('workflows', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    category: (0, sqlite_core_1.text)('category').notNull(), // 'project-management', 'code-generation', etc.
    definition: (0, sqlite_core_1.blob)('definition', { mode: 'json' }).notNull(), // LangChain workflow definition
    variables: (0, sqlite_core_1.blob)('variables', { mode: 'json' }).notNull(), // Required/optional variables
    metadata: (0, sqlite_core_1.blob)('metadata', { mode: 'json' }).notNull(), // Additional metadata
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true),
    isPublic: (0, sqlite_core_1.integer)('is_public', { mode: 'boolean' }).default(false),
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull(),
    createdBy: (0, sqlite_core_1.text)('created_by'), // User/source identification
    version: (0, sqlite_core_1.text)('version').default('1.0.0'),
    tags: (0, sqlite_core_1.blob)('tags', { mode: 'json' }),
    estimatedTime: (0, sqlite_core_1.integer)('estimated_time_ms'), // Expected execution time
    successRate: (0, sqlite_core_1.real)('success_rate'), // Historical success rate
    usageCount: (0, sqlite_core_1.integer)('usage_count').default(0)
});
exports.workflowExecutions = (0, sqlite_core_1.sqliteTable)('workflow_executions', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    workflowId: (0, sqlite_core_1.text)('workflow_id').references(() => exports.workflows.id, { onDelete: 'cascade' }),
    sessionId: (0, sqlite_core_1.text)('session_id').references(() => exports.chatSessions.id),
    parameters: (0, sqlite_core_1.blob)('parameters', { mode: 'json' }).notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(), // 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    result: (0, sqlite_core_1.blob)('result', { mode: 'json' }),
    errorMessage: (0, sqlite_core_1.text)('error_message'),
    errorStack: (0, sqlite_core_1.text)('error_stack'),
    started: (0, sqlite_core_1.integer)('started', { mode: 'timestamp' }).notNull(),
    completed: (0, sqlite_core_1.integer)('completed', { mode: 'timestamp' }),
    executionTimeMs: (0, sqlite_core_1.integer)('execution_time_ms'),
    stepsCompleted: (0, sqlite_core_1.integer)('steps_completed').default(0),
    totalSteps: (0, sqlite_core_1.integer)('total_steps'),
    progress: (0, sqlite_core_1.real)('progress').default(0.0) // 0.0 to 1.0
});
// MCP server management for external tool integration
exports.mcpServers = (0, sqlite_core_1.sqliteTable)('mcp_servers', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    transport: (0, sqlite_core_1.text)('transport').notNull(), // 'stdio' | 'sse' | 'websocket'
    config: (0, sqlite_core_1.blob)('config', { mode: 'json' }).notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(), // 'connected' | 'disconnected' | 'error' | 'unknown'
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull(),
    lastConnected: (0, sqlite_core_1.integer)('last_connected', { mode: 'timestamp' }),
    lastError: (0, sqlite_core_1.text)('last_error'),
    isAutoRestart: (0, sqlite_core_1.integer)('is_auto_restart', { mode: 'boolean' }).default(true),
    restartCount: (0, sqlite_core_1.integer)('restart_count').default(0),
    version: (0, sqlite_core_1.text)('version'),
    capabilities: (0, sqlite_core_1.blob)('capabilities', { mode: 'json' }),
    healthScore: (0, sqlite_core_1.real)('health_score').default(1.0), // 0.0 to 1.0
    responseTime: (0, sqlite_core_1.integer)('response_time_ms'), // Average response time
    uptime: (0, sqlite_core_1.integer)('uptime_seconds').default(0)
});
// Model configurations and performance tracking
exports.modelConfigurations = (0, sqlite_core_1.sqliteTable)('model_configurations', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    modelName: (0, sqlite_core_1.text)('model_name').notNull(),
    displayName: (0, sqlite_core_1.text)('display_name'),
    parameters: (0, sqlite_core_1.blob)('parameters', { mode: 'json' }).notNull(),
    performance: (0, sqlite_core_1.blob)('performance', { mode: 'json' }),
    isDefault: (0, sqlite_core_1.integer)('is_default', { mode: 'boolean' }).default(false),
    isInstalled: (0, sqlite_core_1.integer)('is_installed', { mode: 'boolean' }).default(false),
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    lastUsed: (0, sqlite_core_1.integer)('last_used', { mode: 'timestamp' }),
    usageCount: (0, sqlite_core_1.integer)('usage_count').default(0),
    averageTokensPerSecond: (0, sqlite_core_1.real)('avg_tokens_per_second'),
    averageResponseTime: (0, sqlite_core_1.integer)('avg_response_time_ms'),
    memoryUsage: (0, sqlite_core_1.integer)('memory_usage_mb'),
    diskSize: (0, sqlite_core_1.integer)('disk_size_mb'),
    downloadProgress: (0, sqlite_core_1.real)('download_progress').default(0.0), // 0.0 to 1.0
    lastBenchmark: (0, sqlite_core_1.integer)('last_benchmark', { mode: 'timestamp' })
});
// Subject-specific tool configurations and modes
exports.subjectModes = (0, sqlite_core_1.sqliteTable)('subject_modes', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    displayName: (0, sqlite_core_1.text)('display_name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    icon: (0, sqlite_core_1.text)('icon'), // Emoji or icon identifier
    tools: (0, sqlite_core_1.blob)('tools', { mode: 'json' }).notNull(), // Available tools in this mode
    prompts: (0, sqlite_core_1.blob)('prompts', { mode: 'json' }), // Mode-specific prompts
    systemPrompt: (0, sqlite_core_1.text)('system_prompt'), // Default system prompt for this mode
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true),
    isBuiltIn: (0, sqlite_core_1.integer)('is_built_in', { mode: 'boolean' }).default(false),
    created: (0, sqlite_core_1.integer)('created', { mode: 'timestamp' }).notNull(),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull(),
    usageCount: (0, sqlite_core_1.integer)('usage_count').default(0),
    color: (0, sqlite_core_1.text)('color'), // Theme color for UI
    shortcuts: (0, sqlite_core_1.blob)('shortcuts', { mode: 'json' }) // Keyboard shortcuts
});
// System settings and user preferences
exports.settings = (0, sqlite_core_1.sqliteTable)('settings', {
    key: (0, sqlite_core_1.text)('key').primaryKey(),
    value: (0, sqlite_core_1.blob)('value', { mode: 'json' }).notNull(),
    category: (0, sqlite_core_1.text)('category'), // 'ui', 'performance', 'models', etc.
    description: (0, sqlite_core_1.text)('description'),
    isUserConfigurable: (0, sqlite_core_1.integer)('is_user_configurable', { mode: 'boolean' }).default(true),
    updated: (0, sqlite_core_1.integer)('updated', { mode: 'timestamp' }).notNull()
});
// Performance and analytics tracking
exports.analytics = (0, sqlite_core_1.sqliteTable)('analytics', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    event: (0, sqlite_core_1.text)('event').notNull(), // Event type
    data: (0, sqlite_core_1.blob)('data', { mode: 'json' }),
    timestamp: (0, sqlite_core_1.integer)('timestamp', { mode: 'timestamp' }).notNull(),
    sessionId: (0, sqlite_core_1.text)('session_id'),
    modelUsed: (0, sqlite_core_1.text)('model_used'),
    executionTime: (0, sqlite_core_1.integer)('execution_time_ms'),
    memoryUsage: (0, sqlite_core_1.integer)('memory_usage_mb'),
    cpuUsage: (0, sqlite_core_1.real)('cpu_usage_percent'),
    success: (0, sqlite_core_1.integer)('success', { mode: 'boolean' })
});
// Define relationships
exports.projectsRelations = (0, drizzle_orm_1.relations)(exports.projects, ({ many }) => ({
    chatSessions: many(exports.chatSessions)
}));
exports.chatSessionsRelations = (0, drizzle_orm_1.relations)(exports.chatSessions, ({ one, many }) => ({
    project: one(exports.projects, {
        fields: [exports.chatSessions.projectId],
        references: [exports.projects.id]
    }),
    messages: many(exports.chatHistory),
    contextEntries: many(exports.contextEntries),
    workflowExecutions: many(exports.workflowExecutions)
}));
exports.chatHistoryRelations = (0, drizzle_orm_1.relations)(exports.chatHistory, ({ one }) => ({
    session: one(exports.chatSessions, {
        fields: [exports.chatHistory.sessionId],
        references: [exports.chatSessions.id]
    })
}));
exports.workflowsRelations = (0, drizzle_orm_1.relations)(exports.workflows, ({ many }) => ({
    executions: many(exports.workflowExecutions)
}));
exports.workflowExecutionsRelations = (0, drizzle_orm_1.relations)(exports.workflowExecutions, ({ one }) => ({
    workflow: one(exports.workflows, {
        fields: [exports.workflowExecutions.workflowId],
        references: [exports.workflows.id]
    }),
    session: one(exports.chatSessions, {
        fields: [exports.workflowExecutions.sessionId],
        references: [exports.chatSessions.id]
    })
}));
//# sourceMappingURL=schema.js.map