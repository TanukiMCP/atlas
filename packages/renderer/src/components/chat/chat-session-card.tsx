import React from 'react';
import { ChatSession } from '../../types/chat-types';

interface ChatSessionCardProps {
  session: ChatSession;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onExport: () => void;
}

export const ChatSessionCard: React.FC<ChatSessionCardProps> = ({
  session,
  isSelected,
  isCurrent,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
  onArchive,
  onExport
}) => {
  return (
    <div 
      className={`chat-session-card p-3 border rounded-lg cursor-pointer transition-colors ${
        isCurrent 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : isSelected
          ? 'border-gray-400 bg-gray-50 dark:bg-gray-700'
          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onOpen}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              onClick={(e) => e.stopPropagation()}
              className="rounded"
            />
            <h4 className="font-medium truncate">{session.title}</h4>
          </div>
          
          {session.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {session.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
            <span>{session.metadata.createdAt.toLocaleDateString()}</span>
            <span>•</span>
            <span>{session.messages.length} messages</span>
            <span>•</span>
            <span className="capitalize">{session.metadata.subjectMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};