import fs from 'fs';
import path from 'path';
import { Tool, ToolServer } from '../types/mcp';

interface MCPConfig {
  servers: Array<Omit<ToolServer, 'isConnected'>>;
}

class MCPToolsService {
  private configPath: string;
  private config: MCPConfig = { servers: [] };

  constructor(configPath: string = path.join(process.cwd(), 'mcp.json')) {
    this.configPath = configPath;
  }

  async loadConfig(): Promise<MCPConfig> {
    try {
      const configData = await fs.promises.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
      return this.config;
    } catch (error) {
      console.error('Failed to load MCP config:', error);
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
      console.error('Failed to save MCP config:', error);
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

export const mcpToolsService = new MCPToolsService(); 