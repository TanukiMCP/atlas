import { useLLMStore } from '../stores/llm-store';
import { OpenRouterService } from './OpenRouterService';

export class ModelHubService {
  private openRouterService: OpenRouterService;

  constructor(openRouterService: OpenRouterService) {
    this.openRouterService = openRouterService;
  }

  /**
   * Get all available free models (from OpenRouter)
   */
  async getAvailableModels() {
    return await this.openRouterService.getAvailableModels();
  }

  /**
   * Get the currently selected model (id)
   */
  getCurrentModel(): string | null {
    return useLLMStore.getState().currentModel;
  }

  /**
   * Set the current model (by id)
   */
  setCurrentModel(modelId: string) {
    useLLMStore.getState().setCurrentModel(modelId);
  }

  /**
   * Refresh the list of available models (updates store)
   */
  async refreshModels() {
    await useLLMStore.getState().refreshModels();
  }

  /**
   * Get model recommendations for a task type
   */
  async getModelRecommendations(taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') {
    return await useLLMStore.getState().getModelRecommendations(taskType);
  }
  /**
   * Get the best model for a task type
   */
  async getBestModelForTask(taskType: 'coding' | 'reasoning' | 'conversation' | 'creative' | 'general') {
    return await useLLMStore.getState().getBestModelForTask(taskType);
  }

  /**
   * Check OpenRouter health (connection, available models)
   */
  async checkHealth() {
    await useLLMStore.getState().checkHealth();
    return useLLMStore.getState().healthStatus;
  }
}

// Singleton export for app-wide use
import { openRouterService } from './openrouter-singleton';
export const modelHubService = new ModelHubService(openRouterService);
