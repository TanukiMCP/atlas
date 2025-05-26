import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog, Notification } from 'electron';

export class AutoUpdaterService {
  private mainWindow: BrowserWindow | null = null;
  private updateAvailable = false;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  private setupAutoUpdater(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
      console.log('🔍 Checking for updates...');
      this.sendToRenderer('update-checking');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('📦 Update available:', info.version);
      this.updateAvailable = true;
      this.showUpdateAvailableNotification(info);
      this.sendToRenderer('update-available', info);
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('✅ No updates available');
      this.sendToRenderer('update-not-available', info);
    });

    autoUpdater.on('error', (err) => {
      console.error('❌ Update error:', err);
      this.sendToRenderer('update-error', err.message);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      const message = `Downloaded ${progressObj.percent.toFixed(1)}%`;
      console.log('📥', message);
      this.sendToRenderer('update-download-progress', progressObj);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('✅ Update downloaded:', info.version);
      this.showUpdateReadyNotification(info);
      this.sendToRenderer('update-downloaded', info);
    });
  }  private showUpdateAvailableNotification(info: any): void {
    if (Notification.isSupported()) {
      const notification = new Notification({
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

  private showUpdateReadyNotification(info: any): void {
    if (Notification.isSupported()) {
      const notification = new Notification({
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

  public async checkForUpdates(): Promise<void> {
    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  public async downloadUpdate(): Promise<void> {
    try {
      await autoUpdater.downloadUpdate();
    } catch (error) {
      console.error('Failed to download update:', error);
    }
  }

  public installUpdate(): void {
    autoUpdater.quitAndInstall();
  }

  private sendToRenderer(action: string, data?: any): void {
    if (!this.mainWindow) return;
    this.mainWindow.webContents.send('updater-action', { action, data });
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }
}