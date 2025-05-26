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
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    files: FileNode[];
    selectedFile: FileNode | null;
    setFiles: (files: FileNode[]) => void;
    setSelectedFile: (file: FileNode | null) => void;
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    showToolSelector: boolean;
    setShowToolSelector: (show: boolean) => void;
    currentSubjectMode: string;
    setCurrentSubjectMode: (mode: string) => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, {
            theme: "dark" | "light";
            sidebarCollapsed: boolean;
            currentSubjectMode: string;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, {
            theme: "dark" | "light";
            sidebarCollapsed: boolean;
            currentSubjectMode: string;
        }>>;
    };
}>;
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
};
export declare const useLayout: () => {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
};
export declare const useTools: () => {
    showToolSelector: boolean;
    setShowToolSelector: (show: boolean) => void;
};
export declare const useSubjectMode: () => {
    currentSubjectMode: string;
    setCurrentSubjectMode: (mode: string) => void;
};
export {};
//# sourceMappingURL=app-store.d.ts.map