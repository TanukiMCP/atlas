// Workflow management hook for TanukiMCP Atlas
import { useState, useCallback } from 'react';
import { Workflow, WorkflowExecution } from '../types/workflow-types';

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createWorkflow = useCallback((workflowData: Partial<Workflow>) => {
    const newWorkflow: Workflow = {
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

  const executeWorkflow = useCallback((workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const execution: WorkflowExecution = {
      id: crypto.randomUUID(),
      workflowId,
      status: 'pending',
      startTime: new Date(),
      stepResults: {}
    };

    setExecutions(prev => [execution, ...prev]);
    
    // Simulate workflow execution
    setTimeout(() => {
      setExecutions(prev => prev.map(exec => 
        exec.id === execution.id 
          ? { ...exec, status: 'completed', endTime: new Date() }
          : exec
      ));
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