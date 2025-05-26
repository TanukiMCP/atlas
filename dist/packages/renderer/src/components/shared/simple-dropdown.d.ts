import React from 'react';
interface MenuItem {
    label?: string;
    action?: () => void;
    shortcut?: string;
    type?: 'separator';
}
interface SimpleDropdownProps {
    label: string;
    items: MenuItem[];
}
export declare const SimpleDropdown: React.FC<SimpleDropdownProps>;
export {};
//# sourceMappingURL=simple-dropdown.d.ts.map