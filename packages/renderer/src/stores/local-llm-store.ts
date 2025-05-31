import { create } from 'zustand';
import { TanukiModel, SystemCapabilities, ModelRequirements } from '../types';
import { OllamaService } from '../services/OllamaService';

interface LocalLLMState {
  // Models
  availableModels: TanukiModel[];
  installedModels: TanukiModel[];
  currentModel: TanukiModel | null;
  isLoading: boolean;
  error: string | null;
  
  // System capabilities
  systemCapabilities: SystemCapabilities | null;
  isSystemCapable: boolean;
  hardwareAssessment: {
    warnings: string[];
    limitations: string[];
    optimizationTips: string[];
  } | null;
  
  // Server status
  isServerRunning: boolean;
  serverUrl: string;
  serverVersion: string | null;
  
  // Installation progress
  modelInstallProgress: Record<string, number>;
  
  // Actions
  checkSystemRequirements: () => Promise<boolean>;
  installModel: (modelName: string) => Promise<boolean>;
  uninstallModel: (modelName: string) => Promise<boolean>;
  startServer: () => Promise<boolean>;
  stopServer: () => Promise<boolean>;
  setCurrentModel: (modelName: string) => void;
  fetchAvailableModels: () => Promise<TanukiModel[]>;
  fetchInstalledModels: () => Promise<TanukiModel[]>;
  getModelCompatibility: (model: TanukiModel) => 'compatible' | 'limited' | 'incompatible';
  generateResponse: (prompt: string, options?: any) => Promise<string>;
}

// Default system capabilities for when we can't detect them
const DEFAULT_SYSTEM_CAPABILITIES: SystemCapabilities = {
  totalRam: 8 * 1024, // 8 GB in MB
  availableRam: 4 * 1024, // 4 GB in MB
  cpuCores: 4,
  diskSpace: 50 * 1024, // 50 GB in MB
  recommendedModels: ['llama2-7b-chat-q4_0', 'mistral-7b-instruct-v0.1-q4_0']
};

// Minimum requirements to run any local LLM
const MINIMUM_SYSTEM_REQUIREMENTS: SystemCapabilities = {
  totalRam: 8 * 1024, // 8 GB in MB
  availableRam: 2 * 1024, // 2 GB in MB
  cpuCores: 2,
  diskSpace: 10 * 1024, // 10 GB in MB
  recommendedModels: []
};

// Create OllamaService instance
const ollamaService = new OllamaService('http://localhost:11434');

export const useLocalLLMStore = create<LocalLLMState>((set, get) => ({
  availableModels: [],
  installedModels: [],
  currentModel: null,
  isLoading: false,
  error: null,
  systemCapabilities: null,
  isSystemCapable: false,
  hardwareAssessment: null,
  isServerRunning: false,
  serverUrl: 'http://localhost:11434',
  serverVersion: null,
  modelInstallProgress: {},
  
  checkSystemRequirements: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get system capabilities from the main process
      let capabilities: SystemCapabilities | null = null;
      
      if (window.electronAPI?.invoke) {
        try {
          capabilities = await window.electronAPI.invoke('system:getCapabilities');
          
          // Get hardware assessment
          const assessment = await window.electronAPI.invoke('system:assessHardwareForLLM');
          
          set({ 
            hardwareAssessment: {
              warnings: assessment.warnings || [],
              limitations: assessment.limitations || [],
              optimizationTips: assessment.optimizationTips || []
            }
          });
        } catch (error) {
          console.error('Failed to get system capabilities:', error);
          capabilities = null;
        }
      }
      
      // If we couldn't get capabilities, use defaults
      if (!capabilities) {
        console.warn('Using default system capabilities');
        capabilities = DEFAULT_SYSTEM_CAPABILITIES;
      }
      
      // Check if the system meets minimum requirements
      const isCapable = 
        capabilities.totalRam >= MINIMUM_SYSTEM_REQUIREMENTS.totalRam &&
        capabilities.availableRam >= MINIMUM_SYSTEM_REQUIREMENTS.availableRam &&
        capabilities.cpuCores >= MINIMUM_SYSTEM_REQUIREMENTS.cpuCores &&
        capabilities.diskSpace >= MINIMUM_SYSTEM_REQUIREMENTS.diskSpace;
      
      set({ 
        systemCapabilities: capabilities, 
        isSystemCapable: isCapable,
        error: isCapable ? null : 'Your system does not meet the minimum requirements to run local LLMs'
      });
      
      // Set system capabilities in OllamaService
      ollamaService.setSystemCapabilities(capabilities);
      
      // Check if the server is running
      try {
        const isRunning = await ollamaService.checkConnection();
        if (isRunning) {
          const version = await ollamaService.getVersion();
          set({ isServerRunning: true, serverVersion: version });
          
          // If server is running, fetch available models
          await get().fetchAvailableModels();
        }
      } catch (error) {
        console.error('Error checking Ollama server:', error);
        set({ isServerRunning: false });
      }
      
      return isCapable;
    } catch (error) {
      console.error('Error checking system requirements:', error);
      set({ 
        error: 'Failed to check system requirements', 
        isSystemCapable: false 
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchAvailableModels: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if server is running first
      const isRunning = await ollamaService.checkConnection();
      if (!isRunning) {
        set({ isServerRunning: false });
        return [];
      }
      
      // Fetch models using OllamaService
      const models = await ollamaService.listModels();
      
      set({ availableModels: models, installedModels: models });
      return models;
    } catch (error) {
      console.error('Error fetching available models:', error);
      set({ error: 'Failed to fetch available models' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchInstalledModels: async () => {
    // For Ollama, available models are the same as installed models
    return get().fetchAvailableModels();
  },
  
  installModel: async (modelName: string) => {
    set({ isLoading: true, error: null });
    set(state => ({
      modelInstallProgress: {
        ...state.modelInstallProgress,
        [modelName]: 0
      }
    }));
    
    try {
      // Check if system meets requirements
      if (!get().isSystemCapable) {
        set({ error: 'Your system does not meet the minimum requirements to run local LLMs' });
        return false;
      }
      
      // Install model with progress tracking
      const success = await ollamaService.installModel(modelName, (progress) => {
        set(state => ({
          modelInstallProgress: {
            ...state.modelInstallProgress,
            [modelName]: progress
          }
        }));
      });
      
      if (success) {
        // Refresh installed models list
        await get().fetchInstalledModels();
      }
      
      return success;
    } catch (error) {
      console.error('Error installing model:', error);
      set({ error: `Failed to install model: ${error instanceof Error ? error.message : String(error)}` });
      return false;
    } finally {
      set(state => ({
        isLoading: false,
        modelInstallProgress: {
          ...state.modelInstallProgress,
          [modelName]: 100 // Set to 100% when done or failed
        }
      }));
    }
  },
  
  uninstallModel: async (modelName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Uninstall model using OllamaService
      const success = await ollamaService.uninstallModel(modelName);
      
      if (success) {
        // Refresh installed models list
        await get().fetchInstalledModels();
        
        // If current model was uninstalled, set current model to null
        if (get().currentModel?.name === modelName) {
          set({ currentModel: null });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error uninstalling model:', error);
      set({ error: `Failed to uninstall model: ${error instanceof Error ? error.message : String(error)}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  startServer: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Start Ollama server via Electron main process
      if (window.electronAPI?.invoke) {
        const result = await window.electronAPI.invoke('llm:startLocalServer');
        
        if (result.success) {
          // Check server connection
          const isRunning = await ollamaService.checkConnection();
          if (isRunning) {
            const version = await ollamaService.getVersion();
            set({ 
              isServerRunning: true, 
              serverUrl: result.url || get().serverUrl,
              serverVersion: version
            });
            
            // Update OllamaService base URL
            ollamaService.setBaseUrl(result.url || get().serverUrl);
            
            return true;
          }
        } else {
          throw new Error(result.error || 'Failed to start LLM server');
        }
      } else {
        throw new Error('Electron API not available');
      }
      
      return false;
    } catch (error) {
      console.error('Error starting LLM server:', error);
      set({ error: `Failed to start LLM server: ${error instanceof Error ? error.message : String(error)}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  stopServer: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Stop Ollama server via Electron main process
      if (window.electronAPI?.invoke) {
        const result = await window.electronAPI.invoke('llm:stopLocalServer');
        
        if (result.success) {
          set({ isServerRunning: false, serverVersion: null });
          return true;
        } else {
          throw new Error(result.error || 'Failed to stop LLM server');
        }
      } else {
        throw new Error('Electron API not available');
      }
    } catch (error) {
      console.error('Error stopping LLM server:', error);
      set({ error: `Failed to stop LLM server: ${error instanceof Error ? error.message : String(error)}` });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  setCurrentModel: (modelName: string) => {
    const model = get().availableModels.find(m => m.name === modelName);
    if (model) {
      set({ currentModel: model });
    } else {
      console.error(`Model ${modelName} not found`);
    }
  },
  
  getModelCompatibility: (model: TanukiModel): 'compatible' | 'limited' | 'incompatible' => {
    const capabilities = get().systemCapabilities;
    if (!capabilities) return 'incompatible';
    
    // Check RAM requirements
    if (capabilities.availableRam < model.requirements.minRam) {
      return 'incompatible';
    }
    
    // Check if we have enough RAM for recommended performance
    const hasRecommendedRam = capabilities.availableRam >= model.requirements.recommendedRam;
    
    // Check GPU requirements if the model has them
    if (model.requirements.minVram && model.requirements.minVram > 0) {
      // If we have GPU info
      if (capabilities.gpuInfo) {
        const totalVram = capabilities.gpuInfo.memory;
        
        // If we don't have enough VRAM, model can still run on CPU but with limited performance
        if (totalVram < model.requirements.minVram) {
          return 'limited';
        }
        
        // If we have enough VRAM but not recommended RAM, still limited
        if (!hasRecommendedRam) {
          return 'limited';
        }
        
        // We have both enough VRAM and RAM
        return 'compatible';
      } else {
        // No GPU, but model prefers one - limited compatibility
        return 'limited';
      }
    }
    
    // No GPU requirements, just check RAM
    return hasRecommendedRam ? 'compatible' : 'limited';
  },
  
  generateResponse: async (prompt: string, options = {}) => {
    const currentModel = get().currentModel;
    if (!currentModel) {
      throw new Error('No model selected');
    }
    
    if (!get().isServerRunning) {
      throw new Error('Ollama server is not running');
    }
    
    return await ollamaService.generate(currentModel.name, prompt, options);
  }
}));

export default useLocalLLMStore; 