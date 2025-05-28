import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Editor from '@monaco-editor/react';
import { 
  Save, 
  X, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface CodeEditorProps {
  fileName: string;
  onClose: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ fileName, onClose }) => {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getFileLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
      'py': 'python'
    };
    return languageMap[ext] || 'typescript';
  };

  const getMockFileContent = (fileName: string): string => {
    const contentMap: { [key: string]: string } = {
      'App.tsx': `import React, { useEffect, useState } from 'react';
import { LoadingScreen } from './components/shared/loading-screen';
import { PrimaryMenuBar } from './components/toolbar/PrimaryMenuBar';
import { ContextualToolbar } from './components/toolbar/ContextualToolbar';
import { EnhancedChatInterface } from './components/chat/EnhancedChatInterface';
import { useTheme } from './hooks/useTheme';
import { useViewStore } from './stores/viewStore';

function App() {
  const [isReady, setIsReady] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentView, setView } = useViewStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🚀 TanukiMCP Atlas initialized');
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingScreen message="Initializing AI-powered IDE..." />;
  }

  return (
    <div className={\`app \${theme} h-screen flex flex-col\`}>
      <PrimaryMenuBar onThemeToggle={toggleTheme} theme={theme} />
      <ContextualToolbar currentView={currentView} />
      <div className="flex-1">
        <EnhancedChatInterface />
      </div>
    </div>
  );
}

export default App;`,
      'main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      'CodeEditor.tsx': `import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  fileName: string;
  onClose: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ fileName, onClose }) => {
  const [content, setContent] = useState('');
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex items-center justify-between">
        <span>{fileName}</span>
        <Button onClick={onClose} size="sm">Close</Button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language="typescript"
          value={content}
          onChange={(value) => setContent(value || '')}
          theme="vs-dark"
        />
      </div>
    </div>
  );
};`
    };
    
    return contentMap[fileName] || `// ${fileName}
// This file is currently empty
// Add your content here

console.log('Loading ${fileName}...');`;
  };

  useEffect(() => {
    const mockContent = getMockFileContent(fileName);
    setContent(mockContent);
    setOriginalContent(mockContent);
  }, [fileName]);

  const isDirty = content !== originalContent;

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    setOriginalContent(content);
    setIsSaving(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (isDirty) {
          handleSave();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, onClose]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Editor Header */}
      <div className="h-12 bg-muted/30 border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{fileName}</span>
          <Badge variant="outline" className="text-xs capitalize">
            {getFileLanguage(fileName)}
          </Badge>
          {isDirty && (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-xs text-orange-600 dark:text-orange-400">
                Unsaved changes
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            size="sm"
            className="gap-1"
          >
            <Save className="w-3 h-3" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <X className="w-3 h-3" />
            Close
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getFileLanguage(fileName)}
          value={content}
          onChange={(value) => setContent(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            rulers: [80, 120],
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            bracketMatching: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            mouseWheelZoom: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-muted/20 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {content.split('\n').length}</span>
          <span>Characters: {content.length}</span>
          <span>Language: {getFileLanguage(fileName)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ctrl+S to save • Esc to close</span>
        </div>
      </div>
    </div>
  );
};