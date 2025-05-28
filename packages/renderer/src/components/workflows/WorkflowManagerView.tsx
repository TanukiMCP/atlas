import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Workflow, Plus, Play, Settings } from 'lucide-react';

interface WorkflowManagerViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const WorkflowManagerView: React.FC<WorkflowManagerViewProps> = ({
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
            <Workflow className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Workflow Manager</h1>
              <p className="text-muted-foreground">Create and manage automated task sequences</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Workflows */}
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Code Review Workflow
              </CardTitle>
              <CardDescription>Automated code analysis and review process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">5 steps • Last run: 2h ago</span>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Documentation Generator
              </CardTitle>
              <CardDescription>Generate docs from code comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">3 steps • Never run</span>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Test Suite Runner
              </CardTitle>
              <CardDescription>Run tests and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">7 steps • Last run: 1d ago</span>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Workflow Builder</CardTitle>
            <CardDescription>Drag and drop to create custom workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Workflow className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Visual workflow builder coming soon</p>
              <p className="text-sm">Create complex automation workflows with a simple drag-and-drop interface</p>
              <Button variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create New Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 