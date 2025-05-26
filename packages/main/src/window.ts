import { BrowserWindow, screen, app } from 'electron';
import path from 'path';

export function createWindow(): BrowserWindow {
  // Get display information
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Calculate optimal window size
  const windowWidth = Math.min(1400, Math.floor(width * 0.9));
  const windowHeight = Math.min(900, Math.floor(height * 0.9));
  
  // Create the browser window
  const window = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1024,
    minHeight: 768,
    center: true,
    
    // Window appearance
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true,
    transparent: false,
    backgroundColor: '#1a1a1a', // Dark theme background
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
    
    // Security settings
    webPreferences: {
      nodeIntegration: false,           // Disable node integration in renderer
      contextIsolation: true,           // Enable context isolation
      sandbox: false,                   // Disable sandbox for better performance
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,                // Enable web security
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      
      // Additional security
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
      disableBlinkFeatures: 'Auxclick',
    },
    
    // Performance settings
    show: false, // Don't show until ready
    paintWhenInitiallyHidden: false,
    backgroundThrottling: false, // Keep app responsive when in background
    
    // Window behavior
    autoHideMenuBar: false, // Keep menu bar visible for IDE functionality
    fullscreenable: true,
    maximizable: true,
    minimizable: true,
    resizable: true,
    
    // Icon (will be added later)
    // icon: path.join(__dirname, '../assets/icon.png'),
    
    // Development
    ...(process.env.NODE_ENV === 'development' && {
      webPreferences: {
        ...BrowserWindow.prototype.webPreferences,
        devTools: true,
      }
    })
  });

  // Window event handlers
  window.once('ready-to-show', () => {
    console.log('🪟 Window ready to show');
    window.show();
    
    // Focus the window
    if (process.env.NODE_ENV === 'development') {
      window.focus();
    }
  });

  // Handle window closed
  window.on('closed', () => {
    console.log('🪟 Window closed');
  });

  // Handle window state changes
  window.on('maximize', () => {
    console.log('🪟 Window maximized');
  });

  window.on('unmaximize', () => {
    console.log('🪟 Window unmaximized');
  });

  window.on('minimize', () => {
    console.log('🪟 Window minimized');
  });

  window.on('restore', () => {
    console.log('🪟 Window restored');
  });

  // Handle window focus
  window.on('focus', () => {
    // Window gained focus
  });

  window.on('blur', () => {
    // Window lost focus
  });

  // Prevent navigation to external URLs
  window.webContents.on('will-navigate', (event: any, navigationUrl: string) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Allow localhost navigation for development
    if (parsedUrl.origin !== 'http://localhost:5173' && 
        parsedUrl.origin !== 'file://') {
      console.warn('🚫 Blocked navigation to external URL:', navigationUrl);
      event.preventDefault();
    }
  });

  // Prevent new window creation
  window.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    console.warn('🚫 Blocked attempt to open new window:', url);
    return { action: 'deny' };
  });

  // Handle console messages from renderer
  window.webContents.on('console-message', (event: any, level: string, message: string, line: number, sourceId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Renderer [${level}]:`, message);
    }
  });

  // Handle crashes
  window.webContents.on('crashed', (event: any, killed: boolean) => {
    console.error('💥 Renderer process crashed:', { killed });
    
    // Optionally reload the window
    if (!killed) {
      window.reload();
    }
  });

  // Handle unresponsive renderer
  window.webContents.on('unresponsive', () => {
    console.warn('⚠️ Renderer process became unresponsive');
  });

  window.webContents.on('responsive', () => {
    console.log('✅ Renderer process became responsive again');
  });

  // Save window state for restoration
  window.on('resize', () => {
    saveWindowState(window);
  });

  window.on('move', () => {
    saveWindowState(window);
  });

  // Restore previous window state if available
  restoreWindowState(window);

  return window;
}

// Helper functions for window state management
function saveWindowState(window: BrowserWindow): void {
  try {
    const bounds = window.getBounds();
    const state = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: window.isMaximized(),
      isFullScreen: window.isFullScreen(),
    };
    
    // Save to user data (will be implemented with proper storage later)
    // For now, just store in memory
    (global as any).windowState = state;
  } catch (error) {
    console.error('Failed to save window state:', error);
  }
}

function restoreWindowState(window: BrowserWindow): void {
  try {
    const state = (global as any).windowState;
    if (state) {
      // Validate state bounds are within current screen
      const { workArea } = screen.getPrimaryDisplay();
      
      if (state.x >= workArea.x && state.x < workArea.x + workArea.width &&
          state.y >= workArea.y && state.y < workArea.y + workArea.height) {
        window.setBounds({
          x: state.x,
          y: state.y,
          width: Math.min(state.width, workArea.width),
          height: Math.min(state.height, workArea.height)
        });
      }
      
      if (state.isMaximized) {
        window.maximize();
      }
      
      if (state.isFullScreen) {
        window.setFullScreen(true);
      }
    }
  } catch (error) {
    console.error('Failed to restore window state:', error);
  }
} 