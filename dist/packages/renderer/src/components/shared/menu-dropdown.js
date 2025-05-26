"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const dropdown_menu_1 = require("../ui/dropdown-menu");
const button_1 = require("../ui/button");
const MenuDropdown = ({ label, items, className = '' }) => {
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: `px-3 py-1 text-sm font-medium hover:bg-accent ${className}`, children: label }) }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuContent, { align: "start", className: "w-56", children: items.map((item, index) => {
                    if (item.type === 'separator') {
                        return (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}, index);
                    }
                    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: item.action, disabled: item.disabled, className: "cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1", children: [item.icon && (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }), item.shortcut && ((0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuShortcut, { children: item.shortcut }))] }, index));
                }) })] }));
};
exports.MenuDropdown = MenuDropdown;
//# sourceMappingURL=menu-dropdown.js.map