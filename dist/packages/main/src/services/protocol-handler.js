"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolHandlerService = void 0;
const electron_1 = require("electron");
class ProtocolHandlerService {
    mainWindow = null;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.setupProtocolHandler();
    }
    setupProtocolHandler() {
        if (!electron_1.app.isDefaultProtocolClient('tanukimcp')) {
            electron_1.app.setAsDefaultProtocolClient('tanukimcp');
        }
        electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (this.mainWindow) {
                if (this.mainWindow.isMinimized()) {
                    this.mainWindow.restore();
                }
                this.mainWindow.focus();
            }
            const url = commandLine.find(arg => arg.startsWith('tanukimcp://'));
            if (url) {
                this.handleProtocolUrl(url);
            }
        });
        electron_1.app.on('open-url', (event, url) => {
            event.preventDefault();
            this.handleProtocolUrl(url);
        });
        console.log('✅ Protocol handler registered for tanukimcp://');
    }
    handleProtocolUrl(url) {
        console.log('🔗 Handling protocol URL:', url);
        try {
            const parsedUrl = new URL(url);
            const action = parsedUrl.hostname;
            const params = Object.fromEntries(parsedUrl.searchParams);
            this.focusMainWindow();
            this.sendToRenderer('protocol-action', { action, params, url });
        }
        catch (error) {
            console.error('Failed to parse protocol URL:', error);
        }
    }
    focusMainWindow() {
        if (!this.mainWindow)
            return;
        if (this.mainWindow.isMinimized()) {
            this.mainWindow.restore();
        }
        this.mainWindow.show();
        this.mainWindow.focus();
    }
    sendToRenderer(action, data) {
        if (!this.mainWindow)
            return;
        this.mainWindow.webContents.send('protocol-action', { action, data });
    }
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.ProtocolHandlerService = ProtocolHandlerService;
//# sourceMappingURL=protocol-handler.js.map