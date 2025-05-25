/**
 * Workflow Generation Dialog Component
 * Implements the exact wireframe layout: 4/5 ASCII visualization + 1/5 refinement chat
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  WorkflowGenerationService, 
  WorkflowGenerationConfig, 
  WorkflowGenerationEvents 
} from '../../services/workflow-generation/workflow-generation-service';
import { 
  ChatTranscript, 
  WorkflowGenerationUIState, 
  WorkflowTemplate,
  WorkflowGenerationStep 
} from '../../types/workflow-types';

interface WorkflowGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatTranscript: ChatTranscript;
  onWorkflowSaved: (workflow: WorkflowTemplate) => void;
}

export const WorkflowGenerationDialog: React.FC<WorkflowGenerationDialogProps> = ({
  isOpen,
  onClose,
  chatTranscript,
  onWorkflowSaved
}) => {
  const [state, setState] = useState<WorkflowGenerationUIState>({
    isOpen: false,
    currentStep: 'analyzing',
    loading: false,
    workflowVisualization: '',
    partialWorkflow: {},
    refinementHistory: [],
    userInput: ''
  });
  
  const [refinementInput, setRefinementInput] = useState('');
  const [isDirectEditMode, setIsDirectEditMode] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const workflowServiceRef = useRef<WorkflowGenerationService | null>(null);
  const visualizationTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize workflow generation service
  useEffect(() => {
    const config: WorkflowGenerationConfig = {
      enableAutoSave: false,
      defaultComplexity: 'moderate',
      maxRefinementIterations: 10,
      timeoutMs: 30000
    };

    const events: WorkflowGenerationEvents = {
      onStateChange: (newState) => setState(newState),
      onProgress: (step, progressValue) => setProgress(progressValue),
      onError: (error) => console.error('Workflow generation error:', error),
      onComplete: (workflow) => onWorkflowSaved(workflow)
    };

    workflowServiceRef.current = new WorkflowGenerationService(config, events);
  }, [onWorkflowSaved]);

  // Start workflow generation when dialog opens
  useEffect(() => {
    if (isOpen && workflowServiceRef.current && chatTranscript) {
      workflowServiceRef.current.generateWorkflowFromChat(chatTranscript);
    }
  }, [isOpen, chatTranscript]);

  const handleRefinementSubmit = async () => {
    if (!refinementInput.trim() || !workflowServiceRef.current) return;

    try {
      await workflowServiceRef.current.refineWorkflow(refinementInput);
      setRefinementInput('');
    } catch (error) {
      console.error('Refinement failed:', error);
    }
  };

  const handleRegenerate = async () => {
    if (!workflowServiceRef.current) return;

    try {
      await workflowServiceRef.current.regenerateWorkflow(chatTranscript);
    } catch (error) {
      console.error('Regeneration failed:', error);
    }
  };

  const handleSaveWorkflow = async () => {
    if (!workflowServiceRef.current) return;

    try {
      const finalizedWorkflow = await workflowServiceRef.current.finalizeWorkflow();
      onClose();
    } catch (error) {
      console.error('Finalization failed:', error);
    }
  };

  const handleVisualizationChange = (newVisualization: string) => {
    if (workflowServiceRef.current) {
      workflowServiceRef.current.updateVisualization(newVisualization);
    }
  };

  const handleClose = () => {
    if (workflowServiceRef.current) {
      workflowServiceRef.current.closeWorkflowGeneration();
    }
    onClose();
  };

  const getStepDescription = (step: WorkflowGenerationStep): string => {
    switch (step) {
      case 'analyzing': return 'Analyzing chat conversation...';
      case 'synthesizing': return 'Generating workflow structure...';
      case 'visualizing': return 'Creating ASCII visualization...';
      case 'preview': return 'Workflow ready for preview and refinement';
      case 'refining': return 'Applying refinements...';
      case 'finalizing': return 'Finalizing workflow...';
      case 'complete': return 'Workflow saved successfully!';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[90vw] h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              💾
            </div>
            <div>
              <h2 className="text-lg font-semibold">Intelligent Workflow Generator</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getStepDescription(state.currentStep)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        {state.loading && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* ASCII Workflow Visualization (4/5 Layout) */}
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">ASCII Workflow Visualization</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsDirectEditMode(!isDirectEditMode)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      isDirectEditMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    📝 Direct Edit Mode
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              {state.currentStep === 'analyzing' || state.currentStep === 'synthesizing' ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {state.currentStep === 'analyzing' ? 'Analyzing conversation...' : 'Generating workflow...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  {isDirectEditMode ? (
                    <textarea
                      ref={visualizationTextareaRef}
                      value={state.workflowVisualization}
                      onChange={(e) => handleVisualizationChange(e.target.value)}
                      className="w-full h-full font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ASCII workflow visualization will appear here..."
                    />
                  ) : (
                    <div className="h-full overflow-auto">
                      <pre className="font-mono text-sm whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        {state.workflowVisualization || 'No visualization available yet...'}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Refinement Chat Interface (1/5 Layout) */}
          <div className="w-80 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium">💬 Refinement Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chat with LLM Agent 2 for refinements
              </p>
            </div>
            
            {/* Refinement History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {state.refinementHistory.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  <p>No refinements yet.</p>
                  <p>Type your refinement requests below.</p>
                </div>
              ) : (
                state.refinementHistory.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">You</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">{item.userRequest}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Agent 2</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{item.agentResponse}</div>
                      {item.changesSummary && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                          Changes: {item.changesSummary}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Refinement Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                <textarea
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  placeholder="Type refinement requests here..."
                  className="w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={state.loading}
                />
                <button
                  onClick={handleRefinementSubmit}
                  disabled={!refinementInput.trim() || state.loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handleRegenerate}
                disabled={state.loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                🔄 Regenerate
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkflow}
                disabled={state.loading || !state.workflowVisualization}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};