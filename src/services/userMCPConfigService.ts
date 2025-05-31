import fs from 'fs';
import path from 'path';
import { Tool, ToolServer } from '../types/mcp';
import { getUserMCPConfigPath, getAtlasConfigDir } from '../utils/userPaths';

interface MCPConfig {
  servers: Array<Omit<ToolServer, 'isConnected'>>;
}

class UserMCPConfigService {
  private configPath: string;
  private config: MCPConfig = { servers: [] };
  private defaultConfigPath: string;

  constructor() {
    this.configPath = getUserMCPConfigPath();
    this.defaultConfigPath = path.join(process.cwd(), 'mcp.json');
  }

  async initialize(): Promise<void> {
    // Create config directory if it doesn't exist
    const configDir = getAtlasConfigDir();
    if (!fs.existsSync(configDir)) {
      await fs.promises.mkdir(configDir, { recursive: true });
    }
    
    // Create user config file if it doesn't exist
    if (!fs.existsSync(this.configPath)) {
      // Copy default config if it exists
      if (fs.existsSync(this.defaultConfigPath)) {
        await fs.promises.copyFile(this.defaultConfigPath, this.configPath);
      } else {
        // Create empty config
        await this.saveConfig({ servers: [] });
      }
    }
    
    await this.loadConfig();
  }

  getConfigPath(): string {
    return this.configPath;
  }

  async loadConfig(): Promise<MCPConfig> {
    try {
      const configData = await fs.promises.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
      return this.config;
    } catch (error) {
      console.error('Failed to load user MCP config:', error);
      return { servers: [] };
    }
  }

  async saveConfig(config: MCPConfig): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
      this.config = config;
    } catch (error) {
      console.error('Failed to save user MCP config:', error);
      throw error;
    }
  }

  async getServers(): Promise<ToolServer[]> {
    if (this.config.servers.length === 0) {
      await this.loadConfig();
    }

    return Promise.all(
      this.config.servers.map(async (server) => {
        const isConnected = await this.checkServerConnection(server.url);
        return {
          ...server,
          isConnected
        };
      })
    );
  }

  private async checkServerConnection(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async addServer(server: Omit<ToolServer, 'isConnected'>): Promise<void> {
    const newConfig: MCPConfig = {
      servers: [
        ...this.config.servers,
        server
      ]
    };

    await this.saveConfig(newConfig);
  }

  async removeServer(serverId: string): Promise<void> {
    const newConfig: MCPConfig = {
      servers: this.config.servers.filter(s => s.id !== serverId)
    };

    await this.saveConfig(newConfig);
  }

  async updateServer(serverId: string, updates: Partial<Omit<ToolServer, 'isConnected'>>): Promise<void> {
    const newConfig: MCPConfig = {
      servers: this.config.servers.map(server => 
        server.id === serverId
          ? { ...server, ...updates }
          : server
      )
    };

    await this.saveConfig(newConfig);
  }
}

export const userMCPConfigService = new UserMCPConfigService(); 