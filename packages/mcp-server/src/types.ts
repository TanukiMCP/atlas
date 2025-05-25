export interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  metadata?: {
    executionTime?: number;
    toolsUsed?: string[];
    [key: string]: any;
  };
}

export interface SubjectMode {
  id: string;
  name: string;
  description: string;
  enabledTools: string[];
  prompts: SubjectPrompts;
  context: SubjectContext;
}

export interface SubjectPrompts {
  systemPrompt: string;
  exampleQueries: string[];
  helpText: string;
}

export interface SubjectContext {
  specializations: string[];
  tools: string[];
  [key: string]: any;
}

export interface FileOperationOptions {
  createDirs?: boolean;
  encoding?: string;
  backup?: boolean;
  validatePath?: boolean;
}export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  estimatedTime?: number;
  tags?: string[];
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoList {
  id: string;
  title: string;
  description?: string;
  projectPath?: string;
  tasks: TaskItem[];
  metadata: {
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    estimatedTotalTime: number;
    actualTimeSpent: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface MathSolution {
  equation: string;
  solution: any;
  steps?: string[];
  variables: string[];
  format: 'text' | 'latex' | 'ascii';
}

export interface PlotData {
  x: number[];
  y: number[];
  type: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export interface SecurityContext {
  allowedPaths: string[];
  deniedPaths: string[];
  maxFileSize: number;
  allowedOperations: string[];
  sandboxMode: boolean;
}