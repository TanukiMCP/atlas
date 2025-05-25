/**
 * TanukiMCP Atlas - LLM System Prompt Management Types
 * Comprehensive type definitions for the prompt management system
 */

export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  agentModule: string;
  purpose: string;
  defaultContent: string;
  userModifiedContent?: string;
  variables: PromptVariable[];
  guidance: string;
  version: string;
  created: Date;
  lastModified: Date;
  isModified: boolean;
  estimatedTokens: number;
  complexity: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
  example?: any;
}

export interface PromptRegistry {
  prompts: Record<string, SystemPrompt>;
  categories: Record<string, PromptCategory>;
  userModifications: Record<string, string>;
  lastUpdated: Date;
  version: string;
}

export interface PromptDiscoveryResult {
  prompts: SystemPrompt[];
  categories: PromptCategory[];
  totalCount: number;
  modifiedCount: number;
  errorCount: number;
}export interface PromptValidationResult {
  isValid: boolean;
  errors: PromptValidationError[];
  warnings: PromptValidationWarning[];
  estimatedTokens: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface PromptValidationError {
  type: 'syntax' | 'length' | 'variables' | 'structure';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

export interface PromptValidationWarning {
  type: 'performance' | 'best_practice' | 'compatibility';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

export interface PromptExportData {
  prompt: SystemPrompt;
  exportedAt: Date;
  exportedBy: string;
  version: string;
  checksum: string;
}

export interface PromptImportResult {
  success: boolean;
  promptId: string;
  errors: string[];
  warnings: string[];
  conflicts: PromptConflict[];
}

export interface PromptConflict {
  type: 'version' | 'content' | 'metadata';
  description: string;
  currentValue: any;
  incomingValue: any;
  resolution: 'overwrite' | 'merge' | 'skip' | 'manual';
}

export interface PromptBackup {
  id: string;
  promptId: string;
  content: string;
  timestamp: Date;
  reason: 'manual' | 'auto' | 'import' | 'reset';
  metadata: Record<string, any>;
}export interface PromptUsageStatistics {
  promptId: string;
  usageCount: number;
  averageExecutionTime: number;
  successRate: number;
  lastUsed: Date;
  commonVariables: Record<string, any>;
  errorPatterns: string[];
}

export interface PromptSearchFilters {
  query?: string;
  categories?: string[];
  modifiedOnly?: boolean;
  complexity?: ('low' | 'medium' | 'high')[];
  tags?: string[];
  agentModules?: string[];
  sortBy?: 'name' | 'category' | 'lastModified' | 'usage' | 'complexity';
  sortOrder?: 'asc' | 'desc';
}

export interface PromptSearchResult {
  prompts: SystemPrompt[];
  totalCount: number;
  facets: {
    categories: Array<{ id: string; name: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
    agentModules: Array<{ module: string; count: number }>;
    complexity: Array<{ level: string; count: number }>;
  };
}

export interface PromptManagerState {
  isLoading: boolean;
  error: string | null;
  registry: PromptRegistry | null;
  selectedPrompt: SystemPrompt | null;
  searchFilters: PromptSearchFilters;
  searchResults: PromptSearchResult | null;
  validationResults: Record<string, PromptValidationResult>;
  usageStatistics: Record<string, PromptUsageStatistics>;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  backupHistory: PromptBackup[];
}// Default prompt categories as specified in the architecture
export const DEFAULT_PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'llm-routing',
    name: 'LLM Routing Layer',
    description: 'Request classification, complexity assessment, and route selection',
    icon: '🧠',
    color: 'blue',
    sortOrder: 1
  },
  {
    id: 'task-processors',
    name: 'Task Processors', 
    description: 'Atomic, moderate, and complex task processing agents',
    icon: '⚙️',
    color: 'green',
    sortOrder: 2
  },
  {
    id: 'workflow-generation',
    name: 'Workflow Generation',
    description: 'Intelligent custom workflow creation and management',
    icon: '🔧',
    color: 'purple',
    sortOrder: 3
  },
  {
    id: 'ai-agent-council',
    name: 'AI Agent Council',
    description: 'Enhancement agents, voting, and expert panel review',
    icon: '👥',
    color: 'orange',
    sortOrder: 4
  },
  {
    id: 'execution-engine',
    name: 'Execution Engine',
    description: 'Task sequencing and iterative execution coordination',
    icon: '🚀',
    color: 'red',
    sortOrder: 5
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'User communication and response excellence layers',
    icon: '💬',
    color: 'teal',
    sortOrder: 6
  },
  {
    id: 'hybrid-mode',
    name: 'Hybrid Mode Management',
    description: 'Mode orchestration and adaptive complexity assessment',
    icon: '🔄',
    color: 'indigo',
    sortOrder: 7
  },
  {
    id: 'failure-recovery',
    name: 'Failure Recovery',
    description: 'Error detection, recovery strategies, and resilience',
    icon: '🛡️',
    color: 'yellow',
    sortOrder: 8
  },
  {
    id: 'chat-ui-helpers',
    name: 'Chat & UI Helpers',
    description: 'Interface assistance and user interaction guidance',
    icon: '🎨',
    color: 'pink',
    sortOrder: 9
  }
];// Common prompt template variables
export const COMMON_PROMPT_VARIABLES: PromptVariable[] = [
  {
    name: 'user_query',
    type: 'string',
    description: 'The user\'s input query or request',
    required: true,
    example: 'Create a React dashboard with charts'
  },
  {
    name: 'chat_history',
    type: 'array',
    description: 'Previous messages in the conversation',
    required: false,
    example: []
  },
  {
    name: 'available_tools',
    type: 'array',
    description: 'List of available tools for the current context',
    required: false,
    example: ['read_file', 'write_file', 'search_code']
  },
  {
    name: 'context',
    type: 'object',
    description: 'Current execution context and environment state',
    required: false,
    example: { project_path: './src', current_mode: 'programming' }
  },
  {
    name: 'execution_history',
    type: 'array',
    description: 'History of previously executed tasks and tools',
    required: false,
    example: []
  }
];

export type PromptManagerAction = 
  | { type: 'LOAD_REGISTRY_START' }
  | { type: 'LOAD_REGISTRY_SUCCESS'; payload: PromptRegistry }
  | { type: 'LOAD_REGISTRY_ERROR'; payload: string }
  | { type: 'SELECT_PROMPT'; payload: SystemPrompt }
  | { type: 'UPDATE_PROMPT_CONTENT'; payload: { promptId: string; content: string } }
  | { type: 'SAVE_PROMPT_START' }
  | { type: 'SAVE_PROMPT_SUCCESS'; payload: SystemPrompt }
  | { type: 'SAVE_PROMPT_ERROR'; payload: string }
  | { type: 'RESET_PROMPT'; payload: string }
  | { type: 'VALIDATE_PROMPT'; payload: { promptId: string; result: PromptValidationResult } }
  | { type: 'SEARCH_PROMPTS'; payload: PromptSearchFilters }
  | { type: 'SET_SEARCH_RESULTS'; payload: PromptSearchResult }
  | { type: 'SET_EDITING_MODE'; payload: boolean }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'ADD_BACKUP'; payload: PromptBackup }
  | { type: 'CLEAR_ERROR' };