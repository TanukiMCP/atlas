import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

interface TerminalPanelProps {
  workingDirectory?: string;
  onClose?: () => void;
  isMaximized?: boolean;
  onMaximize?: () => void;
}

interface TerminalTab {
  id: string;
  workingDirectory?: string;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  workingDirectory,
  onClose,
  isMaximized,
  onMaximize,
}) => {
  const [terminals, setTerminals] = useState<TerminalTab[]>([
    { id: '1', workingDirectory },
  ]);
  const [activeTerminal, setActiveTerminal] = useState('1');

  const addTerminal = () => {
    const newId = (terminals.length + 1).toString();
    setTerminals([...terminals, { id: newId, workingDirectory }]);
    setActiveTerminal(newId);
  };

  const removeTerminal = (id: string) => {
    if (terminals.length === 1) {
      // Don't remove the last terminal
      return;
    }

    const newTerminals = terminals.filter((t) => t.id !== id);
    setTerminals(newTerminals);

    if (activeTerminal === id) {
      // If we're removing the active terminal, activate the last one
      setActiveTerminal(newTerminals[newTerminals.length - 1].id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Tabs */}
      <div className="flex items-center gap-1 px-2 py-1 bg-muted/30 border-b border-border">
        {terminals.map((terminal) => (
          <div
            key={terminal.id}
            className={`
              flex items-center gap-1 px-3 py-1 text-xs rounded-md cursor-pointer
              ${
                activeTerminal === terminal.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }
            `}
            onClick={() => setActiveTerminal(terminal.id)}
          >
            <span>Terminal {terminal.id}</span>
            {terminals.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTerminal(terminal.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={addTerminal}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Terminal */}
      {terminals.map((terminal) => (
        <div
          key={terminal.id}
          className={`flex-1 ${
            activeTerminal === terminal.id ? 'block' : 'hidden'
          }`}
        >
          <Terminal
            workingDirectory={terminal.workingDirectory}
            onClose={onClose}
            isMaximized={isMaximized}
            onMaximize={onMaximize}
          />
        </div>
      ))}
    </div>
  );
}; 