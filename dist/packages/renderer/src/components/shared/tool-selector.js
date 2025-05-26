"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolSelector = void 0;
const react_1 = __importStar(require("react"));
const mcp_service_1 = require("../../services/mcp-service");
const ToolSelector = ({ isOpen, position, operationalMode, onToolSelect, onClose }) => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [availableTools, setAvailableTools] = (0, react_1.useState)([]);
    // Load tools from MCP service
    (0, react_1.useEffect)(() => {
        if (isOpen && mcp_service_1.mcpService.isReady()) {
            const tools = mcp_service_1.mcpService.getAvailableTools(operationalMode);
            setAvailableTools(tools);
        }
    }, [isOpen, operationalMode]);
    const filteredTools = searchQuery
        ? mcp_service_1.mcpService.searchTools(searchQuery, operationalMode)
        : availableTools;
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (!isOpen)
                return;
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % filteredTools.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredTools[selectedIndex]) {
                        onToolSelect(filteredTools[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredTools, selectedIndex, onToolSelect, onClose]);
    if (!isOpen)
        return null;
    const getCategoryColor = (category) => {
        switch (category) {
            case 'file': return 'var(--color-accent-secondary)';
            case 'code': return 'var(--color-accent)';
            case 'web': return '#4CAF50';
            case 'task': return '#FF9800';
            case 'project': return '#9C27B0';
            case 'thinking': return '#607D8B';
            default: return 'var(--color-text-muted)';
        }
    };
    return (<div style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000,
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '320px',
            maxWidth: '400px',
            maxHeight: '400px',
            overflow: 'hidden'
        }}>
      <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
        }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-text-primary)'
        }}>
            Tool Selection ({operationalMode} mode)
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'var(--color-text-muted)'
        }}>
            ×
          </button>
        </div>
        
        <input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input" style={{
            width: '100%',
            fontSize: '13px',
            padding: '6px 10px'
        }} autoFocus/>
      </div>

      <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '8px'
        }}>
        {filteredTools.length === 0 ? (<div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '13px'
            }}>
            No tools found matching "{searchQuery}"
          </div>) : (filteredTools.map((tool, index) => (<div key={tool.name} onClick={() => onToolSelect(tool)} style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? 'var(--color-bg-tertiary)' : 'transparent',
                border: index === selectedIndex ? '1px solid var(--color-accent)' : '1px solid transparent',
                marginBottom: '4px',
                transition: 'all 0.15s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span style={{ fontSize: '16px' }}>{tool.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                marginBottom: '2px'
            }}>
                    {tool.name}
                  </div>
                  <div style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.3'
            }}>
                    {tool.description}
                  </div>
                </div>
                <div style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: getCategoryColor(tool.category),
                color: 'white',
                fontWeight: '500',
                textTransform: 'uppercase'
            }}>
                  {tool.category}
                </div>
              </div>
            </div>)))}
      </div>

      <div style={{
            padding: '8px 12px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            fontSize: '11px',
            color: 'var(--color-text-muted)'
        }}>
        Use ↑↓ arrows to navigate, Enter to select, Esc to close
      </div>
    </div>);
};
exports.ToolSelector = ToolSelector;
//# sourceMappingURL=tool-selector.js.map