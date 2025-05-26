import { crashReporter, BrowserWindow, dialog } from 'electron';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

export class CrashReporterService {
  private mainWindow: BrowserWindow | null = null;
  private crashLogDir: string;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.crashLogDir = join(app.getPath('userData'), 'crash-logs');
    this.setupCrashReporter();
  }

  private setupCrashReporter(): void {
    if (!existsSync(this.crashLogDir)) {
      mkdirSync(this.crashLogDir, { recursive: true });
    }

    crashReporter.start({
      productName: 'TanukiMCP Atlas',
      companyName: 'TanukiMCP',
      submitURL: '',
      uploadToServer: false,
      ignoreSystemCrashHandler: false,
      rateLimit: true,
      compress: true
    });

    console.log('✅ Crash reporter initialized');
  }

  public logCrash(error: Error, context?: string): void {
    const timestamp = new Date().toISOString();
    const crashLog = {
      timestamp,
      context: context || 'Unknown',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        appVersion: app.getVersion()
      }
    };    const logFile = join(this.crashLogDir, `crash-${Date.now()}.json`);
    
    try {
      writeFileSync(logFile, JSON.stringify(crashLog, null, 2));
      console.log('💥 Crash logged to:', logFile);
    } catch (writeError) {
      console.error('Failed to write crash log:', writeError);
    }
  }

  public async showCrashDialog(error: Error): Promise<void> {
    const result = await dialog.showMessageBox(this.mainWindow!, {
      type: 'error',
      title: 'Application Error',
      message: 'TanukiMCP Atlas encountered an unexpected error',
      detail: `${error.message}\n\nThe error has been logged for debugging.`,
      buttons: ['Restart', 'Close', 'Report Issue'],
      defaultId: 0,
      cancelId: 1
    });

    switch (result.response) {
      case 0: // Restart
        app.relaunch();
        app.exit();
        break;
      case 2: // Report Issue
        require('electron').shell.openExternal('https://github.com/TanukiMCP/atlas/issues');
        break;
    }
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }
}