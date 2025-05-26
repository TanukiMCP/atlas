"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptListPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * TanukiMCP Atlas - Prompt List Panel
 * Searchable tree view of all system prompts
 */
const react_1 = __importStar(require("react"));
const checkbox_1 = require("../ui/checkbox");
const prompt_store_1 = require("../../stores/prompt-store");
const PromptListPanel = ({ prompts, selectedPrompt, onSearch, facets }) => {
    const { selectPrompt } = (0, prompt_store_1.usePromptStore)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategories, setSelectedCategories] = (0, react_1.useState)([]);
    const [showModifiedOnly, setShowModifiedOnly] = (0, react_1.useState)(false);
    const [expandedCategories, setExpandedCategories] = (0, react_1.useState)(new Set());
    // Group prompts by category
    const promptsByCategory = (0, react_1.useMemo)(() => {
        const grouped = new Map();
        for (const prompt of prompts) {
            const categoryId = prompt.category.id;
            if (!grouped.has(categoryId)) {
                grouped.set(categoryId, []);
            }
            grouped.get(categoryId).push(prompt);
        }
        // Sort prompts within each category
        for (const [categoryId, categoryPrompts] of grouped) {
            categoryPrompts.sort((a, b) => a.name.localeCompare(b.name));
        }
        return grouped;
    }, [prompts]);
    const handleSearch = () => {
        const filters = {
            query: searchQuery.trim() || undefined,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            modifiedOnly: showModifiedOnly || undefined,
            sortBy: 'category',
            sortOrder: 'asc'
        };
        onSearch(filters);
    };
    const toggleCategory = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        }
        else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };
    const toggleCategoryFilter = (categoryId) => {
        const newSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        setSelectedCategories(newSelected);
    };
    // Auto-expand categories with search results
    react_1.default.useEffect(() => {
        if (searchQuery) {
            const categoriesWithMatches = new Set();
            for (const prompt of prompts) {
                if (prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    prompt.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                    categoriesWithMatches.add(prompt.category.id);
                }
            }
            setExpandedCategories(categoriesWithMatches);
        }
    }, [searchQuery, prompts]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search prompts...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), className: "w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg \n                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white \n                         focus:outline-none focus:ring-2 focus:ring-blue-500" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute left-2 top-2.5 text-gray-400", children: "\uD83D\uDD0D" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { checked: showModifiedOnly, onCheckedChange: (checked) => setShowModifiedOnly(checked === true) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Modified only" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSearch, className: "px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700", children: "Search" })] })] }) }), "      ", facets && facets.categories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Categories" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: facets.categories.map(category => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer text-sm", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { checked: selectedCategories.includes(category.id), onCheckedChange: () => toggleCategoryFilter(category.id) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-700 dark:text-gray-300", children: category.name }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-500 dark:text-gray-400", children: ["(", category.count, ")"] })] }, category.id))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto", children: [Array.from(promptsByCategory.entries()).map(([categoryId, categoryPrompts]) => {
                        const category = categoryPrompts[0]?.category;
                        if (!category)
                            return null;
                        const isExpanded = expandedCategories.has(categoryId);
                        const modifiedCount = categoryPrompts.filter(p => p.isModified).length;
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "border-b border-gray-100 dark:border-gray-800", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer", onClick: () => toggleCategory(categoryId), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `transform transition-transform ${isExpanded ? 'rotate-90' : ''}`, children: "\u25B6" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg", children: category.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 dark:text-white", children: category.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [categoryPrompts.length, " prompts", modifiedCount > 0 && ` • ${modifiedCount} modified`] })] })] }) }), isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50", children: categoryPrompts.map(prompt => ((0, jsx_runtime_1.jsx)("div", { className: `flex items-center space-x-3 p-3 pl-12 cursor-pointer border-l-2 transition-colors ${selectedPrompt?.id === prompt.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                            : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`, onClick: () => selectPrompt(prompt), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900 dark:text-white truncate", children: prompt.name }), prompt.isModified && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-yellow-500 rounded-full" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: prompt.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400 dark:text-gray-500", children: [prompt.agentModule, " \u2022 ", prompt.complexity] })] }) }, prompt.id))) }))] }, categoryId));
                    }), promptsByCategory.size === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center text-gray-500 dark:text-gray-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "No prompts found" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: "Try adjusting your search criteria" })] }))] })] }));
};
exports.PromptListPanel = PromptListPanel;
//# sourceMappingURL=prompt-list-panel.js.map