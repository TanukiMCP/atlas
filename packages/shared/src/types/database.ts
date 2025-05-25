// Database schema types - these should match the Drizzle schema

export interface DatabaseProject {
  id: string;
  name: string;
  path: string;
  description?: string;
  language?: string;
  framework?: string;
  created: number;
  updated: number;
  lastOpened?: number;
  isActive: boolean;
  settings?: any;
}

export interface DatabaseChatSession {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  created: number;
  updated: number;
  isArchived: boolean;
  isFavorite: boolean;
  messageCount: number;
  tags?: string[];
  subjectMode: string;
  modelUsed?: string;
  totalTokens: number;
  executionTime: number;
}

export interface DatabaseChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata?: any;
  timestamp: number;
  parentMessageId?: string;
  toolsUsed?: string[];
  executionTime?: number;
  tokenCount?: number;
  model?: string;
  temperature?: number;
  complexity?: 'atomic' | 'moderate' | 'complex' | 'expert';
  qualityScore?: number;
}

export interface DatabaseContextEntry {
  id: string;
  sessionId: string;
  type: 'file' | 'function' | 'concept' | 'memory' | 'error' | 'solution';
  key: string;
  value: string;
  vectorEmbedding?: Buffer;
  importance: number;
  lastUsed: number;
  created: number;
  source?: string;
  expiry?: number;
  compressed: boolean;
}

export interface DatabaseWorkflow {
  id: string;
  name: string;
  description?: string;
  category: string;
  definition: any; // LangChain workflow definition
  variables: any; // Required/optional variables
  metadata: any; // Additional metadata
  isActive: boolean;
  isPublic: boolean;
  created: number;
  updated: number;
  createdBy?: string;
  version: string;
  tags?: string[];
  estimatedTime?: number;
  successRate?: number;
  usageCount: number;
}

export interface DatabaseWorkflowExecution {
  id: string;
  workflowId: string;
  sessionId?: string;
  parameters: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  result?: any;
  errorMessage?: string;
  errorStack?: string;
  started: number;
  completed?: number;
  executionTimeMs?: number;
  stepsCompleted: number;
  totalSteps?: number;
  progress: number;
}

export interface DatabaseMCPServer {
  id: string;
  name: string;
  description?: string;
  transport: 'stdio' | 'sse' | 'websocket';
  config: any;
  status: 'connected' | 'disconnected' | 'error' | 'unknown';
  created: number;
  updated: number;
  lastConnected?: number;
  lastError?: string;
  isAutoRestart: boolean;
  restartCount: number;
  version?: string;
  capabilities?: any;
  healthScore: number;
  responseTime?: number;
  uptime: number;
}

export interface DatabaseModelConfiguration {
  id: string;
  modelName: string;
  displayName?: string;
  parameters: any;
  performance?: any;
  isDefault: boolean;
  isInstalled: boolean;
  created: number;
  lastUsed?: number;
  usageCount: number;
  averageTokensPerSecond?: number;
  averageResponseTime?: number;
  memoryUsage?: number;
  diskSize?: number;
  downloadProgress: number;
  lastBenchmark?: number;
}

export interface DatabaseSubjectMode {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  tools: string[];
  prompts?: any;
  systemPrompt?: string;
  isActive: boolean;
  isBuiltIn: boolean;
  created: number;
  updated: number;
  usageCount: number;
  color?: string;
  shortcuts?: any;
}

export interface DatabaseSetting {
  key: string;
  value: any;
  category?: string;
  description?: string;
  isUserConfigurable: boolean;
  updated: number;
}

export interface DatabaseAnalytics {
  id: string;
  event: string;
  data?: any;
  timestamp: number;
  sessionId?: string;
  modelUsed?: string;
  executionTime?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  success?: boolean;
}

// Insert types (for creating new records)
export type NewDatabaseProject = Omit<DatabaseProject, 'id' | 'created' | 'updated'>;
export type NewDatabaseChatSession = Omit<DatabaseChatSession, 'id' | 'created' | 'updated' | 'messageCount'>;
export type NewDatabaseChatMessage = Omit<DatabaseChatMessage, 'id' | 'timestamp'>;
export type NewDatabaseContextEntry = Omit<DatabaseContextEntry, 'id' | 'created' | 'lastUsed'>;
export type NewDatabaseWorkflow = Omit<DatabaseWorkflow, 'id' | 'created' | 'updated' | 'usageCount'>;
export type NewDatabaseWorkflowExecution = Omit<DatabaseWorkflowExecution, 'id' | 'started' | 'stepsCompleted' | 'progress'>;
export type NewDatabaseMCPServer = Omit<DatabaseMCPServer, 'id' | 'created' | 'updated' | 'restartCount' | 'uptime'>;
export type NewDatabaseModelConfiguration = Omit<DatabaseModelConfiguration, 'id' | 'created' | 'usageCount' | 'downloadProgress'>;
export type NewDatabaseSubjectMode = Omit<DatabaseSubjectMode, 'id' | 'created' | 'updated' | 'usageCount'>;
export type NewDatabaseSetting = Omit<DatabaseSetting, 'updated'>;
export type NewDatabaseAnalytics = Omit<DatabaseAnalytics, 'id' | 'timestamp'>;

// Update types (for partial updates)
export type UpdateDatabaseProject = Partial<Omit<DatabaseProject, 'id' | 'created'>>;
export type UpdateDatabaseChatSession = Partial<Omit<DatabaseChatSession, 'id' | 'created'>>;
export type UpdateDatabaseChatMessage = Partial<Omit<DatabaseChatMessage, 'id' | 'sessionId' | 'timestamp'>>;
export type UpdateDatabaseContextEntry = Partial<Omit<DatabaseContextEntry, 'id' | 'sessionId' | 'created'>>;
export type UpdateDatabaseWorkflow = Partial<Omit<DatabaseWorkflow, 'id' | 'created'>>;
export type UpdateDatabaseWorkflowExecution = Partial<Omit<DatabaseWorkflowExecution, 'id' | 'workflowId' | 'started'>>;
export type UpdateDatabaseMCPServer = Partial<Omit<DatabaseMCPServer, 'id' | 'created'>>;
export type UpdateDatabaseModelConfiguration = Partial<Omit<DatabaseModelConfiguration, 'id' | 'created'>>;
export type UpdateDatabaseSubjectMode = Partial<Omit<DatabaseSubjectMode, 'id' | 'created'>>;

// Query result types
export interface DatabaseQueryResult<T = any> {
  rows: T[];
  rowsAffected: number;
  lastInsertRowid?: number;
}

export interface DatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// Database operation interfaces
export interface DatabaseOperations {
  // Projects
  createProject(data: NewDatabaseProject): Promise<DatabaseProject>;
  getProject(id: string): Promise<DatabaseProject | null>;
  updateProject(id: string, data: UpdateDatabaseProject): Promise<boolean>;
  deleteProject(id: string): Promise<boolean>;
  listProjects(limit?: number, offset?: number): Promise<DatabaseProject[]>;
  
  // Chat Sessions
  createChatSession(data: NewDatabaseChatSession): Promise<DatabaseChatSession>;
  getChatSession(id: string): Promise<DatabaseChatSession | null>;
  updateChatSession(id: string, data: UpdateDatabaseChatSession): Promise<boolean>;
  deleteChatSession(id: string): Promise<boolean>;
  listChatSessions(projectId?: string, limit?: number, offset?: number): Promise<DatabaseChatSession[]>;
  
  // Chat Messages
  createChatMessage(data: NewDatabaseChatMessage): Promise<DatabaseChatMessage>;
  getChatMessage(id: string): Promise<DatabaseChatMessage | null>;
  updateChatMessage(id: string, data: UpdateDatabaseChatMessage): Promise<boolean>;
  deleteChatMessage(id: string): Promise<boolean>;
  listChatMessages(sessionId: string, limit?: number, offset?: number): Promise<DatabaseChatMessage[]>;
  
  // Settings
  getSetting(key: string): Promise<DatabaseSetting | null>;
  setSetting(key: string, value: any, category?: string): Promise<boolean>;
  deleteSetting(key: string): Promise<boolean>;
  listSettings(category?: string): Promise<DatabaseSetting[]>;
  
  // Transactions
  beginTransaction(): Promise<DatabaseTransaction>;
  
  // Raw queries
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<DatabaseQueryResult>;
}

// Database event types
export interface DatabaseEvents {
  'project:created': DatabaseProject;
  'project:updated': { id: string; changes: UpdateDatabaseProject };
  'project:deleted': { id: string };
  
  'chat:sessionCreated': DatabaseChatSession;
  'chat:sessionUpdated': { id: string; changes: UpdateDatabaseChatSession };
  'chat:sessionDeleted': { id: string };
  
  'chat:messageCreated': DatabaseChatMessage;
  'chat:messageUpdated': { id: string; changes: UpdateDatabaseChatMessage };
  'chat:messageDeleted': { id: string };
  
  'setting:changed': { key: string; oldValue: any; newValue: any };
}

// Database configuration
export interface DatabaseConfig {
  path: string;
  pragma: {
    journalMode: 'WAL' | 'DELETE' | 'TRUNCATE' | 'PERSIST' | 'MEMORY' | 'OFF';
    synchronous: 'OFF' | 'NORMAL' | 'FULL' | 'EXTRA';
    cacheSize: number;
    foreignKeys: boolean;
    tempStore: 'DEFAULT' | 'FILE' | 'MEMORY';
    busyTimeout: number;
  };
  backup?: {
    enabled: boolean;
    interval: number; // in milliseconds
    retentionCount: number;
    compressionEnabled: boolean;
  };
  performance?: {
    enableWALMode: boolean;
    enableOptimize: boolean;
    vacuumOnClose: boolean;
    checkpointInterval: number;
  };
} 