"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSearch = void 0;
const react_1 = __importDefault(require("react"));
const ChatSearch = ({ query, onQueryChange, onAdvancedSearch }) => {
    return (<div className="chat-search">
      <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search chats..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>);
};
exports.ChatSearch = ChatSearch;
//# sourceMappingURL=chat-search.js.map