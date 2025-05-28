"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExplorerPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("../ui/button");
const lucide_react_1 = require("lucide-react");
const FileExplorerPanel = ({ onFileSelect, onViewChange }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [fileTree, setFileTree] = (0, react_1.useState)([
        {
            name: 'src',
            type: 'folder',
            path: '/src',
            expanded: true,
            children: [
                {
                    name: 'components',
                    type: 'folder',
                    path: '/src/components',
                    expanded: true,
                    children: [
                        { name: 'App.tsx', type: 'file', path: '/src/components/App.tsx' },
                        { name: 'chat', type: 'folder', path: '/src/components/chat', children: [] },
                        { name: 'ui', type: 'folder', path: '/src/components/ui', children: [] }
                    ]
                },
                { name: 'main.tsx', type: 'file', path: '/src/main.tsx' },
                { name: 'index.css', type: 'file', path: '/src/index.css' }
            ]
        },
        {
            name: 'package.json',
            type: 'file',
            path: '/package.json'
        },
        {
            name: 'README.md',
            type: 'file',
            path: '/README.md'
        }
    ]);
    const toggleFolder = (path) => {
        const updateNode = (nodes) => {
            return nodes.map(node => {
                if (node.path === path && node.type === 'folder') {
                    return { ...node, expanded: !node.expanded };
                }
                if (node.children) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
        };
        setFileTree(updateNode(fileTree));
    };
    const renderFileNode = (node, depth = 0) => {
        const indent = depth * 16;
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer rounded text-sm`, style: { paddingLeft: `${8 + indent}px` }, onClick: () => {
                        if (node.type === 'folder') {
                            toggleFolder(node.path);
                        }
                        else {
                            onFileSelect(node.path);
                        }
                    }, children: [node.type === 'folder' ? (node.expanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4 text-blue-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "w-4 h-4 text-blue-500" }))) : ((0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: "w-4 h-4 text-muted-foreground" })), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: node.name })] }), node.type === 'folder' && node.expanded && node.children && ((0, jsx_runtime_1.jsx)("div", { children: node.children.map(child => renderFileNode(child, depth + 1)) }))] }, node.path));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-border", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-sm", children: "Explorer" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "w-3 h-3" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search files...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-7 pr-2 py-1 text-xs bg-muted/30 border border-border rounded focus:outline-none focus:border-primary" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-2", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: fileTree
                        .filter(node => searchTerm === '' ||
                        node.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(node => renderFileNode(node)) }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 border-t border-border", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "text-xs", onClick: () => onViewChange('editor'), children: "New File" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "text-xs", onClick: () => onViewChange('settings'), children: "Settings" })] }) })] }));
};
exports.FileExplorerPanel = FileExplorerPanel;
//# sourceMappingURL=FileExplorerPanel.js.map