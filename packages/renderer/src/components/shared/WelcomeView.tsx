import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Code, 
  Workflow, 
  Settings, 
  Brain, 
  Zap,
  FileText,
  Monitor,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface WelcomeViewProps {
  onViewChange: (view: string) => void;
  isConnected: boolean;
  currentModel: string;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onViewChange,
  isConnected,
  currentModel
}) => {
  const quickActions = [
    {
      title: 'Start Chatting',
      description: 'Begin a conversation with your AI assistant',
      icon: MessageSquare,
      action: () => onViewChange('chat'),
      color: 'bg-blue-500',
    },
    {
      title: 'Open Editor',
      description: 'Start coding with AI-powered assistance',
      icon: Code,
      action: () => onViewChange('editor'),
      color: 'bg-green-500',
    },
    {
      title: 'Workflow Manager',
      description: 'Create and manage automated workflows',
      icon: Workflow,
      action: () => onViewChange('workflow-manager'),
      color: 'bg-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure your development environment',
      icon: Settings,
      action: () => onViewChange('settings'),
      color: 'bg-gray-500',
    },
  ];

  const features = [
    {
      title: 'Multi-Tier AI Processing',
      description: 'Intelligent routing from simple queries to complex analysis',
      icon: Brain,
    },
    {
      title: 'MCP Tool Integration',
      description: 'Seamless integration with Model Context Protocol tools',
      icon: Zap,
    },
    {
      title: 'Prompt Management',
      description: 'Organize and optimize your AI prompts',
      icon: FileText,
    },
    {
      title: 'Performance Monitoring',
      description: 'Track usage, costs, and performance metrics',
      icon: Monitor,
    },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl">🦝</div>
            <h1 className="text-4xl font-bold">TanukiMCP Atlas</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered development environment with advanced tool integration and intelligent processing
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? `Connected to ${currentModel}` : 'OpenRouter Disconnected'}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={action.action}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Getting Started</CardTitle>
                <CardDescription>Quick setup guide for optimal experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isConnected ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>1</div>
                <span className={isConnected ? 'line-through text-muted-foreground' : ''}>
                  Configure OpenRouter API key
                </span>
                {isConnected && <Badge variant="outline">✓ Complete</Badge>}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                <span>Configure your preferred AI models</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
                <span>Set up MCP tool connections</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">4</div>
                <span>Create your first workflow</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={() => onViewChange('settings')}>
                Open Settings <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your recent chats, workflows, and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity yet. Start a chat or create a workflow to see your history here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 