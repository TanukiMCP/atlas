import React, { useState } from 'react';

interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
}

interface SimpleDropdownProps {
  label: string;
  items: MenuItem[];
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 12px',
          fontSize: '13px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        {label}
      </button>
      
      {isOpen && (
        <div style={{
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
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action?.();
                setIsOpen(false);
              }}
              style={{
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
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-quaternary)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {item.shortcut}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};