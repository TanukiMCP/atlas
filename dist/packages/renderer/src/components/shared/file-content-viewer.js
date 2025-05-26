"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileContentViewer = void 0;
const react_1 = __importStar(require("react"));
const file_service_1 = require("../../services/file-service");
const FileContentViewer = ({ selectedFile, isVisible, onClose }) => {
    const [content, setContent] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedContent, setEditedContent] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (selectedFile && selectedFile.type === 'file') {
            loadFileContent();
        }
    }, [selectedFile]);
    const loadFileContent = async () => {
        if (!selectedFile)
            return;
        setIsLoading(true);
        try {
            const fileContent = await file_service_1.fileService.readFile(selectedFile.path);
            setContent(fileContent);
            setEditedContent(fileContent.content);
        }
        catch (error) {
            console.error('Failed to load file content:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        if (!selectedFile || !content)
            return;
        try {
            await file_service_1.fileService.writeFile(selectedFile.path, editedContent);
            setContent({ ...content, content: editedContent });
            setIsEditing(false);
        }
        catch (error) {
            console.error('Failed to save file:', error);
        }
    };
    const getLanguageFromExtension = (extension) => {
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
    if (!isVisible || !selectedFile)
        return null;
    return (<div style={{
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
          {selectedFile.type === 'file' && content && (<>
              {isEditing ? (<>
                  <button onClick={handleSave} className="btn btn-primary btn-sm" style={{ fontSize: '12px' }}>
                    💾 Save
                  </button>
                  <button onClick={() => {
                    setIsEditing(false);
                    setEditedContent(content.content);
                }} className="btn btn-sm" style={{ fontSize: '12px' }}>
                    Cancel
                  </button>
                </>) : (<button onClick={() => setIsEditing(true)} className="btn btn-sm" style={{ fontSize: '12px' }}>
                  ✏️ Edit
                </button>)}
            </>)}
          
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--color-text-muted)'
        }}>
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
        {isLoading ? (<div style={{
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
            }}/>
              Loading file content...
            </div>
          </div>) : selectedFile.type === 'directory' ? (<div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '16px'
            }}>
            📁 Directory selected - choose a file to view content
          </div>) : content ? (<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              {isEditing ? (<textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} style={{
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
                }}/>) : (<pre style={{
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
                </pre>)}
            </div>
          </div>) : (<div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)'
            }}>
            Failed to load file content
          </div>)}
      </div>
    </div>);
};
exports.FileContentViewer = FileContentViewer;
//# sourceMappingURL=file-content-viewer.js.map