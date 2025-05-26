import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  details?: string;
}

interface ProgressTrackerProps {
  isVisible: boolean;
  title: string;
  steps: ProgressStep[];
  currentTier: 'basic' | 'advanced' | 'premium';
  onClose: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  isVisible,
  title,
  steps,
  currentTier,
  onClose
}) => {
  const getTierConfig = (tier: string) => {
    const configs = {
      basic: { color: 'bg-blue-500', icon: '🔵', label: 'Basic' },
      advanced: { color: 'bg-purple-500', icon: '🟣', label: 'Advanced' },
      premium: { color: 'bg-orange-500', icon: '🟠', label: 'Premium' }
    };
    return configs[tier as keyof typeof configs] || configs.basic;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const overallProgress = steps.length > 0 
    ? (steps.filter(s => s.status === 'completed').length / steps.length) * 100 
    : 0;

  const tierConfig = getTierConfig(currentTier);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-5 w-80 z-50">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {title || 'Processing Status'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Badge 
              className={`${tierConfig.color} text-white text-xs`}
            >
              <span className="mr-1">{tierConfig.icon}</span>
              {tierConfig.label} Tier
            </Badge>
            <span className="text-xs text-muted-foreground">
              {Math.round(overallProgress)}% Complete
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                  {step.label}
                </div>
                {step.details && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.details}
                  </div>
                )}
                {step.status === 'running' && step.progress !== undefined && (
                  <Progress value={step.progress} className="h-1 mt-2" />
                )}
              </div>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No active processes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};