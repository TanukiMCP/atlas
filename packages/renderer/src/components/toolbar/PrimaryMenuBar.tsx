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
  Menu,
  FileIcon,
  Edit,
  Eye,
  Wrench as Tool,
  Package as Box,
  GitBranch as Workflow,
  Server,
  Brain,
  Sparkles,
  FileCode,
  ShoppingBag,
  Image,
  Music,
  Cpu,
  Gamepad2,
  PenTool,
  Image as ImageIcon,
  Video,
  Dices
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
import { Badge } from '../ui/badge';

// Add type definition for electronAPI
declare global {
  interface Window {
    electronAPI?: {
      showOpenDialog: (options: any) => Promise<{canceled: boolean, filePaths: string[]}>;
      setWorkingDirectory: (path: string) => void;
    };
  }
}

interface PrimaryMenuBarProps {
  onThemeToggle: () => void;
  theme: string;
  onViewChange: (view: string) => void;
  onFileExplorerToggle: () => void;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  onOpenModelHub?: () => void;
  onOpenLocalLLMHub?: () => void;
  currentWorkingDirectory: string | null;
  onChangeWorkingDirectory: (dirPath: string) => Promise<void>;
}

export const PrimaryMenuBar: React.FC<PrimaryMenuBarProps> = ({
  onThemeToggle,
  theme,
  onViewChange,
  onFileExplorerToggle,
  subjectMode,
  onSubjectModeChange,
  onOpenModelHub,
  onOpenLocalLLMHub,
  currentWorkingDirectory,
  onChangeWorkingDirectory
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
                onChangeWorkingDirectory(dirPath);
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
        case 'models':
          if (onOpenModelHub) {
            onOpenModelHub();
          } else {
            onViewChange('models');
          }
          break;
        case 'mcp-tool-hub':
          onViewChange('mcp-tool-hub');
          break;
        case 'local-llm-hub':
          if (onOpenLocalLLMHub) {
            onOpenLocalLLMHub();
          } else {
            onViewChange('local-llm-hub');
          }
          break;
        case 'agent-training-hub':
          onViewChange('agent-training-hub');
          break;
        case 'agent-templates':
          onViewChange('agent-templates');
          break;
        case 'agent-marketplace':
          onViewChange('agent-marketplace');
          break;
        case 'image-generation':
          onViewChange('image-generation');
          break;
        case 'video-generation':
          onViewChange('video-generation');
          break;
        case 'audio-generation':
          onViewChange('audio-generation');
          break;
        case 'mcp-server-generator':
          onViewChange('mcp-server-generator');
          break;
        case 'server-templates':
          onViewChange('server-templates');
          break;
        case 'llm-game-engine':
          onViewChange('llm-game-engine');
          break;
        case 'game-asset-generator':
          onViewChange('game-asset-generator');
          break;
        case 'game-templates':
          onViewChange('game-templates');
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

  // Get the workspace display name from the current working directory
  const getWorkspaceDisplayName = () => {
    if (!currentWorkingDirectory) return 'Workspace';
    
    const parts = currentWorkingDirectory.split(/[\/\\]/);
    return parts[parts.length - 1] || 'Workspace';
  };

  return (
    <div className="flex items-center justify-between h-10 px-2 border-b border-border bg-background">
      {/* Left section */}
      <div className="flex items-center gap-2">
        {/* App Logo and Title */}
        <div className="flex items-center gap-2 mr-4">
          <img 
            src="/assets/TanukiMCPLogo.png" 
            alt="TanukiMCP Atlas" 
            className="w-6 h-6"
          />
          <span className="font-semibold text-sm">TanukiMCP: Atlas</span>
        </div>

        {/* File Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleMenuAction('new-chat')}>
              <FileText className="w-4 h-4 mr-2" />
              New Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('open-project')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Project...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('save-chat')}>
              <Save className="w-4 h-4 mr-2" />
              Save Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('export-chat')}>
              <Download className="w-4 h-4 mr-2" />
              Export Chat...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleMenuAction('undo')}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('copy')}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('cut')}>
              <Scissors className="w-4 h-4 mr-2" />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('paste')}>
              <ClipboardPaste className="w-4 h-4 mr-2" />
              Paste
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleMenuAction('toggle-explorer')}>
              <FileIcon className="w-4 h-4 mr-2" />
              Toggle Explorer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('toggle-fullscreen')}>
              <Maximize className="w-4 h-4 mr-2" />
              Toggle Fullscreen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onThemeToggle}>
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tools Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              Tools
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleMenuAction('command-palette')}>
              <Command className="w-4 h-4 mr-2" />
              Command Palette...
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('terminal')}>
              <Terminal className="w-4 h-4 mr-2" />
              Terminal
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('tool-browser')}>
              <Tool className="w-4 h-4 mr-2" />
              Tool Browser
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('mcp-servers')}>
              <Server className="w-4 h-4 mr-2" />
              MCP Servers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Models Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              Models
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={onOpenModelHub}>
              <Brain className="w-4 h-4 mr-2" />
              Model Hub
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenLocalLLMHub}>
              <Cpu className="w-4 h-4 mr-2" />
              Local LLM Store
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Workflow Builder Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={() => handleMenuAction('workflow-builder')}
        >
          <Workflow className="w-4 h-4 mr-2" />
          Workflow Builder
        </Button>

        {/* Coming Soon Features */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-6 px-2">
            <PenTool className="w-3 h-3 mr-1" />
            Agent Training Hub
          </Badge>
          <Badge variant="secondary" className="h-6 px-2">
            <ImageIcon className="w-3 h-3 mr-1" />
            AI Image/Video
          </Badge>
          <Badge variant="secondary" className="h-6 px-2">
            <MessageSquare className="w-3 h-3 mr-1" />
            MCP Server Generator
          </Badge>
          <Badge variant="secondary" className="h-6 px-2">
            <Gamepad2 className="w-3 h-3 mr-1" />
            2D Game Engine
          </Badge>
          <Badge variant="secondary" className="h-6 px-2">
            <Sparkles className="w-3 h-3 mr-1" />
            I.A.E.s
          </Badge>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <WindowControls />
      </div>

      <PwaInstallQrModal open={pwaModalOpen} onClose={() => setPwaModalOpen(false)} url={pwaUrl} />
    </div>
  );
};