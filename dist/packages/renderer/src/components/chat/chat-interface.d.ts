import React from 'react';
interface ChatInterfaceProps {
    onAtSymbolTrigger?: (event: React.KeyboardEvent, position: {
        x: number;
        y: number;
    }) => void;
    operationalMode?: 'agent' | 'chat';
}
export declare const ChatInterface: React.FC<ChatInterfaceProps>;
export {};
//# sourceMappingURL=chat-interface.d.ts.map