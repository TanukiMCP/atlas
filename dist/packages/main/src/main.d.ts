import { BrowserWindow } from 'electron';
import { OllamaService } from './services/ollama-service';
import { SystemMonitor } from './services/system-monitor';
import { ModelManager } from './services/model-manager';
import { HardwareAssessor } from './services/hardware-assessor';
import { OptimizationEngine } from './services/optimization-engine';
import { ParameterTuner } from './services/parameter-tuner';
import { ContextManager } from './services/context-manager';
declare class TanukiMCPApp {
    private mainWindow;
    private isQuitting;
    private ollamaService;
    private systemMonitor;
    private modelManager;
    private hardwareAssessor;
    private optimizationEngine;
    private parameterTuner;
    private contextManager;
    constructor();
    private initializeServices;
    private setupEventHandlers;
    private onReady;
    private loadApplication;
    private loadProductionFile;
    private onWindowAllClosed;
    private onActivate;
    private onBeforeQuit;
    private assessSystemCapabilities;
    getMainWindow(): BrowserWindow | null;
    getServices(): {
        ollama: OllamaService;
        systemMonitor: SystemMonitor;
        modelManager: ModelManager;
        hardwareAssessor: HardwareAssessor;
        optimizationEngine: OptimizationEngine;
        parameterTuner: ParameterTuner;
        contextManager: ContextManager;
    };
}
declare const tanukiApp: TanukiMCPApp;
export { tanukiApp };
//# sourceMappingURL=main.d.ts.map