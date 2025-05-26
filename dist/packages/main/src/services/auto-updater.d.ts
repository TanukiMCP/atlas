import { BrowserWindow } from 'electron';
export declare class AutoUpdaterService {
    private mainWindow;
    private updateAvailable;
    constructor(mainWindow: BrowserWindow);
    private setupAutoUpdater;
    private showUpdateAvailableNotification;
    private showUpdateReadyNotification;
    checkForUpdates(): Promise<void>;
    downloadUpdate(): Promise<void>;
    installUpdate(): void;
    private sendToRenderer;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=auto-updater.d.ts.map