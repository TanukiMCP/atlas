# Tool System - Core Interfaces

## 🛠️ File Operations Interface

```typescript
interface FileOperations {
  read_file(params: {
    path: string;
    offset?: number;
    length?: number;
    encoding?: string;
    isUrl?: boolean;
  }): Promise<{
    content: string;
    totalLines: number;
    hasMore: boolean;
    metadata: FileMetadata;
  }>;

  write_file(params: {
    path: string;
    content: string;
    mode: 'rewrite' | 'append';
    createDirs?: boolean;
    backup?: boolean;
    atomicWrite?: boolean;
  }): Promise<{
    success: boolean;
    bytesWritten: number;
    conflicts?: ConflictInfo[];
  }>;

  search_files(params: {
    path: string;
    pattern: string;
    caseSensitive?: boolean;
    useRegex?: boolean;
    maxResults?: number;
    includeContent?: boolean;
  }): Promise<SearchResult[]>;
}
```

## 💻 Code Operations Interface

```typescript
interface CodeOperations {
  search_code(params: {
    path: string;
    pattern: string;
    filePattern?: string;
    contextLines?: number;
    caseSensitive?: boolean;
    useRegex?: boolean;
    maxResults?: number;
    excludeDirs?: string[];
  }): Promise<{
    matches: CodeMatch[];
    totalFiles: number;
    totalMatches: number;
    executionTime: number;
  }>;

  edit_block(params: {
    filePath: string;
    oldString: string;
    newString: string;
    validateSyntax?: boolean;
    createBackup?: boolean;
    expectedReplacements?: number;
  }): Promise<{
    success: boolean;
    replacements: number;
    syntaxValid?: boolean;
    backup?: string;
    conflicts?: string[];
  }>;
}
```