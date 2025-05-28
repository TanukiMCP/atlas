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
export type ViewType = 'welcome' | 'chat' | 'files' | 'tools' | 'workflows' | 'settings' | string;
interface AppState {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    isSidebarVisible: boolean;
    setSidebarVisible: (isVisible: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    files: FileNode[];
    selectedFile: FileNode | null;
    setFiles: (files: FileNode[]) => void;
    setSelectedFile: (file: FileNode | null) => void;
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    currentChatSessionId: string | null;
    setCurrentChatSessionId: (sessionId: string | null) => void;
    currentProjectId: string | null;
    setCurrentProjectId: (projectId: string | null) => void;
    showToolSelector: boolean;
    setShowToolSelector: (show: boolean) => void;
    currentSubjectMode: string;
    setCurrentSubjectMode: (mode: string) => void;
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    isLoading: Record<string, boolean>;
    setLoading: (key: string, isLoading: boolean) => void;
    errors: Record<string, string | null>;
    setError: (key: string, error: string | null) => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export declare const useTheme: () => {
    theme: "dark" | "light";
    setTheme: (theme: "light" | "dark") => void;
};
export declare const useFiles: () => {
    files: FileNode[];
    selectedFile: FileNode | null;
    setFiles: (files: FileNode[]) => void;
    setSelectedFile: (file: FileNode | null) => void;
};
export declare const useChat: () => {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    currentChatSessionId: string | null;
    setCurrentChatSessionId: (sessionId: string | null) => void;
};
export declare const useLayout: () => {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    isSidebarVisible: boolean;
    setSidebarVisible: (isVisible: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentView: string;
    setCurrentView: (view: ViewType) => void;
};
export declare const useTools: () => {
    showToolSelector: boolean;
    setShowToolSelector: (show: boolean) => void;
};
export declare const useSubjectMode: () => {
    currentSubjectMode: string;
    setCurrentSubjectMode: (mode: string) => void;
};
export declare const useNotifications: () => {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
    removeNotification: (id: string) => void;
};
export declare const useProject: () => {
    currentProjectId: string | null;
    setCurrentProjectId: (projectId: string | null) => void;
};
export declare const useStatusIndicators: () => {
    isLoading: Record<string, boolean>;
    setLoading: (key: string, isLoading: boolean) => void;
    errors: Record<string, string | null>;
    setError: (key: string, error: string | null) => void;
};
export {};
//# sourceMappingURL=app-store.d.ts.map