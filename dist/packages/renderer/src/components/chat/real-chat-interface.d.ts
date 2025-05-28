/**
 * Real Chat Interface with Ollama LLM Integration
 * Replaces mock responses with actual streaming LLM communication
 */
import React from 'react';
interface RealChatInterfaceProps {
    onAtSymbolTrigger?: (event: React.KeyboardEvent, position: {
        x: number;
        y: number;
    }) => void;
}
export declare const RealChatInterface: React.FC<RealChatInterfaceProps>;
export {};
//# sourceMappingURL=real-chat-interface.d.ts.map