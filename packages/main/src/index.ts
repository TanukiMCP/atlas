// Import required dependencies
import { app, BrowserWindow, ipcMain, nativeTheme, shell, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { proxyServer } from './ProxyServer';
import { MediaProcessor } from './MediaProcessor';

// Import other required modules (existing imports)
// ...

// Setup global variables for the application
let mainWindow: BrowserWindow | null = null;
const isSingleInstance = app.requestSingleInstanceLock();
const isDevelopment = process.env.NODE_ENV === 'development';

// Handle single instance lock
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

// Add mobile proxy status to window state
interface WindowState {
  proxyActive: boolean;
  proxyPort: number | null;
  connectedClients: number;
  qrCodeUrl: string | null;
}

// Initialize window state
const windowState: WindowState = {
  proxyActive: false,
  proxyPort: null,
  connectedClients: 0,
  qrCodeUrl: null
};

// Create media processor instance
const mediaProcessor = new MediaProcessor();

// Function to create the main window
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the renderer
  if (isDevelopment) {
    // Development mode with Vite dev server
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string);
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode with local files
    mainWindow.loadFile(join(app.getAppPath(), 'packages/renderer/dist/index.html'));
  }

  // Handle window ready
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    // Set up IPC handlers for window operations
    // ... (existing IPC handlers)
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Set up mobile proxy server event handlers
  setupProxyServerEvents();
}

// Set up event handlers for the proxy server
function setupProxyServerEvents() {
  // Handle proxy server started event
  proxyServer.on('started', (port: number) => {
    windowState.proxyActive = true;
    windowState.proxyPort = port;
    mainWindow?.webContents.send('proxy-status-changed', {
      active: true,
      port: port,
      clients: 0
    });
  });

  // Handle proxy server stopped event
  proxyServer.on('stopped', () => {
    windowState.proxyActive = false;
    windowState.proxyPort = null;
    windowState.qrCodeUrl = null;
    mainWindow?.webContents.send('proxy-status-changed', {
      active: false,
      port: null,
      clients: 0
    });
  });

  // Handle client connected event
  proxyServer.on('client-connected', (client) => {
    windowState.connectedClients = proxyServer.getConnectedClients().length;
    mainWindow?.webContents.send('proxy-client-connected', {
      client,
      totalClients: windowState.connectedClients
    });
  });

  // Handle client disconnected event
  proxyServer.on('client-disconnected', (client) => {
    windowState.connectedClients = proxyServer.getConnectedClients().length;
    mainWindow?.webContents.send('proxy-client-disconnected', {
      client,
      totalClients: windowState.connectedClients
    });
  });

  // Handle chat message event
  proxyServer.on('chat-message', async (data) => {
    // Forward the chat message to the renderer
    mainWindow?.webContents.send('proxy-chat-message', data);
  });

  // Handle media process event
  proxyServer.on('media-process', async (data) => {
    try {
      // Process the media using the MediaProcessor
      const result = await mediaProcessor.processMedia(
        data.mediaType,
        data.data,
        data.options
      );

      // Send the result back to the client
      proxyServer.sendMediaResult(data.clientId, data.mediaId, result);

      // Also notify the renderer
      mainWindow?.webContents.send('proxy-media-processed', {
        clientId: data.clientId,
        mediaId: data.mediaId,
        result: result
      });
    } catch (error) {
      console.error('Media processing error:', error);
      // Send error back to client
      proxyServer.sendMediaResult(data.clientId, data.mediaId, {
        error: 'Media processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

// Set up IPC handlers for proxy control
function setupProxyIpcHandlers() {
  // Start proxy server
  ipcMain.handle('start-proxy-server', async () => {
    try {
      if (windowState.proxyActive) {
        return {
          success: true,
          active: true,
          port: windowState.proxyPort,
          clients: windowState.connectedClients
        };
      }

      const port = await proxyServer.start();
      return {
        success: true,
        active: true,
        port,
        clients: 0
      };
    } catch (error) {
      console.error('Failed to start proxy server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Stop proxy server
  ipcMain.handle('stop-proxy-server', async () => {
    try {
      await proxyServer.stop();
      return { success: true };
    } catch (error) {
      console.error('Failed to stop proxy server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Get proxy status
  ipcMain.handle('get-proxy-status', () => {
    const status = proxyServer.getStatus();
    return {
      active: status.running,
      port: status.port,
      clients: status.clientCount,
      clientDetails: status.clients
    };
  });

  // Generate QR code for pairing
  ipcMain.handle('generate-pairing-qrcode', async () => {
    try {
      const result = await proxyServer.generatePairingQRCode();
      windowState.qrCodeUrl = result.qrCode;
      return {
        success: true,
        qrCode: result.qrCode,
        token: result.token,
        connectionUrl: result.connectionUrl
      };
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Show proxy status window
  ipcMain.handle('show-proxy-status-window', async () => {
    try {
      await proxyServer.showStatusWindow();
      return { success: true };
    } catch (error) {
      console.error('Failed to show proxy status window:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Send chat response to mobile client
  ipcMain.handle('send-proxy-chat-response', async (event, args) => {
    const { clientId, message, messageId } = args;
    const success = proxyServer.sendChatResponse(clientId, message, messageId);
    return { success };
  });
}

// When the app is ready
app.whenReady().then(() => {
  // Create the main window
  createWindow();

  // Set up IPC handlers
  setupProxyIpcHandlers();

  // Additional app setup (existing code)
  // ...
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Stop the proxy server when quitting
  if (proxyServer.getStatus().running) {
    proxyServer.stop().catch(console.error);
  }

  // On macOS, the app stays active until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, activate creates a new window if none exists
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle protocol deeplinks (for mobile app)
app.setAsDefaultProtocolClient('tanukimcp');

// Handle deeplink activation on macOS
app.on('open-url', (event, url) => {
  event.preventDefault();
  // Process the deeplink URL
  console.log('Received deeplink URL:', url);
});

// Additional cleanup on quit
app.on('quit', () => {
  // Ensure proxy server is stopped
  if (proxyServer.getStatus().running) {
    proxyServer.stop().catch(console.error);
  }
}); 