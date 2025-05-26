import { Notification, BrowserWindow } from 'electron';
import path from 'path';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  silent?: boolean;
  onClick?: () => void;
}

export class NotificationService {
  private mainWindow: BrowserWindow | null = null;
  private defaultIcon: string;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.defaultIcon = path.join(__dirname, '../../../assets/TanukiMCPLogo.png');
  }

  public showNotification(options: NotificationOptions): void {
    if (!Notification.isSupported()) {
      console.warn('Notifications not supported on this platform');
      return;
    }

    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon || this.defaultIcon,
      silent: options.silent || false
    });

    if (options.onClick) {
      notification.on('click', options.onClick);
    }

    notification.show();
  }

  public showBuildComplete(projectName: string): void {
    this.showNotification({
      title: 'Build Complete',
      body: `${projectName} has been built successfully`,
      onClick: () => this.focusMainWindow()
    });
  }  public showError(title: string, message: string): void {
    this.showNotification({
      title: `Error: ${title}`,
      body: message,
      onClick: () => this.focusMainWindow()
    });
  }

  private focusMainWindow(): void {
    if (!this.mainWindow) return;
    
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    
    this.mainWindow.show();
    this.mainWindow.focus();
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }
}