"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutionPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const mcp_service_1 = require("../../services/mcp-service");
const ToolExecutionPanel = ({ isVisible, onClose }) => {
    const [executionHistory, setExecutionHistory] = (0, react_1.useState)([]);
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    const executeToolWithParameters = async (context) => {
        setIsExecuting(true);
        try {
            const result = await mcp_service_1.mcpService.executeTool(context);
            setExecutionHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
        }
        catch (error) {
            console.error('Tool execution failed:', error);
        }
        finally {
            setIsExecuting(false);
        }
    };
    const clearHistory = () => {
        setExecutionHistory([]);
    };
    const getStatusColor = (success) => {
        return success ? 'var(--color-success)' : 'var(--color-error)';
    };
    const formatResult = (result) => {
        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2);
        }
        return String(result);
    };
    if (!isVisible)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-bg-primary)'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '16px' }, children: "\uD83D\uDEE0\uFE0F" }), (0, jsx_runtime_1.jsx)("h3", { style: {
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    margin: 0,
                                    color: 'var(--color-text-primary)'
                                }, children: "Tool Execution Results" }), isExecuting && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: 'var(--color-accent)'
                                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            width: '12px',
                                            height: '12px',
                                            border: '2px solid var(--color-accent)',
                                            borderTop: '2px solid transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        } }), "Executing..."] }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '8px' }, children: [executionHistory.length > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: clearHistory, className: "btn btn-sm", style: { fontSize: '12px', padding: '4px 8px' }, children: "Clear" })), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, style: {
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-muted)'
                                }, children: "\u00D7" })] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px'
                }, children: executionHistory.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { style: {
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: '14px',
                        marginTop: '40px'
                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '48px', marginBottom: '16px' }, children: "\uD83D\uDEE0\uFE0F" }), (0, jsx_runtime_1.jsx)("div", { children: "No tool executions yet" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', marginTop: '8px' }, children: "Use the @ symbol in chat to select and execute tools" })] })) : ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: executionHistory.map((result, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-bg-secondary)'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                    padding: '12px 16px',
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderBottom: '1px solid var(--color-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: getStatusColor(result.success)
                                                } }), (0, jsx_runtime_1.jsx)("span", { style: {
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    color: 'var(--color-text-primary)'
                                                }, children: result.toolName }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                                    fontSize: '11px',
                                                    color: 'var(--color-text-muted)',
                                                    backgroundColor: 'var(--color-bg-quaternary)',
                                                    padding: '2px 6px',
                                                    borderRadius: 'var(--radius-sm)'
                                                }, children: [result.executionTime, "ms"] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '11px',
                                            color: 'var(--color-text-muted)'
                                        }, children: result.timestamp.toLocaleTimeString() })] }), (0, jsx_runtime_1.jsx)("div", { style: { padding: '16px' }, children: result.success ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                color: 'var(--color-text-secondary)',
                                                marginBottom: '8px'
                                            }, children: "Result:" }), (0, jsx_runtime_1.jsx)("pre", { style: {
                                                backgroundColor: 'var(--color-bg-primary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '12px',
                                                fontSize: '12px',
                                                fontFamily: 'Monaco, Menlo, monospace',
                                                overflow: 'auto',
                                                margin: 0,
                                                color: 'var(--color-text-primary)',
                                                lineHeight: '1.4'
                                            }, children: formatResult(result.result) })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                color: 'var(--color-error)',
                                                marginBottom: '8px'
                                            }, children: "Error:" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid var(--color-error)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '12px',
                                                fontSize: '13px',
                                                color: 'var(--color-error)'
                                            }, children: result.error })] })) })] }, index))) })) })] }));
};
exports.ToolExecutionPanel = ToolExecutionPanel;
//# sourceMappingURL=tool-execution-panel.js.map