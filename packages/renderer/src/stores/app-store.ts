import { create } from 'zustand';
import { useSettingsStore } from './settings-store';
// import { persist } from 'zustand/middleware';

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

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

// Define a more specific ViewType if available, using string for now
export type ViewType = 'welcome' | 'chat' | 'files' | 'tools' | 'workflows' | 'settings' | string;

interface AppState {
  // Layout
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isSidebarVisible: boolean;
  setSidebarVisible: (isVisible: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Files
  files: FileNode[];
  selectedFile: FileNode | null;
  setFiles: (files: FileNode[]) => void;
  setSelectedFile: (file: FileNode | null) => void;
  
  // Chat & Sessions
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  currentChatSessionId: string | null;
  setCurrentChatSessionId: (sessionId: string | null) => void;

  // Project
  currentProjectId: string | null;
  setCurrentProjectId: (projectId: string | null) => void;
  
  // Tools
  showToolSelector: boolean;
  setShowToolSelector: (show: boolean) => void;
  
  // Subject Mode
  currentSubjectMode: string;
  setCurrentSubjectMode: (mode: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;

  // Global Loaders & Errors
  isLoading: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  errors: Record<string, string | null>;
  setError: (key: string, error: string | null) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Layout
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  isSidebarVisible: true,
  setSidebarVisible: (isVisible) => set({ isSidebarVisible: isVisible }),
  activeTab: 'chat',
  setActiveTab: (tab) => set({ activeTab: tab }),
  currentView: 'welcome',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Files
  files: [],
  selectedFile: null,
  setFiles: (files) => set({ files }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  
  // Chat & Sessions
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
  currentChatSessionId: null,
  setCurrentChatSessionId: (sessionId) => set({ currentChatSessionId: sessionId }),

  // Project
  currentProjectId: null,
  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
  
  // Tools
  showToolSelector: false,
  setShowToolSelector: (show) => set({ showToolSelector: show }),
  
  // Subject Mode
  currentSubjectMode: 'Mathematics',
  setCurrentSubjectMode: (mode) => set({ currentSubjectMode: mode }),

  // Notifications
  notifications: [],
  addNotification: (notificationContent) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
        ...notificationContent,
      },
    ],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  // Global Loaders & Errors
  isLoading: {},
  setLoading: (key, isLoading) => set((state) => ({
    isLoading: { ...state.isLoading, [key]: isLoading },
  })),
  errors: {},
  setError: (key, error) => set((state) => ({
    errors: { ...state.errors, [key]: error },
  })),
}));

// Convenience hooks for specific parts of the store
export const useTheme = () => {
  const { settings, updateSettings } = useSettingsStore();
  
  return {
    theme: settings.theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      settings.theme,
    setTheme: (theme: 'light' | 'dark') => {
      updateSettings({ theme });
    }
  };
};

export const useFiles = () => useAppStore(state => ({ 
  files: state.files, 
  selectedFile: state.selectedFile,
  setFiles: state.setFiles,
  setSelectedFile: state.setSelectedFile
}));
export const useChat = () => useAppStore(state => ({ 
  messages: state.messages,
  addMessage: state.addMessage,
  clearMessages: state.clearMessages,
  currentChatSessionId: state.currentChatSessionId,
  setCurrentChatSessionId: state.setCurrentChatSessionId
}));
export const useLayout = () => useAppStore(state => ({
  sidebarCollapsed: state.sidebarCollapsed,
  setSidebarCollapsed: state.setSidebarCollapsed,
  isSidebarVisible: state.isSidebarVisible,
  setSidebarVisible: state.setSidebarVisible,
  activeTab: state.activeTab,
  setActiveTab: state.setActiveTab,
  currentView: state.currentView,
  setCurrentView: state.setCurrentView
}));
export const useTools = () => useAppStore(state => ({
  showToolSelector: state.showToolSelector,
  setShowToolSelector: state.setShowToolSelector
}));
export const useSubjectMode = () => useAppStore(state => ({
  currentSubjectMode: state.currentSubjectMode,
  setCurrentSubjectMode: state.setCurrentSubjectMode
}));

// Added convenience hooks for new state slices
export const useNotifications = () => useAppStore(state => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
}));

export const useProject = () => useAppStore(state => ({
  currentProjectId: state.currentProjectId,
  setCurrentProjectId: state.setCurrentProjectId,
}));

export const useStatusIndicators = () => useAppStore(state => ({
  isLoading: state.isLoading,
  setLoading: state.setLoading,
  errors: state.errors,
  setError: state.setError,
})); 