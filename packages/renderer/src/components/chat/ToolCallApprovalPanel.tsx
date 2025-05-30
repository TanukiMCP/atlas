import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Check, X, PlayCircle, AlertCircle, Code, Terminal, Database, PanelRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, any>;
  timestamp: Date;
  category?: 'file' | 'terminal' | 'data' | 'reasoning' | 'other';
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

interface ToolCallApprovalPanelProps {
  toolCall: ToolCall;
  onApprove: () => void;
  onReject: () => void;
  onModify?: (parameters: Record<string, any>) => void;
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'file':
      return <Code className="h-4 w-4" />;
    case 'terminal':
      return <Terminal className="h-4 w-4" />;
    case 'data':
      return <Database className="h-4 w-4" />;
    case 'reasoning':
      return <PanelRight className="h-4 w-4" />;
    default:
      return <PlayCircle className="h-4 w-4" />;
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'file':
      return 'bg-blue-500';
    case 'terminal':
      return 'bg-yellow-500';
    case 'data':
      return 'bg-green-500';
    case 'reasoning':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    case 'executing':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const ToolCallApprovalPanel: React.FC<ToolCallApprovalPanelProps> = ({
  toolCall,
  onApprove,
  onReject,
  onModify
}) => {
  return (
    <Card className="w-full border border-yellow-300 shadow-md animate-pulse-subtle">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor(toolCall.category)}`} />
            {toolCall.toolName}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={`${getStatusColor(toolCall.status)} text-white`}>
              {toolCall.status}
            </Badge>
            <Badge variant="outline" className="bg-muted">
              {new Date(toolCall.timestamp).toLocaleTimeString()}
            </Badge>
          </div>
        </div>
        {toolCall.description && (
          <p className="text-sm text-muted-foreground">{toolCall.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Parameters</h3>
            <ScrollArea className="h-24 rounded-md border p-2">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(toolCall.parameters, null, 2)}
              </pre>
            </ScrollArea>
          </div>
          
          {toolCall.status === 'failed' && toolCall.error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-xs">{toolCall.error}</p>
              </div>
            </div>
          )}
          
          {(toolCall.status === 'completed' || toolCall.status === 'failed') && toolCall.result && (
            <div>
              <h3 className="text-sm font-medium mb-1">Result</h3>
              <ScrollArea className="h-24 rounded-md border p-2">
                <pre className="text-xs whitespace-pre-wrap">
                  {typeof toolCall.result === 'object'
                    ? JSON.stringify(toolCall.result, null, 2)
                    : String(toolCall.result)}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
      
      {toolCall.status === 'pending' && (
        <CardFooter className="pt-0">
          <Separator className="my-2" />
          <div className="flex justify-end gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReject}
              className="border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onApprove}
              className="border-green-300 hover:bg-green-50 hover:text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ToolCallApprovalPanel; 