"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTracker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ProgressTracker = ({ isVisible, currentTier, overallProgress, tasks, qualityScore }) => {
    if (!isVisible)
        return null;
    const getTierIcon = (tier) => {
        switch (tier) {
            case 'ATOMIC': return '⚡';
            case 'MODERATE': return '🔧';
            case 'COMPLEX': return '🧠';
            case 'EXPERT': return '🎓';
            default: return '⚙️';
        }
    };
    const getTierColor = (tier) => {
        switch (tier) {
            case 'ATOMIC': return '#4CAF50';
            case 'MODERATE': return '#FF9800';
            case 'COMPLEX': return '#2196F3';
            case 'EXPERT': return '#9C27B0';
            default: return 'var(--color-accent)';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'active': return '▶️';
            case 'completed': return '✅';
            case 'failed': return '❌';
            default: return '⚪';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            position: 'fixed',
            top: '100px',
            right: '20px',
            width: '300px',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            overflow: 'hidden'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderBottom: '1px solid var(--color-border)'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-primary)'
                                }, children: "Processing Status" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 8px',
                                    backgroundColor: getTierColor(currentTier),
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }, children: [(0, jsx_runtime_1.jsx)("span", { children: getTierIcon(currentTier) }), (0, jsx_runtime_1.jsx)("span", { children: currentTier })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            marginBottom: '8px'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                            fontSize: '12px',
                                            color: 'var(--color-text-secondary)'
                                        }, children: "Overall Progress" }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: 'var(--color-text-primary)'
                                        }, children: [Math.round(overallProgress * 100), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    width: '100%',
                                    height: '6px',
                                    backgroundColor: 'var(--color-bg-quaternary)',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                        width: `${overallProgress * 100}%`,
                                        height: '100%',
                                        backgroundColor: 'var(--color-accent)',
                                        transition: 'width 0.3s ease'
                                    } }) })] }), qualityScore !== undefined && ((0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px'
                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: { color: 'var(--color-text-secondary)' }, children: "Quality Score" }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                    fontWeight: '500',
                                    color: qualityScore > 0.8 ? 'var(--color-success)' :
                                        qualityScore > 0.6 ? 'var(--color-warning)' : 'var(--color-error)'
                                }, children: [Math.round(qualityScore * 100), "%"] })] }))] }), (0, jsx_runtime_1.jsx)("div", { style: {
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px'
                }, children: tasks.map((task) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: task.status === 'active' ? 'var(--color-bg-tertiary)' : 'transparent',
                        marginBottom: '4px'
                    }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '14px' }, children: getStatusIcon(task.status) }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                        fontSize: '13px',
                                        fontWeight: task.status === 'active' ? '500' : '400',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: '2px'
                                    }, children: task.title }), task.status === 'active' && ((0, jsx_runtime_1.jsx)("div", { style: {
                                        width: '100%',
                                        height: '3px',
                                        backgroundColor: 'var(--color-bg-quaternary)',
                                        borderRadius: '1.5px',
                                        overflow: 'hidden'
                                    }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                            width: `${task.progress * 100}%`,
                                            height: '100%',
                                            backgroundColor: 'var(--color-accent)',
                                            transition: 'width 0.3s ease'
                                        } }) }))] })] }, task.id))) })] }));
};
exports.ProgressTracker = ProgressTracker;
//# sourceMappingURL=progress-tracker-old.js.map