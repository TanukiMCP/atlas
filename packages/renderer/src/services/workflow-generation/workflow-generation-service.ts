/**
 * Main Workflow Generation Service
 * Coordinates the three LLM agents to provide complete workflow generation functionality
 */

import { WorkflowSynthesizerAgent } from './workflow-synthesizer-agent';
import { WorkflowRefinementAgent } from './workflow-refinement-agent';
import { WorkflowFinalizerAgent } from './workflow-finalizer-agent';
import {
  ChatTranscript,
  WorkflowGenerationUIState,
  WorkflowGenerationStep,
  WorkflowSynthesisRequest,
  WorkflowRefinementRequest,
  WorkflowFinalizationRequest,
  WorkflowTemplate,
  WorkflowGenerationPreferences,
  RefinementHistoryItem,
  ValidationContext
} from '../../types/workflow-types';

export interface WorkflowGenerationConfig {
  enableAutoSave: boolean;
  defaultComplexity: 'simple' | 'moderate' | 'complex';
  maxRefinementIterations: number;
  timeoutMs: number;
}

export interface WorkflowGenerationEvents {
  onStateChange: (state: WorkflowGenerationUIState) => void;
  onProgress: (step: WorkflowGenerationStep, progress: number) => void;
  onError: (error: string) => void;
  onComplete: (workflow: WorkflowTemplate) => void;
}

export class WorkflowGenerationService {
  private synthesizerAgent: WorkflowSynthesizerAgent;
  private refinementAgent: WorkflowRefinementAgent;
  private finalizerAgent: WorkflowFinalizerAgent;
  
  private config: WorkflowGenerationConfig;
  private events: WorkflowGenerationEvents;
  private currentState: WorkflowGenerationUIState;

  constructor(config: WorkflowGenerationConfig, events: WorkflowGenerationEvents) {
    this.synthesizerAgent = new WorkflowSynthesizerAgent();
    this.refinementAgent = new WorkflowRefinementAgent();
    this.finalizerAgent = new WorkflowFinalizerAgent();
    
    this.config = config;
    this.events = events;
    
    this.currentState = {
      isOpen: false,
      currentStep: 'analyzing',
      loading: false,
      workflowVisualization: '',
      partialWorkflow: {},
      refinementHistory: [],
      userInput: ''
    };
  }

  /**
   * Start workflow generation from a chat transcript
   */
  async generateWorkflowFromChat(
    chatTranscript: ChatTranscript,
    preferences?: Partial<WorkflowGenerationPreferences>
  ): Promise<void> {
    const fullPreferences: WorkflowGenerationPreferences = {
      complexity: preferences?.complexity || this.config.defaultComplexity,
      includeVisualization: preferences?.includeVisualization ?? true,
      autoSave: preferences?.autoSave ?? this.config.enableAutoSave,
      tags: preferences?.tags || []
    };

    try {
      this.updateState({
        isOpen: true,
        currentStep: 'analyzing',
        loading: true,
        error: undefined,
        workflowVisualization: '',
        partialWorkflow: {},
        refinementHistory: [],
        userInput: ''
      });

      this.events.onProgress('analyzing', 0);

      // Step 1: Synthesize workflow using Agent 1
      await this.synthesizeWorkflow(chatTranscript, fullPreferences);

      // Step 2: Enter preview/refinement mode
      this.updateState({
        currentStep: 'preview',
        loading: false
      });

      this.events.onProgress('preview', 100);

    } catch (error) {
      this.handleError(`Workflow generation failed: ${error.message}`);
    }
  }

  /**
   * Synthesize initial workflow using Agent 1
   */
  private async synthesizeWorkflow(
    chatTranscript: ChatTranscript,
    preferences: WorkflowGenerationPreferences
  ): Promise<void> {
    this.updateState({ currentStep: 'synthesizing' });
    this.events.onProgress('synthesizing', 25);

    const request: WorkflowSynthesisRequest = {
      chatTranscript,
      userPreferences: preferences
    };

    const response = await this.synthesizerAgent.synthesizeWorkflow(request);

    this.events.onProgress('visualizing', 75);

    this.updateState({
      workflowVisualization: response.asciiVisualization,
      partialWorkflow: response.structuredWorkflow,
      currentStep: 'preview'
    });
  }

  /**
   * Refine workflow using Agent 2
   */
  async refineWorkflow(userRequest: string): Promise<void> {
    if (!this.currentState.partialWorkflow || !this.currentState.workflowVisualization) {
      throw new Error('No workflow available for refinement');
    }

    try {
      this.updateState({
        currentStep: 'refining',
        loading: true
      });

      this.events.onProgress('refining', 0);

      const availableTools = await this.getAvailableTools();
      const previousRefinements = this.currentState.refinementHistory.map(h => h.userRequest);

      const request: WorkflowRefinementRequest = {
        currentWorkflow: this.currentState.partialWorkflow,
        currentVisualization: this.currentState.workflowVisualization,
        userRequest,
        context: {
          previousRefinements,
          availableTools,
          constraints: []
        }
      };

      this.events.onProgress('refining', 50);

      const response = await this.refinementAgent.refineWorkflow(request);

      this.events.onProgress('refining', 100);

      // Add to refinement history
      const historyItem: RefinementHistoryItem = {
        id: `refinement_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRequest,
        agentResponse: response.explanation,
        changesSummary: response.changes.map(c => c.description).join('; ')
      };

      this.updateState({
        workflowVisualization: response.updatedVisualization,
        partialWorkflow: response.updatedWorkflow,
        refinementHistory: [...this.currentState.refinementHistory, historyItem],
        currentStep: 'preview',
        loading: false,
        userInput: ''
      });

    } catch (error) {
      this.handleError(`Refinement failed: ${error.message}`);
    }
  }

  /**
   * Regenerate workflow using Agent 1 (discard current refinements)
   */
  async regenerateWorkflow(
    chatTranscript: ChatTranscript,
    preferences?: Partial<WorkflowGenerationPreferences>
  ): Promise<void> {
    const fullPreferences: WorkflowGenerationPreferences = {
      complexity: preferences?.complexity || this.config.defaultComplexity,
      includeVisualization: preferences?.includeVisualization ?? true,
      autoSave: preferences?.autoSave ?? this.config.enableAutoSave,
      tags: preferences?.tags || []
    };

    try {
      this.updateState({
        currentStep: 'synthesizing',
        loading: true,
        refinementHistory: []
      });

      await this.synthesizeWorkflow(chatTranscript, fullPreferences);
    } catch (error) {
      this.handleError(`Regeneration failed: ${error.message}`);
    }
  }

  /**
   * Finalize and save workflow using Agent 3
   */
  async finalizeWorkflow(): Promise<WorkflowTemplate> {
    if (!this.currentState.partialWorkflow || !this.currentState.workflowVisualization) {
      throw new Error('No workflow available for finalization');
    }

    try {
      this.updateState({
        currentStep: 'finalizing',
        loading: true
      });

      this.events.onProgress('finalizing', 0);

      const availableTools = await this.getAvailableTools();
      const validationContext: ValidationContext = {
        availableTools,
        schemaVersion: '1.0.0',
        enforcedConstraints: []
      };

      const request: WorkflowFinalizationRequest = {
        workflowVisualization: this.currentState.workflowVisualization,
        partialWorkflow: this.currentState.partialWorkflow,
        validationContext
      };

      this.events.onProgress('finalizing', 50);

      const response = await this.finalizerAgent.finalizeWorkflow(request);

      this.events.onProgress('finalizing', 90);

      if (!response.schemaCompliance) {
        const errors = response.validationResults
          .filter(r => r.severity === 'error')
          .map(r => r.message)
          .join('; ');
        throw new Error(`Schema validation failed: ${errors}`);
      }

      // Save the workflow
      await this.saveWorkflow(response.finalizedWorkflow);

      this.events.onProgress('complete', 100);

      this.updateState({
        currentStep: 'complete',
        loading: false
      });

      this.events.onComplete(response.finalizedWorkflow);

      return response.finalizedWorkflow;

    } catch (error) {
      this.handleError(`Finalization failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update ASCII visualization directly (direct editing mode)
   */
  updateVisualization(newVisualization: string): void {
    this.updateState({
      workflowVisualization: newVisualization
    });
  }

  /**
   * Close the workflow generation interface
   */
  closeWorkflowGeneration(): void {
    this.updateState({
      isOpen: false,
      currentStep: 'analyzing',
      loading: false,
      workflowVisualization: '',
      partialWorkflow: {},
      refinementHistory: [],
      userInput: '',
      error: undefined
    });
  }

  /**
   * Get current state
   */
  getCurrentState(): WorkflowGenerationUIState {
    return { ...this.currentState };
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<WorkflowGenerationUIState>): void {
    this.currentState = { ...this.currentState, ...updates };
    this.events.onStateChange(this.currentState);
  }

  /**
   * Handle errors
   */
  private handleError(error: string): void {
    this.updateState({
      error,
      loading: false
    });
    this.events.onError(error);
  }

  /**
   * Get available tools from the tool router
   */
  private async getAvailableTools(): Promise<string[]> {
    // In a real implementation, this would query the tool router
    // for all available tools
    return [
      'read_file',
      'write_file',
      'search_files',
      'search_code',
      'edit_block',
      'create_todolist',
      'execute_task',
      'web_search'
    ];
  }

  /**
   * Save workflow to storage
   */
  private async saveWorkflow(workflow: WorkflowTemplate): Promise<void> {
    // In a real implementation, this would save to the workflow storage system
    console.log('Saving workflow:', workflow.workflowId);
    
    // Store in localStorage for now
    const existingWorkflows = this.getStoredWorkflows();
    existingWorkflows[workflow.workflowId] = workflow;
    localStorage.setItem('tanuki_workflows', JSON.stringify(existingWorkflows));
  }

  /**
   * Get stored workflows
   */
  private getStoredWorkflows(): Record<string, WorkflowTemplate> {
    try {
      const stored = localStorage.getItem('tanuki_workflows');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get all stored workflows
   */
  async getWorkflows(): Promise<WorkflowTemplate[]> {
    const workflows = this.getStoredWorkflows();
    return Object.values(workflows);
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<WorkflowTemplate | null> {
    const workflows = this.getStoredWorkflows();
    return workflows[workflowId] || null;
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    const workflows = this.getStoredWorkflows();
    delete workflows[workflowId];
    localStorage.setItem('tanuki_workflows', JSON.stringify(workflows));
  }

  /**
   * Search workflows
   */
  async searchWorkflows(query: string): Promise<WorkflowTemplate[]> {
    const workflows = await this.getWorkflows();
    const lowerQuery = query.toLowerCase();
    
    return workflows.filter(workflow => 
      workflow.name.toLowerCase().includes(lowerQuery) ||
      workflow.description.toLowerCase().includes(lowerQuery) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get agent status information
   */
  getAgentStatus(): {
    synthesizer: any;
    refinement: any;
    finalizer: any;
  } {
    return {
      synthesizer: this.synthesizerAgent.getStatus(),
      refinement: this.refinementAgent.getStatus(),
      finalizer: this.finalizerAgent.getStatus()
    };
  }
}