"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMPromptManagement = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * TanukiMCP Atlas - LLM System Prompt Management UI
 * Main interface for viewing and editing all system prompts
 */
const react_1 = require("react");
const prompt_store_1 = require("../../stores/prompt-store");
const prompt_list_panel_1 = require("./prompt-list-panel");
const prompt_editor_panel_1 = require("./prompt-editor-panel");
const prompt_metadata_panel_1 = require("./prompt-metadata-panel");
const LLMPromptManagement = () => {
    const { isLoading, error, selectedPrompt, searchResults, hasUnsavedChanges, initialize, searchPrompts, clearError } = (0, prompt_store_1.usePromptStore)();
    const [sidebarWidth, setSidebarWidth] = (0, react_1.useState)(300);
    const [rightPanelWidth, setRightPanelWidth] = (0, react_1.useState)(350);
    (0, react_1.useEffect)(() => {
        initialize();
    }, [initialize]);
    (0, react_1.useEffect)(() => {
        // Handle unsaved changes warning
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);
    const handleSearch = (filters) => {
        searchPrompts(filters);
    };
    const handleResize = (panel, delta) => {
        if (panel === 'left') {
            setSidebarWidth(Math.max(250, Math.min(500, sidebarWidth + delta)));
        }
        else {
            setRightPanelWidth(Math.max(300, Math.min(600, rightPanelWidth + delta)));
        }
    };
    if (isLoading && !searchResults) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading prompt registry..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col bg-gray-50 dark:bg-gray-900", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: "\uD83E\uDDE0" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "LLM System Prompt Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "View and edit system prompts that guide all LLM agents" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [hasUnsavedChanges && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-yellow-500 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-yellow-700 dark:text-yellow-300", children: "Unsaved changes" })] })), searchResults && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [searchResults.totalCount, " prompts \u2022 ", searchResults.prompts.filter(p => p.isModified).length, " modified"] }))] })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-500", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { className: "text-red-700 dark:text-red-300", children: error })] }), (0, jsx_runtime_1.jsx)("button", { onClick: clearError, className: "text-red-500 hover:text-red-700 dark:hover:text-red-300", children: "\u2715" })] }) }))] }), "      ", (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", style: { width: sidebarWidth }, children: (0, jsx_runtime_1.jsx)(prompt_list_panel_1.PromptListPanel, { prompts: searchResults?.prompts || [], selectedPrompt: selectedPrompt, onSearch: handleSearch, facets: searchResults?.facets }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 cursor-col-resize", onMouseDown: (e) => {
                            const startX = e.clientX;
                            const handleMouseMove = (e) => {
                                const delta = e.clientX - startX;
                                handleResize('left', delta);
                            };
                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        } }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col overflow-hidden", children: (0, jsx_runtime_1.jsx)(prompt_editor_panel_1.PromptEditorPanel, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 cursor-col-resize", onMouseDown: (e) => {
                            const startX = e.clientX;
                            const handleMouseMove = (e) => {
                                const delta = startX - e.clientX;
                                handleResize('right', delta);
                            };
                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };
                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        } }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700", style: { width: rightPanelWidth }, children: (0, jsx_runtime_1.jsx)(prompt_metadata_panel_1.PromptMetadataPanel, {}) })] })] }));
};
exports.LLMPromptManagement = LLMPromptManagement;
//# sourceMappingURL=llm-prompt-management.js.map