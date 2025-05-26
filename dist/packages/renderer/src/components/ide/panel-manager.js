"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelManager = void 0;
const react_1 = __importDefault(require("react"));
const PanelManager = ({ layout, onLayoutChange, panels }) => {
    return (<div className="panel-manager flex h-full w-full">
      {/* Left Panel (File Explorer) */}
      {layout.leftPanel.isVisible && (<div className="panel border-r custom-scrollbar bg-color-bg-secondary" style={{
                width: layout.leftPanel.width,
                minWidth: layout.leftPanel.width
            }}>
          <div className="panel-header">
            <div className="panel-title">
              {layout.leftPanel.activeTab === 'fileExplorer' ? 'File Explorer' : 'Panel'}
            </div>
          </div>
          <div className="panel-content h-full overflow-y-auto">
            {panels.fileExplorer}
          </div>
        </div>)}
      
      {/* Center Panel (Main Content) and Bottom Panel (Tool Output / Terminal) */}
      <div className="flex-1 flex flex-col min-w-0 bg-color-bg-primary">
        {/* Center Panel takes up most space */}
        <div className="flex-grow min-h-0 overflow-y-auto">
          {panels.centerPanel} {/* This will render Chat, Editor, Settings, etc. */}
        </div>
        {/* Bottom Panel (only rendered when there's actual content) */}
        {layout.bottomPanel.isVisible && panels.bottomPanel && (<div className="panel border-t custom-scrollbar bg-color-bg-secondary flex-shrink-0" style={{
                height: layout.bottomPanel.height,
                minHeight: layout.bottomPanel.height
            }}>
            {panels.bottomPanel}
          </div>)}
      </div>
      
      {/* Right Panel (Contextual Info / Workflows, Tools, Agents, Analytics) */}
      {layout.rightPanel.isVisible && (<div className="panel border-l custom-scrollbar bg-color-bg-secondary" style={{
                width: layout.rightPanel.width,
                minWidth: layout.rightPanel.width
            }}>
          <div className="panel-header">
            <div className="panel-title">
              {layout.rightPanel.activeTab === 'workflowManager' ? 'Workflow Manager' : 'Panel'}
            </div>
          </div>
          <div className="panel-content">
            {panels.rightPanel}
          </div>
        </div>)}
    </div>);
};
exports.PanelManager = PanelManager;
//# sourceMappingURL=panel-manager.js.map