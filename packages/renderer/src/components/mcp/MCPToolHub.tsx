import React, { useState, useEffect } from 'react';
import { useMCPStore } from '../../stores/mcp-store';
import mcpConfigService from '../../services/MCPConfigService';
import MonacoEditor from '../MonacoEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Server, 
  Plus, 
  Trash2, 
  Settings, 
  RefreshCw, 
  Play, 
  Square, 
  Wrench, 
  FileCode, 
  Download,
  ExternalLink
} from 'lucide-react';

interface MCPToolHubProps {
  onClose?: () => void;
}

interface MCPTool {
  name: string;
  description: string;
  category: string;
  icon: string;
  operationalMode: 'agent' | 'chat' | 'both';
  available: boolean;
  parameters: any[];
  serverId: string;
  serverName: string;
}

export const MCPToolHub: React.FC<MCPToolHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isConfigEditorOpen, setIsConfigEditorOpen] = useState(false);
  const [configContent, setConfigContent] = useState('');
  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const [isInstallServerDialogOpen, setIsInstallServerDialogOpen] = useState(false);
  const [installCommand, setInstallCommand] = useState('');
  const [newServerForm, setNewServerForm] = useState({
    name: '',
    description: '',
    url: '',
    protocol: 'websocket' as 'websocket' | 'http',
    autoConnect: true,
    enabled: true,
  });
  
  const { 
    availableTools, 
    refreshAvailableTools, 
    servers, 
    connectToServer, 
    disconnectFromServer,
    installedServers,
    startInstalledServer,
    stopInstalledServer
  } = useMCPStore();

  // Load MCP configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await mcpConfigService.loadConfig();
        setConfigContent(JSON.stringify(config, null, 2));
      } catch (error) {
        console.error('Failed to load MCP config:', error);
        setConfigContent(JSON.stringify({
          version: "1.0.0",
          servers: [],
          settings: {
            autoDiscovery: true,
            discoveryPorts: [8765, 8766, 8767, 8768, 8769, 8770],
            discoveryTimeout: 5000,
            healthCheckInterval: 30000,
            autoReconnect: true,
            maxReconnectAttempts: 5
          },
          toolCategories: []
        }, null, 2));
      }
    };
    
    loadConfig();
  }, []);

  // Refresh tools on mount
  useEffect(() => {
    refreshAvailableTools();
  }, [refreshAvailableTools]);

  // Filter tools based on search and category
  const filteredTools = availableTools.filter((tool: MCPTool) => {
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(availableTools.map((tool: MCPTool) => tool.category))];

  // Handle config save
  const handleSaveConfig = async () => {
    try {
      const configObj = JSON.parse(configContent);
      await mcpConfigService.saveConfig();
      setIsConfigEditorOpen(false);
      
      // Refresh tools and servers
      refreshAvailableTools();
    } catch (error) {
      console.error('Failed to save MCP config:', error);
      alert('Failed to save configuration. Please check the JSON syntax.');
    }
  };

  // Handle add server
  const handleAddServer = async () => {
    try {
      await mcpConfigService.addServer({
        ...newServerForm,
        capabilities: []
      });
      
      setIsAddServerDialogOpen(false);
      setNewServerForm({
        name: '',
        description: '',
        url: '',
        protocol: 'websocket',
        autoConnect: true,
        enabled: true,
      });
      
      // Refresh config
      const config = await mcpConfigService.loadConfig();
      setConfigContent(JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to add server:', error);
    }
  };

  // Handle install server
  const handleInstallServer = async () => {
    try {
      // Execute the install command
      // This would typically be handled by the main process
      console.log('Installing server with command:', installCommand);
      
      // For now, we'll just close the dialog
      setIsInstallServerDialogOpen(false);
      setInstallCommand('');
      
      // In a real implementation, we would monitor the installation
      // and add the server to the installed servers list when complete
    } catch (error) {
      console.error('Failed to install server:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">MCP Tool Hub</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refreshAvailableTools()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setIsConfigEditorOpen(true)}>
            <FileCode className="w-4 h-4 mr-2" />
            Edit Config
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="tools" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Available Tools
            </TabsTrigger>
            <TabsTrigger value="servers" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              MCP Servers
            </TabsTrigger>
            <TabsTrigger value="installed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Installed Servers
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="tools" className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 rounded border bg-background"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredTools.length} tools available
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool: MCPTool) => (
                <Card key={tool.name} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tool.icon}</span>
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                      <Badge variant={tool.available ? 'default' : 'outline'}>
                        {tool.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {tool.serverName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{tool.description}</p>
                    
                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Parameters:</p>
                        <div className="text-xs space-y-1">
                          {tool.parameters.map((param, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="font-mono">{param.name}</span>
                              {param.required && <span className="text-red-500">*</span>}
                              <span className="text-muted-foreground">({param.type})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full">
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {tool.operationalMode === 'both' 
                          ? 'Agent & Chat' 
                          : tool.operationalMode === 'agent' 
                            ? 'Agent Only' 
                            : 'Chat Only'}
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="servers" className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connected MCP Servers</h2>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddServerDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsInstallServerDialogOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Install Server
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {servers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🖥️</div>
                  <p className="text-muted-foreground">No MCP servers configured</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add a server or install an MCP server package to get started
                  </p>
                </div>
              ) : (
                servers.map((server) => (
                  <Card key={server.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{server.name}</CardTitle>
                        <Badge 
                          variant={
                            server.status === 'connected' ? 'default' :
                            server.status === 'connecting' ? 'secondary' :
                            server.status === 'error' ? 'destructive' : 'outline'
                          }
                        >
                          {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {server.url}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Protocol:</span>
                        <span>{server.protocol}</span>
                      </div>
                      
                      {server.capabilities && server.capabilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Capabilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {server.capabilities.map((capability, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-2">
                        {server.status === 'connected' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectFromServer(server.id)}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => connectToServer(server.id)}
                            disabled={server.status === 'connecting'}
                          >
                            Connect
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            try {
                              await mcpConfigService.removeServer(server.id);
                              const config = await mcpConfigService.loadConfig();
                              setConfigContent(JSON.stringify(config, null, 2));
                            } catch (error) {
                              console.error('Failed to remove server:', error);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="installed" className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Installed MCP Servers</h2>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsInstallServerDialogOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Install Server
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {installedServers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-muted-foreground">No MCP servers installed</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Install an MCP server package to get started
                  </p>
                </div>
              ) : (
                installedServers.map((server) => (
                  <Card key={server.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{server.name}</CardTitle>
                          <CardDescription className="text-xs">
                            v{server.version}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            server.status === 'running' ? 'default' :
                            server.status === 'installed' ? 'secondary' :
                            server.status === 'error' ? 'destructive' : 'outline'
                          }
                        >
                          {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{server.description}</p>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>Installed: {new Date(server.installDate).toLocaleDateString()}</div>
                        {server.lastStarted && (
                          <div>Last started: {new Date(server.lastStarted).toLocaleDateString()}</div>
                        )}
                        <div>Path: {server.path}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-2">
                        {server.status === 'running' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => stopInstalledServer(server.id)}
                          >
                            <Square className="w-3 h-3 mr-2" />
                            Stop
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startInstalledServer(server.id)}
                            disabled={server.status === 'error'}
                          >
                            <Play className="w-3 h-3 mr-2" />
                            Start
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Wrench className="w-4 h-4" />
                          <span className="sr-only">Configure</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Uninstall server
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Uninstall</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Config Editor Dialog */}
      <Dialog open={isConfigEditorOpen} onOpenChange={setIsConfigEditorOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit MCP Configuration</DialogTitle>
            <DialogDescription>
              This file controls MCP server connections and tool discovery.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 border rounded-md overflow-hidden">
            <MonacoEditor
              value={configContent}
              onChange={setConfigContent}
              language="json"
              theme="vs-dark"
              height="100%"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Server Dialog */}
      <Dialog open={isAddServerDialogOpen} onOpenChange={setIsAddServerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add MCP Server</DialogTitle>
            <DialogDescription>
              Connect to an existing MCP server.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newServerForm.name}
                onChange={(e) => setNewServerForm({ ...newServerForm, name: e.target.value })}
                placeholder="My MCP Server"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newServerForm.description}
                onChange={(e) => setNewServerForm({ ...newServerForm, description: e.target.value })}
                placeholder="Description of the server"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                value={newServerForm.url}
                onChange={(e) => setNewServerForm({ ...newServerForm, url: e.target.value })}
                placeholder="ws://localhost:8765"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Protocol</label>
              <select
                value={newServerForm.protocol}
                onChange={(e) => setNewServerForm({ ...newServerForm, protocol: e.target.value as 'websocket' | 'http' })}
                className="w-full p-2 rounded border bg-background"
              >
                <option value="websocket">WebSocket</option>
                <option value="http">HTTP</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoConnect"
                  checked={newServerForm.autoConnect}
                  onChange={(e) => setNewServerForm({ ...newServerForm, autoConnect: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="autoConnect" className="text-sm">Auto Connect</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={newServerForm.enabled}
                  onChange={(e) => setNewServerForm({ ...newServerForm, enabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-sm">Enabled</label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddServer}>
              Add Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Install Server Dialog */}
      <Dialog open={isInstallServerDialogOpen} onOpenChange={setIsInstallServerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Install MCP Server</DialogTitle>
            <DialogDescription>
              Install an MCP server package from npm or a GitHub repository.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Installation Command</label>
              <Input
                value={installCommand}
                onChange={(e) => setInstallCommand(e.target.value)}
                placeholder="npx @tanukimcp/clear-thought-server"
              />
              <p className="text-xs text-muted-foreground">
                Enter an npm install command or GitHub repository URL
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Popular MCP Servers</p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setInstallCommand('npx @tanukimcp/clear-thought-server')}
                >
                  <div>
                    <div className="font-medium">Clear Thought Server</div>
                    <div className="text-xs text-muted-foreground">Advanced reasoning and thinking tools</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setInstallCommand('npx @tanukimcp/desktop-commander')}
                >
                  <div>
                    <div className="font-medium">Desktop Commander</div>
                    <div className="text-xs text-muted-foreground">File system operations and command execution</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setInstallCommand('npx @tanukimcp/puppeteer-server')}
                >
                  <div>
                    <div className="font-medium">Puppeteer Server</div>
                    <div className="text-xs text-muted-foreground">Web automation and browser control</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <a 
                href="https://github.com/tanukimcp/server-registry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Browse MCP Server Registry
              </a>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInstallServerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInstallServer}>
              Install
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCPToolHub; 