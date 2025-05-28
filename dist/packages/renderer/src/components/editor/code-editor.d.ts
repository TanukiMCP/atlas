import React from 'react';
import { FileNode } from '../../stores/app-store';
interface CodeEditorProps {
    selectedFile: FileNode | null;
    onClose: () => void;
    onSave?: (filePath: string, content: string) => void;
}
export declare const CodeEditor: React.FC<CodeEditorProps>;
export {};
//# sourceMappingURL=code-editor.d.ts.map