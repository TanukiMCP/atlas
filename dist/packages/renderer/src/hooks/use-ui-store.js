"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUIStore = void 0;
// UI state management hook for TanukiMCP Atlas
const react_1 = require("react");
const DEFAULT_LAYOUT = {
    leftPanel: {
        width: 300,
        isVisible: true,
        activeTab: 'fileExplorer'
    },
    rightPanel: {
        width: 400,
        isVisible: true,
        activeTab: 'workflowManager'
    },
    bottomPanel: {
        height: 200,
        isVisible: false,
        activeTab: 'terminal'
    }
};
const useUIStore = () => {
    const [layout, setLayout] = (0, react_1.useState)(DEFAULT_LAYOUT);
    const [theme, setTheme] = (0, react_1.useState)('light');
    const [isFullscreen, setIsFullscreen] = (0, react_1.useState)(false);
    const updateLayout = (0, react_1.useCallback)((newLayout) => {
        setLayout(prev => ({ ...prev, ...newLayout }));
    }, []);
    const togglePanel = (0, react_1.useCallback)((panel) => {
        setLayout(prev => ({
            ...prev,
            [panel]: {
                ...prev[panel],
                isVisible: !prev[panel].isVisible
            }
        }));
    }, []);
    return {
        layout,
        theme,
        isFullscreen,
        updateLayout,
        togglePanel,
        setTheme,
        setIsFullscreen
    };
};
exports.useUIStore = useUIStore;
//# sourceMappingURL=use-ui-store.js.map