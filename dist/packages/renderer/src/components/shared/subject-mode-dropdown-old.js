"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModeDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SUBJECT_MODES = [
    { id: 'general', name: 'General', icon: '🎯', color: 'blue', description: 'General purpose assistance and conversation' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple', description: 'Mathematical calculations, proofs, and analysis' },
    { id: 'programming', name: 'Programming', icon: '💻', color: 'green', description: 'Software development, coding, and technical tasks' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'teal', description: 'Scientific research, experiments, and analysis' },
    { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange', description: 'Language translation, learning, and linguistics' },
    { id: 'research', name: 'Research', icon: '📚', color: 'indigo', description: 'Academic research, literature review, and analysis' },
    { id: 'creative', name: 'Creative Writing', icon: '✍️', color: 'pink', description: 'Creative writing, storytelling, and content creation' },
    { id: 'business', name: 'Business Analysis', icon: '📊', color: 'emerald', description: 'Business strategy, analysis, and planning' },
    { id: 'education', name: 'Education', icon: '🎓', color: 'yellow', description: 'Teaching, learning, and educational content' },
    { id: 'data', name: 'Data Science', icon: '📈', color: 'cyan', description: 'Data analysis, visualization, and machine learning' }
];
const SubjectModeDropdown = ({ currentMode, onModeChange }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const dropdownRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    const currentModeData = SUBJECT_MODES.find(mode => mode.id === currentMode) || SUBJECT_MODES[0];
    const filteredModes = SUBJECT_MODES.filter(mode => mode.name.toLowerCase().includes(searchQuery.toLowerCase()));
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    (0, react_1.useEffect)(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (!isOpen)
                return;
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % filteredModes.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + filteredModes.length) % filteredModes.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredModes[selectedIndex]) {
                        onModeChange(filteredModes[selectedIndex].id);
                        setIsOpen(false);
                        setSearchQuery('');
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setSearchQuery('');
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredModes, selectedIndex, onModeChange]);
    const handleModeSelect = (mode) => {
        onModeChange(mode.id);
        setIsOpen(false);
        setSearchQuery('');
        setSelectedIndex(0);
    };
    const getModeColor = (color) => {
        const colors = {
            blue: '#3b82f6',
            purple: '#8b5cf6',
            green: '#10b981',
            teal: '#14b8a6',
            orange: '#f97316',
            indigo: '#6366f1',
            pink: '#ec4899',
            emerald: '#059669',
            yellow: '#eab308',
            cyan: '#06b6d4'
        };
        return colors[color] || '#3b82f6';
    };
    (0, react_1.useEffect)(() => {
        if (selectedIndex >= filteredModes.length && filteredModes.length > 0) {
            setSelectedIndex(filteredModes.length - 1);
        }
        else if (filteredModes.length === 0) {
            setSelectedIndex(0);
        }
    }, [filteredModes, selectedIndex]);
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, style: { position: 'relative' }, children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(!isOpen), style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minWidth: '180px',
                    fontSize: '13px',
                    fontWeight: '500'
                }, onMouseEnter: (e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)', onMouseLeave: (e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)', children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px' }, children: currentModeData.icon }), (0, jsx_runtime_1.jsx)("span", { style: {
                            color: 'var(--color-text-primary)',
                            flex: 1,
                            textAlign: 'left'
                        }, children: currentModeData.name }), (0, jsx_runtime_1.jsx)("span", { style: {
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease'
                        }, children: "\u25BC" })] }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    overflow: 'hidden'
                }, children: [(0, jsx_runtime_1.jsx)("div", { style: { padding: '12px' }, children: (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", placeholder: "Search subject modes...", value: searchQuery, onChange: (e) => {
                                setSearchQuery(e.target.value);
                                setSelectedIndex(0);
                            }, className: "input", style: {
                                width: '100%',
                                fontSize: '13px',
                                padding: '8px 12px'
                            } }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }, children: filteredModes.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { style: {
                                padding: '16px',
                                textAlign: 'center',
                                color: 'var(--color-text-muted)',
                                fontSize: '13px'
                            }, children: ["No modes found matching \"", searchQuery, "\""] })) : (filteredModes.map((mode, index) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => handleModeSelect(mode), style: {
                                padding: '12px 16px',
                                cursor: 'pointer',
                                backgroundColor: index === selectedIndex
                                    ? 'var(--color-accent)'
                                    : mode.id === currentMode
                                        ? `${getModeColor(mode.color)}20`
                                        : 'transparent',
                                borderLeft: mode.id === currentMode
                                    ? `3px solid ${getModeColor(mode.color)}`
                                    : index === selectedIndex
                                        ? '3px solid var(--color-accent)'
                                        : '3px solid transparent',
                                transition: 'all 0.15s ease',
                            }, onMouseEnter: (e) => {
                                setSelectedIndex(index);
                                e.target.style.backgroundColor = index === selectedIndex
                                    ? 'var(--color-accent)'
                                    : 'var(--color-bg-tertiary)';
                            }, onMouseLeave: (e) => {
                                e.target.style.backgroundColor = index === selectedIndex
                                    ? 'var(--color-accent)'
                                    : mode.id === currentMode
                                        ? `${getModeColor(mode.color)}20`
                                        : 'transparent';
                            }, tabIndex: 0, onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleModeSelect(mode);
                                }
                            }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '4px'
                                }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '16px' }, children: mode.icon }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: index === selectedIndex
                                                        ? 'white'
                                                        : mode.id === currentMode
                                                            ? getModeColor(mode.color)
                                                            : 'var(--color-text-primary)'
                                                }, children: mode.name }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                    fontSize: '11px',
                                                    color: index === selectedIndex
                                                        ? 'rgba(255, 255, 255, 0.8)'
                                                        : 'var(--color-text-muted)',
                                                    lineHeight: '1.3'
                                                }, children: mode.description })] }), mode.id === currentMode && ((0, jsx_runtime_1.jsx)("div", { style: {
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: getModeColor(mode.color)
                                        } }))] }) }, mode.id)))) }), (0, jsx_runtime_1.jsx)("div", { style: {
                            padding: '8px 12px',
                            borderTop: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            textAlign: 'center'
                        }, children: "Use \u2191\u2193 arrows to navigate, Enter to select, Esc to close" })] }))] }));
};
exports.SubjectModeDropdown = SubjectModeDropdown;
//# sourceMappingURL=subject-mode-dropdown-old.js.map