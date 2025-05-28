export type ViewType = 'chat' | 'editor' | 'workflow-manager' | 'settings' | 'tool-browser' | 'mcp-servers' | 'prompt-management' | 'performance-monitor' | 'about' | 'welcome';
export type SubjectMode = 'general' | 'math' | 'code' | 'science' | 'language' | 'creative' | 'business';
interface ViewState {
    currentView: ViewType;
    setView: (view: ViewType) => void;
    isFileExplorerVisible: boolean;
    toggleFileExplorer: () => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    subjectMode: SubjectMode;
    setSubjectMode: (mode: SubjectMode) => void;
    agentMode: boolean;
    setAgentMode: (enabled: boolean) => void;
    selectedFile: string | null;
    setSelectedFile: (file: string | null) => void;
    isProcessing: boolean;
    setProcessing: (processing: boolean) => void;
    leftPanelWidth: number;
    setLeftPanelWidth: (width: number) => void;
    rightPanelWidth: number;
    setRightPanelWidth: (width: number) => void;
}
export declare const useViewStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ViewState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ViewState, {
            isFileExplorerVisible: boolean;
            subjectMode: SubjectMode;
            agentMode: boolean;
            leftPanelWidth: number;
            rightPanelWidth: number;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ViewState) => void) => () => void;
        onFinishHydration: (fn: (state: ViewState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ViewState, {
            isFileExplorerVisible: boolean;
            subjectMode: SubjectMode;
            agentMode: boolean;
            leftPanelWidth: number;
            rightPanelWidth: number;
        }>>;
    };
}>;
export {};
//# sourceMappingURL=viewStore.d.ts.map