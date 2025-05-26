"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const react_1 = __importDefault(require("react"));
const Toolbar = ({ currentMode, onModeChange, onAtSymbolTrigger, operationalMode = 'agent', onOperationalModeChange, onEmergencyStop, onShowProcessingTier, onShowToolPanel, isProcessing = false }) => {
    return (<div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Agent/Chat Mode Toggle */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
        }}>
          <button onClick={() => onOperationalModeChange?.('agent')} className={`btn btn-sm ${operationalMode === 'agent' ? 'btn-primary' : ''}`} style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600'
        }} title="Agent Mode - Full autonomous execution with tools">
            🤖 Agent
          </button>
          <button onClick={() => onOperationalModeChange?.('chat')} className={`btn btn-sm ${operationalMode === 'chat' ? 'btn-primary' : ''}`} style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600'
        }} title="Chat Mode - Conversational intelligence only">
            💬 Chat
          </button>
        </div>

        {/* Emergency Stop Button */}
        <button onClick={onEmergencyStop} className="btn btn-sm" style={{
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: isProcessing ? 'var(--color-error)' : 'var(--color-bg-tertiary)',
            color: isProcessing ? 'white' : 'var(--color-text-muted)',
            border: `1px solid ${isProcessing ? 'var(--color-error)' : 'var(--color-border)'}`,
            animation: isProcessing ? 'pulse 2s infinite' : 'none'
        }} title="Emergency Stop - Halt all operations">
          🛑 {isProcessing ? 'STOP' : 'STOP'}
        </button>
        
        <button onClick={onAtSymbolTrigger} className="btn btn-primary btn-sm">
          @ Tools
        </button>
        
        <div style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)'
        }}>
          Subject: <span style={{
            fontWeight: '500',
            color: 'var(--color-text-primary)'
        }}>{currentMode}</span>
          <span style={{
            margin: '0 8px',
            color: 'var(--color-border)'
        }}>|</span>
          Mode: <span style={{
            fontWeight: '500',
            color: operationalMode === 'agent' ? 'var(--color-accent)' : 'var(--color-accent-secondary)',
            textTransform: 'capitalize'
        }}>{operationalMode}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onShowProcessingTier} className="btn btn-sm" style={{ padding: '6px' }} title="Processing Tier Indicator">
          🧠
        </button>
        <button onClick={onShowToolPanel} className="btn btn-sm" style={{ padding: '6px' }} title="Tool Execution Panel">
          🛠️
        </button>
        <button className="btn btn-sm" style={{ padding: '6px' }} title="Settings">
          ⚙️
        </button>
        <button className="btn btn-sm" style={{ padding: '6px' }} title="Analytics">
          📊
        </button>
      </div>
    </div>);
};
exports.Toolbar = Toolbar;
//# sourceMappingURL=toolbar.js.map