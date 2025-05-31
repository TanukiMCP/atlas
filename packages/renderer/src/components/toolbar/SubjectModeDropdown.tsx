import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Brain } from 'lucide-react';

interface SubjectModeDropdownProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

const subjectModes = [
  { id: 'general', label: '🤖 General AI', description: 'Multi-purpose assistance' },
  { id: 'math', label: '🧠 Mathematics', description: 'Advanced mathematical reasoning' },
  { id: 'code', label: '💻 Programming', description: 'Software development and coding' },
  { id: 'science', label: '🔬 Science', description: 'Scientific analysis and research' },
  { id: 'language', label: '🗣️ Language', description: 'Translation and linguistic analysis' },
  { id: 'creative', label: '🎨 Creative', description: 'Creative writing and ideation' },
  { id: 'business', label: '📊 Business', description: 'Business analysis and strategy' },
];

export const SubjectModeDropdown: React.FC<SubjectModeDropdownProps> = ({
  currentMode,
  onModeChange
}) => {
  const currentModeData = subjectModes.find(mode => mode.id === currentMode) || subjectModes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Brain className="w-4 h-4" />
          {currentModeData.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {subjectModes.map(mode => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className="flex flex-col items-start py-2"
          >
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs text-muted-foreground">{mode.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 