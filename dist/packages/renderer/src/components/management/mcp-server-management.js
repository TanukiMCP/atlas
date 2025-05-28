"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPServerManagement = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * MCP Server Management Component
 * Provides UI for managing MCP servers, their configuration, and health monitoring
 */
const react_1 = require("react");
const mcp_store_1 = require("../../stores/mcp-store");
const MCPServerCard = ({ server, onConnect, onDisconnect, onRemove, onConfigure }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            case 'disconnected': return 'bg-gray-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting...';
            case 'disconnected': return 'Disconnected';
            case 'error': return 'Error';
            default: return 'Unknown';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold", children: server.name.charAt(0).toUpperCase() }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900 dark:text-white", children: server.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: server.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${getStatusColor(server.status)}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: getStatusText(server.status) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Transport:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 dark:text-white", children: server.transport.type })] }), server.transport.type === 'websocket' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "URL:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 dark:text-white font-mono text-xs", children: server.transport.url })] })), server.transport.type === 'stdio' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Command:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 dark:text-white font-mono text-xs", children: server.transport.command })] })), server.capabilities && server.capabilities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Capabilities:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 mt-1", children: server.capabilities.map((cap, index) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs", children: cap }, index))) })] }))] }), "      ", (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [server.status === 'connected' ? ((0, jsx_runtime_1.jsx)("button", { onClick: () => onDisconnect(server.id), className: "px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700", children: "Disconnect" })) : ((0, jsx_runtime_1.jsx)("button", { onClick: () => onConnect(server.id), disabled: server.status === 'connecting', className: "px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50", children: server.status === 'connecting' ? 'Connecting...' : 'Connect' })), (0, jsx_runtime_1.jsx)("button", { onClick: () => onConfigure(server.id), className: "px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700", children: "Configure" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onRemove(server.id), className: "px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600", children: "Remove" })] })] }));
};
const AddServerDialog = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [transportType, setTransportType] = (0, react_1.useState)('websocket');
    const [url, setUrl] = (0, react_1.useState)('');
    const [command, setCommand] = (0, react_1.useState)('');
    const [args, setArgs] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const server = {
            name,
            description,
            transport: transportType === 'websocket'
                ? { type: 'websocket', url }
                : { type: 'stdio', command, args: args.split(' ').filter(Boolean) },
            capabilities: []
        };
        onAdd(server);
        // Reset form
        setName('');
        setDescription('');
        setUrl('');
        setCommand('');
        setArgs('');
        onClose();
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Add MCP Server" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "p-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Server Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", placeholder: "My MCP Server" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: description, onChange: (e) => setDescription(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", placeholder: "Server description" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Transport Type" }), (0, jsx_runtime_1.jsxs)("select", { value: transportType, onChange: (e) => setTransportType(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", children: [(0, jsx_runtime_1.jsx)("option", { value: "websocket", children: "WebSocket" }), (0, jsx_runtime_1.jsx)("option", { value: "stdio", children: "Standard I/O" })] })] }), "          ", transportType === 'websocket' ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "WebSocket URL" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: url, onChange: (e) => setUrl(e.target.value), required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", placeholder: "ws://localhost:8080" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Command" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: command, onChange: (e) => setCommand(e.target.value), required: true, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", placeholder: "python server.py" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Arguments (space-separated)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: args, onChange: (e) => setArgs(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white", placeholder: "--port 8080 --debug" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Add Server" })] })] })] }) }));
};
const MCPServerManagement = () => {
    const [showAddDialog, setShowAddDialog] = (0, react_1.useState)(false);
    const [selectedServer, setSelectedServer] = (0, react_1.useState)(null);
    const { servers, addServer, removeServer, connectToServer, disconnectFromServer, refreshServerStatus } = (0, mcp_store_1.useMCPStore)();
    (0, react_1.useEffect)(() => {
        // Refresh server status on mount
        refreshServerStatus();
        // Set up periodic health checks
        const interval = setInterval(refreshServerStatus, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, [refreshServerStatus]);
    const handleAddServer = (serverData) => {
        addServer(serverData);
    };
    const handleConnect = (serverId) => {
        connectToServer(serverId);
    };
    const handleDisconnect = (serverId) => {
        disconnectFromServer(serverId);
    };
    const handleRemove = (serverId) => {
        if (confirm('Are you sure you want to remove this server?')) {
            removeServer(serverId);
        }
    };
    const handleConfigure = (serverId) => {
        setSelectedServer(serverId);
        // TODO: Open configuration dialog
        console.log('Configure server:', serverId);
    };
    const connectedServers = servers.filter(s => s.status === 'connected');
    const disconnectedServers = servers.filter(s => s.status !== 'connected');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "MCP Server Management" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [connectedServers.length, " connected, ", disconnectedServers.length, " disconnected"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: refreshServerStatus, className: "px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600", children: "\uD83D\uDD04 Refresh" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowAddDialog(true), className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "\u2795 Add Server" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-4", children: servers.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4", children: "\uD83D\uDD0C" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No MCP Servers" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Add your first MCP server to get started with tool integration." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowAddDialog(true), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Add Server" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [connectedServers.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-medium text-green-600 dark:text-green-400 mb-3", children: ["Connected Servers (", connectedServers.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: connectedServers.map(server => ((0, jsx_runtime_1.jsx)(MCPServerCard, { server: server, onConnect: handleConnect, onDisconnect: handleDisconnect, onRemove: handleRemove, onConfigure: handleConfigure }, server.id))) })] })), "            ", disconnectedServers.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400 mb-3", children: ["Disconnected Servers (", disconnectedServers.length, ")"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: disconnectedServers.map(server => ((0, jsx_runtime_1.jsx)(MCPServerCard, { server: server, onConnect: handleConnect, onDisconnect: handleDisconnect, onRemove: handleRemove, onConfigure: handleConfigure }, server.id))) })] }))] })) }), (0, jsx_runtime_1.jsx)(AddServerDialog, { isOpen: showAddDialog, onClose: () => setShowAddDialog(false), onAdd: handleAddServer })] }));
};
exports.MCPServerManagement = MCPServerManagement;
//# sourceMappingURL=mcp-server-management.js.map