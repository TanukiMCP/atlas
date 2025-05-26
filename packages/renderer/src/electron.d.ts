declare global {
  interface Window {
    electronAPI?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

// Export an empty object to make this a module, which can sometimes help TypeScript
// recognize global augmentations more reliably, especially in certain build setups.
export {}; 