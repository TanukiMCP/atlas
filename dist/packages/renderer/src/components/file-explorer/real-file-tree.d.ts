import React from 'react';
interface FileItem {
    name: string;
    type: 'file' | 'directory';
    path: string;
    children?: FileItem[];
    size?: number;
    modified?: Date;
}
interface RealFileTreeProps {
    onFileSelect?: (file: FileItem) => void;
    rootPath?: string;
}
export declare const RealFileTree: React.FC<RealFileTreeProps>;
export {};
//# sourceMappingURL=real-file-tree.d.ts.map