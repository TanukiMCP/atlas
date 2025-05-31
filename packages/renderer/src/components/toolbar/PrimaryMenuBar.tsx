import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '../ui/navigation-menu';
import { MenuDropdown } from './MenuDropdown';
import { SubjectModeDropdown } from './SubjectModeDropdown';
import { useTheme } from '../../contexts/ThemeContext';
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
  onViewChange: (view: string) => void;
  onFileExplorerToggle: () => void;
  subjectMode: string;
  onSubjectModeChange: (mode: string) => void;
  onOpenModelHub: () => void;
  onOpenLocalLLMHub: () => void;
}

export const PrimaryMenuBar: React.FC<PrimaryMenuBarProps> = ({
  onViewChange,
  onFileExplorerToggle,
  subjectMode,
  onSubjectModeChange,
  onOpenModelHub,
  onOpenLocalLLMHub
}) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New File', action: () => console.log('New File') },
        { label: 'Open File', action: () => console.log('Open File') },
        { label: 'Save', action: () => console.log('Save') },
        { label: 'Save As', action: () => console.log('Save As') },
        { type: 'separator' },
        { label: 'Exit', action: () => console.log('Exit') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', action: () => console.log('Undo') },
        { label: 'Redo', action: () => console.log('Redo') },
        { type: 'separator' },
        { label: 'Cut', action: () => console.log('Cut') },
        { label: 'Copy', action: () => console.log('Copy') },
        { label: 'Paste', action: () => console.log('Paste') }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle File Explorer', action: onFileExplorerToggle },
        { label: 'Toggle Theme', action: toggleTheme },
        { type: 'separator' },
        { label: 'Chat View', action: () => onViewChange('chat') },
        { label: 'Editor View', action: () => onViewChange('editor') },
        { label: 'Tools View', action: () => onViewChange('tools') }
      ]
    },
    {
      label: 'Tools',
      items: [
        { label: 'Model Hub', action: onOpenModelHub },
        { label: 'Local LLM Hub', action: onOpenLocalLLMHub },
        { type: 'separator' },
        { label: 'Settings', action: () => onViewChange('settings') }
      ]
    },
    {
      label: 'Models',
      items: [
        { label: 'OpenRouter Models', action: onOpenModelHub },
        { label: 'Local LLM Models', action: onOpenLocalLLMHub },
        { type: 'separator' },
        { label: 'Model Settings', action: () => onViewChange('settings') }
      ]
    },
    {
      label: 'Workflow Builder',
      items: [
        { label: 'New Workflow', action: () => onViewChange('workflows') },
        { label: 'Open Workflow', action: () => onViewChange('workflows') },
        { type: 'separator' },
        { label: 'Workflow Settings', action: () => onViewChange('settings') }
      ]
    }
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
                onViewChange('chat');
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
    <div className="flex items-center justify-between w-full gap-4 bg-background border-b border-border px-4 h-12">
      <div className="flex items-center gap-3">
        <div className="tanuki-brand flex items-center">
          <img 
            src="/assets/TanukiMCPLogo.png" 
            alt="TanukiMCP Logo" 
            className="h-6 w-auto mr-2"
          />
          <div className="tanuki-text font-semibold text-foreground">
            Tanuki<span className="text-orange-600">MCP</span> Atlas
          </div>
        </div>
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {menuItems.map(menu => (
              <NavigationMenuItem key={menu.label}>
                <MenuDropdown 
                  label={menu.label} 
                  items={menu.items}
                  className="menu-dropdown"
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div>
        <SubjectModeDropdown 
          currentMode={subjectMode} 
          onModeChange={onSubjectModeChange}
        />
      </div>
    </div>
  );
};