/**
 * Enhanced IDE Layout with Complete Workflow Generation Integration
 * Integrates all workflow components following wireframe specifications
 */

import React, { useState, useEffect, useRef } from 'react';
import { MenuBar } from './menu-bar';
import { Toolbar } from './toolbar';
import { StatusBar } from './status-bar';
import { PanelManager } from './panel-manager';
import { EnhancedChatInterface } from '../chat/enhanced-chat-interface';
import { EnhancedAtSymbolDropdown } from '../chat/enhanced-at-symbol-dropdown';
import { WorkflowParameterDialog } from '../workflows/workflow-parameter-dialog';
import { FileExplorer } from '../file-explorer/file-tree';
import { ManagementCenterModal } from '../management/management-center-modal';
import { LLMPromptManagement } from '../prompt-management/llm-prompt-management';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import { useSubjectMode } from '../../hooks/use-subject-mode';
import { useUIStore } from '../../hooks/use-ui-store';
import { useLLMStore } from '../../stores/llm-store';
import { useMCPStore } from '../../stores/mcp-store';
import { 
  WorkflowGenerationService, 
  WorkflowGenerationConfig, 
  WorkflowGenerationEvents 
} from '../../services/workflow-generation';
import {
  WorkflowExecutionService,
  WorkflowExecutionConfig,
  WorkflowExecutionEvents
} from '../../services/workflow-execution';
import { WorkflowTemplate } from '../../types/workflow-types';

export const EnhancedIDELayout: React.FC = () => {
  const [showAtSymbol, setShowAtSymbol] = useState(false);
  const [atSymbolPosition, setAtSymbolPosition] = useState({ x: 0, y: 0 });
  const [showManagementCenter, setShowManagementCenter] = useState(false);
  const [showLLMPromptManagement, setShowLLMPromptManagement] = useState(false);
  const [showWorkflowParameterDialog, setShowWorkflowParameterDialog] = useState(false);
  const [selectedWorkflowForExecution, setSelectedWorkflowForExecution] = useState<WorkflowTemplate | null>(null);
  
  const { currentMode, switchMode } = useSubjectMode();
  const { layout, updateLayout } = useUIStore();
  const { checkHealth, refreshModels } = useLLMStore();
  const { initialize: initializeMCP } = useMCPStore();
  
  const workflowGenerationServiceRef = useRef<WorkflowGenerationService | null>(null);
  const workflowExecutionServiceRef = useRef<WorkflowExecutionService | null>(null);
  const toolRouterRef = useRef<any>(null); // Mock tool router for now

  // Initialize services
  useEffect(() => {
    // Initialize LLM and MCP services
    const initializeServices = async () => {
      await checkHealth();
      await refreshModels(); // This will set the default model
      await initializeMCP();
    };
    
    initializeServices();
    
    // Initialize Workflow Generation Service
    const generationConfig: WorkflowGenerationConfig = {
      enableAutoSave: false,
      defaultComplexity: 'moderate',
      maxRefinementIterations: 10,
      timeoutMs: 30000
    };

    const generationEvents: WorkflowGenerationEvents = {
      onStateChange: (state) => console.log('Workflow generation state:', state),
      onProgress: (step, progress) => console.log(`Workflow ${step}: ${progress}%`),
      onError: (error) => console.error('Workflow generation error:', error),
      onComplete: (workflow) => {
        console.log('Workflow generated:', workflow);
        // Update UI to show the saved workflow
      }
    };

    workflowGenerationServiceRef.current = new WorkflowGenerationService(
      generationConfig, 
      generationEvents
    );

    // Initialize Workflow Execution Service
    const executionConfig: WorkflowExecutionConfig = {
      maxExecutionTime: 300000, // 5 minutes
      maxRetries: 3,
      enableLogging: true,
      enableProgressTracking: true
    };

    const executionEvents: WorkflowExecutionEvents = {
      onExecutionStart: (execution) => console.log('Workflow execution started:', execution),
      onStepStart: (stepId, stepName) => console.log(`Step started: ${stepName} (${stepId})`),
      onStepComplete: (stepId, result) => console.log(`Step completed: ${stepId}`, result),
      onStepError: (stepId, error) => console.error(`Step error: ${stepId}`, error),
      onExecutionComplete: (execution) => console.log('Workflow execution completed:', execution),
      onExecutionError: (execution, error) => console.error('Workflow execution error:', error),
      onProgress: (executionId, progress) => console.log(`Execution ${executionId}: ${progress}%`)
    };

    workflowExecutionServiceRef.current = new WorkflowExecutionService(
      executionConfig,
      executionEvents,
      toolRouterRef.current
    );

    // Initialize mock tool router
    toolRouterRef.current = {
      getCategories: async () => [
        { id: 'file', name: 'File Operations', icon: '📁' },
        { id: 'code', name: 'Code Operations', icon: '💻' },
        { id: 'task', name: 'Task Management', icon: '📋' }
      ],
      searchTools: async ({ query, category, limit }) => [
        {
          id: 'read_file',
          name: 'read_file',
          description: 'Read file contents',
          category: { id: 'file', name: 'File Operations', icon: '📁' },
          inputSchema: { required: ['path'] },
          availability: { status: 'available' }
        }
      ],
      executeTool: async (toolName, parameters) => {
        console.log(`Executing tool: ${toolName}`, parameters);
        return { success: true, data: `Mock result for ${toolName}` };
      }
    };
  }, []);

  // Handler functions
  const handleNewChat = () => console.log('New Chat');
  const handleOpenProject = () => console.log('Open Project');
  const handleSaveChat = () => console.log('Save Chat');
  const handleToggleFullscreen = () => console.log('Toggle Fullscreen');
  
  const handleToolSelect = (tool: any, parameters?: any) => {
    console.log('Tool selected:', tool, parameters);
    setShowAtSymbol(false);
    // Execute tool via tool router
    if (toolRouterRef.current) {
      toolRouterRef.current.executeTool(tool.name, parameters || {});
    }
  };

  const handleWorkflowSelect = (workflow: WorkflowTemplate, parameters?: any) => {
    console.log('Workflow selected:', workflow, parameters);
    setShowAtSymbol(false);
    
    if (workflow.parameters.length > 0 && !parameters) {
      // Show parameter dialog
      setSelectedWorkflowForExecution(workflow);
      setShowWorkflowParameterDialog(true);
    } else {
      // Execute workflow directly
      executeWorkflow(workflow, parameters || {});
    }
  };

  const executeWorkflow = async (workflow: WorkflowTemplate, parameters: Record<string, any>) => {
    if (!workflowExecutionServiceRef.current) {
      console.error('Workflow execution service not available');
      return;
    }

    try {
      const execution = await workflowExecutionServiceRef.current.executeWorkflow(workflow, parameters);
      console.log('Workflow executed successfully:', execution);
    } catch (error) {
      console.error('Workflow execution failed:', error);
    }
  };

  const handleWorkflowParameterSubmit = (parameters: Record<string, any>) => {
    if (selectedWorkflowForExecution) {
      executeWorkflow(selectedWorkflowForExecution, parameters);
      setShowWorkflowParameterDialog(false);
      setSelectedWorkflowForExecution(null);
    }
  };

  const handleWorkflowParameterCancel = () => {
    setShowWorkflowParameterDialog(false);
    setSelectedWorkflowForExecution(null);
  };
  
  const getExecutionContext = () => ({ 
    currentMode,
    projectContext: 'TanukiMCP Atlas IDE',
    availableTools: ['read_file', 'write_file', 'search_files', 'search_code']
  });

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Shift+P': () => setShowAtSymbol(true),
    'Ctrl+N': handleNewChat,
    'Ctrl+O': handleOpenProject,
    'Ctrl+S': handleSaveChat,
    'F11': handleToggleFullscreen,
    'F12': () => setShowManagementCenter(true)
  });

  const handleAtSymbolTrigger = (event: React.KeyboardEvent, position: { x: number; y: number }) => {
    if (event.key === '@') {
      setAtSymbolPosition(position);
      setShowAtSymbol(true);
    }
  };

  return (
    <div className="ide-container h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Menu Bar */}
      <MenuBar 
        onNewChat={handleNewChat}
        onOpenProject={handleOpenProject}
        onSaveChat={handleSaveChat}
        onSubjectModeChange={switchMode}
        currentMode={currentMode}
        onOpenMCPManager={() => setShowManagementCenter(true)}
        onOpenLLMPromptManagement={() => setShowLLMPromptManagement(true)}
      />
      
      {/* Toolbar */}
      <Toolbar 
        currentMode={currentMode}
        onModeChange={switchMode}
        onAtSymbolTrigger={() => setShowAtSymbol(true)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <PanelManager
          layout={layout}
          onLayoutChange={updateLayout}
          panels={{
            fileExplorer: <FileExplorer />,
            chatInterface: (
              <EnhancedChatInterface 
                onAtSymbolTrigger={handleAtSymbolTrigger}
              />
            ),
            workflowManager: <div>Workflow Manager Panel</div>,
            toolOutput: <div>Tool Output Panel</div>
          }}
        />
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        currentMode={currentMode}
        connectionStatus="connected"
        activeTools={[]}
        workflowExecutionService={workflowExecutionServiceRef.current}
      />
      
      {/* Enhanced @ Symbol Dropdown with Workflow Support */}
      {showAtSymbol && workflowGenerationServiceRef.current && (
        <EnhancedAtSymbolDropdown
          isOpen={showAtSymbol}
          onClose={() => setShowAtSymbol(false)}
          onToolSelect={handleToolSelect}
          onWorkflowSelect={handleWorkflowSelect}
          context={getExecutionContext()}
          position={atSymbolPosition}
          toolRouter={toolRouterRef.current}
          workflowService={workflowGenerationServiceRef.current}
        />
      )}

      {/* Workflow Parameter Dialog */}
      {showWorkflowParameterDialog && selectedWorkflowForExecution && (
        <WorkflowParameterDialog
          isOpen={showWorkflowParameterDialog}
          workflow={selectedWorkflowForExecution}
          onExecute={handleWorkflowParameterSubmit}
          onCancel={handleWorkflowParameterCancel}
        />
      )}

      {/* Management Center */}
      {showManagementCenter && (
        <ManagementCenterModal
          isOpen={showManagementCenter}
          onClose={() => setShowManagementCenter(false)}
        />
      )}

      {/* LLM Prompt Management */}
      {showLLMPromptManagement && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                LLM System Prompt Management
              </h2>
              <button
                onClick={() => setShowLLMPromptManagement(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(90vh-4rem)]">
              <LLMPromptManagement />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};