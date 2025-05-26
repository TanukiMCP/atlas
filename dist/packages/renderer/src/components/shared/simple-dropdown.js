"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SimpleDropdown = ({ label, items }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(!isOpen), style: {
                    padding: '6px 12px',
                    fontSize: '13px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                }, onMouseEnter: (e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)', onMouseLeave: (e) => e.target.style.backgroundColor = 'transparent', children: label }), isOpen && ((0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '4px',
                    width: '200px',
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    overflow: 'hidden'
                }, children: items.map((item, index) => item.type === 'separator' ? ((0, jsx_runtime_1.jsx)("div", { style: {
                        height: '1px',
                        backgroundColor: 'var(--color-border)',
                        margin: '4px 0'
                    } }, index)) : ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                        item.action?.();
                        setIsOpen(false);
                    }, style: {
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontSize: '13px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                    }, onMouseEnter: (e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)', onMouseLeave: (e) => e.target.style.backgroundColor = 'transparent', children: [(0, jsx_runtime_1.jsx)("span", { children: item.label }), item.shortcut && ((0, jsx_runtime_1.jsx)("span", { style: {
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)'
                            }, children: item.shortcut }))] }, index))) }))] }));
};
exports.SimpleDropdown = SimpleDropdown;
//# sourceMappingURL=simple-dropdown.js.map