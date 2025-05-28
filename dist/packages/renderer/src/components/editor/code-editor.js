"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const file_service_1 = require("../../services/file-service");
const button_1 = require("../ui/button");
const badge_1 = require("../ui/badge");
const lucide_react_1 = require("lucide-react");
const CodeEditor = ({ selectedFile, onClose, onSave }) => {
    const [content, setContent] = (0, react_1.useState)('');
    const [originalContent, setOriginalContent] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [isDirty, setIsDirty] = (0, react_1.useState)(false);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (selectedFile && selectedFile.type === 'file') {
            loadFileContent();
        }
    }, [selectedFile]);
    (0, react_1.useEffect)(() => {
        setIsDirty(content !== originalContent);
    }, [content, originalContent]);
    const loadFileContent = async () => {
        if (!selectedFile)
            return;
        setLoading(true);
        setError(null);
        try {
            const fileContent = await file_service_1.fileService.readFile(selectedFile.path);
            setContent(fileContent);
            setOriginalContent(fileContent);
            setIsDirty(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load file content');
            setContent('');
            setOriginalContent('');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!selectedFile || !isDirty)
            return;
        setSaving(true);
        try {
            await file_service_1.fileService.writeFile(selectedFile.path, content);
            setOriginalContent(content);
            setIsDirty(false);
            onSave?.(selectedFile.path, content);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save file');
        }
        finally {
            setSaving(false);
        }
    };
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };
    const getFileLanguage = (filename) => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        const languageMap = {
            'ts': 'typescript',
            'tsx': 'typescript',
            'js': 'javascript',
            'jsx': 'javascript',
            'json': 'json',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'less': 'less',
            'md': 'markdown',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'toml': 'toml',
            'ini': 'ini',
            'sh': 'shell',
            'bash': 'shell',
            'zsh': 'shell'
        };
        return languageMap[extension] || 'plaintext';
    };
    const formatFileSize = (size) => {
        if (size < 1024)
            return `${size} B`;
        if (size < 1024 * 1024)
            return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };
    if (!selectedFile) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex items-center justify-center text-gray-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-16 w-16 mx-auto mb-4 opacity-50" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg", children: "No file selected" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Select a file from the explorer to start editing" })] }) }));
    }
    if (selectedFile.type === 'folder') {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex items-center justify-center text-gray-500", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-16 w-16 mx-auto mb-4 opacity-50" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg", children: "Directory selected" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Select a file to view its contents" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col bg-white dark:bg-gray-900", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-blue-500" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-sm", children: selectedFile.name }), isDirty && (0, jsx_runtime_1.jsx)("span", { className: "text-orange-500 text-xs", children: "\u25CF" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: getFileLanguage(selectedFile.name) }), selectedFile.size && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: formatFileSize(selectedFile.size) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [isDirty && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: handleSave, disabled: saving, className: "h-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-3 w-3 mr-1" }), saving ? 'Saving...' : 'Save'] })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onClose, className: "h-8 w-8 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Loading file content..." })] }) })) : error ? ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-16 w-16 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium mb-2 text-red-600", children: "Error Loading File" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-4", children: error }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: loadFileContent, children: "Try Again" })] }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-4 bg-gray-900 text-white font-mono text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-green-400", children: "\uD83D\uDE80 Monaco Editor will be loaded here" }), (0, jsx_runtime_1.jsx)("pre", { className: "whitespace-pre-wrap", children: content })] })) })] }));
};
exports.CodeEditor = CodeEditor;
//# sourceMappingURL=code-editor.js.map