# Database Schema

## 🗄️ Core Tables

```sql
-- Users and authentication
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    preferences JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects and workspaces
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    path TEXT NOT NULL,
    type TEXT NOT NULL, -- 'react', 'node', 'python', etc.
    framework TEXT,     -- 'next.js', 'express', 'django', etc.
    language TEXT,      -- 'typescript', 'javascript', 'python', etc.
    status TEXT NOT NULL DEFAULT 'active',
    last_opened DATETIME,
    settings JSON,
    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat conversations
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id TEXT,
    title TEXT,
    model_name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'ollama',
    system_prompt TEXT,
    context_window INTEGER DEFAULT 4096,
    temperature REAL DEFAULT 0.7,
    status TEXT DEFAULT 'active',
    message_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Chat messages
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'user', 'assistant', 'system', 'tool'
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    raw_content TEXT,   -- Original unprocessed content
    metadata JSON,      -- Tools used, execution time, etc.
    token_count INTEGER,
    parent_message_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL
);
```