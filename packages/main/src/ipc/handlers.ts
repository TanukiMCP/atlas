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
  
  // Phase 2: LLM and Model Management (OpenRouter only)
  'openrouter:listModels': { params: []; result: any[] };
  'openrouter:generate': { params: [any]; result: any };
  'openrouter:checkHealth': { params: []; result: boolean };
  
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
  
  // Phase 1: Essential handlers
  setupDatabaseHandlers();
  setupAppHandlers(); 
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
  // Get workspace files
  ipcMain.handle('filesystem:getWorkspaceFiles', async (event: IpcMainInvokeEvent, rootPath?: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Use provided rootPath or default to the current working directory
      const workspacePath = rootPath || process.cwd();
      
      async function getFiles(dirPath: string, basePath: string = workspacePath): Promise<any[]> {
        const items: any[] = [];
        
        try {
          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          
          for (const entry of entries) {
            // Skip hidden files and node_modules
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
              continue;
            }
            
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(basePath, fullPath);
            
            const item = {
              name: entry.name,
              path: fullPath,
              relativePath: relativePath || entry.name,
              type: entry.isDirectory() ? 'directory' : 'file',
              children: undefined as any[] | undefined
            };
            
            // For directories, recursively get children (limit depth to avoid performance issues)
            if (entry.isDirectory() && relativePath.split(path.sep).length < 3) {
              try {
                item.children = await getFiles(fullPath, basePath);
              } catch (error) {
                // Skip directories we can't read
                console.warn(`Cannot read directory ${fullPath}:`, error);
                item.children = [];
              }
            }
            
            items.push(item);
          }
        } catch (error) {
          console.error(`Error reading directory ${dirPath}:`, error);
        }
        
        return items.sort((a, b) => {
          // Directories first, then files, both alphabetically
          if (a.type === 'directory' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'directory') return 1;
          return a.name.localeCompare(b.name);
        });
      }
      
      const files = await getFiles(workspacePath);
      console.log(`📁 Retrieved ${files.length} workspace files from ${workspacePath}`);
      return files;
      
    } catch (error) {
      console.error('Error getting workspace files:', error);
      return [];
    }
  });

  // Read file with content
  ipcMain.handle('fs:readFileContent', async (event: IpcMainInvokeEvent, filePath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Security: resolve path relative to current working directory
      const fullPath = path.resolve(process.cwd(), filePath);
      
      // Security: ensure file is within the workspace
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Access denied: file outside workspace');
      }
      
      const content = await fs.readFile(fullPath, 'utf8');
      console.log(`📁 Read file: ${filePath}`);
      return content;
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw error;
    }
  });
  
  // Write file with content
  ipcMain.handle('fs:writeFileContent', async (event: IpcMainInvokeEvent, filePath: string, content: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const fullPath = path.resolve(process.cwd(), filePath);
      
      // Security check
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Access denied: file outside workspace');
      }
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`📁 Wrote file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to write file ${filePath}:`, error);
      throw error;
    }
  });
  
  // Create directory
  ipcMain.handle('fs:createDirectory', async (event: IpcMainInvokeEvent, dirPath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const fullPath = path.resolve(process.cwd(), dirPath);
      
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Access denied: directory outside workspace');
      }
      
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to create directory ${dirPath}:`, error);
      throw error;
    }
  });
  
  // Delete file
  ipcMain.handle('fs:deleteFile', async (event: IpcMainInvokeEvent, filePath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const fullPath = path.resolve(process.cwd(), filePath);
      
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Access denied: file outside workspace');
      }
      
      await fs.unlink(fullPath);
      console.log(`📁 Deleted file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      throw error;
    }
  });
  
  // Delete directory
  ipcMain.handle('fs:deleteDirectory', async (event: IpcMainInvokeEvent, dirPath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const fullPath = path.resolve(process.cwd(), dirPath);
      
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Access denied: directory outside workspace');
      }
      
      await fs.rmdir(fullPath, { recursive: true });
      console.log(`📁 Deleted directory: ${dirPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete directory ${dirPath}:`, error);
      throw error;
    }
  });

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
  // OpenRouter service handlers (free models only)
  ipcMain.handle('openrouter:checkHealth', async () => {
    const services = tanukiApp.getServices();
    return await services.openrouter.checkHealth();
  });
  
  ipcMain.handle('openrouter:getAvailableModels', async () => {
    const services = tanukiApp.getServices();
    return await services.openrouter.getAvailableFreeModels();
  });
  
  ipcMain.handle('openrouter:generate', async (event: IpcMainInvokeEvent, request: any) => {
    const services = tanukiApp.getServices();
    return await services.openrouter.generate(request);
  });
  
  ipcMain.handle('openrouter:getRecommendations', async (event: IpcMainInvokeEvent, taskType: string) => {
    const services = tanukiApp.getServices();
    return await services.openrouter.getModelRecommendations(taskType as any);
  });

  ipcMain.handle('openrouter:getBestModel', async (event: IpcMainInvokeEvent, taskType: string) => {
    const services = tanukiApp.getServices();
    return await services.openrouter.getBestFreeModelForTask(taskType as any);
  });

  ipcMain.handle('openrouter:getModelInfo', async (event: IpcMainInvokeEvent, modelId: string) => {
    const services = tanukiApp.getServices();
    return services.openrouter.getModelInfo(modelId);
  });

  // OpenRouter API key management
  ipcMain.handle('openrouter:updateApiKey', async (event: IpcMainInvokeEvent, apiKey: string) => {
    const services = tanukiApp.getServices();
    // Update the API key in the service
    services.openrouter.setApiKey(apiKey);
    return { success: true };
  });

  // Storage handlers for secure API key storage
  ipcMain.handle('storage:get', async (event: IpcMainInvokeEvent, key: string) => {
    try {
      const { app } = require('electron');
      const path = require('path');
      const fs = require('fs').promises;
      
      const userDataPath = app.getPath('userData');
      const storageFile = path.join(userDataPath, 'secure-storage.json');
      
      try {
        const data = await fs.readFile(storageFile, 'utf8');
        const storage = JSON.parse(data);
        return storage[key] || null;
      } catch (error) {
        // File doesn't exist or is invalid
        return null;
      }
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  });

  ipcMain.handle('storage:set', async (event: IpcMainInvokeEvent, key: string, value: any) => {
    try {
      const { app } = require('electron');
      const path = require('path');
      const fs = require('fs').promises;
      
      const userDataPath = app.getPath('userData');
      const storageFile = path.join(userDataPath, 'secure-storage.json');
      
      let storage: Record<string, any> = {};
      try {
        const data = await fs.readFile(storageFile, 'utf8');
        storage = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start with empty object
      }
      
      storage[key] = value;
      await fs.writeFile(storageFile, JSON.stringify(storage, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  });

  ipcMain.handle('storage:remove', async (event: IpcMainInvokeEvent, key: string) => {
    try {
      const { app } = require('electron');
      const path = require('path');
      const fs = require('fs').promises;
      
      const userDataPath = app.getPath('userData');
      const storageFile = path.join(userDataPath, 'secure-storage.json');
      
      try {
        const data = await fs.readFile(storageFile, 'utf8');
        const storage = JSON.parse(data);
        delete storage[key];
        await fs.writeFile(storageFile, JSON.stringify(storage, null, 2));
      } catch (error) {
        // File doesn't exist, nothing to remove
      }
      
      return { success: true };
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  });

  // OpenRouter handlers
  ipcMain.handle('openrouter:listModels', async () => {
    try {
      // Implementation for OpenRouter model listing
      return [];
    } catch (error) {
      console.error('OpenRouter list models error:', error);
      throw error;
    }
  });
  
  ipcMain.handle('openrouter:checkHealth', async () => {
    try {
      // Implementation for OpenRouter health check
      return { isConnected: true };
    } catch (error) {
      console.error('OpenRouter health check error:', error);
      return { isConnected: false, error: error.message };
    }
  });
}

// Clean up IPC handlers on app shutdown
export function cleanupIPC(): void {
  // Remove all IPC handlers
  ipcMain.removeAllListeners();
  console.log('🔌 IPC handlers cleaned up');
} 