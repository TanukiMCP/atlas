import React from 'react';
import { MCPTool } from '../../services/mcp-service';
interface ToolSelectorProps {
    isOpen: boolean;
    position: {
        x: number;
        y: number;
    };
    operationalMode: 'agent' | 'chat';
    onToolSelect: (tool: MCPTool) => void;
    onClose: () => void;
}
export declare const ToolSelector: React.FC<ToolSelectorProps>;
export {};
//# sourceMappingURL=tool-selector-old.d.ts.map