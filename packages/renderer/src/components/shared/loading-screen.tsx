import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Initializing TanukiMCP Atlas...", 
  progress,
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-background",
      className
    )}>
      <div className="text-center max-w-md mx-auto px-8">
        {/* TanukiMCP Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-primary-foreground text-4xl">🦝</span>
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-primary rounded-2xl mx-auto animate-ping opacity-20"></div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          🦝 TanukiMCP <span className="tanuki-gradient">Atlas</span>
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          AI-Powered Development Environment
        </p>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>

        {/* Loading Message */}
        <p className="text-muted-foreground text-sm animate-pulse">
          {message}
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
              🤖
            </div>
            <span>AI Assistant</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
              🛠️
            </div>
            <span>MCP Tools</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
              ⚡
            </div>
            <span>Workflows</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 