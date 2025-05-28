import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  FileText, 
  FolderOpen, 
  Save, 
  Settings, 
  Download,
  Search,
  RotateCcw,
  Copy,
  Cut,
  Paste,
  Command,
  Terminal,
  Monitor,
  ToggleLeft,
  Maximize,
  Plus,
  Minus,
  RotateLeft,
  Zap,
  Play,
  Bug,
  HelpCircle,
  BookOpen,
  Keyboard,
  MessageSquare,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const handleMenuAction = (action: string) => {
    console.log(`Menu action: ${action}`);
    
    switch (action) {
      case 'new-chat':
        onViewChange('chat');
        break;
      case 'open-project':
        // TODO: Open file dialog
        break;
      case 'save-chat':
        // TODO: Export chat
        break;
      case 'settings':
        onViewChange('settings');
        break;
      case 'toggle-explorer':
        onFileExplorerToggle();
        break;
      case 'toggle-fullscreen':
        // TODO: Toggle fullscreen
        break;
      case 'command-palette':
        // TODO: Open command palette
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
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const currentMode = subjectModes.find(m => m.id === subjectMode) || subjectModes[0];

  return (
    <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
      {/* Left side: Logo + App Title + Subject Mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-xl">🦝</div>
          <span className="font-semibold text-foreground">TanukiMCP Atlas</span>
        </div>

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

      {/* Center: Menu Items */}
      <div className="flex items-center gap-1">
        {/* File Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">File</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleMenuAction('new-chat')}>
              <FileText className="w-4 h-4 mr-2" />
              New Chat
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('open-project')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Project...
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('save-chat')}>
              <Save className="w-4 h-4 mr-2" />
              Save Chat...
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+,</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.close()}>
              Exit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Edit</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RotateLeft className="w-4 h-4 mr-2" />
              Redo
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Cut className="w-4 h-4 mr-2" />
              Cut
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Copy
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Paste className="w-4 h-4 mr-2" />
              Paste
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Search className="w-4 h-4 mr-2" />
              Find
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+F</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">View</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleMenuAction('command-palette')}>
              <Command className="w-4 h-4 mr-2" />
              Command Palette
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Shift+P</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('toggle-explorer')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Toggle File Explorer
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Shift+E</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="w-4 h-4 mr-2" />
              Toggle Chat Panel
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Shift+H</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Terminal className="w-4 h-4 mr-2" />
              Toggle Terminal
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+`</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('toggle-fullscreen')}>
              <Maximize className="w-4 h-4 mr-2" />
              Toggle Fullscreen
              <span className="ml-auto text-xs text-muted-foreground">F11</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Zoom In
              <span className="ml-auto text-xs text-muted-foreground">Ctrl++</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Minus className="w-4 h-4 mr-2" />
              Zoom Out
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+-</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tools Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Tools</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleMenuAction('llm-prompt-management')}>
              <Zap className="w-4 h-4 mr-2" />
              LLM Prompt Management
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('tool-browser')}>
              <Settings className="w-4 h-4 mr-2" />
              Tool Browser
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+Shift+T</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('mcp-servers')}>
              <Monitor className="w-4 h-4 mr-2" />
              MCP Servers
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Play className="w-4 h-4 mr-2" />
              Execute Last Action
              <span className="ml-auto text-xs text-muted-foreground">F5</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('workflow-manager')}>
              <ToggleLeft className="w-4 h-4 mr-2" />
              Workflow Manager
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+F5</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bug className="w-4 h-4 mr-2" />
              Debug Mode
              <span className="ml-auto text-xs text-muted-foreground">F9</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('performance-monitor')}>
              <Monitor className="w-4 h-4 mr-2" />
              Performance Monitor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Help</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <BookOpen className="w-4 h-4 mr-2" />
              Welcome Guide
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="w-4 h-4 mr-2" />
              Documentation
              <span className="ml-auto text-xs text-muted-foreground">F1</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="w-4 h-4 mr-2" />
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="w-4 h-4 mr-2" />
              Report Issue...
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Check for Updates...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('about')}>
              <Info className="w-4 h-4 mr-2" />
              About TanukiMCP Atlas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side: Theme Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeToggle}
          className="p-2"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};