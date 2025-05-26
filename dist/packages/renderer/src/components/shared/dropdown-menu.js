"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DropdownMenu = ({ label, items }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(!isOpen), className: "px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded", children: label }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50", children: items.map((item, index) => (item.type === 'separator' ? ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 dark:border-gray-700 my-1" }, index)) : ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                        item.action?.();
                        setIsOpen(false);
                    }, className: "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { children: item.label }), item.shortcut && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: item.shortcut }))] }, index)))) }))] }));
};
exports.DropdownMenu = DropdownMenu;
//# sourceMappingURL=dropdown-menu.js.map