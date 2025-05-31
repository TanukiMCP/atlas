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
  showOpenDialog: (options: { properties: string[] }) => Promise<{ canceled: boolean; filePaths: string[] }>;
  setWorkingDirectory: (path: string) => void;
  
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  
  onWindowMaximized: (callback: (event: any, isMaximized: boolean) => void) => void;
  toggleFullScreen: () => void;
  isFullScreen: () => Promise<boolean>;
  isMaximized: () => Promise<boolean>;
  
  // Mobile proxy methods
  getProxyStatus: () => Promise<{ active: boolean; port: number | null; clients: number; clientDetails?: any[] }>;
  startProxyServer: () => Promise<{ success: boolean; active?: boolean; port?: number; clients?: number; error?: string }>;
  stopProxyServer: () => Promise<{ success: boolean; error?: string }>;
  generatePairingQRCode: () => Promise<{ success: boolean; qrCode?: string; token?: string; connectionUrl?: string; error?: string }>;
  showProxyStatusWindow: () => Promise<{ success: boolean; error?: string }>;
  sendProxyChatResponse: (clientId: string, message: string, messageId: string) => Promise<{ success: boolean }>;
  onProxyStatusChanged: (callback: (status: any) => void) => void;
  onProxyClientConnected: (callback: (data: any) => void) => void;
  onProxyClientDisconnected: (callback: (data: any) => void) => void;
  removeProxyStatusListener: () => void;
  removeProxyClientConnectedListener: () => void;
  removeProxyClientDisconnectedListener: () => void;
  onProxyChatMessage: (callback: (data: any) => void) => void;
  onProxyMediaProcessed: (callback: (data: any) => void) => void;
  removeProxyChatMessageListener: () => void;
  removeProxyMediaProcessedListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {}; 