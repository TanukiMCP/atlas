"use strict";
/**
 * TanukiMCP Atlas - LLM System Prompt Management Types
 * Comprehensive type definitions for the prompt management system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_PROMPT_VARIABLES = exports.DEFAULT_PROMPT_CATEGORIES = void 0;
exports.DEFAULT_PROMPT_CATEGORIES = [
    {
        id: 'llm-routing',
        name: 'LLM Routing Layer',
        description: 'Request classification, complexity assessment, and route selection',
        icon: '🧠',
        color: 'blue',
        sortOrder: 1
    },
    {
        id: 'task-processors',
        name: 'Task Processors',
        description: 'Atomic, moderate, and complex task processing agents',
        icon: '⚙️',
        color: 'green',
        sortOrder: 2
    },
    {
        id: 'workflow-generation',
        name: 'Workflow Generation',
        description: 'Intelligent custom workflow creation and management',
        icon: '🔧',
        color: 'purple',
        sortOrder: 3
    },
    {
        id: 'ai-agent-council',
        name: 'AI Agent Council',
        description: 'Enhancement agents, voting, and expert panel review',
        icon: '👥',
        color: 'orange',
        sortOrder: 4
    },
    {
        id: 'execution-engine',
        name: 'Execution Engine',
        description: 'Task sequencing and iterative execution coordination',
        icon: '🚀',
        color: 'red',
        sortOrder: 5
    },
    {
        id: 'communication',
        name: 'Communication',
        description: 'User communication and response excellence layers',
        icon: '💬',
        color: 'teal',
        sortOrder: 6
    },
    {
        id: 'hybrid-mode',
        name: 'Hybrid Mode Management',
        description: 'Mode orchestration and adaptive complexity assessment',
        icon: '🔄',
        color: 'indigo',
        sortOrder: 7
    },
    {
        id: 'failure-recovery',
        name: 'Failure Recovery',
        description: 'Error detection, recovery strategies, and resilience',
        icon: '🛡️',
        color: 'yellow',
        sortOrder: 8
    },
    {
        id: 'chat-ui-helpers',
        name: 'Chat & UI Helpers',
        description: 'Interface assistance and user interaction guidance',
        icon: '🎨',
        color: 'pink',
        sortOrder: 9
    }
]; // Common prompt template variables
exports.COMMON_PROMPT_VARIABLES = [
    {
        name: 'user_query',
        type: 'string',
        description: 'The user\'s input query or request',
        required: true,
        example: 'Create a React dashboard with charts'
    },
    {
        name: 'chat_history',
        type: 'array',
        description: 'Previous messages in the conversation',
        required: false,
        example: []
    },
    {
        name: 'available_tools',
        type: 'array',
        description: 'List of available tools for the current context',
        required: false,
        example: ['read_file', 'write_file', 'search_code']
    },
    {
        name: 'context',
        type: 'object',
        description: 'Current execution context and environment state',
        required: false,
        example: { project_path: './src', current_mode: 'programming' }
    },
    {
        name: 'execution_history',
        type: 'array',
        description: 'History of previously executed tasks and tools',
        required: false,
        example: []
    }
];
//# sourceMappingURL=prompt-types.js.map