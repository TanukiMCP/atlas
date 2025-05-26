import React from 'react';
interface MenuItem {
    label: string;
    action?: () => void;
    shortcut?: string;
    type?: 'separator';
}
interface DropdownMenuProps {
    label: string;
    items: MenuItem[];
}
export declare const DropdownMenu: React.FC<DropdownMenuProps>;
export {};
//# sourceMappingURL=dropdown-menu.d.ts.map