/**
 * Type definitions for Electron API exposed to the renderer process
 */

interface ElectronAPI {
  // Window management
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  
  // File system operations
  showOpenDialog: (options: any) => Promise<{ canceled: boolean, filePaths: string[] }>;
  
  // Generic IPC invoke method
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  
  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
  
  // System info
  platform: string;
  
  // OpenRouter integration
  storeOpenRouterKey: (key: string) => Promise<void>;
  getOpenRouterKey: () => Promise<string>;
  
  // Mobile proxy management
  startProxyServer: () => Promise<any>;
  stopProxyServer: () => Promise<any>;
  getProxyStatus: () => Promise<any>;
  generatePairingQRCode: () => Promise<string>;
  showProxyStatusWindow: () => Promise<void>;
  sendProxyChatResponse: (clientId: string, message: string, messageId: string) => Promise<void>;
  
  // Proxy event listeners
  onProxyStatusChanged: (callback: (status: any) => void) => void;
  onProxyClientConnected: (callback: (data: any) => void) => void;
  onProxyClientDisconnected: (callback: (data: any) => void) => void;
  onProxyChatMessage: (callback: (data: any) => void) => void;
  onProxyMediaProcessed: (callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {}; 