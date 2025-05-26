import React, { useState, useEffect } from 'react';
import { FileNode } from '../../stores/app-store';
import { fileService } from '../../services/file-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { X, File, Folder, Download, Copy } from 'lucide-react';

interface FileContentViewerProps {
  isVisible: boolean;
  selectedFile: FileNode | null;
  onClose: () => void;
}

export const FileContentViewer: React.FC<FileContentViewerProps> = ({
  isVisible,
  selectedFile,
  onClose
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && selectedFile && selectedFile.type === 'file') {
      loadFileContent();
    }
  }, [isVisible, selectedFile]);

  const loadFileContent = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fileContent = await fileService.readFile(selectedFile.path);
      setContent(fileContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file content');
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getLanguageFromExtension = (ext: string) => {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript', 
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'json': 'json',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown',
      'html': 'html'
    };
    return langMap[ext] || 'text';
  };

  const copyToClipboard = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!selectedFile) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedFile.type === 'directory' ? (
                <Folder className="h-5 w-5 text-blue-500" />
              ) : (
                <File className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {selectedFile.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {selectedFile.type}
                  </Badge>
                  {selectedFile.size && (
                    <Badge variant="outline" className="text-xs">
                      {formatFileSize(selectedFile.size)}
                    </Badge>
                  )}
                  {selectedFile.type === 'file' && (
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFromExtension(getFileExtension(selectedFile.name))}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedFile.type === 'file' && content && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {selectedFile.type === 'directory' ? (
            <div className="p-6 text-center">
              <Folder className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Directory</h3>
              <p className="text-muted-foreground">
                This is a directory. Use the file tree to explore its contents.
              </p>
            </div>
          ) : loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading file content...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading File</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                onClick={loadFileContent}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words">
                {content || 'File is empty'}
              </pre>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};