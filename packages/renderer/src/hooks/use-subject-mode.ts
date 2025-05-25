// Subject mode management hook for TanukiMCP Atlas
import { useState, useCallback } from 'react';
import { SubjectMode } from '../types/subject-types';

const DEFAULT_MODES: SubjectMode[] = [
  { id: 'general', name: 'General', icon: '🎯', color: 'blue' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'purple' },
  { id: 'programming', name: 'Programming', icon: '💻', color: 'green' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'teal' },
  { id: 'languages', name: 'Languages', icon: '🌍', color: 'orange' },
  { id: 'research', name: 'Research', icon: '📚', color: 'indigo' }
];

export const useSubjectMode = () => {
  const [currentMode, setCurrentMode] = useState<string>('general');
  const [availableModes] = useState<SubjectMode[]>(DEFAULT_MODES);

  const switchMode = useCallback((modeId: string) => {
    if (availableModes.find(mode => mode.id === modeId)) {
      setCurrentMode(modeId);
      // Here you could trigger mode-specific UI changes
      document.documentElement.setAttribute('data-subject-mode', modeId);
    }
  }, [availableModes]);

  const getCurrentModeConfig = useCallback(() => {
    return availableModes.find(mode => mode.id === currentMode);
  }, [currentMode, availableModes]);

  return {
    currentMode,
    availableModes,
    switchMode,
    getCurrentModeConfig
  };
};