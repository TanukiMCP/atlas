import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Monitor, BarChart3, Activity, Clock, Cpu } from 'lucide-react';

interface PerformanceMonitorViewProps {
  onViewChange: (view: string) => void;
  currentModel: string;
  isConnected: boolean;
  subjectMode: string;
  agentMode: boolean;
  onProcessingChange: (processing: boolean) => void;
}

export const PerformanceMonitorView: React.FC<PerformanceMonitorViewProps> = ({
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
        <div className="flex items-center gap-3">
          <Monitor className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Performance Monitor</h1>
            <p className="text-muted-foreground">Track usage, costs, and performance metrics</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <div className="text-sm text-muted-foreground">Average response time</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                Token Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2K</div>
              <div className="text-sm text-muted-foreground">Tokens processed today</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Analytics
            </CardTitle>
            <CardDescription>Detailed performance metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Performance analytics coming soon</p>
              <p className="text-sm">Track response times, token usage, and cost analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};