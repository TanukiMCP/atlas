"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleFileTree = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SimpleFileTree = ({ onFileSelect }) => {
    const mockFiles = [
        { name: 'src', type: 'directory', icon: '📁' },
        { name: 'public', type: 'directory', icon: '📁' },
        { name: 'package.json', type: 'file', icon: '⚙️' },
        { name: 'README.md', type: 'file', icon: '📝' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            height: '100%',
            backgroundColor: 'var(--color-bg-secondary)',
            display: 'flex',
            flexDirection: 'column'
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-primary)',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)'
                }, children: "\uD83D\uDCC1 File Explorer" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    flex: 1,
                    padding: '8px',
                    overflowY: 'auto'
                }, children: mockFiles.map((file, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        marginBottom: '2px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'background-color 0.15s ease'
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }, onClick: () => onFileSelect?.(file), children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px' }, children: file.icon }), (0, jsx_runtime_1.jsx)("span", { children: file.name })] }, index))) })] }));
};
exports.SimpleFileTree = SimpleFileTree;
//# sourceMappingURL=simple-file-tree.js.map