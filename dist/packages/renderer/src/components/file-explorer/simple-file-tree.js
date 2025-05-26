"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleFileTree = void 0;
const react_1 = __importDefault(require("react"));
const SimpleFileTree = ({ onFileSelect }) => {
    const mockFiles = [
        { name: 'src', type: 'directory', icon: '📁' },
        { name: 'public', type: 'directory', icon: '📁' },
        { name: 'package.json', type: 'file', icon: '⚙️' },
        { name: 'README.md', type: 'file', icon: '📝' }
    ];
    return (<div style={{
            height: '100%',
            backgroundColor: 'var(--color-bg-secondary)',
            display: 'flex',
            flexDirection: 'column'
        }}>
      {/* Header */}
      <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-primary)',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)'
        }}>
        📁 File Explorer
      </div>
      
      {/* File List */}
      <div style={{
            flex: 1,
            padding: '8px',
            overflowY: 'auto'
        }}>
        {mockFiles.map((file, index) => (<div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                marginBottom: '2px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'background-color 0.15s ease'
            }} onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }} onClick={() => onFileSelect?.(file)}>
            <span style={{ fontSize: '14px' }}>{file.icon}</span>
            <span>{file.name}</span>
          </div>))}
      </div>
    </div>);
};
exports.SimpleFileTree = SimpleFileTree;
//# sourceMappingURL=simple-file-tree.js.map