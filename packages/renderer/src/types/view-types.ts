/**
 * View State Types
 * 
 * This file contains types related to the UI and view state of the application.
 */

export interface ViewState {
  // Theme and appearance
  currentTheme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  
  // Panels
  showFileExplorer: boolean;
  showToolPanel: boolean;
  showChatPanel: boolean;
  showMinimap: boolean;
  
  // Editor
  wordWrap: boolean;
  showLineNumbers: boolean;
  showIndentGuides: boolean;
  fontSize: number;
  
  // Terminal
  showTerminal: boolean;
  terminalHeight: number;
  
  // Misc
  isFullscreen: boolean;
  isFocusMode: boolean;
  zenMode: boolean;
  panelPosition: 'left' | 'right';
  sidePanelWidth: number;
  bottomPanelHeight: number;
  
  // Optional properties that might be added dynamically
  currentZoom?: number;
} 