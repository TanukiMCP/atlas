import React, { useEffect, useState } from 'react';
import { IDELayout } from './components/ide/ide-layout';

declare global {
  interface Window {
    electronAPI?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing TanukiMCP Atlas IDE...');
      
      if (!window.electronAPI) {
        console.warn('⚠️ Electron API not available - running in browser mode');
      } else {
        try {
          const health = await window.electronAPI.invoke('db:health');
          console.log('📊 Database health:', health);
        } catch (dbError) {
          console.warn('Database connection failed, continuing in offline mode');
        }
        
        await loadUserPreferences();
      }
      
      setIsReady(true);
      console.log('✅ TanukiMCP Atlas IDE initialized');
    } catch (err) {
      console.error('❌ Failed to initialize app:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };  const loadUserPreferences = async () => {
    try {
      if (window.electronAPI) {
        const userTheme = await window.electronAPI.invoke('settings:get', 'app.theme');
        if (userTheme) {
          setTheme(userTheme);
        }
      }
    } catch (err) {
      console.warn('Failed to load user preferences:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 TanukiMCP Atlas Error</h1>
          <p className="text-gray-700 mb-4">Failed to initialize the application:</p>
          <code className="bg-gray-100 p-2 rounded block mb-4">{error}</code>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">TanukiMCP Atlas</h2>
          <p className="text-gray-600">Initializing AI-powered IDE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <IDELayout />
    </div>
  );
}

export default App;