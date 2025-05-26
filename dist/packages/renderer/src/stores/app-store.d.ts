interface AppState {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    isInitialized: boolean;
    setInitialized: (initialized: boolean) => void;
    currentProject: {
        id: string;
        name: string;
        path: string;
    } | null;
    setCurrentProject: (project: AppState['currentProject']) => void;
    sidebarVisible: boolean;
    setSidebarVisible: (visible: boolean) => void;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    currentView: 'welcome' | 'chat' | 'files' | 'settings';
    setCurrentView: (view: AppState['currentView']) => void;
    currentChatSession: string | null;
    setCurrentChatSession: (sessionId: string | null) => void;
    currentSubjectMode: string;
    setCurrentSubjectMode: (mode: string) => void;
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
    loading: {
        [key: string]: boolean;
    };
    setLoading: (key: string, loading: boolean) => void;
    errors: {
        [key: string]: string | null;
    };
    setError: (key: string, error: string | null) => void;
    reset: () => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, {
            theme: "dark" | "light";
            sidebarVisible: boolean;
            sidebarWidth: number;
            currentSubjectMode: string;
            currentProject: {
                id: string;
                name: string;
                path: string;
            } | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, {
            theme: "dark" | "light";
            sidebarVisible: boolean;
            sidebarWidth: number;
            currentSubjectMode: string;
            currentProject: {
                id: string;
                name: string;
                path: string;
            } | null;
        }>>;
    };
}>;
export declare const useTheme: () => {
    theme: "dark" | "light";
    setTheme: (theme: "light" | "dark") => void;
};
export declare const useCurrentProject: () => {
    currentProject: {
        id: string;
        name: string;
        path: string;
    } | null;
    setCurrentProject: (project: AppState["currentProject"]) => void;
};
export declare const useCurrentView: () => {
    currentView: "settings" | "welcome" | "chat" | "files";
    setCurrentView: (view: AppState["currentView"]) => void;
};
export declare const useNotifications: () => {
    notifications: {
        id: string;
        type: "info" | "success" | "warning" | "error";
        title: string;
        message: string;
        timestamp: number;
        read: boolean;
    }[];
    addNotification: (notification: Omit<AppState["notifications"][0], "id" | "timestamp" | "read">) => void;
    removeNotification: (id: string) => void;
    markNotificationRead: (id: string) => void;
};
export declare const useLoading: () => {
    loading: {
        [key: string]: boolean;
    };
    setLoading: (key: string, loading: boolean) => void;
};
export declare const useErrors: () => {
    errors: {
        [key: string]: string | null;
    };
    setError: (key: string, error: string | null) => void;
};
export {};
//# sourceMappingURL=app-store.d.ts.map