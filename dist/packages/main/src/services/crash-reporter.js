"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrashReporterService = void 0;
const electron_1 = require("electron");
const fs_1 = require("fs");
const path_1 = require("path");
const electron_2 = require("electron");
class CrashReporterService {
    mainWindow = null;
    crashLogDir;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.crashLogDir = (0, path_1.join)(electron_2.app.getPath('userData'), 'crash-logs');
        this.setupCrashReporter();
    }
    setupCrashReporter() {
        if (!(0, fs_1.existsSync)(this.crashLogDir)) {
            (0, fs_1.mkdirSync)(this.crashLogDir, { recursive: true });
        }
        electron_1.crashReporter.start({
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
    logCrash(error, context) {
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
                appVersion: electron_2.app.getVersion()
            }
        };
        const logFile = (0, path_1.join)(this.crashLogDir, `crash-${Date.now()}.json`);
        try {
            (0, fs_1.writeFileSync)(logFile, JSON.stringify(crashLog, null, 2));
            console.log('💥 Crash logged to:', logFile);
        }
        catch (writeError) {
            console.error('Failed to write crash log:', writeError);
        }
    }
    async showCrashDialog(error) {
        const result = await electron_1.dialog.showMessageBox(this.mainWindow, {
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
                electron_2.app.relaunch();
                electron_2.app.exit();
                break;
            case 2: // Report Issue
                require('electron').shell.openExternal('https://github.com/TanukiMCP/atlas/issues');
                break;
        }
    }
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.CrashReporterService = CrashReporterService;
//# sourceMappingURL=crash-reporter.js.map