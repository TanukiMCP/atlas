import React from 'react';
import { WelcomeViewProps } from '../types';

const WelcomeView: React.FC<WelcomeViewProps> = ({ onViewChange }) => {
  const features = [
    {
      id: 'chat',
      icon: '💬',
      title: 'Chat',
      description: 'Start a conversation with your AI assistant',
      view: 'chat' as const
    },
    {
      id: 'editor',
      icon: '📝',
      title: 'Editor',
      description: 'Code editing with AI assistance',
      view: 'editor' as const
    },
    {
      id: 'tools',
      icon: '🛠️',
      title: 'Tools',
      description: 'MCP tool integration',
      view: 'tools' as const
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-4xl">🦝</div>
          <h1 className="text-4xl font-bold">
            TanukiMCP <span className="tanuki-gradient">Atlas</span>
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered development environment is now working! 🎉
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id}
            onClick={() => onViewChange(feature.view)}
            className="p-6 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent/10 hover:border-primary/50 transition-all duration-200 group"
          >
            <div className="text-2xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeView; 