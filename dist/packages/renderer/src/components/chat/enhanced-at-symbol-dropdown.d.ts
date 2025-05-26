/**
 * Enhanced @ Symbol Dropdown with Custom Workflow Support
 * Extends the base tool selector to include saved workflows
 */
import React from 'react';
import { UnifiedTool, ToolExecutionContext } from '@tanukimcp/tool-router';
import { WorkflowTemplate } from '../../types/workflow-types';
import { WorkflowGenerationService } from '../../services/workflow-generation/workflow-generation-service';
interface EnhancedAtSymbolDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onToolSelect: (tool: UnifiedTool, parameters?: any) => void;
    onWorkflowSelect: (workflow: WorkflowTemplate, parameters?: any) => void;
    context: ToolExecutionContext;
    position: {
        x: number;
        y: number;
    };
    initialQuery?: string;
    toolRouter: any;
    workflowService: WorkflowGenerationService;
}
export declare const EnhancedAtSymbolDropdown: React.FC<EnhancedAtSymbolDropdownProps>;
export {};
//# sourceMappingURL=enhanced-at-symbol-dropdown.d.ts.map