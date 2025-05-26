import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Zap, Clock, Star, Crown } from 'lucide-react';

interface ProcessingTierIndicatorProps {
  currentTier: 'basic' | 'advanced' | 'premium' | 'enterprise';
  isActive: boolean;
  complexity: number;
  estimatedTime?: string;
  queuePosition?: number;
}

export const ProcessingTierIndicator: React.FC<ProcessingTierIndicatorProps> = ({
  currentTier,
  isActive,
  complexity,
  estimatedTime,
  queuePosition
}) => {
  const getTierConfig = (tier: string) => {
    const configs = {
      basic: { 
        color: 'bg-blue-500', 
        icon: <Zap className="h-4 w-4" />, 
        label: 'Basic',
        description: 'Standard processing'
      },
      advanced: { 
        color: 'bg-purple-500', 
        icon: <Clock className="h-4 w-4" />, 
        label: 'Advanced',
        description: 'Enhanced capabilities'
      },
      premium: { 
        color: 'bg-orange-500', 
        icon: <Star className="h-4 w-4" />, 
        label: 'Premium',
        description: 'Priority processing'
      },
      enterprise: { 
        color: 'bg-gradient-to-r from-purple-500 to-pink-500', 
        icon: <Crown className="h-4 w-4" />, 
        label: 'Enterprise',
        description: 'Maximum performance'
      }
    };
    return configs[tier as keyof typeof configs] || configs.basic;
  };

  const getComplexityLevel = (complexity: number) => {
    if (complexity <= 3) return { label: 'Simple', color: 'bg-green-500', progress: 25 };
    if (complexity <= 6) return { label: 'Moderate', color: 'bg-yellow-500', progress: 50 };
    if (complexity <= 8) return { label: 'Complex', color: 'bg-orange-500', progress: 75 };
    return { label: 'Advanced', color: 'bg-red-500', progress: 100 };
  };

  const tierConfig = getTierConfig(currentTier);
  const complexityInfo = getComplexityLevel(complexity);

  return (
    <div className="fixed top-20 right-5 w-72 z-40">
      <Card className="shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Processing Tier
            </CardTitle>
            {isActive && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tier Badge */}
          <div className="flex items-center gap-3">
            <Badge className={`${tierConfig.color} text-white px-3 py-1`}>
              <span className="mr-2">{tierConfig.icon}</span>
              {tierConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {tierConfig.description}
            </span>
          </div>

          {/* Complexity Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Complexity</span>
              <Badge variant="outline" className="text-xs">
                {complexityInfo.label} ({complexity}/10)
              </Badge>
            </div>
            <Progress value={complexityInfo.progress} className="h-2" />
          </div>

          {/* Additional Info */}
          {estimatedTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Time:</span>
              <span className="font-medium">{estimatedTime}</span>
            </div>
          )}

          {queuePosition && queuePosition > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Queue Position:</span>
              <Badge variant="secondary" className="text-xs">
                #{queuePosition}
              </Badge>
            </div>
          )}

          {/* Status */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {isActive ? 'Processing active' : 'Idle'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};