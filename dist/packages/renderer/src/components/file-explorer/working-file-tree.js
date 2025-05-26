"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingFileTree = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MOCK_FILE_STRUCTURE = [
    {
        name: 'src',
        type: 'directory',
        icon: '📁',
        children: [
            {
                name: 'components',
                type: 'directory',
                icon: '📁',
                children: [
                    { name: 'App.tsx', type: 'file', icon: '⚛️', size: '2.1KB' },
                    { name: 'Chat.tsx', type: 'file', icon: '⚛️', size: '4.5KB' }
                ]
            },
            { name: 'main.tsx', type: 'file', icon: '⚛️', size: '1.2KB' },
            { name: 'index.css', type: 'file', icon: '🎨', size: '3.4KB' }
        ]
    },
    {
        name: 'public',
        type: 'directory',
        icon: '📁',
        children: [
            { name: 'index.html', type: 'file', icon: '🌐', size: '0.8KB' }
        ]
    },
    { name: 'package.json', type: 'file', icon: '⚙️', size: '1.2KB' },
    { name: 'tsconfig.json', type: 'file', icon: '⚙️', size: '0.6KB' },
    { name: 'vite.config.ts', type: 'file', icon: '⚛️', size: '0.9KB' },
    { name: 'README.md', type: 'file', icon: '📝', size: '2.3KB' }
];
const WorkingFileTree = ({ onFileSelect }) => {
    const [expandedFolders, setExpandedFolders] = (0, react_1.useState)(new Set(['src']));
    const [selectedFile, setSelectedFile] = (0, react_1.useState)('src/App.tsx');
    const handleItemClick = (item, path) => {
        if (item.type === 'directory') {
            const newExpanded = new Set(expandedFolders);
            if (expandedFolders.has(path)) {
                newExpanded.delete(path);
            }
            else {
                newExpanded.add(path);
            }
            setExpandedFolders(newExpanded);
        }
        else {
            setSelectedFile(path);
            onFileSelect?.(item);
        }
    };
    const renderFileItem = (item, level = 0, parentPath = '') => {
        const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
        const isExpanded = expandedFolders.has(currentPath);
        const isSelected = selectedFile === currentPath;
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        paddingLeft: `${level * 20 + 12}px`,
                        cursor: 'pointer',
                        borderRadius: '4px',
                        margin: '1px 8px',
                        backgroundColor: isSelected ? '#2563eb' : 'transparent',
                        color: isSelected ? 'white' : 'inherit',
                        transition: 'all 0.15s ease',
                        fontSize: '13px'
                    }, onClick: () => handleItemClick(item, currentPath), onMouseEnter: (e) => {
                        if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                    }, onMouseLeave: (e) => {
                        if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }
                    }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px', minWidth: '16px' }, children: item.type === 'directory' ? (isExpanded ? '📂' : '📁') : item.icon }), (0, jsx_runtime_1.jsx)("span", { style: { flex: 1 }, children: item.name }), item.size && ((0, jsx_runtime_1.jsx)("span", { style: {
                                fontSize: '10px',
                                opacity: 0.7,
                                color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280'
                            }, children: item.size }))] }), item.type === 'directory' && isExpanded && item.children && ((0, jsx_runtime_1.jsx)("div", { children: item.children.map(child => renderFileItem(child, level + 1, currentPath)) }))] }, currentPath));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }, children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCC1" }), (0, jsx_runtime_1.jsx)("span", { children: "File Explorer" })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: '8px 0'
                }, children: MOCK_FILE_STRUCTURE.map(item => renderFileItem(item)) }), selectedFile && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '8px 12px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: '#f3f4f6',
                    fontSize: '11px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }, children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCE" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Selected: ", selectedFile] })] }))] }));
};
exports.WorkingFileTree = WorkingFileTree;
//# sourceMappingURL=working-file-tree.js.map