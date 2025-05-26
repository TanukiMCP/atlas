"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensiveToolCatalog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const input_1 = require("../ui/input");
const SAMPLE_TOOLS = [
    { id: 'read_file', name: 'Read File', description: 'Read contents of any file type', category: 'file', icon: '📖', version: '2.1.0', usage: 89, rating: 4.8, tags: ['core'], isInstalled: true, isPremium: false },
    { id: 'write_file', name: 'Write File', description: 'Create or modify files', category: 'file', icon: '✍️', version: '2.1.0', usage: 76, rating: 4.7, tags: ['core'], isInstalled: true, isPremium: false },
    { id: 'search_code', name: 'Code Search', description: 'Advanced code search with regex', category: 'code', icon: '🔍', version: '1.5.2', usage: 64, rating: 4.6, tags: ['search'], isInstalled: true, isPremium: false },
    { id: 'git_operations', name: 'Git Operations', description: 'Complete Git workflow automation', category: 'code', icon: '🔀', version: '3.0.1', usage: 58, rating: 4.9, tags: ['git'], isInstalled: false, isPremium: false },
    { id: 'web_scraper', name: 'Web Scraper Pro', description: 'Advanced web scraping with AI', category: 'web', icon: '🕷️', version: '2.3.0', usage: 71, rating: 4.5, tags: ['scraping'], isInstalled: false, isPremium: true },
    { id: 'data_visualizer', name: 'Data Visualizer', description: 'Create charts and graphs', category: 'data', icon: '📈', version: '1.8.0', usage: 42, rating: 4.4, tags: ['charts'], isInstalled: true, isPremium: false }
];
const CATEGORIES = [
    { id: 'all', name: 'All Tools', icon: '📂' },
    { id: 'file', name: 'File Operations', icon: '📁' },
    { id: 'code', name: 'Code & Development', icon: '💻' },
    { id: 'data', name: 'Data Analysis', icon: '📊' },
    { id: 'web', name: 'Web & APIs', icon: '🌐' },
    { id: 'automation', name: 'Automation', icon: '⚡' }
];
const ComprehensiveToolCatalog = () => {
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [tools, setTools] = (0, react_1.useState)(SAMPLE_TOOLS);
    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const installTool = (toolId) => {
        setTools(prev => prev.map(tool => tool.id === toolId ? { ...tool, isInstalled: true } : tool));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col bg-muted/30", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-5 bg-background border-b border-border", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDEE0\uFE0F Tool Catalog" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "text", placeholder: "Search tools...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-80" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { width: '200px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '16px' }, children: CATEGORIES.map(cat => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedCategory(cat.id), style: {
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                backgroundColor: selectedCategory === cat.id ? '#eff6ff' : 'transparent',
                                color: selectedCategory === cat.id ? '#1d4ed8' : '#374151',
                                marginBottom: '4px'
                            }, children: [cat.icon, " ", cat.name] }, cat.id))) }), (0, jsx_runtime_1.jsx)("div", { style: { flex: 1, padding: '20px', overflowY: 'auto' }, children: (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }, children: filteredTools.map(tool => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '20px'
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '24px' }, children: tool.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { style: { fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }, children: tool.name }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '12px', color: '#6b7280' }, children: ["v", tool.version] })] }), tool.isInstalled && ((0, jsx_runtime_1.jsx)("span", { style: { fontSize: '10px', color: '#059669', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }, children: "INSTALLED" }))] }), (0, jsx_runtime_1.jsx)("p", { style: { fontSize: '14px', color: '#374151', marginBottom: '12px' }, children: tool.description }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '12px', color: '#6b7280' }, children: ["\u2B50 ", tool.rating, " \u2022 \uD83D\uDCC8 ", tool.usage, "%"] }), !tool.isInstalled && ((0, jsx_runtime_1.jsx)("button", { onClick: () => installTool(tool.id), style: {
                                                    padding: '6px 12px',
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }, children: tool.isPremium ? '💎 Install Pro' : '📦 Install' }))] })] }, tool.id))) }) })] })] }));
};
exports.ComprehensiveToolCatalog = ComprehensiveToolCatalog;
//# sourceMappingURL=comprehensive-tool-catalog.js.map