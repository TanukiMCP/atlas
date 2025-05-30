interface ElectronAPI {
  showOpenDialog: (options: { properties: string[] }) => Promise<{ canceled: boolean, filePaths: string[] }>;
  setWorkingDirectory: (path: string) => Promise<boolean>;
  isMaximized: () => Promise<boolean>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  onWindowMaximized: (callback: (event: any, maximized: boolean) => void) => void;
  removeAllListeners: (eventName: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// Export an empty object to make this a module, which can sometimes help TypeScript
// recognize global augmentations more reliably, especially in certain build setups.
export {}; 