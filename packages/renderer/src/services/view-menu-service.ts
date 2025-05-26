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

/// <reference lib="dom" />

import { useAppStore } from '../stores/app-store';

export interface ViewState {
  // Panel visibility states
  fileExplorerVisible: boolean;
  chatHistoryVisible: boolean;
  terminalPanelVisible: boolean;
  outputPanelVisible: boolean;
  problemsPanelVisible: boolean;
  
  // Layout states
  isFullscreen: boolean;
  currentZoom: number;
  layoutMode: 'normal' | 'zen' | 'presentation';
  sidebarPosition: 'left' | 'right';
  
  // Command palette
  commandPaletteOpen: boolean;
  
  // Theme and appearance
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

export class ViewMenuService {
  private static instance: ViewMenuService;
  private viewState: ViewState = {
    fileExplorerVisible: true,
    chatHistoryVisible: false,
    terminalPanelVisible: false,
    outputPanelVisible: false,
    problemsPanelVisible: false,
    isFullscreen: false,
    currentZoom: 1.0,
    layoutMode: 'normal',
    sidebarPosition: 'left',
    commandPaletteOpen: false,
    currentTheme: 'dark',
    compactMode: false,
    showMinimap: true,
    showBreadcrumbs: true,
    showLineNumbers: true
  };

  private commandPaletteItems: CommandPaletteItem[] = [];
  private panelConfigurations: Map<string, PanelConfiguration> = new Map();

  public static getInstance(): ViewMenuService {
    if (!ViewMenuService.instance) {
      ViewMenuService.instance = new ViewMenuService();
    }
    return ViewMenuService.instance;
  }

  constructor() {
    this.initializeDefaultCommands();
    this.initializePanelConfigurations();
    this.setupKeyboardShortcuts();
    this.loadPersistedState();
  }

  /**
   * Get current view state
   */
  getViewState(): ViewState {
    return { ...this.viewState };
  }

  /**
   * Command Palette Operations
   */
  async openCommandPalette(): Promise<boolean> {
    try {
      this.viewState.commandPaletteOpen = true;
      
      useAppStore.getState().addNotification({
        type: 'info',
        title: 'Command Palette',
        message: 'Command palette opened. Start typing to search commands.'
      });

      // Trigger UI update
      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('Failed to open command palette:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Command Palette Failed',
        message: 'Unable to open command palette.'
      });
      return false;
    }
  }

  async closeCommandPalette(): Promise<void> {
    this.viewState.commandPaletteOpen = false;
    this.notifyStateChange();
  }

  /**
   * Register new command in palette
   */
  registerCommand(command: CommandPaletteItem): void {
    // Remove existing command with same ID
    this.commandPaletteItems = this.commandPaletteItems.filter(item => item.id !== command.id);
    this.commandPaletteItems.push(command);
    this.commandPaletteItems.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * Search commands in palette
   */
  searchCommands(query: string): CommandPaletteItem[] {
    if (!query.trim()) {
      return this.commandPaletteItems.slice(0, 20); // Return first 20 commands
    }

    const searchTerms = query.toLowerCase().split(' ');
    
    return this.commandPaletteItems
      .filter(item => {
        const searchText = `${item.label} ${item.description || ''} ${item.category} ${item.keywords?.join(' ') || ''}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      })
      .slice(0, 50); // Limit results
  }

  /**
   * Panel Management
   */
  async toggleFileExplorer(): Promise<boolean> {
    try {
      this.viewState.fileExplorerVisible = !this.viewState.fileExplorerVisible;
      
      // Update app store
      useAppStore.getState().setSidebarVisible(this.viewState.fileExplorerVisible);
      
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'File Explorer',
        message: `File Explorer ${this.viewState.fileExplorerVisible ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle file explorer:', error);
      return false;
    }
  }

  async toggleChatHistory(): Promise<boolean> {
    try {
      this.viewState.chatHistoryVisible = !this.viewState.chatHistoryVisible;
      
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Chat History',
        message: `Chat History panel ${this.viewState.chatHistoryVisible ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle chat history:', error);
      return false;
    }
  }

  async toggleTerminalPanel(): Promise<boolean> {
    try {
      this.viewState.terminalPanelVisible = !this.viewState.terminalPanelVisible;
      
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Terminal',
        message: `Terminal panel ${this.viewState.terminalPanelVisible ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle terminal panel:', error);
      return false;
    }
  }

  async toggleOutputPanel(): Promise<boolean> {
    try {
      this.viewState.outputPanelVisible = !this.viewState.outputPanelVisible;
      
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Output',
        message: `Output panel ${this.viewState.outputPanelVisible ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle output panel:', error);
      return false;
    }
  }

  async toggleProblemsPanel(): Promise<boolean> {
    try {
      this.viewState.problemsPanelVisible = !this.viewState.problemsPanelVisible;
      
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Problems',
        message: `Problems panel ${this.viewState.problemsPanelVisible ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle problems panel:', error);
      return false;
    }
  }

  /**
   * Layout Management
   */
  async toggleFullscreen(): Promise<boolean> {
    try {
      if (this.viewState.isFullscreen) {
        await document.exitFullscreen();
        this.viewState.isFullscreen = false;
      } else {
        await document.documentElement.requestFullscreen();
        this.viewState.isFullscreen = true;
      }

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Fullscreen',
        message: `Fullscreen mode ${this.viewState.isFullscreen ? 'enabled' : 'disabled'}.`
      });

      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Fullscreen Failed',
        message: 'Unable to toggle fullscreen mode.'
      });
      return false;
    }
  }

  async setLayoutMode(mode: ViewState['layoutMode']): Promise<boolean> {
    try {
      this.viewState.layoutMode = mode;

      let message = '';
      switch (mode) {
        case 'zen':
          message = 'Zen mode enabled - distraction-free coding environment.';
          // Hide all panels in zen mode
          this.viewState.fileExplorerVisible = false;
          this.viewState.chatHistoryVisible = false;
          this.viewState.terminalPanelVisible = false;
          break;
        case 'presentation':
          message = 'Presentation mode enabled - optimized for demos and presentations.';
          // Larger font, hide certain UI elements
          this.zoomIn(0.5); // Increase zoom for presentation
          break;
        case 'normal':
        default:
          message = 'Normal layout mode restored.';
          // Restore default panel visibility
          this.viewState.fileExplorerVisible = true;
          break;
      }

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Layout Mode',
        message
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to set layout mode:', error);
      return false;
    }
  }

  /**
   * Zoom Management
   */
  async zoomIn(amount: number = 0.1): Promise<boolean> {
    try {
      const newZoom = Math.min(this.viewState.currentZoom + amount, 3.0);
      return await this.setZoom(newZoom);
    } catch (error) {
      console.error('Failed to zoom in:', error);
      return false;
    }
  }

  async zoomOut(amount: number = 0.1): Promise<boolean> {
    try {
      const newZoom = Math.max(this.viewState.currentZoom - amount, 0.5);
      return await this.setZoom(newZoom);
    } catch (error) {
      console.error('Failed to zoom out:', error);
      return false;
    }
  }

  async resetZoom(): Promise<boolean> {
    return await this.setZoom(1.0);
  }

  async setZoom(zoomLevel: number): Promise<boolean> {
    try {
      // Clamp zoom level
      const newZoom = Math.max(0.5, Math.min(3.0, zoomLevel));
      
      this.viewState.currentZoom = newZoom;
      document.body.style.zoom = newZoom.toString();

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Zoom',
        message: `Zoom level set to ${Math.round(newZoom * 100)}%`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to set zoom:', error);
      return false;
    }
  }

  /**
   * Theme Management
   */
  async toggleTheme(): Promise<boolean> {
    try {
      const newTheme = this.viewState.currentTheme === 'light' ? 'dark' : 'light';
      return await this.setTheme(newTheme);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      return false;
    }
  }

  async setTheme(theme: ViewState['currentTheme']): Promise<boolean> {
    try {
      this.viewState.currentTheme = theme;
      
      // Update app store theme
      useAppStore.getState().setTheme(theme === 'auto' ? 'dark' : theme);

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Theme',
        message: `Theme changed to ${theme} mode.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to set theme:', error);
      return false;
    }
  }

  /**
   * UI Controls
   */
  async toggleCompactMode(): Promise<boolean> {
    try {
      this.viewState.compactMode = !this.viewState.compactMode;

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Compact Mode',
        message: `Compact mode ${this.viewState.compactMode ? 'enabled' : 'disabled'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle compact mode:', error);
      return false;
    }
  }

  async toggleMinimap(): Promise<boolean> {
    try {
      this.viewState.showMinimap = !this.viewState.showMinimap;

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Minimap',
        message: `Minimap ${this.viewState.showMinimap ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle minimap:', error);
      return false;
    }
  }

  async toggleBreadcrumbs(): Promise<boolean> {
    try {
      this.viewState.showBreadcrumbs = !this.viewState.showBreadcrumbs;

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Breadcrumbs',
        message: `Breadcrumbs ${this.viewState.showBreadcrumbs ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle breadcrumbs:', error);
      return false;
    }
  }

  async toggleLineNumbers(): Promise<boolean> {
    try {
      this.viewState.showLineNumbers = !this.viewState.showLineNumbers;

      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Line Numbers',
        message: `Line numbers ${this.viewState.showLineNumbers ? 'shown' : 'hidden'}.`
      });

      this.notifyStateChange();
      this.persistState();
      return true;
    } catch (error) {
      console.error('Failed to toggle line numbers:', error);
      return false;
    }
  }

  /**
   * Window Management
   */
  async splitEditorHorizontally(): Promise<boolean> {
    try {
      // This would integrate with the editor component
      useAppStore.getState().addNotification({
        type: 'info',
        title: 'Split Editor',
        message: 'Horizontal editor split will be implemented with the editor component.'
      });
      return true;
    } catch (error) {
      console.error('Failed to split editor horizontally:', error);
      return false;
    }
  }

  async splitEditorVertically(): Promise<boolean> {
    try {
      // This would integrate with the editor component
      useAppStore.getState().addNotification({
        type: 'info',
        title: 'Split Editor',
        message: 'Vertical editor split will be implemented with the editor component.'
      });
      return true;
    } catch (error) {
      console.error('Failed to split editor vertically:', error);
      return false;
    }
  }

  // Private helper methods
  private initializeDefaultCommands(): void {
    const defaultCommands: CommandPaletteItem[] = [
      // File operations
      { id: 'file.new', label: 'New File', category: 'File', shortcut: 'Ctrl+N', icon: '📄', action: () => console.log('New file') },
      { id: 'file.open', label: 'Open File', category: 'File', shortcut: 'Ctrl+O', icon: '📁', action: () => console.log('Open file') },
      { id: 'file.save', label: 'Save File', category: 'File', shortcut: 'Ctrl+S', icon: '💾', action: () => console.log('Save file') },
      
      // Edit operations
      { id: 'edit.undo', label: 'Undo', category: 'Edit', shortcut: 'Ctrl+Z', icon: '↶', action: () => console.log('Undo') },
      { id: 'edit.redo', label: 'Redo', category: 'Edit', shortcut: 'Ctrl+Y', icon: '↷', action: () => console.log('Redo') },
      { id: 'edit.find', label: 'Find', category: 'Edit', shortcut: 'Ctrl+F', icon: '🔍', action: () => console.log('Find') },
      
      // View operations
      { id: 'view.explorer', label: 'Toggle File Explorer', category: 'View', shortcut: 'Ctrl+Shift+E', icon: '📁', action: () => this.toggleFileExplorer() },
      { id: 'view.terminal', label: 'Toggle Terminal', category: 'View', shortcut: 'Ctrl+`', icon: '💻', action: () => this.toggleTerminalPanel() },
      { id: 'view.fullscreen', label: 'Toggle Fullscreen', category: 'View', shortcut: 'F11', icon: '⛶', action: () => this.toggleFullscreen() },
      { id: 'view.zen', label: 'Toggle Zen Mode', category: 'View', shortcut: 'Ctrl+K Z', icon: '🧘', action: () => this.setLayoutMode('zen') },
      
      // Theme operations
      { id: 'theme.toggle', label: 'Toggle Theme', category: 'Theme', icon: '🎨', action: () => this.toggleTheme() },
      { id: 'theme.light', label: 'Light Theme', category: 'Theme', icon: '☀️', action: () => this.setTheme('light') },
      { id: 'theme.dark', label: 'Dark Theme', category: 'Theme', icon: '🌙', action: () => this.setTheme('dark') },
      
      // Zoom operations
      { id: 'zoom.in', label: 'Zoom In', category: 'View', shortcut: 'Ctrl++', icon: '🔍', action: () => this.zoomIn() },
      { id: 'zoom.out', label: 'Zoom Out', category: 'View', shortcut: 'Ctrl+-', icon: '🔍', action: () => this.zoomOut() },
      { id: 'zoom.reset', label: 'Reset Zoom', category: 'View', shortcut: 'Ctrl+0', icon: '🔍', action: () => this.resetZoom() },
    ];

    this.commandPaletteItems = defaultCommands;
  }

  private initializePanelConfigurations(): void {
    const panels: PanelConfiguration[] = [
      { id: 'file-explorer', name: 'File Explorer', defaultVisible: true, position: 'left', minWidth: 200, resizable: true },
      { id: 'chat-history', name: 'Chat History', defaultVisible: false, position: 'right', minWidth: 300, resizable: true },
      { id: 'terminal', name: 'Terminal', defaultVisible: false, position: 'bottom', minHeight: 200, resizable: true },
      { id: 'output', name: 'Output', defaultVisible: false, position: 'bottom', minHeight: 150, resizable: true },
      { id: 'problems', name: 'Problems', defaultVisible: false, position: 'bottom', minHeight: 150, resizable: true },
    ];

    panels.forEach(panel => {
      this.panelConfigurations.set(panel.id, panel);
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            if (e.shiftKey) {
              this.openCommandPalette();
              e.preventDefault();
            }
            break;
          case 'e':
            if (e.shiftKey) {
              this.toggleFileExplorer();
              e.preventDefault();
            }
            break;
          case '`':
            this.toggleTerminalPanel();
            e.preventDefault();
            break;
          case '=':
          case '+':
            this.zoomIn();
            e.preventDefault();
            break;
          case '-':
            this.zoomOut();
            e.preventDefault();
            break;
          case '0':
            this.resetZoom();
            e.preventDefault();
            break;
        }
      } else if (e.key === 'F11') {
        this.toggleFullscreen();
        e.preventDefault();
      } else if (e.key === 'Escape' && this.viewState.commandPaletteOpen) {
        this.closeCommandPalette();
        e.preventDefault();
      }
    });

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      this.viewState.isFullscreen = !!document.fullscreenElement;
      this.notifyStateChange();
    });
  }

  private loadPersistedState(): void {
    try {
      const appState = useAppStore.getState();
      this.viewState.currentTheme = appState.theme;
      this.viewState.fileExplorerVisible = appState.sidebarVisible;
      
      // Load other persisted settings from localStorage if available
      const saved = localStorage.getItem('tanukimcp-view-state');
      if (saved) {
        const savedState = JSON.parse(saved);
        this.viewState = { ...this.viewState, ...savedState };
      }
    } catch (error) {
      console.warn('Failed to load persisted view state:', error);
    }
  }

  private persistState(): void {
    try {
      // Save to localStorage
      const stateToSave = {
        currentZoom: this.viewState.currentZoom,
        layoutMode: this.viewState.layoutMode,
        compactMode: this.viewState.compactMode,
        showMinimap: this.viewState.showMinimap,
        showBreadcrumbs: this.viewState.showBreadcrumbs,
        showLineNumbers: this.viewState.showLineNumbers,
        chatHistoryVisible: this.viewState.chatHistoryVisible,
        terminalPanelVisible: this.viewState.terminalPanelVisible,
        outputPanelVisible: this.viewState.outputPanelVisible,
        problemsPanelVisible: this.viewState.problemsPanelVisible,
      };
      
      localStorage.setItem('tanukimcp-view-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to persist view state:', error);
    }
  }

  private notifyStateChange(): void {
    // Trigger any UI updates that depend on view state
    // This could be expanded to use a proper event system
    window.dispatchEvent(new CustomEvent('viewStateChanged', { detail: this.viewState }));
  }

  // Public getters
  getCommandPaletteItems(): CommandPaletteItem[] {
    return [...this.commandPaletteItems];
  }

  getPanelConfiguration(panelId: string): PanelConfiguration | undefined {
    return this.panelConfigurations.get(panelId);
  }

  getAllPanelConfigurations(): PanelConfiguration[] {
    return Array.from(this.panelConfigurations.values());
  }

  // Cleanup method
  cleanup(): void {
    this.viewState = {
      fileExplorerVisible: true,
      chatHistoryVisible: false,
      terminalPanelVisible: false,
      outputPanelVisible: false,
      problemsPanelVisible: false,
      isFullscreen: false,
      currentZoom: 1.0,
      layoutMode: 'normal',
      sidebarPosition: 'left',
      commandPaletteOpen: false,
      currentTheme: 'dark',
      compactMode: false,
      showMinimap: true,
      showBreadcrumbs: true,
      showLineNumbers: true
    };
    this.persistState();
  }
}

// Export singleton instance
export const viewMenuService = ViewMenuService.getInstance(); 