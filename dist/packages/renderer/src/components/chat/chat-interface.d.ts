import React from 'react';
interface ChatInterfaceProps {
    onAtSymbolTrigger?: (event: React.KeyboardEvent, position: {
        x: number;
        y: number;
    }) => void;
    operationalMode?: 'agent' | 'chat';
}
export interface ChatInterfaceHandle {
    insertText: (text: string) => void;
}
export declare const ChatInterface: React.ForwardRefExoticComponent<ChatInterfaceProps & React.RefAttributes<ChatInterfaceHandle>>;
export {};
//# sourceMappingURL=chat-interface.d.ts.map