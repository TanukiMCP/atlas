"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    onTrayAction: (callback) => {
        electron_1.ipcRenderer.on('tray-action', (event, data) => callback(data));
    },
    onMenuAction: (callback) => {
        electron_1.ipcRenderer.on('menu-action', (event, data) => callback(data));
    },
    onUpdaterAction: (callback) => {
        electron_1.ipcRenderer.on('updater-action', (event, data) => callback(data));
    },
    onProtocolAction: (callback) => {
        electron_1.ipcRenderer.on('protocol-action', (event, data) => callback(data));
    },
    sendAction: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
    },
    invokeAction: (channel, data) => {
        return electron_1.ipcRenderer.invoke(channel, data);
    },
    removeAllListeners: (channel) => {
        electron_1.ipcRenderer.removeAllListeners(channel);
    },
    getAppVersion: () => {
        return electron_1.ipcRenderer.invoke('get-app-version');
    },
    minimizeWindow: () => {
        electron_1.ipcRenderer.send('minimize-window');
    },
    maximizeWindow: () => {
        electron_1.ipcRenderer.send('maximize-window');
    },
    closeWindow: () => {
        electron_1.ipcRenderer.send('close-window');
    }
});
//# sourceMappingURL=preload.js.map