import React, { useEffect, useState } from 'react';
import { ModernIDELayout } from './components/ide/modern-ide-layout';
import { LoadingScreen } from './components/shared/loading-screen';
import { useTheme } from './stores/app-store';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

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
  };

  const loadUserPreferences = async () => {
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
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-tanuki-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            🚨 TanukiMCP Atlas Error
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Failed to initialize the application:
          </p>
          <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block mb-4 text-sm">
            {error}
          </code>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-tanuki-500 text-white rounded-lg hover:bg-tanuki-600 transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return <LoadingScreen message="Initializing AI-powered IDE..." />;
  }

  return (
    <div className={`app ${theme} h-screen flex flex-col font-sans`}>
      <ModernIDELayout />
    </div>
  );
}

export default App;