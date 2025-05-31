import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  tokenLimit: number;
  localLLMEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  editorFontSize: number;
  terminalFontSize: number;
  showLineNumbers: boolean;
  defaultModel: string;
}

interface SettingsStore {
  settings: Settings;
  getSettings: () => Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
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
    (set, get) => ({
      settings: { ...DEFAULT_SETTINGS },
      
      getSettings: () => get().settings,
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS } });
      }
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