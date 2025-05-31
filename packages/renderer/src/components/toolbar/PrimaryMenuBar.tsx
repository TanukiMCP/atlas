import React from 'react';
import { Button } from '../ui/button';
import { 
  Sun, 
  Moon, 
  FileText, 
  FolderOpen, 
  Save, 
  Download,
  Search,
  RotateCcw,
  Copy,
  Scissors,
  ClipboardPaste,
  Command,
  Terminal,
  Monitor,
  ToggleLeft,
  Maximize,
  Plus,
  Minus,
  Zap,
  Play,
  Bug,
  HelpCircle,
  BookOpen,
  Keyboard,
  MessageSquare,
  Info,
  Settings,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import PwaInstallQrModal from '../desktop/PwaInstallQrModal';
import WindowControls from '../WindowControls';

interface PrimaryMenuBarProps {
  onThemeToggle: () => void;
  theme: string;
  onViewChange: (view: string) => void;
  onFileExplorerToggle: () => void;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
}

export const PrimaryMenuBar: React.FC<PrimaryMenuBarProps> = ({
  onThemeToggle,
  theme,
  onViewChange,
  onFileExplorerToggle,
  subjectMode,
  onSubjectModeChange
}) => {
  const subjectModes = [
    { id: 'general', label: '🤖 General AI', description: 'Multi-purpose assistance' },
    { id: 'math', label: '🧠 Mathematics', description: 'Advanced mathematical reasoning' },
    { id: 'code', label: '💻 Programming', description: 'Software development and coding' },
    { id: 'science', label: '🔬 Science', description: 'Scientific analysis and research' },
    { id: 'language', label: '🗣️ Language', description: 'Translation and linguistic analysis' },
    { id: 'creative', label: '🎨 Creative', description: 'Creative writing and ideation' },
    { id: 'business', label: '📊 Business', description: 'Business analysis and strategy' },
  ];

  const [pwaModalOpen, setPwaModalOpen] = React.useState(false);
  const pwaUrl = window.location.origin + '/mobile';

  const handleMenuAction = (action: string) => {
    console.log(`Menu action: ${action}`);
    
    try {
      switch (action) {
        case 'new-chat':
          onViewChange('chat');
          break;
        case 'open-project':
          // Use Electron dialog to open a directory
          if (window.electronAPI?.showOpenDialog) {
            window.electronAPI.showOpenDialog({ 
              properties: ['openDirectory'] 
            }).then((result) => {
              if (!result.canceled && result.filePaths.length > 0) {
                const dirPath = result.filePaths[0];
                console.log(`Opening directory: ${dirPath}`);
                if (window.electronAPI?.setWorkingDirectory) {
                  window.electronAPI.setWorkingDirectory(dirPath);
                }
              }
            }).catch(err => {
              console.error('Error showing open dialog:', err);
            });
          } else {
            alert('This feature requires Electron API access.');
          }
          break;
        case 'save-chat':
          // Show not implemented message
          alert('This feature is not yet implemented.');
          break;
        case 'settings':
          onViewChange('settings');
          break;
        case 'toggle-explorer':
          onFileExplorerToggle();
          break;
        case 'toggle-fullscreen':
          // Request fullscreen or exit fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {
              console.error('Error exiting fullscreen:', err);
            });
          } else {
            document.documentElement.requestFullscreen().catch(err => {
              console.error('Error requesting fullscreen:', err);
              alert('Failed to enter fullscreen mode. Your browser may not support this feature.');
            });
          }
          break;
        case 'command-palette':
          // Show not implemented message
          alert('Command palette not yet implemented.');
          break;
        case 'workflow-manager':
          onViewChange('workflow-manager');
          break;
        case 'llm-prompt-management':
          onViewChange('prompt-management');
          break;
        case 'tool-browser':
          onViewChange('tool-browser');
          break;
        case 'mcp-servers':
          onViewChange('mcp-servers');
          break;
        case 'performance-monitor':
          onViewChange('performance-monitor');
          break;
        case 'about':
          onViewChange('about');
          break;
        case 'welcome-guide':
          alert('Welcome guide not yet implemented.');
          break;
        case 'documentation':
          // Open documentation in browser
          window.open('https://github.com/user/tanukimcp-atlas/docs', '_blank');
          break;
        case 'keyboard-shortcuts':
          alert('Keyboard shortcuts guide not yet implemented.');
          break;
        case 'report-issue':
          window.open('https://github.com/user/tanukimcp-atlas/issues', '_blank');
          break;
        case 'check-updates':
          alert('Update checking not yet implemented.');
          break;
        case 'workflow-builder':
          onViewChange('workflow-builder');
          break;
        case 'install-mobile-app':
          setPwaModalOpen(true);
          break;
        default:
          console.log(`Unhandled action: ${action}`);
          alert('This feature is not yet implemented.');
      }
    } catch (error) {
      console.error('Error handling menu action:', error);
      alert('An error occurred while performing this action.');
    }
  };

  const currentMode = subjectModes.find(m => m.id === subjectMode) || subjectModes[0];

  return (
    <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4 select-none">
      {/* Left: Favicon, Chat Title, Subject Mode */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onViewChange('chat')}
          role="button"
          tabIndex={0}
          aria-label="Back to chat"
        >
          <div className="text-xl">🦝</div>
        </div>
        <span className="font-semibold text-foreground text-lg">TanukiMCP Chat</span>
        {/* Subject Mode Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentMode.label}
              <span className="text-xs text-muted-foreground">Mode</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {subjectModes.map((mode) => (
              <DropdownMenuItem
                key={mode.id}
                onClick={() => onSubjectModeChange(mode.id)}
                className="flex flex-col items-start p-3"
              >
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs text-muted-foreground">{mode.description}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Theme, Main Nav, Window Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Main menu">
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('settings')}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert('Coming Soon')}>File</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Coming Soon')}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Coming Soon')}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Coming Soon')}>Tools</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Coming Soon')}>Help</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <WindowControls className="ml-2" />
      </div>

      <PwaInstallQrModal open={pwaModalOpen} onClose={() => setPwaModalOpen(false)} url={pwaUrl} />
    </div>
  );
};