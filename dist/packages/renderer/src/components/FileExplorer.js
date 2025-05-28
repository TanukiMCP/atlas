"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const FileExplorer = ({ files, onFileSelect }) => {
    const getFileIcon = (item) => {
        if (item.type === 'folder') {
            return '📁';
        }
        // File type icons based on extension
        const extension = item.name.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'json':
                return '📄';
            case 'tsx':
            case 'ts':
                return '📄';
            case 'js':
            case 'jsx':
                return '📄';
            case 'css':
                return '🎨';
            case 'md':
                return '📝';
            default:
                return '📄';
        }
    };
    const renderFileItem = (item, depth = 0) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `p-2 hover:bg-accent/50 rounded cursor-pointer text-sm transition-colors ${depth > 0 ? `ml-${depth * 4}` : ''}`, onClick: () => onFileSelect?.(item), style: { marginLeft: depth * 16 }, children: [getFileIcon(item), " ", item.name] }), item.children && item.children.map(child => renderFileItem(child, depth + 1))] }, item.path));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-64 bg-card/30 border-r border-border p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold mb-4 text-muted-foreground", children: "\uD83D\uDCC1 Explorer" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: files.length > 0 ? (files.map(file => renderFileItem(file))) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-center text-muted-foreground text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2", children: "\uD83D\uDCC1" }), (0, jsx_runtime_1.jsx)("div", { children: "No project loaded" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs mt-1", children: "Open a folder to explore files" })] })) })] }));
};
exports.default = FileExplorer;
//# sourceMappingURL=FileExplorer.js.map