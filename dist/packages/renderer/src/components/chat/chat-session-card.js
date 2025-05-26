"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ChatSessionCard = ({ session, isSelected, isCurrent, onSelect, onOpen, onEdit, onDelete, onArchive, onExport }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `chat-session-card p-3 border rounded-lg cursor-pointer transition-colors ${isCurrent
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : isSelected
                ? 'border-gray-400 bg-gray-50 dark:bg-gray-700'
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`, onClick: onOpen, children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isSelected, onChange: onSelect, onClick: (e) => e.stopPropagation(), className: "rounded" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium truncate", children: session.title })] }), session.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1 truncate", children: session.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-2 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: session.metadata.createdAt.toLocaleDateString() }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: [session.messages.length, " messages"] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: session.metadata.subjectMode })] })] }) }) }));
};
exports.ChatSessionCard = ChatSessionCard;
//# sourceMappingURL=chat-session-card.js.map