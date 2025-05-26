"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionRouter = void 0;
const eventemitter3_1 = require("eventemitter3");
class ExecutionRouter extends eventemitter3_1.EventEmitter {
    builtinExecutor;
    externalExecutor;
    activeExecutions = new Map();
    executionQueue = new Map();
    constructor() {
        super();
        this.initializeExecutors();
    }
    async initializeExecutors() {
        try {
            // Initialize builtin tool executor
            const { TanukiMCPServer } = await Promise.resolve().then(() => __importStar(require('@tanukimcp/mcp-server')));
            this.builtinExecutor = new TanukiMCPServer();
            // Initialize external tool executor
            const { MCPClientHub } = await Promise.resolve().then(() => __importStar(require('@tanukimcp/mcp-hub')));
            this.externalExecutor = new MCPClientHub();
            console.log('Execution router initialized');
        }
        catch (error) {
            console.error('Failed to initialize execution router:', error);
            throw error;
        }
    }
    async execute(tool, parameters, context) {
        const executionId = `${tool.id}:${context.messageId}`;
        // Check if already executing
        if (this.executionQueue.has(executionId)) {
            console.log(`Tool ${tool.id} already executing, waiting for completion...`);
            return await this.executionQueue.get(executionId);
        }
        // Create execution promise
        const executionPromise = this.performExecution(tool, parameters, context);
        this.executionQueue.set(executionId, executionPromise);
        try {
            const result = await executionPromise;
            return result;
        }
        finally {
            this.executionQueue.delete(executionId);
        }
    }
    async performExecution(tool, parameters, context) {
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
            let result;
            // Route to appropriate executor
            if (tool.source.type === 'builtin') {
                result = await this.executeBuiltinTool(tool, parameters, abortController.signal);
            }
            else {
                result = await this.executeExternalTool(tool, parameters, abortController.signal);
            }
            clearTimeout(timeoutId);
            const executionTime = Date.now() - startTime;
            const executionResult = {
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
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const executionError = error;
            const executionResult = {
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
        }
        finally {
            this.activeExecutions.delete(executionId);
        }
    }
    async executeBuiltinTool(tool, parameters, signal) {
        try {
            // Validate that the tool exists in builtin server
            const availableTools = await this.builtinExecutor.listTools();
            const toolExists = availableTools.some((t) => t.name === tool.name);
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
        }
        catch (error) {
            console.error(`Failed to execute builtin tool ${tool.name}:`, error);
            throw error;
        }
    }
    async executeExternalTool(tool, parameters, signal) {
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
        }
        catch (error) {
            console.error(`Failed to execute external tool ${tool.name}:`, error);
            throw error;
        }
    }
    categorizeError(error) {
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
    isRecoverableError(error) {
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
    getMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapUsed;
        }
        return 0;
    }
    async abortExecution(toolId, messageId) {
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
    getActiveExecutions() {
        return Array.from(this.activeExecutions.keys());
    }
    async shutdown() {
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
exports.ExecutionRouter = ExecutionRouter;
//# sourceMappingURL=execution-router.js.map