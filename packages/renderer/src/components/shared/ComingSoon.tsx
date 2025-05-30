import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Clock, Star } from 'lucide-react';

interface ComingSoonProps {
  featureName: string;
  description?: string;
  onBackToChat?: () => void;
  expectedRelease?: string;
  icon?: React.ReactNode;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  featureName,
  description,
  onBackToChat,
  expectedRelease = "Future Release",
  icon
}) => {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            {icon || <Clock className="w-8 h-8 text-primary" />}
          </div>
          <CardTitle className="text-2xl">{featureName}</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {description || `The ${featureName} feature is currently under development and will be available in a future release.`}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            <span>Expected: {expectedRelease}</span>
          </div>

          {onBackToChat && (
            <Button 
              onClick={onBackToChat}
              variant="outline" 
              className="w-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 