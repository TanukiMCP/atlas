// Keyboard shortcuts hook for TanukiMCP Atlas
import { useEffect } from 'react';

export interface KeyboardShortcuts {
  [key: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('Ctrl');
      if (event.shiftKey) modifiers.push('Shift');
      if (event.altKey) modifiers.push('Alt');
      if (event.metaKey) modifiers.push('Meta');
      
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

// Utility function to format shortcuts for display
export const formatShortcut = (shortcut: string): string => {
  return shortcut
    .replace('Ctrl', '⌃')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('Meta', '⌘');
};