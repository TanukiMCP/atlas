import React, { useState, useEffect } from 'react';
import { MCPTool, Workflow } from '../types/index';
import { mcpService, MCPToolResult } from '../services/mcp-service';
import type { MCPExecutionContext } from '../types/index';

interface ToolsPanelProps {
  operationalMode: 'agent' | 'chat';
  onToolExecute?: (context: MCPExecutionContext) => Promise<MCPToolResult>;
  onWorkflowExecute?: (workflow: Workflow) => Promise<any>;
  onWorkflowSave?: (workflow: Workflow) => void;
  workflows?: Workflow[];
}

interface ToolsPanelState {
  activeTab: 'tools' | 'workflows';
  tools: MCPTool[];
  loading: boolean;
  error: string | null;
  selectedTool: MCPTool | null;
  toolParameters: Record<string, any>;
  executionResult: MCPToolResult | null;
  executing: boolean;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  operationalMode,
  onToolExecute,
  onWorkflowExecute,
  onWorkflowSave,
  workflows = []
}) => {
  const [state, setState] = useState<ToolsPanelState>({
    activeTab: 'tools',
    tools: [],
    loading: true,
    error: null,
    selectedTool: null,
    toolParameters: {},
    executionResult: null,
    executing: false
  });

  useEffect(() => {
    loadTools();
  }, [operationalMode]);

  const loadTools = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get available tools from MCP service
      const tools = mcpService.getAvailableTools(operationalMode);
      // Use tools as-is (they already match MCPTool type)
      setState(prev => ({
        ...prev,
        tools,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        tools: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load MCP tools'
      }));
    }
  };

  const handleToolSelect = (tool: MCPTool) => {
    setState(prev => ({
      ...prev,
      selectedTool: tool,
      toolParameters: {},
      executionResult: null
    }));
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setState(prev => ({
      ...prev,
      toolParameters: {
        ...prev.toolParameters,
        [paramName]: value
      }
    }));
  };

  const handleToolExecute = async () => {
    if (!state.selectedTool) return;

    setState(prev => ({ ...prev, executing: true, executionResult: null }));

    try {
      const context = {
        toolName: state.selectedTool.name,
        parameters: state.toolParameters,
        operationalMode
      } as MCPExecutionContext & { operationalMode: 'agent' | 'chat' };

      const result = onToolExecute 
        ? await onToolExecute(context)
        : await mcpService.executeTool(context);

      setState(prev => ({
        ...prev,
        executionResult: result,
        executing: false
      }));
    } catch (error) {
      const errorResult: MCPToolResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
        toolName: state.selectedTool.name,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        executionResult: errorResult,
        executing: false
      }));
    }
  };

  const renderToolsTab = () => {
    if (state.loading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading MCP tools...</p>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-red-500 mr-2">⚠️</span>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                MCP Tools Unavailable
              </h3>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mb-3 whitespace-pre-line">
              {state.error}
            </p>
            <div className="space-y-2">
              <button
                onClick={loadTools}
                className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <p className="text-xs text-red-600 dark:text-red-400">
                Make sure MCP servers are running and properly configured.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (state.tools.length === 0) {
      return (
        <div className="p-4 text-center">
          <div className="text-gray-400 mb-2">🔧</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">No MCP tools available</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            No tools are available for {operationalMode} mode
          </p>
        </div>
      );
    }

    return (
      <div className="flex h-full">
        {/* Tool List */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Tools ({state.tools.length})
            </h3>
          </div>
          <div className="overflow-auto h-full">
            {state.tools.map(tool => (
              <div
                key={tool.name}
                className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  state.selectedTool?.name === tool.name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleToolSelect(tool)}
              >
                <div className="flex items-center mb-1">
                  <span className="mr-2">🔧</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </span>
                  <span className={`ml-auto w-2 h-2 rounded-full ${tool.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Execution */}
        <div className="w-1/2 flex flex-col">
          {state.selectedTool ? (
            <>
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔧 {state.selectedTool.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {state.selectedTool.description}
                </p>
              </div>

              <div className="flex-1 p-3 overflow-auto">
                {/* Parameters */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Parameters (JSON)
                    </label>
                    <textarea
                      value={JSON.stringify(state.toolParameters, null, 2)}
                      onChange={(e) => {
                        try {
                          const params = JSON.parse(e.target.value);
                          setState(prev => ({ ...prev, toolParameters: params }));
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      placeholder='{"key": "value"}'
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  onClick={handleToolExecute}
                  disabled={state.executing || !state.selectedTool.available}
                  className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.executing ? 'Executing...' : 'Execute Tool'}
                </button>

                {/* Results */}
                {state.executionResult && (
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Result
                    </h4>
                    <div className={`p-3 rounded text-xs ${
                      state.executionResult.success 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                    }`}>
                      {state.executionResult.success ? (
                        <pre className="whitespace-pre-wrap text-green-800 dark:text-green-200">
                          {JSON.stringify(state.executionResult.result, null, 2)}
                        </pre>
                      ) : (
                        <div className="text-red-800 dark:text-red-200">
                          <p className="font-medium mb-1">Error:</p>
                          <p className="whitespace-pre-line">{state.executionResult.error}</p>
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                        Executed in {state.executionResult.executionTime}ms
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">🔧</div>
                <p className="text-sm">Select a tool to configure and execute</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWorkflowsTab = () => {
    if (workflows.length === 0) {
      return (
        <div className="p-4 text-center">
          <div className="text-gray-400 mb-2">⚡</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">No workflows available</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Create workflows in the Builder tab
          </p>
        </div>
      );
    }

    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Saved Workflows ({workflows.length})
        </h3>
        <div className="space-y-2">
          {workflows.map(workflow => (
            <div
              key={workflow.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {workflow.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {workflow.description}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                    workflow.status === 'available' ? 'bg-green-100 text-green-800' :
                    workflow.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    workflow.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                <button
                  onClick={() => onWorkflowExecute?.(workflow)}
                  disabled={workflow.status !== 'available'}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-w-[200px] max-w-[320px] bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">MCP Tools</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {(['tools', 'workflows'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setState(prev => ({ ...prev, activeTab: tab }))}
            className={`flex-1 px-3 py-2 text-sm font-medium capitalize transition-colors ${
              state.activeTab === tab
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content - Fixed container size */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {state.activeTab === 'tools' && (
          <div className="flex-1 overflow-auto">
            {renderToolsTab()}
          </div>
        )}
        {state.activeTab === 'workflows' && (
          <div className="flex-1 overflow-auto">
            {renderWorkflowsTab()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel; 