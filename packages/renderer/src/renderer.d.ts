export interface IElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, listener: (...args: any[]) => void) => () => void;
  // Add other electronAPI methods if they exist
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
  }
} 