"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModeDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const select_1 = require("../ui/select");
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
    const currentModeData = SUBJECT_MODES.find(mode => mode.id === currentMode) || SUBJECT_MODES[0];
    const getModeColorClass = (color) => {
        const colorMap = {
            blue: 'text-blue-500',
            purple: 'text-purple-500',
            green: 'text-green-500',
            teal: 'text-teal-500',
            orange: 'text-orange-500',
            indigo: 'text-indigo-500',
            pink: 'text-pink-500',
            emerald: 'text-emerald-500',
            yellow: 'text-yellow-500',
            cyan: 'text-cyan-500'
        };
        return colorMap[color] || 'text-blue-500';
    };
    return ((0, jsx_runtime_1.jsxs)(select_1.Select, { value: currentMode, onValueChange: onModeChange, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: currentModeData.icon }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: currentModeData.name })] }) }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: SUBJECT_MODES.map((mode) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: mode.id, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 py-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: mode.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: `font-medium ${getModeColorClass(mode.color)}`, children: mode.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground line-clamp-1", children: mode.description })] })] }) }, mode.id))) })] }));
};
exports.SubjectModeDropdown = SubjectModeDropdown;
//# sourceMappingURL=subject-mode-dropdown.js.map