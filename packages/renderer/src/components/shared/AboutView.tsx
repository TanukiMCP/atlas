import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Info, Heart, Github, ExternalLink } from 'lucide-react';

interface AboutViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onViewChange,
  currentModel,
  isConnected,
  subjectMode,
  agentMode,
  onProcessingChange
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-6xl">🦝</div>
            <h1 className="text-4xl font-bold">TanukiMCP Atlas</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            AI-powered development environment with advanced tool integration
          </p>
          <Badge variant="outline" className="text-sm">Version 1.0.0</Badge>
        </div>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About TanukiMCP Atlas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              TanukiMCP Atlas is a next-generation AI development environment that combines 
              the power of large language models with advanced tool integration through the 
              Model Context Protocol (MCP). Built for developers who want to leverage AI 
              assistance without sacrificing control or functionality.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Key Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-tier AI processing architecture</li>
                  <li>• Seamless MCP tool integration</li>
                  <li>• Advanced prompt management</li>
                  <li>• Performance monitoring and analytics</li>
                  <li>• Workflow automation</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Technologies:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Electron for desktop</li>
                  <li>• Ollama for AI models</li>
                  <li>• Model Context Protocol</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Open Source
              </CardTitle>
              <CardDescription>Contribute to the project</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Support
              </CardTitle>
              <CardDescription>Get help and support</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Documentation
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
          <p>Made with ❤️ for developers who love AI-powered tools</p>
          <p className="mt-2">© 2024 TanukiMCP Atlas. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};