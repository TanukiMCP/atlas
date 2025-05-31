export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'built-in' | 'external';
  server?: string;
  isConnected?: boolean;
}

export interface ToolServer {
  id: string;
  name: string;
  url: string;
  tools: Tool[];
  isConnected: boolean;
} 