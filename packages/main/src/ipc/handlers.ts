import { app, ipcMain, IpcMainInvokeEvent, dialog, BrowserWindow } from 'electron';
import { getDatabase, getRawDatabase, checkDatabaseHealth } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { tanukiApp } from '../main';
import {
  processRequest as enhancedProcessRequest,
  getStatus as enhancedGetStatus,
  testComplexityAssessment as enhancedTestComplexity,
  setLLMDrivenComplexity as enhancedSetLLMDrivenComplexity
} from '../../../llm-enhanced/src';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

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
  'enhancedLLM:testComplexity': { params: [string]; result: boolean };
  'enhancedLLM:setLLMDrivenComplexity': { params: [boolean]; result: void };
  
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
  
  // Window control handlers
  setupWindowControlHandlers();
  
  // Mobile proxy handlers
  setupProxyHandlers();
  
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
  
  // Handle directory selection from renderer
  ipcMain.handle('dialog:showOpenDialog', async (event: IpcMainInvokeEvent, options: Electron.OpenDialogOptions) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    try {
      let result;
      if (win) {
        result = await dialog.showOpenDialog(win, options);
      } else {
        result = await dialog.showOpenDialog(options);
      }
      return result;
    } catch (error) {
      console.error('Failed to show open dialog:', error);
      throw error;
    }
  });
  
  // Set working directory
  ipcMain.handle('app:setWorkingDirectory', async (event: IpcMainInvokeEvent, dirPath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Check if directory exists
      await fs.access(dirPath);
      
      // Change process working directory
      process.chdir(dirPath);
      
      console.log(`Changed working directory to: ${dirPath}`);
      
      // Notify renderer about directory change
      const sender = event.sender;
      if (sender) {
        sender.send('app:workingDirectoryChanged', dirPath);
      }
      
      return { success: true, path: dirPath };
    } catch (error) {
      console.error(`Failed to set working directory to ${dirPath}:`, error);
      throw error;
    }
  });
  
  // Get current working directory
  ipcMain.handle('app:getWorkingDirectory', async () => {
    try {
      return process.cwd();
    } catch (error) {
      console.error('Failed to get working directory:', error);
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
  
  // Remove setting value
  ipcMain.handle('storage:remove', async (event: IpcMainInvokeEvent, key: string) => {
    try {
      const db = getRawDatabase();
      db.prepare('DELETE FROM settings WHERE key = ?').run(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove setting ${key}:`, error);
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

  // Move file or directory
  ipcMain.handle('fs:moveFile', async (event: IpcMainInvokeEvent, sourcePath: string, destPath: string) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const workspace = process.cwd();
      const fullSource = path.resolve(workspace, sourcePath);
      const fullDest = path.resolve(workspace, destPath);

      // Security: ensure both source and dest are within workspace
      if (!fullSource.startsWith(workspace) || !fullDest.startsWith(workspace)) {
        throw new Error('Access denied: cannot move items outside workspace');
      }

      // Ensure destination directory exists
      await fs.mkdir(path.dirname(fullDest), { recursive: true });
      // Perform rename/move
      await fs.rename(fullSource, fullDest);
      console.log(`📁 Moved item from ${sourcePath} to ${destPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to move item from ${sourcePath} to ${destPath}:`, error);
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

function setupSystemHandlers(): void {
  // Get system capabilities (RAM, CPU, GPU, disk space)
  ipcMain.handle('system:getCapabilities', async () => {
    try {
      const os = require('os');
      const fs = require('fs').promises;
      const path = require('path');
      const { execSync } = require('child_process');
      
      // Get total and available RAM
      const totalRam = Math.round(os.totalmem() / (1024 * 1024)); // Convert to MB
      const freeRam = Math.round(os.freemem() / (1024 * 1024)); // Convert to MB
      
      // Get CPU info
      const cpuCores = os.cpus().length;
      
      // Get disk space (for the current drive)
      let diskSpace = 0;
      let availableDiskSpace = 0;
      
      try {
        // Different commands based on platform
        if (process.platform === 'win32') {
          // Windows
          const homeDir = os.homedir();
          const drive = homeDir.split(path.sep)[0];
          const output = execSync(`wmic logicaldisk where "DeviceID='${drive}'" get Size,FreeSpace /format:csv`).toString();
          const lines = output.trim().split('\n');
          if (lines.length >= 2) {
            const values = lines[1].split(',');
            if (values.length >= 3) {
              availableDiskSpace = Math.round(parseInt(values[1]) / (1024 * 1024)); // Convert to MB
              diskSpace = Math.round(parseInt(values[2]) / (1024 * 1024)); // Convert to MB
            }
          }
        } else if (process.platform === 'darwin') {
          // macOS
          const homeDir = os.homedir();
          const output = execSync(`df -k "${homeDir}"`).toString();
          const lines = output.trim().split('\n');
          if (lines.length >= 2) {
            const values = lines[1].split(/\s+/);
            if (values.length >= 4) {
              diskSpace = Math.round(parseInt(values[1]) * 1024 / (1024 * 1024)); // Convert to MB
              availableDiskSpace = Math.round(parseInt(values[3]) * 1024 / (1024 * 1024)); // Convert to MB
            }
          }
        } else if (process.platform === 'linux') {
          // Linux
          const homeDir = os.homedir();
          const output = execSync(`df -k "${homeDir}"`).toString();
          const lines = output.trim().split('\n');
          if (lines.length >= 2) {
            const values = lines[1].split(/\s+/);
            if (values.length >= 4) {
              diskSpace = Math.round(parseInt(values[1]) * 1024 / (1024 * 1024)); // Convert to MB
              availableDiskSpace = Math.round(parseInt(values[3]) * 1024 / (1024 * 1024)); // Convert to MB
            }
          }
        }
      } catch (error) {
        console.error('Error getting disk space:', error);
      }
      
      // Try to get GPU info
      let gpuInfo = null;
      try {
        if (process.platform === 'win32') {
          // Windows
          const output = execSync('wmic path win32_VideoController get Name,AdapterRAM /format:csv').toString();
          const lines = output.trim().split('\n');
          if (lines.length >= 2) {
            const values = lines[1].split(',');
            if (values.length >= 3) {
              const gpuName = values[1];
              const gpuMemory = Math.round(parseInt(values[2]) / (1024 * 1024)); // Convert to MB
              gpuInfo = {
                name: gpuName,
                memory: gpuMemory
              };
            }
          }
        } else if (process.platform === 'darwin') {
          // macOS
          const output = execSync('system_profiler SPDisplaysDataType').toString();
          const match = output.match(/Chipset Model: (.+?)[\r\n]/);
          const vramMatch = output.match(/VRAM \(Total\): (\d+) MB/);
          if (match && vramMatch) {
            gpuInfo = {
              name: match[1],
              memory: parseInt(vramMatch[1])
            };
          }
        } else if (process.platform === 'linux') {
          // Linux
          try {
            const output = execSync('lspci | grep -i vga').toString();
            const match = output.match(/VGA compatible controller: (.+)/);
            if (match) {
              gpuInfo = {
                name: match[1],
                memory: 0 // Can't reliably get VRAM on Linux without additional tools
              };
            }
          } catch (error) {
            console.error('Error getting GPU info on Linux:', error);
          }
        }
      } catch (error) {
        console.error('Error getting GPU info:', error);
      }
      
      // Determine recommended models based on available RAM
      const recommendedModels = [];
      
      if (freeRam >= 8 * 1024) { // 8 GB+
        recommendedModels.push('llama2-13b-chat-q4_0', 'mixtral-8x7b-instruct-v0.1-q4_0');
      } else if (freeRam >= 4 * 1024) { // 4 GB+
        recommendedModels.push('llama2-7b-chat-q4_0', 'mistral-7b-instruct-v0.1-q4_0');
      } else if (freeRam >= 2 * 1024) { // 2 GB+
        recommendedModels.push('orca-mini-3b-q4_0', 'phi-2-q4_0');
      }
      
      return {
        totalRam,
        availableRam: freeRam,
        cpuCores,
        diskSpace,
        availableDiskSpace,
        gpuInfo,
        recommendedModels
      };
    } catch (error) {
      console.error('Error getting system capabilities:', error);
      throw error;
    }
  });

  // Hardware assessment for LLM usage
  ipcMain.handle('system:assessHardwareForLLM', async () => {
    try {
      const { HardwareAssessor } = require('../services/hardware-assessor');
      const hardwareAssessor = new HardwareAssessor();
      
      const assessment = await hardwareAssessor.assessHardwareForLLM();
      return assessment;
    } catch (error) {
      console.error('Error assessing hardware for LLM:', error);
      return {
        isCapable: false,
        warnings: ['Failed to assess hardware capabilities'],
        limitations: ['Hardware assessment failed'],
        optimizationTips: ['Try running the application with administrator privileges']
      };
    }
  });
}

function setupLLMHandlers(): void {
  const services = tanukiApp.getServices();
  const openrouterService = services.openrouter;

  // OpenRouter specific handlers
  ipcMain.handle('openrouter:checkHealth', async () => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      const health = await openrouterService.checkHealth();
      return health;
    } catch (error) {
      console.error('Error checking OpenRouter health:', error);
      return {
        isConnected: false,
        availableModels: [],
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  ipcMain.handle('openrouter:listModels', async () => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      return await openrouterService.getAvailableFreeModels();
    } catch (error) {
      console.error('Error listing OpenRouter models:', error);
      return [];
    }
  });

  ipcMain.handle('openrouter:generate', async (event: IpcMainInvokeEvent, params: any) => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      return await openrouterService.generate(params);
    } catch (error) {
      console.error('Error generating with OpenRouter:', error);
      throw error;
    }
  });

  ipcMain.handle('openrouter:updateApiKey', async (event: IpcMainInvokeEvent, apiKey: string) => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      openrouterService.setApiKey(apiKey);
      return true;
    } catch (error) {
      console.error('Error updating OpenRouter API key:', error);
      throw error;
    }
  });

  ipcMain.handle('openrouter:getRecommendations', async (event: IpcMainInvokeEvent, taskType: string) => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      return await openrouterService.getModelRecommendations(taskType as any);
    } catch (error) {
      console.error('Error getting model recommendations:', error);
      return [];
    }
  });

  ipcMain.handle('openrouter:getBestModel', async (event: IpcMainInvokeEvent, taskType: string) => {
    if (!openrouterService) throw new Error('OpenRouterService not available via getServices().openrouter');
    try {
      return await openrouterService.getBestFreeModelForTask(taskType as any);
    } catch (error) {
      console.error('Error getting best model for task:', error);
      return null;
    }
  });

  // Enhanced LLM handlers
  ipcMain.handle('enhancedLLM:processRequest', async (event: IpcMainInvokeEvent, request: any) => {
    try {
      return await enhancedProcessRequest(request);
    } catch (error) {
      console.error('Error processing enhancedLLM request:', error);
      throw error;
    }
  });

  ipcMain.handle('enhancedLLM:getStatus', async () => {
    try {
      return await enhancedGetStatus();
    } catch (error) {
      console.error('Error getting enhancedLLM status:', error);
      throw error;
    }
  });

  ipcMain.handle('enhancedLLM:testComplexity', async (event: IpcMainInvokeEvent, query: string) => {
    try {
      return await enhancedTestComplexity(query);
    } catch (error) {
      console.error('Error testing complexity with enhancedLLM:', error);
      throw error;
    }
  });

  ipcMain.handle('enhancedLLM:setLLMDrivenComplexity', async (event: IpcMainInvokeEvent, enabled: boolean) => {
    try {
      await enhancedSetLLMDrivenComplexity(enabled);
      return { success: true };
    } catch (error) {
      console.error('Error setting LLM-driven complexity:', error);
      throw new Error(`Failed to set LLM-driven complexity: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // System and Model Management Handlers (placeholders or to be reviewed)
  // These might need to interact with systemMonitor or other services
  ipcMain.handle('system:getCapabilities', async () => { 
    // const systemMonitor = tanukiApp.getServices()?.systemMonitor;
    // return systemMonitor?.getCapabilities(); 
    return { /* placeholder */ }; 
  });
  
  ipcMain.handle('system:getCurrentMetrics', async () => { 
    // const systemMonitor = tanukiApp.getServices()?.systemMonitor;
    // return systemMonitor?.getCurrentMetrics(); 
    return { /* placeholder */ }; 
  });
  
  ipcMain.handle('models:getRecommendations', async () => { 
    return []; /* placeholder */ 
  });
  
  ipcMain.handle('models:getInstallationStatus', async (event: IpcMainInvokeEvent, modelName: string) => { 
    return { modelName, installed: false }; /* placeholder */ 
  });
}

function setupWindowControlHandlers(): void {
  const { BrowserWindow, ipcMain } = require('electron');
  
  // Minimize window
  ipcMain.on('minimize-window', (event: Electron.IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.minimize();
    }
  });
  
  // Maximize window
  ipcMain.on('maximize-window', (event: Electron.IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
      // Notify the renderer of the maximized state change
      event.sender.send('window-maximized-change', win.isMaximized());
    }
  });
  
  // Close window
  ipcMain.on('close-window', (event: Electron.IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.close();
    }
  });
  
  // Toggle fullscreen
  ipcMain.on('toggle-fullscreen', (event: Electron.IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setFullScreen(!win.isFullScreen());
    }
  });
  
  // Check if window is maximized
  ipcMain.handle('window:isMaximized', (event: Electron.IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win ? win.isMaximized() : false;
  });
  
  // Check if window is in fullscreen
  ipcMain.handle('window:isFullScreen', (event: Electron.IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win ? win.isFullScreen() : false;
  });
  
  // Set up event listeners for window state changes
  const allWindows = BrowserWindow.getAllWindows();
  allWindows.forEach((win: Electron.BrowserWindow) => {
    win.on('maximize', () => {
      win.webContents.send('window-maximized-change', true);
    });
    
    win.on('unmaximize', () => {
      win.webContents.send('window-maximized-change', false);
    });
    
    win.on('enter-full-screen', () => {
      win.webContents.send('window-fullscreen-change', true);
    });
    
    win.on('leave-full-screen', () => {
      win.webContents.send('window-fullscreen-change', false);
    });
  });
}

function setupProxyHandlers(): void {
  // Import proxy server
  const { proxyServer } = require('../ProxyServer');

  // Get proxy status
  ipcMain.handle('get-proxy-status', () => {
    const status = proxyServer.getStatus();
    return {
      active: status.running,
      port: status.port,
      clients: status.clientCount,
      clientDetails: status.clients
    };
  });
  
  // Start proxy server
  ipcMain.handle('start-proxy-server', async () => {
    try {
      // Get the window state from main process
      const mainWindow = require('../main').tanukiApp.getMainWindow();
      const windowState = {
        proxyActive: false,
        proxyPort: null,
        connectedClients: 0,
        qrCodeUrl: null
      };

      if (windowState.proxyActive) {
        return {
          success: true,
          active: true,
          port: windowState.proxyPort,
          clients: windowState.connectedClients
        };
      }

      const port = await proxyServer.start();
      
      // Update window state
      windowState.proxyActive = true;
      windowState.proxyPort = port;
      
      return {
        success: true,
        active: true,
        port,
        clients: 0
      };
    } catch (error) {
      console.error('Failed to start proxy server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  // Stop proxy server
  ipcMain.handle('stop-proxy-server', async () => {
    try {
      await proxyServer.stop();
      
      // Update window state in main process
      const mainWindow = require('../main').tanukiApp.getMainWindow();
      const windowState = {
        proxyActive: false,
        proxyPort: null,
        connectedClients: 0,
        qrCodeUrl: null
      };
      
      return { success: true };
    } catch (error) {
      console.error('Failed to stop proxy server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  // Generate pairing QR code
  ipcMain.handle('generate-pairing-qrcode', async () => {
    try {
      const result = await proxyServer.generatePairingQRCode();
      
      // Update window state in main process
      const mainWindow = require('../main').tanukiApp.getMainWindow();
      const windowState = {
        qrCodeUrl: result.qrCode
      };
      
      return {
        success: true,
        qrCode: result.qrCode,
        token: result.token,
        connectionUrl: result.connectionUrl
      };
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  // Show proxy status window
  ipcMain.handle('show-proxy-status-window', async () => {
    try {
      await proxyServer.showStatusWindow();
      return { success: true };
    } catch (error) {
      console.error('Failed to show proxy status window:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  // Send chat response to mobile client
  ipcMain.handle('send-proxy-chat-response', async (event, args) => {
    const { clientId, message, messageId } = args;
    const success = proxyServer.sendChatResponse(clientId, message, messageId);
    return { success };
  });

  // Forward proxy server lifecycle events to renderer
  const mainWindow = tanukiApp.getMainWindow();
  proxyServer.on('started', (port: number) => {
    mainWindow?.webContents.send('proxy-status-changed', {
      active: true,
      port,
      clients: proxyServer.getConnectedClients().length
    });
  });
  proxyServer.on('stopped', () => {
    mainWindow?.webContents.send('proxy-status-changed', {
      active: false,
      port: null,
      clients: 0
    });
  });
}

// Clean up IPC handlers on app shutdown
export function cleanupIPC(): void {
  // Remove all IPC handlers
  ipcMain.removeAllListeners();
  console.log('🔌 IPC handlers cleaned up');
} 