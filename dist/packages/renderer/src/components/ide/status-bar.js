"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
const react_1 = __importDefault(require("react"));
const StatusBar = ({ currentMode, connectionStatus, activeTools }) => {
    return (<div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? 'var(--color-success)' : 'var(--color-error)'
        }}/>
          <span>{connectionStatus}</span>
        </div>
        
        <div>
          Mode: {currentMode}
        </div>
        
        {activeTools.length > 0 && (<div>
            Active Tools: {activeTools.join(', ')}
          </div>)}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>Ready</div>
        <div>Line 1, Col 1</div>
        <div>UTF-8</div>
      </div>
    </div>);
};
exports.StatusBar = StatusBar;
//# sourceMappingURL=status-bar.js.map