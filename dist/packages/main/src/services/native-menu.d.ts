import { BrowserWindow } from 'electron';
export declare class NativeMenuService {
    private mainWindow;
    constructor(mainWindow: BrowserWindow);
    private createApplicationMenu;
    private sendToRenderer;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=native-menu.d.ts.map