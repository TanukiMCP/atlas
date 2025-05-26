"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExplorer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const file_service_1 = require("../../services/file-service");
const FileExplorer = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = (0, react_1.useState)('src/App.tsx');
    const [expandedFolders, setExpandedFolders] = (0, react_1.useState)(new Set(['src', 'src/components']));
    const [fileStructure, setFileStructure] = (0, react_1.useState)([]);
    const [loadedDirectories, setLoadedDirectories] = (0, react_1.useState)(new Map());
    // Load root directory on mount
    (0, react_1.useEffect)(() => {
        loadDirectory('');
    }, []);
    const loadDirectory = async (path) => {
        try {
            const files = await file_service_1.fileService.listDirectory(path);
            if (path === '') {
                setFileStructure(files);
            }
            setLoadedDirectories(prev => new Map(prev).set(path, files));
        }
        catch (error) {
            console.error('Failed to load directory:', error);
        }
    };
    const handleFileClick = async (item) => {
        if (item.type === 'file') {
            setSelectedFile(item.path);
            onFileSelect?.(item);
            console.log('File selected:', item.path);
        }
        else {
            // Toggle folder expansion
            const newExpanded = new Set(expandedFolders);
            if (expandedFolders.has(item.path)) {
                newExpanded.delete(item.path);
            }
            else {
                newExpanded.add(item.path);
                // Load directory contents if not already loaded
                if (!loadedDirectories.has(item.path)) {
                    await loadDirectory(item.path);
                }
            }
            setExpandedFolders(newExpanded);
        }
    };
    const getFileIcon = (item) => {
        if (item.type === 'directory') {
            return expandedFolders.has(item.path) ? '📂' : '📁';
        }
        if (item.extension === 'tsx' || item.extension === 'ts')
            return '⚛️';
        if (item.extension === 'json')
            return '⚙️';
        if (item.extension === 'md')
            return '📝';
        if (item.extension === 'css')
            return '🎨';
        return '📄';
    };
    const renderFileItem = (item, level = 0) => {
        const isSelected = selectedFile === item.path;
        const isExpanded = expandedFolders.has(item.path);
        const children = loadedDirectories.get(item.path) || [];
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `file-item ${item.type} ${isSelected ? 'selected' : ''}`, style: { paddingLeft: `${level * 24 + 12}px` }, onClick: () => handleFileClick(item), children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                fontSize: '14px',
                                color: item.type === 'directory'
                                    ? 'var(--color-accent-secondary)'
                                    : item.extension === 'tsx' || item.extension === 'ts'
                                        ? 'var(--color-accent)'
                                        : 'var(--color-text-muted)'
                            }, children: getFileIcon(item) }), (0, jsx_runtime_1.jsx)("span", { children: item.name }), item.type === 'file' && item.size && ((0, jsx_runtime_1.jsxs)("span", { style: {
                                fontSize: '10px',
                                color: 'var(--color-text-muted)',
                                marginLeft: 'auto',
                                opacity: 0.7
                            }, children: [(item.size / 1024).toFixed(1), "KB"] }))] }), item.type === 'directory' && isExpanded && children.length > 0 && ((0, jsx_runtime_1.jsx)("div", { children: children.map(child => renderFileItem(child, level + 1)) }))] }, item.path));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "file-explorer", children: [(0, jsx_runtime_1.jsx)("div", { className: "file-tree custom-scrollbar", children: fileStructure.map(item => renderFileItem(item)) }), selectedFile && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '12px',
                    borderTop: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                }, children: ["Selected: ", selectedFile] }))] }));
};
exports.FileExplorer = FileExplorer;
//# sourceMappingURL=file-tree.js.map