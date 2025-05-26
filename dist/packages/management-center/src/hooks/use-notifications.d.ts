import { NotificationItem } from '../types/management-types';
export interface UseNotificationsReturn {
    notifications: NotificationItem[];
    unreadCount: number;
    addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}
export declare const useNotifications: () => UseNotificationsReturn;
//# sourceMappingURL=use-notifications.d.ts.map