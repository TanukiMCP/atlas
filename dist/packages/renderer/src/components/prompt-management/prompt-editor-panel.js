"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptEditorPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * TanukiMCP Atlas - Prompt Editor Panel
 * Monaco Editor for editing system prompts with validation
 */
const react_1 = require("react");
const prompt_store_1 = require("../../stores/prompt-store");
const PromptEditorPanel = () => {
    const { selectedPrompt, hasUnsavedChanges, isLoading, validationResults, savePrompt, resetPrompt, validatePrompt, updatePromptContent, exportPrompt, setEditingMode } = (0, prompt_store_1.usePromptStore)();
    const [currentContent, setCurrentContent] = (0, react_1.useState)('');
    const [showValidation, setShowValidation] = (0, react_1.useState)(false);
    const textareaRef = (0, react_1.useRef)(null);
    // Update content when selected prompt changes
    (0, react_1.useEffect)(() => {
        if (selectedPrompt) {
            const content = selectedPrompt.userModifiedContent || selectedPrompt.defaultContent;
            setCurrentContent(content);
            setEditingMode(false);
        }
        else {
            setCurrentContent('');
            setEditingMode(false);
        }
    }, [selectedPrompt, setEditingMode]);
    // Auto-resize textarea
    (0, react_1.useEffect)(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [currentContent]);
    const handleContentChange = (value) => {
        setCurrentContent(value);
        if (selectedPrompt) {
            updatePromptContent(selectedPrompt.id, value);
            setEditingMode(true);
        }
    };
    const handleSave = async () => {
        if (!selectedPrompt)
            return;
        try {
            await savePrompt(selectedPrompt.id, currentContent);
            setEditingMode(false);
        }
        catch (error) {
            console.error('Failed to save prompt:', error);
        }
    };
    const handleReset = async () => {
        if (!selectedPrompt)
            return;
        if (window.confirm('Reset this prompt to its default content? All changes will be lost.')) {
            try {
                await resetPrompt(selectedPrompt.id);
                setEditingMode(false);
            }
            catch (error) {
                console.error('Failed to reset prompt:', error);
            }
        }
    };
    const handleValidate = async () => {
        if (currentContent.trim()) {
            setShowValidation(true);
            await validatePrompt(currentContent);
        }
    };
    const handleExport = async () => {
        if (selectedPrompt) {
            await exportPrompt(selectedPrompt.id);
        }
    };
    const validation = selectedPrompt ? validationResults[selectedPrompt.id] : null;
    if (!selectedPrompt) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "h-full flex items-center justify-center text-gray-500 dark:text-gray-400", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83E\uDDE0" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-medium mb-2", children: "Select a Prompt" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: "Choose a prompt from the list to view and edit its content" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col bg-white dark:bg-gray-900", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg", children: selectedPrompt.category.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold text-gray-900 dark:text-white", children: selectedPrompt.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [selectedPrompt.agentModule, " \u2022 ", selectedPrompt.purpose] })] }), selectedPrompt.isModified && ((0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded", children: "Modified" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleValidate, className: "px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700", children: "Validate" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleExport, className: "px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700", children: "Export" }), selectedPrompt.isModified && ((0, jsx_runtime_1.jsx)("button", { onClick: handleReset, className: "px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20", children: "Reset" })), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, disabled: !hasUnsavedChanges || isLoading, className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Saving...' : 'Save' })] })] }), showValidation && validation && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3", children: [validation.errors.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-red-700 dark:text-red-300 mb-1", children: "Validation Errors:" }), validation.errors.map((error, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-red-600 dark:text-red-400", children: ["\u2022 ", error.message] }, index)))] })), validation.warnings.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1", children: "Validation Warnings:" }), validation.warnings.map((warning, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-yellow-600 dark:text-yellow-400", children: ["\u2022 ", warning.message] }, index)))] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Tokens: ~", validation.estimatedTokens] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Complexity: ", validation.complexity] }), (0, jsx_runtime_1.jsx)("span", { className: validation.isValid ? 'text-green-600' : 'text-red-600', children: validation.isValid ? '✓ Valid' : '✗ Invalid' })] })] }))] }), "      ", (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col overflow-hidden", children: (0, jsx_runtime_1.jsx)("textarea", { ref: textareaRef, value: currentContent, onChange: (e) => handleContentChange(e.target.value), placeholder: "Enter prompt content...", className: "flex-1 w-full p-4 border-none resize-none focus:outline-none \n                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white\n                     font-mono text-sm leading-relaxed", style: { minHeight: '400px' } }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-600 dark:text-gray-400", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Length: ", currentContent.length, " chars"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Lines: ", currentContent.split('\n').length] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Words: ", currentContent.trim().split(/\s+/).filter(w => w).length] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Last modified: ", selectedPrompt.lastModified.toLocaleDateString()] }), hasUnsavedChanges && ((0, jsx_runtime_1.jsx)("span", { className: "text-yellow-600 dark:text-yellow-400", children: "\u2022 Unsaved changes" }))] })] }) })] }));
};
exports.PromptEditorPanel = PromptEditorPanel;
//# sourceMappingURL=prompt-editor-panel.js.map