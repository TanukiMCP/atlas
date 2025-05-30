import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System
  platform: process.platform,
  
  // Window management
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
  
  // OpenRouter integration
  storeOpenRouterKey: (key: string) => ipcRenderer.invoke('store-openrouter-key', key),
  getOpenRouterKey: () => ipcRenderer.invoke('get-openrouter-key'),
  
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
  removeProxyMediaProcessedListener: () => ipcRenderer.removeAllListeners('proxy-media-processed')
}); 