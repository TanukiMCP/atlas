import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ExternalLink, Github, Heart, Zap, Users, Code } from 'lucide-react';

interface AboutViewProps {
  onViewChange: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onViewChange }) => {
  const appVersion = "1.0.0";
  const buildDate = new Date().toLocaleDateString();

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🦝</div>
          <h1 className="text-4xl font-bold">TanukiMCP Atlas</h1>
          <p className="text-xl text-muted-foreground">
            Advanced AI Intelligence Amplification Platform
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Version {appVersion}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                About TanukiMCP Atlas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                TanukiMCP Atlas is a revolutionary AI platform that proves smaller models (7B-32B parameters) 
                with sophisticated tool orchestration can outperform massive 500B+ parameter models at 1/10th the cost.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-Tiered Intelligence Processing</li>
                  <li>• OpenRouter Integration (Free Models)</li>
                  <li>• Model Context Protocol (MCP)</li>
                  <li>• Dual-Mode Operation (Agent & Chat)</li>
                  <li>• Intelligent Workflow Automation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Technical Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Technical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Version</div>
                  <div className="text-muted-foreground">{appVersion}</div>
                </div>
                <div>
                  <div className="font-medium">Build Date</div>
                  <div className="text-muted-foreground">{buildDate}</div>
                </div>
                <div>
                  <div className="font-medium">Platform</div>
                  <div className="text-muted-foreground">Electron + React</div>
                </div>
                <div>
                  <div className="font-medium">Architecture</div>
                  <div className="text-muted-foreground">Local-First</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Electron</Badge>
                  <Badge variant="secondary">OpenRouter</Badge>
                  <Badge variant="secondary">MCP</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Credits & Acknowledgments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="font-medium">OpenRouter</div>
                  <div className="text-sm text-muted-foreground">
                    AI model access and routing platform
                  </div>
                </div>
                <div>
                  <div className="font-medium">Anthropic</div>
                  <div className="text-sm text-muted-foreground">
                    Model Context Protocol (MCP) framework
                  </div>
                </div>
                <div>
                  <div className="font-medium">Open Source Community</div>
                  <div className="text-sm text-muted-foreground">
                    React, Electron, and TypeScript ecosystems
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Links & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => window.open('https://github.com/tanukimcp', '_blank')}
              >
                <Github className="w-4 h-4" />
                GitHub Repository
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => window.open('https://openrouter.ai', '_blank')}
              >
                <Zap className="w-4 h-4" />
                OpenRouter Platform
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => window.open('https://modelcontextprotocol.io', '_blank')}
              >
                <Code className="w-4 h-4" />
                Model Context Protocol
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for the AI community
          </p>
          <div className="mt-4">
            <Button onClick={() => onViewChange('chat')} className="gap-2">
              <Zap className="w-4 h-4" />
              Start Using TanukiMCP Atlas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 