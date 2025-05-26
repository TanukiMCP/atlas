import React from 'react';
interface MenuItem {
    label?: string;
    action?: () => void;
    shortcut?: string;
    type?: 'separator' | string;
    icon?: string;
    disabled?: boolean;
}
interface MenuDropdownProps {
    label: string;
    items: MenuItem[];
    className?: string;
}
export declare const MenuDropdown: React.FC<MenuDropdownProps>;
export {};
//# sourceMappingURL=menu-dropdown.d.ts.map