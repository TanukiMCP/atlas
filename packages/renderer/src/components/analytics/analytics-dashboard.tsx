import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

const METRICS: MetricCard[] = [
  { title: 'Total Tasks Completed', value: '1,247', change: '+12%', trend: 'up', icon: '✅' },
  { title: 'Workflow Executions', value: '856', change: '+8%', trend: 'up', icon: '⚡' },
  { title: 'Tools Used', value: '34', change: '+3', trend: 'up', icon: '🛠️' },
  { title: 'Success Rate', value: '94.7%', change: '-0.2%', trend: 'down', icon: '📊' }
];

const ACTIVITIES = [
  { id: 1, action: 'Workflow completed', time: '2 min ago', status: 'success' },
  { id: 2, action: 'Tool installed', time: '15 min ago', status: 'info' },
  { id: 3, action: 'Agent activated', time: '1 hour ago', status: 'success' }
];

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="p-5 bg-background border-b border-border">
        <h2 className="text-2xl font-bold mb-1">📊 Analytics Dashboard</h2>
        <p className="text-muted-foreground">Performance metrics and insights</p>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {METRICS.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{metric.icon}</span>
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVITIES.map(activity => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};