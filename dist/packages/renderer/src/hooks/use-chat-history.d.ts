import { ChatSession, ChatSearchFilters } from '../types/chat-types';
export declare const useChatHistory: () => {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    isLoading: boolean;
    createSession: (sessionData: Partial<ChatSession>) => ChatSession;
    updateSession: (id: string, updates: Partial<ChatSession>) => void;
    deleteSession: (id: string) => void;
    archiveSession: (id: string) => void;
    searchSessions: (filters: ChatSearchFilters) => ChatSession[];
    exportSession: (id: string) => void;
    importSession: (file: File) => void;
    setCurrentSession: import("react").Dispatch<import("react").SetStateAction<ChatSession | null>>;
};
//# sourceMappingURL=use-chat-history.d.ts.map