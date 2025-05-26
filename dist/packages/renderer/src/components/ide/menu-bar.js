"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const menu_dropdown_1 = require("../shared/menu-dropdown");
const subject_mode_dropdown_1 = require("../shared/subject-mode-dropdown");
const app_store_1 = require("../../stores/app-store");
const file_menu_service_1 = require("../../services/file-menu-service");
const edit_menu_service_1 = require("../../services/edit-menu-service");
const view_menu_service_1 = require("../../services/view-menu-service");
const navigation_menu_1 = require("../ui/navigation-menu");
const MenuBar = ({ onNewChat, onOpenProject, onSaveChat, onSubjectModeChange, currentMode, onOpenMCPManager, onOpenLLMPromptManagement, onNavigate }) => {
    const { theme, setTheme } = (0, app_store_1.useAppStore)();
    // File Menu Actions - Production Quality Implementation
    const handleNewChat = async () => {
        try {
            const newSession = await file_menu_service_1.fileMenuService.newChat();
            onNewChat(); // Call parent callback
            console.log('New chat created:', newSession);
        }
        catch (error) {
            console.error('Failed to create new chat:', error);
        }
    };
    const handleOpenProject = async () => {
        try {
            const project = await file_menu_service_1.fileMenuService.openProject();
            if (project) {
                onOpenProject(); // Call parent callback
                console.log('Project opened:', project);
            }
        }
        catch (error) {
            console.error('Failed to open project:', error);
        }
    };
    const handleSaveChat = async () => {
        try {
            const success = await file_menu_service_1.fileMenuService.saveChat();
            if (success) {
                onSaveChat(); // Call parent callback
                console.log('Chat saved successfully');
            }
        }
        catch (error) {
            console.error('Failed to save chat:', error);
        }
    };
    const handleExportChat = async () => {
        try {
            const success = await file_menu_service_1.fileMenuService.exportChat();
            if (success) {
                console.log('Chat exported successfully');
            }
        }
        catch (error) {
            console.error('Failed to export chat:', error);
        }
    };
    const handleImportChat = async () => {
        try {
            const session = await file_menu_service_1.fileMenuService.importChat();
            if (session) {
                console.log('Chat imported successfully:', session);
            }
        }
        catch (error) {
            console.error('Failed to import chat:', error);
        }
    };
    const handleOpenSettings = () => {
        file_menu_service_1.fileMenuService.openSettings();
        onNavigate('settings');
    };
    const handleExit = async () => {
        try {
            await file_menu_service_1.fileMenuService.exitApplication();
        }
        catch (error) {
            console.error('Failed to exit application:', error);
        }
    };
    // Edit Menu Actions - Production Quality Implementation using EditMenuService
    const handleUndo = async () => {
        try {
            await edit_menu_service_1.editMenuService.undo();
        }
        catch (error) {
            console.error('Undo failed:', error);
        }
    };
    const handleRedo = async () => {
        try {
            await edit_menu_service_1.editMenuService.redo();
        }
        catch (error) {
            console.error('Redo failed:', error);
        }
    };
    const handleCut = async () => {
        try {
            await edit_menu_service_1.editMenuService.cut();
        }
        catch (error) {
            console.error('Cut failed:', error);
        }
    };
    const handleCopy = async () => {
        try {
            await edit_menu_service_1.editMenuService.copy();
        }
        catch (error) {
            console.error('Copy failed:', error);
        }
    };
    const handlePaste = async () => {
        try {
            await edit_menu_service_1.editMenuService.paste();
        }
        catch (error) {
            console.error('Paste failed:', error);
        }
    };
    const handleSelectAll = async () => {
        try {
            await edit_menu_service_1.editMenuService.selectAll();
        }
        catch (error) {
            console.error('Select All failed:', error);
        }
    };
    const handleFind = async () => {
        try {
            await edit_menu_service_1.editMenuService.find();
        }
        catch (error) {
            console.error('Find failed:', error);
        }
    };
    const handleReplace = async () => {
        try {
            await edit_menu_service_1.editMenuService.replace();
        }
        catch (error) {
            console.error('Replace failed:', error);
        }
    };
    // View Menu Actions - Production Quality Implementation using ViewMenuService
    const openCommandPalette = async () => {
        try {
            await view_menu_service_1.viewMenuService.openCommandPalette();
        }
        catch (error) {
            console.error('Command palette failed:', error);
        }
    };
    const toggleFileExplorer = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleFileExplorer();
        }
        catch (error) {
            console.error('File explorer toggle failed:', error);
        }
    };
    const toggleChatHistory = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleChatHistory();
        }
        catch (error) {
            console.error('Chat history toggle failed:', error);
        }
    };
    const toggleTerminalPanel = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleTerminalPanel();
        }
        catch (error) {
            console.error('Terminal panel toggle failed:', error);
        }
    };
    const toggleOutputPanel = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleOutputPanel();
        }
        catch (error) {
            console.error('Output panel toggle failed:', error);
        }
    };
    const toggleFullscreen = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleFullscreen();
        }
        catch (error) {
            console.error('Fullscreen toggle failed:', error);
        }
    };
    const handleZoomIn = async () => {
        try {
            await view_menu_service_1.viewMenuService.zoomIn();
        }
        catch (error) {
            console.error('Zoom in failed:', error);
        }
    };
    const handleZoomOut = async () => {
        try {
            await view_menu_service_1.viewMenuService.zoomOut();
        }
        catch (error) {
            console.error('Zoom out failed:', error);
        }
    };
    const handleResetZoom = async () => {
        try {
            await view_menu_service_1.viewMenuService.resetZoom();
        }
        catch (error) {
            console.error('Reset zoom failed:', error);
        }
    };
    const toggleZenMode = async () => {
        try {
            await view_menu_service_1.viewMenuService.setLayoutMode('zen');
        }
        catch (error) {
            console.error('Zen mode toggle failed:', error);
        }
    };
    const togglePresentationMode = async () => {
        try {
            await view_menu_service_1.viewMenuService.setLayoutMode('presentation');
        }
        catch (error) {
            console.error('Presentation mode toggle failed:', error);
        }
    };
    const toggleTheme = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleTheme();
        }
        catch (error) {
            console.error('Theme toggle failed:', error);
        }
    };
    const toggleCompactMode = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleCompactMode();
        }
        catch (error) {
            console.error('Compact mode toggle failed:', error);
        }
    };
    const toggleMinimap = async () => {
        try {
            await view_menu_service_1.viewMenuService.toggleMinimap();
        }
        catch (error) {
            console.error('Minimap toggle failed:', error);
        }
    };
    // Tools Menu Actions  
    const openToolBrowser = () => onNavigate('tool-catalog');
    const openPerformanceMonitor = () => {
        console.log('Performance monitor');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Performance Monitor',
            message: 'Performance monitoring will be implemented in a future update.'
        });
    };
    // Help Menu Actions
    const openDocumentation = () => {
        console.log('Documentation');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Documentation',
            message: 'Documentation will open in your default browser.'
        });
    };
    const showShortcuts = () => {
        console.log('Keyboard shortcuts');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Keyboard Shortcuts',
            message: 'Keyboard shortcuts reference will be implemented in a future update.'
        });
    };
    const showAbout = () => {
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'About TanukiMCP Atlas',
            message: 'TanukiMCP Atlas - AI-Powered IDE for development workflows and intelligent tooling.'
        });
    };
    // Enhanced Menu Items with Icons and Better Organization
    const menuItems = [
        {
            label: 'File',
            items: [
                {
                    label: 'New Chat',
                    shortcut: 'Ctrl+N',
                    action: handleNewChat,
                    icon: '💬'
                },
                {
                    label: 'Open Project',
                    shortcut: 'Ctrl+O',
                    action: handleOpenProject,
                    icon: '📁'
                },
                {
                    label: 'Save Chat',
                    shortcut: 'Ctrl+S',
                    action: handleSaveChat,
                    icon: '💾'
                },
                { type: 'separator' },
                {
                    label: 'Export Chat',
                    action: handleExportChat,
                    icon: '📤'
                },
                {
                    label: 'Import Chat',
                    action: handleImportChat,
                    icon: '📥'
                },
                { type: 'separator' },
                {
                    label: 'Settings',
                    shortcut: 'Ctrl+,',
                    action: handleOpenSettings,
                    icon: '⚙️'
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    action: handleExit,
                    icon: '🚪'
                }
            ]
        },
        {
            label: 'Edit',
            items: [
                {
                    label: 'Undo',
                    shortcut: 'Ctrl+Z',
                    action: handleUndo,
                    icon: '↶'
                },
                {
                    label: 'Redo',
                    shortcut: 'Ctrl+Y',
                    action: handleRedo,
                    icon: '↷'
                },
                { type: 'separator' },
                {
                    label: 'Cut',
                    shortcut: 'Ctrl+X',
                    action: handleCut,
                    icon: '✂️'
                },
                {
                    label: 'Copy',
                    shortcut: 'Ctrl+C',
                    action: handleCopy,
                    icon: '📋'
                },
                {
                    label: 'Paste',
                    shortcut: 'Ctrl+V',
                    action: handlePaste,
                    icon: '📌'
                },
                {
                    label: 'Select All',
                    shortcut: 'Ctrl+A',
                    action: handleSelectAll,
                    icon: '🔘'
                },
                { type: 'separator' },
                {
                    label: 'Find',
                    shortcut: 'Ctrl+F',
                    action: handleFind,
                    icon: '🔍'
                },
                {
                    label: 'Replace',
                    shortcut: 'Ctrl+H',
                    action: handleReplace,
                    icon: '🔄'
                }
            ]
        },
        {
            label: 'View',
            items: [
                {
                    label: 'Command Palette',
                    shortcut: 'Ctrl+Shift+P',
                    action: openCommandPalette,
                    icon: '⌘'
                },
                { type: 'separator' },
                {
                    label: 'File Explorer',
                    shortcut: 'Ctrl+Shift+E',
                    action: toggleFileExplorer,
                    icon: '📁'
                },
                {
                    label: 'Chat History',
                    shortcut: 'Ctrl+Shift+H',
                    action: toggleChatHistory,
                    icon: '💬'
                },
                {
                    label: 'Terminal',
                    shortcut: 'Ctrl+`',
                    action: toggleTerminalPanel,
                    icon: '💻'
                },
                {
                    label: 'Output',
                    action: toggleOutputPanel,
                    icon: '📤'
                },
                { type: 'separator' },
                {
                    label: 'Toggle Fullscreen',
                    shortcut: 'F11',
                    action: toggleFullscreen,
                    icon: '⛶'
                },
                {
                    label: 'Zen Mode',
                    shortcut: 'Ctrl+K Z',
                    action: toggleZenMode,
                    icon: '🧘'
                },
                {
                    label: 'Presentation Mode',
                    action: togglePresentationMode,
                    icon: '📺'
                },
                { type: 'separator' },
                {
                    label: 'Zoom In',
                    shortcut: 'Ctrl++',
                    action: handleZoomIn,
                    icon: '🔍'
                },
                {
                    label: 'Zoom Out',
                    shortcut: 'Ctrl+-',
                    action: handleZoomOut,
                    icon: '🔍'
                },
                {
                    label: 'Reset Zoom',
                    shortcut: 'Ctrl+0',
                    action: handleResetZoom,
                    icon: '🔍'
                },
                { type: 'separator' },
                {
                    label: 'Toggle Theme',
                    action: toggleTheme,
                    icon: '🎨'
                },
                {
                    label: 'Compact Mode',
                    action: toggleCompactMode,
                    icon: '📱'
                },
                {
                    label: 'Minimap',
                    action: toggleMinimap,
                    icon: '🗺️'
                }
            ]
        },
        {
            label: 'Tools',
            items: [
                {
                    label: '🧠 LLM Prompt Management',
                    action: onOpenLLMPromptManagement,
                    icon: '🧠'
                },
                {
                    label: 'Tool Browser',
                    shortcut: 'Ctrl+Shift+T',
                    action: openToolBrowser,
                    icon: '🛠️'
                },
                {
                    label: 'MCP Servers',
                    action: onOpenMCPManager,
                    icon: '🔗'
                },
                { type: 'separator' },
                {
                    label: 'Workflow Manager',
                    shortcut: 'Ctrl+F5',
                    action: () => onNavigate('workflow-manager'),
                    icon: '⚡'
                },
                {
                    label: 'Performance Monitor',
                    action: openPerformanceMonitor,
                    icon: '📊'
                }
            ]
        },
        {
            label: 'Help',
            items: [
                {
                    label: 'Documentation',
                    shortcut: 'F1',
                    action: openDocumentation,
                    icon: '📚'
                },
                {
                    label: 'Keyboard Shortcuts',
                    action: showShortcuts,
                    icon: '⌨️'
                },
                { type: 'separator' },
                {
                    label: 'About TanukiMCP Atlas',
                    action: showAbout,
                    icon: '🦝'
                }
            ]
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between w-full gap-4 bg-background border-b border-border px-4 h-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "tanuki-brand flex items-center", children: [(0, jsx_runtime_1.jsx)("img", { src: "/assets/TanukiMCPLogo.png", alt: "TanukiMCP Logo", className: "h-6 w-auto mr-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "tanuki-text font-semibold text-foreground", children: ["Tanuki", (0, jsx_runtime_1.jsx)("span", { className: "text-orange-600", children: "MCP" }), " Atlas"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-5 bg-border mx-1" }), (0, jsx_runtime_1.jsx)(navigation_menu_1.NavigationMenu, { children: (0, jsx_runtime_1.jsx)(navigation_menu_1.NavigationMenuList, { className: "gap-1", children: menuItems.map(menu => ((0, jsx_runtime_1.jsx)(navigation_menu_1.NavigationMenuItem, { children: (0, jsx_runtime_1.jsx)(menu_dropdown_1.MenuDropdown, { label: menu.label, items: menu.items, className: "menu-dropdown" }) }, menu.label))) }) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(subject_mode_dropdown_1.SubjectModeDropdown, { currentMode: currentMode, onModeChange: onSubjectModeChange }) })] }));
};
exports.MenuBar = MenuBar;
//# sourceMappingURL=menu-bar.js.map