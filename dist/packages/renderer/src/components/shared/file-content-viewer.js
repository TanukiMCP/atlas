"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileContentViewer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const file_service_1 = require("../../services/file-service");
const dialog_1 = require("../ui/dialog");
const button_1 = require("../ui/button");
const badge_1 = require("../ui/badge");
const scroll_area_1 = require("../ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const FileContentViewer = ({ isVisible, selectedFile, onClose }) => {
    const [content, setContent] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (isVisible && selectedFile && selectedFile.type === 'file') {
            loadFileContent();
        }
    }, [isVisible, selectedFile]);
    const loadFileContent = async () => {
        if (!selectedFile)
            return;
        setLoading(true);
        setError(null);
        try {
            const fileContent = await file_service_1.fileService.readFile(selectedFile.path);
            setContent(fileContent);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load file content');
        }
        finally {
            setLoading(false);
        }
    };
    const getFileExtension = (filename) => {
        return filename.split('.').pop()?.toLowerCase() || '';
    };
    const getLanguageFromExtension = (ext) => {
        const langMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'json': 'json',
            'css': 'css',
            'scss': 'scss',
            'md': 'markdown',
            'html': 'html'
        };
        return langMap[ext] || 'text';
    };
    const copyToClipboard = async () => {
        if (content) {
            await navigator.clipboard.writeText(content);
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    if (!selectedFile)
        return null;
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: isVisible, onOpenChange: onClose, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl max-h-[80vh] p-0", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { className: "px-6 py-4 border-b", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [selectedFile.type === 'directory' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "h-5 w-5 text-blue-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: "h-5 w-5 text-gray-500" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { className: "text-lg font-semibold", children: selectedFile.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: selectedFile.type }), selectedFile.size && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: formatFileSize(selectedFile.size) })), selectedFile.type === 'file' && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: getLanguageFromExtension(getFileExtension(selectedFile.name)) }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [selectedFile.type === 'file' && content && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: copyToClipboard, className: "h-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4 mr-1" }), "Copy"] })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onClose, className: "h-8 w-8 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden", children: selectedFile.type === 'directory' ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "h-16 w-16 text-blue-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium mb-2", children: "Directory" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "This is a directory. Use the file tree to explore its contents." })] })) : loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Loading file content..." })] })) : error ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-500 mb-4", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium mb-2 text-red-600", children: "Error Loading File" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: error }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: loadFileContent, className: "mt-4", children: "Try Again" })] })) : ((0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-full", children: (0, jsx_runtime_1.jsx)("pre", { className: "p-6 text-sm font-mono whitespace-pre-wrap break-words", children: content || 'File is empty' }) })) })] }) }));
};
exports.FileContentViewer = FileContentViewer;
//# sourceMappingURL=file-content-viewer.js.map