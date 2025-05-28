import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Plus, Search, Star, Zap } from 'lucide-react';

interface PromptManagementViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const PromptManagementView: React.FC<PromptManagementViewProps> = ({
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
            <Zap className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Prompt Management</h1>
              <p className="text-muted-foreground">Organize and optimize your AI prompts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </div>

        {/* Prompt Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Code Generation
              </CardTitle>
              <CardDescription>12 prompts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Documentation
              </CardTitle>
              <CardDescription>8 prompts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Analysis
              </CardTitle>
              <CardDescription>15 prompts</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Custom
              </CardTitle>
              <CardDescription>6 prompts</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Featured Prompts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Code Review Assistant
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <CardDescription>Comprehensive code review with suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm bg-muted/30 p-3 rounded-lg font-mono">
                    Review the following code for best practices, potential bugs, and optimization opportunities...
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Code</Badge>
                      <Badge variant="outline">Tier 3</Badge>
                    </div>
                    <Button variant="outline" size="sm">Use Prompt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    API Documentation Generator
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <CardDescription>Generate comprehensive API documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm bg-muted/30 p-3 rounded-lg font-mono">
                    Generate detailed API documentation for the following endpoints...
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Documentation</Badge>
                      <Badge variant="outline">Tier 2</Badge>
                    </div>
                    <Button variant="outline" size="sm">Use Prompt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Bug Analysis Expert
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <CardDescription>Deep analysis of bugs and error patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm bg-muted/30 p-3 rounded-lg font-mono">
                    Analyze the following error/bug and provide detailed debugging steps...
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Analysis</Badge>
                      <Badge variant="outline">Tier 4</Badge>
                    </div>
                    <Button variant="outline" size="sm">Use Prompt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Test Case Generator
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <CardDescription>Generate comprehensive test cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm bg-muted/30 p-3 rounded-lg font-mono">
                    Generate unit tests for the following function with edge cases...
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Testing</Badge>
                      <Badge variant="outline">Tier 2</Badge>
                    </div>
                    <Button variant="outline" size="sm">Use Prompt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prompt Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt Builder</CardTitle>
            <CardDescription>Create and customize your own prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Advanced prompt builder coming soon</p>
              <Button variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 