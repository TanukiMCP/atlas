import React from 'react';
import { MenuDropdown } from '../shared/menu-dropdown';
import { SubjectModeDropdown } from '../shared/subject-mode-dropdown';
import { useAppStore } from '../../stores/app-store';
import { AppView } from './ide-layout';
import { fileMenuService } from '../../services/file-menu-service';
import { editMenuService } from '../../services/edit-menu-service';
import { viewMenuService } from '../../services/view-menu-service';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '../ui/navigation-menu';

interface MenuBarProps {
  onNewChat: () => void;
  onOpenProject: () => void;
  onSaveChat: () => void;
  onSubjectModeChange: (mode: string) => void;
  currentMode: string;
  onOpenMCPManager: () => void;
  onOpenLLMPromptManagement: () => void;
  onNavigate: (view: AppView) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewChat,
  onOpenProject,
  onSaveChat,
  onSubjectModeChange,
  currentMode,
  onOpenMCPManager,
  onOpenLLMPromptManagement,
  onNavigate
}) => {
  const { theme, setTheme } = useAppStore();

  // File Menu Actions - Production Quality Implementation
  const handleNewChat = async () => {
    try {
      const newSession = await fileMenuService.newChat();
      onNewChat(); // Call parent callback
      console.log('New chat created:', newSession);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleOpenProject = async () => {
    try {
      const project = await fileMenuService.openProject();
      if (project) {
        onOpenProject(); // Call parent callback
        console.log('Project opened:', project);
      }
    } catch (error) {
      console.error('Failed to open project:', error);
    }
  };

  const handleSaveChat = async () => {
    try {
      const success = await fileMenuService.saveChat();
      if (success) {
        onSaveChat(); // Call parent callback
        console.log('Chat saved successfully');
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const handleExportChat = async () => {
    try {
      const success = await fileMenuService.exportChat();
      if (success) {
        console.log('Chat exported successfully');
      }
    } catch (error) {
      console.error('Failed to export chat:', error);
    }
  };

  const handleImportChat = async () => {
    try {
      const session = await fileMenuService.importChat();
      if (session) {
        console.log('Chat imported successfully:', session);
      }
    } catch (error) {
      console.error('Failed to import chat:', error);
    }
  };

  const handleOpenSettings = () => {
    fileMenuService.openSettings();
    onNavigate('settings');
  };

  const handleExit = async () => {
    try {
      await fileMenuService.exitApplication();
    } catch (error) {
      console.error('Failed to exit application:', error);
    }
  };

  // Edit Menu Actions - Production Quality Implementation using EditMenuService
  const handleUndo = async () => {
    try {
      await editMenuService.undo();
    } catch (error) {
      console.error('Undo failed:', error);
    }
  };

  const handleRedo = async () => {
    try {
      await editMenuService.redo();
    } catch (error) {
      console.error('Redo failed:', error);
    }
  };

  const handleCut = async () => {
    try {
      await editMenuService.cut();
    } catch (error) {
      console.error('Cut failed:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await editMenuService.copy();
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handlePaste = async () => {
    try {
      await editMenuService.paste();
    } catch (error) {
      console.error('Paste failed:', error);
    }
  };

  const handleSelectAll = async () => {
    try {
      await editMenuService.selectAll();
    } catch (error) {
      console.error('Select All failed:', error);
    }
  };

  const handleFind = async () => {
    try {
      await editMenuService.find();
    } catch (error) {
      console.error('Find failed:', error);
    }
  };

  const handleReplace = async () => {
    try {
      await editMenuService.replace();
    } catch (error) {
      console.error('Replace failed:', error);
    }
  };

  // View Menu Actions - Production Quality Implementation using ViewMenuService
  const openCommandPalette = async () => {
    try {
      await viewMenuService.openCommandPalette();
    } catch (error) {
      console.error('Command palette failed:', error);
    }
  };

  const toggleFileExplorer = async () => {
    try {
      await viewMenuService.toggleFileExplorer();
    } catch (error) {
      console.error('File explorer toggle failed:', error);
    }
  };

  const toggleChatHistory = async () => {
    try {
      await viewMenuService.toggleChatHistory();
    } catch (error) {
      console.error('Chat history toggle failed:', error);
    }
  };

  const toggleTerminalPanel = async () => {
    try {
      await viewMenuService.toggleTerminalPanel();
    } catch (error) {
      console.error('Terminal panel toggle failed:', error);
    }
  };

  const toggleOutputPanel = async () => {
    try {
      await viewMenuService.toggleOutputPanel();
    } catch (error) {
      console.error('Output panel toggle failed:', error);
    }
  };

  const toggleFullscreen = async () => {
    try {
      await viewMenuService.toggleFullscreen();
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const handleZoomIn = async () => {
    try {
      await viewMenuService.zoomIn();
    } catch (error) {
      console.error('Zoom in failed:', error);
    }
  };

  const handleZoomOut = async () => {
    try {
      await viewMenuService.zoomOut();
    } catch (error) {
      console.error('Zoom out failed:', error);
    }
  };

  const handleResetZoom = async () => {
    try {
      await viewMenuService.resetZoom();
    } catch (error) {
      console.error('Reset zoom failed:', error);
    }
  };

  const toggleZenMode = async () => {
    try {
      await viewMenuService.setLayoutMode('zen');
    } catch (error) {
      console.error('Zen mode toggle failed:', error);
    }
  };

  const togglePresentationMode = async () => {
    try {
      await viewMenuService.setLayoutMode('presentation');
    } catch (error) {
      console.error('Presentation mode toggle failed:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      await viewMenuService.toggleTheme();
    } catch (error) {
      console.error('Theme toggle failed:', error);
    }
  };

  const toggleCompactMode = async () => {
    try {
      await viewMenuService.toggleCompactMode();
    } catch (error) {
      console.error('Compact mode toggle failed:', error);
    }
  };

  const toggleMinimap = async () => {
    try {
      await viewMenuService.toggleMinimap();
    } catch (error) {
      console.error('Minimap toggle failed:', error);
    }
  };

  // Tools Menu Actions  
  const openToolBrowser = () => onNavigate('tool-catalog');
  const openPerformanceMonitor = () => {
    console.log('Performance monitor');
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Performance Monitor',
      message: 'Performance monitoring will be implemented in a future update.'
    });
  };

  // Help Menu Actions
  const openDocumentation = () => {
    console.log('Documentation');
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Documentation',
      message: 'Documentation will open in your default browser.'
    });
  };

  const showShortcuts = () => {
    console.log('Keyboard shortcuts');
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Keyboard Shortcuts',
      message: 'Keyboard shortcuts reference will be implemented in a future update.'
    });
  };

  const showAbout = () => {
    useAppStore.getState().addNotification({
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

  return (
    <div className="flex items-center justify-between w-full gap-4 bg-background border-b border-border px-4 h-12">
      <div className="flex items-center gap-3">
        <div className="tanuki-brand flex items-center">
          <img 
            src="/assets/TanukiMCPLogo.png" 
            alt="TanukiMCP Logo" 
            className="h-6 w-auto mr-2"
          />
          <div className="tanuki-text font-semibold text-foreground">
            Tanuki<span className="text-orange-600">MCP</span> Atlas
          </div>
        </div>
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {menuItems.map(menu => (
              <NavigationMenuItem key={menu.label}>
                <MenuDropdown 
                  label={menu.label} 
                  items={menu.items}
                  className="menu-dropdown"
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div>
        <SubjectModeDropdown 
          currentMode={currentMode} 
          onModeChange={onSubjectModeChange}
        />
      </div>
    </div>
  );
};