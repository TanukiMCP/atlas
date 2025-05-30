import React, { useState, useEffect } from 'react';
import ToolCallApprovalPanel, { ToolCall } from './ToolCallApprovalPanel';
import VisualDiffView from '../diffing/VisualDiffView';
import { FileDiff, toolContextService } from '../../services/ToolContextService';
import { eventBus } from '../../services/event-bus';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { mcpService } from '../../services/mcp-service';

interface ToolCallsContainerProps {
  maxHeight?: string;
  onApprove?: (toolCall: ToolCall) => void;
  onReject?: (toolCall: ToolCall) => void;
  onDiffApprove?: (diff: FileDiff) => void;
  onDiffReject?: (diff: FileDiff) => void;
}

const RESIZE_KEY = 'toolCallsContainerHeight';
const TOOL_CALLS_COLLAPSE_KEY = 'toolCallsSectionCollapsed';
const FILE_DIFFS_COLLAPSE_KEY = 'fileDiffsSectionCollapsed';

const ToolCallsContainer: React.FC<ToolCallsContainerProps> = ({
  maxHeight = '300px',
  onApprove,
  onReject,
  onDiffApprove,
  onDiffReject
}) => {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [fileDiffs, setFileDiffs] = useState<{ id: string, diff: FileDiff }[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [height, setHeight] = useState<number>(() => {
    const saved = localStorage.getItem(RESIZE_KEY);
    return saved ? parseInt(saved, 10) : 300;
  });
  const [toolCallsCollapsed, setToolCallsCollapsed] = useState(() => {
    const saved = localStorage.getItem(TOOL_CALLS_COLLAPSE_KEY);
    return saved ? saved === 'true' : false;
  });
  const [fileDiffsCollapsed, setFileDiffsCollapsed] = useState(() => {
    const saved = localStorage.getItem(FILE_DIFFS_COLLAPSE_KEY);
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem(RESIZE_KEY, String(height));
  }, [height]);

  useEffect(() => {
    localStorage.setItem(TOOL_CALLS_COLLAPSE_KEY, String(toolCallsCollapsed));
  }, [toolCallsCollapsed]);

  useEffect(() => {
    localStorage.setItem(FILE_DIFFS_COLLAPSE_KEY, String(fileDiffsCollapsed));
  }, [fileDiffsCollapsed]);

  useEffect(() => {
    // Load existing pending tool calls and diffs
    setToolCalls(toolContextService.getPendingToolCalls());
    setFileDiffs(toolContextService.getPendingFileDiffs());

    // Listen for new tool calls
    const pendingToolSubscription = eventBus.on('tool:pending-approval', (toolCall: ToolCall) => {
      setToolCalls(prev => [...prev, toolCall]);
    });

    // Listen for tool approval/rejection
    const approvedToolSubscription = eventBus.on('tool:approved', (toolCall: ToolCall) => {
      setToolCalls(prev => prev.filter(tc => tc.id !== toolCall.id));
    });

    const rejectedToolSubscription = eventBus.on('tool:rejected', (toolCall: ToolCall) => {
      setToolCalls(prev => prev.filter(tc => tc.id !== toolCall.id));
    });

    // Listen for new file diffs
    const pendingDiffSubscription = eventBus.on('diff:pending-approval', (diffData: { id: string, diff: FileDiff }) => {
      setFileDiffs(prev => [...prev, diffData]);
    });

    // Listen for diff approval/rejection
    const approvedDiffSubscription = eventBus.on('diff:approved', (diffData: { id: string, diff: FileDiff }) => {
      setFileDiffs(prev => prev.filter(d => d.id !== diffData.id));
    });

    const rejectedDiffSubscription = eventBus.on('diff:rejected', (diffData: { id: string, diff: FileDiff }) => {
      setFileDiffs(prev => prev.filter(d => d.id !== diffData.id));
    });

    return () => {
      // Clean up subscriptions
      pendingToolSubscription();
      approvedToolSubscription();
      rejectedToolSubscription();
      pendingDiffSubscription();
      approvedDiffSubscription();
      rejectedDiffSubscription();
    };
  }, []);

  const handleToolApprove = async (toolCall: ToolCall) => {
    toolContextService.approveToolCall(toolCall.id);
    // Update status to executing
    setToolCalls(prev => prev.map(tc => tc.id === toolCall.id ? { ...tc, status: 'executing' } : tc));
    try {
      const result = await mcpService.executeTool({
        toolName: toolCall.toolName,
        parameters: toolCall.parameters,
        operationalMode: 'agent', // or derive from context if needed
      });
      setToolCalls(prev => prev.map(tc =>
        tc.id === toolCall.id
          ? { ...tc, status: result.success ? 'completed' : 'failed', result: result.result, error: result.error }
          : tc
      ));
    } catch (error: any) {
      setToolCalls(prev => prev.map(tc =>
        tc.id === toolCall.id
          ? { ...tc, status: 'failed', error: error instanceof Error ? error.message : String(error) }
          : tc
      ));
    }
    onApprove?.(toolCall);
  };

  const handleToolReject = (toolCall: ToolCall) => {
    toolContextService.rejectToolCall(toolCall.id);
    onReject?.(toolCall);
  };

  const handleDiffApprove = (id: string, diff: FileDiff) => {
    toolContextService.approveFileDiff(id);
    onDiffApprove?.(diff);
  };

  const handleDiffReject = (id: string, diff: FileDiff) => {
    toolContextService.rejectFileDiff(id);
    onDiffReject?.(diff);
  };

  // If no pending items and not minimized, don't render anything
  if (toolCalls.length === 0 && fileDiffs.length === 0 && !minimized) {
    return null;
  }

  // If minimized, show a floating button with count
  if (minimized) {
    const pendingCount = toolCalls.length + fileDiffs.length;
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          onClick={() => setMinimized(false)}
        >
          <span>Pending Actions</span>
          <Badge variant="secondary" className="bg-white text-primary">
            {pendingCount}
          </Badge>
        </button>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="vertical" className="w-[400px] fixed bottom-4 right-4 z-50 pointer-events-auto">
      <ResizablePanel minSize={80} maxSize={600} defaultSize={height} onResize={(size) => setHeight(size)}>
        <div className="border rounded-lg shadow-md bg-background overflow-hidden flex flex-col" style={{ height }}>
          <div className="p-3 bg-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Pending Tool Actions</h3>
              {toolCalls.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  {toolCalls.length} Tool Call{toolCalls.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {fileDiffs.length > 0 && (
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {fileDiffs.length} File Diff{fileDiffs.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setMinimized(true)}
                aria-label="Minimize"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {!collapsed && (
            <div style={{ maxHeight: height - 56, overflow: 'auto' }} className="p-4 space-y-4 flex-1">
              {/* Tool Calls Section */}
              <div className="mb-4">
                <button
                  className="flex items-center gap-2 font-medium text-sm mb-2 focus:outline-none"
                  onClick={() => setToolCallsCollapsed((c) => !c)}
                  aria-expanded={!toolCallsCollapsed}
                  aria-controls="tool-calls-section"
                >
                  {toolCallsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Tool Calls
                  {toolCalls.length > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      {toolCalls.length}
                    </Badge>
                  )}
                </button>
                <div id="tool-calls-section" hidden={toolCallsCollapsed}>
                  {toolCalls.length === 0 && <div className="text-xs text-muted-foreground">No pending tool calls.</div>}
                  {toolCalls.map((toolCall) => (
                    <ToolCallApprovalPanel
                      key={toolCall.id}
                      toolCall={toolCall}
                      onApprove={() => handleToolApprove(toolCall)}
                      onReject={() => handleToolReject(toolCall)}
                    />
                  ))}
                </div>
              </div>
              {/* File Diffs Section */}
              <div>
                <button
                  className="flex items-center gap-2 font-medium text-sm mb-2 focus:outline-none"
                  onClick={() => setFileDiffsCollapsed((c) => !c)}
                  aria-expanded={!fileDiffsCollapsed}
                  aria-controls="file-diffs-section"
                >
                  {fileDiffsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  File Diffs
                  {fileDiffs.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                      {fileDiffs.length}
                    </Badge>
                  )}
                </button>
                <div id="file-diffs-section" hidden={fileDiffsCollapsed}>
                  {fileDiffs.length === 0 && <div className="text-xs text-muted-foreground">No pending file diffs.</div>}
                  {fileDiffs.map(({ id, diff }) => (
                    <VisualDiffView
                      key={id}
                      diff={diff}
                      onApprove={() => handleDiffApprove(id, diff)}
                      onReject={() => handleDiffReject(id, diff)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
};

export default ToolCallsContainer; 