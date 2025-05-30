"use strict";

// src/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  onTrayAction: (callback) => {
    import_electron.ipcRenderer.on("tray-action", (event, data) => callback(data));
  },
  onMenuAction: (callback) => {
    import_electron.ipcRenderer.on("menu-action", (event, data) => callback(data));
  },
  onUpdaterAction: (callback) => {
    import_electron.ipcRenderer.on("updater-action", (event, data) => callback(data));
  },
  onProtocolAction: (callback) => {
    import_electron.ipcRenderer.on("protocol-action", (event, data) => callback(data));
  },
  sendAction: (channel, data) => {
    import_electron.ipcRenderer.send(channel, data);
  },
  invoke: (channel, ...args) => {
    return import_electron.ipcRenderer.invoke(channel, ...args);
  },
  removeAllListeners: (channel) => {
    import_electron.ipcRenderer.removeAllListeners(channel);
  },
  getAppVersion: () => {
    return import_electron.ipcRenderer.invoke("get-app-version");
  },
  minimizeWindow: () => {
    import_electron.ipcRenderer.send("minimize-window");
  },
  maximizeWindow: () => {
    import_electron.ipcRenderer.send("maximize-window");
  },
  closeWindow: () => {
    import_electron.ipcRenderer.send("close-window");
  },
  // New window functions
  onWindowMaximized: (callback) => {
    import_electron.ipcRenderer.on("window-maximized-change", callback);
  },
  toggleFullScreen: () => {
    import_electron.ipcRenderer.send("toggle-fullscreen");
  },
  isFullScreen: () => {
    return import_electron.ipcRenderer.invoke("window:isFullScreen");
  },
  isMaximized: () => {
    return import_electron.ipcRenderer.invoke("window:isMaximized");
  },
  // Mobile proxy management
  startProxyServer: () => import_electron.ipcRenderer.invoke("start-proxy-server"),
  stopProxyServer: () => import_electron.ipcRenderer.invoke("stop-proxy-server"),
  getProxyStatus: () => import_electron.ipcRenderer.invoke("get-proxy-status"),
  generatePairingQRCode: () => import_electron.ipcRenderer.invoke("generate-pairing-qrcode"),
  showProxyStatusWindow: () => import_electron.ipcRenderer.invoke("show-proxy-status-window"),
  sendProxyChatResponse: (clientId, message, messageId) => import_electron.ipcRenderer.invoke("send-proxy-chat-response", { clientId, message, messageId }),
  // Proxy event listeners
  onProxyStatusChanged: (callback) => import_electron.ipcRenderer.on("proxy-status-changed", (_, status) => callback(status)),
  onProxyClientConnected: (callback) => import_electron.ipcRenderer.on("proxy-client-connected", (_, data) => callback(data)),
  onProxyClientDisconnected: (callback) => import_electron.ipcRenderer.on("proxy-client-disconnected", (_, data) => callback(data)),
  onProxyChatMessage: (callback) => import_electron.ipcRenderer.on("proxy-chat-message", (_, data) => callback(data)),
  onProxyMediaProcessed: (callback) => import_electron.ipcRenderer.on("proxy-media-processed", (_, data) => callback(data)),
  // Remove event listeners
  removeProxyStatusListener: () => import_electron.ipcRenderer.removeAllListeners("proxy-status-changed"),
  removeProxyClientConnectedListener: () => import_electron.ipcRenderer.removeAllListeners("proxy-client-connected"),
  removeProxyClientDisconnectedListener: () => import_electron.ipcRenderer.removeAllListeners("proxy-client-disconnected"),
  removeProxyChatMessageListener: () => import_electron.ipcRenderer.removeAllListeners("proxy-chat-message"),
  removeProxyMediaProcessedListener: () => import_electron.ipcRenderer.removeAllListeners("proxy-media-processed"),
  // OpenRouter integration
  storeOpenRouterKey: (key) => import_electron.ipcRenderer.invoke("store-openrouter-key", key),
  getOpenRouterKey: () => import_electron.ipcRenderer.invoke("get-openrouter-key")
});
//# sourceMappingURL=preload.js.map
