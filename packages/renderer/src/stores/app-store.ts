import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the app state interface
interface AppState {
  // Theme management
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // App initialization state
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
  
  // Current project
  currentProject: {
    id: string;
    name: string;
    path: string;
  } | null;
  setCurrentProject: (project: AppState['currentProject']) => void;
  
  // UI state
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
  
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  
  // Current view
  currentView: 'welcome' | 'chat' | 'files' | 'settings';
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Chat state
  currentChatSession: string | null;
  setCurrentChatSession: (sessionId: string | null) => void;
  
  // Subject mode
  currentSubjectMode: string;
  setCurrentSubjectMode: (mode: string) => void;
  
  // Notification system
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
  }>;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  
  // Loading states
  loading: {
    [key: string]: boolean;
  };
  setLoading: (key: string, loading: boolean) => void;
  
  // Error states
  errors: {
    [key: string]: string | null;
  };
  setError: (key: string, error: string | null) => void;
  
  // Actions
  reset: () => void;
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme management
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        // Also save to Electron settings if available
        if (typeof window !== 'undefined' && window.electronAPI) {
          window.electronAPI.invoke('settings:set', 'app.theme', theme)
            .catch(err => console.warn('Failed to save theme setting:', err));
        }
      },
      
      // App initialization
      isInitialized: false,
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      // Project management
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      
      // UI state
      sidebarVisible: true,
      setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
      
      sidebarWidth: 280,
      setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(600, width)) }),
      
      // View management
      currentView: 'welcome',
      setCurrentView: (view) => set({ currentView: view }),
      
      // Chat management
      currentChatSession: null,
      setCurrentChatSession: (sessionId) => set({ currentChatSession: sessionId }),
      
      // Subject mode
      currentSubjectMode: 'general',
      setCurrentSubjectMode: (mode) => set({ currentSubjectMode: mode }),
      
      // Notification system
      notifications: [],
      addNotification: (notification) => {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newNotification = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep max 50 notifications
        }));
        
        // Auto-remove info notifications after 5 seconds
        if (notification.type === 'info') {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      
      // Loading states
      loading: {},
      setLoading: (key, loading) => {
        set(state => ({
          loading: { ...state.loading, [key]: loading }
        }));
      },
      
      // Error states
      errors: {},
      setError: (key, error) => {
        set(state => ({
          errors: { ...state.errors, [key]: error }
        }));
      },
      
      // Reset function
      reset: () => {
        set({
          isInitialized: false,
          currentProject: null,
          currentView: 'welcome',
          currentChatSession: null,
          currentSubjectMode: 'general',
          notifications: [],
          loading: {},
          errors: {}
        });
      }
    }),
    {
      name: 'tanukimcp-app-store',
      partialize: (state) => ({
        // Only persist certain parts of the state
        theme: state.theme,
        sidebarVisible: state.sidebarVisible,
        sidebarWidth: state.sidebarWidth,
        currentSubjectMode: state.currentSubjectMode,
        currentProject: state.currentProject
      })
    }
  )
);

// Convenience hooks for specific parts of the store
export const useTheme = () => useAppStore(state => ({ theme: state.theme, setTheme: state.setTheme }));
export const useCurrentProject = () => useAppStore(state => ({ 
  currentProject: state.currentProject, 
  setCurrentProject: state.setCurrentProject 
}));
export const useCurrentView = () => useAppStore(state => ({ 
  currentView: state.currentView, 
  setCurrentView: state.setCurrentView 
}));
export const useNotifications = () => useAppStore(state => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markNotificationRead: state.markNotificationRead
}));
export const useLoading = () => useAppStore(state => ({
  loading: state.loading,
  setLoading: state.setLoading
}));
export const useErrors = () => useAppStore(state => ({
  errors: state.errors,
  setError: state.setError
})); 