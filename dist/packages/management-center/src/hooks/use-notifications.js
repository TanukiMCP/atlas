"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotifications = void 0;
const react_1 = require("react");
const useNotifications = () => {
    const [notifications, setNotifications] = (0, react_1.useState)([
        {
            id: '1',
            type: 'info',
            title: 'System Status',
            message: 'All systems are operating normally',
            timestamp: Date.now() - 300000,
            read: false
        },
        {
            id: '2',
            type: 'warning',
            title: 'High CPU Usage',
            message: 'CPU usage is above 80% for the last 5 minutes',
            timestamp: Date.now() - 600000,
            read: false
        }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;
    const addNotification = (0, react_1.useCallback)((notification) => {
        const newNotification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);
    const markAsRead = (0, react_1.useCallback)((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);
    const markAllAsRead = (0, react_1.useCallback)(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);
    const removeNotification = (0, react_1.useCallback)((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);
    const clearAll = (0, react_1.useCallback)(() => {
        setNotifications([]);
    }, []);
    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    };
};
exports.useNotifications = useNotifications;
//# sourceMappingURL=use-notifications.js.map