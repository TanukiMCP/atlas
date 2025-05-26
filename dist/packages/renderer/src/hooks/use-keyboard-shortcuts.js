"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatShortcut = exports.useKeyboardShortcuts = void 0;
// Keyboard shortcuts hook for TanukiMCP Atlas
const react_1 = require("react");
const useKeyboardShortcuts = (shortcuts) => {
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            const modifiers = [];
            if (event.ctrlKey)
                modifiers.push('Ctrl');
            if (event.shiftKey)
                modifiers.push('Shift');
            if (event.altKey)
                modifiers.push('Alt');
            if (event.metaKey)
                modifiers.push('Meta');
            const key = event.key;
            const shortcut = [...modifiers, key].join('+');
            if (shortcuts[shortcut]) {
                event.preventDefault();
                shortcuts[shortcut]();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
exports.useKeyboardShortcuts = useKeyboardShortcuts;
// Utility function to format shortcuts for display
const formatShortcut = (shortcut) => {
    return shortcut
        .replace('Ctrl', '⌃')
        .replace('Shift', '⇧')
        .replace('Alt', '⌥')
        .replace('Meta', '⌘');
};
exports.formatShortcut = formatShortcut;
//# sourceMappingURL=use-keyboard-shortcuts.js.map