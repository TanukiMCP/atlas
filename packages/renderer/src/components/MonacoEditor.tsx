import React, { useRef, useEffect, useState } from 'react';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  theme?: 'vs-dark' | 'vs-light';
  readOnly?: boolean;
  height?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onSave,
  theme = 'vs-dark',
  readOnly = false,
  height = '400px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [monaco, setMonaco] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMonaco = async () => {
      try {
        // Try to load Monaco Editor
        const monacoModule = await import('monaco-editor');
        
        if (!isMounted) return;

        setMonaco(monacoModule);
        
        // Configure Monaco for the web
        if (typeof window !== 'undefined') {
          // Set up worker URLs for web workers
          (window as any).MonacoEnvironment = {
            getWorkerUrl: function (moduleId: string, label: string) {
              if (label === 'json') {
                return './json.worker.js';
              }
              if (label === 'css' || label === 'scss' || label === 'less') {
                return './css.worker.js';
              }
              if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return './html.worker.js';
              }
              if (label === 'typescript' || label === 'javascript') {
                return './ts.worker.js';
              }
              return './editor.worker.js';
            }
          };
        }

        if (editorRef.current && isMounted) {
          const editorInstance = monacoModule.editor.create(editorRef.current, {
            value,
            language,
            theme,
            readOnly,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnlyMessage: { value: 'Editor is in read-only mode' },
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'always'
            }
          });

          // Set up change listener
          if (onChange) {
            editorInstance.onDidChangeModelContent(() => {
              const currentValue = editorInstance.getValue();
              onChange(currentValue);
            });
          }

          // Set up save shortcut
          if (onSave) {
            editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyS, () => {
              const currentValue = editorInstance.getValue();
              onSave(currentValue);
            });
          }

          setEditor(editorInstance);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load Monaco Editor:', err);
        setError('Failed to load code editor. Using fallback textarea.');
        setIsLoading(false);
      }
    };

    loadMonaco();

    return () => {
      isMounted = false;
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [editor, value]);

  // Update editor theme when prop changes
  useEffect(() => {
    if (monaco && editor) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, editor, theme]);

  // Update editor language when prop changes
  useEffect(() => {
    if (monaco && editor) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [monaco, editor, language]);

  if (error) {
    // Fallback textarea when Monaco fails to load
    return (
      <div className="w-full" style={{ height }}>
        <div className="mb-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-2">
          ⚠️ {error}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              onSave?.(value);
            }
          }}
          className="w-full h-full font-mono text-sm bg-gray-900 text-gray-100 border border-gray-600 rounded p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your code here..."
          readOnly={readOnly}
          style={{ height: `calc(${height} - 60px)` }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div>Loading Monaco Editor...</div>
          </div>
        </div>
      )}
      <div
        ref={editorRef}
        className="w-full h-full"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default MonacoEditor; 