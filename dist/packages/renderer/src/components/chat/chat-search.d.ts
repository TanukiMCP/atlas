import React from 'react';
import { ChatSearchFilters } from '../../types/chat-types';
interface ChatSearchProps {
    query: string;
    onQueryChange: (query: string) => void;
    onAdvancedSearch: (filters: ChatSearchFilters) => void;
}
export declare const ChatSearch: React.FC<ChatSearchProps>;
export {};
//# sourceMappingURL=chat-search.d.ts.map