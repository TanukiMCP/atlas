import React from 'react';
import { PanelLayout } from '../../hooks/use-ui-store';

interface PanelManagerProps {
  layout: PanelLayout;
  onLayoutChange: (layout: Partial<PanelLayout>) => void;
  panels: {
    fileExplorer: React.ReactNode;
    chatInterface: React.ReactNode;
    workflowManager: React.ReactNode;
    toolOutput: React.ReactNode;
  };
}

export const PanelManager: React.FC<PanelManagerProps> = ({
  layout,
  onLayoutChange,
  panels
}) => {
  return (
    <div className="panel-manager">
      {/* Left Panel */}
      {layout.leftPanel.isVisible && (
        <div 
          className="panel border-r custom-scrollbar"
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
          <div className="panel-content">
            {layout.leftPanel.activeTab === 'fileExplorer' && panels.fileExplorer}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 min-h-0">
          {panels.chatInterface}
        </div>
        
        {/* Bottom Panel */}
        {layout.bottomPanel.isVisible && (
          <div 
            className="panel border-t custom-scrollbar"
            style={{ 
              height: layout.bottomPanel.height,
              minHeight: layout.bottomPanel.height 
            }}
          >
            <div className="panel-header">
              <div className="panel-title">
                {layout.bottomPanel.activeTab === 'terminal' ? 'Terminal' : 'Tool Output'}
              </div>
            </div>
            {panels.toolOutput}
          </div>
        )}
      </div>
      
      {/* Right Panel */}
      {layout.rightPanel.isVisible && (
        <div 
          className="panel border-l custom-scrollbar"
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
          <div className="panel-content">
            {layout.rightPanel.activeTab === 'workflowManager' && panels.workflowManager}
          </div>
        </div>
      )}
    </div>
  );
};