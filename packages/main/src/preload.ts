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
  }
});