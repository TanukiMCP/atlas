import { BrowserWindow } from 'electron';
export declare class ProtocolHandlerService {
    private mainWindow;
    constructor(mainWindow: BrowserWindow);
    private setupProtocolHandler;
    private handleProtocolUrl;
    private focusMainWindow;
    private sendToRenderer;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=protocol-handler.d.ts.map