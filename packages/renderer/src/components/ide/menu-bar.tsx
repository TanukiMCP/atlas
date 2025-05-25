import React from 'react';
import { SimpleDropdown } from '../shared/simple-dropdown';
import { ModeSwitcher } from '../subject-modes/mode-switcher';

interface MenuBarProps {
  onNewChat: () => void;
  onOpenProject: () => void;
  onSaveChat: () => void;
  onSubjectModeChange: (mode: string) => void;
  currentMode: string;
  onOpenMCPManager: () => void;
  onOpenLLMPromptManagement: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewChat,
  onOpenProject,
  onSaveChat,
  onSubjectModeChange,
  currentMode,
  onOpenMCPManager,
  onOpenLLMPromptManagement
}) => {
  const handleExportChat = () => console.log('Export chat');
  const handleImportChat = () => console.log('Import chat');
  const openSettings = () => console.log('Open settings');
  const handleUndo = () => console.log('Undo');
  const handleRedo = () => console.log('Redo');
  const handleCut = () => console.log('Cut');
  const handleCopy = () => console.log('Copy');
  const handlePaste = () => console.log('Paste');
  const handleFind = () => console.log('Find');
  const handleReplace = () => console.log('Replace');
  const openCommandPalette = () => console.log('Command palette');
  const toggleFileExplorer = () => console.log('Toggle file explorer');
  const toggleChatHistory = () => console.log('Toggle chat history');
  const toggleFullscreen = () => console.log('Toggle fullscreen');
  const zoomIn = () => console.log('Zoom in');
  const zoomOut = () => console.log('Zoom out');
  const newTerminal = () => console.log('New terminal');
  const splitTerminal = () => console.log('Split terminal');
  const killTerminal = () => console.log('Kill terminal');
  const executeTool = () => console.log('Execute tool');
  const runWorkflow = () => console.log('Run workflow');
  const toggleDebugMode = () => console.log('Toggle debug mode');
  const openToolBrowser = () => console.log('Open tool browser');
  // Using onOpenMCPManager prop instead of local function
  const openPerformanceMonitor = () => console.log('Open performance monitor');
  const openDocumentation = () => console.log('Open documentation');
  const showShortcuts = () => console.log('Show shortcuts');
  const showAbout = () => console.log('Show about');  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Chat', shortcut: 'Ctrl+N', action: onNewChat },
        { label: 'Open Project', shortcut: 'Ctrl+O', action: onOpenProject },
        { label: 'Save Chat', shortcut: 'Ctrl+S', action: onSaveChat },
        { label: 'Export Chat', action: handleExportChat },
        { label: 'Import Chat', action: handleImportChat },
        { label: 'Settings', shortcut: 'Ctrl+,', action: openSettings }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: handleUndo },
        { label: 'Redo', shortcut: 'Ctrl+Y', action: handleRedo },
        { label: 'Cut', shortcut: 'Ctrl+X', action: handleCut },
        { label: 'Copy', shortcut: 'Ctrl+C', action: handleCopy },
        { label: 'Paste', shortcut: 'Ctrl+V', action: handlePaste },
        { label: 'Find', shortcut: 'Ctrl+F', action: handleFind },
        { label: 'Replace', shortcut: 'Ctrl+H', action: handleReplace }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P', action: openCommandPalette },
        { label: 'File Explorer', shortcut: 'Ctrl+Shift+E', action: toggleFileExplorer },
        { label: 'Chat History', shortcut: 'Ctrl+Shift+H', action: toggleChatHistory },
        { label: 'Toggle Fullscreen', shortcut: 'F11', action: toggleFullscreen },
        { label: 'Zoom In', shortcut: 'Ctrl++', action: zoomIn },
        { label: 'Zoom Out', shortcut: 'Ctrl+-', action: zoomOut }
      ]
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', shortcut: 'Ctrl+Shift+`', action: newTerminal },
        { label: 'Split Terminal', action: splitTerminal },
        { label: 'Kill Terminal', action: killTerminal }
      ]
    },
    {
      label: 'Run',
      items: [
        { label: 'Execute Tool', shortcut: 'F5', action: executeTool },
        { label: 'Run Workflow', shortcut: 'Ctrl+F5', action: runWorkflow },
        { label: 'Debug Mode', shortcut: 'F9', action: toggleDebugMode }
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: '🧠 LLM Prompt Management', action: onOpenLLMPromptManagement },
        { label: 'Tool Browser', shortcut: 'Ctrl+Shift+T', action: openToolBrowser },
        { label: 'MCP Servers', action: onOpenMCPManager },
        { label: 'Performance Monitor', action: openPerformanceMonitor }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation', shortcut: 'F1', action: openDocumentation },
        { label: 'Keyboard Shortcuts', action: showShortcuts },
        { label: 'About TanukiMCP', action: showAbout }
      ]
    }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="tanuki-brand">
          <div className="tanuki-logo">🦝</div>
          <div className="tanuki-text">
            Tanuki<span className="mcp">MCP</span> Atlas
          </div>
        </div>
        
        <div style={{ 
          width: '1px', 
          height: '20px', 
          backgroundColor: 'var(--color-border)',
          margin: '0 4px'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {menuItems.map(menu => (
            <SimpleDropdown key={menu.label} label={menu.label} items={menu.items} />
          ))}
        </div>
      </div>
      
      <div>
        <ModeSwitcher 
          currentMode={currentMode}
          onModeChange={onSubjectModeChange}
        />
      </div>
    </div>
  );
};