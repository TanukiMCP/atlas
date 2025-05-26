"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileContentViewer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
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
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
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
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '20px' }, children: selectedFile.type === 'directory' ? '📁' : '📄' }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: 'var(--color-text-primary)'
                                        }, children: selectedFile.name }), (0, jsx_runtime_1.jsx)("div", { style: {
                                            fontSize: '12px',
                                            color: 'var(--color-text-muted)',
                                            fontFamily: 'monospace'
                                        }, children: selectedFile.path })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' }, children: [selectedFile.type === 'file' && content && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isEditing ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "btn btn-primary btn-sm", style: { fontSize: '12px' }, children: "\uD83D\uDCBE Save" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                setIsEditing(false);
                                                setEditedContent(content.content);
                                            }, className: "btn btn-sm", style: { fontSize: '12px' }, children: "Cancel" })] })) : ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIsEditing(true), className: "btn btn-sm", style: { fontSize: '12px' }, children: "\u270F\uFE0F Edit" })) })), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, style: {
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-muted)'
                                }, children: "\u00D7" })] })] }), (0, jsx_runtime_1.jsx)("div", { style: {
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }, children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { style: {
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                    }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid var(--color-accent)',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                } }), "Loading file content..."] }) })) : selectedFile.type === 'directory' ? ((0, jsx_runtime_1.jsx)("div", { style: {
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: '16px'
                    }, children: "\uD83D\uDCC1 Directory selected - choose a file to view content" })) : content ? ((0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                padding: '8px 16px',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderBottom: '1px solid var(--color-border)',
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Size: ", (content.size / 1024).toFixed(2), " KB | Encoding: ", content.encoding, " | Language: ", getLanguageFromExtension(selectedFile.extension)] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Modified: ", content.lastModified.toLocaleString()] })] }), (0, jsx_runtime_1.jsx)("div", { style: { flex: 1, overflow: 'auto' }, children: isEditing ? ((0, jsx_runtime_1.jsx)("textarea", { value: editedContent, onChange: (e) => setEditedContent(e.target.value), style: {
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
                                } })) : ((0, jsx_runtime_1.jsx)("pre", { style: {
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
                                }, children: content.content })) })] })) : ((0, jsx_runtime_1.jsx)("div", { style: {
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                    }, children: "Failed to load file content" })) })] }));
};
exports.FileContentViewer = FileContentViewer;
//# sourceMappingURL=file-content-viewer-old.js.map