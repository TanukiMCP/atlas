// Import required dependencies
import { app, BrowserWindow, ipcMain, nativeTheme, shell, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { proxyServer } from './ProxyServer';
import { OpenRouterService } from './services/openrouter-service';
import express from 'express';
import http from 'http';
import type { Request, Response } from 'express';
import { 
  initializeOpenRouterIntegration, 
  setOpenRouterService,
  processRequestWithComplexityAssessment,
  testComplexityAssessment
} from '../../llm-enhanced/src/openrouter-integration';

// Import other required modules (existing imports)
// ...

// Import terminal service
import './services/terminal-service';

// Setup global variables for the application
let mainWindow: BrowserWindow | null = null;
const isSingleInstance = app.requestSingleInstanceLock();
const isDevelopment = process.env.NODE_ENV === 'development';
const openRouterService = new OpenRouterService();
let staticServer: http.Server | null = null;

// Simple media processor for handling proxy media requests
class MediaProcessor {
  async processMedia(mediaType: string, data: any, options: any) {
    // This is a stub implementation
    return { processed: true, mediaType, timestamp: new Date().toISOString() };
  }
}

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

// When the app is ready
app.whenReady().then(async () => {
  // Register IPC handlers before creating the main window
  console.log('≡ƒöî Setting up IPC handlers...');
  
  // Proxy server handlers - explicitly register these in the main process
  ipcMain.handle('get-proxy-status', () => {
    const status = proxyServer.getStatus();
    return {
      active: status.running,
      port: status.port,
      clients: status.clientCount,
      clientDetails: status.clients
    };
  });
  
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
  
  ipcMain.handle('send-proxy-chat-response', async (event, args) => {
    const { clientId, message, messageId } = args;
    const success = proxyServer.sendChatResponse(clientId, message, messageId);
    return { success };
  });
  
  // Set up proxy server events
  setupProxyServerEvents();
  
  // Minimize, maximize and close window handlers
  ipcMain.on('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
  });
  
  ipcMain.on('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
      // Notify renderer of change
      mainWindow.webContents.send('window-maximized-change', mainWindow.isMaximized());
    }
  });
  
  ipcMain.on('close-window', () => {
    if (mainWindow) mainWindow.close();
  });
  
  // Window state handlers
  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });
  
  ipcMain.handle('window:isFullScreen', () => {
    return mainWindow ? mainWindow.isFullScreen() : false;
  });
  
  ipcMain.on('toggle-fullscreen', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });
  
  // OpenRouter API key handlers
  ipcMain.handle('store-openrouter-key', async (event, key) => {
    try {
      openRouterService.setApiKey(key);
      return { success: true };
    } catch (error) {
      console.error('Failed to store OpenRouter API key:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  ipcMain.handle('get-openrouter-key', async () => {
    try {
      // Since there's no getApiKey method, return a stub response
      return { success: true, key: "API key is stored securely" };
    } catch (error) {
      console.error('Failed to get OpenRouter API key:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  console.log('Γ£à IPC handlers registered');
  console.log('Γ£à IPC handlers ready');

  // Create the main window after IPC handlers are ready
  await createWindow();

  if (!isDevelopment) {
    // Serve static PWA assets for /mobile
    const staticApp = express();
    const rendererDist = join(app.getAppPath(), 'packages/renderer/dist');
    staticApp.use('/icons', express.static(join(rendererDist, 'icons')));
    staticApp.use('/mobile', express.static(rendererDist));
    staticApp.get('/manifest.webmanifest', (req: Request, res: Response) => {
      res.sendFile(join(rendererDist, 'manifest.webmanifest'));
    });
    staticApp.get('/sw.js', (req: Request, res: Response) => {
      res.sendFile(join(rendererDist, 'sw.js'));
    });
    staticApp.get('/mobile*', (req: Request, res: Response) => {
      res.sendFile(join(rendererDist, 'mobile.html'));
    });
    staticServer = staticApp.listen(3001, () => {
      console.log('Static PWA server running on http://localhost:3001');
    });
  }
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
  // Parse tanukimcp://connect?token=...&relay=...
  try {
    const parsed = new URL(url);
    const token = parsed.searchParams.get('token');
    const relay = parsed.searchParams.get('relay');
    console.log('Received deep-link:', { token, relay });
    // TODO: Initiate connection handshake
  } catch (e) {
    console.error('Failed to parse deep-link:', url, e);
  }
});

// Additional cleanup on quit
app.on('quit', () => {
  // Ensure proxy server is stopped
  if (proxyServer.getStatus().running) {
    proxyServer.stop().catch(console.error);
  }
}); 