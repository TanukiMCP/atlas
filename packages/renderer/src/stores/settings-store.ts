import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface Settings {
  tokenLimit: number;
  localLLMEnabled: boolean;
  theme: Theme;
  fontSize: 'small' | 'medium' | 'large';
  editorFontSize: number;
  terminalFontSize: number;
  showLineNumbers: boolean;
  defaultModel: string;
}

interface SettingsStore extends Settings {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: Settings['fontSize']) => void;
  setEditorFontSize: (size: number) => void;
  setTerminalFontSize: (size: number) => void;
  setShowLineNumbers: (show: boolean) => void;
  setTokenLimit: (limit: number) => void;
  setLocalLLMEnabled: (enabled: boolean) => void;
  setDefaultModel: (model: string) => void;
}

const DEFAULT_SETTINGS: Settings = {
  tokenLimit: 4000,
  localLLMEnabled: false,
  theme: 'system',
  fontSize: 'medium',
  editorFontSize: 14,
  terminalFontSize: 14,
  showLineNumbers: true,
  defaultModel: 'meta-llama/llama-3.1-8b-instruct'
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      tokenLimit: 4000,
      localLLMEnabled: false,
      theme: 'system',
      fontSize: 'medium',
      editorFontSize: 14,
      terminalFontSize: 14,
      showLineNumbers: true,
      defaultModel: '',

      // Actions
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setTerminalFontSize: (terminalFontSize) => set({ terminalFontSize }),
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      setTokenLimit: (tokenLimit) => set({ tokenLimit }),
      setLocalLLMEnabled: (localLLMEnabled) => set({ localLLMEnabled }),
      setDefaultModel: (defaultModel) => set({ defaultModel }),
    }),
    {
      name: 'tanuki-settings',
    }
  )
);

// Helper function to access the settings store from outside React components
export const getSettingsStore = () => {
  return {
    getSettings: () => useSettingsStore.getState().settings,
    updateSettings: useSettingsStore.getState().updateSettings,
    resetSettings: useSettingsStore.getState().resetSettings
  };
}; 