import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { userMCPConfigService } from './userMCPConfigService';
import { Tool, ToolServer } from '../types/mcp';
import { getUserHomeDir } from '../utils/userPaths';

interface ServerInstallEvent {
  serverId: string;
  serverName: string;
  serverUrl: string;
  tools: Tool[];
}

class MCPServerDetectionService {
  private watchedDirectories: Set<string> = new Set();
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private knownServerPaths: Set<string> = new Set();
  private commonInstallPaths: string[] = [];

  constructor() {
    // Initialize common installation paths
    this.initializeCommonPaths();
  }

  /**
   * Initialize common paths where MCP servers might be installed
   */
  private initializeCommonPaths(): void {
    const homeDir = getUserHomeDir();
    
    // Common npm global installation paths
    this.commonInstallPaths = [
      path.join(homeDir, 'node_modules'),
      path.join(homeDir, '.npm', 'node_modules'),
      path.join(homeDir, '.node_modules'),
      path.join(homeDir, '.config', 'node_modules')
    ];
    
    // Add npm global prefix path
    try {
      const npmPrefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
      if (npmPrefix) {
        this.commonInstallPaths.push(path.join(npmPrefix, 'node_modules'));
      }
    } catch (error) {
      console.error('Failed to get npm prefix:', error);
    }
    
    // Add current project node_modules
    this.commonInstallPaths.push(path.join(process.cwd(), 'node_modules'));
  }

  /**
   * Start watching for MCP server installations in all common directories
   */
  startWatching(): void {
    // Watch all common installation paths
    for (const directory of this.commonInstallPaths) {
      if (fs.existsSync(directory)) {
        this.watchDirectory(directory);
      }
    }
    
    // Perform initial scan
    this.scanForExistingServers();
  }

  /**
   * Scan for existing MCP servers in common installation paths
   */
  async scanForExistingServers(): Promise<void> {
    for (const directory of this.commonInstallPaths) {
      if (fs.existsSync(directory)) {
        await this.scanDirectory(directory);
      }
    }
  }

  /**
   * Recursively scan a directory for MCP server configuration files
   */
  private async scanDirectory(directory: string, depth: number = 3): Promise<void> {
    if (depth <= 0) return;
    
    try {
      const entries = await fs.promises.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules inside node_modules to prevent deep recursion
          if (entry.name === 'node_modules' && directory.includes('node_modules')) {
            continue;
          }
          
          await this.scanDirectory(fullPath, depth - 1);
        } else if (entry.isFile() && 
                  (entry.name === 'mcp.json' || entry.name.endsWith('.mcp.json'))) {
          await this.checkForNewServer(fullPath);
          this.knownServerPaths.add(fullPath);
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${directory}:`, error);
    }
  }

  /**
   * Start watching for MCP server installations in the given directory
   */
  watchDirectory(directory: string): void {
    if (this.watchedDirectories.has(directory)) {
      return;
    }

    try {
      const watcher = fs.watch(directory, { recursive: true }, async (eventType, filename) => {
        if (!filename) return;
        
        const fullPath = path.join(directory, filename);
        
        if ((filename.endsWith('mcp.json') || filename.endsWith('.mcp.json')) && 
            !this.knownServerPaths.has(fullPath)) {
          await this.checkForNewServer(fullPath);
          this.knownServerPaths.add(fullPath);
        }
      });

      this.watchers.set(directory, watcher);
      this.watchedDirectories.add(directory);
      console.log(`Watching directory for MCP servers: ${directory}`);
    } catch (error) {
      console.error(`Failed to watch directory ${directory}:`, error);
    }
  }

  /**
   * Stop watching the given directory
   */
  stopWatching(directory: string): void {
    const watcher = this.watchers.get(directory);
    if (watcher) {
      watcher.close();
      this.watchers.delete(directory);
      this.watchedDirectories.delete(directory);
      console.log(`Stopped watching directory: ${directory}`);
    }
  }

  /**
   * Stop watching all directories
   */
  stopWatchingAll(): void {
    for (const directory of this.watchedDirectories) {
      this.stopWatching(directory);
    }
    console.log('Stopped watching all directories for MCP servers');
  }

  /**
   * Check for new MCP server in the given file
   */
  private async checkForNewServer(filePath: string): Promise<void> {
    try {
      if (!fs.existsSync(filePath)) return;
      
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const config = JSON.parse(data);
      
      // Handle different MCP config formats
      if (config.server && config.server.id && config.server.url) {
        // Format: { server: { id, name, url }, tools: [] }
        const serverEvent: ServerInstallEvent = {
          serverId: config.server.id,
          serverName: config.server.name || config.server.id,
          serverUrl: config.server.url,
          tools: config.tools || []
        };
        
        await this.handleServerInstall(serverEvent);
      } else if (config.servers && Array.isArray(config.servers)) {
        // Format: { servers: [{ id, name, url, tools: [] }] }
        for (const server of config.servers) {
          if (server.id && server.url) {
            const serverEvent: ServerInstallEvent = {
              serverId: server.id,
              serverName: server.name || server.id,
              serverUrl: server.url,
              tools: server.tools || []
            };
            
            await this.handleServerInstall(serverEvent);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to check for new server in ${filePath}:`, error);
    }
  }

  /**
   * Handle a server installation event
   */
  private async handleServerInstall(event: ServerInstallEvent): Promise<void> {
    try {
      await userMCPConfigService.initialize();
      const servers = await userMCPConfigService.getServers();
      const existingServer = servers.find(s => s.id === event.serverId);
      
      if (!existingServer) {
        await userMCPConfigService.addServer({
          id: event.serverId,
          name: event.serverName,
          url: event.serverUrl,
          tools: event.tools.map(tool => ({
            ...tool,
            server: event.serverId,
            category: 'external'
          }))
        });
        
        console.log(`Added new MCP server: ${event.serverName} (${event.serverId}) with ${event.tools.length} tools`);
      } else {
        // Update existing server if tools have changed
        const hasToolChanges = this.checkForToolChanges(existingServer.tools, event.tools);
        
        if (hasToolChanges) {
          await userMCPConfigService.updateServer(event.serverId, {
            name: event.serverName,
            url: event.serverUrl,
            tools: event.tools.map(tool => ({
              ...tool,
              server: event.serverId,
              category: 'external'
            }))
          });
          
          console.log(`Updated MCP server: ${event.serverName} (${event.serverId})`);
        }
      }
    } catch (error) {
      console.error('Failed to handle server install:', error);
    }
  }

  /**
   * Check if there are changes between two sets of tools
   */
  private checkForToolChanges(existingTools: Tool[], newTools: Tool[]): boolean {
    if (existingTools.length !== newTools.length) {
      return true;
    }
    
    const existingToolIds = new Set(existingTools.map(t => t.id));
    for (const tool of newTools) {
      if (!existingToolIds.has(tool.id)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Register a server installation manually
   */
  async registerServer(event: ServerInstallEvent): Promise<void> {
    await this.handleServerInstall(event);
  }

  /**
   * Monitor npm/npx installations for potential MCP servers
   * This should be called when the application starts
   */
  monitorPackageInstallations(): void {
    // This implementation hooks into the application startup
    // to detect when new packages are installed via npm/npx
    
    // Listen for specific installation events from the main process
    // This would typically be implemented using IPC in an Electron app
    // or through a custom event system in other environments
    
    // For demonstration, we'll just set up a periodic scan
    setInterval(() => {
      this.scanForExistingServers();
    }, 60000); // Scan every minute
  }
}

export const mcpServerDetectionService = new MCPServerDetectionService(); 