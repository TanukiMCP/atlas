# TanukiMCP Atlas - Prompts 7 & 8 Implementation

This document contains the missing implementation prompts for Phases 7 and 8 of TanukiMCP Atlas, completing the 8-phase implementation series.

## 📋 Phase Dependencies

**Prerequisites:** Phases 1-6 must be completed before implementing these phases.

```
Phase 1 (Foundation) → Phase 2 (LLM Integration) → Phase 3 (Built-in MCP) → 
Phase 4 (External MCP) → Phase 5 (LLM Router) → Phase 6 (Tool Router) → 
Phase 7 (IDE UI Implementation) → Phase 8 (Management Center)
```

---

# PROMPT 7: Complete IDE UI Implementation & Chat History System

## Context & Objective
Building on the solid foundation of Phases 1-6, this phase implements the complete IDE user interface that transforms TanukiMCP Atlas from a backend system into a fully functional AI-powered IDE. This includes comprehensive chat history CRUD operations, standard IDE menu structure, workflow management, subject mode switching, and professional IDE aesthetics.

The IDE UI serves as the primary interaction layer for users, providing a familiar development environment enhanced with AI capabilities. This phase integrates all previous components (LLM routing, tool management, MCP servers) into a cohesive, production-ready interface that rivals commercial IDE solutions.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (Complete UI Architecture section)
Review: `docs/16-local-only-architecture-changes.md` (UI/UX requirements)

## Technical Requirements
- **Complete Chat System:** CRUD operations with search, filtering, tagging, and archiving
- **Standard IDE Menus:** File, Edit, View, Terminal, Run, Debug, Tools, Help with keyboard shortcuts
- **Workflow Management:** Save chats as reusable workflows with @workflows/ integration
- **Subject Mode UI:** Dynamic interface adaptations for mathematics, programming, science, languages
- **Professional Design:** Modern IDE aesthetics with responsive layout and accessibility
- **Real-time Features:** Live updates, streaming responses, and collaborative elements
- **Context Management:** Project-aware interface with intelligent tool suggestions## Enhanced File Structure
```
packages/renderer/src/
├── components/
│   ├── ide/
│   │   ├── ide-layout.tsx (Main IDE layout)
│   │   ├── menu-bar.tsx (Standard IDE menu structure)
│   │   ├── toolbar.tsx (Context-sensitive toolbar)
│   │   ├── status-bar.tsx (Status information and indicators)
│   │   └── panel-manager.tsx (Resizable panels and docking)
│   ├── chat/
│   │   ├── chat-interface.tsx (Main chat interface)
│   │   ├── chat-history-manager.tsx (CRUD operations)
│   │   ├── chat-search.tsx (Search and filtering)
│   │   ├── message-renderer.tsx (Message display with formatting)
│   │   ├── streaming-response.tsx (Real-time response streaming)
│   │   └── chat-sidebar.tsx (Chat list and management)
│   ├── workflows/
│   │   ├── workflow-manager.tsx (Workflow CRUD operations)
│   │   ├── workflow-editor.tsx (Visual workflow editor)
│   │   ├── workflow-executor.tsx (Workflow execution interface)
│   │   └── workflow-templates.tsx (Pre-built workflow templates)
│   ├── subject-modes/
│   │   ├── mode-switcher.tsx (Subject mode selection)
│   │   ├── mathematics-mode.tsx (Math-specific UI adaptations)
│   │   ├── programming-mode.tsx (Programming-specific UI)
│   │   ├── science-mode.tsx (Science-specific UI)
│   │   └── language-mode.tsx (Language learning UI)
│   ├── file-explorer/
│   │   ├── file-tree.tsx (Project file explorer)
│   │   ├── file-editor.tsx (Integrated text editor)
│   │   ├── file-preview.tsx (File preview pane)
│   │   └── search-files.tsx (File search functionality)
│   └── shared/
│       ├── loading-spinner.tsx (Loading indicators)
│       ├── error-boundary.tsx (Error handling)
│       ├── modal.tsx (Modal dialogs)
│       └── toast-notifications.tsx (Notification system)
├── hooks/
│   ├── use-chat-history.ts (Chat history management)
│   ├── use-workflows.ts (Workflow management)
│   ├── use-subject-mode.ts (Subject mode state)
│   ├── use-keyboard-shortcuts.ts (IDE keyboard shortcuts)
│   └── use-real-time-updates.ts (Live update handling)
├── stores/
│   ├── chat-store.ts (Chat state management)
│   ├── workflow-store.ts (Workflow state)
│   ├── ui-store.ts (UI state and preferences)
│   └── project-store.ts (Project context state)
├── services/
│   ├── chat-service.ts (Chat CRUD operations)
│   ├── workflow-service.ts (Workflow persistence)
│   ├── export-service.ts (Data export functionality)
│   └── import-service.ts (Data import functionality)
└── styles/
    ├── ide-theme.css (IDE-specific styling)
    ├── subject-modes.css (Mode-specific styles)
    └── responsive.css (Responsive design)
```

## Implementation Instructions

### Step 1: Main IDE Layout
Create `packages/renderer/src/components/ide/ide-layout.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { MenuBar } from './menu-bar';
import { Toolbar } from './toolbar';
import { StatusBar } from './status-bar';
import { PanelManager } from './panel-manager';
import { ChatInterface } from '../chat/chat-interface';
import { FileExplorer } from '../file-explorer/file-tree';
import { WorkflowManager } from '../workflows/workflow-manager';
import { AtSymbolDropdown } from '@tanukimcp/tool-router';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';
import { useSubjectMode } from '../../hooks/use-subject-mode';
import { useUIStore } from '../../stores/ui-store';

export const IDELayout: React.FC = () => {
  const [showAtSymbol, setShowAtSymbol] = useState(false);
  const [atSymbolPosition, setAtSymbolPosition] = useState({ x: 0, y: 0 });
  
  const { currentMode, switchMode } = useSubjectMode();
  const { layout, updateLayout } = useUIStore();
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+Shift+P': () => setShowAtSymbol(true),
    'Ctrl+N': () => handleNewChat(),
    'Ctrl+O': () => handleOpenProject(),
    'Ctrl+S': () => handleSaveChat(),
    'Ctrl+Shift+S': () => handleSaveAsWorkflow(),
    'F11': () => handleToggleFullscreen()
  });

  const handleAtSymbolTrigger = (event: React.KeyboardEvent, position: { x: number; y: number }) => {
    if (event.key === '@') {
      setAtSymbolPosition(position);
      setShowAtSymbol(true);
    }
  };

  return (
    <div className="ide-container h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Menu Bar */}
      <MenuBar 
        onNewChat={handleNewChat}
        onOpenProject={handleOpenProject}
        onSaveChat={handleSaveChat}
        onSubjectModeChange={switchMode}
        currentMode={currentMode}
      />
      
      {/* Toolbar */}
      <Toolbar 
        currentMode={currentMode}
        onModeChange={switchMode}
        onAtSymbolTrigger={() => setShowAtSymbol(true)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <PanelManager
          layout={layout}
          onLayoutChange={updateLayout}
          panels={{
            fileExplorer: <FileExplorer />,
            chatInterface: <ChatInterface onAtSymbolTrigger={handleAtSymbolTrigger} />,
            workflowManager: <WorkflowManager />,
            toolOutput: <div>Tool Output Panel</div>
          }}
        />
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        currentMode={currentMode}
        connectionStatus="connected"
        activeTools={[]}
      />
      
      {/* @ Symbol Dropdown */}
      {showAtSymbol && (
        <AtSymbolDropdown
          isOpen={showAtSymbol}
          onClose={() => setShowAtSymbol(false)}
          onToolSelect={handleToolSelect}
          context={getExecutionContext()}
          position={atSymbolPosition}
          toolRouter={getToolRouter()}
        />
      )}
    </div>
  );
};
```### Step 2: Chat History Manager with CRUD Operations
Create `packages/renderer/src/components/chat/chat-history-manager.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { ChatSession, Message } from '../../types/chat-types';
import { useChatHistory } from '../../hooks/use-chat-history';
import { ChatSearch } from './chat-search';

export const ChatHistoryManager: React.FC = () => {
  const {
    sessions,
    currentSession,
    createSession,
    updateSession,
    deleteSession,
    archiveSession,
    searchSessions,
    exportSession,
    importSession
  } = useChatHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived || !session.isArchived;
    return matchesSearch && matchesArchived;
  });

  return (
    <div className="chat-history-manager h-full flex flex-col">
      {/* Header with search and actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => createSession({ title: 'New Chat' })}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              New Chat
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </button>
          </div>
        </div>
        
        <ChatSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onAdvancedSearch={(filters) => searchSessions(filters)}
        />
        
        {/* Bulk actions */}
        {selectedSessions.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded flex items-center space-x-2">
            <span className="text-sm">{selectedSessions.length} selected</span>
            <button
              onClick={() => handleBulkArchive(selectedSessions)}
              className="px-2 py-1 text-xs bg-gray-600 text-white rounded"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkDelete(selectedSessions)}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={() => handleBulkExport(selectedSessions)}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded"
            >
              Export
            </button>
          </div>
        )}
      </div>

      {/* Chat session list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredSessions.map(session => (
          <ChatSessionCard
            key={session.id}
            session={session}
            isSelected={selectedSessions.includes(session.id)}
            isCurrent={currentSession?.id === session.id}
            onSelect={() => toggleSessionSelection(session.id)}
            onOpen={() => openSession(session.id)}
            onEdit={() => editSession(session)}
            onDelete={() => deleteSession(session.id)}
            onArchive={() => archiveSession(session.id)}
            onExport={() => exportSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### Step 3: Standard IDE Menu Bar
Create `packages/renderer/src/components/ide/menu-bar.tsx`:

```typescript
import React from 'react';
import { useKeyboardShortcuts } from '../../hooks/use-keyboard-shortcuts';

interface MenuBarProps {
  onNewChat: () => void;
  onOpenProject: () => void;
  onSaveChat: () => void;
  onSubjectModeChange: (mode: string) => void;
  currentMode: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewChat,
  onOpenProject,
  onSaveChat,
  onSubjectModeChange,
  currentMode
}) => {
  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Chat', shortcut: 'Ctrl+N', action: onNewChat },
        { label: 'Open Project', shortcut: 'Ctrl+O', action: onOpenProject },
        { label: 'Save Chat', shortcut: 'Ctrl+S', action: onSaveChat },
        { type: 'separator' },
        { label: 'Export Chat', action: () => handleExportChat() },
        { label: 'Import Chat', action: () => handleImportChat() },
        { type: 'separator' },
        { label: 'Settings', shortcut: 'Ctrl+,', action: () => openSettings() }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: () => handleUndo() },
        { label: 'Redo', shortcut: 'Ctrl+Y', action: () => handleRedo() },
        { type: 'separator' },
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => handleCut() },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => handleCopy() },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => handlePaste() },
        { type: 'separator' },
        { label: 'Find', shortcut: 'Ctrl+F', action: () => handleFind() },
        { label: 'Replace', shortcut: 'Ctrl+H', action: () => handleReplace() }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P', action: () => openCommandPalette() },
        { label: 'File Explorer', shortcut: 'Ctrl+Shift+E', action: () => toggleFileExplorer() },
        { label: 'Chat History', shortcut: 'Ctrl+Shift+H', action: () => toggleChatHistory() },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', shortcut: 'F11', action: () => toggleFullscreen() },
        { label: 'Zoom In', shortcut: 'Ctrl++', action: () => zoomIn() },
        { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => zoomOut() }
      ]
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', shortcut: 'Ctrl+Shift+`', action: () => newTerminal() },
        { label: 'Split Terminal', action: () => splitTerminal() },
        { label: 'Kill Terminal', action: () => killTerminal() }
      ]
    },
    {
      label: 'Run',
      items: [
        { label: 'Execute Tool', shortcut: 'F5', action: () => executeTool() },
        { label: 'Run Workflow', shortcut: 'Ctrl+F5', action: () => runWorkflow() },
        { label: 'Debug Mode', shortcut: 'F9', action: () => toggleDebugMode() }
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: 'Tool Browser', shortcut: 'Ctrl+Shift+T', action: () => openToolBrowser() },
        { label: 'MCP Servers', action: () => openMCPManager() },
        { label: 'Performance Monitor', action: () => openPerformanceMonitor() }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation', shortcut: 'F1', action: () => openDocumentation() },
        { label: 'Keyboard Shortcuts', action: () => showShortcuts() },
        { label: 'About TanukiMCP', action: () => showAbout() }
      ]
    }
  ];

  return (
    <div className="menu-bar bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1">
      <div className="flex items-center space-x-1">
        {menuItems.map(menu => (
          <DropdownMenu key={menu.label} label={menu.label} items={menu.items} />
        ))}
        
        {/* Subject Mode Indicator */}
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
          <SubjectModeSelector 
            currentMode={currentMode}
            onModeChange={onSubjectModeChange}
          />
        </div>
      </div>
    </div>
  );
};
```### Step 4: Subject Mode UI Adaptations
Create `packages/renderer/src/components/subject-modes/mode-switcher.tsx`:

```typescript
import React from 'react';
import { SubjectMode } from '../../types/subject-types';

const SUBJECT_MODES: SubjectMode[] = [
  { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
  { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
  { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
  { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];

interface ModeSwitcherProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div className="mode-switcher flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Subject Mode:
      </span>
      <div className="flex space-x-1">
        {SUBJECT_MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentMode === mode.id
                ? `bg-${mode.color}-500 text-white`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span>{mode.icon}</span>
            <span>{mode.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

**Validation:** Full IDE interface with chat history management, workflow creation, subject mode switching, and all UI components functional.

**Integration Points:** Integrates all previous phases (1-6) into a unified user interface with professional IDE aesthetics and functionality.

**Next Phase:** Phase 8 adds comprehensive management center and final system integration.

---

# PROMPT 8: MCP Management Center & Final Integration

## Context & Objective
This final phase completes the TanukiMCP Atlas implementation by creating a comprehensive Management Center that serves as the administrative hub for the entire system. Building on all previous phases, this implements a sophisticated control panel for server configuration, real-time health monitoring, tool catalog management, performance analytics, and system diagnostics.

The MCP Management Center transforms TanukiMCP Atlas from a powerful local AI IDE into a production-ready system with enterprise-grade monitoring, configuration management, and optimization capabilities. This phase includes comprehensive testing protocols, performance optimization, final system integration, and production-readiness preparations.

This phase also implements the final polish touches including system themes, accessibility features, comprehensive error handling, backup/restore functionality, and complete documentation integration within the IDE.

## Architecture Reference
Review: `docs/15-mcp-architecture-complete.md` (MCP Management Center UI section)
Review: `docs/16-local-only-architecture-changes.md` (Production deployment and optimization)

## Technical Requirements
- **Comprehensive Management Dashboard:** Real-time system overview with health metrics and alerts
- **Server Configuration Manager:** Visual forms for MCP server setup, authentication, and security
- **Tool Catalog Browser:** Interactive tool discovery with testing sandbox and performance metrics
- **Performance Analytics:** System-wide metrics collection, analysis, and optimization recommendations
- **Health Monitoring:** Real-time health checking with alerting and automated recovery mechanisms
- **Configuration Import/Export:** Backup and restore functionality for all system configurations
- **System Diagnostics:** Advanced troubleshooting tools with log analysis and performance profiling
- **Production Optimization:** Final performance tuning and memory optimization
- **Accessibility & Theming:** Complete UI polish with accessibility compliance and customizable themes## Enhanced File Structure
```
packages/management-center/
├── package.json (Management center dependencies)
├── tsconfig.json (TypeScript configuration)
└── src/
    ├── dashboard/
    │   ├── management-dashboard.tsx (Main dashboard interface)
    │   ├── system-overview.tsx (System health overview)
    │   ├── quick-actions.tsx (Common management actions)
    │   ├── status-indicators.tsx (Real-time status displays)
    │   └── notification-center.tsx (System alerts and notifications)
    ├── server-management/
    │   ├── server-config-manager.tsx (Server configuration UI)
    │   ├── server-setup-wizard.tsx (New server setup wizard)
    │   ├── connection-tester.tsx (Server connection testing)
    │   ├── authentication-config.tsx (Security and auth setup)
    │   └── server-templates.tsx (Pre-configured server templates)
    ├── tool-catalog/
    │   ├── tool-catalog-browser.tsx (Interactive tool browser)
    │   ├── tool-testing-sandbox.tsx (Tool testing environment)
    │   ├── tool-performance-metrics.tsx (Tool usage analytics)
    │   ├── tool-documentation-viewer.tsx (Tool docs and examples)
    │   └── tool-conflict-resolver.tsx (Tool conflict management)
    ├── monitoring/
    │   ├── health-monitor-dashboard.tsx (Health monitoring UI)
    │   ├── performance-charts.tsx (Performance visualization)
    │   ├── alert-management.tsx (Alert configuration and history)
    │   ├── resource-monitor.tsx (System resource monitoring)
    │   └── uptime-tracker.tsx (Uptime and availability tracking)
    ├── analytics/
    │   ├── usage-analytics.tsx (Usage pattern analysis)
    │   ├── performance-analytics.tsx (Performance trend analysis)
    │   ├── optimization-recommendations.tsx (System optimization suggestions)
    │   ├── report-generator.tsx (Automated report generation)
    │   └── data-export.tsx (Analytics data export)
    ├── diagnostics/
    │   ├── system-diagnostics.tsx (Advanced troubleshooting tools)
    │   ├── log-analyzer.tsx (Log analysis and search)
    │   ├── performance-profiler.tsx (Performance profiling tools)
    │   ├── network-diagnostics.tsx (Network connectivity testing)
    │   └── troubleshooting-wizard.tsx (Guided problem resolution)
    ├── configuration/
    │   ├── config-manager.tsx (Configuration management UI)
    │   ├── backup-restore.tsx (Backup and restore functionality)
    │   ├── import-export.tsx (Configuration import/export)
    │   ├── validation-engine.tsx (Configuration validation)
    │   └── migration-tools.tsx (Configuration migration utilities)
    ├── theming/
    │   ├── theme-manager.tsx (Theme customization interface)
    │   ├── accessibility-settings.tsx (Accessibility configuration)
    │   ├── ui-customization.tsx (UI layout customization)
    │   ├── color-picker.tsx (Custom color schemes)
    │   └── font-settings.tsx (Typography customization)
    └── types/
        ├── management-types.ts (Management center types)
        ├── monitoring-types.ts (Monitoring system types)
        ├── analytics-types.ts (Analytics types)
        └── configuration-types.ts (Configuration management types)
```

## Implementation Instructions

### Step 1: Main Management Dashboard
Create `packages/management-center/src/dashboard/management-dashboard.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { SystemOverview } from './system-overview';
import { ServerConfigManager } from '../server-management/server-config-manager';
import { ToolCatalogBrowser } from '../tool-catalog/tool-catalog-browser';
import { HealthMonitorDashboard } from '../monitoring/health-monitor-dashboard';
import { PerformanceAnalytics } from '../analytics/performance-analytics';
import { SystemDiagnostics } from '../diagnostics/system-diagnostics';
import { ConfigManager } from '../configuration/config-manager';
import { ThemeManager } from '../theming/theme-manager';
import { useSystemHealth } from '../hooks/use-system-health';
import { useNotifications } from '../hooks/use-notifications';

export const ManagementDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  
  const {
    systemHealth,
    systemMetrics,
    isLoading,
    error,
    refreshHealth,
    toggleAutoRefresh,
    isAutoRefreshEnabled
  } = useSystemHealth();
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    addNotification
  } = useNotifications();

  const navigationItems = [
    { id: 'overview', label: 'System Overview', icon: '📊', component: SystemOverview },
    { id: 'servers', label: 'Server Management', icon: '🔧', component: ServerConfigManager },
    { id: 'tools', label: 'Tool Catalog', icon: '🛠️', component: ToolCatalogBrowser },
    { id: 'monitoring', label: 'Health Monitoring', icon: '💓', component: HealthMonitorDashboard },
    { id: 'analytics', label: 'Performance Analytics', icon: '📈', component: PerformanceAnalytics },
    { id: 'diagnostics', label: 'System Diagnostics', icon: '🔍', component: SystemDiagnostics },
    { id: 'configuration', label: 'Configuration', icon: '⚙️', component: ConfigManager },
    { id: 'theming', label: 'Appearance', icon: '🎨', component: ThemeManager }
  ];

  return (
    <div className="management-dashboard h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-semibold">TanukiMCP</h1>
              <p className="text-sm text-gray-500">Management Center</p>
            </div>
          </div>
          
          {/* System Status Card */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Status</span>
              <div className={`w-2 h-2 rounded-full ${systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {systemHealth ? (
                <div className="space-y-1">
                  <div>Uptime: {formatUptime(systemHealth.uptime)}</div>
                  <div>CPU: {systemHealth.cpu.usage}%</div>
                  <div>Memory: {systemHealth.memory.usage}%</div>
                </div>
              ) : (
                <div>Loading system status...</div>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ContentArea 
          selectedView={selectedView}
          navigationItems={navigationItems}
          systemHealth={systemHealth}
          systemMetrics={systemMetrics}
          onRefresh={refreshHealth}
        />
      </div>
    </div>
  );
};
```### Step 2: Tool Catalog Browser with Testing
Create `packages/management-center/src/tool-catalog/tool-catalog-browser.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { UnifiedTool, ToolCategory } from '@tanukimcp/tool-router';
import { ToolTestingSandbox } from './tool-testing-sandbox';
import { useToolCatalog } from '../hooks/use-tool-catalog';

export const ToolCatalogBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<UnifiedTool | null>(null);
  const [showTestingSandbox, setShowTestingSandbox] = useState(false);
  
  const {
    tools,
    categories,
    isLoading,
    error,
    refreshCatalog,
    testTool
  } = useToolCatalog();

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tool-catalog-browser h-full flex">
      {/* Tool Browser */}
      <div className="flex-1 flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <button
              onClick={refreshCatalog}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTools.length} tools • {categories.length} categories
          </div>
        </div>
        
        {/* Tool Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={() => setSelectedTool(tool)}
                onTest={() => {
                  setSelectedTool(tool);
                  setShowTestingSandbox(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Tool Details Panel */}
      {selectedTool && (
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <ToolDetailsPanel
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            onTest={() => setShowTestingSandbox(true)}
          />
        </div>
      )}
      
      {/* Testing Sandbox */}
      {showTestingSandbox && selectedTool && (
        <ToolTestingSandbox
          tool={selectedTool}
          isOpen={showTestingSandbox}
          onClose={() => setShowTestingSandbox(false)}
          onTest={testTool}
        />
      )}
    </div>
  );
};
```

### Step 3: System Health Monitoring
Create `packages/management-center/src/monitoring/health-monitor-dashboard.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSystemMonitoring } from '../hooks/use-system-monitoring';

export const HealthMonitorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  
  const {
    healthHistory,
    realTimeMetrics,
    alerts,
    serverStatuses,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  } = useSystemMonitoring();

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  const currentHealth = realTimeMetrics || {};
  const healthScore = calculateOverallHealthScore(currentHealth);

  return (
    <div className="health-monitor space-y-6">
      {/* Health Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <HealthMetricCard
          title="Overall Health"
          value={`${healthScore}%`}
          status={getHealthStatus(healthScore)}
          icon="💓"
        />
        <HealthMetricCard
          title="CPU Usage"
          value={`${currentHealth.cpu?.usage || 0}%`}
          status={getResourceStatus(currentHealth.cpu?.usage || 0)}
          icon="🔥"
        />
        <HealthMetricCard
          title="Memory Usage"
          value={`${currentHealth.memory?.usage || 0}%`}
          status={getResourceStatus(currentHealth.memory?.usage || 0)}
          icon="💾"
        />
        <HealthMetricCard
          title="Active Servers"
          value={`${serverStatuses.filter(s => s.status === 'healthy').length}/${serverStatuses.length}`}
          status={getServerStatus(serverStatuses)}
          icon="🔧"
        />
      </div>
      
      {/* Real-time Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Real-time Monitoring</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isMonitoring ? 'Live' : 'Stopped'}
              </span>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthHistory}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <YAxis domain={[0, 100]} />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
              <Line type="monotone" dataKey="healthScore" stroke="#3B82F6" strokeWidth={2} name="Health Score" />
              <Line type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} name="CPU Usage" />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory Usage" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
```

**Validation:** Complete TanukiMCP Atlas IDE with comprehensive management center, real-time monitoring, tool catalog browser, performance analytics, and all system features functional.

**Integration Points:** Integrates all previous phases (1-7) into a unified management interface, provides production-ready monitoring and configuration, and delivers a complete local AI IDE solution.

**Final Result:** Production-ready local AI IDE with dual MCP architecture, comprehensive tooling, advanced LLM routing, intelligent tool management, and enterprise-grade monitoring capabilities.

---

# PROMPT 9: Intelligent Custom Workflow Generation & Management

## Context & Objective
Building upon the comprehensive IDE and chat functionalities established in prior phases, this phase introduces an advanced **Intelligent Custom Workflow Generation and Management system**. This feature empowers users to transform their chat conversations into reusable, structured workflows with the assistance of specialized LLM agents. The system will provide an interactive UI for visualizing, refining, and saving these workflows, ensuring they are robust, consistently formatted, and seamlessly integrated into the existing "@" tool invocation system.

This phase requires the implementation of a multi-agent LLM architecture for workflow synthesis, visualization, refinement, and finalization, adhering strictly to production-quality standards with no placeholders, sample data, or incomplete logic.

## Architecture & UI Design References
**Primary Architecture Reference**: `docs/18-intelligent-workflow-generation.md` (Intelligent Custom Workflow Generation & Management)

**UI Design Reference**: `ui-wireframes-detailed.md` (Section: "🔧 NEW: Intelligent Workflow Generation UI (Prompt 9)")

**Supporting Reference for ASCII Visualization Style**: `docs/13-enhanced-llm-architecture.md` (Specifically the "Complete Architecture Flow Visualization" for ASCII art style guidance).

## Critical UI Implementation Guidance
**MANDATORY**: You MUST consult and follow the detailed wireframes in `ui-wireframes-detailed.md` for precise UI specifications. The wireframes provide:

1. **Exact UI Layout**: The "Save Custom Workflow Dialog" wireframe shows the precise 4/5 to 1/5 layout split between the ASCII workflow visualization pane and refinement chat interface.

2. **Integration Points**: The wireframes show exactly where and how to add "Save as Workflow" buttons to the chat interface and how to integrate custom workflows into the @ symbol tool selector.

3. **Component Structure**: Detailed breakdown of the workflow preview & editing UI components, including the scrollable markdown preview pane with direct editing capabilities.

4. **Visual Design**: Exact ASCII art style matching the enhanced LLM architecture documentation, with proper box drawing and flow indicators.

5. **Current Implementation Status**: The wireframes clearly indicate what components already exist (✅), what needs enhancement (🔄), and what's completely new (❌) from this prompt.

### UI Components to Add/Update (From Wireframes):

#### A. Chat Interface Enhancement:
- Add "Save as Workflow" button to chat header
- Add "Save as Workflow" button to individual user messages
- Integrate custom workflows into @ symbol tool selector dropdown

#### B. New Workflow Generation Dialog:
- Implement the exact layout shown in wireframes: 4/5 ASCII visualization + 1/5 refinement chat
- Build direct editing mode for ASCII workflow diagrams
- Create LLM Agent 2 chat interface for refinement requests

#### C. @ Symbol Tool Selector Update:
- Add "🔧 CUSTOM WORKFLOWS" section as shown in wireframes
- Display saved workflows with descriptions
- Integrate workflow execution into tool selection flow

## Technical Requirements & Implementation Instructions

Implement the complete Intelligent Workflow Generation system as meticulously detailed in `docs/18-intelligent-workflow-generation.md`. The implementation must be of **FULL PRODUCTION QUALITY**. This means:

- **No Example Code or Placeholders**: All implemented code must be fully functional, robust, and ready for a production environment. Do not use comments like `// TODO: Implement this` or leave any logic incomplete.
- **No Sample Data in Code**: The system should not rely on hardcoded sample data for its operation.
- **No Sample Logic**: All conditional paths, error handling, and core logic must be fully implemented.
- **Strict Adherence to Architecture**: All components, UI specifications, data flows, storage mechanisms, and technical considerations outlined in `docs/18-intelligent-workflow-generation.md` must be implemented precisely.
- **Exact Wireframe Implementation**: Follow the UI designs in `ui-wireframes-detailed.md` exactly, including layout proportions, component placements, and visual styling.

### Key Implementation Areas:

#### 1. Multi-Agent LLM Architecture:
- **LLM Agent 1**: Workflow Synthesizer & Visualizer (analyzes chat, generates ASCII workflow)
- **LLM Agent 2**: Workflow Refinement (interactive chat for user feedback and improvements)
- **LLM Agent 3**: Workflow Finalizer & Templater (converts to locked template format - hidden from user)

#### 2. Workflow Template System:
- Implement locked workflow template file: `src/core/workflow-template.schema.json`
- Ensure template compliance and validation
- Handle template versioning and backward compatibility

#### 3. UI Integration:
- Follow exact wireframe specifications for dialog layout
- Implement ASCII art editing with proper scrolling and syntax highlighting
- Create responsive layout that maintains 4/5 to 1/5 proportions
- Build refinement chat interface with proper message handling

#### 4. @ Symbol Integration:
- Update tool selector to include custom workflows section
- Implement workflow parameter input dialogs
- Handle workflow execution through existing tool router

**Validation**: The system must allow users to transform any chat conversation into a reusable workflow through an intuitive UI that matches the provided wireframes exactly. All workflows must be executable through the @ symbol system and persist between sessions.

**Integration Points**: Integrates with existing chat interface, tool router, and file system. Enhances @ symbol functionality with custom workflow support.

---

# PROMPT 10: LLM System Prompt Management UI

## Context & Objective

To further enhance user control, transparency, and the open nature of TanukiMCP Atlas, this phase introduces a dedicated **LLM System Prompt Management UI**. This interface will serve as a centralized hub where users can view, understand, and directly edit the system prompts that guide every LLM agent within the TanukiMCP Atlas ecosystem. This includes prompts for routing, planning, execution, specialized agent tasks (like workflow generation), and any other LLM-driven logic.

This feature is pivotal for allowing advanced users to customize AI behavior, troubleshoot, and gain deeper insights into the system's internal workings. The implementation must be of **FULL PRODUCTION QUALITY**, with no placeholders, sample data, or incomplete logic, and must strictly adhere to the architecture defined in `docs/19-llm-prompt-management-ui.md`.

## Architecture & UI Design References

**Primary Architecture Reference**: `docs/19-llm-prompt-management-ui.md` (LLM System Prompt Management UI)

**UI Design Reference**: `ui-wireframes-detailed.md` (Section: "🧠 NEW: LLM System Prompt Management UI (Prompt 10)")

## Critical UI Implementation Guidance

**MANDATORY**: You MUST consult and follow the detailed wireframes in `ui-wireframes-detailed.md` for precise UI specifications. The wireframes provide:

1. **Exact Three-Pane Layout**: The wireframes show the precise layout with Prompt List (searchable tree), Monaco Editor pane, and Metadata/Help pane with specific proportions and positioning.

2. **Tools Menu Integration**: The wireframes show exactly where to add "🧠 LLM Prompt Management" to the Tools menu and how it integrates with the existing menu structure.

3. **Component Structure**: Detailed breakdown of all UI components including the prompt categorization tree, editor interface, and metadata display panels.

4. **Settings Tab Integration**: The wireframes show how to add the new "🧠 LLM Prompts" tab to the Settings interface with summary statistics and quick actions.

5. **Comprehensive Prompt Coverage**: The wireframes detail all 43+ system prompts across every category from routing to workflow generation to communication layers.

### UI Components to Add/Update (From Wireframes):

#### A. Tools Menu Enhancement:
- Add "🧠 LLM Prompt Management" menu item to Tools menu as shown in wireframes
- Ensure proper menu item ordering and keyboard shortcuts

#### B. New LLM Prompt Management Interface:
- Implement the exact three-pane layout from wireframes
- Build searchable prompt tree with proper categorization
- Integrate Monaco Editor for prompt editing with syntax highlighting
- Create metadata and guidance pane with proper information display

#### C. Settings Tab Integration:
- Add "🧠 LLM Prompts" tab to Settings interface
- Show prompt statistics and quick action buttons
- Display validation status and modification summary

## Technical Requirements & Implementation Instructions

Implement the complete LLM System Prompt Management UI as meticulously detailed in `docs/19-llm-prompt-management-ui.md`. The implementation must be of **FULL PRODUCTION QUALITY**. This means:

- **No Example Code or Placeholders**: All implemented code must be fully functional, robust, and ready for a production environment. Do not use comments like `// TODO: Implement this` or leave any logic incomplete.
- **No Sample Data in Code**: The system should not rely on hardcoded sample data for its operation.
- **No Sample Logic**: All conditional paths, error handling, and core logic must be fully implemented.
- **Strict Adherence to Architecture**: All components, UI specifications, data flows, storage mechanisms, dynamic loading requirements, and technical considerations outlined in `docs/19-llm-prompt-management-ui.md` must be implemented precisely.
- **Exact Wireframe Implementation**: Follow the UI designs in `ui-wireframes-detailed.md` exactly, including layout proportions, component placements, and the comprehensive prompt categorization structure.

### Key Implementation Areas (Derived from `docs/19-llm-prompt-management-ui.md`):

#### 1. Prompt Discovery & Registry Implementation:
- Develop the **Centralized Registry** mechanism for storing all system prompts. Each prompt entry must include its unique identifier, human-readable name/description, associated agent/module, purpose, the default prompt text, and accommodate user-modified prompt text.
- Implement the **Prompt Discovery Service** to correctly identify and load all available system prompts (both default and user-modified versions) when the UI tab is accessed.
- Ensure a clear and comprehensive **Categorization/Organization** strategy for prompts within the UI, exactly as outlined in the wireframes.

#### 2. LLM System Prompt Management UI Development:
- Construct the UI tab/section with the specified multi-pane layout exactly as shown in wireframes.
- **Prompt Navigation/List Pane**: Implement a searchable, filterable list/tree view of all prompts. Clearly differentiate between default and user-modified prompts using the exact categorization structure from wireframes.
- **Prompt Editor Pane**: Implement Monaco Editor for editing system prompts with proper syntax highlighting and validation.
- **Metadata, Description, and Guidance Pane**: For the selected prompt, display its ID, detailed purpose/description, information on expected variables/context, guidance for editing, and a non-editable view of the **Default Prompt Text** for comparison.
- **Controls**: Implement fully functional "Save Changes", "Reset to Default", "Export Prompt", and "Import Prompt" buttons for individual prompts. Implement global controls like "Reset All to Default", "Export All Modified Prompts", and "Import All Modified Prompts", ensuring appropriate confirmation dialogues for destructive actions.

#### 3. Prompt Storage Mechanism:
- **Default Prompts Storage**: Integrate default prompts as part of the application build or version-controlled configuration files, ensuring they are treated as the baseline.
- **User-Modified Prompts Storage**: Implement a persistent storage solution (e.g., local user-specific database or configuration files) for user-modified prompts. This storage must reliably link modified prompts to their unique identifiers and be robust against data corruption.

#### 4. Dynamic Prompt Loading Implementation:
- Critically, refactor or design **all LLM agent instantiations and LLM API call sites** throughout the entire TanukiMCP Atlas system. These locations MUST dynamically load the active system prompt (user-modified if available, otherwise default) at runtime using the unique prompt identifiers.
- This dynamic loading must be efficient and reliable. Consider the implications for live-reloading of prompts versus requiring an application restart (live-reloading is highly preferred for optimal UX).

#### 5. Comprehensive Scope of Editable Prompts:
- Ensure that the UI provides access to **ALL system prompts** as detailed in the wireframes. This includes all categories: LLM Routing Layer, Task Processors, Workflow Generation, AI Agent Council, Execution Engine, Communication, Hybrid Mode Management, Failure Recovery, and Chat & UI Helpers.
- This requires a thorough audit of the entire TanukiMCP Atlas system to identify every LLM agent and its associated system prompt(s).

#### 6. Production-Quality Standards:
- **Comprehensive Error Handling**: For UI operations, file operations, data storage, prompt loading, etc.
- **State Management**: Clean and efficient state management for the UI.
- **Performance**: Efficient loading and display of prompts, quick save/reset operations. Dynamic prompt loading by agents should have minimal performance impact.
- **UI/UX Polish**: The interface must be intuitive, easy to navigate, and provide clear feedback to the user. It should also serve its educational purpose effectively.
- **Prompt Versioning Considerations**: While full version history for prompts might be complex, address how updates to default prompts in new application versions will interact with user-modified prompts (e.g., notification system, diff viewing, or option to adopt new default).
- **Code Quality**: Clean, well-documented, maintainable, and testable TypeScript code.

**Success Criterion**: A fully implemented LLM System Prompt Management UI that allows users to view and edit every system prompt used by any LLM agent in TanukiMCP Atlas. The system must dynamically use these prompts, provide mechanisms to revert to defaults, and adhere to the highest production-quality standards as defined in `docs/19-llm-prompt-management-ui.md`.

**This is a system-wide feature impacting all LLM agents. No part of this implementation should be stubbed or contain placeholder logic. Deliver a complete, working, production-quality interface and the underlying mechanisms for dynamic prompt management.**

## Validation
- The "LLM System Prompt Management" UI tab is accessible and loads correctly.
- All system prompts from every LLM agent across the TanukiMCP Atlas application are listed and correctly categorized exactly as shown in wireframes.
- Users can select any prompt and view its current text (default or modified) and its metadata/description.
- Users can successfully edit and save changes to any system prompt. These changes are persisted.
- The "Reset to Default" button correctly reverts a modified prompt to its original state.
- "Export" and "Import" functionalities for individual prompts work as expected.
- Global controls ("Reset All", "Export All Modified", "Import All Modified") function correctly with appropriate user confirmations.
- Crucially, changes made to a system prompt through the UI are dynamically loaded and used by the corresponding LLM agent(s) elsewhere in the application, demonstrably altering their behavior as expected.
- The system gracefully handles cases where a user-modified prompt might be syntactically valid but semantically problematic (the primary recourse being "Reset to Default").
- The UI is polished, responsive, and provides clear guidance and feedback.
- Consideration for default prompt updates in new application versions is evident in the design or documentation.

---

## 🎯 Final Implementation Notes

These enhanced prompts complete the TanukiMCP Atlas implementation:

- **Phase 7** delivers the complete IDE user interface with professional aesthetics and full functionality
- **Phase 8** provides enterprise-grade management and monitoring capabilities
- **Phase 9** adds intelligent workflow generation with multi-agent LLM architecture
- **Phase 10** provides comprehensive LLM prompt management for full system transparency

Each prompt builds incrementally on previous phases and **strictly references the detailed wireframes in `ui-wireframes-detailed.md` for exact UI specifications**. The wireframes provide definitive guidance on:

- Component layouts and proportions
- Integration points with existing UI
- Visual design and styling requirements
- Current implementation status indicators
- Comprehensive feature coverage

Focus on production-quality implementations with proper error handling, TypeScript typing, and performance optimization. The end result is a sophisticated, modular, local-only AI IDE that rivals commercial solutions while remaining completely free and private.

---

# PROMPT 10: LLM System Prompt Management UI

## Context & Objective

To further enhance user control, transparency, and the open nature of TanukiMCP Atlas, this phase introduces a dedicated **LLM System Prompt Management UI**. This interface will serve as a centralized hub where users can view, understand, and directly edit the system prompts that guide every LLM agent within the TanukiMCP Atlas ecosystem. This includes prompts for routing, planning, execution, specialized agent tasks (like workflow generation), and any other LLM-driven logic.

This feature is pivotal for allowing advanced users to customize AI behavior, troubleshoot, and gain deeper insights into the system's internal workings. The implementation must be of **FULL PRODUCTION QUALITY**, with no placeholders, sample data, or incomplete logic, and must strictly adhere to the architecture defined in `docs/19-llm-prompt-management-ui.md`.

## Architecture Reference

**Primary Reference**: `docs/19-llm-prompt-management-ui.md` (LLM System Prompt Management UI)

## Technical Requirements & Implementation Instructions

Implement the complete LLM System Prompt Management UI as meticulously detailed in `docs/19-llm-prompt-management-ui.md`. The implementation must be of **FULL PRODUCTION QUALITY**. This means:

-   **No Example Code or Placeholders**: All implemented code must be fully functional, robust, and ready for a production environment. Do not use comments like `// TODO: Implement this` or leave any logic incomplete.
-   **No Sample Data in Code**: The system should not rely on hardcoded sample data for its operation.
-   **No Sample Logic**: All conditional paths, error handling, and core logic must be fully implemented.
-   **Strict Adherence to Architecture**: All components, UI specifications, data flows, storage mechanisms, dynamic loading requirements, and technical considerations outlined in `docs/19-llm-prompt-management-ui.md` must be implemented precisely.

### Key Implementation Areas (Derived from `docs/19-llm-prompt-management-ui.md`):

#### 1.  Prompt Discovery & Registry Implementation:
    -   Develop the **Centralized Registry** mechanism for storing all system prompts. Each prompt entry must include its unique identifier, human-readable name/description, associated agent/module, purpose, the default prompt text, and accommodate user-modified prompt text.
    -   Implement the **Prompt Discovery Service** to correctly identify and load all available system prompts (both default and user-modified versions) when the UI tab is accessed.
    -   Ensure a clear and comprehensive **Categorization/Organization** strategy for prompts within the UI, as outlined in the architecture.

#### 2.  LLM System Prompt Management UI Development:
    -   Construct the UI tab/section with the specified multi-pane layout.
    -   **Prompt Navigation/List Pane**: Implement a searchable, filterable list/tree view of all prompts. Clearly differentiate between default and user-modified prompts.
    -   **Prompt Editor Pane**: Implement a text area suitable for editing potentially long and complex system prompts (consider using a component like Monaco Editor if appropriate for enhanced editing features, but ensure it integrates seamlessly). It must display the active prompt (user-modified or default).
    -   **Metadata, Description, and Guidance Pane**: For the selected prompt, display its ID, a detailed purpose/description, information on expected variables/context, guidance for editing, and a non-editable view of the **Default Prompt Text** for comparison.
    -   **Controls**: Implement fully functional "Save Changes", "Reset to Default", "Export Prompt", and "Import Prompt" buttons for individual prompts. Implement global controls like "Reset All to Default", "Export All Modified Prompts", and "Import All Modified Prompts", ensuring appropriate confirmation dialogues for destructive actions.

#### 3.  Prompt Storage Mechanism:
    -   **Default Prompts Storage**: Integrate default prompts as part of the application build or version-controlled configuration files, ensuring they are treated as the baseline.
    -   **User-Modified Prompts Storage**: Implement a persistent storage solution (e.g., local user-specific database or configuration files) for user-modified prompts. This storage must reliably link modified prompts to their unique identifiers and be robust against data corruption.

#### 4.  Dynamic Prompt Loading Implementation:
    -   Critically, refactor or design **all LLM agent instantiations and LLM API call sites** throughout the entire TanukiMCP Atlas system. These locations MUST dynamically load the active system prompt (user-modified if available, otherwise default) at runtime using the unique prompt identifiers.
    -   This dynamic loading must be efficient and reliable. Consider the implications for live-reloading of prompts versus requiring an application restart (live-reloading is highly preferred for optimal UX).

#### 5.  Comprehensive Scope of Editable Prompts:
    -   Ensure that the UI provides access to **ALL system prompts** as detailed in Section 4 ("Scope of Editable Prompts") of `docs/19-llm-prompt-management-ui.md`. This requires a thorough audit of the entire TanukiMCP Atlas system to identify every LLM agent and its associated system prompt(s).

#### 6.  Production-Quality Standards:
    -   **Comprehensive Error Handling**: For UI operations, file operations, data storage, prompt loading, etc.
    -   **State Management**: Clean and efficient state management for the UI.
    -   **Performance**: Efficient loading and display of prompts, quick save/reset operations. Dynamic prompt loading by agents should have minimal performance impact.
    -   **UI/UX Polish**: The interface must be intuitive, easy to navigate, and provide clear feedback to the user. It should also serve its educational purpose effectively.
    -   **Prompt Versioning Considerations**: While full version history for prompts might be complex, address how updates to default prompts in new application versions will interact with user-modified prompts (e.g., notification system, diff viewing, or option to adopt new default).
    -   **Code Quality**: Clean, well-documented, maintainable, and testable TypeScript code.

**Success Criterion**: A fully implemented LLM System Prompt Management UI that allows users to view and edit every system prompt used by any LLM agent in TanukiMCP Atlas. The system must dynamically use these prompts, provide mechanisms to revert to defaults, and adhere to the highest production-quality standards as defined in `docs/19-llm-prompt-management-ui.md`.

**This is a system-wide feature impacting all LLM agents. No part of this implementation should be stubbed or contain placeholder logic. Deliver a complete, working, production-quality interface and the underlying mechanisms for dynamic prompt management.**

## Validation
-   The "LLM System Prompt Management" UI tab is accessible and loads correctly.
-   All system prompts from every LLM agent across the TanukiMCP Atlas application are listed and correctly categorized.
-   Users can select any prompt and view its current text (default or modified) and its metadata/description.
-   Users can successfully edit and save changes to any system prompt. These changes are persisted.
-   The "Reset to Default" button correctly reverts a modified prompt to its original state.
-   "Export" and "Import" functionalities for individual prompts work as expected.
-   Global controls ("Reset All", "Export All Modified", "Import All Modified") function correctly with appropriate user confirmations.
-   Crucially, changes made to a system prompt through the UI are dynamically loaded and used by the corresponding LLM agent(s) elsewhere in the application, demonstrably altering their behavior as expected.
-   The system gracefully handles cases where a user-modified prompt might be syntactically valid but semantically problematic (the primary recourse being "Reset to Default").
-   The UI is polished, responsive, and provides clear guidance and feedback.
-   Consideration for default prompt updates in new application versions is evident in the design or documentation.