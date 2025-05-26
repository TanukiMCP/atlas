"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolCatalogBrowser = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ToolCatalogBrowser = () => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [selectedTool, setSelectedTool] = (0, react_1.useState)(null);
    const [showTestingSandbox, setShowTestingSandbox] = (0, react_1.useState)(false);
    const categories = [
        { id: 'filesystem', name: 'File System', icon: '📁' },
        { id: 'web', name: 'Web & HTTP', icon: '🌐' },
        { id: 'database', name: 'Database', icon: '🗄️' },
        { id: 'ai', name: 'AI & ML', icon: '🤖' },
        { id: 'development', name: 'Development', icon: '💻' }
    ];
    const tools = [
        {
            id: '1',
            name: 'File Reader',
            description: 'Read and analyze files from the local filesystem',
            category: categories[0],
            status: 'available'
        },
        {
            id: '2',
            name: 'Web Scraper',
            description: 'Extract data from web pages and APIs',
            category: categories[1],
            status: 'available'
        },
        {
            id: '3',
            name: 'Database Query',
            description: 'Execute SQL queries and database operations',
            category: categories[2],
            status: 'busy'
        }
    ];
    const filteredTools = tools.filter(tool => {
        const matchesSearch = !searchQuery ||
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || tool.category.id === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-500';
            case 'busy':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "tool-catalog p-6 space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Tool Catalog" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Browse and manage available MCP tools" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search tools...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }) }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Categories" }), categories.map(category => ((0, jsx_runtime_1.jsxs)("option", { value: category.id, children: [category.icon, " ", category.name] }, category.id)))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTools.map(tool => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow", onClick: () => setSelectedTool(tool), children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: tool.category.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: tool.name })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: tool.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${getStatusColor(tool.status)}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: tool.status })] })] }) }) }, tool.id))) }), filteredTools.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 dark:text-gray-400", children: "No tools found matching your criteria." }) }))] }));
};
exports.ToolCatalogBrowser = ToolCatalogBrowser;
//# sourceMappingURL=tool-catalog-browser.js.map