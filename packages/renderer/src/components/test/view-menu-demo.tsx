import React, { useState, useEffect } from 'react';
import { viewMenuService, ViewState, CommandPaletteItem } from '../../services/view-menu-service';

/**
 * View Menu Demo Component
 * Demonstrates all the functionality of the View Menu Service
 */
export const ViewMenuDemo: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>();
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CommandPaletteItem[]>([]);

  // Update state every 500ms to show real-time status
  useEffect(() => {
    const updateState = () => {
      setViewState(viewMenuService.getViewState());
    };

    updateState();
    const interval = setInterval(updateState, 500);
    return () => clearInterval(interval);
  }, []);

  // Update command palette search results when query changes
  useEffect(() => {
    if (commandPaletteQuery) {
      const results = viewMenuService.searchCommands(commandPaletteQuery);
      setSearchResults(results);
    } else {
      setSearchResults(viewMenuService.getCommandPaletteItems().slice(0, 10));
    }
  }, [commandPaletteQuery]);

  const handleCommandExecute = async (command: CommandPaletteItem) => {
    try {
      await command.action();
      setCommandPaletteQuery('');
    } catch (error) {
      console.error('Command execution failed:', error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#7c3aed', marginBottom: '20px' }}>
        👁️ View Menu Service Demo
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Panel Controls */}
        <div>
          <h3>📱 Panel Management</h3>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button 
                onClick={() => viewMenuService.toggleFileExplorer()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.fileExplorerVisible ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📁 File Explorer {viewState?.fileExplorerVisible ? '(Visible)' : '(Hidden)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleChatHistory()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.chatHistoryVisible ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💬 Chat History {viewState?.chatHistoryVisible ? '(Visible)' : '(Hidden)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleTerminalPanel()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.terminalPanelVisible ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💻 Terminal {viewState?.terminalPanelVisible ? '(Visible)' : '(Hidden)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleOutputPanel()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.outputPanelVisible ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📤 Output {viewState?.outputPanelVisible ? '(Visible)' : '(Hidden)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleProblemsPanel()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.problemsPanelVisible ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ⚠️ Problems {viewState?.problemsPanelVisible ? '(Visible)' : '(Hidden)'}
              </button>
            </div>
          </div>
        </div>

        {/* Layout Controls */}
        <div>
          <h3>🖥️ Layout & Display</h3>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button 
                onClick={() => viewMenuService.toggleFullscreen()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.isFullscreen ? '#dc2626' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {viewState?.isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Enter Fullscreen'}
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                <button 
                  onClick={() => viewMenuService.setLayoutMode('normal')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: viewState?.layoutMode === 'normal' ? '#059669' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📄 Normal
                </button>
                
                <button 
                  onClick={() => viewMenuService.setLayoutMode('zen')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: viewState?.layoutMode === 'zen' ? '#059669' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🧘 Zen
                </button>
                
                <button 
                  onClick={() => viewMenuService.setLayoutMode('presentation')}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: viewState?.layoutMode === 'presentation' ? '#059669' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📺 Present
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                <button 
                  onClick={() => viewMenuService.zoomOut()}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🔍 Zoom -
                </button>
                
                <button 
                  onClick={() => viewMenuService.resetZoom()}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  {Math.round((viewState?.currentZoom || 1) * 100)}%
                </button>
                
                <button 
                  onClick={() => viewMenuService.zoomIn()}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🔍 Zoom +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme & UI Controls */}
        <div>
          <h3>🎨 Theme & UI</h3>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button 
                onClick={() => viewMenuService.toggleTheme()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.currentTheme === 'dark' ? '#1f2937' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {viewState?.currentTheme === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleCompactMode()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.compactMode ? '#059669' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📱 Compact Mode {viewState?.compactMode ? '(On)' : '(Off)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleMinimap()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.showMinimap ? '#059669' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🗺️ Minimap {viewState?.showMinimap ? '(On)' : '(Off)'}
              </button>
              
              <button 
                onClick={() => viewMenuService.toggleBreadcrumbs()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: viewState?.showBreadcrumbs ? '#059669' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🍞 Breadcrumbs {viewState?.showBreadcrumbs ? '(On)' : '(Off)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Demo */}
      <div style={{ marginBottom: '20px' }}>
        <h3>⌘ Command Palette Demo</h3>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search commands... (try 'zoom', 'theme', 'toggle')"
              value={commandPaletteQuery}
              onChange={(e) => setCommandPaletteQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '4px'
          }}>
            {searchResults.map((command, index) => (
              <div
                key={command.id}
                onClick={() => handleCommandExecute(command)}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  ':hover': { backgroundColor: '#f9fafb' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{command.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'medium' }}>{command.label}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {command.category}
                      {command.shortcut && (
                        <span style={{ marginLeft: '8px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>
                          {command.shortcut}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current State Display */}
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h3 style={{ marginTop: 0, color: '#334155' }}>📊 Current View State</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          fontSize: '14px'
        }}>
          <div>
            <h4>Panel Visibility</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>📁 File Explorer: {viewState?.fileExplorerVisible ? '✅ Visible' : '❌ Hidden'}</li>
              <li>💬 Chat History: {viewState?.chatHistoryVisible ? '✅ Visible' : '❌ Hidden'}</li>
              <li>💻 Terminal: {viewState?.terminalPanelVisible ? '✅ Visible' : '❌ Hidden'}</li>
              <li>📤 Output: {viewState?.outputPanelVisible ? '✅ Visible' : '❌ Hidden'}</li>
              <li>⚠️ Problems: {viewState?.problemsPanelVisible ? '✅ Visible' : '❌ Hidden'}</li>
            </ul>
          </div>
          
          <div>
            <h4>Layout & Display</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>⛶ Fullscreen: {viewState?.isFullscreen ? '✅ On' : '❌ Off'}</li>
              <li>🔍 Zoom: {Math.round((viewState?.currentZoom || 1) * 100)}%</li>
              <li>📄 Layout Mode: {viewState?.layoutMode || 'normal'}</li>
              <li>⌘ Command Palette: {viewState?.commandPaletteOpen ? '✅ Open' : '❌ Closed'}</li>
            </ul>
          </div>
          
          <div>
            <h4>Theme & UI Settings</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>🎨 Theme: {viewState?.currentTheme || 'dark'}</li>
              <li>📱 Compact Mode: {viewState?.compactMode ? '✅ On' : '❌ Off'}</li>
              <li>🗺️ Minimap: {viewState?.showMinimap ? '✅ On' : '❌ Off'}</li>
              <li>🍞 Breadcrumbs: {viewState?.showBreadcrumbs ? '✅ On' : '❌ Off'}</li>
              <li>🔢 Line Numbers: {viewState?.showLineNumbers ? '✅ On' : '❌ Off'}</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
          <strong>💡 Pro Tip:</strong> All these controls are also accessible through the View menu in the toolbar 
          and via keyboard shortcuts! The state is automatically persisted and restored between sessions.
        </div>
      </div>
    </div>
  );
}; 