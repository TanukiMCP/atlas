"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Toolbar = ({ currentMode, onModeChange, onAtSymbolTrigger, operationalMode = 'agent', onOperationalModeChange, onEmergencyStop, onShowProcessingTier, onShowToolPanel, isProcessing = false }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px',
                            backgroundColor: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)'
                        }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onOperationalModeChange?.('agent'), className: `btn btn-sm ${operationalMode === 'agent' ? 'btn-primary' : ''}`, style: {
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }, title: "Agent Mode - Full autonomous execution with tools", children: "\uD83E\uDD16 Agent" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onOperationalModeChange?.('chat'), className: `btn btn-sm ${operationalMode === 'chat' ? 'btn-primary' : ''}`, style: {
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }, title: "Chat Mode - Conversational intelligence only", children: "\uD83D\uDCAC Chat" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onEmergencyStop, className: "btn btn-sm", style: {
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: isProcessing ? 'var(--color-error)' : 'var(--color-bg-tertiary)',
                            color: isProcessing ? 'white' : 'var(--color-text-muted)',
                            border: `1px solid ${isProcessing ? 'var(--color-error)' : 'var(--color-border)'}`,
                            animation: isProcessing ? 'pulse 2s infinite' : 'none'
                        }, title: "Emergency Stop - Halt all operations", children: ["\uD83D\uDED1 ", isProcessing ? 'STOP' : 'STOP'] }), (0, jsx_runtime_1.jsx)("button", { onClick: onAtSymbolTrigger, className: "btn btn-primary btn-sm", children: "@ Tools" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            fontSize: '13px',
                            color: 'var(--color-text-secondary)'
                        }, children: ["Subject: ", (0, jsx_runtime_1.jsx)("span", { style: {
                                    fontWeight: '500',
                                    color: 'var(--color-text-primary)'
                                }, children: currentMode }), (0, jsx_runtime_1.jsx)("span", { style: {
                                    margin: '0 8px',
                                    color: 'var(--color-border)'
                                }, children: "|" }), "Mode: ", (0, jsx_runtime_1.jsx)("span", { style: {
                                    fontWeight: '500',
                                    color: operationalMode === 'agent' ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
                                    textTransform: 'capitalize'
                                }, children: operationalMode })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: onShowProcessingTier, className: "btn btn-sm", style: { padding: '6px' }, title: "Processing Tier Indicator", children: "\uD83E\uDDE0" }), (0, jsx_runtime_1.jsx)("button", { onClick: onShowToolPanel, className: "btn btn-sm", style: { padding: '6px' }, title: "Tool Execution Panel", children: "\uD83D\uDEE0\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm", style: { padding: '6px' }, title: "Settings", children: "\u2699\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btn-sm", style: { padding: '6px' }, title: "Analytics", children: "\uD83D\uDCCA" })] })] }));
};
exports.Toolbar = Toolbar;
//# sourceMappingURL=toolbar.js.map