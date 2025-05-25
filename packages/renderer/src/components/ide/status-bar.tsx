import React from 'react';

interface StatusBarProps {
  currentMode: string;
  connectionStatus: string;
  activeTools: string[];
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentMode,
  connectionStatus,
  activeTools
}) => {
  return (
    <div style={{
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
          }} />
          <span>{connectionStatus}</span>
        </div>
        
        <div>
          Mode: {currentMode}
        </div>
        
        {activeTools.length > 0 && (
          <div>
            Active Tools: {activeTools.join(', ')}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>Ready</div>
        <div>Line 1, Col 1</div>
        <div>UTF-8</div>
      </div>
    </div>
  );
};