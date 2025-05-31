import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "../../lib/utils";
import React from "react";

export const ResizablePanelGroup = PanelGroup;
export const ResizablePanel = Panel;

interface ResizableHandleProps extends React.ComponentProps<typeof PanelResizeHandle> {
  className?: string;
}

export const ResizableHandle = ({ className, ...props }: ResizableHandleProps) => {
  return (
    <PanelResizeHandle
      className={cn(
        "bg-border/70 transition-colors hover:bg-primary active:bg-primary/90",
        "w-0.5 h-full cursor-col-resize data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
        "z-10",
        className
      )}
      {...props}
    />
  );
};