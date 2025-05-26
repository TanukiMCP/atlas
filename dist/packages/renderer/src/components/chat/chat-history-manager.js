"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const use_chat_history_1 = require("../../hooks/use-chat-history");
const ChatHistoryManager = () => {
    const { sessions, currentSession, createSession, updateSession, deleteSession, archiveSession, exportSession } = (0, use_chat_history_1.useChatHistory)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedSessions, setSelectedSessions] = (0, react_1.useState)([]);
    const [showArchived, setShowArchived] = (0, react_1.useState)(false);
    const filteredSessions = sessions.filter(session => {
        const matchesSearch = !searchQuery ||
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesArchived = showArchived || !session.metadata.isArchived;
        return matchesSearch && matchesArchived;
    });
    const toggleSessionSelection = (sessionId) => {
        setSelectedSessions(prev => prev.includes(sessionId)
            ? prev.filter(id => id !== sessionId)
            : [...prev, sessionId]);
    };
    const handleBulkArchive = (sessionIds) => {
        sessionIds.forEach(id => archiveSession(id));
        setSelectedSessions([]);
    };
    const handleBulkDelete = (sessionIds) => {
        sessionIds.forEach(id => deleteSession(id));
        setSelectedSessions([]);
    };
    const handleBulkExport = (sessionIds) => {
        sessionIds.forEach(id => exportSession(id));
        setSelectedSessions([]);
    };
    const openSession = (sessionId) => {
        console.log('Open session:', sessionId);
    };
    const editSession = (session) => {
        console.log('Edit session:', session);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "chat-history-manager p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Chat History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage your conversation sessions" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => createSession({ title: 'New Session', description: '' }), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "New Session" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search sessions...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }) }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: showArchived, onChange: (e) => setShowArchived(e.target.checked), className: "rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Show archived" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: filteredSessions.map(session => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedSessions.includes(session.id), onChange: () => toggleSessionSelection(session.id), className: "rounded" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: session.title }), session.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: session.description })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: new Date(session.metadata.createdAt).toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => openSession(session.id), className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors", children: "Open" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => editSession(session), className: "px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors", children: "Edit" })] })] }) }, session.id))) }), filteredSessions.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400", children: "No sessions found matching your criteria." }) })), selectedSessions.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-6 left-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [selectedSessions.length, " session(s) selected"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkExport(selectedSessions), className: "px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors", children: "Export" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkArchive(selectedSessions), className: "px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors", children: "Archive" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkDelete(selectedSessions), className: "px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors", children: "Delete" })] })] }) }))] }));
};
exports.ChatHistoryManager = ChatHistoryManager;
//# sourceMappingURL=chat-history-manager.js.map