/**
 * MCP Configuration Service
 * Handles reading/writing the MCP configuration file and managing MCP servers
 */

import { EventEmitter } from 'events';
import { useMCPStore } from '../stores/mcp-store';
import { MCPServer, MCPServerStatus } from './mcp-client';
import fs from 'fs/promises';
import path from 'path';

// Define interfaces for the configuration file structure
export interface MCPConfig {
  version: string;
  servers: MCPServerConfig[];
  settings: MCPSettings;
  toolCategories: MCPToolCategory[];
}

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  protocol: 'websocket' | 'http';
  autoConnect: boolean;
  enabled: boolean;
  capabilities: string[];
}

export interface MCPSettings {
  autoDiscovery: boolean;
  discoveryPorts: number[];
  discoveryTimeout: number;
  healthCheckInterval: number;
  autoReconnect: boolean;
  maxReconnectAttempts: number;
}

export interface MCPToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Default configuration
const DEFAULT_CONFIG: MCPConfig = {
  version: '1.0.0',
  servers: [
    {
      id: 'desktop-commander',
      name: 'Desktop Commander',
      description: 'File system operations and command execution',
      url: 'ws://localhost:8765',
      protocol: 'websocket',
      autoConnect: true,
      enabled: true,
      capabilities: ['file_operations', 'command_execution', 'search']
    },
    {
      id: 'clear-thought',
      name: 'Clear Thought',
      description: 'Advanced reasoning and thinking tools',
      url: 'ws://localhost:8766',
      protocol: 'websocket',
      autoConnect: true,
      enabled: true,
      capabilities: ['thinking', 'reasoning', 'analysis']
    }
  ],
  settings: {
    autoDiscovery: true,
    discoveryPorts: [8765, 8766, 8767, 8768, 8769, 8770],
    discoveryTimeout: 5000,
    healthCheckInterval: 30000,
    autoReconnect: true,
    maxReconnectAttempts: 5
  },
  toolCategories: [
    {
      id: 'file-system',
      name: 'File System',
      description: 'Tools for working with files and directories',
      icon: '📁'
    },
    {
      id: 'reasoning',
      name: 'Reasoning',
      description: 'Advanced reasoning and thinking tools',
      icon: '🧠'
    },
    {
      id: 'web',
      name: 'Web',
      description: 'Tools for web browsing and automation',
      icon: '🌐'
    },
    {
      id: 'code',
      name: 'Code',
      description: 'Tools for code analysis and generation',
      icon: '💻'
    }
  ]
};

// Define the path to the config file
const CONFIG_PATH = 'config/mcp.json';

class MCPConfigService extends EventEmitter {
  private config: MCPConfig = DEFAULT_CONFIG;
  private configPath: string = CONFIG_PATH;
  private isLoaded: boolean = false;

  constructor() {
    super();
  }

  /**
   * Load the configuration file
   */
  async loadConfig(): Promise<MCPConfig> {
    try {
      // Check if config directory exists
      const configDir = path.dirname(this.configPath);
      
      try {
        await fs.access(configDir);
      } catch (error) {
        // Create config directory if it doesn't exist
        await fs.mkdir(configDir, { recursive: true });
      }

      // Check if config file exists
      try {
        await fs.access(this.configPath);
      } catch (error) {
        // Create config file with default config if it doesn't exist
        await fs.writeFile(this.configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
      }

      // Read config file
      const configData = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
      this.isLoaded = true;
      
      // Update MCP store with servers from config
      this.updateMCPStore();
      
      return this.config;
    } catch (error) {
      console.error('Failed to load MCP config:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Save the configuration file
   */
  async saveConfig(): Promise<void> {
    try {
      // Ensure config directory exists
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });

      // Write config file
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
      
      // Update MCP store with servers from config
      this.updateMCPStore();
      
      this.emit('config-saved', this.config);
    } catch (error) {
      console.error('Failed to save MCP config:', error);
      throw error;
    }
  }

  /**
   * Add a server to the configuration
   */
  async addServer(serverConfig: Omit<MCPServerConfig, 'id'>): Promise<void> {
    if (!this.isLoaded) {
      await this.loadConfig();
    }

    // Generate a unique ID for the server
    const id = `server-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Add server to config
    this.config.servers.push({
      ...serverConfig,
      id
    });
    
    // Save config
    await this.saveConfig();
  }

  /**
   * Remove a server from the configuration
   */
  async removeServer(serverId: string): Promise<void> {
    if (!this.isLoaded) {
      await this.loadConfig();
    }

    // Remove server from config
    this.config.servers = this.config.servers.filter(server => server.id !== serverId);
    
    // Save config
    await this.saveConfig();
  }

  /**
   * Update MCP store with servers from config
   */
  private updateMCPStore(): void {
    const { setServers } = useMCPStore.getState();
    
    // Map config servers to MCP servers
    const mcpServers: MCPServer[] = this.config.servers.map(server => ({
      id: server.id,
      name: server.name,
      description: server.description,
      url: server.url,
      protocol: server.protocol,
      status: 'disconnected' as MCPServerStatus,
      capabilities: server.capabilities,
      autoConnect: server.autoConnect,
      enabled: server.enabled
    }));
    
    // Update MCP store
    setServers(mcpServers);
  }
}

// Export singleton instance
const mcpConfigService = new MCPConfigService();
export default mcpConfigService; 