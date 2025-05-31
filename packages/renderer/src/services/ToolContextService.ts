import type { MCPTool } from '../types/index';
import { generateSystemPromptWithToolContext, generateClearThoughtContext } from '../utils/tool-context-generator';
import { ToolSettings } from '../components/settings/ToolSettings';
import { ToolCall } from '../components/chat/ToolCallApprovalPanel';
import { eventBus } from './event-bus';

export interface FileDiff {
  operation: 'create' | 'update' | 'delete';
  filePath: string;
  previousContent?: string;
  newContent?: string;
  changes?: {
    lineNumber: number;
    type: 'add' | 'remove' | 'unchanged';
    content: string;
  }[];
}

export interface ToolContext {
  availableTools: MCPTool[];
  systemPrompt: string;
}

class ToolContextService {
  private pendingToolCalls: Map<string, ToolCall> = new Map();
  private pendingFileDiffs: Map<string, FileDiff> = new Map();
  private settings: ToolSettings = {
    approvalMode: 'auto',
    selectiveTools: [],
    showToolContext: true,
    visualDiffing: true,
    diffingAnimationSpeed: 'normal',
    clearThoughtReasoning: true
  };

  constructor() {
    this.loadSettings();
    
    // Subscribe to settings changes
    eventBus.on('settings:updated', (updatedSettings: Partial<ToolSettings>) => {
      this.settings = { ...this.settings, ...updatedSettings };
      this.saveSettings();
    });
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('tool_settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load tool settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('tool_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save tool settings:', error);
    }
  }

  /**
   * Update tool settings
   */
  updateSettings(newSettings: Partial<ToolSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    eventBus.emit('settings:updated', this.settings);
  }

  /**
   * Get current tool settings
   */
  getSettings(): ToolSettings {
    return { ...this.settings };
  }

  /**
   * Generate enhanced system prompt with tool context
   */
  generateEnhancedSystemPrompt(basePrompt: string, tools: MCPTool[]): string {
    if (!this.settings.showToolContext) {
      return basePrompt;
    }

    let enhancedPrompt = basePrompt;

    // Add tool context for all tools, including Clear Thought tools
    enhancedPrompt = generateSystemPromptWithToolContext(enhancedPrompt, tools, this.settings.clearThoughtReasoning); // Pass clearThoughtReasoning to control detail level if needed

    return enhancedPrompt;
  }

  /**
   * Check if a tool execution requires approval
   */
  requiresApproval(toolName: string): boolean {
    if (this.settings.approvalMode === 'auto') {
      return false;
    }

    if (this.settings.approvalMode === 'manual') {
      return true;
    }

    // Selective mode
    return this.settings.selectiveTools.includes(toolName);
  }

  /**
   * Register a tool call for approval
   */
  registerToolCall(toolCall: ToolCall): string {
    const callId = toolCall.id || `tool-call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // If the tool doesn't require approval, mark it as approved immediately
    if (!this.requiresApproval(toolCall.toolName)) {
      toolCall.status = 'approved';
    } else {
      toolCall.status = 'pending';
      this.pendingToolCalls.set(callId, toolCall);
      eventBus.emit('tool:pending-approval', toolCall);
    }
    
    return callId;
  }

  /**
   * Approve a pending tool call
   */
  approveToolCall(callId: string): ToolCall | null {
    const toolCall = this.pendingToolCalls.get(callId);
    if (!toolCall) {
      return null;
    }
    
    toolCall.status = 'approved';
    this.pendingToolCalls.delete(callId);
    eventBus.emit('tool:approved', toolCall);
    
    return toolCall;
  }

  /**
   * Reject a pending tool call
   */
  rejectToolCall(callId: string): ToolCall | null {
    const toolCall = this.pendingToolCalls.get(callId);
    if (!toolCall) {
      return null;
    }
    
    toolCall.status = 'rejected';
    this.pendingToolCalls.delete(callId);
    eventBus.emit('tool:rejected', toolCall);
    
    return toolCall;
  }

  /**
   * Get all pending tool calls
   */
  getPendingToolCalls(): ToolCall[] {
    return Array.from(this.pendingToolCalls.values());
  }

  /**
   * Register a file diff for approval
   */
  registerFileDiff(diff: FileDiff): string {
    const diffId = `diff-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    if (this.settings.visualDiffing) {
      this.pendingFileDiffs.set(diffId, diff);
      eventBus.emit('diff:pending-approval', { id: diffId, diff });
    }
    
    return diffId;
  }

  /**
   * Approve a pending file diff
   */
  approveFileDiff(diffId: string): FileDiff | null {
    const diff = this.pendingFileDiffs.get(diffId);
    if (!diff) {
      return null;
    }
    
    this.pendingFileDiffs.delete(diffId);
    eventBus.emit('diff:approved', { id: diffId, diff });
    
    return diff;
  }

  /**
   * Reject a pending file diff
   */
  rejectFileDiff(diffId: string): FileDiff | null {
    const diff = this.pendingFileDiffs.get(diffId);
    if (!diff) {
      return null;
    }
    
    this.pendingFileDiffs.delete(diffId);
    eventBus.emit('diff:rejected', { id: diffId, diff });
    
    return diff;
  }

  /**
   * Get all pending file diffs
   */
  getPendingFileDiffs(): { id: string, diff: FileDiff }[] {
    return Array.from(this.pendingFileDiffs.entries()).map(([id, diff]) => ({ id, diff }));
  }
}

export const toolContextService = new ToolContextService(); 