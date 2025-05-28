import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Code, FileText, Play, Save } from 'lucide-react';

interface EditorViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
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
            <Code className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Code Editor</h1>
              <p className="text-muted-foreground">AI-powered development environment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="default" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              main.py
            </CardTitle>
            <CardDescription>Python script with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border rounded-lg p-4 font-mono text-sm min-h-[400px]">
              <div className="text-muted-foreground mb-4"># AI-powered code editor coming soon...</div>
              <div className="text-green-400"># This will include:</div>
              <div className="text-green-400"># - Syntax highlighting</div>
              <div className="text-green-400"># - AI code completion</div>
              <div className="text-green-400"># - Real-time error detection</div>
              <div className="text-green-400"># - Integrated debugging</div>
              <div className="text-green-400"># - MCP tool integration</div>
              <br />
              <div className="text-blue-400">print("Hello, TanukiMCP Atlas!")</div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Panel */}
        <Card>
          <CardHeader>
            <CardTitle>AI Code Assistant</CardTitle>
            <CardDescription>Get help with your code using AI-powered suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>AI code assistance will be available here.</p>
              <p className="text-sm mt-2">Ask questions about your code, get suggestions, or request refactoring help.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 