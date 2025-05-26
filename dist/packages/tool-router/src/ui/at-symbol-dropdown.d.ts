import React from 'react';
import { UnifiedTool, ToolExecutionContext } from '../types/tool-router-types';
interface AtSymbolDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onToolSelect: (tool: UnifiedTool, parameters?: any) => void;
    context: ToolExecutionContext;
    position: {
        x: number;
        y: number;
    };
    initialQuery?: string;
    toolRouter: any;
}
export declare const AtSymbolDropdown: React.FC<AtSymbolDropdownProps>;
export {};
//# sourceMappingURL=at-symbol-dropdown.d.ts.map