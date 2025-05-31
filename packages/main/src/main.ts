import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createWindow } from './window';
import { setupIPC } from './ipc/handlers';
import { initializeDatabase } from './database/connection';
import { OpenRouterService } from './services/openrouter-service';
import { SystemMonitor } from './services/system-monitor';
import { MCPClientHub } from '../../mcp-hub/src';
import { SystemTrayService } from './services/system-tray';
import { NativeMenuService } from './services/native-menu';
import { AutoUpdaterService } from './services/auto-updater';
import { NotificationService } from './services/notification-service';
import { CrashReporterService } from './services/crash-reporter';
import { ProtocolHandlerService } from './services/protocol-handler';
import { enhancedLLMService } from '../../llm-enhanced/src';

class TanukiMCPApp {
  private mainWindow: BrowserWindow | null = null;
  private trayService!: SystemTrayService;
  private menuService!: NativeMenuService;
  private autoUpdaterService!: AutoUpdaterService;
  private notificationService!: NotificationService;
  private crashReporterService!: CrashReporterService;
  private protocolHandlerService!: ProtocolHandlerService;

  // Services that might be initialized later or conditionally
  private openrouterService!: OpenRouterService;
  private systemMonitor!: SystemMonitor;
  private mcpHubService!: MCPClientHub;
  private isQuitting = false;

  constructor() {
    this.setupEventHandlers();
  }
  
  private async initializeServices(): Promise<void> {
    console.log('🔧 Initializing services...');
    
    // Initialize core services - keep only what's needed for OpenRouter
    this.openrouterService = new OpenRouterService();
    this.systemMonitor = new SystemMonitor();
    // Initialize MCP hub service
    this.mcpHubService = new MCPClientHub();
    await this.mcpHubService.initialize();
    
    // Skip hardware-specific services since we're using OpenRouter free models only
    
    console.log('✅ Core services initialized');
    
    // Initialize Enhanced LLM and MCP Hub
    console.log('🔧 Initializing desktop integration...');
    
    // Initialize crash reporter first
    if (this.mainWindow) {
      this.crashReporterService = new CrashReporterService(this.mainWindow);
      
      // Initialize notification service
      this.notificationService = new NotificationService(this.mainWindow);
      
      // Initialize system tray
      this.trayService = new SystemTrayService(this.mainWindow);
      
      // Initialize native menu
      this.menuService = new NativeMenuService(this.mainWindow);
      
      // Initialize protocol handler
      this.protocolHandlerService = new ProtocolHandlerService(this.mainWindow);
      
      // Initialize auto-updater (only in production)
      if (process.env.NODE_ENV === 'production') {
        this.autoUpdaterService = new AutoUpdaterService(this.mainWindow);
        // Check for updates on startup (after a delay)
        setTimeout(() => {
          this.autoUpdaterService?.checkForUpdates();
        }, 5000);
      }
    }
    
    console.log('✅ Desktop integration services initialized');
  }

  private setupEventHandlers(): void {
    // Set up app event handlers
    app.whenReady().then(() => this.onReady());
    app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    app.on('activate', this.onActivate.bind(this));
    app.on('before-quit', this.onBeforeQuit.bind(this));
    
    // Handle certificate errors (for local development)
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      if (url.startsWith('http://localhost')) {
        // Ignore certificate errors for localhost
        event.preventDefault();
        callback(true);
      } else {
        // Use default behavior for other URLs
        callback(false);
      }
    });
  }

  private async onReady(): Promise<void> {
    try {
      console.log('🚀 TanukiMCP Atlas starting...');
      
      // Initialize services
      await this.initializeServices();
      
      // Initialize database
      console.log('📊 Initializing database...');
      await initializeDatabase();
      console.log('✅ Database initialized');
      
      // Connect to OpenRouter service
      console.log('🔌 Connecting to OpenRouter...');
      await this.loadStoredApiKey();
      const status = await this.openrouterService.checkHealth();
      if (status.isConnected) {
        console.log('✅ Connected to OpenRouter service');
      } else {
        console.log('⚠️ Not connected to OpenRouter - free models will still be available');
      }
      
      // Initialize Enhanced LLM Service with OpenRouter and MCP hub
      console.log('🔧 Initializing Enhanced LLM Service...');
      await enhancedLLMService.initialize(this.openrouterService, this.mcpHubService);
      console.log('✅ Enhanced LLM Service ready');
      
      // Create main window
      console.log('🪟 Creating main window...');
      this.mainWindow = createWindow();
      
      // Initialize desktop integration services
      await this.initializeDesktopServices();
      
      // Setup IPC handlers
      console.log('🔌 Setting up IPC handlers...');
      setupIPC();
      console.log('✅ IPC handlers ready');
      
      // Load the application
      await this.loadApplication();
      
      console.log('🎉 TanukiMCP Atlas ready!');
    } catch (error) {
      console.error('❌ Failed to initialize TanukiMCP Atlas:', error);
      app.quit();
    }
  }

  private async loadApplication(): Promise<void> {
    if (!this.mainWindow) return;

    // Determine URL based on environment
    if (process.env.NODE_ENV === 'development') {
      // Development mode - load from Vite dev server
      const devServerUrl = 'http://localhost:5173';
      console.log(`🔧 Loading from dev server: ${devServerUrl}`);
      
      try {
        await this.mainWindow.loadURL(devServerUrl);
        this.mainWindow.webContents.openDevTools();
      } catch (error) {
        console.error('Failed to load dev server, falling back to file:', error);
        await this.loadProductionFile();
      }
    } else {
      // Production mode - load from built files
      await this.loadProductionFile();
    }
  }

  private async loadProductionFile(): Promise<void> {
    if (!this.mainWindow) return;
    
    // __dirname is packages/main/dist
    // ../../../ should resolve to the project root (e.g., tanukimcp-atlas)
    const projectRoot = path.resolve(__dirname, '../../../');
    const indexPath = path.join(projectRoot, 'packages/renderer/dist/index.html');
    console.log(`📁 Loading from file: ${indexPath} (using projectRoot: ${projectRoot}, __dirname: ${__dirname})`);
    await this.mainWindow.loadFile(indexPath);
  }

  private onWindowAllClosed(): void {
    // On macOS, keep app running even when all windows are closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      this.mainWindow = createWindow();
      this.loadApplication();
    }
  }

  private onBeforeQuit(): void {
    this.isQuitting = true;
  }

  private async initializeDesktopServices(): Promise<void> {
    if (!this.mainWindow) return;

    try {
      // Initialize crash reporter first
      this.crashReporterService = new CrashReporterService(this.mainWindow);
      
      // Initialize notification service
      this.notificationService = new NotificationService(this.mainWindow);
      
      // Initialize system tray
      this.trayService = new SystemTrayService(this.mainWindow);
      
      // Initialize native menu
      this.menuService = new NativeMenuService(this.mainWindow);
      
      // Initialize protocol handler
      this.protocolHandlerService = new ProtocolHandlerService(this.mainWindow);
      
      // Initialize auto-updater (only in production)
      if (process.env.NODE_ENV === 'production') {
        this.autoUpdaterService = new AutoUpdaterService(this.mainWindow);
        // Check for updates on startup (after a delay)
        setTimeout(() => {
          this.autoUpdaterService?.checkForUpdates();
        }, 5000);
      }
      
      console.log('✅ Desktop integration services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize desktop services:', error);
      this.crashReporterService?.logCrash(error as Error, 'Desktop Services Initialization');
    }
  }

  private async loadStoredApiKey(): Promise<void> {
    try {
      const { app } = require('electron');
      const path = require('path');
      const fs = require('fs').promises;
      
      const userDataPath = app.getPath('userData');
      const storageFile = path.join(userDataPath, 'secure-storage.json');
      
      try {
        const data = await fs.readFile(storageFile, 'utf8');
        const storage = JSON.parse(data);
        const apiKey = storage['openrouter_api_key'];
        
        if (apiKey && this.openrouterService) {
          this.openrouterService.setApiKey(apiKey);
          console.log('🔑 Loaded stored OpenRouter API key');
        }
      } catch (error) {
        // File doesn't exist or is invalid, no stored API key
        console.log('ℹ️  No stored OpenRouter API key found');
      }
    } catch (error) {
      console.error('Failed to load stored API key:', error);
    }
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
  
  // Expose services for IPC handlers
  public getServices() {
    return {
      openrouter: this.openrouterService,
      systemMonitor: this.systemMonitor,
      systemTray: this.trayService,
      nativeMenu: this.menuService,
      autoUpdater: this.autoUpdaterService,
      notification: this.notificationService,
      crashReporter: this.crashReporterService,
      protocolHandler: this.protocolHandlerService,
      mcpHub: this.mcpHubService
    };
  }
}

// Create and initialize the application
const tanukiApp = new TanukiMCPApp();

// Export for potential external access
export { tanukiApp };

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  tanukiApp.getServices().crashReporter?.logCrash(error, 'Uncaught Exception');
  tanukiApp.getServices().crashReporter?.showCrashDialog(error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  const error = reason instanceof Error ? reason : new Error(String(reason));
  tanukiApp.getServices().crashReporter?.logCrash(error, 'Unhandled Rejection');
}); 