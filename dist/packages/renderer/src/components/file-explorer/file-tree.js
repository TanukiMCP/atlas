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
exports.FileExplorer = void 0;
const react_1 = __importStar(require("react"));
const file_service_1 = require("../../services/file-service");
const FileExplorer = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = (0, react_1.useState)('src/App.tsx');
    const [expandedFolders, setExpandedFolders] = (0, react_1.useState)(new Set(['src', 'src/components']));
    const [fileStructure, setFileStructure] = (0, react_1.useState)([]);
    const [loadedDirectories, setLoadedDirectories] = (0, react_1.useState)(new Map());
    // Load root directory on mount
    (0, react_1.useEffect)(() => {
        loadDirectory('');
    }, []);
    const loadDirectory = async (path) => {
        try {
            const files = await file_service_1.fileService.listDirectory(path);
            if (path === '') {
                setFileStructure(files);
            }
            setLoadedDirectories(prev => new Map(prev).set(path, files));
        }
        catch (error) {
            console.error('Failed to load directory:', error);
        }
    };
    const handleFileClick = async (item) => {
        if (item.type === 'file') {
            setSelectedFile(item.path);
            onFileSelect?.(item);
            console.log('File selected:', item.path);
        }
        else {
            // Toggle folder expansion
            const newExpanded = new Set(expandedFolders);
            if (expandedFolders.has(item.path)) {
                newExpanded.delete(item.path);
            }
            else {
                newExpanded.add(item.path);
                // Load directory contents if not already loaded
                if (!loadedDirectories.has(item.path)) {
                    await loadDirectory(item.path);
                }
            }
            setExpandedFolders(newExpanded);
        }
    };
    const getFileIcon = (item) => {
        if (item.type === 'directory') {
            return expandedFolders.has(item.path) ? '📂' : '📁';
        }
        if (item.extension === 'tsx' || item.extension === 'ts')
            return '⚛️';
        if (item.extension === 'json')
            return '⚙️';
        if (item.extension === 'md')
            return '📝';
        if (item.extension === 'css')
            return '🎨';
        return '📄';
    };
    const renderFileItem = (item, level = 0) => {
        const isSelected = selectedFile === item.path;
        const isExpanded = expandedFolders.has(item.path);
        const children = loadedDirectories.get(item.path) || [];
        return (<div key={item.path}>
        <div className={`file-item ${item.type} ${isSelected ? 'selected' : ''}`} style={{ paddingLeft: `${level * 24 + 12}px` }} onClick={() => handleFileClick(item)}>
          <span style={{
                fontSize: '14px',
                color: item.type === 'directory'
                    ? 'var(--color-accent-secondary)'
                    : item.extension === 'tsx' || item.extension === 'ts'
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)'
            }}>
            {getFileIcon(item)}
          </span>
          <span>{item.name}</span>
          {item.type === 'file' && item.size && (<span style={{
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                    marginLeft: 'auto',
                    opacity: 0.7
                }}>
              {(item.size / 1024).toFixed(1)}KB
            </span>)}
        </div>
        
        {item.type === 'directory' && isExpanded && children.length > 0 && (<div>
            {children.map(child => renderFileItem(child, level + 1))}
          </div>)}
      </div>);
    };
    return (<div className="file-explorer">
      <div className="file-tree custom-scrollbar">
        {fileStructure.map(item => renderFileItem(item))}
      </div>
      {selectedFile && (<div style={{
                padding: '12px',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-tertiary)',
                fontSize: '12px',
                color: 'var(--color-text-muted)'
            }}>
          Selected: {selectedFile}
        </div>)}
    </div>);
};
exports.FileExplorer = FileExplorer;
//# sourceMappingURL=file-tree.js.map