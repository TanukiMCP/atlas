"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSearch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ChatSearch = ({ query, onQueryChange, onAdvancedSearch }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "chat-search", children: (0, jsx_runtime_1.jsx)("input", { type: "text", value: query, onChange: (e) => onQueryChange(e.target.value), placeholder: "Search chats...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }) }));
};
exports.ChatSearch = ChatSearch;
//# sourceMappingURL=chat-search.js.map