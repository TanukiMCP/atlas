# Task Management - Core System

## 📋 Task Management Interface

```typescript
interface TaskManagement {
  create_todolist(params: {
    request: string;
    context?: {
      projectPath?: string;
      existingFiles?: string[];
      previousTodolists?: string[];
    };
    complexity?: 'simple' | 'medium' | 'complex';
    estimateTime?: boolean;
  }): Promise<{
    todolist: TodoList;
    estimatedTime?: number;
    dependencies?: TaskDependency[];
    suggestions?: string[];
  }>;

  find_next_task(params: {
    todolistPath: string;
    consideredDependencies?: boolean;
    skipBlocked?: boolean;
  }): Promise<{
    task?: Task;
    reason?: string;
    blockedTasks?: Task[];
    completionPercentage: number;
  }>;

  execute_task(params: {
    task: Task;
    context: {
      todolistPath: string;
      projectPath: string;
      previousResults?: TaskResult[];
    };
    dryRun?: boolean;
  }): Promise<{
    result: TaskResult;
    changes?: FileChange[];
    nextSuggestedTask?: Task;
    issues?: TaskIssue[];
  }>;
}
```

## 📊 Task Data Structures

```typescript
interface TodoList {
  id: string;
  title: string;
  description: string;
  phases: TodoPhase[];
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
  estimatedTotalTime: number;
  actualTimeSpent: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
}

interface Task {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  complexity: TaskComplexity;
  estimatedTime: number;
  actualTime?: number;
  dependencies: string[];
  assignedTools: string[];
  result?: TaskResult;
}
```