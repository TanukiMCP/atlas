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
export declare const ChatSessionCard: React.FC<ChatSessionCardProps>;
export {};
//# sourceMappingURL=chat-session-card.d.ts.map