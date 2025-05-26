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
exports.SimpleDropdown = void 0;
const react_1 = __importStar(require("react"));
const SimpleDropdown = ({ label, items }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    return (<div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
            padding: '6px 12px',
            fontSize: '13px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
        }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
        {label}
      </button>
      
      {isOpen && (<div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '4px',
                width: '200px',
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50,
                overflow: 'hidden'
            }}>
          {items.map((item, index) => item.type === 'separator' ? (<div key={index} style={{
                    height: '1px',
                    backgroundColor: 'var(--color-border)',
                    margin: '4px 0'
                }}/>) : (<button key={index} onClick={() => {
                    item.action?.();
                    setIsOpen(false);
                }} style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                <span>{item.label}</span>
                {item.shortcut && (<span style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                    {item.shortcut}
                  </span>)}
              </button>))}
        </div>)}
    </div>);
};
exports.SimpleDropdown = SimpleDropdown;
//# sourceMappingURL=simple-dropdown.js.map