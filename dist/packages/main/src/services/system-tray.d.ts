import { BrowserWindow } from 'electron';
export declare class SystemTrayService {
    private tray;
    private mainWindow;
    constructor(mainWindow: BrowserWindow);
    private createTray;
    private setupTrayMenu;
    private setupTrayEvents;
    private showMainWindow;
    private hideMainWindow;
    private sendToRenderer;
    updateTrayMenu(): void;
    destroy(): void;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=system-tray.d.ts.map