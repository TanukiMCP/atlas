"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtSymbolDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tool_selector_1 = require("./tool-selector");
const tool_preview_1 = require("./tool-preview");
const parameter_input_1 = require("./parameter-input");
const AtSymbolDropdown = ({ isOpen, onClose, onToolSelect, context, position, initialQuery = '', toolRouter }) => {
    const [query, setQuery] = (0, react_1.useState)(initialQuery);
    const [selectedTool, setSelectedTool] = (0, react_1.useState)(null);
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [showParameters, setShowParameters] = (0, react_1.useState)(false);
    const [currentCategory, setCurrentCategory] = (0, react_1.useState)('all');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    // Load initial data
    (0, react_1.useEffect)(() => {
        if (isOpen && toolRouter) {
            loadInitialData();
        }
    }, [isOpen, toolRouter]);
    // Search when query or category changes
    (0, react_1.useEffect)(() => {
        if (isOpen && toolRouter) {
            performSearch();
        }
    }, [query, currentCategory, isOpen, toolRouter]);
    const loadInitialData = (0, react_1.useCallback)(async () => {
        try {
            setIsLoading(true);
            const [availableCategories] = await Promise.all([
                toolRouter.getAvailableCategories(context)
            ]);
            setCategories(availableCategories);
        }
        catch (error) {
            console.error('Failed to load initial data:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [toolRouter, context]);
    const performSearch = (0, react_1.useCallback)(async () => {
        if (!toolRouter)
            return;
        try {
            setIsLoading(true);
            let results;
            if (query.trim()) {
                results = await toolRouter.searchTools(query, context, {
                    maxResults: 10,
                    categoryFilter: currentCategory === 'all' ? undefined : [currentCategory]
                });
            }
            else if (currentCategory === 'all') {
                // Show recently used tools when no query
                results = await toolRouter.searchTools('', context, { maxResults: 10 });
            }
            else {
                results = await toolRouter.getToolsByCategory(currentCategory, context);
            }
            setSearchResults(results);
            setSelectedIndex(0);
        }
        catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        }
        finally {
            setIsLoading(false);
        }
    }, [query, currentCategory, toolRouter, context]); // Keyboard navigation
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
                        handleToolSelection(searchResults[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    if (showParameters) {
                        setShowParameters(false);
                        setSelectedTool(null);
                    }
                    else {
                        onClose();
                    }
                    break;
                case 'Tab':
                    event.preventDefault();
                    if (searchResults[selectedIndex]) {
                        setShowPreview(!showPreview);
                    }
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, searchResults, showPreview, showParameters, onClose]);
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
    const handleToolSelection = (0, react_1.useCallback)(async (tool) => {
        setSelectedTool(tool);
        // Check if tool requires parameters
        const hasRequiredParams = tool.inputSchema.required && tool.inputSchema.required.length > 0;
        if (hasRequiredParams && !showParameters) {
            setShowParameters(true);
        }
        else {
            onToolSelect(tool);
            onClose();
        }
    }, [onToolSelect, onClose, showParameters]);
    const handleParameterSubmit = (0, react_1.useCallback)((parameters) => {
        if (selectedTool) {
            onToolSelect(selectedTool, parameters);
            onClose();
        }
    }, [selectedTool, onToolSelect, onClose]);
    const handleCategoryChange = (0, react_1.useCallback)((categoryId) => {
        setCurrentCategory(categoryId);
        setSelectedIndex(0);
        if (categoryId !== 'all') {
            setQuery(''); // Clear query when switching to category view
        }
    }, []);
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: "fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-2xl w-full", style: {
            left: position.x,
            top: position.y,
            maxHeight: '70vh'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-500 font-mono text-lg", children: "@" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search tools...", className: "flex-1 bg-transparent border-none outline-none text-lg dark:text-white placeholder-gray-500 dark:placeholder-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Tab for preview \u2022 Enter to select" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 mt-3 overflow-x-auto", children: [(0, jsx_runtime_1.jsx)("button", { className: `px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${currentCategory === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`, onClick: () => handleCategoryChange('all'), children: "All Tools" }), categories.map(category => ((0, jsx_runtime_1.jsxs)("button", { className: `px-3 py-1 text-xs rounded-full whitespace-nowrap flex items-center space-x-1 transition-colors ${currentCategory === category.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`, onClick: () => handleCategoryChange(category.id), children: [(0, jsx_runtime_1.jsx)("span", { children: category.icon }), (0, jsx_runtime_1.jsx)("span", { children: category.name })] }, category.id)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex max-h-96", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto", children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center p-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-gray-600 dark:text-gray-400", children: "Loading..." })] })) : searchResults.length > 0 ? (searchResults.map((tool, index) => ((0, jsx_runtime_1.jsx)(tool_selector_1.ToolSelector, { tool: tool, isSelected: index === selectedIndex, onClick: () => handleToolSelection(tool), onHover: () => setSelectedIndex(index), showUsageStats: true }, tool.id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center text-gray-500 dark:text-gray-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "No tools found" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm mt-1", children: "Try a different search term or category" })] })) }), showPreview && selectedTool && ((0, jsx_runtime_1.jsx)("div", { className: "w-80 border-l border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)(tool_preview_1.ToolPreview, { toolId: selectedTool.id, toolRouter: toolRouter }) }))] }), showParameters && selectedTool && ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsx)(parameter_input_1.ParameterInput, { tool: selectedTool, onSubmit: handleParameterSubmit, onCancel: () => {
                        setShowParameters(false);
                        setSelectedTool(null);
                    } }) })), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2191\u2193 Navigate" }), (0, jsx_runtime_1.jsx)("span", { children: "\u23CE Select" }), (0, jsx_runtime_1.jsx)("span", { children: "\u21E5 Preview" }), (0, jsx_runtime_1.jsx)("span", { children: "\u238B Close" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [searchResults.length, " tools available"] })] })] }));
};
exports.AtSymbolDropdown = AtSymbolDropdown;
//# sourceMappingURL=at-symbol-dropdown.js.map