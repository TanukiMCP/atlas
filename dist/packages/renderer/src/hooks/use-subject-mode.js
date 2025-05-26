"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubjectMode = void 0;
// Subject mode management hook for TanukiMCP Atlas
const react_1 = require("react");
const DEFAULT_MODES = [
    { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
    { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
    { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
    { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];
const useSubjectMode = () => {
    const [currentMode, setCurrentMode] = (0, react_1.useState)('general');
    const [availableModes] = (0, react_1.useState)(DEFAULT_MODES);
    const switchMode = (0, react_1.useCallback)((modeId) => {
        if (availableModes.find(mode => mode.id === modeId)) {
            setCurrentMode(modeId);
            // Here you could trigger mode-specific UI changes
            document.documentElement.setAttribute('data-subject-mode', modeId);
        }
    }, [availableModes]);
    const getCurrentModeConfig = (0, react_1.useCallback)(() => {
        return availableModes.find(mode => mode.id === currentMode);
    }, [currentMode, availableModes]);
    return {
        currentMode,
        availableModes,
        switchMode,
        getCurrentModeConfig
    };
};
exports.useSubjectMode = useSubjectMode;
//# sourceMappingURL=use-subject-mode.js.map