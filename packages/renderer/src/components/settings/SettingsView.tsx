import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Settings, 
  Monitor, 
  Zap, 
  Brain, 
  Database,
  Shield,
  Palette,
  Bell,
  Save,
  Trash,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SettingsViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

interface SettingsState {
  defaultSubjectMode: string;
  defaultMode: string;
  autoSaveConversations: boolean;
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  lineHeight: number;
  openRouterApiKey: string;
  localLLMEnabled: boolean;
  notificationsEnabled: boolean;
  tokenLimit: number;
  autoUpdateTools: boolean;
  telemetryEnabled: boolean;
  hardwareAcceleration: boolean;
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
  const [settings, setSettings] = useState<SettingsState>({
    defaultSubjectMode: subjectMode || 'general',
    defaultMode: agentMode ? 'agent' : 'chat',
    autoSaveConversations: true,
    theme: 'system',
    fontSize: 14,
    lineHeight: 1.5,
    openRouterApiKey: '••••••••••••••••••••••••••',
    localLLMEnabled: false,
    notificationsEnabled: true,
    tokenLimit: 4000,
    autoUpdateTools: true,
    telemetryEnabled: false,
    hardwareAcceleration: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  // Mock function to simulate saving settings
  const saveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Success
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <ScrollArea className="h-full">
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Configure your TanukiMCP Atlas environment</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => onViewChange('chat')}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={saveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {saveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

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
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultSubjectMode">Default Subject Mode</Label>
                      <Select 
                        value={settings.defaultSubjectMode} 
                        onValueChange={(value) => handleSettingChange('defaultSubjectMode', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">🤖 General AI</SelectItem>
                          <SelectItem value="math">🧠 Mathematics</SelectItem>
                          <SelectItem value="code">💻 Programming</SelectItem>
                          <SelectItem value="science">🔬 Science</SelectItem>
                          <SelectItem value="language">🗣️ Language</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultMode">Default Mode</Label>
                      <Select 
                        value={settings.defaultMode} 
                        onValueChange={(value) => handleSettingChange('defaultMode', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">🤖 Agent Mode</SelectItem>
                          <SelectItem value="chat">💬 Chat Mode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Auto-save conversations</Label>
                        <p className="text-sm text-muted-foreground">Automatically save chat history</p>
                      </div>
                      <Switch 
                        checked={settings.autoSaveConversations}
                        onCheckedChange={(checked) => handleSettingChange('autoSaveConversations', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Enable desktop notifications</p>
                      </div>
                      <Switch 
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
                      />
                    </div>
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
                <CardContent className="space-y-6">
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
                    <Label htmlFor="openRouterApiKey">OpenRouter API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="openRouterApiKey" 
                        type={isApiKeyVisible ? "text" : "password"} 
                        value={settings.openRouterApiKey} 
                        onChange={(e) => handleSettingChange('openRouterApiKey', e.target.value)} 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                      >
                        {isApiKeyVisible ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter</a>
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Token Limit</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Current limit: {settings.tokenLimit.toLocaleString()} tokens</span>
                        <span className="text-sm text-muted-foreground">Max: 200,000</span>
                      </div>
                      <Slider
                        value={[settings.tokenLimit]}
                        min={1000}
                        max={200000}
                        step={1000}
                        onValueChange={(value) => handleSettingChange('tokenLimit', value[0])}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set the maximum token limit for context windows. Higher values use more resources.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Local LLM</Label>
                        <p className="text-sm text-muted-foreground">Use locally installed models when available</p>
                      </div>
                      <Switch 
                        checked={settings.localLLMEnabled}
                        onCheckedChange={(checked) => handleSettingChange('localLLMEnabled', checked)}
                      />
                    </div>
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
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Auto-update MCP tools</Label>
                      <p className="text-sm text-muted-foreground">Automatically update tools when new versions are available</p>
                    </div>
                    <Switch 
                      checked={settings.autoUpdateTools}
                      onCheckedChange={(checked) => handleSettingChange('autoUpdateTools', checked)}
                    />
                  </div>
                  
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Installed MCP Tools</h4>
                      <Button variant="outline" size="sm" onClick={() => onViewChange('tool-browser')}>
                        Browse Tools
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span>Desktop Commander</span>
                        </div>
                        <Badge variant="secondary">System</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span>Web Search</span>
                        </div>
                        <Badge variant="secondary">Web</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          <span>Smithery</span>
                        </div>
                        <Badge variant="secondary">Code</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => onViewChange('mcp-tool-hub')}>
                      Open MCP Tool Hub
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
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          settings.theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                        onClick={() => handleSettingChange('theme', 'dark')}
                      >
                        <div className="w-full h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded mb-2"></div>
                        <div className="text-sm font-medium">Dark</div>
                      </div>
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          settings.theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                        onClick={() => handleSettingChange('theme', 'light')}
                      >
                        <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-300 rounded mb-2"></div>
                        <div className="text-sm font-medium">Light</div>
                      </div>
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          settings.theme === 'system' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        }`}
                        onClick={() => handleSettingChange('theme', 'system')}
                      >
                        <div className="w-full h-16 bg-gradient-to-br from-blue-900 to-purple-900 rounded mb-2"></div>
                        <div className="text-sm font-medium">System</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
                      </div>
                      <Slider
                        id="fontSize"
                        value={[settings.fontSize]}
                        min={10}
                        max={20}
                        step={1}
                        onValueChange={(value) => handleSettingChange('fontSize', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="lineHeight">Line Height: {settings.lineHeight}</Label>
                      </div>
                      <Slider
                        id="lineHeight"
                        value={[settings.lineHeight * 10]}
                        min={10}
                        max={25}
                        step={1}
                        onValueChange={(value) => handleSettingChange('lineHeight', value[0] / 10)}
                      />
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
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Telemetry</Label>
                      <p className="text-sm text-muted-foreground">
                        Send anonymous usage data to help improve the application
                      </p>
                    </div>
                    <Switch 
                      checked={settings.telemetryEnabled}
                      onCheckedChange={(checked) => handleSettingChange('telemetryEnabled', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="flex gap-3">
                      <Button variant="outline">Export All Data</Button>
                      <Button variant="destructive">
                        <Trash className="w-4 h-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Export all your data or clear all stored data including conversations, settings, and cached files.
                    </p>
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
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Hardware Acceleration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable GPU acceleration for better performance
                      </p>
                    </div>
                    <Switch 
                      checked={settings.hardwareAcceleration}
                      onCheckedChange={(checked) => handleSettingChange('hardwareAcceleration', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">MCP Configuration File</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit the MCP configuration file directly. This file controls how MCP tools are loaded and configured.
                    </p>
                    <Button variant="outline" onClick={() => onViewChange('mcp-config')}>
                      Open MCP Config
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Developer Options</h4>
                    <div className="flex gap-3">
                      <Button variant="outline">Open Dev Tools</Button>
                      <Button variant="outline">Reload Application</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}; 