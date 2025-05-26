import { BrowserWindow } from 'electron';
export declare class CrashReporterService {
    private mainWindow;
    private crashLogDir;
    constructor(mainWindow: BrowserWindow);
    private setupCrashReporter;
    logCrash(error: Error, context?: string): void;
    showCrashDialog(error: Error): Promise<void>;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=crash-reporter.d.ts.map