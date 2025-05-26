/**
 * TanukiMCP Atlas - Prompt List Panel
 * Searchable tree view of all system prompts
 */
import React from 'react';
import { SystemPrompt, PromptSearchFilters, PromptSearchResult } from '../../types/prompt-types';
interface PromptListPanelProps {
    prompts: SystemPrompt[];
    selectedPrompt: SystemPrompt | null;
    onSearch: (filters: PromptSearchFilters) => void;
    facets?: PromptSearchResult['facets'];
}
export declare const PromptListPanel: React.FC<PromptListPanelProps>;
export {};
//# sourceMappingURL=prompt-list-panel.d.ts.map