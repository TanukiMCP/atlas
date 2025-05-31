import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebglAddon } from '@xterm/addon-webgl';
import { Maximize2, Minimize2, X, Plus, Search as SearchIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  workingDirectory?: string;
  onClose?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  workingDirectory,
  onClose,
  onMaximize,
  isMaximized = false,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchAddonRef = useRef<SearchAddon | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [terminalPid, setTerminalPid] = useState<number | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const term = new XTerm({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      theme: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        cursor: 'var(--primary)',
        selectionBackground: 'var(--muted)',
      },
      cursorBlink: true,
      allowTransparency: true,
    });

    // Initialize addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();
    const unicode11Addon = new Unicode11Addon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);
    term.loadAddon(unicode11Addon);

    // Try to load WebGL addon for better performance
    try {
      const webgl = new WebglAddon();
      term.loadAddon(webgl);
    } catch (e) {
      console.warn('WebGL addon not supported:', e);
    }

    // Open terminal in container
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    setTerminal(term);
    searchAddonRef.current = searchAddon;
    fitAddonRef.current = fitAddon;

    // Initialize shell
    if (window.electronAPI?.invoke) {
      window.electronAPI.invoke('terminal:create', {
        cwd: workingDirectory,
      }).then((pid: number) => {
        setTerminalPid(pid);

        // Handle data from the terminal
        window.electronAPI?.on('terminal:data', (data: string) => {
          term.write(data);
        });

        // Send data to the terminal
        term.onData((data) => {
          window.electronAPI?.invoke('terminal:write', { pid, data });
        });
      });
    }

    // Handle window resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      if (terminalPid && window.electronAPI?.invoke) {
        window.electronAPI.invoke('terminal:cleanup', { pid: terminalPid });
      }
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [workingDirectory]);

  useEffect(() => {
    // Update working directory when it changes
    if (workingDirectory && window.electronAPI?.invoke) {
      window.electronAPI.invoke('terminal:cd', { path: workingDirectory });
    }
  }, [workingDirectory]);

  const handleSearch = (direction: 'forward' | 'backward' = 'forward') => {
    if (!searchAddonRef.current || !searchTerm) return;

    if (direction === 'forward') {
      searchAddonRef.current.findNext(searchTerm);
    } else {
      searchAddonRef.current.findPrevious(searchTerm);
    }
  };

  const createNewTerminal = () => {
    if (window.electronAPI?.invoke) {
      window.electronAPI.invoke('terminal:create', {
        cwd: workingDirectory,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-t border-border">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Terminal</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={createNewTerminal}
            title="New Terminal"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setSearchVisible(!searchVisible)}
            title="Search"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMaximize}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
            title="Close Terminal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {searchVisible && (
        <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-muted/30">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-7 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.shiftKey ? 'backward' : 'forward');
              }
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch('backward')}
            className="h-7 px-2"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch('forward')}
            className="h-7 px-2"
          >
            ↓
          </Button>
        </div>
      )}

      {/* Terminal Container */}
      <div ref={terminalRef} className="flex-1" />
    </div>
  );
}; 