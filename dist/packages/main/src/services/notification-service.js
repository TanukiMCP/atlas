"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
class NotificationService {
    mainWindow = null;
    defaultIcon;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.defaultIcon = path_1.default.join(__dirname, '../../../assets/TanukiMCPLogo.png');
    }
    showNotification(options) {
        if (!electron_1.Notification.isSupported()) {
            console.warn('Notifications not supported on this platform');
            return;
        }
        const notification = new electron_1.Notification({
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
    showBuildComplete(projectName) {
        this.showNotification({
            title: 'Build Complete',
            body: `${projectName} has been built successfully`,
            onClick: () => this.focusMainWindow()
        });
    }
    showError(title, message) {
        this.showNotification({
            title: `Error: ${title}`,
            body: message,
            onClick: () => this.focusMainWindow()
        });
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
    setMainWindow(window) {
        this.mainWindow = window;
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification-service.js.map