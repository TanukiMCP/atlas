/**
 * Type definitions for the Electron preload API.
 * This file should be included in your tsconfig.json.
 */

interface ElectronAPI {
  onTrayAction: (callback: (data: any) => void) => void;
  onMenuAction: (callback: (data: any) => void) => void;
  onUpdaterAction: (callback: (data: any) => void) => void;
  onProtocolAction: (callback: (data: any) => void) => void;
  
  sendAction: (channel: string, data: any) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  removeAllListeners: (channel: string) => void;
  
  getAppVersion: () => Promise<string>;
  
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  
  onWindowMaximized: (callback: (event: any, isMaximized: boolean) => void) => void;
  toggleFullScreen: () => void;
  isFullScreen: () => Promise<boolean>;
  isMaximized: () => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {}; 