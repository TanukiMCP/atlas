import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modified: Date;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tools?: string[];
}

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Layout
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Files
  files: FileNode[];
  selectedFile: FileNode | null;
  setFiles: (files: FileNode[]) => void;
  setSelectedFile: (file: FileNode | null) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // Tools
  showToolSelector: boolean;
  setShowToolSelector: (show: boolean) => void;
  
  // Subject Mode
  currentSubjectMode: string;
  setCurrentSubjectMode: (mode: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Layout
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      activeTab: 'chat',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Files
      files: [],
      selectedFile: null,
      setFiles: (files) => set({ files }),
      setSelectedFile: (file) => set({ selectedFile: file }),
      
      // Chat
      messages: [
        {
          id: '1',
          type: 'system',
          content: 'Welcome to TanukiMCP Atlas! I\'m here to help you with AI-driven development workflows.',
          timestamp: new Date(Date.now() - 300000),
        }
      ],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      clearMessages: () => set({ messages: [] }),
      
      // Tools
      showToolSelector: false,
      setShowToolSelector: (show) => set({ showToolSelector: show }),
      
      // Subject Mode
      currentSubjectMode: 'Mathematics',
      setCurrentSubjectMode: (mode) => set({ currentSubjectMode: mode }),
    }),
    {
      name: 'tanukimcp-atlas-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        currentSubjectMode: state.currentSubjectMode,
      }),
    }
  )
);

// Convenience hooks for specific parts of the store
export const useTheme = () => useAppStore(state => ({ theme: state.theme, setTheme: state.setTheme }));
export const useFiles = () => useAppStore(state => ({ 
  files: state.files, 
  selectedFile: state.selectedFile,
  setFiles: state.setFiles,
  setSelectedFile: state.setSelectedFile
}));
export const useChat = () => useAppStore(state => ({ 
  messages: state.messages,
  addMessage: state.addMessage,
  clearMessages: state.clearMessages
}));
export const useLayout = () => useAppStore(state => ({
  sidebarCollapsed: state.sidebarCollapsed,
  setSidebarCollapsed: state.setSidebarCollapsed,
  activeTab: state.activeTab,
  setActiveTab: state.setActiveTab
}));
export const useTools = () => useAppStore(state => ({
  showToolSelector: state.showToolSelector,
  setShowToolSelector: state.setShowToolSelector
}));
export const useSubjectMode = () => useAppStore(state => ({
  currentSubjectMode: state.currentSubjectMode,
  setCurrentSubjectMode: state.setCurrentSubjectMode
})); 