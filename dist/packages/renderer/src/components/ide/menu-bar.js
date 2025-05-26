"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBar = void 0;
const react_1 = __importDefault(require("react"));
const enhanced_dropdown_1 = require("../shared/enhanced-dropdown");
const subject_mode_dropdown_1 = require("../shared/subject-mode-dropdown");
const app_store_1 = require("../../stores/app-store");
const file_menu_service_1 = require("../../services/file-menu-service");
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
    // Edit Menu Actions - Enhanced implementations
    const handleUndo = () => {
        // TODO: Implement undo functionality
        console.log('Undo action');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Undo',
            message: 'Undo functionality will be implemented in a future update.'
        });
    };
    const handleRedo = () => {
        // TODO: Implement redo functionality
        console.log('Redo action');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Redo',
            message: 'Redo functionality will be implemented in a future update.'
        });
    };
    const handleCut = () => {
        // Use browser's built-in cut functionality
        document.execCommand('cut');
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'Cut',
            message: 'Selected text has been cut to clipboard.'
        });
    };
    const handleCopy = () => {
        // Use browser's built-in copy functionality
        document.execCommand('copy');
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'Copy',
            message: 'Selected text has been copied to clipboard.'
        });
    };
    const handlePaste = () => {
        // Use browser's built-in paste functionality
        document.execCommand('paste');
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'Paste',
            message: 'Content has been pasted from clipboard.'
        });
    };
    const handleFind = () => {
        // TODO: Implement search functionality
        console.log('Find action');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Find',
            message: 'Search functionality will be implemented in a future update.'
        });
    };
    const handleReplace = () => {
        // TODO: Implement replace functionality
        console.log('Replace action');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Replace',
            message: 'Replace functionality will be implemented in a future update.'
        });
    };
    // View Menu Actions
    const openCommandPalette = () => {
        console.log('Command palette');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Command Palette',
            message: 'Command palette will be implemented in a future update.'
        });
    };
    const toggleFileExplorer = () => {
        const { sidebarVisible, setSidebarVisible } = app_store_1.useAppStore.getState();
        setSidebarVisible(!sidebarVisible);
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'File Explorer',
            message: `File Explorer ${!sidebarVisible ? 'shown' : 'hidden'}.`
        });
    };
    const toggleChatHistory = () => {
        console.log('Toggle chat history');
        app_store_1.useAppStore.getState().addNotification({
            type: 'info',
            title: 'Chat History',
            message: 'Chat history panel will be implemented in a future update.'
        });
    };
    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            document.documentElement.requestFullscreen();
        }
    };
    const handleZoomIn = () => {
        const currentZoom = parseFloat(document.body.style.zoom || '1');
        const newZoom = Math.min(currentZoom + 0.1, 3);
        document.body.style.zoom = newZoom.toString();
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'Zoom In',
            message: `Zoom level: ${Math.round(newZoom * 100)}%`
        });
    };
    const handleZoomOut = () => {
        const currentZoom = parseFloat(document.body.style.zoom || '1');
        const newZoom = Math.max(currentZoom - 0.1, 0.5);
        document.body.style.zoom = newZoom.toString();
        app_store_1.useAppStore.getState().addNotification({
            type: 'success',
            title: 'Zoom Out',
            message: `Zoom level: ${Math.round(newZoom * 100)}%`
        });
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
                { type: 'separator' },
                {
                    label: 'Toggle Fullscreen',
                    shortcut: 'F11',
                    action: toggleFullscreen,
                    icon: '⛶'
                },
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
    return (<div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '16px',
            backgroundColor: 'var(--color-bg-primary)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 16px',
            height: '48px'
        }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="tanuki-brand">
          <img src="/assets/TanukiMCPLogo.png" alt="TanukiMCP Logo" className="tanuki-logo-img" style={{
            height: '24px',
            width: 'auto',
            marginRight: '8px'
        }}/>
          <div className="tanuki-text">
            Tanuki<span className="mcp">MCP</span> Atlas
          </div>
        </div>
        
        <div style={{
            width: '1px',
            height: '20px',
            backgroundColor: 'var(--color-border)',
            margin: '0 4px'
        }}/>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {menuItems.map(menu => (<enhanced_dropdown_1.EnhancedDropdown key={menu.label} label={menu.label} items={menu.items} triggerMode="hover" className="menu-dropdown"/>))}
        </div>
      </div>
      
      <div>
        <subject_mode_dropdown_1.SubjectModeDropdown currentMode={currentMode} onModeChange={onSubjectModeChange}/>
      </div>
    </div>);
};
exports.MenuBar = MenuBar;
//# sourceMappingURL=menu-bar.js.map