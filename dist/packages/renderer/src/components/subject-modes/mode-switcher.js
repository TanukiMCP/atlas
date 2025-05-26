"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeSwitcher = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SUBJECT_MODES = [
    { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
    { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
    { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
    { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];
const ModeSwitcher = ({ currentMode, onModeChange }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mode-switcher", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-muted-foreground mr-2", children: "Subject Mode:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1.5 flex-wrap", children: SUBJECT_MODES.map(mode => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onModeChange(mode.id), className: `mode-button ${currentMode === mode.id ? 'active' : ''}`, children: [(0, jsx_runtime_1.jsx)("span", { children: mode.icon }), (0, jsx_runtime_1.jsx)("span", { children: mode.name })] }, mode.id))) })] }));
};
exports.ModeSwitcher = ModeSwitcher;
//# sourceMappingURL=mode-switcher.js.map