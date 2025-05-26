"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolTestingSandbox = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ToolTestingSandbox = ({ tool, isOpen, onClose, onTest }) => {
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold", children: ["Test Tool: ", tool.name] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Test Parameters" }), (0, jsx_runtime_1.jsx)("textarea", { className: "w-full px-3 py-2 border border-gray-300 rounded-lg", rows: 4, placeholder: "Enter test parameters as JSON..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onTest(tool), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Run Test" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50", children: "Cancel" })] })] })] }) }) }));
};
exports.ToolTestingSandbox = ToolTestingSandbox;
//# sourceMappingURL=tool-testing-sandbox.js.map