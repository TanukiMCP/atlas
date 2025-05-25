# TanukiMCP: Atlas - Tool System Architecture

## 🛠️ Built-in Tools (Core Functionality)

Based on desktop-commander capabilities with enhanced implementations:

### File Operations
```typescript
interface FileOperations {
  // Read file with streaming support for large files
  read_file(params: {
    path: string;
    offset?: number;      // Starting line (0-indexed)
    length?: number;      // Max lines to read (default: 1000)
    encoding?: string;    // File encoding (default: 'utf8')
    isUrl?: boolean;      // Support for remote files
  }): Promise<{
    content: string;
    totalLines: number;
    hasMore: boolean;
    metadata: FileMetadata;
  }>;

  // Write file with chunking and conflict resolution
  write_file(params: {
    path: string;
    content: string;
    mode: 'rewrite' | 'append';
    createDirs?: boolean;   // Create parent directories
    backup?: boolean;       // Create backup before overwrite
    atomicWrite?: boolean;  // Use temporary file for atomic writes
  }): Promise<{
    success: boolean;
    bytesWritten: number;
    conflicts?: ConflictInfo[];
  }>;

  // Advanced directory operations
  create_directory(params: {
    path: string;
    recursive?: boolean;
    mode?: number;         // Unix permissions
  }): Promise<{ created: string[]; existed: string[] }>;

  list_directory(params: {
    path: string;
    recursive?: boolean;
    includeHidden?: boolean;
    filter?: string;       // Glob pattern
    sortBy?: 'name' | 'modified' | 'size';
  }): Promise<DirectoryEntry[]>;

  // Batch file operations
  move_files(operations: Array<{
    source: string;
    destination: string;
    overwrite?: boolean;
  }>): Promise<BatchResult>;

  // Advanced file search with indexing
  search_files(params: {
    path: string;
    pattern: string;
    caseSensitive?: boolean;
    useRegex?: boolean;
    maxResults?: number;
    includeContent?: boolean;  // Include file content preview
  }): Promise<SearchResult[]>;

  // Rich file metadata
  get_file_info(path: string): Promise<{
    path: string;
    size: number;
    created: Date;
    modified: Date;
    permissions: string;
    type: 'file' | 'directory' | 'symlink';
    lineCount?: number;      // For text files
    encoding?: string;       // Detected encoding
    mimeType?: string;       // MIME type detection
  }>;
}
```