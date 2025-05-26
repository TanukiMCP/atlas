"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIPC = setupIPC;
exports.cleanupIPC = cleanupIPC;
const electron_1 = require("electron");
const connection_1 = require("../database/connection");
const uuid_1 = require("uuid");
const main_1 = require("../main");
function setupIPC() {
    console.log('🔌 Setting up IPC handlers...');
    // Database operations
    setupDatabaseHandlers();
    // Application state handlers
    setupAppHandlers();
    // Settings handlers
    setupSettingsHandlers();
    // Chat session handlers
    setupChatHandlers();
    // File system handlers (basic implementation for Phase 1)
    setupFileSystemHandlers();
    // Phase 2: LLM and Model Management handlers
    setupLLMHandlers();
    console.log('✅ IPC handlers registered');
}
function setupDatabaseHandlers() {
    // Generic database query handler (with caution)
    electron_1.ipcMain.handle('db:query', async (event, query, params) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            // Basic safety check - only allow SELECT, INSERT, UPDATE for now
            const queryType = query.trim().toUpperCase().split(' ')[0];
            if (!['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(queryType)) {
                throw new Error(`Query type ${queryType} not allowed`);
            }
            if (params) {
                return db.prepare(query).all(params);
            }
            else {
                return db.prepare(query).all();
            }
        }
        catch (error) {
            console.error('Database query failed:', error);
            throw error;
        }
    });
    // Database health check
    electron_1.ipcMain.handle('db:health', async () => {
        return (0, connection_1.checkDatabaseHealth)();
    });
}
function setupAppHandlers() {
    // Get application version
    electron_1.ipcMain.handle('app:getVersion', () => {
        return process.env.npm_package_version || '1.0.0';
    });
    // Get application paths
    electron_1.ipcMain.handle('app:getPath', async (event, name) => {
        const { app } = require('electron');
        try {
            return app.getPath(name);
        }
        catch (error) {
            console.error(`Failed to get path for ${name}:`, error);
            throw error;
        }
    });
}
function setupSettingsHandlers() {
    // Get setting value
    electron_1.ipcMain.handle('settings:get', async (event, key) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
            if (result) {
                return JSON.parse(result.value);
            }
            return null;
        }
        catch (error) {
            console.error(`Failed to get setting ${key}:`, error);
            throw error;
        }
    });
    // Set setting value
    electron_1.ipcMain.handle('settings:set', async (event, key, value) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const stmt = db.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updated)
        VALUES (?, ?, ?)
      `);
            stmt.run(key, JSON.stringify(value), Date.now());
        }
        catch (error) {
            console.error(`Failed to set setting ${key}:`, error);
            throw error;
        }
    });
    // Get all settings
    electron_1.ipcMain.handle('settings:getAll', async () => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const results = db.prepare('SELECT * FROM settings').all();
            return results.map(row => ({
                ...row,
                value: JSON.parse(row.value)
            }));
        }
        catch (error) {
            console.error('Failed to get all settings:', error);
            throw error;
        }
    });
}
function setupChatHandlers() {
    // Create new chat session
    electron_1.ipcMain.handle('chat:createSession', async (event, sessionData) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const id = (0, uuid_1.v4)();
            const now = Date.now();
            const stmt = db.prepare(`
        INSERT INTO chat_sessions (
          id, title, description, created, updated, subject_mode
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
            stmt.run(id, sessionData.title || 'New Chat', sessionData.description || null, now, now, sessionData.subjectMode || 'general');
            return {
                id,
                title: sessionData.title || 'New Chat',
                description: sessionData.description || null,
                created: now,
                updated: now,
                subjectMode: sessionData.subjectMode || 'general',
                messageCount: 0,
                isArchived: false,
                isFavorite: false
            };
        }
        catch (error) {
            console.error('Failed to create chat session:', error);
            throw error;
        }
    });
    // Get chat session
    electron_1.ipcMain.handle('chat:getSession', async (event, sessionId) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId);
            if (!session) {
                throw new Error(`Chat session ${sessionId} not found`);
            }
            return session;
        }
        catch (error) {
            console.error(`Failed to get chat session ${sessionId}:`, error);
            throw error;
        }
    });
    // Update chat session
    electron_1.ipcMain.handle('chat:updateSession', async (event, sessionId, updates) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const updateFields = [];
            const updateValues = [];
            // Build dynamic update query
            if (updates.title !== undefined) {
                updateFields.push('title = ?');
                updateValues.push(updates.title);
            }
            if (updates.description !== undefined) {
                updateFields.push('description = ?');
                updateValues.push(updates.description);
            }
            if (updates.isArchived !== undefined) {
                updateFields.push('is_archived = ?');
                updateValues.push(updates.isArchived ? 1 : 0);
            }
            if (updates.isFavorite !== undefined) {
                updateFields.push('is_favorite = ?');
                updateValues.push(updates.isFavorite ? 1 : 0);
            }
            if (updateFields.length > 0) {
                updateFields.push('updated = ?');
                updateValues.push(Date.now());
                updateValues.push(sessionId);
                const query = `UPDATE chat_sessions SET ${updateFields.join(', ')} WHERE id = ?`;
                const stmt = db.prepare(query);
                stmt.run(...updateValues);
            }
            return true;
        }
        catch (error) {
            console.error(`Failed to update chat session ${sessionId}:`, error);
            throw error;
        }
    });
    // Delete chat session
    electron_1.ipcMain.handle('chat:deleteSession', async (event, sessionId) => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            // Delete session and all related data (cascading deletes handled by foreign keys)
            db.prepare('DELETE FROM chat_sessions WHERE id = ?').run(sessionId);
            return true;
        }
        catch (error) {
            console.error(`Failed to delete chat session ${sessionId}:`, error);
            throw error;
        }
    });
    // List chat sessions
    electron_1.ipcMain.handle('chat:listSessions', async () => {
        try {
            const db = (0, connection_1.getRawDatabase)();
            const sessions = db.prepare(`
        SELECT * FROM chat_sessions 
        ORDER BY updated DESC
      `).all();
            return sessions;
        }
        catch (error) {
            console.error('Failed to list chat sessions:', error);
            throw error;
        }
    });
}
function setupFileSystemHandlers() {
    // Basic file system operations (placeholder for Phase 3)
    // Read file (placeholder)
    electron_1.ipcMain.handle('fs:readFile', async (event, filePath) => {
        // This will be implemented in Phase 3 with proper security
        console.log(`📁 [Placeholder] Read file: ${filePath}`);
        return null;
    });
    // Write file (placeholder)
    electron_1.ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
        // This will be implemented in Phase 3 with proper security
        console.log(`📁 [Placeholder] Write file: ${filePath}`);
        return true;
    });
    // Check if file exists (placeholder)
    electron_1.ipcMain.handle('fs:exists', async (event, filePath) => {
        // This will be implemented in Phase 3 with proper security
        console.log(`📁 [Placeholder] Check file exists: ${filePath}`);
        return false;
    });
}
// Error handling wrapper for IPC handlers
function handleIPC(channel, handler) {
    electron_1.ipcMain.handle(channel, async (event, ...args) => {
        try {
            return await handler(event, ...args);
        }
        catch (error) {
            console.error(`IPC Error in ${channel}:`, error);
            // Return structured error for renderer to handle
            return {
                error: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            };
        }
    });
}
function setupLLMHandlers() {
    // Ollama service handlers
    electron_1.ipcMain.handle('ollama:listModels', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.listModels();
    });
    electron_1.ipcMain.handle('ollama:getModelCatalog', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.getModelCatalog();
    });
    electron_1.ipcMain.handle('ollama:installModel', async (event, modelName) => {
        const services = main_1.tanukiApp.getServices();
        return await services.modelManager.installModel(modelName);
    });
    electron_1.ipcMain.handle('ollama:deleteModel', async (event, modelName) => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.deleteModel(modelName);
    });
    electron_1.ipcMain.handle('ollama:generate', async (event, request) => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.generateWithOptimization(request);
    });
    electron_1.ipcMain.handle('ollama:checkHealth', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.checkOllamaHealth();
    });
    electron_1.ipcMain.handle('ollama:benchmarkModel', async (event, modelName) => {
        const services = main_1.tanukiApp.getServices();
        return await services.ollama.benchmarkModel(modelName);
    });
    // System monitoring handlers
    electron_1.ipcMain.handle('system:getCapabilities', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.hardwareAssessor.assessSystemCapabilities();
    });
    electron_1.ipcMain.handle('system:getCurrentMetrics', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.systemMonitor.getCurrentMetrics();
    });
    // Model management handlers
    electron_1.ipcMain.handle('models:getRecommendations', async () => {
        const services = main_1.tanukiApp.getServices();
        return await services.modelManager.getRecommendedModels();
    });
    electron_1.ipcMain.handle('models:getInstallationStatus', async (event, modelName) => {
        const services = main_1.tanukiApp.getServices();
        return services.modelManager.getInstallationStatus(modelName);
    });
    // Optimization handlers
    electron_1.ipcMain.handle('optimization:getProfiles', async () => {
        const services = main_1.tanukiApp.getServices();
        return services.optimizationEngine.getAllProfiles();
    });
    electron_1.ipcMain.handle('optimization:optimizeForHardware', async (event, systemInfo) => {
        const services = main_1.tanukiApp.getServices();
        return await services.optimizationEngine.optimizeForHardware(systemInfo);
    });
    // Parameter tuning handlers
    electron_1.ipcMain.handle('parameters:getPreset', async (event, task) => {
        const services = main_1.tanukiApp.getServices();
        return services.parameterTuner.getPreset(task);
    });
    electron_1.ipcMain.handle('parameters:getAllPresets', async () => {
        const services = main_1.tanukiApp.getServices();
        return services.parameterTuner.getAllPresets();
    });
    electron_1.ipcMain.handle('parameters:optimizeForTask', async (event, task, modelName) => {
        const services = main_1.tanukiApp.getServices();
        return await services.parameterTuner.optimizeForTask(task, modelName);
    });
    // Context management handlers
    electron_1.ipcMain.handle('context:store', async (event, sessionId, type, key, value, importance) => {
        const services = main_1.tanukiApp.getServices();
        return await services.contextManager.storeContext(sessionId, type, key, value, importance);
    });
    electron_1.ipcMain.handle('context:retrieve', async (event, sessionId, query, maxResults) => {
        const services = main_1.tanukiApp.getServices();
        return await services.contextManager.retrieveRelevantContext(sessionId, query, maxResults);
    });
    electron_1.ipcMain.handle('context:optimize', async (event, sessionId) => {
        const services = main_1.tanukiApp.getServices();
        return await services.contextManager.optimizeContext(sessionId);
    });
}
// Clean up IPC handlers on app shutdown
function cleanupIPC() {
    // Remove all IPC handlers
    electron_1.ipcMain.removeAllListeners();
    console.log('🔌 IPC handlers cleaned up');
}
//# sourceMappingURL=handlers.js.map