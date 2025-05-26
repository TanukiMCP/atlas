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
exports.EnhancedDropdown = void 0;
const react_1 = __importStar(require("react"));
// Global state to track open dropdowns
let openDropdowns = new Set();
const dropdownCallbacks = new Map();
const EnhancedDropdown = ({ label, items, triggerMode = 'hover', direction = 'down', className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const dropdownId = (0, react_1.useRef)(Math.random().toString(36).substr(2, 9));
    const hoverTimeoutRef = (0, react_1.useRef)(null);
    const leaveTimeoutRef = (0, react_1.useRef)(null);
    const dropdownRef = (0, react_1.useRef)(null);
    // Close other dropdowns when this one opens
    const closeOtherDropdowns = () => {
        openDropdowns.forEach(id => {
            if (id !== dropdownId.current) {
                const callback = dropdownCallbacks.get(id);
                if (callback)
                    callback();
            }
        });
    };
    const openDropdown = () => {
        if (isOpen)
            return;
        closeOtherDropdowns();
        setIsOpen(true);
        openDropdowns.add(dropdownId.current);
    };
    const closeDropdown = () => {
        if (!isOpen)
            return;
        setIsOpen(false);
        openDropdowns.delete(dropdownId.current);
    };
    // Register close callback
    (0, react_1.useEffect)(() => {
        dropdownCallbacks.set(dropdownId.current, closeDropdown);
        return () => {
            dropdownCallbacks.delete(dropdownId.current);
            openDropdowns.delete(dropdownId.current);
        };
    }, []);
    // Click outside to close
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                closeDropdown();
            }
        };
        if (isOpen && typeof document !== 'undefined') {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);
    const handleMouseEnter = () => {
        if (triggerMode === 'hover') {
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            if (!isOpen) {
                hoverTimeoutRef.current = window.setTimeout(() => {
                    openDropdown();
                }, 100);
            }
        }
    };
    const handleMouseLeave = () => {
        if (triggerMode === 'hover') {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
            if (isOpen) {
                leaveTimeoutRef.current = window.setTimeout(() => {
                    closeDropdown();
                }, 200);
            }
        }
    };
    const handleDropdownMouseEnter = () => {
        if (triggerMode === 'hover' && leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    };
    const handleDropdownMouseLeave = () => {
        if (triggerMode === 'hover') {
            leaveTimeoutRef.current = window.setTimeout(() => {
                closeDropdown();
            }, 200);
        }
    };
    const handleClick = () => {
        if (triggerMode === 'click') {
            if (isOpen) {
                closeDropdown();
            }
            else {
                openDropdown();
            }
        }
    };
    const handleItemClick = (item) => {
        if (!item.disabled && item.action) {
            item.action();
            closeDropdown();
        }
    };
    const buttonStyle = {
        padding: '6px 12px',
        fontSize: '13px',
        fontWeight: 500,
        backgroundColor: isOpen ? '#f3f4f6' : 'transparent',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none'
    };
    const dropdownStyle = {
        position: 'absolute',
        top: direction === 'up' ? undefined : '100%',
        bottom: direction === 'up' ? '100%' : undefined,
        left: direction === 'right' ? '100%' : '0',
        right: direction === 'left' ? '100%' : undefined,
        marginTop: direction === 'down' ? '4px' : undefined,
        marginBottom: direction === 'up' ? '4px' : undefined,
        marginLeft: direction === 'right' ? '4px' : undefined,
        marginRight: direction === 'left' ? '4px' : undefined,
        minWidth: '200px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 1000,
        display: isOpen ? 'block' : 'none',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        transition: 'all 0.15s ease'
    };
    return (<div ref={dropdownRef} className={`relative ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      <button onClick={handleClick} style={buttonStyle} onMouseEnter={(e) => {
            if (!isOpen) {
                e.target.style.backgroundColor = '#f3f4f6';
            }
        }} onMouseLeave={(e) => {
            if (!isOpen) {
                e.target.style.backgroundColor = 'transparent';
            }
        }}>
        {label}
      </button>
      
      {/* Dropdown Menu */}
      <div style={dropdownStyle} onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
        <div style={{ padding: '4px 0' }}>
          {items.map((item, index) => item.type === 'separator' ? (<div key={index} style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '4px 8px'
            }}/>) : (<button key={index} onClick={() => handleItemClick(item)} disabled={item.disabled} style={{
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                fontSize: '13px',
                backgroundColor: 'transparent',
                border: 'none',
                color: item.disabled ? '#9ca3af' : '#374151',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.15s ease',
                opacity: item.disabled ? 0.5 : 1
            }} onMouseEnter={(e) => {
                if (!item.disabled) {
                    e.target.style.backgroundColor = '#f3f4f6';
                }
            }} onMouseLeave={(e) => {
                if (!item.disabled) {
                    e.target.style.backgroundColor = 'transparent';
                }
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon && <span style={{ fontSize: '14px' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (<span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                }}>
                    {item.shortcut}
                  </span>)}
              </button>))}
        </div>
      </div>
    </div>);
};
exports.EnhancedDropdown = EnhancedDropdown;
//# sourceMappingURL=enhanced-dropdown.js.map