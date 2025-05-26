"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflows = void 0;
// Workflow management hook for TanukiMCP Atlas
const react_1 = require("react");
const useWorkflows = () => {
    const [workflows, setWorkflows] = (0, react_1.useState)([]);
    const [executions, setExecutions] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const createWorkflow = (0, react_1.useCallback)((workflowData) => {
        const newWorkflow = {
            id: crypto.randomUUID(),
            name: workflowData.name || 'New Workflow',
            description: workflowData.description,
            steps: workflowData.steps || [],
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 'user',
                tags: workflowData.metadata?.tags || [],
                category: workflowData.metadata?.category || 'general',
                isTemplate: false,
                isPublic: false
            },
            settings: {
                autoSave: true,
                confirmBeforeRun: true,
                timeout: 30000
            }
        };
        setWorkflows(prev => [newWorkflow, ...prev]);
        return newWorkflow;
    }, []);
    const executeWorkflow = (0, react_1.useCallback)((workflowId) => {
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow)
            return;
        const execution = {
            id: crypto.randomUUID(),
            workflowId,
            status: 'pending',
            startTime: new Date(),
            stepResults: {}
        };
        setExecutions(prev => [execution, ...prev]);
        // Simulate workflow execution
        setTimeout(() => {
            setExecutions(prev => prev.map(exec => exec.id === execution.id
                ? { ...exec, status: 'completed', endTime: new Date() }
                : exec));
        }, 2000);
        return execution;
    }, [workflows]);
    return {
        workflows,
        executions,
        isLoading,
        createWorkflow,
        executeWorkflow
    };
};
exports.useWorkflows = useWorkflows;
//# sourceMappingURL=use-workflows.js.map