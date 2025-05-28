"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealFileTree = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const RealFileTree = ({ onFileSelect }) => {
    const [expandedFolders, setExpandedFolders] = (0, react_1.useState)(new Set(['src', 'components']));
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    // Mock file tree structure
    const fileTree = [
        {
            name: 'src',
            type: 'folder',
            path: 'src',
            children: [
                { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
                { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
                { name: 'index.css', type: 'file', path: 'src/index.css' },
                {
                    name: 'components',
                    type: 'folder',
                    path: 'src/components',
                    children: [
                        {
                            name: 'editor',
                            type: 'folder',
                            path: 'src/components/editor',
                            children: [
                                { name: 'CodeEditor.tsx', type: 'file', path: 'src/components/editor/CodeEditor.tsx' }
                            ]
                        },
                        {
                            name: 'chat',
                            type: 'folder',
                            path: 'src/components/chat',
                            children: [
                                { name: 'EnhancedChatInterface.tsx', type: 'file', path: 'src/components/chat/EnhancedChatInterface.tsx' }
                            ]
                        },
                        {
                            name: 'toolbar',
                            type: 'folder',
                            path: 'src/components/toolbar',
                            children: [
                                { name: 'PrimaryMenuBar.tsx', type: 'file', path: 'src/components/toolbar/PrimaryMenuBar.tsx' },
                                { name: 'ContextualToolbar.tsx', type: 'file', path: 'src/components/toolbar/ContextualToolbar.tsx' }
                            ]
                        }
                    ]
                },
                {
                    name: 'services',
                    type: 'folder',
                    path: 'src/services',
                    children: [
                        { name: 'ollama-service.ts', type: 'file', path: 'src/services/ollama-service.ts' },
                        { name: 'enhanced-chat-service.ts', type: 'file', path: 'src/services/enhanced-chat-service.ts' },
                        { name: 'mcp-client.ts', type: 'file', path: 'src/services/mcp-client.ts' }
                    ]
                }
            ]
        },
        {
            name: 'docs',
            type: 'folder',
            path: 'docs',
            children: [
                { name: 'README.md', type: 'file', path: 'docs/README.md' },
                { name: 'ui-wireframes-detailed.md', type: 'file', path: 'docs/ui-wireframes-detailed.md' }
            ]
        }
    ];
    const toggleFolder = (path) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        }
        else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };
    const handleFileClick = (node) => {
        if (node.type === 'file') {
            setSelectedFile(node.name);
            onFileSelect(node.name);
        }
        else {
            toggleFolder(node.path);
        }
    };
    const renderNode = (node, depth = 0) => {
        const isExpanded = expandedFolders.has(node.path);
        const isSelected = selectedFile === node.name;
        const paddingLeft = depth * 16 + 8;
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/20 text-primary' : ''}`, style: { paddingLeft }, onClick: () => handleFileClick(node), children: [node.type === 'folder' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-4 h-4" })), isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4 text-blue-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "w-4 h-4 text-blue-500" }))] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4" }), " ", (0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: "w-4 h-4 text-gray-500" })] })), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: node.name })] }), node.type === 'folder' && isExpanded && node.children && ((0, jsx_runtime_1.jsx)("div", { children: node.children.map(child => renderNode(child, depth + 1)) }))] }, node.path));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full bg-background border-r border-border", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-border", children: (0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "w-4 h-4" }), "File Explorer"] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-2", children: fileTree.map(node => renderNode(node)) })] }));
};
exports.RealFileTree = RealFileTree;
//# sourceMappingURL=RealFileTree.js.map