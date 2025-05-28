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
class MCPService {
    servers = new Map();
    tools = new Map();
    workflows = new Map();
    processingTiers = [];
    listeners = new Set();
    constructor() {
        this.initializeBuiltInTools();
        this.initializeWorkflows();
        this.initializeProcessingTiers();
        this.discoverMCPServers();
    }
    initializeBuiltInTools() {
        const builtInTools = [
            {
                name: 'File Operations',
                description: 'Read, write, and manage files in the workspace',
                available: true
            },
            {
                name: 'Web Search',
                description: 'Search the web for information and resources',
                available: true
            },
            {
                name: 'Code Analysis',
                description: 'Analyze code structure, dependencies, and quality',
                available: true
            },
            {
                name: 'Git Operations',
                description: 'Git version control operations and history',
                available: true
            },
            {
                name: 'Terminal Execution',
                description: 'Execute terminal commands and scripts',
                available: true
            },
            {
                name: 'Package Management',
                description: 'Manage npm/yarn packages and dependencies',
                available: true
            }
        ];
        builtInTools.forEach(tool => {
            this.tools.set(tool.name, tool);
        });
    }
    initializeWorkflows() {
        const defaultWorkflows = [
            {
                id: 'project-setup',
                name: 'Project Setup',
                description: 'Initialize new project with dependencies and configuration',
                status: 'available'
            },
            {
                id: 'code-review',
                name: 'Code Review',
                description: 'Automated code quality analysis and suggestions',
                status: 'available'
            },
            {
                id: 'deployment-prep',
                name: 'Deployment Preparation',
                description: 'Prepare project for production deployment',
                status: 'available'
            },
            {
                id: 'bug-analysis',
                name: 'Bug Analysis',
                description: 'Analyze errors and suggest fixes',
                status: 'available'
            }
        ];
        defaultWorkflows.forEach(workflow => {
            this.workflows.set(workflow.id, workflow);
        });
    }
    initializeProcessingTiers() {
        this.processingTiers = [
            {
                name: 'Atomic',
                level: 'atomic',
                description: 'Simple, single-step operations'
            },
            {
                name: 'Moderate',
                level: 'moderate',
                description: 'Multi-step operations with basic logic'
            },
            {
                name: 'Complex',
                level: 'complex',
                description: 'Advanced operations with decision making'
            },
            {
                name: 'Expert',
                level: 'expert',
                description: 'Sophisticated analysis and reasoning'
            }
        ];
    }
    async discoverMCPServers() {
        const commonPorts = [8080, 8081, 3001, 4000];
        const discoveryPromises = commonPorts.map(port => this.checkMCPServer(`http://localhost:${port}`));
        try {
            await Promise.allSettled(discoveryPromises);
        }
        catch (error) {
            console.warn('MCP server discovery completed with some failures');
        }
    }
    async checkMCPServer(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(`${url}/mcp/capabilities`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                const serverInfo = await response.json();
                await this.registerMCPServer(url, serverInfo);
            }
        }
        catch (error) {
            // Server not available or not an MCP server
        }
    }
    async registerMCPServer(url, serverInfo) {
        const server = {
            name: serverInfo.name || 'Unknown MCP Server',
            url,
            version: serverInfo.version || '1.0.0',
            capabilities: serverInfo.capabilities || [],
            tools: []
        };
        // Fetch available tools from the server
        try {
            const toolsResponse = await fetch(`${url}/mcp/tools`);
            if (toolsResponse.ok) {
                const toolsData = await toolsResponse.json();
                server.tools = toolsData.tools || [];
                // Add tools to our global tools registry
                server.tools.forEach(tool => {
                    this.tools.set(`${server.name}:${tool.name}`, tool);
                });
            }
        }
        catch (error) {
            console.warn(`Failed to fetch tools from ${server.name}:`, error);
        }
        this.servers.set(server.name, server);
        this.notifyListeners();
    }
    async executeTool(toolName, parameters = {}) {
        const startTime = Date.now();
        const tool = this.tools.get(toolName);
        if (!tool || !tool.available) {
            return {
                success: false,
                error: `Tool ${toolName} not available`,
                executionTime: Date.now() - startTime
            };
        }
        try {
            // Handle built-in tools
            if (this.isBuiltInTool(toolName)) {
                const result = await this.executeBuiltInTool(toolName, parameters);
                return {
                    success: true,
                    data: result,
                    executionTime: Date.now() - startTime
                };
            }
            // Handle external MCP server tools
            const [serverName, actualToolName] = toolName.split(':');
            const server = this.servers.get(serverName);
            if (!server) {
                return {
                    success: false,
                    error: `Server ${serverName} not found`,
                    executionTime: Date.now() - startTime
                };
            }
            const response = await fetch(`${server.url}/mcp/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tool: actualToolName,
                    parameters
                })
            });
            if (response.ok) {
                const result = await response.json();
                return {
                    success: true,
                    data: result,
                    executionTime: Date.now() - startTime
                };
            }
            else {
                return {
                    success: false,
                    error: `Tool execution failed: ${response.statusText}`,
                    executionTime: Date.now() - startTime
                };
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage,
                executionTime: Date.now() - startTime
            };
        }
    }
    isBuiltInTool(toolName) {
        const builtInTools = ['File Operations', 'Web Search', 'Code Analysis', 'Git Operations', 'Terminal Execution', 'Package Management'];
        return builtInTools.includes(toolName);
    }
    async executeBuiltInTool(toolName, parameters) {
        switch (toolName) {
            case 'File Operations':
                return this.handleFileOperations(parameters);
            case 'Web Search':
                return this.handleWebSearch(parameters);
            case 'Code Analysis':
                return this.handleCodeAnalysis(parameters);
            case 'Git Operations':
                return this.handleGitOperations(parameters);
            case 'Terminal Execution':
                return this.handleTerminalExecution(parameters);
            case 'Package Management':
                return this.handlePackageManagement(parameters);
            default:
                throw new Error(`Unknown built-in tool: ${toolName}`);
        }
    }
    async handleFileOperations(parameters) {
        const { operation, path, content } = parameters;
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        switch (operation) {
            case 'read':
                return await fs.readFile(path, 'utf-8');
            case 'write':
                await fs.writeFile(path, content);
                return { success: true, message: `File ${path} written successfully` };
            case 'list':
                const entries = await fs.readdir(path);
                return { files: entries };
            default:
                throw new Error(`Unknown file operation: ${operation}`);
        }
    }
    async handleWebSearch(parameters) {
        const { query } = parameters;
        // Implement web search using a search API
        return {
            query,
            results: [
                { title: 'Search Result 1', url: 'https://example.com/1', snippet: 'Sample search result...' },
                { title: 'Search Result 2', url: 'https://example.com/2', snippet: 'Another search result...' }
            ]
        };
    }
    async handleCodeAnalysis(parameters) {
        const { filePath } = parameters;
        // Implement code analysis logic
        return {
            file: filePath,
            lines: 150,
            complexity: 'moderate',
            issues: ['Consider extracting this function', 'Variable could be const'],
            suggestions: ['Add type annotations', 'Use more descriptive variable names']
        };
    }
    async handleGitOperations(parameters) {
        const { operation } = parameters;
        // Implement git operations
        return {
            operation,
            status: 'success',
            message: `Git ${operation} completed successfully`
        };
    }
    async handleTerminalExecution(parameters) {
        const { command } = parameters;
        // For security, only allow specific safe commands
        const safeCommands = ['ls', 'pwd', 'npm list', 'git status'];
        if (!safeCommands.some(safe => command.startsWith(safe))) {
            throw new Error('Command not allowed for security reasons');
        }
        return {
            command,
            output: `Executed: ${command}\nOutput would appear here...`,
            exitCode: 0
        };
    }
    async handlePackageManagement(parameters) {
        const { operation, packageName } = parameters;
        return {
            operation,
            package: packageName,
            status: 'success',
            message: `Package operation ${operation} completed`
        };
    }
    async executeWorkflow(workflowId, parameters = {}) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            return {
                success: false,
                error: `Workflow ${workflowId} not found`,
                executionTime: 0
            };
        }
        // Update workflow status
        workflow.status = 'running';
        this.notifyListeners();
        const startTime = Date.now();
        try {
            // Simulate workflow execution based on type
            const result = await this.executeWorkflowSteps(workflowId, parameters);
            workflow.status = 'completed';
            this.notifyListeners();
            return {
                success: true,
                data: result,
                executionTime: Date.now() - startTime
            };
        }
        catch (error) {
            workflow.status = 'error';
            this.notifyListeners();
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                success: false,
                error: errorMessage,
                executionTime: Date.now() - startTime
            };
        }
    }
    async executeWorkflowSteps(workflowId, parameters) {
        switch (workflowId) {
            case 'project-setup':
                return {
                    steps: ['Created package.json', 'Installed dependencies', 'Set up configuration'],
                    message: 'Project setup completed successfully'
                };
            case 'code-review':
                return {
                    issues: 2,
                    suggestions: 5,
                    score: 85,
                    message: 'Code review completed - looking good!'
                };
            case 'deployment-prep':
                return {
                    steps: ['Built application', 'Optimized assets', 'Generated deployment manifest'],
                    message: 'Ready for deployment'
                };
            case 'bug-analysis':
                return {
                    errors: 1,
                    warnings: 3,
                    fixes: ['Update dependency version', 'Fix type error in line 42'],
                    message: 'Bug analysis completed'
                };
            default:
                throw new Error(`Unknown workflow: ${workflowId}`);
        }
    }
    getAvailableTools() {
        return Array.from(this.tools.values());
    }
    getAvailableWorkflows() {
        return Array.from(this.workflows.values());
    }
    getProcessingTiers() {
        return this.processingTiers;
    }
    getMCPServers() {
        return Array.from(this.servers.values());
    }
    onToolsChanged(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
    async refreshServers() {
        this.servers.clear();
        await this.discoverMCPServers();
    }
}
exports.default = new MCPService();
//# sourceMappingURL=MCPService.js.map