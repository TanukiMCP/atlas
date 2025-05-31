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
        "relative flex items-center justify-center bg-border/70 transition-colors hover:bg-primary active:bg-primary/90",
        "w-2 h-full cursor-col-resize data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
        "z-10", // Ensure the handle is above other content
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="absolute z-10 flex items-center justify-center rounded-sm border border-border bg-background hover:bg-accent group-hover:bg-accent transition-colors shadow-sm"
             style={{
               width: "4px",
               height: "24px",
               left: "50%",
               top: "50%",
               transform: "translate(-50%, -50%)"
             }}
             data-panel-group-direction="horizontal">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="w-0.5 h-4 bg-muted-foreground/40" />
            <div className="w-0.5 h-4 bg-muted-foreground/40" />
          </div>
        </div>
      )}
      
      {withHandle && (
        <div className="absolute z-10 flex items-center justify-center rounded-sm border border-border bg-background hover:bg-accent group-hover:bg-accent transition-colors shadow-sm"
             style={{
               width: "24px",
               height: "4px",
               left: "50%",
               top: "50%",
               transform: "translate(-50%, -50%)"
             }}
             data-panel-group-direction="vertical">
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="w-4 h-0.5 bg-muted-foreground/40" />
            <div className="w-4 h-0.5 bg-muted-foreground/40" />
          </div>
        </div>
      )}
    </PanelResizeHandle>
  );
};