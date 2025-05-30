import { HardwareAssessor } from './hardware-assessor';

// OpenRouter-focused model management service

interface ModelConfiguration {
  name: string;
  parameters: {
    temperature: number;
    top_p: number;
    max_tokens: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  isDefault: boolean;
}

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
  };
}

export class ModelManager {
  private hardwareAssessor: HardwareAssessor;
  private configurations = new Map<string, ModelConfiguration>();
  private availableModels: OpenRouterModel[] = [];

  constructor() {
    this.hardwareAssessor = new HardwareAssessor();
    this.initializeDefaultConfigurations();
  }

  private initializeDefaultConfigurations(): void {
    const defaultConfig: ModelConfiguration = {
      name: 'default',
      parameters: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      isDefault: true
    };
    
    this.configurations.set('default', defaultConfig);
  }
}