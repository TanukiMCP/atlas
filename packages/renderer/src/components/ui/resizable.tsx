import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "../../lib/utils";
import React from "react";

export const ResizablePanelGroup = PanelGroup;
export const ResizablePanel = Panel;

interface ResizableHandleProps extends React.ComponentProps<typeof PanelResizeHandle> {
  withHandle?: boolean;
  className?: string;
}

export const ResizableHandle = ({ 
  withHandle = false, 
  className, 
  ...props 
}: ResizableHandleProps) => {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex items-center justify-center w-1.5 h-full bg-border transition-colors hover:bg-primary data-[panel-group-direction=vertical]:h-1.5 data-[panel-group-direction=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="absolute z-10 flex items-center justify-center w-3 h-8 -ml-0.5 rounded-sm border border-border bg-background group-hover:bg-muted data-[panel-group-direction=vertical]:h-3 data-[panel-group-direction=vertical]:w-8 data-[panel-group-direction=vertical]:-mt-0.5">
          <div className="w-0.5 h-4 bg-muted-foreground/30 data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-4" />
        </div>
      )}
    </PanelResizeHandle>
  );
};