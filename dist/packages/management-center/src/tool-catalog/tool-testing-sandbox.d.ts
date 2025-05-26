import React from 'react';
interface Tool {
    id: string;
    name: string;
    description: string;
}
interface ToolTestingSandboxProps {
    tool: Tool;
    isOpen: boolean;
    onClose: () => void;
    onTest: (tool: Tool) => void;
}
export declare const ToolTestingSandbox: React.FC<ToolTestingSandboxProps>;
export {};
//# sourceMappingURL=tool-testing-sandbox.d.ts.map