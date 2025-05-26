"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getDatabase = getDatabase;
exports.getRawDatabase = getRawDatabase;
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.closeDatabase = closeDatabase;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const schema = __importStar(require("./schema"));
const uuid_1 = require("uuid");
let db;
let sqlite;
async function initializeDatabase() {
    try {
        // Get database path in user data directory
        const userDataPath = electron_1.app.getPath('userData');
        const dbPath = path_1.default.join(userDataPath, 'tanukimcp.db');
        console.log(`📊 Database path: ${dbPath}`);
        // Create SQLite connection
        sqlite = new better_sqlite3_1.default(dbPath);
        // Configure SQLite for optimal performance
        configureDatabase(sqlite);
        // Create Drizzle instance
        db = (0, better_sqlite3_2.drizzle)(sqlite, { schema });
        // Run migrations
        console.log('🔄 Running database migrations...');
        await runMigrations();
        // Initialize default data
        await initializeDefaultData();
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error);
        throw error;
    }
}
function configureDatabase(sqlite) {
    // Enable WAL mode for better concurrency
    sqlite.pragma('journal_mode = WAL');
    // Set synchronous mode for better performance while maintaining safety
    sqlite.pragma('synchronous = NORMAL');
    // Increase cache size (1000 pages = ~4MB for default page size)
    sqlite.pragma('cache_size = 1000000');
    // Enable foreign key constraints
    sqlite.pragma('foreign_keys = ON');
    // Store temporary tables in memory for better performance
    sqlite.pragma('temp_store = MEMORY');
    // Set busy timeout for concurrent access
    sqlite.pragma('busy_timeout = 5000');
    // Optimize for performance
    sqlite.pragma('optimize');
    console.log('⚙️ Database configured with performance optimizations');
}
async function runMigrations() {
    try {
        // For now, we'll create the migrations directory structure
        // In a real setup, we'd use drizzle-kit to generate migrations
        const migrationsFolder = path_1.default.join(__dirname, '../../../drizzle');
        // Create basic tables if they don't exist (manual migration for Phase 1)
        await createTablesIfNotExist();
        console.log('✅ Migrations completed');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}
async function createTablesIfNotExist() {
    // This is a simplified migration approach for Phase 1
    // In later phases, we'll use proper Drizzle migrations
    const tables = [
        `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      description TEXT,
      language TEXT,
      framework TEXT,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      last_opened INTEGER,
      is_active INTEGER DEFAULT 1,
      settings TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      project_id TEXT REFERENCES projects(id),
      title TEXT NOT NULL,
      description TEXT,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      is_archived INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      message_count INTEGER DEFAULT 0,
      tags TEXT,
      subject_mode TEXT DEFAULT 'general',
      model_used TEXT,
      total_tokens INTEGER DEFAULT 0,
      execution_time_ms INTEGER DEFAULT 0
    )`,
        `CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      timestamp INTEGER NOT NULL,
      parent_message_id TEXT,
      tools_used TEXT,
      execution_time_ms INTEGER,
      token_count INTEGER,
      model TEXT,
      temperature REAL,
      complexity TEXT,
      quality_score REAL
    )`,
        `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT,
      description TEXT,
      is_user_configurable INTEGER DEFAULT 1,
      updated INTEGER NOT NULL
    )`
    ];
    for (const tableSQL of tables) {
        sqlite.exec(tableSQL);
    }
    // Create indices for better performance
    const indices = [
        'CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id)',
        'CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created)',
        'CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id)',
        'CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp)',
        'CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category)'
    ];
    for (const indexSQL of indices) {
        sqlite.exec(indexSQL);
    }
}
async function initializeDefaultData() {
    try {
        // Check if we have any existing data
        const settingsCount = sqlite.prepare('SELECT COUNT(*) as count FROM settings').get();
        if (settingsCount.count === 0) {
            console.log('🔧 Initializing default settings...');
            const defaultSettings = [
                {
                    key: 'app.theme',
                    value: JSON.stringify('dark'),
                    category: 'ui',
                    description: 'Application theme (light/dark)',
                    updated: Date.now()
                },
                {
                    key: 'app.version',
                    value: JSON.stringify('1.0.0'),
                    category: 'system',
                    description: 'Application version',
                    updated: Date.now()
                },
                {
                    key: 'models.default',
                    value: JSON.stringify(''),
                    category: 'models',
                    description: 'Default LLM model',
                    updated: Date.now()
                },
                {
                    key: 'performance.max_context_entries',
                    value: JSON.stringify(1000),
                    category: 'performance',
                    description: 'Maximum context entries to maintain',
                    updated: Date.now()
                },
                {
                    key: 'ui.show_welcome',
                    value: JSON.stringify(true),
                    category: 'ui',
                    description: 'Show welcome screen on startup',
                    updated: Date.now()
                }
            ];
            const insertSetting = sqlite.prepare(`
        INSERT INTO settings (key, value, category, description, updated)
        VALUES (?, ?, ?, ?, ?)
      `);
            for (const setting of defaultSettings) {
                insertSetting.run(setting.key, setting.value, setting.category, setting.description, setting.updated);
            }
            console.log('✅ Default settings initialized');
        }
        // Initialize default subject modes
        await initializeDefaultSubjectModes();
    }
    catch (error) {
        console.error('❌ Failed to initialize default data:', error);
        throw error;
    }
}
async function initializeDefaultSubjectModes() {
    // Create subject_modes table if it doesn't exist
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS subject_modes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      tools TEXT NOT NULL,
      prompts TEXT,
      system_prompt TEXT,
      is_active INTEGER DEFAULT 1,
      is_built_in INTEGER DEFAULT 0,
      created INTEGER NOT NULL,
      updated INTEGER NOT NULL,
      usage_count INTEGER DEFAULT 0,
      color TEXT,
      shortcuts TEXT
    )
  `);
    // Check if subject modes already exist
    const modesCount = sqlite.prepare('SELECT COUNT(*) as count FROM subject_modes').get();
    if (modesCount.count === 0) {
        console.log('🧠 Initializing default subject modes...');
        const defaultModes = [
            {
                id: (0, uuid_1.v4)(),
                name: 'general',
                displayName: 'General',
                description: 'General purpose AI assistance',
                icon: '💬',
                tools: JSON.stringify(['read_file', 'write_file', 'create_todolist']),
                systemPrompt: 'You are a helpful AI assistant. Be concise, accurate, and helpful.',
                isBuiltIn: 1,
                color: '#6366f1'
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'programming',
                displayName: 'Programming',
                description: 'Code analysis, debugging, and development assistance',
                icon: '💻',
                tools: JSON.stringify(['read_file', 'write_file', 'analyze_code', 'generate_tests']),
                systemPrompt: 'You are an expert programmer. Focus on code quality, best practices, and clear explanations.',
                isBuiltIn: 1,
                color: '#10b981'
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'mathematics',
                displayName: 'Mathematics',
                description: 'Mathematical problem solving and analysis',
                icon: '🎯',
                tools: JSON.stringify(['solve_equation', 'plot_function', 'read_file', 'write_file']),
                systemPrompt: 'You are a mathematics expert. Show step-by-step solutions and use mathematical notation when appropriate.',
                isBuiltIn: 1,
                color: '#f59e0b'
            }
        ];
        const insertMode = sqlite.prepare(`
      INSERT INTO subject_modes (
        id, name, display_name, description, icon, tools, system_prompt, 
        is_built_in, created, updated, color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const now = Date.now();
        for (const mode of defaultModes) {
            insertMode.run(mode.id, mode.name, mode.displayName, mode.description, mode.icon, mode.tools, mode.systemPrompt, mode.isBuiltIn, now, now, mode.color);
        }
        console.log('✅ Default subject modes initialized');
    }
}
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}
function getRawDatabase() {
    if (!sqlite) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return sqlite;
}
// Database health check
function checkDatabaseHealth() {
    try {
        // Test basic database operations
        const result = sqlite.prepare('SELECT 1 as test').get();
        // Get database size
        const dbSize = sqlite.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get();
        // Get table count
        const tableCount = sqlite.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get();
        return {
            isHealthy: true,
            details: {
                testQuery: result,
                databaseSize: dbSize.size,
                tableCount: tableCount.count,
                walMode: sqlite.pragma('journal_mode', { simple: true }),
                foreignKeys: sqlite.pragma('foreign_keys', { simple: true })
            }
        };
    }
    catch (error) {
        return {
            isHealthy: false,
            details: { error: error instanceof Error ? error.message : String(error) }
        };
    }
}
// Cleanup function for graceful shutdown
function closeDatabase() {
    if (sqlite) {
        try {
            sqlite.close();
            console.log('📊 Database connection closed');
        }
        catch (error) {
            console.error('❌ Error closing database:', error);
        }
    }
}
// Handle app shutdown
electron_1.app.on('before-quit', () => {
    closeDatabase();
});
//# sourceMappingURL=connection.js.map