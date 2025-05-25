// Main exports for the tool router package
export { UnifiedToolRouter } from './router/unified-tool-router';
export { ToolDiscovery } from './router/tool-discovery';
export { ContextAnalyzer } from './router/context-analyzer';
export { ConflictResolver } from './router/conflict-resolver';
export { ExecutionRouter } from './router/execution-router';

// Search components
export { FuzzySearch } from './search/fuzzy-search';
export { ToolIndexer } from './search/tool-indexer';

// UI components
export { AtSymbolDropdown } from './ui/at-symbol-dropdown';
export { ToolSelector } from './ui/tool-selector';
export { ToolPreview } from './ui/tool-preview';
export { ParameterInput } from './ui/parameter-input';

// Execution components
export { PerformanceMonitor } from './execution/performance-monitor';

// Preferences
export { UserPreferences } from './preferences/user-preferences';

// Types
export * from './types/tool-router-types';

// Re-export commonly used interfaces
export type {
  UnifiedTool,
  ToolExecutionContext,
  ToolExecutionResult,
  ToolCategory,
  SearchOptions,
  ToolPreview as ToolPreviewData
} from './types/tool-router-types';