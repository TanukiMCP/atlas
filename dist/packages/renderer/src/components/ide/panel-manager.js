"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PanelManager = ({ layout, onLayoutChange, panels }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "panel-manager flex h-full w-full", children: [layout.leftPanel.isVisible && ((0, jsx_runtime_1.jsxs)("div", { className: "panel border-r custom-scrollbar bg-color-bg-secondary", style: {
                    width: layout.leftPanel.width,
                    minWidth: layout.leftPanel.width
                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panel-header", children: (0, jsx_runtime_1.jsx)("div", { className: "panel-title", children: layout.leftPanel.activeTab === 'fileExplorer' ? 'File Explorer' : 'Panel' }) }), (0, jsx_runtime_1.jsx)("div", { className: "panel-content h-full overflow-y-auto", children: panels.fileExplorer })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col min-w-0 bg-color-bg-primary", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-grow min-h-0 overflow-y-auto", children: [panels.centerPanel, " "] }), layout.bottomPanel.isVisible && panels.bottomPanel && ((0, jsx_runtime_1.jsx)("div", { className: "panel border-t custom-scrollbar bg-color-bg-secondary flex-shrink-0", style: {
                            height: layout.bottomPanel.height,
                            minHeight: layout.bottomPanel.height
                        }, children: panels.bottomPanel }))] }), layout.rightPanel.isVisible && ((0, jsx_runtime_1.jsxs)("div", { className: "panel border-l custom-scrollbar bg-color-bg-secondary", style: {
                    width: layout.rightPanel.width,
                    minWidth: layout.rightPanel.width
                }, children: [(0, jsx_runtime_1.jsx)("div", { className: "panel-header", children: (0, jsx_runtime_1.jsx)("div", { className: "panel-title", children: layout.rightPanel.activeTab === 'workflowManager' ? 'Workflow Manager' : 'Panel' }) }), (0, jsx_runtime_1.jsx)("div", { className: "panel-content", children: panels.rightPanel })] }))] }));
};
exports.PanelManager = PanelManager;
//# sourceMappingURL=panel-manager.js.map