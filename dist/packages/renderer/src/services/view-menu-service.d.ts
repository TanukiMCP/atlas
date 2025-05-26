/**
 * View Menu Service - Comprehensive implementation for all View menu operations
 * Provides production-quality functionality for View menu items including:
 * - Command Palette management
 * - Panel visibility controls (File Explorer, Chat History, etc.)
 * - Layout and window management
 * - Zoom and display controls
 * - Theme and appearance settings
 * - Fullscreen management
 */
export interface ViewState {
    fileExplorerVisible: boolean;
    chatHistoryVisible: boolean;
    terminalPanelVisible: boolean;
    outputPanelVisible: boolean;
    problemsPanelVisible: boolean;
    isFullscreen: boolean;
    currentZoom: number;
    layoutMode: 'normal' | 'zen' | 'presentation';
    sidebarPosition: 'left' | 'right';
    commandPaletteOpen: boolean;
    currentTheme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    showMinimap: boolean;
    showBreadcrumbs: boolean;
    showLineNumbers: boolean;
}
export interface CommandPaletteItem {
    id: string;
    label: string;
    description?: string;
    category: string;
    shortcut?: string;
    icon?: string;
    action: () => void | Promise<void | boolean>;
    keywords?: string[];
}
export interface PanelConfiguration {
    id: string;
    name: string;
    defaultVisible: boolean;
    position: 'left' | 'right' | 'bottom' | 'top';
    minWidth?: number;
    minHeight?: number;
    resizable: boolean;
}
export declare class ViewMenuService {
    private static instance;
    private viewState;
    private commandPaletteItems;
    private panelConfigurations;
    static getInstance(): ViewMenuService;
    constructor();
    /**
     * Get current view state
     */
    getViewState(): ViewState;
    /**
     * Command Palette Operations
     */
    openCommandPalette(): Promise<boolean>;
    closeCommandPalette(): Promise<void>;
    /**
     * Register new command in palette
     */
    registerCommand(command: CommandPaletteItem): void;
    /**
     * Search commands in palette
     */
    searchCommands(query: string): CommandPaletteItem[];
    /**
     * Panel Management
     */
    toggleFileExplorer(): Promise<boolean>;
    toggleChatHistory(): Promise<boolean>;
    toggleTerminalPanel(): Promise<boolean>;
    toggleOutputPanel(): Promise<boolean>;
    toggleProblemsPanel(): Promise<boolean>;
    /**
     * Layout Management
     */
    toggleFullscreen(): Promise<boolean>;
    setLayoutMode(mode: ViewState['layoutMode']): Promise<boolean>;
    /**
     * Zoom Management
     */
    zoomIn(amount?: number): Promise<boolean>;
    zoomOut(amount?: number): Promise<boolean>;
    resetZoom(): Promise<boolean>;
    setZoom(zoomLevel: number): Promise<boolean>;
    /**
     * Theme Management
     */
    toggleTheme(): Promise<boolean>;
    setTheme(theme: ViewState['currentTheme']): Promise<boolean>;
    /**
     * UI Controls
     */
    toggleCompactMode(): Promise<boolean>;
    toggleMinimap(): Promise<boolean>;
    toggleBreadcrumbs(): Promise<boolean>;
    toggleLineNumbers(): Promise<boolean>;
    /**
     * Window Management
     */
    splitEditorHorizontally(): Promise<boolean>;
    splitEditorVertically(): Promise<boolean>;
    private initializeDefaultCommands;
    private initializePanelConfigurations;
    private setupKeyboardShortcuts;
    private loadPersistedState;
    private persistState;
    private notifyStateChange;
    getCommandPaletteItems(): CommandPaletteItem[];
    getPanelConfiguration(panelId: string): PanelConfiguration | undefined;
    getAllPanelConfigurations(): PanelConfiguration[];
    cleanup(): void;
}
export declare const viewMenuService: ViewMenuService;
//# sourceMappingURL=view-menu-service.d.ts.map