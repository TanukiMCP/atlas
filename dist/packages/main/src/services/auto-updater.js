"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoUpdaterService = void 0;
const electron_updater_1 = require("electron-updater");
const electron_1 = require("electron");
class AutoUpdaterService {
    mainWindow = null;
    updateAvailable = false;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.setupAutoUpdater();
    }
    setupAutoUpdater() {
        electron_updater_1.autoUpdater.autoDownload = false;
        electron_updater_1.autoUpdater.autoInstallOnAppQuit = true;
        electron_updater_1.autoUpdater.on('checking-for-update', () => {
            console.log('🔍 Checking for updates...');
            this.sendToRenderer('update-checking');
        });
        electron_updater_1.autoUpdater.on('update-available', (info) => {
            console.log('📦 Update available:', info.version);
            this.updateAvailable = true;
            this.showUpdateAvailableNotification(info);
            this.sendToRenderer('update-available', info);
        });
        electron_updater_1.autoUpdater.on('update-not-available', (info) => {
            console.log('✅ No updates available');
            this.sendToRenderer('update-not-available', info);
        });
        electron_updater_1.autoUpdater.on('error', (err) => {
            console.error('❌ Update error:', err);
            this.sendToRenderer('update-error', err.message);
        });
        electron_updater_1.autoUpdater.on('download-progress', (progressObj) => {
            const message = `Downloaded ${progressObj.percent.toFixed(1)}%`;
            console.log('📥', message);
            this.sendToRenderer('update-download-progress', progressObj);
        });
        electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
            console.log('✅ Update downloaded:', info.version);
            this.showUpdateReadyNotification(info);
            this.sendToRenderer('update-downloaded', info);
        });
    }
    showUpdateAvailableNotification(info) {
        if (electron_1.Notification.isSupported()) {
            const notification = new electron_1.Notification({
                title: 'TanukiMCP Atlas Update Available',
                body: `Version ${info.version} is available. Click to download.`,
                icon: require('path').join(__dirname, '../../../assets/TanukiMCPLogo.png')
            });
            notification.on('click', () => {
                this.downloadUpdate();
            });
            notification.show();
        }
    }
    showUpdateReadyNotification(info) {
        if (electron_1.Notification.isSupported()) {
            const notification = new electron_1.Notification({
                title: 'TanukiMCP Atlas Update Ready',
                body: `Version ${info.version} has been downloaded. Restart to apply.`,
                icon: require('path').join(__dirname, '../../../assets/TanukiMCPLogo.png')
            });
            notification.on('click', () => {
                this.installUpdate();
            });
            notification.show();
        }
    }
    async checkForUpdates() {
        try {
            await electron_updater_1.autoUpdater.checkForUpdates();
        }
        catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }
    async downloadUpdate() {
        try {
            await electron_updater_1.autoUpdater.downloadUpdate();
        }
        catch (error) {
            console.error('Failed to download update:', error);
        }
    }
    installUpdate() {
        electron_updater_1.autoUpdater.quitAndInstall();
    }
    sendToRenderer(action, data) {
        if (!this.mainWindow)
            return;
        this.mainWindow.webContents.send('updater-action', { action, data });
    }
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.AutoUpdaterService = AutoUpdaterService;
//# sourceMappingURL=auto-updater.js.map