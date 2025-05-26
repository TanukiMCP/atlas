import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createWindow } from './window';
import { setupIPC } from './ipc/handlers';
import { initializeDatabase } from './database/connection';
import { OllamaService } from './services/ollama-service';
import { SystemMonitor } from './services/system-monitor';
import { ModelManager } from './services/model-manager';
import { HardwareAssessor } from './services/hardware-assessor';
import { OptimizationEngine } from './services/optimization-engine';
import { ParameterTuner } from './services/parameter-tuner';
import { ContextManager } from './services/context-manager';
import { SystemTrayService } from './services/system-tray';
import { NativeMenuService } from './services/native-menu';
import { AutoUpdaterService } from './services/auto-updater';
import { NotificationService } from './services/notification-service';
import { CrashReporterService } from './services/crash-reporter';
import { ProtocolHandlerService } from './services/protocol-handler';

class TanukiMCPApp {
  private mainWindow: BrowserWindow | null = null;
  private isQuitting = false;
  
  // Phase 2: LLM and Model Management Services
  private ollamaService: OllamaService;
  private systemMonitor: SystemMonitor;
  private modelManager: ModelManager;
  private hardwareAssessor: HardwareAssessor;
  private optimizationEngine: OptimizationEngine;
  private parameterTuner: ParameterTuner;
  private contextManager: ContextManager;
  
  // Phase 3: Desktop Integration Services
  private systemTrayService: SystemTrayService | null = null;
  private nativeMenuService: NativeMenuService | null = null;
  private autoUpdaterService: AutoUpdaterService | null = null;
  private notificationService: NotificationService | null = null;
  private crashReporterService: CrashReporterService | null = null;
  private protocolHandlerService: ProtocolHandlerService | null = null;

  constructor() {
    this.setupEventHandlers();
    this.initializeServices();
  }
  
  private initializeServices(): void {
    console.log('🔧 Initializing Phase 2 services...');
    
    // Initialize all LLM and model management services
    this.ollamaService = new OllamaService();
    this.systemMonitor = new SystemMonitor();
    this.modelManager = new ModelManager();
    this.hardwareAssessor = new HardwareAssessor();
    this.optimizationEngine = new OptimizationEngine();
    this.parameterTuner = new ParameterTuner();
    this.contextManager = new ContextManager();
    
    console.log('✅ Phase 2 services initialized');
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
      
      // Initialize database first
      console.log('📊 Initializing database...');
      await initializeDatabase();
      console.log('✅ Database initialized');
      
      // Assess system capabilities for model recommendations
      console.log('🔍 Assessing system capabilities...');
      await this.assessSystemCapabilities();
      console.log('✅ System assessment complete');
      
      // Create main window
      console.log('🪟 Creating main window...');
      this.mainWindow = createWindow();
      
      // Initialize desktop integration services
      console.log('🖥️ Initializing desktop integration...');
      await this.initializeDesktopServices();
      console.log('✅ Desktop integration ready');
      
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
    
    const indexPath = path.join(__dirname, '../renderer/dist/index.html');
    console.log(`📁 Loading from file: ${indexPath}`);
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
      this.systemTrayService = new SystemTrayService(this.mainWindow);
      
      // Initialize native menu
      this.nativeMenuService = new NativeMenuService(this.mainWindow);
      
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

  private async assessSystemCapabilities(): Promise<void> {
    try {
      // Check Ollama health
      const ollamaHealthy = await this.ollamaService.checkOllamaHealth();
      if (ollamaHealthy) {
        console.log('✅ Ollama service is running');
      } else {
        console.log('⚠️  Ollama service not detected - model management will be limited');
      }
      
      // Get system info and recommendations
      const systemCaps = await this.hardwareAssessor.assessSystemCapabilities();
      console.log('💻 System specs:', {
        cpu: systemCaps.cpu.cores + ' cores',
        memory: systemCaps.memory.total + 'GB RAM',
        gpu: systemCaps.gpu?.length ? systemCaps.gpu.length + ' GPU(s)' : 'None detected'
      });
      
      // Get model recommendations
      const catalog = await this.ollamaService.getModelCatalog();
      const recommendations = await this.hardwareAssessor.getModelRecommendations(systemCaps, catalog);
      console.log('🤖 Recommended models:', recommendations.slice(0, 3).map(r => r.model.displayName));
      
      // Apply optimal settings
      const optimalProfile = await this.optimizationEngine.optimizeForHardware(systemCaps);
      await this.optimizationEngine.applyOptimizations(optimalProfile);
      console.log('⚡ Applied optimization profile:', optimalProfile.name);
      
    } catch (error) {
      console.error('Failed to assess system capabilities:', error);
    }
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
  
  // Expose services for IPC handlers
  public getServices() {
    return {
      ollama: this.ollamaService,
      systemMonitor: this.systemMonitor,
      modelManager: this.modelManager,
      hardwareAssessor: this.hardwareAssessor,
      optimizationEngine: this.optimizationEngine,
      parameterTuner: this.parameterTuner,
      contextManager: this.contextManager,
      systemTray: this.systemTrayService,
      nativeMenu: this.nativeMenuService,
      autoUpdater: this.autoUpdaterService,
      notification: this.notificationService,
      crashReporter: this.crashReporterService,
      protocolHandler: this.protocolHandlerService
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