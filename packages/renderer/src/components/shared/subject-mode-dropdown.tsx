import React, { useState, useRef, useEffect } from 'react';
import { SubjectMode } from '../../types/subject-types';

const SUBJECT_MODES: SubjectMode[] = [
  { id: 'general', name: 'General', icon: '🎯', color: 'blue', description: 'General purpose assistance and conversation' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple', description: 'Mathematical calculations, proofs, and analysis' },
  { id: 'programming', name: 'Programming', icon: '💻', color: 'green', description: 'Software development, coding, and technical tasks' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'teal', description: 'Scientific research, experiments, and analysis' },
  { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange', description: 'Language translation, learning, and linguistics' },
  { id: 'research', name: 'Research', icon: '📚', color: 'indigo', description: 'Academic research, literature review, and analysis' },
  { id: 'creative', name: 'Creative Writing', icon: '✍️', color: 'pink', description: 'Creative writing, storytelling, and content creation' },
  { id: 'business', name: 'Business Analysis', icon: '📊', color: 'emerald', description: 'Business strategy, analysis, and planning' },
  { id: 'education', name: 'Education', icon: '🎓', color: 'yellow', description: 'Teaching, learning, and educational content' },
  { id: 'data', name: 'Data Science', icon: '📈', color: 'cyan', description: 'Data analysis, visualization, and machine learning' }
];

interface SubjectModeDropdownProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

export const SubjectModeDropdown: React.FC<SubjectModeDropdownProps> = ({
  currentMode,
  onModeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentModeData = SUBJECT_MODES.find(mode => mode.id === currentMode) || SUBJECT_MODES[0];
  
  const filteredModes = SUBJECT_MODES.filter(mode =>
    mode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mode.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredModes.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredModes.length) % filteredModes.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredModes[selectedIndex]) {
            onModeChange(filteredModes[selectedIndex].id);
            setIsOpen(false);
            setSearchQuery('');
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredModes, selectedIndex, onModeChange]);

  const handleModeSelect = (mode: SubjectMode) => {
    onModeChange(mode.id);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const getModeColor = (color: string) => {
    const colors = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      green: '#10b981',
      teal: '#14b8a6',
      orange: '#f97316',
      indigo: '#6366f1',
      pink: '#ec4899',
      emerald: '#059669',
      yellow: '#eab308',
      cyan: '#06b6d4'
    };
    return colors[color as keyof typeof colors] || '#3b82f6';
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          minWidth: '180px',
          fontSize: '13px',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-tertiary)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
      >
        <span style={{ fontSize: '14px' }}>{currentModeData.icon}</span>
        <span style={{ 
          color: 'var(--color-text-primary)',
          flex: 1,
          textAlign: 'left'
        }}>
          {currentModeData.name}
        </span>
        <span style={{ 
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s ease'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Search Input */}
          <div style={{ padding: '12px' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search subject modes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="input"
              style={{
                width: '100%',
                fontSize: '13px',
                padding: '8px 12px'
              }}
            />
          </div>

          {/* Mode List */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {filteredModes.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '13px'
              }}>
                No modes found matching "{searchQuery}"
              </div>
            ) : (
              filteredModes.map((mode, index) => (
                <div
                  key={mode.id}
                  onClick={() => handleModeSelect(mode)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: index === selectedIndex 
                      ? 'var(--color-accent)' 
                      : mode.id === currentMode 
                        ? `${getModeColor(mode.color)}20`
                        : 'transparent',
                    borderLeft: mode.id === currentMode 
                      ? `3px solid ${getModeColor(mode.color)}`
                      : index === selectedIndex
                        ? '3px solid var(--color-accent)'
                        : '3px solid transparent',
                    transition: 'all 0.15s ease',
                    outline: index === selectedIndex ? '2px solid var(--color-accent)' : 'none',
                    outlineOffset: '-2px'
                  }}
                  onMouseEnter={(e) => {
                    setSelectedIndex(index);
                  }}
                  onMouseLeave={(e) => {
                    // Don't reset selection on mouse leave to maintain keyboard navigation
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '16px' }}>{mode.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: index === selectedIndex
                          ? 'white'
                          : mode.id === currentMode 
                            ? getModeColor(mode.color)
                            : 'var(--color-text-primary)'
                      }}>
                        {mode.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: index === selectedIndex
                          ? 'rgba(255, 255, 255, 0.8)'
                          : 'var(--color-text-muted)',
                        lineHeight: '1.3'
                      }}>
                        {mode.description}
                      </div>
                    </div>
                    {mode.id === currentMode && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getModeColor(mode.color)
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textAlign: 'center'
          }}>
            Use ↑↓ arrows to navigate, Enter to select, Esc to close
          </div>
        </div>
      )}
    </div>
  );
};