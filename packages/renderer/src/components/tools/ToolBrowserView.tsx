import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wrench, Search, Download, Settings, Zap } from 'lucide-react';

interface ToolBrowserViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const ToolBrowserView: React.FC<ToolBrowserViewProps> = ({
  onViewChange,
  currentModel,
  isConnected,
  subjectMode,
  agentMode,
  onProcessingChange
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Tool Browser</h1>
              <p className="text-muted-foreground">Browse and manage MCP tools and integrations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search Tools
            </Button>
            <Button variant="default" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                File Operations
              </CardTitle>
              <CardDescription>Read, write, and manipulate files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">@file_read</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@file_write</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@file_search</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Web & Network
              </CardTitle>
              <CardDescription>Web scraping and API calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">@web_search</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@api_call</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@web_scrape</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                Code Execution
              </CardTitle>
              <CardDescription>Execute and analyze code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">@code_execute</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@code_analyze</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">@test_runner</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Available MCP Tools</CardTitle>
            <CardDescription>Install and configure additional tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>MCP tool marketplace coming soon</p>
              <Button variant="outline" className="mt-4">
                <Download className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 