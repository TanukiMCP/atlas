import React, { useState } from 'react';
import { ChatSession } from '../../types/chat-types';
import { useChatHistory } from '../../hooks/use-chat-history';

export const ChatHistoryManager: React.FC = () => {
  const {
    sessions,
    currentSession,
    createSession,
    updateSession,
    deleteSession,
    archiveSession,
    exportSession
  } = useChatHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchived = showArchived || !session.metadata.isArchived;
    return matchesSearch && matchesArchived;
  });

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleBulkArchive = (sessionIds: string[]) => {
    sessionIds.forEach(id => archiveSession(id));
    setSelectedSessions([]);
  };

  const handleBulkDelete = (sessionIds: string[]) => {
    sessionIds.forEach(id => deleteSession(id));
    setSelectedSessions([]);
  };

  const handleBulkExport = (sessionIds: string[]) => {
    sessionIds.forEach(id => exportSession(id));
    setSelectedSessions([]);
  };

  const openSession = (sessionId: string) => {
    console.log('Open session:', sessionId);
  };

  const editSession = (session: ChatSession) => {
    console.log('Edit session:', session);
  };

  return (
    <div className="chat-history-manager p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat History</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your conversation sessions</p>
        </div>
        <button
          onClick={() => createSession({ title: 'New Session', description: '' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Session
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Show archived</span>
        </label>
      </div>

      {/* Session List */}
      <div className="space-y-2">
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedSessions.includes(session.id)}
                  onChange={() => toggleSessionSelection(session.id)}
                  className="rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{session.title}</h3>
                  {session.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{session.description}</p>
                  )}
                  <p className="text-xs text-gray-500">{new Date(session.metadata.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openSession(session.id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => editSession(session)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No sessions found matching your criteria.</p>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedSessions.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSessions.length} session(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkExport(selectedSessions)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => handleBulkArchive(selectedSessions)}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkDelete(selectedSessions)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};