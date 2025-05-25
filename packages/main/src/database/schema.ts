import { sqliteTable, text, integer, blob, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Projects table for workspace management
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  path: text('path').notNull(),
  description: text('description'),
  language: text('language'), // Primary programming language
  framework: text('framework'), // Framework or platform
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull(),
  lastOpened: integer('last_opened', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  settings: blob('settings', { mode: 'json' }) // Project-specific settings
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
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  messageCount: integer('message_count').default(0),
  tags: blob('tags', { mode: 'json' }),
  subjectMode: text('subject_mode').default('general'), // mathematics, programming, etc.
  modelUsed: text('model_used'), // Which LLM model was primarily used
  totalTokens: integer('total_tokens').default(0),
  executionTime: integer('execution_time_ms').default(0)
});

export const chatHistory = sqliteTable('chat_history', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => chatSessions.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system' | 'tool'
  content: text('content').notNull(),
  metadata: blob('metadata', { mode: 'json' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  parentMessageId: text('parent_message_id'),
  toolsUsed: blob('tools_used', { mode: 'json' }),
  executionTime: integer('execution_time_ms'),
  tokenCount: integer('token_count'),
  model: text('model'), // Which model generated this message
  temperature: real('temperature'), // Model parameters used
  complexity: text('complexity'), // atomic | moderate | complex | expert
  qualityScore: real('quality_score') // Quality assessment score
});

// Context management system for intelligent context handling
export const contextEntries = sqliteTable('context_entries', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => chatSessions.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'file', 'function', 'concept', 'memory', 'error', 'solution'
  key: text('key').notNull(),
  value: text('value').notNull(),
  vectorEmbedding: blob('vector_embedding'), // For semantic search
  importance: real('importance').default(1.0),
  lastUsed: integer('last_used', { mode: 'timestamp' }).notNull(),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  source: text('source'), // Where this context came from
  expiry: integer('expiry', { mode: 'timestamp' }), // When to auto-remove
  compressed: integer('compressed', { mode: 'boolean' }).default(false)
});

// Workflow system for saving and reusing chat patterns
export const workflows = sqliteTable('workflows', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'project-management', 'code-generation', etc.
  definition: blob('definition', { mode: 'json' }).notNull(), // LangChain workflow definition
  variables: blob('variables', { mode: 'json' }).notNull(), // Required/optional variables
  metadata: blob('metadata', { mode: 'json' }).notNull(), // Additional metadata
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull(),
  createdBy: text('created_by'), // User/source identification
  version: text('version').default('1.0.0'),
  tags: blob('tags', { mode: 'json' }),
  estimatedTime: integer('estimated_time_ms'), // Expected execution time
  successRate: real('success_rate'), // Historical success rate
  usageCount: integer('usage_count').default(0)
});

export const workflowExecutions = sqliteTable('workflow_executions', {
  id: text('id').primaryKey(),
  workflowId: text('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }),
  sessionId: text('session_id').references(() => chatSessions.id),
  parameters: blob('parameters', { mode: 'json' }).notNull(),
  status: text('status').notNull(), // 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  result: blob('result', { mode: 'json' }),
  errorMessage: text('error_message'),
  errorStack: text('error_stack'),
  started: integer('started', { mode: 'timestamp' }).notNull(),
  completed: integer('completed', { mode: 'timestamp' }),
  executionTimeMs: integer('execution_time_ms'),
  stepsCompleted: integer('steps_completed').default(0),
  totalSteps: integer('total_steps'),
  progress: real('progress').default(0.0) // 0.0 to 1.0
});

// MCP server management for external tool integration
export const mcpServers = sqliteTable('mcp_servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  transport: text('transport').notNull(), // 'stdio' | 'sse' | 'websocket'
  config: blob('config', { mode: 'json' }).notNull(),
  status: text('status').notNull(), // 'connected' | 'disconnected' | 'error' | 'unknown'
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull(),
  lastConnected: integer('last_connected', { mode: 'timestamp' }),
  lastError: text('last_error'),
  isAutoRestart: integer('is_auto_restart', { mode: 'boolean' }).default(true),
  restartCount: integer('restart_count').default(0),
  version: text('version'),
  capabilities: blob('capabilities', { mode: 'json' }),
  healthScore: real('health_score').default(1.0), // 0.0 to 1.0
  responseTime: integer('response_time_ms'), // Average response time
  uptime: integer('uptime_seconds').default(0)
});

// Model configurations and performance tracking
export const modelConfigurations = sqliteTable('model_configurations', {
  id: text('id').primaryKey(),
  modelName: text('model_name').notNull(),
  displayName: text('display_name'),
  parameters: blob('parameters', { mode: 'json' }).notNull(),
  performance: blob('performance', { mode: 'json' }),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  isInstalled: integer('is_installed', { mode: 'boolean' }).default(false),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  lastUsed: integer('last_used', { mode: 'timestamp' }),
  usageCount: integer('usage_count').default(0),
  averageTokensPerSecond: real('avg_tokens_per_second'),
  averageResponseTime: integer('avg_response_time_ms'),
  memoryUsage: integer('memory_usage_mb'),
  diskSize: integer('disk_size_mb'),
  downloadProgress: real('download_progress').default(0.0), // 0.0 to 1.0
  lastBenchmark: integer('last_benchmark', { mode: 'timestamp' })
});

// Subject-specific tool configurations and modes
export const subjectModes = sqliteTable('subject_modes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  icon: text('icon'), // Emoji or icon identifier
  tools: blob('tools', { mode: 'json' }).notNull(), // Available tools in this mode
  prompts: blob('prompts', { mode: 'json' }), // Mode-specific prompts
  systemPrompt: text('system_prompt'), // Default system prompt for this mode
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isBuiltIn: integer('is_built_in', { mode: 'boolean' }).default(false),
  created: integer('created', { mode: 'timestamp' }).notNull(),
  updated: integer('updated', { mode: 'timestamp' }).notNull(),
  usageCount: integer('usage_count').default(0),
  color: text('color'), // Theme color for UI
  shortcuts: blob('shortcuts', { mode: 'json' }) // Keyboard shortcuts
});

// System settings and user preferences
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: blob('value', { mode: 'json' }).notNull(),
  category: text('category'), // 'ui', 'performance', 'models', etc.
  description: text('description'),
  isUserConfigurable: integer('is_user_configurable', { mode: 'boolean' }).default(true),
  updated: integer('updated', { mode: 'timestamp' }).notNull()
});

// Performance and analytics tracking
export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  event: text('event').notNull(), // Event type
  data: blob('data', { mode: 'json' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  sessionId: text('session_id'),
  modelUsed: text('model_used'),
  executionTime: integer('execution_time_ms'),
  memoryUsage: integer('memory_usage_mb'),
  cpuUsage: real('cpu_usage_percent'),
  success: integer('success', { mode: 'boolean' })
});

// Define relationships
export const projectsRelations = relations(projects, ({ many }) => ({
  chatSessions: many(chatSessions)
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  project: one(projects, {
    fields: [chatSessions.projectId],
    references: [projects.id]
  }),
  messages: many(chatHistory),
  contextEntries: many(contextEntries),
  workflowExecutions: many(workflowExecutions)
}));

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatHistory.sessionId],
    references: [chatSessions.id]
  })
}));

export const workflowsRelations = relations(workflows, ({ many }) => ({
  executions: many(workflowExecutions)
}));

export const workflowExecutionsRelations = relations(workflowExecutions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id]
  }),
  session: one(chatSessions, {
    fields: [workflowExecutions.sessionId],
    references: [chatSessions.id]
  })
}));

// Type exports for use in application
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatHistory.$inferSelect;
export type NewChatMessage = typeof chatHistory.$inferInsert;
export type ContextEntry = typeof contextEntries.$inferSelect;
export type NewContextEntry = typeof contextEntries.$inferInsert;
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type NewWorkflowExecution = typeof workflowExecutions.$inferInsert;
export type MCPServer = typeof mcpServers.$inferSelect;
export type NewMCPServer = typeof mcpServers.$inferInsert;
export type ModelConfiguration = typeof modelConfigurations.$inferSelect;
export type NewModelConfiguration = typeof modelConfigurations.$inferInsert;
export type SubjectMode = typeof subjectModes.$inferSelect;
export type NewSubjectMode = typeof subjectModes.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert; 