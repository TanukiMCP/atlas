"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const react_2 = __importDefault(require("@monaco-editor/react"));
const lucide_react_1 = require("lucide-react");
const CodeEditor = ({ fileName, onClose }) => {
    const [content, setContent] = (0, react_1.useState)('');
    const [originalContent, setOriginalContent] = (0, react_1.useState)('');
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const getFileLanguage = (fileName) => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const languageMap = {
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
    const getMockFileContent = (fileName) => {
        const contentMap = {
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col bg-background", children: [(0, jsx_runtime_1.jsxs)("div", { className: "h-12 bg-muted/30 border-b border-border px-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4 text-blue-500" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: fileName }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs capitalize", children: getFileLanguage(fileName) }), isDirty && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-orange-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-orange-600 dark:text-orange-400", children: "Unsaved changes" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleSave, disabled: !isDirty || isSaving, size: "sm", className: "gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-3 h-3" }), isSaving ? 'Saving...' : 'Save'] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onClose, variant: "ghost", size: "sm", className: "gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3" }), "Close"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(react_2.default, { height: "100%", language: getFileLanguage(fileName), value: content, onChange: (value) => setContent(value || ''), theme: "vs-dark", options: {
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
                    } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "h-6 bg-muted/20 border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Lines: ", content.split('\n').length] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Characters: ", content.length] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Language: ", getFileLanguage(fileName)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4", children: (0, jsx_runtime_1.jsx)("span", { children: "Ctrl+S to save \u2022 Esc to close" }) })] })] }));
};
exports.CodeEditor = CodeEditor;
//# sourceMappingURL=CodeEditor.js.map