"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubjectMode = exports.useTools = exports.useLayout = exports.useChat = exports.useFiles = exports.useTheme = exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useAppStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
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
}), {
    name: 'tanukimcp-atlas-store',
    partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        currentSubjectMode: state.currentSubjectMode,
    }),
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
    clearMessages: state.clearMessages
}));
exports.useChat = useChat;
const useLayout = () => (0, exports.useAppStore)(state => ({
    sidebarCollapsed: state.sidebarCollapsed,
    setSidebarCollapsed: state.setSidebarCollapsed,
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab
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
//# sourceMappingURL=app-store.js.map