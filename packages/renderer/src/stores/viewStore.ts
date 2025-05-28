import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 
  | 'chat' 
  | 'editor' 
  | 'workflow-manager' 
  | 'settings' 
  | 'tool-browser' 
  | 'mcp-servers' 
  | 'prompt-management'
  | 'performance-monitor'
  | 'about'
  | 'welcome';

export type SubjectMode = 
  | 'general' 
  | 'math' 
  | 'code' 
  | 'science' 
  | 'language' 
  | 'creative' 
  | 'business';

interface ViewState {
  // Current view
  currentView: ViewType;
  setView: (view: ViewType) => void;
  
  // Layout
  isFileExplorerVisible: boolean;
  toggleFileExplorer: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  
  // AI/Chat settings
  subjectMode: SubjectMode;
  setSubjectMode: (mode: SubjectMode) => void;
  agentMode: boolean;
  setAgentMode: (enabled: boolean) => void;
  
  // File management
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  
  // Processing state
  isProcessing: boolean;
  setProcessing: (processing: boolean) => void;
  
  // Split pane sizes
  leftPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'chat',
      isFileExplorerVisible: true,
      isFullscreen: false,
      subjectMode: 'general',
      agentMode: false,
      selectedFile: null,
      isProcessing: false,
      leftPanelWidth: 280,
      rightPanelWidth: 350,

      // Actions
      setView: (view) => set({ currentView: view }),
      
      toggleFileExplorer: () => 
        set(state => ({ isFileExplorerVisible: !state.isFileExplorerVisible })),
      
      toggleFullscreen: () => {
        const newFullscreen = !get().isFullscreen;
        set({ isFullscreen: newFullscreen });
        
        // Actually toggle fullscreen
        if (newFullscreen) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      },
      
      setSubjectMode: (mode) => set({ subjectMode: mode }),
      setAgentMode: (enabled) => set({ agentMode: enabled }),
      setSelectedFile: (file) => set({ selectedFile: file }),
      setProcessing: (processing) => set({ isProcessing: processing }),
      setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
      setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
    }),
    {
      name: 'tanuki-view-store',
      partialize: (state) => ({
        isFileExplorerVisible: state.isFileExplorerVisible,
        subjectMode: state.subjectMode,
        agentMode: state.agentMode,
        leftPanelWidth: state.leftPanelWidth,
        rightPanelWidth: state.rightPanelWidth,
      }),
    }
  )
);