export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface MCPClientInterface {
  executeToolCall(toolCall: MCPToolCall): Promise<MCPToolResult>;
  isConnected(): boolean;
  getAvailableTools(): Promise<string[]>;
}

// This adapter will be injected with the actual MCP hub service
export class MCPClientAdapter implements MCPClientInterface {
  private mcpHubService: any = null;

  setMCPHubService(service: any): void {
    this.mcpHubService = service;
  }

  async executeToolCall(toolCall: MCPToolCall): Promise<MCPToolResult> {
    if (!this.mcpHubService) {
      return {
        success: false,
        error: 'MCP hub service not configured'
      };
    }

    try {
      // Execute the tool call through the MCP hub
      const result = await this.mcpHubService.executeTool(toolCall.name, toolCall.arguments);
      
      return {
        success: true,
        content: typeof result === 'string' ? result : JSON.stringify(result),
        metadata: { toolName: toolCall.name }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { toolName: toolCall.name }
      };
    }
  }

  isConnected(): boolean {
    return this.mcpHubService !== null;
  }

  async getAvailableTools(): Promise<string[]> {
    if (!this.mcpHubService) {
      return [];
    }

    try {
      const tools = await this.mcpHubService.getAvailableTools();
      return tools.map((tool: any) => tool.name || tool.id);
    } catch (error) {
      console.error('Failed to get available MCP tools:', error);
      return [];
    }
  }
}

export const mcpClientAdapter = new MCPClientAdapter(); 