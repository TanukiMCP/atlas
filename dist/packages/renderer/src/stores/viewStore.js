"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViewStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useViewStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    // Initial state
    currentView: 'chat',
    isFileExplorerVisible: true,
    isFullscreen: false,
    subjectMode: 'general',
    agentMode: false,
    selectedFile: null,
    isProcessing: false,
    leftPanelWidth: 280,
    rightPanelWidth: 350,
    // Actions
    setView: (view) => set({ currentView: view }),
    toggleFileExplorer: () => set(state => ({ isFileExplorerVisible: !state.isFileExplorerVisible })),
    toggleFullscreen: () => {
        const newFullscreen = !get().isFullscreen;
        set({ isFullscreen: newFullscreen });
        // Actually toggle fullscreen
        if (newFullscreen) {
            document.documentElement.requestFullscreen?.();
        }
        else {
            document.exitFullscreen?.();
        }
    },
    setSubjectMode: (mode) => set({ subjectMode: mode }),
    setAgentMode: (enabled) => set({ agentMode: enabled }),
    setSelectedFile: (file) => set({ selectedFile: file }),
    setProcessing: (processing) => set({ isProcessing: processing }),
    setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
    setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
}), {
    name: 'tanuki-view-store',
    partialize: (state) => ({
        isFileExplorerVisible: state.isFileExplorerVisible,
        subjectMode: state.subjectMode,
        agentMode: state.agentMode,
        leftPanelWidth: state.leftPanelWidth,
        rightPanelWidth: state.rightPanelWidth,
    }),
}));
//# sourceMappingURL=viewStore.js.map