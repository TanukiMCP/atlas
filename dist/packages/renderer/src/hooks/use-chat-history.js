"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatHistory = void 0;
// Chat history management hook for TanukiMCP Atlas
const react_1 = require("react");
const useChatHistory = () => {
    const [sessions, setSessions] = (0, react_1.useState)([]);
    const [currentSession, setCurrentSession] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const createSession = (0, react_1.useCallback)((sessionData) => {
        const newSession = {
            id: crypto.randomUUID(),
            title: sessionData.title || 'New Chat',
            description: sessionData.description,
            messages: [],
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                tags: sessionData.metadata?.tags || [],
                subjectMode: sessionData.metadata?.subjectMode || 'general',
                isArchived: false,
                isFavorite: false,
                workflowId: sessionData.metadata?.workflowId
            },
            settings: {
                model: 'gpt-4',
                temperature: 0.7,
                maxTokens: 2048,
                systemPrompt: sessionData.settings?.systemPrompt
            }
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        return newSession;
    }, []);
    const updateSession = (0, react_1.useCallback)((id, updates) => {
        setSessions(prev => prev.map(session => session.id === id
            ? { ...session, ...updates, metadata: { ...session.metadata, updatedAt: new Date() } }
            : session));
        if (currentSession?.id === id) {
            setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
        }
    }, [currentSession]);
    const deleteSession = (0, react_1.useCallback)((id) => {
        setSessions(prev => prev.filter(session => session.id !== id));
        if (currentSession?.id === id) {
            setCurrentSession(null);
        }
    }, [currentSession]);
    const archiveSession = (0, react_1.useCallback)((id) => {
        updateSession(id, { metadata: { isArchived: true } });
    }, [updateSession]);
    const searchSessions = (0, react_1.useCallback)((filters) => {
        return sessions.filter(session => {
            if (filters.query && !session.title.toLowerCase().includes(filters.query.toLowerCase())) {
                return false;
            }
            if (filters.subjectMode && session.metadata.subjectMode !== filters.subjectMode) {
                return false;
            }
            if (filters.isArchived !== undefined && session.metadata.isArchived !== filters.isArchived) {
                return false;
            }
            return true;
        });
    }, [sessions]);
    const exportSession = (0, react_1.useCallback)((id) => {
        const session = sessions.find(s => s.id === id);
        if (session) {
            const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${session.title}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }, [sessions]);
    const importSession = (0, react_1.useCallback)((file) => {
        // Implementation for importing sessions
        console.log('Import session:', file);
    }, []);
    return {
        sessions,
        currentSession,
        isLoading,
        createSession,
        updateSession,
        deleteSession,
        archiveSession,
        searchSessions,
        exportSession,
        importSession,
        setCurrentSession
    };
};
exports.useChatHistory = useChatHistory;
//# sourceMappingURL=use-chat-history.js.map