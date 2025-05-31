export type ViewType = 'chat' | 'models' | 'editor' | 'tools' | 'workflows' | 'settings';

export interface FileSystemItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
  modified: Date;
  size: number;
}

export interface TanukiModel {
  id: string;
  name: string;
  provider: 'openrouter' | 'ollama';
  contextSize: number;
  description: string;
  strengths: string[];
  weaknesses: string[];
  hardwareRequirements?: {
    minRAM: number;
    minVRAM: number;
    minCPUCores: number;
    minGPUCores?: number;
  };
} 