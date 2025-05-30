import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Play, 
  Square, 
  Bot, 
  MessageSquare, 
  Settings, 
  Brain, 
  Wrench,
  BarChart3,
  Save,
  TestTube,
  ZoomIn,
  ZoomOut,
  AlignCenter,
  ArrowLeft,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import MobileProxyToggle from './MobileProxyToggle';

interface ContextualToolbarProps {
  currentView: string;
  isProcessing?: boolean;
  agentMode?: boolean;
  onAgentModeToggle?: () => void;
  onStopProcessing?: () => void;
  onToolSelect?: () => void;
  onQuickSettings?: () => void;
  onViewChange?: (view: string) => void;
  onToggleMenu: () => void;
}

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  currentView,
  isProcessing = false,
  agentMode = false,
  onAgentModeToggle,
  onStopProcessing,
  onToolSelect,
  onQuickSettings,
  onViewChange,
  onToggleMenu
}) => {
  const renderChatToolbar = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
          <Button
            variant={agentMode ? "default" : "ghost"}
            size="sm"
            onClick={onAgentModeToggle}
            className="gap-1"
          >
            <Bot className="w-4 h-4" />
            Agent
          </Button>
          <Button
            variant={!agentMode ? "default" : "ghost"}
            size="sm"
            onClick={onAgentModeToggle}
            className="gap-1"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Button>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></div>
            Processing... (Press Enter to cancel)
          </Badge>
        )}

        {/* Current Mode Display */}
        <Badge variant="secondary" className="gap-1">
          {agentMode ? <Bot className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
          {agentMode ? 'Agent Mode' : 'Chat Mode'}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        {/* Processing Tier Indicator */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Brain className="w-4 h-4" />
              <Badge variant="outline">Tier 2</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <div className="font-medium">Processing Tier: Moderate</div>
                <div className="text-xs text-muted-foreground">Model: llama3.2:3b</div>
                <div className="text-xs text-muted-foreground">Tokens: 2,048 / 4,096</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chat Analytics */}
        <Button variant="ghost" size="sm">
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderWorkflowToolbar = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {/* New Workflow Elements */}
        <Button variant="outline" size="sm">Start</Button>
        <Button variant="outline" size="sm">Action</Button>
        <Button variant="outline" size="sm">Condition</Button>
        <Button variant="outline" size="sm">Loop</Button>
        <Button variant="outline" size="sm">End</Button>
      </div>

      <div className="flex items-center gap-1">
        {/* Save Workflow */}
        <Button variant="default" size="sm" className="gap-1">
          <Save className="w-4 h-4" />
          Save
        </Button>

        {/* Test Run */}
        <Button variant="outline" size="sm" className="gap-1">
          <TestTube className="w-4 h-4" />
          Test
        </Button>

        {/* Zoom Controls */}
        <Button variant="ghost" size="sm">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ZoomIn className="w-4 h-4" />
        </Button>

        {/* Align Tools */}
        <Button variant="ghost" size="sm">
          <AlignCenter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderDefaultToolbar = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {currentView !== 'chat' && onViewChange && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewChange('chat')} 
            className="gap-1"
            aria-label="Back to chat"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        {/* No buttons needed here, settings is in main menu */}
      </div>
    </div>
  );

  const renderToolbar = () => {
    switch (currentView) {
      case 'chat':
        return renderChatToolbar();
      case 'workflow-manager':
        return renderWorkflowToolbar();
      default:
        return renderDefaultToolbar();
    }
  };

  return (
    <div className="h-10 bg-background border-b border-border px-4 flex items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          size="sm"
          onClick={onToggleMenu}
          className="menu-button"
        >
          <Menu className="w-4 h-4" />
        </Button>
        <div className="h-4 mx-1 border-r border-border"></div>
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center ml-4">
        <MobileProxyToggle />
      </div>
      {renderToolbar()}
    </div>
  );
};