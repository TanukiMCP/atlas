import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onTrayAction: (callback: (data: any) => void) => {
    ipcRenderer.on('tray-action', (event, data) => callback(data));
  },
  
  onMenuAction: (callback: (data: any) => void) => {
    ipcRenderer.on('menu-action', (event, data) => callback(data));
  },
  
  onUpdaterAction: (callback: (data: any) => void) => {
    ipcRenderer.on('updater-action', (event, data) => callback(data));
  },
  
  onProtocolAction: (callback: (data: any) => void) => {
    ipcRenderer.on('protocol-action', (event, data) => callback(data));
  },
  
  sendAction: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  },
  
  minimizeWindow: () => {
    ipcRenderer.send('minimize-window');
  },
  
  maximizeWindow: () => {
    ipcRenderer.send('maximize-window');
  },
  
  closeWindow: () => {
    ipcRenderer.send('close-window');
  },
  
  // New window functions
  onWindowMaximized: (callback: (event: any, isMaximized: boolean) => void) => {
    ipcRenderer.on('window-maximized-change', callback);
  },
  
  toggleFullScreen: () => {
    ipcRenderer.send('toggle-fullscreen');
  },
  
  isFullScreen: () => {
    return ipcRenderer.invoke('window:isFullScreen');
  },
  
  isMaximized: () => {
    return ipcRenderer.invoke('window:isMaximized');
  },
  
  // Mobile proxy management
  startProxyServer: () => ipcRenderer.invoke('start-proxy-server'),
  stopProxyServer: () => ipcRenderer.invoke('stop-proxy-server'),
  getProxyStatus: () => ipcRenderer.invoke('get-proxy-status'),
  generatePairingQRCode: () => ipcRenderer.invoke('generate-pairing-qrcode'),
  showProxyStatusWindow: () => ipcRenderer.invoke('show-proxy-status-window'),
  sendProxyChatResponse: (clientId: string, message: string, messageId: string) => 
    ipcRenderer.invoke('send-proxy-chat-response', { clientId, message, messageId }),
  
  // Proxy event listeners
  onProxyStatusChanged: (callback: (status: any) => void) => 
    ipcRenderer.on('proxy-status-changed', (_, status) => callback(status)),
  onProxyClientConnected: (callback: (data: any) => void) => 
    ipcRenderer.on('proxy-client-connected', (_, data) => callback(data)),
  onProxyClientDisconnected: (callback: (data: any) => void) => 
    ipcRenderer.on('proxy-client-disconnected', (_, data) => callback(data)),
  onProxyChatMessage: (callback: (data: any) => void) => 
    ipcRenderer.on('proxy-chat-message', (_, data) => callback(data)),
  onProxyMediaProcessed: (callback: (data: any) => void) => 
    ipcRenderer.on('proxy-media-processed', (_, data) => callback(data)),
  
  // Remove event listeners
  removeProxyStatusListener: () => ipcRenderer.removeAllListeners('proxy-status-changed'),
  removeProxyClientConnectedListener: () => ipcRenderer.removeAllListeners('proxy-client-connected'),
  removeProxyClientDisconnectedListener: () => ipcRenderer.removeAllListeners('proxy-client-disconnected'),
  removeProxyChatMessageListener: () => ipcRenderer.removeAllListeners('proxy-chat-message'),
  removeProxyMediaProcessedListener: () => ipcRenderer.removeAllListeners('proxy-media-processed'),
  
  // OpenRouter integration
  storeOpenRouterKey: (key: string) => ipcRenderer.invoke('store-openrouter-key', key),
  getOpenRouterKey: () => ipcRenderer.invoke('get-openrouter-key')
});