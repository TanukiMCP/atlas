"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealFileTree = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const RealFileTree = ({ onFileSelect, rootPath = './src' }) => {
    const [expandedFolders, setExpandedFolders] = (0, react_1.useState)(new Set([rootPath]));
    const [selectedFile, setSelectedFile] = (0, react_1.useState)('');
    const [fileStructure, setFileStructure] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadFileStructure();
    }, [rootPath]);
    const loadFileStructure = async () => {
        setLoading(true);
        try {
            // For now, use a more realistic file structure
            // In a real implementation, this would call an API or file service
            const structure = [
                {
                    name: 'src',
                    type: 'directory',
                    path: 'src',
                    children: [
                        {
                            name: 'components',
                            type: 'directory',
                            path: 'src/components',
                            children: [
                                {
                                    name: 'editor',
                                    type: 'directory',
                                    path: 'src/components/editor',
                                    children: [
                                        { name: 'code-editor.tsx', type: 'file', path: 'src/components/editor/code-editor.tsx', size: 8542 }
                                    ]
                                },
                                {
                                    name: 'ide',
                                    type: 'directory',
                                    path: 'src/components/ide',
                                    children: [
                                        { name: 'ide-layout.tsx', type: 'file', path: 'src/components/ide/ide-layout.tsx', size: 12450 },
                                        { name: 'menu-bar.tsx', type: 'file', path: 'src/components/ide/menu-bar.tsx', size: 3200 },
                                        { name: 'toolbar.tsx', type: 'file', path: 'src/components/ide/toolbar.tsx', size: 2800 }
                                    ]
                                },
                                {
                                    name: 'file-explorer',
                                    type: 'directory',
                                    path: 'src/components/file-explorer',
                                    children: [
                                        { name: 'working-file-tree.tsx', type: 'file', path: 'src/components/file-explorer/working-file-tree.tsx', size: 4200 },
                                        { name: 'real-file-tree.tsx', type: 'file', path: 'src/components/file-explorer/real-file-tree.tsx', size: 3800 }
                                    ]
                                },
                                {
                                    name: 'chat',
                                    type: 'directory',
                                    path: 'src/components/chat',
                                    children: [
                                        { name: 'improved-chat-interface.tsx', type: 'file', path: 'src/components/chat/improved-chat-interface.tsx', size: 8900 }
                                    ]
                                }
                            ]
                        },
                        { name: 'App.tsx', type: 'file', path: 'src/App.tsx', size: 8542 },
                        { name: 'main.tsx', type: 'file', path: 'src/main.tsx', size: 1250 },
                        { name: 'index.css', type: 'file', path: 'src/index.css', size: 3400 }
                    ]
                },
                { name: 'package.json', type: 'file', path: 'package.json', size: 1200 },
                { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json', size: 600 },
                { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts', size: 900 },
                { name: 'README.md', type: 'file', path: 'README.md', size: 2300 }
            ];
            setFileStructure(structure);
        }
        catch (error) {
            console.error('Failed to load file structure:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleItemClick = (item) => {
        if (item.type === 'directory') {
            const newExpanded = new Set(expandedFolders);
            if (expandedFolders.has(item.path)) {
                newExpanded.delete(item.path);
            }
            else {
                newExpanded.add(item.path);
            }
            setExpandedFolders(newExpanded);
        }
        else {
            setSelectedFile(item.path);
            onFileSelect?.(item);
        }
    };
    const getFileIcon = (item) => {
        if (item.type === 'directory') {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "h-4 w-4 text-blue-500" });
        }
        const extension = item.name.split('.').pop()?.toLowerCase() || '';
        const iconColor = {
            'tsx': 'text-blue-400',
            'ts': 'text-blue-400',
            'jsx': 'text-blue-400',
            'js': 'text-yellow-400',
            'json': 'text-yellow-400',
            'css': 'text-pink-400',
            'html': 'text-orange-400',
            'md': 'text-gray-400'
        }[extension] || 'text-gray-400';
        return (0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: `h-4 w-4 ${iconColor}` });
    };
    const formatFileSize = (size) => {
        if (size < 1024)
            return `${size} B`;
        if (size < 1024 * 1024)
            return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };
    const renderFileItem = (item, level = 0) => {
        const isExpanded = expandedFolders.has(item.path);
        const isSelected = selectedFile === item.path;
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-2 py-1 px-2 cursor-pointer rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : ''}`, style: { paddingLeft: `${level * 16 + 8}px` }, onClick: () => handleItemClick(item), children: [item.type === 'directory' && (isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-3 w-3 text-gray-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-3 w-3 text-gray-500" }))), getFileIcon(item), (0, jsx_runtime_1.jsx)("span", { className: "flex-1 truncate", children: item.name }), item.type === 'file' && item.size && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: formatFileSize(item.size) }))] }), item.type === 'directory' && isExpanded && item.children && ((0, jsx_runtime_1.jsx)("div", { children: item.children.map(child => renderFileItem(child, level + 1)) }))] }, item.path));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 px-2", children: "\uD83D\uDCC1 File Explorer" }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-0.5", children: fileStructure.map(item => renderFileItem(item)) })] }));
};
exports.RealFileTree = RealFileTree;
//# sourceMappingURL=real-file-tree.js.map