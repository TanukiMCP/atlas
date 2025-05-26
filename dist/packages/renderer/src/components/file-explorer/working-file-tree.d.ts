import React from 'react';
interface FileItem {
    name: string;
    type: 'file' | 'directory';
    icon: string;
    children?: FileItem[];
    size?: string;
}
interface WorkingFileTreeProps {
    onFileSelect?: (file: FileItem) => void;
}
export declare const WorkingFileTree: React.FC<WorkingFileTreeProps>;
export {};
//# sourceMappingURL=working-file-tree.d.ts.map