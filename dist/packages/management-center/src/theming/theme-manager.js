"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ThemeManager = () => {
    const [selectedTheme, setSelectedTheme] = (0, react_1.useState)('light');
    const themes = [
        { id: 'light', name: 'Light', colors: ['#ffffff', '#f3f4f6', '#3b82f6'] },
        { id: 'dark', name: 'Dark', colors: ['#1f2937', '#111827', '#60a5fa'] },
        { id: 'blue', name: 'Ocean Blue', colors: ['#dbeafe', '#1e40af', '#3b82f6'] },
        { id: 'purple', name: 'Purple', colors: ['#ede9fe', '#7c3aed', '#8b5cf6'] }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "theme-manager p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Appearance Settings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Customize the look and feel of your IDE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Theme Selection" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: themes.map((theme) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedTheme(theme.id), className: `cursor-pointer p-4 rounded-lg border-2 transition-colors ${selectedTheme === theme.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex space-x-1 mb-2", children: theme.colors.map((color, index) => ((0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: color } }, index))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: theme.name })] }, theme.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Accessibility" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { children: "High contrast mode" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { children: "Reduce animations" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { children: "Large text" })] })] })] })] })] }));
};
exports.ThemeManager = ThemeManager;
//# sourceMappingURL=theme-manager.js.map