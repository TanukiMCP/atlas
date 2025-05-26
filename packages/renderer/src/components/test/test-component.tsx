import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'red',
      color: 'white',
      fontSize: '16px'
    }}>
      <h3>TEST COMPONENT RENDERING</h3>
      <div>This should appear as styled HTML, not as text</div>
      <button>Test Button</button>
    </div>
  );
};