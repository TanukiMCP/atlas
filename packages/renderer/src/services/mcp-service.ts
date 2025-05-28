/**
 * MCP Service - Real tool integration for TanukiMCP Atlas
 * Handles tool discovery, execution, and result management
 * Now integrated with real MCP client
 */

import { useMCPStore } from '../stores/mcp-store';

export interface MCPTool {
  name: string;
  description: string;
  category: 'file' | 'code' | 'web' | 'task' | 'project' | 'thinking';
  icon: string;
  parameters: MCPToolParameter[];
  operationalMode: 'agent' | 'chat' | 'both';
  schema?: any;
}

export interface MCPToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface MCPToolResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  toolName: string;
  timestamp: Date;
}

export interface MCPExecutionContext {
  toolName: string;
  parameters: Record<string, any>;
  operationalMode: 'agent' | 'chat';
  sessionId?: string;
}

class MCPService {
  private tools: MCPTool[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeTools();
  }

  private async initializeTools() {
    // Initialize with available MCP tools
    this.tools = [
      // Agent Mode Tools - File Operations
      {
        name: 'read_file',
        description: 'Read contents of a file',
        category: 'file',
        icon: '📖',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'file', description: 'File path to read', required: true }
        ]
      },
      {
        name: 'write_file',
        description: 'Write content to a file',
        category: 'file',
        icon: '✏️',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'file', description: 'File path to write', required: true },
          { name: 'content', type: 'string', description: 'Content to write', required: true }
        ]
      },
      {
        name: 'create_directory',
        description: 'Create a new directory',
        category: 'file',
        icon: '📁',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'string', description: 'Directory path to create', required: true }
        ]
      },
      {
        name: 'list_directory',
        description: 'List files in directory',
        category: 'file',
        icon: '📋',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'string', description: 'Directory path to list', required: true }
        ]
      },
      {
        name: 'delete_file',
        description: 'Delete a file or directory',
        category: 'file',
        icon: '🗑️',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'file', description: 'Path to delete', required: true }
        ]
      },
      
      // Agent Mode Tools - Code Operations
      {
        name: 'execute_command',
        description: 'Execute a terminal command',
        category: 'task',
        icon: '⚡',
        operationalMode: 'agent',
        parameters: [
          { name: 'command', type: 'string', description: 'Command to execute', required: true },
          { name: 'timeout', type: 'number', description: 'Timeout in seconds', required: false, defaultValue: 30 }
        ]
      },
      {
        name: 'search_files',
        description: 'Search for files by pattern',
        category: 'file',
        icon: '🔍',
        operationalMode: 'agent',
        parameters: [
          { name: 'path', type: 'string', description: 'Search directory', required: true },
          { name: 'pattern', type: 'string', description: 'Search pattern', required: true }
        ]
      },
      
      // Chat Mode Tools - Thinking Tools
      {
        name: 'sequential_thinking',
        description: 'Step-by-step reasoning process',
        category: 'thinking',
        icon: '🧠',
        operationalMode: 'chat',
        parameters: [
          { name: 'thought', type: 'string', description: 'Current thinking step', required: true },
          { name: 'total_thoughts', type: 'number', description: 'Estimated total thoughts', required: true }
        ]
      },
      {
        name: 'web_search',
        description: 'Search the web for information',
        category: 'web',
        icon: '🌐',
        operationalMode: 'chat',
        parameters: [
          { name: 'search_term', type: 'string', description: 'Search query', required: true }
        ]
      },
      
      // Both Modes
      {
        name: 'analyze_project',
        description: 'Analyze project structure and health',
        category: 'project',
        icon: '📊',
        operationalMode: 'both',
        parameters: [
          { name: 'path', type: 'string', description: 'Project root path', required: true }
        ]
      }
    ];

    this.isInitialized = true;
  }

  /**
   * Get available tools for the current operational mode
   */
  getAvailableTools(operationalMode: 'agent' | 'chat'): MCPTool[] {
    return this.tools.filter(tool => 
      tool.operationalMode === operationalMode || tool.operationalMode === 'both'
    );
  }

  /**
   * Search tools by name or description
   */
  searchTools(query: string, operationalMode: 'agent' | 'chat'): MCPTool[] {
    const availableTools = this.getAvailableTools(operationalMode);
    return availableTools.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Execute a tool with given parameters
   */
  async executeTool(context: MCPExecutionContext): Promise<MCPToolResult> {
    const startTime = Date.now();
    
    try {
      // Find the tool
      const tool = this.tools.find(t => t.name === context.toolName);
      if (!tool) {
        throw new Error(`Tool '${context.toolName}' not found`);
      }

      // Validate operational mode
      if (tool.operationalMode !== 'both' && tool.operationalMode !== context.operationalMode) {
        throw new Error(`Tool '${context.toolName}' is not available in ${context.operationalMode} mode`);
      }

      // Validate parameters
      this.validateParameters(tool, context.parameters);

      // Execute the tool based on its type
      const result = await this.executeToolInternal(tool, context.parameters);

      return {
        success: true,
        result,
        executionTime: Date.now() - startTime,
        toolName: context.toolName,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: Date.now() - startTime,
        toolName: context.toolName,
        timestamp: new Date()
      };
    }
  }

  private validateParameters(tool: MCPTool, parameters: Record<string, any>) {
    for (const param of tool.parameters) {
      if (param.required && !(param.name in parameters)) {
        throw new Error(`Required parameter '${param.name}' is missing`);
      }
    }
  }

  private async executeToolInternal(tool: MCPTool, parameters: Record<string, any>): Promise<any> {
    // Try to execute via real MCP servers
    try {
      const mcpStore = useMCPStore.getState();
      const result = await mcpStore.executeTool(tool.name, parameters);
      return result;
    } catch (error) {
      // Log the actual error for debugging
      console.error(`MCP execution failed for ${tool.name}:`, error);
      
      // Throw a descriptive error instead of falling back to mock
      throw new Error(
        `Tool '${tool.name}' is currently unavailable. ` +
        `This may be because:\n` +
        `• The MCP server providing this tool is not connected\n` +
        `• The tool requires additional configuration\n` +
        `• There was a network or communication error\n\n` +
        `Please check your MCP server connections in the settings and try again.\n` +
        `Original error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get tool by name
   */
  getTool(name: string): MCPTool | undefined {
    return this.tools.find(tool => tool.name === name);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const mcpService = new MCPService();