"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeMenuService = void 0;
const electron_1 = require("electron");
class NativeMenuService {
    mainWindow = null;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.createApplicationMenu();
    }
    createApplicationMenu() {
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New Project',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => this.sendToRenderer('new-project')
                    },
                    {
                        label: 'Open Project',
                        accelerator: 'CmdOrCtrl+O',
                        click: () => this.sendToRenderer('open-project')
                    },
                    { type: 'separator' },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => this.sendToRenderer('save-file')
                    },
                    {
                        label: 'Save As...',
                        accelerator: 'CmdOrCtrl+Shift+S',
                        click: () => this.sendToRenderer('save-file-as')
                    },
                    { type: 'separator' },
                    {
                        label: 'Exit',
                        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                        click: () => electron_1.app.quit()
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'selectall' },
                    { type: 'separator' },
                    {
                        label: 'Find',
                        accelerator: 'CmdOrCtrl+F',
                        click: () => this.sendToRenderer('find')
                    },
                    {
                        label: 'Replace',
                        accelerator: 'CmdOrCtrl+H',
                        click: () => this.sendToRenderer('replace')
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' },
                    { type: 'separator' },
                    {
                        label: 'Command Palette',
                        accelerator: 'CmdOrCtrl+Shift+P',
                        click: () => this.sendToRenderer('command-palette')
                    }
                ]
            },
            {
                label: 'AI',
                submenu: [
                    {
                        label: 'Open Chat',
                        accelerator: 'CmdOrCtrl+Shift+C',
                        click: () => this.sendToRenderer('focus-chat')
                    },
                    {
                        label: 'New Agent',
                        accelerator: 'CmdOrCtrl+Shift+A',
                        click: () => this.sendToRenderer('new-agent')
                    },
                    {
                        label: 'Workflow Builder',
                        accelerator: 'CmdOrCtrl+Shift+W',
                        click: () => this.sendToRenderer('workflow-builder')
                    }
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    {
                        label: 'MCP Servers',
                        click: () => this.sendToRenderer('mcp-servers')
                    },
                    {
                        label: 'Model Manager',
                        click: () => this.sendToRenderer('model-manager')
                    },
                    { type: 'separator' },
                    {
                        label: 'Settings',
                        accelerator: 'CmdOrCtrl+,',
                        click: () => this.sendToRenderer('open-settings')
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Documentation',
                        click: () => electron_1.shell.openExternal('https://tanukimcp.com/docs')
                    },
                    {
                        label: 'Community',
                        click: () => electron_1.shell.openExternal('https://github.com/TanukiMCP/atlas')
                    },
                    { type: 'separator' },
                    {
                        label: 'About TanukiMCP Atlas',
                        click: () => this.sendToRenderer('show-about')
                    }
                ]
            }
        ];
        const menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
    }
    sendToRenderer(action, data) {
        if (!this.mainWindow)
            return;
        this.mainWindow.webContents.send('menu-action', { action, data });
    }
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.NativeMenuService = NativeMenuService;
//# sourceMappingURL=native-menu.js.map