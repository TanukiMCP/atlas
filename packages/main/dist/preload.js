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
  }
});
//# sourceMappingURL=preload.js.map
