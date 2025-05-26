"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewMenuDemo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const view_menu_service_1 = require("../../services/view-menu-service");
/**
 * View Menu Demo Component
 * Demonstrates all the functionality of the View Menu Service
 */
const ViewMenuDemo = () => {
    const [viewState, setViewState] = (0, react_1.useState)();
    const [commandPaletteQuery, setCommandPaletteQuery] = (0, react_1.useState)('');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    // Update state every 500ms to show real-time status
    (0, react_1.useEffect)(() => {
        const updateState = () => {
            setViewState(view_menu_service_1.viewMenuService.getViewState());
        };
        updateState();
        const interval = setInterval(updateState, 500);
        return () => clearInterval(interval);
    }, []);
    // Update command palette search results when query changes
    (0, react_1.useEffect)(() => {
        if (commandPaletteQuery) {
            const results = view_menu_service_1.viewMenuService.searchCommands(commandPaletteQuery);
            setSearchResults(results);
        }
        else {
            setSearchResults(view_menu_service_1.viewMenuService.getCommandPaletteItems().slice(0, 10));
        }
    }, [commandPaletteQuery]);
    const handleCommandExecute = async (command) => {
        try {
            await command.action();
            setCommandPaletteQuery('');
        }
        catch (error) {
            console.error('Command execution failed:', error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: '1400px',
            margin: '0 auto'
        }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { color: '#7c3aed', marginBottom: '20px' }, children: "\uD83D\uDC41\uFE0F View Menu Service Demo" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDCF1 Panel Management" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '10px' }, children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleFileExplorer(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.fileExplorerVisible ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDCC1 File Explorer ", viewState?.fileExplorerVisible ? '(Visible)' : '(Hidden)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleChatHistory(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.chatHistoryVisible ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDCAC Chat History ", viewState?.chatHistoryVisible ? '(Visible)' : '(Hidden)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleTerminalPanel(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.terminalPanelVisible ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDCBB Terminal ", viewState?.terminalPanelVisible ? '(Visible)' : '(Hidden)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleOutputPanel(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.outputPanelVisible ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDCE4 Output ", viewState?.outputPanelVisible ? '(Visible)' : '(Hidden)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleProblemsPanel(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.problemsPanelVisible ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\u26A0\uFE0F Problems ", viewState?.problemsPanelVisible ? '(Visible)' : '(Hidden)'] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDDA5\uFE0F Layout & Display" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '10px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleFullscreen(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.isFullscreen ? '#dc2626' : '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: viewState?.isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Enter Fullscreen' }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.setLayoutMode('normal'), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: viewState?.layoutMode === 'normal' ? '#059669' : '#9ca3af',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }, children: "\uD83D\uDCC4 Normal" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.setLayoutMode('zen'), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: viewState?.layoutMode === 'zen' ? '#059669' : '#9ca3af',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }, children: "\uD83E\uDDD8 Zen" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.setLayoutMode('presentation'), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: viewState?.layoutMode === 'presentation' ? '#059669' : '#9ca3af',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }, children: "\uD83D\uDCFA Present" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.zoomOut(), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: '#f59e0b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }, children: "\uD83D\uDD0D Zoom -" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.resetZoom(), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: '#8b5cf6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px'
                                                    }, children: [Math.round((viewState?.currentZoom || 1) * 100), "%"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.zoomIn(), style: {
                                                        padding: '8px 12px',
                                                        backgroundColor: '#f59e0b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }, children: "\uD83D\uDD0D Zoom +" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83C\uDFA8 Theme & UI" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '10px' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleTheme(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.currentTheme === 'dark' ? '#1f2937' : '#f59e0b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: viewState?.currentTheme === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme' }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleCompactMode(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.compactMode ? '#059669' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDCF1 Compact Mode ", viewState?.compactMode ? '(On)' : '(Off)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleMinimap(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.showMinimap ? '#059669' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83D\uDDFA\uFE0F Minimap ", viewState?.showMinimap ? '(On)' : '(Off)'] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => view_menu_service_1.viewMenuService.toggleBreadcrumbs(), style: {
                                                padding: '10px 15px',
                                                backgroundColor: viewState?.showBreadcrumbs ? '#059669' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }, children: ["\uD83C\uDF5E Breadcrumbs ", viewState?.showBreadcrumbs ? '(On)' : '(Off)'] })] }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "\u2318 Command Palette Demo" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '16px'
                        }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '10px' }, children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search commands... (try 'zoom', 'theme', 'toggle')", value: commandPaletteQuery, onChange: (e) => setCommandPaletteQuery(e.target.value), style: {
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    } }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px'
                                }, children: searchResults.map((command, index) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => handleCommandExecute(command), style: {
                                        padding: '10px 12px',
                                        borderBottom: index < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        cursor: 'pointer',
                                        backgroundColor: 'white',
                                        ':hover': { backgroundColor: '#f9fafb' }
                                    }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f9fafb', onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'white', children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)("span", { children: command.icon }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 'medium' }, children: command.label }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '12px', color: '#6b7280' }, children: [command.category, command.shortcut && ((0, jsx_runtime_1.jsx)("span", { style: { marginLeft: '8px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }, children: command.shortcut }))] })] })] }) }, command.id))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px'
                }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0, color: '#334155' }, children: "\uD83D\uDCCA Current View State" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            fontSize: '14px'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Panel Visibility" }), (0, jsx_runtime_1.jsxs)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: [(0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCC1 File Explorer: ", viewState?.fileExplorerVisible ? '✅ Visible' : '❌ Hidden'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCAC Chat History: ", viewState?.chatHistoryVisible ? '✅ Visible' : '❌ Hidden'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCBB Terminal: ", viewState?.terminalPanelVisible ? '✅ Visible' : '❌ Hidden'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCE4 Output: ", viewState?.outputPanelVisible ? '✅ Visible' : '❌ Hidden'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\u26A0\uFE0F Problems: ", viewState?.problemsPanelVisible ? '✅ Visible' : '❌ Hidden'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Layout & Display" }), (0, jsx_runtime_1.jsxs)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: [(0, jsx_runtime_1.jsxs)("li", { children: ["\u26F6 Fullscreen: ", viewState?.isFullscreen ? '✅ On' : '❌ Off'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDD0D Zoom: ", Math.round((viewState?.currentZoom || 1) * 100), "%"] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCC4 Layout Mode: ", viewState?.layoutMode || 'normal'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\u2318 Command Palette: ", viewState?.commandPaletteOpen ? '✅ Open' : '❌ Closed'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Theme & UI Settings" }), (0, jsx_runtime_1.jsxs)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: [(0, jsx_runtime_1.jsxs)("li", { children: ["\uD83C\uDFA8 Theme: ", viewState?.currentTheme || 'dark'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDCF1 Compact Mode: ", viewState?.compactMode ? '✅ On' : '❌ Off'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDDFA\uFE0F Minimap: ", viewState?.showMinimap ? '✅ On' : '❌ Off'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83C\uDF5E Breadcrumbs: ", viewState?.showBreadcrumbs ? '✅ On' : '❌ Off'] }), (0, jsx_runtime_1.jsxs)("li", { children: ["\uD83D\uDD22 Line Numbers: ", viewState?.showLineNumbers ? '✅ On' : '❌ Off'] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '16px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83D\uDCA1 Pro Tip:" }), " All these controls are also accessible through the View menu in the toolbar and via keyboard shortcuts! The state is automatically persisted and restored between sessions."] })] })] }));
};
exports.ViewMenuDemo = ViewMenuDemo;
//# sourceMappingURL=view-menu-demo.js.map