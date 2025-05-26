import { BrowserWindow } from 'electron';
export interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    silent?: boolean;
    onClick?: () => void;
}
export declare class NotificationService {
    private mainWindow;
    private defaultIcon;
    constructor(mainWindow: BrowserWindow);
    showNotification(options: NotificationOptions): void;
    showBuildComplete(projectName: string): void;
    showError(title: string, message: string): void;
    private focusMainWindow;
    setMainWindow(window: BrowserWindow): void;
}
//# sourceMappingURL=notification-service.d.ts.map