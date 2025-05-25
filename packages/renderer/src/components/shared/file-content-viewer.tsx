import React, { useState, useEffect } from 'react';
import { fileService, FileInfo, FileContent } from '../../services/file-service';

interface FileContentViewerProps {
  selectedFile: FileInfo | null;
  isVisible: boolean;
  onClose: () => void;
}

export const FileContentViewer: React.FC<FileContentViewerProps> = ({
  selectedFile,
  isVisible,
  onClose
}) => {
  const [content, setContent] = useState<FileContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      loadFileContent();
    }
  }, [selectedFile]);

  const loadFileContent = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      const fileContent = await fileService.readFile(selectedFile.path);
      setContent(fileContent);
      setEditedContent(fileContent.content);
    } catch (error) {
      console.error('Failed to load file content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !content) return;
    
    try {
      await fileService.writeFile(selectedFile.path, editedContent);
      setContent({ ...content, content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const getLanguageFromExtension = (extension?: string) => {
    switch (extension) {
      case 'tsx':
      case 'ts': return 'typescript';
      case 'js':
      case 'jsx': return 'javascript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'html': return 'html';
      default: return 'text';
    }
  };

  if (!isVisible || !selectedFile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '80%',
      backgroundColor: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>
            {selectedFile.type === 'directory' ? '📁' : '📄'}
          </span>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              {selectedFile.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              fontFamily: 'monospace'
            }}>
              {selectedFile.path}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {selectedFile.type === 'file' && content && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(content.content);
                    }}
                    className="btn btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm"
                  style={{ fontSize: '12px' }}
                >
                  ✏️ Edit
                </button>
              )}
            </>
          )}
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isLoading ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--color-accent)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Loading file content...
            </div>
          </div>
        ) : selectedFile.type === 'directory' ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '16px'
          }}>
            📁 Directory selected - choose a file to view content
          </div>
        ) : content ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* File Info Bar */}
            <div style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                Size: {(content.size / 1024).toFixed(2)} KB | 
                Encoding: {content.encoding} |
                Language: {getLanguageFromExtension(selectedFile.extension)}
              </div>
              <div>
                Modified: {content.lastModified.toLocaleString()}
              </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '16px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'Monaco, Menlo, Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              ) : (
                <pre style={{
                  margin: 0,
                  padding: '16px',
                  fontFamily: 'Monaco, Menlo, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {content.content}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)'
          }}>
            Failed to load file content
          </div>
        )}
      </div>
    </div>
  );
};