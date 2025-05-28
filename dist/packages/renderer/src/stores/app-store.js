"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatusIndicators = exports.useProject = exports.useNotifications = exports.useSubjectMode = exports.useTools = exports.useLayout = exports.useChat = exports.useFiles = exports.useTheme = exports.useAppStore = void 0;
const zustand_1 = require("zustand");
exports.useAppStore = (0, zustand_1.create)()((set, get) => ({
    // Theme
    theme: 'dark',
    setTheme: (theme) => set({ theme }),
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
const useTheme = () => (0, exports.useAppStore)(state => ({ theme: state.theme, setTheme: state.setTheme }));
exports.useTheme = useTheme;
const useFiles = () => (0, exports.useAppStore)(state => ({
    files: state.files,
    selectedFile: state.selectedFile,
    setFiles: state.setFiles,
    setSelectedFile: state.setSelectedFile
}));
exports.useFiles = useFiles;
const useChat = () => (0, exports.useAppStore)(state => ({
    messages: state.messages,
    addMessage: state.addMessage,
    clearMessages: state.clearMessages,
    currentChatSessionId: state.currentChatSessionId,
    setCurrentChatSessionId: state.setCurrentChatSessionId
}));
exports.useChat = useChat;
const useLayout = () => (0, exports.useAppStore)(state => ({
    sidebarCollapsed: state.sidebarCollapsed,
    setSidebarCollapsed: state.setSidebarCollapsed,
    isSidebarVisible: state.isSidebarVisible,
    setSidebarVisible: state.setSidebarVisible,
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    currentView: state.currentView,
    setCurrentView: state.setCurrentView
}));
exports.useLayout = useLayout;
const useTools = () => (0, exports.useAppStore)(state => ({
    showToolSelector: state.showToolSelector,
    setShowToolSelector: state.setShowToolSelector
}));
exports.useTools = useTools;
const useSubjectMode = () => (0, exports.useAppStore)(state => ({
    currentSubjectMode: state.currentSubjectMode,
    setCurrentSubjectMode: state.setCurrentSubjectMode
}));
exports.useSubjectMode = useSubjectMode;
// Added convenience hooks for new state slices
const useNotifications = () => (0, exports.useAppStore)(state => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
}));
exports.useNotifications = useNotifications;
const useProject = () => (0, exports.useAppStore)(state => ({
    currentProjectId: state.currentProjectId,
    setCurrentProjectId: state.setCurrentProjectId,
}));
exports.useProject = useProject;
const useStatusIndicators = () => (0, exports.useAppStore)(state => ({
    isLoading: state.isLoading,
    setLoading: state.setLoading,
    errors: state.errors,
    setError: state.setError,
}));
exports.useStatusIndicators = useStatusIndicators;
//# sourceMappingURL=app-store.js.map