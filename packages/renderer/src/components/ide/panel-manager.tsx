import React from 'react';
import { TerminalPanel } from './terminal/TerminalPanel';

interface PanelManagerProps {
  layout: {
    leftPanel: {
      width: number;
      isVisible: boolean;
      activeTab: string;
    };
    rightPanel: {
      width: number;
      isVisible: boolean;
      activeTab: string;
    };
    bottomPanel: {
      height: number;
      isVisible: boolean;
      activeTab: string;
    };
  };
  onLayoutChange: (layout: any) => void;
  panels: {
    fileExplorer: React.ReactNode;
    centerPanel: React.ReactNode;
    bottomPanel?: React.ReactNode;
  };
  workingDirectory?: string;
}

export const PanelManager: React.FC<PanelManagerProps> = ({
  layout,
  onLayoutChange,
  panels,
  workingDirectory,
}) => {
  const handleTerminalClose = () => {
    onLayoutChange({
      ...layout,
      bottomPanel: {
        ...layout.bottomPanel,
        isVisible: false,
      },
    });
  };

  const handleTerminalMaximize = () => {
    onLayoutChange({
      ...layout,
      bottomPanel: {
        ...layout.bottomPanel,
        height: layout.bottomPanel.height === 500 ? 200 : 500,
      },
    });
  };

  return (
    <div className="panel-manager flex h-full w-full">
      {/* Left Panel (File Explorer) */}
      {layout.leftPanel.isVisible && (
        <div 
          className="panel border-r custom-scrollbar bg-color-bg-secondary"
          style={{ 
            width: layout.leftPanel.width,
            minWidth: layout.leftPanel.width 
          }}
        >
          <div className="panel-header">
            <div className="panel-title">
              {layout.leftPanel.activeTab === 'fileExplorer' ? 'File Explorer' : 'Panel'}
            </div>
          </div>
          <div className="panel-content h-full overflow-y-auto">
            {panels.fileExplorer}
          </div>
        </div>
      )}
      
      {/* Center Panel (Main Content) and Bottom Panel (Tool Output / Terminal) */}
      <div className="flex-1 flex flex-col min-w-0 bg-color-bg-primary">
        {/* Center Panel takes up most space */}
        <div className="flex-grow min-h-0 overflow-y-auto">
          {panels.centerPanel}
        </div>
        {/* Bottom Panel (Terminal) */}
        {layout.bottomPanel.isVisible && (
          <div 
            className="panel border-t custom-scrollbar bg-color-bg-secondary flex-shrink-0"
            style={{ 
              height: layout.bottomPanel.height,
              minHeight: layout.bottomPanel.height 
            }}
          >
            {layout.bottomPanel.activeTab === 'terminal' ? (
              <TerminalPanel
                workingDirectory={workingDirectory}
                onClose={handleTerminalClose}
                isMaximized={layout.bottomPanel.height > 200}
                onMaximize={handleTerminalMaximize}
              />
            ) : (
              panels.bottomPanel
            )}
          </div>
        )}
      </div>
      
      {/* Right Panel (Contextual Info / Workflows, Tools, Agents, Analytics) */}
      {layout.rightPanel.isVisible && (
        <div 
          className="panel border-l custom-scrollbar bg-color-bg-secondary"
          style={{ 
            width: layout.rightPanel.width,
            minWidth: layout.rightPanel.width 
          }}
        >
          <div className="panel-header">
            <div className="panel-title">
              {layout.rightPanel.activeTab === 'workflowManager' ? 'Workflow Manager' : 'Panel'}
            </div>
          </div>
          <div className="panel-content h-full overflow-y-auto">
            {/* Right panel content */}
          </div>
        </div>
      )}
    </div>
  );
};