"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ToolSelector = ({ tool, isSelected, onClick, onHover, showUsageStats = false }) => {
    const isAvailable = tool.availability.status === 'available';
    const getStatusIcon = () => {
        switch (tool.availability.status) {
            case 'available': return '🟢';
            case 'busy': return '🟡';
            case 'unavailable': return '🔴';
            case 'error': return '❌';
            default: return '⚪';
        }
    };
    const formatExecutionTime = (ms) => {
        if (ms < 1000)
            return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-150 ${isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'} ${!isAvailable ? 'opacity-60' : ''}`, onClick: onClick, onMouseEnter: onHover, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: tool.category.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900 dark:text-white truncate", children: tool.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: getStatusIcon() })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2", children: tool.description }), tool.tags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1 mb-2", children: [tool.tags.slice(0, 3).map(tag => ((0, jsx_runtime_1.jsx)("span", { className: "inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded", children: tag }, tag))), tool.tags.length > 3 && ((0, jsx_runtime_1.jsxs)("span", { className: "inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded", children: ["+", tool.tags.length - 3] }))] })), showUsageStats && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsxs)("span", { children: [tool.usageCount, " uses"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2705" }), (0, jsx_runtime_1.jsxs)("span", { children: [tool.successRate, "%"] })] }), tool.averageExecutionTime > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u23F1\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: formatExecutionTime(tool.averageExecutionTime) })] })), tool.userRating && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2B50" }), (0, jsx_runtime_1.jsx)("span", { children: tool.userRating.toFixed(1) })] }))] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-end space-y-1 ml-3", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${tool.source.type === 'builtin'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'}`, children: tool.source.type }), tool.availability.estimatedWaitTime && tool.availability.estimatedWaitTime > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-orange-600 dark:text-orange-400", children: ["~", formatExecutionTime(tool.availability.estimatedWaitTime)] }))] })] }), !isAvailable && tool.availability.errorMessage && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400", children: tool.availability.errorMessage }))] }));
};
exports.ToolSelector = ToolSelector;
//# sourceMappingURL=tool-selector.js.map