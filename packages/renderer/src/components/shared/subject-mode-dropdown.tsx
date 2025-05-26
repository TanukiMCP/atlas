import React from 'react';
import { SubjectMode } from '../../types/subject-types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';

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
  const currentModeData = SUBJECT_MODES.find(mode => mode.id === currentMode) || SUBJECT_MODES[0];

  const getModeColorClass = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      green: 'text-green-500',
      teal: 'text-teal-500',
      orange: 'text-orange-500',
      indigo: 'text-indigo-500',
      pink: 'text-pink-500',
      emerald: 'text-emerald-500',
      yellow: 'text-yellow-500',
      cyan: 'text-cyan-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-blue-500';
  };

  return (
    <Select value={currentMode} onValueChange={onModeChange}>
      <SelectTrigger className="w-48">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-base">{currentModeData.icon}</span>
            <span className="font-medium">{currentModeData.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUBJECT_MODES.map((mode) => (
          <SelectItem key={mode.id} value={mode.id}>
            <div className="flex items-center gap-3 py-1">
              <span className="text-base">{mode.icon}</span>
              <div className="flex-1">
                <div className={`font-medium ${getModeColorClass(mode.color)}`}>
                  {mode.name}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {mode.description}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};