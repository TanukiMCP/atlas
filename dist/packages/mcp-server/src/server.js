"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.TanukiMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const file_operations_1 = require("./tools/core/file-operations");
const task_management_1 = require("./tools/core/task-management");
const mathematics_1 = require("./tools/subjects/mathematics");
const science_1 = require("./tools/subjects/science");
const programming_1 = require("./tools/subjects/programming");
const languages_1 = require("./tools/subjects/languages");
const research_1 = require("./tools/subjects/research");
const subject_mode_manager_1 = require("./modes/subject-mode-manager");
class TanukiMCPServer extends index_js_1.Server {
    subjectModeManager;
    fileOps;
    taskMgmt;
    mathTools;
    scienceTools;
    programmingTools;
    languageTools;
    researchTools;
    constructor() {
        super({
            name: 'tanukimcp-builtin-server',
            version: '1.0.0'
        }, {
            capabilities: {
                tools: {},
                resources: {}
            }
        });
        this.initializeTools();
        this.subjectModeManager = new subject_mode_manager_1.SubjectModeManager();
        this.registerAllTools();
    }
    initializeTools() {
        this.fileOps = new file_operations_1.CoreFileOperations();
        this.taskMgmt = new task_management_1.TaskManagement();
        this.mathTools = new mathematics_1.MathematicsTools();
        this.scienceTools = new science_1.ScienceTools();
        this.programmingTools = new programming_1.ProgrammingTools();
        this.languageTools = new languages_1.LanguageTools();
        this.researchTools = new research_1.ResearchTools();
    }
    registerAllTools() {
        this.registerCoreTools();
        this.registerSubjectTools();
        this.registerCRUDTools();
        this.registerWorkflowTools();
    }
    registerCoreTools() {
        this.addTool({
            name: 'read_file',
            description: 'Read file contents with pagination support',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string', description: 'File path to read' },
                    offset: { type: 'number', description: 'Start line (0-indexed)' },
                    length: { type: 'number', description: 'Number of lines to read' },
                    encoding: { type: 'string', default: 'utf8' }
                },
                required: ['path']
            },
            handler: this.fileOps.readFile.bind(this.fileOps)
        });
        this.addTool({
            name: 'write_file',
            description: 'Write or append to files with safety checks',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string', description: 'File path to write' },
                    content: { type: 'string', description: 'Content to write' },
                    mode: { type: 'string', enum: ['write', 'append'], default: 'write' },
                    createDirs: { type: 'boolean', default: true }
                },
                required: ['path', 'content']
            },
            handler: this.fileOps.writeFile.bind(this.fileOps)
        });
        this.addTool({
            name: 'edit_block',
            description: 'Make surgical edits to files',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string', description: 'File path to edit' },
                    oldContent: { type: 'string', description: 'Content to replace' },
                    newContent: { type: 'string', description: 'New content' },
                    expectedMatches: { type: 'number', default: 1 }
                },
                required: ['path', 'oldContent', 'newContent']
            },
            handler: this.fileOps.editBlock.bind(this.fileOps)
        });
        this.addTool({
            name: 'create_todolist',
            description: 'Create structured todo lists from complex requests',
            inputSchema: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Todo list title' },
                    description: { type: 'string', description: 'Project description' },
                    requirements: { type: 'string', description: 'Detailed requirements' },
                    projectPath: { type: 'string', description: 'Project directory path' }
                },
                required: ['title', 'requirements']
            },
            handler: this.taskMgmt.createTodoList.bind(this.taskMgmt)
        });
    }
    registerSubjectTools() {
        // Mathematics tools
        this.addTool({
            name: 'solve_equation',
            description: 'Solve mathematical equations and show step-by-step solutions',
            inputSchema: {
                type: 'object',
                properties: {
                    equation: { type: 'string', description: 'Mathematical equation to solve' },
                    variables: { type: 'array', items: { type: 'string' } },
                    showSteps: { type: 'boolean', default: true },
                    outputFormat: { type: 'string', enum: ['text', 'latex', 'ascii'], default: 'text' }
                },
                required: ['equation']
            },
            handler: this.mathTools.solveEquation.bind(this.mathTools)
        });
        this.addTool({
            name: 'plot_function',
            description: 'Generate mathematical plots and visualizations',
            inputSchema: {
                type: 'object',
                properties: {
                    function: { type: 'string', description: 'Function to plot (e.g., "x^2 + 2*x + 1")' },
                    xRange: { type: 'array', items: { type: 'number' }, description: 'X-axis range [min, max]' },
                    yRange: { type: 'array', items: { type: 'number' }, description: 'Y-axis range [min, max]' },
                    resolution: { type: 'number', default: 100 },
                    outputPath: { type: 'string', description: 'Where to save the plot' }
                },
                required: ['function']
            },
            handler: this.mathTools.plotFunction.bind(this.mathTools)
        });
        // Science tools
        this.addTool({
            name: 'chemistry_balance',
            description: 'Balance chemical equations and calculate stoichiometry',
            inputSchema: {
                type: 'object',
                properties: {
                    equation: { type: 'string', description: 'Chemical equation to balance' },
                    showSteps: { type: 'boolean', default: true },
                    calculateMass: { type: 'boolean', default: false }
                },
                required: ['equation']
            },
            handler: this.scienceTools.balanceEquation.bind(this.scienceTools)
        });
        // Programming tools
        this.addTool({
            name: 'analyze_code',
            description: 'Analyze code structure, complexity, and quality',
            inputSchema: {
                type: 'object',
                properties: {
                    filePath: { type: 'string', description: 'Path to code file' },
                    analysisType: {
                        type: 'array',
                        items: { type: 'string', enum: ['complexity', 'structure', 'quality', 'security', 'performance'] },
                        default: ['complexity', 'quality']
                    },
                    language: { type: 'string', description: 'Programming language (auto-detected if not specified)' }
                },
                required: ['filePath']
            },
            handler: this.programmingTools.analyzeCode.bind(this.programmingTools)
        });
    }
    registerCRUDTools() {
        this.addTool({
            name: 'create_project',
            description: 'Create new project with template structure',
            inputSchema: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Project name' },
                    template: { type: 'string', enum: ['react', 'node', 'python', 'custom'], default: 'custom' },
                    path: { type: 'string', description: 'Project directory path' },
                    features: { type: 'array', items: { type: 'string' }, description: 'Additional features to include' }
                },
                required: ['name', 'path']
            },
            handler: this.createProject.bind(this)
        });
        this.addTool({
            name: 'manage_database',
            description: 'Perform database operations (CRUD)',
            inputSchema: {
                type: 'object',
                properties: {
                    operation: { type: 'string', enum: ['create', 'read', 'update', 'delete', 'query'] },
                    table: { type: 'string', description: 'Database table name' },
                    data: { type: 'object', description: 'Data for operation' },
                    conditions: { type: 'object', description: 'Query conditions' }
                },
                required: ['operation', 'table']
            },
            handler: this.manageDatabaseOperation.bind(this)
        });
    }
    registerWorkflowTools() {
        this.addTool({
            name: 'execute_workflow',
            description: 'Execute a saved workflow with parameters',
            inputSchema: {
                type: 'object',
                properties: {
                    workflowId: { type: 'string', description: 'Workflow ID or name' },
                    parameters: { type: 'object', description: 'Workflow parameters' },
                    preview: { type: 'boolean', description: 'Preview mode (dry run)', default: false }
                },
                required: ['workflowId']
            },
            handler: this.executeWorkflow.bind(this)
        });
        this.addTool({
            name: 'save_chat_as_workflow',
            description: 'Convert current chat into reusable workflow',
            inputSchema: {
                type: 'object',
                properties: {
                    chatId: { type: 'string', description: 'Chat session ID' },
                    workflowName: { type: 'string', description: 'Name for the workflow' },
                    description: { type: 'string', description: 'Workflow description' },
                    category: { type: 'string', description: 'Workflow category' },
                    startMessage: { type: 'string', description: 'Starting message ID' },
                    endMessage: { type: 'string', description: 'Ending message ID' }
                },
                required: ['chatId', 'workflowName']
            },
            handler: this.saveChatAsWorkflow.bind(this)
        });
    }
    async switchSubjectMode(mode) {
        await this.subjectModeManager.switchMode(mode);
        this.updateAvailableTools();
    }
    updateAvailableTools() {
        const currentMode = this.subjectModeManager.getCurrentMode();
        // Would implement tool visibility logic here
        console.log(`Updated tools for mode: ${currentMode.id}`);
    }
    // Placeholder implementations for workflow and CRUD methods
    async createProject(params) {
        return { success: true, result: { message: 'Project creation placeholder' } };
    }
    async manageDatabaseOperation(params) {
        return { success: true, result: { message: 'Database operation placeholder' } };
    }
    async executeWorkflow(params) {
        return { success: true, result: { message: 'Workflow execution placeholder' } };
    }
    async saveChatAsWorkflow(params) {
        return { success: true, result: { message: 'Save workflow placeholder' } };
    }
    // Server lifecycle methods
    async start() {
        console.log('TanukiMCP Server starting...');
        // Initialize server components
        await super.start();
        console.log('TanukiMCP Server started successfully');
    }
    async stop() {
        console.log('TanukiMCP Server stopping...');
        await super.stop();
        console.log('TanukiMCP Server stopped');
    }
}
exports.TanukiMCPServer = TanukiMCPServer;
// Export server instance
exports.server = new TanukiMCPServer();
// Start server if run directly
if (require.main === module) {
    exports.server.start().catch(console.error);
}
//# sourceMappingURL=server.js.map