"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tanukiApp = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const window_1 = require("./window");
const handlers_1 = require("./ipc/handlers");
const connection_1 = require("./database/connection");
const ollama_service_1 = require("./services/ollama-service");
const system_monitor_1 = require("./services/system-monitor");
const model_manager_1 = require("./services/model-manager");
const hardware_assessor_1 = require("./services/hardware-assessor");
const optimization_engine_1 = require("./services/optimization-engine");
const parameter_tuner_1 = require("./services/parameter-tuner");
const context_manager_1 = require("./services/context-manager");
const system_tray_1 = require("./services/system-tray");
const native_menu_1 = require("./services/native-menu");
const auto_updater_1 = require("./services/auto-updater");
const notification_service_1 = require("./services/notification-service");
const crash_reporter_1 = require("./services/crash-reporter");
const protocol_handler_1 = require("./services/protocol-handler");
class TanukiMCPApp {
    mainWindow = null;
    isQuitting = false;
    // Phase 2: LLM and Model Management Services
    ollamaService;
    systemMonitor;
    modelManager;
    hardwareAssessor;
    optimizationEngine;
    parameterTuner;
    contextManager;
    // Phase 3: Desktop Integration Services
    systemTrayService = null;
    nativeMenuService = null;
    autoUpdaterService = null;
    notificationService = null;
    crashReporterService = null;
    protocolHandlerService = null;
    constructor() {
        this.setupEventHandlers();
        this.initializeServices();
    }
    initializeServices() {
        console.log('🔧 Initializing Phase 2 services...');
        // Initialize all LLM and model management services
        this.ollamaService = new ollama_service_1.OllamaService();
        this.systemMonitor = new system_monitor_1.SystemMonitor();
        this.modelManager = new model_manager_1.ModelManager();
        this.hardwareAssessor = new hardware_assessor_1.HardwareAssessor();
        this.optimizationEngine = new optimization_engine_1.OptimizationEngine();
        this.parameterTuner = new parameter_tuner_1.ParameterTuner();
        this.contextManager = new context_manager_1.ContextManager();
        console.log('✅ Phase 2 services initialized');
    }
    setupEventHandlers() {
        // Set up app event handlers
        electron_1.app.whenReady().then(() => this.onReady());
        electron_1.app.on('window-all-closed', this.onWindowAllClosed.bind(this));
        electron_1.app.on('activate', this.onActivate.bind(this));
        electron_1.app.on('before-quit', this.onBeforeQuit.bind(this));
        // Handle certificate errors (for local development)
        electron_1.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
            if (url.startsWith('http://localhost')) {
                // Ignore certificate errors for localhost
                event.preventDefault();
                callback(true);
            }
            else {
                // Use default behavior for other URLs
                callback(false);
            }
        });
    }
    async onReady() {
        try {
            console.log('🚀 TanukiMCP Atlas starting...');
            // Initialize database first
            console.log('📊 Initializing database...');
            await (0, connection_1.initializeDatabase)();
            console.log('✅ Database initialized');
            // Assess system capabilities for model recommendations
            console.log('🔍 Assessing system capabilities...');
            await this.assessSystemCapabilities();
            console.log('✅ System assessment complete');
            // Create main window
            console.log('🪟 Creating main window...');
            this.mainWindow = (0, window_1.createWindow)();
            // Initialize desktop integration services
            console.log('🖥️ Initializing desktop integration...');
            await this.initializeDesktopServices();
            console.log('✅ Desktop integration ready');
            // Setup IPC handlers
            console.log('🔌 Setting up IPC handlers...');
            (0, handlers_1.setupIPC)();
            console.log('✅ IPC handlers ready');
            // Load the application
            await this.loadApplication();
            console.log('🎉 TanukiMCP Atlas ready!');
        }
        catch (error) {
            console.error('❌ Failed to initialize TanukiMCP Atlas:', error);
            electron_1.app.quit();
        }
    }
    async loadApplication() {
        if (!this.mainWindow)
            return;
        // Determine URL based on environment
        if (process.env.NODE_ENV === 'development') {
            // Development mode - load from Vite dev server
            const devServerUrl = 'http://localhost:5173';
            console.log(`🔧 Loading from dev server: ${devServerUrl}`);
            try {
                await this.mainWindow.loadURL(devServerUrl);
                this.mainWindow.webContents.openDevTools();
            }
            catch (error) {
                console.error('Failed to load dev server, falling back to file:', error);
                await this.loadProductionFile();
            }
        }
        else {
            // Production mode - load from built files
            await this.loadProductionFile();
        }
    }
    async loadProductionFile() {
        if (!this.mainWindow)
            return;
        const indexPath = path_1.default.join(__dirname, '../renderer/dist/index.html');
        console.log(`📁 Loading from file: ${indexPath}`);
        await this.mainWindow.loadFile(indexPath);
    }
    onWindowAllClosed() {
        // On macOS, keep app running even when all windows are closed
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    }
    onActivate() {
        // On macOS, re-create window when dock icon is clicked
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            this.mainWindow = (0, window_1.createWindow)();
            this.loadApplication();
        }
    }
    onBeforeQuit() {
        this.isQuitting = true;
    }
    async initializeDesktopServices() {
        if (!this.mainWindow)
            return;
        try {
            // Initialize crash reporter first
            this.crashReporterService = new crash_reporter_1.CrashReporterService(this.mainWindow);
            // Initialize notification service
            this.notificationService = new notification_service_1.NotificationService(this.mainWindow);
            // Initialize system tray
            this.systemTrayService = new system_tray_1.SystemTrayService(this.mainWindow);
            // Initialize native menu
            this.nativeMenuService = new native_menu_1.NativeMenuService(this.mainWindow);
            // Initialize protocol handler
            this.protocolHandlerService = new protocol_handler_1.ProtocolHandlerService(this.mainWindow);
            // Initialize auto-updater (only in production)
            if (process.env.NODE_ENV === 'production') {
                this.autoUpdaterService = new auto_updater_1.AutoUpdaterService(this.mainWindow);
                // Check for updates on startup (after a delay)
                setTimeout(() => {
                    this.autoUpdaterService?.checkForUpdates();
                }, 5000);
            }
            console.log('✅ Desktop integration services initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize desktop services:', error);
            this.crashReporterService?.logCrash(error, 'Desktop Services Initialization');
        }
    }
    async assessSystemCapabilities() {
        try {
            // Check Ollama health
            const ollamaHealthy = await this.ollamaService.checkOllamaHealth();
            if (ollamaHealthy) {
                console.log('✅ Ollama service is running');
            }
            else {
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
        }
        catch (error) {
            console.error('Failed to assess system capabilities:', error);
        }
    }
    getMainWindow() {
        return this.mainWindow;
    }
    // Expose services for IPC handlers
    getServices() {
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
exports.tanukiApp = tanukiApp;
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
//# sourceMappingURL=main.js.map