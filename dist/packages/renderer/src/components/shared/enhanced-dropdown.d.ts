import React from 'react';
interface MenuItem {
    label?: string;
    action?: () => void;
    shortcut?: string;
    type?: 'separator';
    icon?: React.ReactNode;
    disabled?: boolean;
}
interface EnhancedDropdownProps {
    label: string;
    items: MenuItem[];
    triggerMode?: 'click' | 'hover';
    direction?: 'down' | 'up' | 'left' | 'right';
    className?: string;
}
export declare const EnhancedDropdown: React.FC<EnhancedDropdownProps>;
export {};
//# sourceMappingURL=enhanced-dropdown.d.ts.map