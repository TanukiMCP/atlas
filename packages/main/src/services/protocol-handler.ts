import { app, BrowserWindow } from 'electron';

export class ProtocolHandlerService {
  private mainWindow: BrowserWindow | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupProtocolHandler();
  }

  private setupProtocolHandler(): void {
    if (!app.isDefaultProtocolClient('tanukimcp')) {
      app.setAsDefaultProtocolClient('tanukimcp');
    }

    app.on('second-instance', (event, commandLine, workingDirectory) => {
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

    app.on('open-url', (event, url) => {
      event.preventDefault();
      this.handleProtocolUrl(url);
    });

    console.log('✅ Protocol handler registered for tanukimcp://');
  }

  private handleProtocolUrl(url: string): void {
    console.log('🔗 Handling protocol URL:', url);

    try {
      const parsedUrl = new URL(url);
      const action = parsedUrl.hostname;
      const params = Object.fromEntries(parsedUrl.searchParams);

      this.focusMainWindow();
      this.sendToRenderer('protocol-action', { action, params, url });
    } catch (error) {
      console.error('Failed to parse protocol URL:', error);
    }
  }  private focusMainWindow(): void {
    if (!this.mainWindow) return;
    
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    
    this.mainWindow.show();
    this.mainWindow.focus();
  }

  private sendToRenderer(action: string, data?: any): void {
    if (!this.mainWindow) return;
    this.mainWindow.webContents.send('protocol-action', { action, data });
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }
}