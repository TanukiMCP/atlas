"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrors = exports.useLoading = exports.useNotifications = exports.useCurrentView = exports.useCurrentProject = exports.useTheme = exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
// Create the store with persistence
exports.useAppStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
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
            notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
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
}), {
    name: 'tanukimcp-app-store',
    partialize: (state) => ({
        // Only persist certain parts of the state
        theme: state.theme,
        sidebarVisible: state.sidebarVisible,
        sidebarWidth: state.sidebarWidth,
        currentSubjectMode: state.currentSubjectMode,
        currentProject: state.currentProject
    })
}));
// Convenience hooks for specific parts of the store
const useTheme = () => (0, exports.useAppStore)(state => ({ theme: state.theme, setTheme: state.setTheme }));
exports.useTheme = useTheme;
const useCurrentProject = () => (0, exports.useAppStore)(state => ({
    currentProject: state.currentProject,
    setCurrentProject: state.setCurrentProject
}));
exports.useCurrentProject = useCurrentProject;
const useCurrentView = () => (0, exports.useAppStore)(state => ({
    currentView: state.currentView,
    setCurrentView: state.setCurrentView
}));
exports.useCurrentView = useCurrentView;
const useNotifications = () => (0, exports.useAppStore)(state => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    markNotificationRead: state.markNotificationRead
}));
exports.useNotifications = useNotifications;
const useLoading = () => (0, exports.useAppStore)(state => ({
    loading: state.loading,
    setLoading: state.setLoading
}));
exports.useLoading = useLoading;
const useErrors = () => (0, exports.useAppStore)(state => ({
    errors: state.errors,
    setError: state.setError
}));
exports.useErrors = useErrors;
//# sourceMappingURL=app-store.js.map