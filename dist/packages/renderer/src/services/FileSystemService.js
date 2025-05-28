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
class FileSystemService {
    watchers = new Map();
    listeners = new Set();
    async getWorkspaceFiles(rootPath = process.cwd()) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const path = await Promise.resolve().then(() => __importStar(require('path')));
            const readDirectory = async (dirPath, relativePath = '') => {
                const items = [];
                try {
                    const entries = await fs.readdir(dirPath, { withFileTypes: true });
                    for (const entry of entries) {
                        // Skip hidden files and node_modules
                        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                            continue;
                        }
                        const fullPath = path.join(dirPath, entry.name);
                        const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
                        if (entry.isDirectory()) {
                            const children = await readDirectory(fullPath, itemPath);
                            items.push({
                                name: entry.name,
                                type: 'folder',
                                path: itemPath,
                                children: children.length > 0 ? children : undefined
                            });
                        }
                        else {
                            items.push({
                                name: entry.name,
                                type: 'file',
                                path: itemPath
                            });
                        }
                    }
                }
                catch (error) {
                    console.error(`Error reading directory ${dirPath}:`, error);
                }
                return items.sort((a, b) => {
                    // Folders first, then files, alphabetically
                    if (a.type === 'folder' && b.type === 'file')
                        return -1;
                    if (a.type === 'file' && b.type === 'folder')
                        return 1;
                    return a.name.localeCompare(b.name);
                });
            };
            return await readDirectory(rootPath);
        }
        catch (error) {
            console.error('Error accessing file system:', error);
            return this.getFallbackFileStructure();
        }
    }
    async readFile(filePath) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const fullPath = this.resolvePath(filePath);
            return await fs.readFile(fullPath, 'utf-8');
        }
        catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error}`);
        }
    }
    async writeFile(filePath, content) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const path = await Promise.resolve().then(() => __importStar(require('path')));
            const fullPath = this.resolvePath(filePath);
            // Ensure directory exists
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, content, 'utf-8');
            this.notifyListeners();
        }
        catch (error) {
            throw new Error(`Failed to write file ${filePath}: ${error}`);
        }
    }
    async createFile(filePath, content = '') {
        await this.writeFile(filePath, content);
    }
    async createDirectory(dirPath) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const fullPath = this.resolvePath(dirPath);
            await fs.mkdir(fullPath, { recursive: true });
            this.notifyListeners();
        }
        catch (error) {
            throw new Error(`Failed to create directory ${dirPath}: ${error}`);
        }
    }
    async deleteFile(filePath) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const fullPath = this.resolvePath(filePath);
            await fs.unlink(fullPath);
            this.notifyListeners();
        }
        catch (error) {
            throw new Error(`Failed to delete file ${filePath}: ${error}`);
        }
    }
    async deleteDirectory(dirPath) {
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const fullPath = this.resolvePath(dirPath);
            await fs.rmdir(fullPath, { recursive: true });
            this.notifyListeners();
        }
        catch (error) {
            throw new Error(`Failed to delete directory ${dirPath}: ${error}`);
        }
    }
    watchWorkspace(rootPath = process.cwd()) {
        if (this.watchers.has(rootPath)) {
            return; // Already watching
        }
        try {
            const fs = require('fs');
            const watcher = fs.watch(rootPath, { recursive: true }, (eventType, filename) => {
                if (filename && !filename.startsWith('.') && filename !== 'node_modules') {
                    this.notifyListeners();
                }
            });
            this.watchers.set(rootPath, watcher);
        }
        catch (error) {
            console.error(`Failed to watch directory ${rootPath}:`, error);
        }
    }
    stopWatching(rootPath) {
        const watcher = this.watchers.get(rootPath);
        if (watcher) {
            watcher.close();
            this.watchers.delete(rootPath);
        }
    }
    onFilesChanged(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    resolvePath(filePath) {
        const path = require('path');
        if (path.isAbsolute(filePath)) {
            return filePath;
        }
        return path.join(process.cwd(), filePath);
    }
    async notifyListeners() {
        const files = await this.getWorkspaceFiles();
        this.listeners.forEach(listener => listener(files));
    }
    getFallbackFileStructure() {
        // Fallback structure when file system access fails
        return [
            {
                name: 'package.json',
                type: 'file',
                path: 'package.json'
            },
            {
                name: 'src',
                type: 'folder',
                path: 'src',
                children: [
                    {
                        name: 'App.tsx',
                        type: 'file',
                        path: 'src/App.tsx'
                    },
                    {
                        name: 'main.tsx',
                        type: 'file',
                        path: 'src/main.tsx'
                    },
                    {
                        name: 'components',
                        type: 'folder',
                        path: 'src/components',
                        children: [
                            { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx' },
                            { name: 'FileExplorer.tsx', type: 'file', path: 'src/components/FileExplorer.tsx' }
                        ]
                    }
                ]
            }
        ];
    }
}
exports.default = new FileSystemService();
//# sourceMappingURL=FileSystemService.js.map