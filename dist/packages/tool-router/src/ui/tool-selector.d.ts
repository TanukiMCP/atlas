import React from 'react';
import { UnifiedTool } from '../types/tool-router-types';
interface ToolSelectorProps {
    tool: UnifiedTool;
    isSelected: boolean;
    onClick: () => void;
    onHover: () => void;
    showUsageStats?: boolean;
}
export declare const ToolSelector: React.FC<ToolSelectorProps>;
export {};
//# sourceMappingURL=tool-selector.d.ts.map