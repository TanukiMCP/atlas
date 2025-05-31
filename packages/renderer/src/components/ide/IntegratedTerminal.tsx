import React, { useState, useEffect } from 'react';
import { TerminalPanel } from './terminal/TerminalPanel';
import { Button } from '../ui/button';
import { Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react';

interface IntegratedTerminalProps {
  workingDirectory?: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const IntegratedTerminal: React.FC<IntegratedTerminalProps> = ({
  workingDirectory,
  isVisible,
  onToggleVisibility,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [height, setHeight] = useState(300);
  const [startDragY, setStartDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Handle terminal maximization
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Start resizing the terminal
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartDragY(e.clientY);
    setIsDragging(true);
  };

  // Handle mouse movement during resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaY = startDragY - e.clientY;
        const newHeight = Math.max(150, Math.min(800, height + deltaY));
        setHeight(newHeight);
        setStartDragY(e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startDragY, height]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-0 right-0 p-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onToggleVisibility}
        >
          <TerminalIcon className="h-4 w-4" />
          <span>Terminal</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg transition-all duration-200 ${
        isMaximized ? 'top-0' : ''
      }`}
      style={{ height: isMaximized ? 'auto' : `${height}px` }}
    >
      {/* Resize handle */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-border cursor-ns-resize"
        onMouseDown={handleMouseDown}
      />

      <TerminalPanel
        workingDirectory={workingDirectory}
        onClose={onToggleVisibility}
        isMaximized={isMaximized}
        onMaximize={handleMaximize}
      />
    </div>
  );
};

export default IntegratedTerminal; 