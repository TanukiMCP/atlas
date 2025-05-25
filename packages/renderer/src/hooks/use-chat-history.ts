// Chat history management hook for TanukiMCP Atlas
import { useState, useCallback } from 'react';
import { ChatSession, ChatSearchFilters } from '../types/chat-types';

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback((sessionData: Partial<ChatSession>) => {
    const newSession: ChatSession = {
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

  const updateSession = useCallback((id: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, metadata: { ...session.metadata, updatedAt: new Date() } }
        : session
    ));
    
    if (currentSession?.id === id) {
      setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentSession]);  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  const archiveSession = useCallback((id: string) => {
    updateSession(id, { metadata: { isArchived: true } } as any);
  }, [updateSession]);

  const searchSessions = useCallback((filters: ChatSearchFilters) => {
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

  const exportSession = useCallback((id: string) => {
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

  const importSession = useCallback((file: File) => {
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