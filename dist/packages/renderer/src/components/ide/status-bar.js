"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const llm_status_1 = require("../llm/llm-status");
const mcp_store_1 = require("../../stores/mcp-store");
const StatusBar = ({ currentMode, connectionStatus, activeTools, workflowExecutionService }) => {
    const { servers, connectedServers } = (0, mcp_store_1.useMCPStore)();
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: connectionStatus === 'connected' ? 'var(--color-success)' : 'var(--color-error)'
                                } }), (0, jsx_runtime_1.jsx)("span", { children: connectionStatus })] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Mode: ", currentMode] }), (0, jsx_runtime_1.jsxs)("div", { children: ["MCP Servers: ", connectedServers.size, "/", servers.length] }), activeTools.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: ["Active Tools: ", activeTools.join(', ')] }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsx)(llm_status_1.LLMStatus, {}), (0, jsx_runtime_1.jsx)("div", { children: "Ready" }), (0, jsx_runtime_1.jsx)("div", { children: "Line 1, Col 1" }), (0, jsx_runtime_1.jsx)("div", { children: "UTF-8" })] })] }));
};
exports.StatusBar = StatusBar;
//# sourceMappingURL=status-bar.js.map