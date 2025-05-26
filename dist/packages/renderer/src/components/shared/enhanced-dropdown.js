"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const dropdown_menu_1 = require("../ui/dropdown-menu");
const button_1 = require("../ui/button");
const EnhancedDropdown = ({ label, items, triggerMode = 'click', direction = 'down', className = '' }) => {
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: `h-auto px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground ${className}`, children: label }) }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuContent, { align: "start", side: direction === 'up' ? 'top' : 'bottom', className: "min-w-48", children: items.map((item, index) => {
                    if (item.type === 'separator') {
                        return (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}, index);
                    }
                    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: item.action, disabled: item.disabled, className: "flex items-center gap-2 cursor-pointer", children: [item.icon && (0, jsx_runtime_1.jsx)("span", { className: "w-4 h-4", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "flex-1", children: item.label }), item.shortcut && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-muted-foreground ml-auto", children: item.shortcut }))] }, index));
                }) })] }));
};
exports.EnhancedDropdown = EnhancedDropdown;
//# sourceMappingURL=enhanced-dropdown.js.map