import React from 'react';
import { Minimize2, Maximize2, X, Square } from 'lucide-react';

interface WindowControlsProps {
  className?: string;
}

const WindowControls: React.FC<WindowControlsProps> = ({ className = '' }) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  React.useEffect(() => {
    // Check initial maximized state
    const checkMaximizedState = async () => {
      if (window.electronAPI?.isMaximized) {
        try {
          const maximized = await window.electronAPI.isMaximized();
          setIsMaximized(maximized);
        } catch (error) {
          console.error('Failed to check window maximized state:', error);
        }
      }
    };
    
    checkMaximizedState();
    
    // Listen for window state changes
    const handleMaximizedChange = (event: any, maximized: boolean) => {
      setIsMaximized(maximized);
    };
    
    if (window.electronAPI?.onWindowMaximized) {
      window.electronAPI.onWindowMaximized(handleMaximizedChange);
    }
    
    return () => {
      if (window.electronAPI?.removeAllListeners) {
        window.electronAPI.removeAllListeners('window-maximized-change');
      }
    };
  }, []);

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximizeWindow) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleMinimize}
        className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        title="Minimize"
      >
        <Minimize2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleMaximize}
        className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? <Square className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
      <button
        onClick={handleClose}
        className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WindowControls; 