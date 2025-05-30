import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Monitor, 
  Zap, 
  Brain, 
  Database,
  Shield,
  Palette,
  Bell
} from 'lucide-react';

interface SettingsViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onViewChange,
  currentModel,
  isConnected,
  subjectMode,
  agentMode,
  onProcessingChange
}) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your TanukiMCP Atlas environment</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Models</TabsTrigger>
            <TabsTrigger value="tools">MCP Tools</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Application Settings
                </CardTitle>
                <CardDescription>Basic configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Subject Mode</label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="general">🤖 General AI</option>
                      <option value="math">🧠 Mathematics</option>
                      <option value="code">💻 Programming</option>
                      <option value="science">🔬 Science</option>
                      <option value="language">🗣️ Language</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Mode</label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="agent">🤖 Agent Mode</option>
                      <option value="chat">💬 Chat Mode</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Auto-save conversations</div>
                    <div className="text-sm text-muted-foreground">Automatically save chat history</div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Settings */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Model Configuration
                </CardTitle>
                <CardDescription>Manage your AI models and processing tiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium">OpenRouter Connection</div>
                      <div className="text-sm text-muted-foreground">
                        {isConnected ? `Connected to ${currentModel}` : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={isConnected ? 'default' : 'destructive'}>
                    {isConnected ? 'Active' : 'Offline'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Processing Tiers</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Tier 1 - Atomic</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Simple queries, quick responses</div>
                    </div>
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Tier 2 - Moderate</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Standard processing</div>
                    </div>
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">Tier 3 - Complex</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Advanced reasoning</div>
                    </div>
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Tier 4 - Expert</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Tool integration, complex tasks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCP Tools Settings */}
          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  MCP Tool Configuration
                </CardTitle>
                <CardDescription>Manage Model Context Protocol tools and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>MCP tool configuration will be available here.</p>
                  <Button variant="outline" className="mt-4" onClick={() => onViewChange('tool-browser')}>
                    Browse Available Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>Customize the look and feel of your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded mb-2"></div>
                    <div className="text-sm font-medium">Dark</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded mb-2"></div>
                    <div className="text-sm font-medium">Light</div>
                  </div>
                  <div className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-16 bg-gradient-to-br from-blue-900 to-purple-900 rounded mb-2"></div>
                    <div className="text-sm font-medium">System</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage security settings and data privacy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Security settings will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Advanced Configuration
                </CardTitle>
                <CardDescription>Advanced settings for power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Advanced configuration options will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 