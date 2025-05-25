import { EventEmitter } from 'eventemitter3';
import { UnifiedTool, ToolExecutionContext, ToolExecutionResult } from '../types/tool-router-types';

export interface ExecutionRouterEvents {
  'execution:started': (toolId: string, source: string) => void;
  'execution:completed': (toolId: string, result: ToolExecutionResult) => void;
  'execution:failed': (toolId: string, error: Error) => void;
  'fallback:triggered': (originalTool: string, fallbackTool: string) => void;
  'timeout:occurred': (toolId: string, timeoutMs: number) => void;
}

export class ExecutionRouter extends EventEmitter<ExecutionRouterEvents> {
  private builtinExecutor: any;
  private externalExecutor: any;
  private activeExecutions: Map<string, AbortController> = new Map();
  private executionQueue: Map<string, Promise<any>> = new Map();

  constructor() {
    super();
    this.initializeExecutors();
  }

  private async initializeExecutors(): Promise<void> {
    try {
      // Initialize builtin tool executor
      const { TanukiMCPServer } = await import('@tanukimcp/mcp-server');
      this.builtinExecutor = new TanukiMCPServer();
      
      // Initialize external tool executor
      const { MCPClientHub } = await import('@tanukimcp/mcp-hub');
      this.externalExecutor = new MCPClientHub();
      
      console.log('Execution router initialized');
    } catch (error) {
      console.error('Failed to initialize execution router:', error);
      throw error;
    }
  }

  async execute(
    tool: UnifiedTool, 
    parameters: any, 
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    
    const executionId = `${tool.id}:${context.messageId}`;
    
    // Check if already executing
    if (this.executionQueue.has(executionId)) {
      console.log(`Tool ${tool.id} already executing, waiting for completion...`);
      return await this.executionQueue.get(executionId)!;
    }
    
    // Create execution promise
    const executionPromise = this.performExecution(tool, parameters, context);
    this.executionQueue.set(executionId, executionPromise);
    
    try {
      const result = await executionPromise;
      return result;
    } finally {
      this.executionQueue.delete(executionId);
    }
  }

  private async performExecution(
    tool: UnifiedTool,
    parameters: any,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    
    const startTime = Date.now();
    const abortController = new AbortController();
    const executionId = `${tool.id}:${context.messageId}`;
    
    this.activeExecutions.set(executionId, abortController);
    this.emit('execution:started', tool.id, tool.source.type);
    
    try {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        abortController.abort();
        this.emit('timeout:occurred', tool.id, context.timeoutMs);
      }, context.timeoutMs);
      
      let result: any;
      
      // Route to appropriate executor
      if (tool.source.type === 'builtin') {
        result = await this.executeBuiltinTool(tool, parameters, abortController.signal);
      } else {
        result = await this.executeExternalTool(tool, parameters, abortController.signal);
      }
      
      clearTimeout(timeoutId);
      
      const executionTime = Date.now() - startTime;
      
      const executionResult: ToolExecutionResult = {
        toolId: tool.id,
        success: true,
        result: result,
        executionTime,
        source: tool.source,
        metadata: {
          startTime: new Date(startTime),
          endTime: new Date(),
          memoryUsage: this.getMemoryUsage(),
          networkCalls: result.networkCalls || 0,
          cacheHits: result.cacheHits || 0
        }
      };
      
      this.emit('execution:completed', tool.id, executionResult);
      return executionResult;
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const executionError = error as Error;
      
      const executionResult: ToolExecutionResult = {
        toolId: tool.id,
        success: false,
        error: {
          message: executionError.message,
          type: this.categorizeError(executionError),
          recoverable: this.isRecoverableError(executionError)
        },
        executionTime,
        source: tool.source
      };
      
      this.emit('execution:failed', tool.id, executionError);
      return executionResult;
      
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }  private async executeBuiltinTool(tool: UnifiedTool, parameters: any, signal: AbortSignal): Promise<any> {
    try {
      // Validate that the tool exists in builtin server
      const availableTools = await this.builtinExecutor.listTools();
      const toolExists = availableTools.some((t: any) => t.name === tool.name);
      
      if (!toolExists) {
        throw new Error(`Builtin tool ${tool.name} not found`);
      }
      
      // Execute the tool with timeout and abort signal handling
      const result = await Promise.race([
        this.builtinExecutor.callTool(tool.name, parameters),
        new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('Execution aborted'));
          });
        })
      ]);
      
      return result;
      
    } catch (error) {
      console.error(`Failed to execute builtin tool ${tool.name}:`, error);
      throw error;
    }
  }

  private async executeExternalTool(tool: UnifiedTool, parameters: any, signal: AbortSignal): Promise<any> {
    try {
      // Get the external server for this tool
      const server = await this.externalExecutor.getServer(tool.source.id);
      
      if (!server || !server.isConnected) {
        throw new Error(`External server ${tool.source.id} not available`);
      }
      
      // Execute the tool through the external server
      const result = await Promise.race([
        this.externalExecutor.callTool(tool.source.id, tool.name, parameters),
        new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('Execution aborted'));
          });
        })
      ]);
      
      return result;
      
    } catch (error) {
      console.error(`Failed to execute external tool ${tool.name}:`, error);
      throw error;
    }
  }

  private categorizeError(error: Error): 'validation_error' | 'execution_error' | 'timeout_error' | 'network_error' | 'permission_error' {
    const message = error.message.toLowerCase();
    
    if (message.includes('abort') || message.includes('timeout')) {
      return 'timeout_error';
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation_error';
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
      return 'network_error';
    }
    
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'permission_error';
    }
    
    return 'execution_error';
  }

  private isRecoverableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    
    // Non-recoverable errors
    if (message.includes('permission') || message.includes('unauthorized')) {
      return false;
    }
    
    if (message.includes('not found') || message.includes('does not exist')) {
      return false;
    }
    
    // Most other errors are potentially recoverable
    return true;
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  async abortExecution(toolId: string, messageId: string): Promise<boolean> {
    const executionId = `${toolId}:${messageId}`;
    const controller = this.activeExecutions.get(executionId);
    
    if (controller) {
      controller.abort();
      this.activeExecutions.delete(executionId);
      this.executionQueue.delete(executionId);
      return true;
    }
    
    return false;
  }

  getActiveExecutions(): string[] {
    return Array.from(this.activeExecutions.keys());
  }

  async shutdown(): Promise<void> {
    // Abort all active executions
    for (const [executionId, controller] of this.activeExecutions.entries()) {
      controller.abort();
      console.log(`Aborted execution: ${executionId}`);
    }
    
    this.activeExecutions.clear();
    this.executionQueue.clear();
    
    // Shutdown executors
    if (this.builtinExecutor?.shutdown) {
      await this.builtinExecutor.shutdown();
    }
    
    if (this.externalExecutor?.shutdown) {
      await this.externalExecutor.shutdown();
    }
    
    this.removeAllListeners();
  }
}