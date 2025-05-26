"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTrayService = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
class SystemTrayService {
    tray = null;
    mainWindow = null;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.createTray();
    }
    createTray() {
        try {
            // Create tray icon from assets
            const iconPath = path_1.default.join(__dirname, '../../../assets/TanukiMCPLogo.png');
            const trayIcon = electron_1.nativeImage.createFromPath(iconPath);
            // Resize icon for tray (16x16 on Windows)
            const resizedIcon = trayIcon.resize({ width: 16, height: 16 });
            this.tray = new electron_1.Tray(resizedIcon);
            this.tray.setToolTip('TanukiMCP Atlas - AI Agentic IDE');
            this.setupTrayMenu();
            this.setupTrayEvents();
            console.log('✅ System tray created successfully');
        }
        catch (error) {
            console.error('❌ Failed to create system tray:', error);
        }
    }
    setupTrayMenu() {
        if (!this.tray)
            return;
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: 'TanukiMCP Atlas',
                type: 'normal',
                enabled: false
            },
            { type: 'separator' },
            {
                label: 'Show Atlas',
                type: 'normal',
                click: () => this.showMainWindow()
            },
            {
                label: 'Hide Atlas',
                type: 'normal',
                click: () => this.hideMainWindow()
            },
            { type: 'separator' },
            {
                label: 'New Project',
                type: 'normal',
                accelerator: 'CmdOrCtrl+N',
                click: () => this.sendToRenderer('new-project')
            },
            {
                label: 'Open Project',
                type: 'normal',
                accelerator: 'CmdOrCtrl+O',
                click: () => this.sendToRenderer('open-project')
            },
            { type: 'separator' },
            {
                label: 'AI Chat',
                type: 'normal',
                accelerator: 'CmdOrCtrl+Shift+C',
                click: () => this.sendToRenderer('focus-chat')
            },
            {
                label: 'Command Palette',
                type: 'normal',
                accelerator: 'CmdOrCtrl+Shift+P',
                click: () => this.sendToRenderer('command-palette')
            },
            { type: 'separator' },
            {
                label: 'Settings',
                type: 'normal',
                click: () => this.sendToRenderer('open-settings')
            },
            {
                label: 'About',
                type: 'normal',
                click: () => this.sendToRenderer('show-about')
            },
            { type: 'separator' },
            {
                label: 'Quit Atlas',
                type: 'normal',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    electron_1.app.quit();
                }
            }
        ]);
        this.tray.setContextMenu(contextMenu);
    }
    setupTrayEvents() {
        if (!this.tray || !this.mainWindow)
            return;
        // Double-click to show/hide window
        this.tray.on('double-click', () => {
            if (this.mainWindow?.isVisible()) {
                this.hideMainWindow();
            }
            else {
                this.showMainWindow();
            }
        });
        // Single click behavior (Windows)
        if (process.platform === 'win32') {
            this.tray.on('click', () => {
                if (this.mainWindow?.isVisible()) {
                    this.hideMainWindow();
                }
                else {
                    this.showMainWindow();
                }
            });
        }
    }
    showMainWindow() {
        if (!this.mainWindow)
            return;
        if (this.mainWindow.isMinimized()) {
            this.mainWindow.restore();
        }
        this.mainWindow.show();
        this.mainWindow.focus();
        // Bring to front on Windows
        if (process.platform === 'win32') {
            this.mainWindow.setAlwaysOnTop(true);
            this.mainWindow.setAlwaysOnTop(false);
        }
    }
    hideMainWindow() {
        if (!this.mainWindow)
            return;
        this.mainWindow.hide();
    }
    sendToRenderer(action, data) {
        if (!this.mainWindow)
            return;
        this.showMainWindow();
        this.mainWindow.webContents.send('tray-action', { action, data });
    }
    updateTrayMenu() {
        this.setupTrayMenu();
    }
    destroy() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.SystemTrayService = SystemTrayService;
//# sourceMappingURL=system-tray.js.map