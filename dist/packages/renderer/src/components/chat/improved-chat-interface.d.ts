import React from 'react';
interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}
interface ImprovedChatInterfaceProps {
    onAtSymbolTrigger?: (event: React.KeyboardEvent, position: {
        x: number;
        y: number;
    }) => void;
    operationalMode?: 'agent' | 'chat';
}
export interface ImprovedChatInterfaceHandle {
    insertText: (text: string) => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}
export declare const ImprovedChatInterface: React.ForwardRefExoticComponent<ImprovedChatInterfaceProps & React.RefAttributes<ImprovedChatInterfaceHandle>>;
export {};
//# sourceMappingURL=improved-chat-interface.d.ts.map