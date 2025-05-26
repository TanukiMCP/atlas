"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedAtSymbolDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Enhanced @ Symbol Dropdown with Custom Workflow Support
 * Extends the base tool selector to include saved workflows
 */
const react_1 = require("react");
const EnhancedAtSymbolDropdown = ({ isOpen, onClose, onToolSelect, onWorkflowSelect, context, position, initialQuery = '', toolRouter, workflowService }) => {
    const [query, setQuery] = (0, react_1.useState)(initialQuery);
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [currentCategory, setCurrentCategory] = (0, react_1.useState)('all');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const [toolCategories, setToolCategories] = (0, react_1.useState)([]);
    const [workflows, setWorkflows] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    // Define workflow categories
    const workflowCategories = [
        { id: 'custom', name: 'Custom Workflows', icon: '🔧', description: 'User-created workflows' },
        { id: 'automation', name: 'Automation', icon: '⚡', description: 'Automated task workflows' },
        { id: 'analysis', name: 'Analysis', icon: '📊', description: 'Data analysis workflows' },
        { id: 'development', name: 'Development', icon: '💻', description: 'Development workflows' }
    ];
    // Load initial data
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen]);
    // Perform search when query or category changes
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            performSearch();
        }
    }, [query, currentCategory, workflows]);
    // Keyboard navigation
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (searchResults[selectedIndex]) {
                        handleItemSelection(searchResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    onClose();
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, searchResults, onClose]);
    // Focus input when opened
    (0, react_1.useEffect)(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    // Click outside to close
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            // Load tools
            if (toolRouter) {
                const categories = await toolRouter.getCategories();
                setToolCategories(categories);
            }
            // Load workflows
            const userWorkflows = await workflowService.getWorkflows();
            setWorkflows(userWorkflows);
        }
        catch (error) {
            console.error('Failed to load dropdown data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const performSearch = async () => {
        if (!isOpen)
            return;
        try {
            let results = [];
            // Search tools
            if (toolRouter && (currentCategory === 'all' || !currentCategory.startsWith('workflow_'))) {
                const toolResults = await toolRouter.searchTools({
                    query,
                    category: currentCategory === 'all' ? undefined : currentCategory,
                    limit: 20
                });
                results = [...results, ...toolResults.map((tool) => ({
                        type: 'tool',
                        item: tool
                    }))];
            }
            // Search workflows
            if (currentCategory === 'all' || currentCategory.startsWith('workflow_')) {
                const workflowResults = await workflowService.searchWorkflows(query);
                const filteredWorkflows = currentCategory === 'all'
                    ? workflowResults
                    : workflowResults.filter(w => w.metadata?.category === currentCategory.replace('workflow_', ''));
                results = [...results, ...filteredWorkflows.map(workflow => ({
                        type: 'workflow',
                        item: workflow
                    }))];
            }
            // Sort by relevance (tools first, then workflows)
            results.sort((a, b) => {
                if (a.type === 'tool' && b.type === 'workflow')
                    return -1;
                if (a.type === 'workflow' && b.type === 'tool')
                    return 1;
                return 0;
            });
            setSearchResults(results);
            setSelectedIndex(0);
        }
        catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        }
    };
    const handleItemSelection = (item) => {
        if (item.type === 'tool') {
            onToolSelect(item.item);
        }
        else if (item.type === 'workflow') {
            onWorkflowSelect(item.item);
        }
        onClose();
    };
    const getItemIcon = (item) => {
        if (item.type === 'tool') {
            return item.item.category.icon;
        }
        else if (item.type === 'workflow') {
            return '🔧';
        }
        return '❓';
    };
    const getItemName = (item) => {
        if (item.type === 'tool') {
            return item.item.name;
        }
        else if (item.type === 'workflow') {
            return item.item.name;
        }
        return 'Unknown';
    };
    const getItemDescription = (item) => {
        if (item.type === 'tool') {
            return item.item.description;
        }
        else if (item.type === 'workflow') {
            return item.item.description;
        }
        return '';
    };
    const getAllCategories = () => {
        const categories = [
            { id: 'all', name: 'All Tools & Workflows', icon: '🔍' },
            ...toolCategories,
            { id: 'workflow_separator', name: '─── Custom Workflows ───', icon: '', disabled: true },
            ...workflowCategories.map(cat => ({
                id: `workflow_${cat.id}`,
                name: cat.name,
                icon: cat.icon
            }))
        ];
        return categories;
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: "fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-2xl w-full", style: {
            left: position.x,
            top: position.y,
            maxHeight: '70vh'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "@" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Tool & Workflow Selector" })] }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search tools and workflows...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-2 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: getAllCategories().map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => !category.disabled && setCurrentCategory(category.id), disabled: category.disabled, className: `px-2 py-1 text-xs rounded-lg transition-colors ${category.disabled
                            ? 'text-gray-400 cursor-default'
                            : currentCategory === category.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: [category.icon && (0, jsx_runtime_1.jsx)("span", { className: "mr-1", children: category.icon }), category.name] }, category.id))) }) }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-80 overflow-y-auto", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-center text-gray-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" }), "Loading..."] })) : searchResults.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-center text-gray-500", children: query ? `No tools or workflows found for "${query}"` : 'No items available' })) : (searchResults.map((result, index) => ((0, jsx_runtime_1.jsx)("div", { className: `p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-150 ${selectedIndex === index
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`, onClick: () => handleItemSelection(result), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: getItemIcon(result) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100 truncate", children: getItemName(result) }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 text-xs rounded-full ${result.type === 'tool'
                                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`, children: result.type === 'tool' ? 'Tool' : 'Workflow' })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400 truncate", children: getItemDescription(result) }), result.type === 'workflow' && result.item.tags && ((0, jsx_runtime_1.jsx)("div", { className: "mt-1 flex flex-wrap gap-1", children: result.item.tags.slice(0, 3).map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: "px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded", children: tag }, tag))) }))] })] }) }, `${result.type}_${result.item.id || result.item.workflowId}`)))) }), (0, jsx_runtime_1.jsx)("div", { className: "p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("span", { children: [searchResults.length, " item", searchResults.length !== 1 ? 's' : '', " found"] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2191\u2193 Navigate \u2022 Enter Select \u2022 Esc Close" })] }) })] }));
};
exports.EnhancedAtSymbolDropdown = EnhancedAtSymbolDropdown;
//# sourceMappingURL=enhanced-at-symbol-dropdown.js.map