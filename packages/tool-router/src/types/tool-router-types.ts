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

export interface SourceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  lastCheck: Date;
  uptime: number;
  errorRate: number;
  lastError?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  priority: number;
  subjectModes: string[];
}export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolOutputSchema {
  type: string;
  description?: string;
  properties?: Record<string, ToolProperty>;
}

export interface ToolProperty {
  type: string;
  description?: string;
  enum?: string[];
  default?: any;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  items?: ToolProperty;
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

export interface ProjectContext {
  path: string;
  type: string;
  language?: string;
  framework?: string;
  dependencies?: string[];
  openFiles?: string[];
  currentFile?: string;
}export interface UserToolPreferences {
  preferredSources: SourcePreference[];
  conflictResolutionRules: ConflictResolutionRule[];
  toolCategories: CategoryPreference[];
  maxExecutionTime: number;
  enableFallbacks: boolean;
  showPreview: boolean;
}

export interface SourcePreference {
  sourceId: string;
  weight: number;
  enabled: boolean;
}

export interface ConflictResolutionRule {
  pattern: string;
  resolution: ToolConflict['resolution'];
  priority: number;
}

export interface CategoryPreference {
  categoryId: string;
  visible: boolean;
  priority: number;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
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
  metadata?: ExecutionMetadata;
}

export interface ToolExecutionError {
  message: string;
  type: 'validation_error' | 'execution_error' | 'timeout_error' | 'network_error' | 'permission_error';
  code?: string;
  recoverable: boolean;
  details?: any;
}export interface ExecutionMetadata {
  startTime: Date;
  endTime: Date;
  memoryUsage?: number;
  cpuUsage?: number;
  networkCalls?: number;
  cacheHits?: number;
}

export interface DiscoveredTool {
  name: string;
  description: string;
  sourceId: string;
  sourceType: 'builtin' | 'external';
  inputSchema: ToolInputSchema;
  outputSchema?: ToolOutputSchema;
  category?: string;
  tags?: string[];
}

export interface SearchOptions {
  maxResults?: number;
  includeUnavailable?: boolean;
  categoryFilter?: string[];
  sourceFilter?: string[];
  minScore?: number;
}

export interface ToolPreview {
  tool: UnifiedTool;
  recentUsage: UsageRecord[];
  performanceMetrics: PerformanceMetrics;
  similarTools: UnifiedTool[];
  documentation?: ToolDocumentation;
}

export interface UsageRecord {
  timestamp: Date;
  executionTime: number;
  success: boolean;
  context: string;
}

export interface PerformanceMetrics {
  averageExecutionTime: number;
  successRate: number;
  usageFrequency: number;
  lastWeekUsage: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface ToolDocumentation {
  description: string;
  examples: ToolExample[];
  parameters: ParameterDoc[];
  returnValue?: string;
  notes?: string[];
}export interface ToolExample {
  title: string;
  description: string;
  input: any;
  output: any;
}

export interface ParameterDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: any;
  examples?: any[];
}

export type ToolScore = {
  tool: UnifiedTool;
  score: number;
  factors: ScoreFactor[];
};

export interface ScoreFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface ToolIndex {
  [key: string]: UnifiedTool[];
}

export interface SearchIndex {
  nameIndex: Map<string, UnifiedTool[]>;
  descriptionIndex: Map<string, UnifiedTool[]>;
  tagIndex: Map<string, UnifiedTool[]>;
  categoryIndex: Map<string, UnifiedTool[]>;
  keywordIndex: Map<string, UnifiedTool[]>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
  hits: number;
}

export interface ToolCache {
  tools: Map<string, CacheEntry<UnifiedTool>>;
  searches: Map<string, CacheEntry<UnifiedTool[]>>;
  metrics: Map<string, CacheEntry<PerformanceMetrics>>;
  maxSize: number;
  ttl: number;
}

export interface RouteDecision {
  selectedTool: UnifiedTool;
  reasoning: string[];
  alternatives: UnifiedTool[];
  confidence: number;
  estimatedExecutionTime: number;
}

export interface FallbackResult {
  originalTool: UnifiedTool;
  fallbackTool?: UnifiedTool;
  reason: string;
  success: boolean;
}