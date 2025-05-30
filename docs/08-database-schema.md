# Database Schema (SQLite for TanukiMCP Atlas)

TanukiMCP Atlas uses a local SQLite database to store user preferences, project configurations, chat history, and other application-specific data. This document outlines the key tables.

## 🗄️ Core Tables

```sql
-- User Preferences and Application Settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT -- Can be JSON for complex settings like OpenRouter API key, preferred model, UI theme, etc.
);
-- Example keys: "openrouter_api_key", "user_name", "ui_theme", "default_openrouter_model_id"

-- Projects and Workspaces (if the app manages distinct project contexts beyond just file paths)
CREATE TABLE projects (
    id TEXT PRIMARY KEY, -- Could be a UUID
    name TEXT NOT NULL, -- User-defined project name
    path TEXT UNIQUE NOT NULL, -- Absolute path to the project directory
    description TEXT,
    last_opened DATETIME,
    -- project_specific_settings JSON, -- e.g., specific OpenRouter model, tool configurations for this project
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Chat Conversations
CREATE TABLE conversations (
    id TEXT PRIMARY KEY, -- UUID
    project_id TEXT, -- Optional, if chat is associated with a specific project
    title TEXT, -- User-editable or auto-generated title
    openrouter_model_id TEXT, -- The OpenRouter model ID used for this conversation (e.g., "anthropic/claude-3-haiku")
    system_prompt TEXT, -- Custom system prompt for this conversation, if any
    -- Parameters used for OpenRouter calls (temperature, max_tokens, etc.) can be stored here if they vary per conversation
    -- conversation_parameters JSON, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Chat Messages
CREATE TABLE messages (
    id TEXT PRIMARY KEY, -- UUID
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system', 'tool_request', 'tool_result'
    content TEXT NOT NULL, -- The textual content of the message
    tool_calls JSON, -- For assistant messages requesting tool calls (Array of {id, type, function: {name, arguments}} based on OpenAI/OpenRouter format)
    tool_call_id TEXT, -- For tool_result messages, the ID of the tool_call this result corresponds to
    metadata JSON,      -- e.g., token usage {prompt_tokens, completion_tokens}, OpenRouter model used for this specific message if it changed, execution time for tool calls.
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Stored Task Plans (Workflows)
CREATE TABLE task_plans (
    id TEXT PRIMARY KEY, -- UUID, corresponds to TaskPlan.id
    name TEXT NOT NULL, -- User-defined name for the saved plan/workflow
    goal TEXT, -- The original goal that generated this plan
    description TEXT,
    plan_data JSON NOT NULL, -- Serialized TaskPlan object (including all PlanSteps and their details)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME
);

-- Potentially a table for MCP Tool usage logs or statistics (optional)
-- CREATE TABLE tool_usage_logs (
--   log_id TEXT PRIMARY KEY,
--   tool_id TEXT NOT NULL,
--   timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   input_params JSON,
--   result_summary JSON, -- e.g., success/failure, duration
--   conversation_id TEXT, -- Link to conversation if applicable
--   plan_step_id TEXT -- Link to task plan step if applicable
-- );

```

### Notes:
-   **No `users` Table**: As a local Electron application focused on OpenRouter (which handles its own user accounts), a local `users` table for authentication is likely unnecessary unless Atlas implements its own multi-user system on a single machine, which is not typical for this type of app.
-   **Settings Table**: A simple key-value `settings` table is flexible for storing various application configurations, including the encrypted OpenRouter API key.
-   **OpenRouter Focus**: The `conversations` table explicitly stores `openrouter_model_id` instead of a generic `provider` and `model_name`.
-   **Tool Calls in Messages**: The `messages` table is structured to support modern tool-calling conventions (like OpenAI's, which OpenRouter often mirrors), storing `tool_calls` (requests from the assistant) and linking `tool_result` messages back via `tool_call_id`.
-   **Task Plans**: A table to store user-created or saved `TaskPlan` objects, allowing for reusable workflows.
-   **Timestamps**: Consistent use of `created_at` and `updated_at` for record management.
-   **JSON Fields**: Used for storing flexible structured data like settings, parameters, or metadata. SQLite has good JSON support.