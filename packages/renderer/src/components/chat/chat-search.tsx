import React from 'react';
import { ChatSearchFilters } from '../../types/chat-types';

interface ChatSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onAdvancedSearch: (filters: ChatSearchFilters) => void;
}

export const ChatSearch: React.FC<ChatSearchProps> = ({
  query,
  onQueryChange,
  onAdvancedSearch
}) => {
  return (
    <div className="chat-search">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search chats..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};