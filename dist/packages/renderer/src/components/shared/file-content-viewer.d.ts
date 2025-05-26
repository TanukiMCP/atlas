import React from 'react';
import { FileInfo } from '../../services/file-service';
interface FileContentViewerProps {
    selectedFile: FileInfo | null;
    isVisible: boolean;
    onClose: () => void;
}
export declare const FileContentViewer: React.FC<FileContentViewerProps>;
export {};
//# sourceMappingURL=file-content-viewer.d.ts.map