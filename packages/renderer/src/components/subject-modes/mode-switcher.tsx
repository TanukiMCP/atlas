import React from 'react';
import { SubjectMode } from '../../types/subject-types';

const SUBJECT_MODES: SubjectMode[] = [
  { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
  { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
  { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
  { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];

interface ModeSwitcherProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div className="mode-switcher">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Subject Mode:
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {SUBJECT_MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
          >
            <span>{mode.icon}</span>
            <span>{mode.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};