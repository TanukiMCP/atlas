import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { getDatabase, getRawDatabase, checkDatabaseHealth } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { tanukiApp } from '../main';

// Define IPC channel types for type safety
export interface IPCChannels {
  // Database operations
  'db:query': { params: [string, any[]?]; result: any };
  'db:health': { params: []; result: { isHealthy: boolean; details: any } };
  
  // Application state
  'app:getVersion': { params: []; result: string };
  'app:getPath': { params: [string]; result: string };
  
  // Settings management
  'settings:get': { params: [string]; result: any };
  'settings:set': { params: [string, any]; result: void };
  'settings:getAll': { params: []; result: any[] };
  
  // Chat session management
  'chat:createSession': { params: [any]; result: any };
  'chat:getSession': { params: [string]; result: any };
  'chat:updateSession': { params: [string, any]; result: any };
  'chat:deleteSession': { params: [string]; result: void };
  'chat:listSessions': { params: []; result: any[] };
  
  // File system operations (placeholder for Phase 3)
  'fs:readFile': { params: [string]; result: string | null };
  'fs:writeFile': { params: [string, string]; result: void };
  'fs:exists': { params: [string]; result: boolean };
  
  // Phase 2: LLM and Model Management
  'ollama:listModels': { params: []; result: any[] };
  'ollama:getModelCatalog': { params: []; result: any[] };
  'ollama:installModel': { params: [string]; result: void };
  'ollama:deleteModel': { params: [string]; result: void };
  'ollama:generate': { params: [any]; result: any };
  'ollama:checkHealth': { params: []; result: boolean };
  'ollama:benchmarkModel': { params: [string]; result: any };
  
  'system:getCapabilities': { params: []; result: any };
  'system:getCurrentMetrics': { params: []; result: any };
  
  'models:getRecommendations': { params: []; result: any[] };
  'models:getInstallationStatus': { params: [string]; result: any };
  
  'optimization:getProfiles': { params: []; result: any[] };
  'optimization:getActiveProfile': { params: []; result: any };
  'optimization:setProfile': { params: [string]; result: void };
  
  // Enhanced LLM operations
  'enhancedLLM:processRequest': { params: [any]; result: any };
  'enhancedLLM:getStatus': { params: []; result: any };
  'enhancedLLM:testTier': { params: [number]; result: any };
  
  // MCP Hub operations
  'mcpHub:listServers': { params: []; result: any[] };
  'mcpHub:connectServer': { params: [string]; result: void };
  'mcpHub:disconnectServer': { params: [string]; result: void };
  'mcpHub:executeCommand': { params: [string, string, any]; result: any };
  'optimization:optimizeForHardware': { params: [any]; result: any };
  
  'parameters:getPreset': { params: [string]; result: any };
  'parameters:getAllPresets': { params: []; result: any };
  'parameters:optimizeForTask': { params: [string, string]; result: any };
  
  'context:store': { params: [string, string, string, string, number?]; result: void };
  'context:retrieve': { params: [string, string, number?]; result: any[] };
  'context:optimize': { params: [string]; result: void };
}

export function setupIPC(): void {
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

function setupDatabaseHandlers(): void {
  // Generic database query handler (with caution)
  ipcMain.handle('db:query', async (event: IpcMainInvokeEvent, query: string, params?: any[]) => {
    try {
      const db = getRawDatabase();
      
      // Basic safety check - only allow SELECT, INSERT, UPDATE for now
      const queryType = query.trim().toUpperCase().split(' ')[0];
      if (!['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(queryType)) {
        throw new Error(`Query type ${queryType} not allowed`);
      }
      
      if (params) {
        return db.prepare(query).all(params);
      } else {
        return db.prepare(query).all();
      }
    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  });
  
  // Database health check
  ipcMain.handle('db:health', async () => {
    return checkDatabaseHealth();
  });
}

function setupAppHandlers(): void {
  // Get application version
  ipcMain.handle('app:getVersion', () => {
    return process.env.npm_package_version || '1.0.0';
  });
  
  // Get application paths
  ipcMain.handle('app:getPath', async (event: IpcMainInvokeEvent, name: string) => {
    const { app } = require('electron');
    
    try {
      return app.getPath(name as any);
    } catch (error) {
      console.error(`Failed to get path for ${name}:`, error);
      throw error;
    }
  });
}

function setupSettingsHandlers(): void {
  // Get setting value
  ipcMain.handle('settings:get', async (event: IpcMainInvokeEvent, key: string) => {
    try {
      const db = getRawDatabase();
      const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
      
      if (result) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error(`Failed to get setting ${key}:`, error);
      throw error;
    }
  });
  
  // Set setting value
  ipcMain.handle('settings:set', async (event: IpcMainInvokeEvent, key: string, value: any) => {
    try {
      const db = getRawDatabase();
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO settings (key, value, updated)
        VALUES (?, ?, ?)
      `);
      
      stmt.run(key, JSON.stringify(value), Date.now());
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error);
      throw error;
    }
  });
  
  // Get all settings
  ipcMain.handle('settings:getAll', async () => {
    try {
      const db = getRawDatabase();
      const results = db.prepare('SELECT * FROM settings').all() as any[];
      
      return results.map(row => ({
        ...row,
        value: JSON.parse(row.value)
      }));
    } catch (error) {
      console.error('Failed to get all settings:', error);
      throw error;
    }
  });
}

function setupChatHandlers(): void {
  // Create new chat session
  ipcMain.handle('chat:createSession', async (event: IpcMainInvokeEvent, sessionData: any) => {
    try {
      const db = getRawDatabase();
      const id = uuidv4();
      const now = Date.now();
      
      const stmt = db.prepare(`
        INSERT INTO chat_sessions (
          id, title, description, created, updated, subject_mode
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        sessionData.title || 'New Chat',
        sessionData.description || null,
        now,
        now,
        sessionData.subjectMode || 'general'
      );
      
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
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw error;
    }
  });
  
  // Get chat session
  ipcMain.handle('chat:getSession', async (event: IpcMainInvokeEvent, sessionId: string) => {
    try {
      const db = getRawDatabase();
      const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId);
      
      if (!session) {
        throw new Error(`Chat session ${sessionId} not found`);
      }
      
      return session;
    } catch (error) {
      console.error(`Failed to get chat session ${sessionId}:`, error);
      throw error;
    }
  });
  
  // Update chat session
  ipcMain.handle('chat:updateSession', async (event: IpcMainInvokeEvent, sessionId: string, updates: any) => {
    try {
      const db = getRawDatabase();
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
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
    } catch (error) {
      console.error(`Failed to update chat session ${sessionId}:`, error);
      throw error;
    }
  });
  
  // Delete chat session
  ipcMain.handle('chat:deleteSession', async (event: IpcMainInvokeEvent, sessionId: string) => {
    try {
      const db = getRawDatabase();
      
      // Delete session and all related data (cascading deletes handled by foreign keys)
      db.prepare('DELETE FROM chat_sessions WHERE id = ?').run(sessionId);
      
      return true;
    } catch (error) {
      console.error(`Failed to delete chat session ${sessionId}:`, error);
      throw error;
    }
  });
  
  // List chat sessions
  ipcMain.handle('chat:listSessions', async () => {
    try {
      const db = getRawDatabase();
      const sessions = db.prepare(`
        SELECT * FROM chat_sessions 
        ORDER BY updated DESC
      `).all();
      
      return sessions;
    } catch (error) {
      console.error('Failed to list chat sessions:', error);
      throw error;
    }
  });
}

function setupFileSystemHandlers(): void {
  // Basic file system operations (placeholder for Phase 3)
  
  // Read file (placeholder)
  ipcMain.handle('fs:readFile', async (event: IpcMainInvokeEvent, filePath: string) => {
    // This will be implemented in Phase 3 with proper security
    console.log(`📁 [Placeholder] Read file: ${filePath}`);
    return null;
  });
  
  // Write file (placeholder)
  ipcMain.handle('fs:writeFile', async (event: IpcMainInvokeEvent, filePath: string, content: string) => {
    // This will be implemented in Phase 3 with proper security
    console.log(`📁 [Placeholder] Write file: ${filePath}`);
    return true;
  });
  
  // Check if file exists (placeholder)
  ipcMain.handle('fs:exists', async (event: IpcMainInvokeEvent, filePath: string) => {
    // This will be implemented in Phase 3 with proper security
    console.log(`📁 [Placeholder] Check file exists: ${filePath}`);
    return false;
  });
}

// Error handling wrapper for IPC handlers
function handleIPC<T extends keyof IPCChannels>(
  channel: T,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<IPCChannels[T]['result']>
): void {
  ipcMain.handle(channel, async (event: IpcMainInvokeEvent, ...args: any[]) => {
    try {
      return await handler(event, ...args);
    } catch (error) {
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

function setupLLMHandlers(): void {
  // Ollama service handlers
  ipcMain.handle('ollama:listModels', async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.listModels();
  });
  
  ipcMain.handle('ollama:getModelCatalog', async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.getModelCatalog();
  });
  
  ipcMain.handle('ollama:installModel', async (event: IpcMainInvokeEvent, modelName: string) => {
    const services = tanukiApp.getServices();
    return await services.modelManager.installModel(modelName);
  });
  
  ipcMain.handle('ollama:deleteModel', async (event: IpcMainInvokeEvent, modelName: string) => {
    const services = tanukiApp.getServices();
    return await services.ollama.deleteModel(modelName);
  });
  
  ipcMain.handle('ollama:generate', async (event: IpcMainInvokeEvent, request: any) => {
    const services = tanukiApp.getServices();
    return await services.ollama.generateWithOptimization(request);
  });
  
  ipcMain.handle('ollama:checkHealth', async () => {
    const services = tanukiApp.getServices();
    return await services.ollama.checkOllamaHealth();
  });
  
  ipcMain.handle('ollama:benchmarkModel', async (event: IpcMainInvokeEvent, modelName: string) => {
    const services = tanukiApp.getServices();
    return await services.ollama.benchmarkModel(modelName);
  });
  
  // System monitoring handlers
  ipcMain.handle('system:getCapabilities', async () => {
    const services = tanukiApp.getServices();
    return await services.hardwareAssessor.assessSystemCapabilities();
  });
  
  ipcMain.handle('system:getCurrentMetrics', async () => {
    const services = tanukiApp.getServices();
    return await services.systemMonitor.getCurrentMetrics();
  });
  
  // Model management handlers
  ipcMain.handle('models:getRecommendations', async () => {
    const services = tanukiApp.getServices();
    return await services.modelManager.getRecommendedModels();
  });
  
  ipcMain.handle('models:getInstallationStatus', async (event: IpcMainInvokeEvent, modelName: string) => {
    const services = tanukiApp.getServices();
    return services.modelManager.getInstallationStatus(modelName);
  });
  
  // Optimization handlers
  ipcMain.handle('optimization:getProfiles', async () => {
    const services = tanukiApp.getServices();
    return services.optimizationEngine.getAllProfiles();
  });
  
  ipcMain.handle('optimization:optimizeForHardware', async (event: IpcMainInvokeEvent, systemInfo: any) => {
    const services = tanukiApp.getServices();
    return await services.optimizationEngine.optimizeForHardware(systemInfo);
  });
  
  // Parameter tuning handlers
  ipcMain.handle('parameters:getPreset', async (event: IpcMainInvokeEvent, task: string) => {
    const services = tanukiApp.getServices();
    return services.parameterTuner.getPreset(task);
  });
  
  ipcMain.handle('parameters:getAllPresets', async () => {
    const services = tanukiApp.getServices();
    return services.parameterTuner.getAllPresets();
  });
  
  ipcMain.handle('parameters:optimizeForTask', async (event: IpcMainInvokeEvent, task: string, modelName: string) => {
    const services = tanukiApp.getServices();
    return await services.parameterTuner.optimizeForTask(task, modelName);
  });
  
  // Context management handlers
  ipcMain.handle('context:store', async (
    event: IpcMainInvokeEvent,
    sessionId: string,
    type: string,
    key: string,
    value: string,
    importance?: number
  ) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.storeContext(sessionId, type as any, key, value, importance);
  });
  
  ipcMain.handle('context:retrieve', async (
    event: IpcMainInvokeEvent,
    sessionId: string,
    query: string,
    maxResults?: number
  ) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.retrieveRelevantContext(sessionId, query, maxResults);
  });
  
  ipcMain.handle('context:optimize', async (event: IpcMainInvokeEvent, sessionId: string) => {
    const services = tanukiApp.getServices();
    return await services.contextManager.optimizeContext(sessionId);
  });
  
  // Enhanced LLM handlers
  ipcMain.handle('enhancedLLM:processRequest', async (event: IpcMainInvokeEvent, request: any) => {
    const services = tanukiApp.getServices();
    return await services.enhancedLLM.processRequest(request);
  });
  
  ipcMain.handle('enhancedLLM:getStatus', async (event: IpcMainInvokeEvent) => {
    const services = tanukiApp.getServices();
    return services.enhancedLLM.getStatus();
  });
  
  ipcMain.handle('enhancedLLM:testTier', async (event: IpcMainInvokeEvent, tier: number) => {
    const services = tanukiApp.getServices();
    return await services.enhancedLLM.testTier(tier);
  });
  
  // MCP Hub handlers
  ipcMain.handle('mcpHub:listServers', async (event: IpcMainInvokeEvent) => {
    const services = tanukiApp.getServices();
    return services.mcpHub.listServers();
  });
  
  ipcMain.handle('mcpHub:connectServer', async (event: IpcMainInvokeEvent, serverId: string) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.connectServer(serverId);
  });
  
  ipcMain.handle('mcpHub:disconnectServer', async (event: IpcMainInvokeEvent, serverId: string) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.disconnectServer(serverId);
  });
  
  ipcMain.handle('mcpHub:executeCommand', async (event: IpcMainInvokeEvent, serverId: string, command: string, params: any) => {
    const services = tanukiApp.getServices();
    return await services.mcpHub.executeCommand(serverId, command, params);
  });
}

// Clean up IPC handlers on app shutdown
export function cleanupIPC(): void {
  // Remove all IPC handlers
  ipcMain.removeAllListeners();
  console.log('🔌 IPC handlers cleaned up');
} 