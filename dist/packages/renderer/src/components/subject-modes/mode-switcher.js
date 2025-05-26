"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeSwitcher = void 0;
const react_1 = __importDefault(require("react"));
const SUBJECT_MODES = [
    { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
    { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
    { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
    { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];
const ModeSwitcher = ({ currentMode, onModeChange }) => {
    return (<div className="mode-switcher">
      <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--color-text-secondary)',
            marginRight: '8px'
        }}>
        Subject Mode:
      </span>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {SUBJECT_MODES.map(mode => (<button key={mode.id} onClick={() => onModeChange(mode.id)} className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}>
            <span>{mode.icon}</span>
            <span>{mode.name}</span>
          </button>))}
      </div>
    </div>);
};
exports.ModeSwitcher = ModeSwitcher;
//# sourceMappingURL=mode-switcher.js.map