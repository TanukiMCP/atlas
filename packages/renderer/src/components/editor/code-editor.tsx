import React, { useState, useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
import { FileNode } from '../../stores/app-store';
import { fileService } from '../../services/file-service';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Save, X, FileText, AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  selectedFile: FileNode | null;
  onClose: () => void;
  onSave?: (filePath: string, content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  selectedFile,
  onClose,
  onSave
}) => {
  const [content, setContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      loadFileContent();
    }
  }, [selectedFile]);

  useEffect(() => {
    setIsDirty(content !== originalContent);
  }, [content, originalContent]);

  const loadFileContent = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fileContent = await fileService.readFile(selectedFile.path);
      setContent(fileContent);
      setOriginalContent(fileContent);
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file content');
      setContent('');
      setOriginalContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !isDirty) return;
    
    setSaving(true);
    try {
      await fileService.writeFile(selectedFile.path, content);
      setOriginalContent(content);
      setIsDirty(false);
      onSave?.(selectedFile.path, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getFileLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'ini': 'ini',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell'
    };
    return languageMap[extension] || 'plaintext';
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No file selected</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  if (selectedFile.type === 'folder') {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Directory selected</p>
          <p className="text-sm">Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-sm">{selectedFile.name}</span>
          {isDirty && <span className="text-orange-500 text-xs">●</span>}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getFileLanguage(selectedFile.name)}
            </Badge>
            {selectedFile.size && (
              <Badge variant="outline" className="text-xs">
                {formatFileSize(selectedFile.size)}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8"
            >
              <Save className="h-3 w-3 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading file content...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading File</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button variant="outline" onClick={loadFileContent}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 bg-gray-900 text-white font-mono text-sm">
            <div className="mb-4 text-green-400">
              🚀 Monaco Editor will be loaded here
            </div>
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        )}
      </div>
    </div>
  );
};