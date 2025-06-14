import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Check, X, PlayCircle, AlertCircle, Code, Terminal, Database, PanelRight, Loader2 } from 'lucide-react';
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

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'border-yellow-300';
    case 'approved':
      return 'border-green-300';
    case 'rejected':
      return 'border-red-300';
    case 'executing':
      return 'border-blue-300';
    case 'completed':
      return 'border-green-300';
    case 'failed':
      return 'border-red-300';
    default:
      return 'border-gray-300';
  }
};

const ToolCallApprovalPanel: React.FC<ToolCallApprovalPanelProps> = ({
  toolCall,
  onApprove,
  onReject,
  onModify
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card 
      className={`w-full mb-3 ${getStatusBorderColor(toolCall.status)} shadow-md transition-all duration-300 ease-in-out
        ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${toolCall.status === 'executing' ? 'animate-pulse-subtle' : ''}
        ${toolCall.status === 'pending' ? 'hover:shadow-lg' : ''}
      `}
    >
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {getCategoryIcon(toolCall.category)}
            <span>{toolCall.toolName}</span>
            {toolCall.status === 'executing' && (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={`${getStatusColor(toolCall.status)} text-white`}>
              {toolCall.status === 'executing' ? 'Running...' : toolCall.status}
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
      
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
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
      </div>
      
      {toolCall.status === 'pending' && (
        <CardFooter className="pt-0">
          <Separator className="my-2" />
          <div className="flex justify-end gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReject}
              className="border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onApprove}
              className="border-green-300 hover:bg-green-50 hover:text-green-600 transition-colors"
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