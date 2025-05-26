"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementCenterModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const _management_center_1 = require("@management-center");
const ManagementCenterModal = ({ isOpen, onClose }) => {
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] m-4 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "TanukiMCP Management Center" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-full", children: (0, jsx_runtime_1.jsx)(_management_center_1.ManagementDashboard, {}) })] }) }));
};
exports.ManagementCenterModal = ManagementCenterModal;
//# sourceMappingURL=management-center-modal.js.map