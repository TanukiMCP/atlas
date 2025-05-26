"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMenuDemo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const edit_menu_service_1 = require("../../services/edit-menu-service");
/**
 * Edit Menu Demo Component
 * Demonstrates all the functionality of the Edit Menu Service
 */
const EditMenuDemo = () => {
    const [editState, setEditState] = (0, react_1.useState)();
    const [searchState, setSearchState] = (0, react_1.useState)();
    const [textContent, setTextContent] = (0, react_1.useState)(`
Welcome to the TanukiMCP Atlas Edit Menu Demo!

This demo showcases the comprehensive Edit functionality:

1. Undo/Redo Operations
   - Full state tracking
   - Unlimited undo history (up to 100 actions)
   - Smart action grouping

2. Clipboard Operations  
   - Cut, Copy, Paste with modern clipboard API
   - Automatic text selection detection
   - Context-aware paste operations

3. Search and Replace
   - Regular expression support
   - Case-sensitive options
   - Find next/previous navigation
   - Replace one or replace all

4. Text Selection
   - Select All functionality
   - Smart context detection
   - Multiple element support

Try editing this text and using the Edit menu functions!
You can also use keyboard shortcuts:
- Ctrl+Z: Undo
- Ctrl+Y: Redo  
- Ctrl+X: Cut
- Ctrl+C: Copy
- Ctrl+V: Paste
- Ctrl+A: Select All
- Ctrl+F: Find
- Ctrl+H: Replace
  `);
    // Update state every 500ms to show real-time status
    (0, react_1.useEffect)(() => {
        const updateState = () => {
            setEditState(edit_menu_service_1.editMenuService.getEditState());
            setSearchState(edit_menu_service_1.editMenuService.getSearchState());
        };
        updateState();
        const interval = setInterval(updateState, 500);
        return () => clearInterval(interval);
    }, []);
    const handleSearch = async () => {
        const term = prompt('Search for:');
        if (term) {
            await edit_menu_service_1.editMenuService.search(term, { matchCase: false, useRegex: false });
        }
    };
    const handleReplaceAll = async () => {
        const searchTerm = prompt('Find:');
        if (searchTerm) {
            const replaceTerm = prompt('Replace with:') || '';
            await edit_menu_service_1.editMenuService.search(searchTerm, { matchCase: false, useRegex: false });
            await edit_menu_service_1.editMenuService.replaceAll(replaceTerm);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto'
        }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { color: '#2563eb', marginBottom: '20px' }, children: "\uD83E\uDDE0 Edit Menu Service Demo" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '20px',
                    marginBottom: '20px'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDCDD Interactive Text Editor" }), (0, jsx_runtime_1.jsx)("textarea", { value: textContent, onChange: (e) => setTextContent(e.target.value), style: {
                                    width: '100%',
                                    height: '400px',
                                    padding: '12px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Roboto Mono", monospace',
                                    resize: 'vertical'
                                }, placeholder: "Start typing here or paste some text to test the Edit functionality..." }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.undo(), disabled: !editState?.canUndo, style: {
                                            padding: '8px 16px',
                                            backgroundColor: editState?.canUndo ? '#3b82f6' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: editState?.canUndo ? 'pointer' : 'not-allowed'
                                        }, children: "\u21B6 Undo" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.redo(), disabled: !editState?.canRedo, style: {
                                            padding: '8px 16px',
                                            backgroundColor: editState?.canRedo ? '#3b82f6' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: editState?.canRedo ? 'pointer' : 'not-allowed'
                                        }, children: "\u21B7 Redo" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.cut(), disabled: !editState?.canCut, style: {
                                            padding: '8px 16px',
                                            backgroundColor: editState?.canCut ? '#dc2626' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: editState?.canCut ? 'pointer' : 'not-allowed'
                                        }, children: "\u2702\uFE0F Cut" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.copy(), disabled: !editState?.canCopy, style: {
                                            padding: '8px 16px',
                                            backgroundColor: editState?.canCopy ? '#059669' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: editState?.canCopy ? 'pointer' : 'not-allowed'
                                        }, children: "\uD83D\uDCCB Copy" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.paste(), disabled: !editState?.canPaste, style: {
                                            padding: '8px 16px',
                                            backgroundColor: editState?.canPaste ? '#7c3aed' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: editState?.canPaste ? 'pointer' : 'not-allowed'
                                        }, children: "\uD83D\uDCCC Paste" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.selectAll(), style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }, children: "\uD83D\uDD18 Select All" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSearch, style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#16a34a',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }, children: "\uD83D\uDD0D Search" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleReplaceAll, style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#ea580c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }, children: "\uD83D\uDD04 Replace All" }), searchState?.searchResults && searchState.searchResults.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.findNext(), style: {
                                                    padding: '8px 16px',
                                                    backgroundColor: '#0ea5e9',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }, children: "\u2B07\uFE0F Find Next" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => edit_menu_service_1.editMenuService.findPrevious(), style: {
                                                    padding: '8px 16px',
                                                    backgroundColor: '#0ea5e9',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }, children: "\u2B06\uFE0F Find Previous" })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDCCA Edit State Status" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    fontSize: '14px'
                                }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { marginTop: 0, color: '#475569' }, children: "Current Capabilities:" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '8px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Can Undo:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.canUndo ? '#059669' : '#dc2626' }, children: editState?.canUndo ? '✅ Yes' : '❌ No' })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Can Redo:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.canRedo ? '#059669' : '#dc2626' }, children: editState?.canRedo ? '✅ Yes' : '❌ No' })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Can Cut:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.canCut ? '#059669' : '#dc2626' }, children: editState?.canCut ? '✅ Yes' : '❌ No' })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Can Copy:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.canCopy ? '#059669' : '#dc2626' }, children: editState?.canCopy ? '✅ Yes' : '❌ No' })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Can Paste:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.canPaste ? '#059669' : '#dc2626' }, children: editState?.canPaste ? '✅ Yes' : '❌ No' })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Has Selection:" }), (0, jsx_runtime_1.jsx)("span", { style: { color: editState?.hasSelection ? '#059669' : '#dc2626' }, children: editState?.hasSelection ? '✅ Yes' : '❌ No' })] })] }), editState?.selectedText && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '12px' }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { margin: '0 0 8px 0', color: '#475569' }, children: "Selected Text:" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                                    backgroundColor: '#fef3c7',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '12px',
                                                    maxHeight: '60px',
                                                    overflow: 'auto'
                                                }, children: ["\"", editState.selectedText, "\""] })] })), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '12px' }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { margin: '0 0 8px 0', color: '#475569' }, children: "Stack Sizes:" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Undo Stack:" }), (0, jsx_runtime_1.jsx)("span", { children: edit_menu_service_1.editMenuService.getUndoStackSize() })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)("span", { children: "Redo Stack:" }), (0, jsx_runtime_1.jsx)("span", { children: edit_menu_service_1.editMenuService.getRedoStackSize() })] })] })] }), searchState?.searchResults && searchState.searchResults.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    backgroundColor: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginTop: '16px',
                                    fontSize: '14px'
                                }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { marginTop: 0, color: '#047857' }, children: "\uD83D\uDD0D Search Results:" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Found ", searchState.searchResults.length, " matches for \"", searchState.searchTerm, "\""] }), searchState.currentResultIndex >= 0 && ((0, jsx_runtime_1.jsxs)("p", { children: ["Currently viewing result ", searchState.currentResultIndex + 1, " of ", searchState.searchResults.length] }))] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '20px'
                }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0, color: '#334155' }, children: "\uD83C\uDFAF How to Test the Edit Menu" }), (0, jsx_runtime_1.jsxs)("ol", { style: { paddingLeft: '20px', lineHeight: '1.6' }, children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Text Editing:" }), " Type in the textarea above and use Ctrl+Z/Ctrl+Y to undo/redo"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Selection:" }), " Select some text to enable Cut/Copy operations"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Clipboard:" }), " Cut or copy text, then paste it elsewhere"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Search:" }), " Click the Search button to find text within the content"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Replace:" }), " Use Replace All to substitute text throughout the document"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Keyboard Shortcuts:" }), " All standard shortcuts work (Ctrl+Z, Ctrl+C, etc.)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Real-time Status:" }), " Watch the status panel update as you interact with the text"] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '16px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83D\uDCA1 Pro Tip:" }), " The Edit Menu Service integrates seamlessly with the main application toolbar. All these functions are also available through the Edit menu in the top menubar!"] })] })] }));
};
exports.EditMenuDemo = EditMenuDemo;
//# sourceMappingURL=edit-menu-demo.js.map