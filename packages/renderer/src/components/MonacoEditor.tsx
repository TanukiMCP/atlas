import React, { useRef, useEffect, useState } from 'react';
import { Save, Trash2, ChevronDown, RefreshCw, Check, Edit2 } from 'lucide-react';

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  filePath?: string;
  theme?: 'vs-dark' | 'vs-light';
  readOnly?: boolean;
  height?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  onSave,
  onDelete,
  onRename,
  filePath,
  theme = 'vs-dark',
  readOnly = false,
  height = '400px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [monaco, setMonaco] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

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
              setIsModified(true);
              // Reset save success indicator when content changes
              setSaveSuccess(false);
            });
          }

          // Set up keyboard shortcuts
          if (onSave) {
            // Add Ctrl+S / Cmd+S shortcut
            editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyS, () => {
              handleSave();
            });
          }
          
          // Add additional standard shortcuts
          // Ctrl+X - Cut
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyX, () => {
            document.execCommand('cut');
          });
          
          // Ctrl+C - Copy
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyC, () => {
            document.execCommand('copy');
          });
          
          // Ctrl+V - Paste
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyV, () => {
            document.execCommand('paste');
          });
          
          // Ctrl+Z - Undo
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyZ, () => {
            editorInstance.trigger('keyboard', 'undo', null);
          });
          
          // Ctrl+Y - Redo
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyY, () => {
            editorInstance.trigger('keyboard', 'redo', null);
          });
          
          // Ctrl+F - Find
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyF, () => {
            editorInstance.trigger('keyboard', 'actions.find', null);
          });
          
          // Ctrl+H - Replace
          editorInstance.addCommand(monacoModule.KeyMod.CtrlCmd | monacoModule.KeyCode.KeyH, () => {
            editorInstance.trigger('keyboard', 'editor.action.startFindReplaceAction', null);
          });

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
      setIsModified(false);
      setSaveSuccess(false);
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

  // Hide save success indicator after 2 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (saveSuccess) {
      timeout = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [saveSuccess]);

  // Focus rename input when renaming starts
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [isRenaming]);

  // Initialize filename when starting to rename
  useEffect(() => {
    if (isRenaming && filePath) {
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      setNewFileName(fileName);
    }
  }, [isRenaming, filePath]);

  const handleSave = async () => {
    if (onSave && editor) {
      const currentValue = editor.getValue();
      setIsSaving(true);
      try {
        await onSave(currentValue);
        setIsModified(false);
        setSaveSuccess(true);
      } catch (error) {
        console.error('Save failed:', error);
        // Could add error notification here
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      // Confirm deletion
      if (window.confirm('Are you sure you want to delete this file?')) {
        onDelete();
      }
    }
  };

  const startRenaming = () => {
    if (!onRename || !filePath) return;
    setIsRenaming(true);
  };

  const submitRename = async () => {
    if (!onRename || !filePath || !newFileName.trim()) {
      cancelRename();
      return;
    }

    try {
      // Get the current filename and path
      const pathParts = filePath.split('/');
      const currentFilename = pathParts[pathParts.length - 1];
      
      // Only proceed if the name actually changed
      if (currentFilename !== newFileName && newFileName.trim()) {
        await onRename(newFileName.trim());
      }
    } catch (error) {
      console.error('Rename failed:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setNewFileName('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  };

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
    <div className="flex flex-col w-full h-full border border-border rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between bg-card border-b border-border px-3 py-2">
        <div className="flex items-center space-x-2 text-sm overflow-hidden">
          {filePath && !isRenaming && (
            <div className="flex items-center text-muted-foreground truncate max-w-md">
              <span className="truncate">{filePath}</span>
              {isModified && (
                <span className="ml-2 text-yellow-500 text-xs font-medium">
                  (modified)
                </span>
              )}
            </div>
          )}
          {isRenaming && (
            <div className="flex items-center gap-2">
              <input
                ref={renameInputRef}
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={cancelRename}
                className="px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={submitRename}
                className="p-1 text-primary hover:text-primary/90 hover:bg-primary/10 rounded"
                title="Confirm rename"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {saveSuccess && (
            <div className="flex items-center text-xs text-green-500 mr-2">
              <Check size={14} className="mr-1" />
              <span>Saved</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={readOnly || isSaving || !isModified}
            className={`p-1.5 rounded-md text-sm font-medium flex items-center 
              ${readOnly || !isModified 
                ? 'opacity-50 cursor-not-allowed text-muted-foreground' 
                : 'text-primary hover:bg-primary/10 hover:text-primary-foreground'}
            `}
            title="Save (Ctrl+S)"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>
          
          {onRename && !isRenaming && (
            <button
              onClick={startRenaming}
              disabled={readOnly}
              className={`p-1.5 rounded-md text-sm font-medium flex items-center 
                ${readOnly ? 'opacity-50 cursor-not-allowed text-muted-foreground' : 'text-primary hover:bg-primary/10 hover:text-primary-foreground'}
              `}
              title="Rename file"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={readOnly}
              className={`p-1.5 rounded-md text-sm font-medium flex items-center 
                ${readOnly ? 'opacity-50 cursor-not-allowed text-muted-foreground' : 'text-destructive hover:bg-destructive/10 hover:text-destructive'}
              `}
              title="Delete file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card text-foreground">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-sm">Loading Monaco Editor...</div>
            </div>
          </div>
        )}
        <div
          ref={editorRef}
          className="w-full h-full"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default MonacoEditor; 